import { SourceEvidenceRowV1, type SourceEvidenceRowV1 as Row } from "@/lib/contracts/source-evidence-v1";
import { brandKey } from "@/lib/contracts/hashes";
import type { RunAssessment, Signal, ValidationProfile } from "./thresholds";

export type AssessInput = {
  rows: unknown[];
  profile: ValidationProfile;
  /** Business facts hash of the last trusted snapshot, when one exists. */
  previousFactsHash?: string;
  currentFactsHash?: string;
};

// Deterministic trust decision. Structural validity and semantic invariants
// are separate: the broken demo output must pass structure and fail semantics.
export function assessRun(input: AssessInput): RunAssessment {
  const { rows, profile } = input;

  const parseResult = SourceEvidenceRowV1.array().safeParse(rows);
  const structuralValid = parseResult.success;
  const typedRows: Row[] = structuralValid ? parseResult.data : [];
  const signals: Signal[] = [];

  if (!structuralValid) {
    signals.push({
      name: "schema",
      severity: "blocking",
      expected: "every row passes SourceEvidenceRowV1",
      observed: "schema invalid",
      message: "Structural validation failed against SourceEvidenceRowV1.",
    });
  }

  if (typedRows.length === 0) {
    signals.push({
      name: "record_count",
      severity: "blocking",
      expected: profile.expected_min_records,
      observed: 0,
      message: "Dataset is empty or contains no valid rows.",
    });
    return finalize({
      classification: "UNTRUSTED_OBSERVATION",
      publish_allowed: false,
      structural_valid: structuralValid,
      signals,
      failed_checks: signals.filter((s) => s.severity !== "info").map((s) => s.name),
      record_count: 0,
      ranks: [],
    });
  }

  const ranks = typedRows.map((r) => r.rank).sort((a, b) => a - b);

  // Record count hard invariant.
  if (typedRows.length < profile.expected_min_records) {
    signals.push({
      name: "record_count",
      severity: "blocking",
      expected: profile.expected_min_records,
      observed: typedRows.length,
      message: `Record count ${typedRows.length} below hard minimum ${profile.expected_min_records} (ratio ${pct(typedRows.length, profile.expected_min_records)}%).`,
    });
  }

  // Required-field completeness (trimmed, non-empty).
  const emptyRequired = typedRows.filter((row) =>
    profile.required_fields.some(
      (field) => !String(row[field as keyof Row] ?? "").trim(),
    ),
  ).length;
  const completeness = 100 - pct(emptyRequired, typedRows.length);
  const completenessSeverity = severityFor(
    completeness,
    profile.completeness_trusted,
    profile.completeness_warning,
  );
  if (completenessSeverity) {
    signals.push({
      name: "required_field_completeness",
      severity: completenessSeverity,
      expected: `>= ${profile.completeness_trusted}%`,
      observed: `${completeness}%`,
      message: `${emptyRequired} rows have empty required fields.`,
    });
  }

  // Evidence coverage.
  const missingEvidence = typedRows.filter((row) => !row.evidence_text.trim()).length;
  const coverage = 100 - pct(missingEvidence, typedRows.length);
  const coverageSeverity = severityFor(coverage, profile.evidence_coverage_trusted, profile.evidence_coverage_warning);
  if (coverageSeverity) {
    signals.push({
      name: "evidence_coverage",
      severity: coverageSeverity,
      expected: `>= ${profile.evidence_coverage_trusted}%`,
      observed: `${coverage}%`,
      message: `${missingEvidence} rows lack evidence text.`,
    });
  }

  // Duplicate brands.
  const brandCounts = new Map<string, number>();
  for (const row of typedRows) {
    const key = brandKey(row.brand);
    brandCounts.set(key, (brandCounts.get(key) ?? 0) + 1);
  }
  const duplicateBrands = [...brandCounts.values()].filter((n) => n > 1).length;
  const duplicateBrandRate = pct(duplicateBrands, typedRows.length);
  if (duplicateBrands > 0) {
    signals.push({
      name: "duplicate_brands",
      severity: duplicateBrandRate > profile.duplicate_brand_quarantine ? "blocking" : "warning",
      expected: 0,
      observed: duplicateBrands,
      message: `${duplicateBrands} brand keys appear more than once.`,
    });
  }

  // Ordered-rank invariants.
  if (profile.ordered) {
    const duplicates = ranks.length - new Set(ranks).size;
    if (duplicates > 0) {
      signals.push({
        name: "duplicate_ranks",
        severity: "blocking",
        expected: 0,
        observed: duplicates,
        message: `${duplicates} duplicate rank values.`,
      });
    }
    if (ranks[0] !== profile.expected_rank_start) {
      signals.push({
        name: "rank_start",
        severity: "blocking",
        expected: profile.expected_rank_start,
        observed: ranks[0],
        message: `Ordered source begins at rank ${ranks[0]} instead of ${profile.expected_rank_start}.`,
      });
    }
    // Gaps are measured against the expected sequence (1..N), not just the
    // observed range, so a broken run starting at rank 4 reports 1-3 missing.
    const expectedRanks = new Set(
      Array.from(
        { length: profile.expected_min_records },
        (_, i) => profile.expected_rank_start + i,
      ),
    );
    const missing: number[] = [];
    for (const expected of expectedRanks) {
      if (!ranks.includes(expected)) missing.push(expected);
    }
    if (missing.length > 0) {
      signals.push({
        name: "missing_ranks",
        severity: "blocking",
        expected: 0,
        observed: missing.join(", "),
        message: `Ranks missing from the expected sequence: ${missing.join(", ")}.`,
      });
    }
  }

  const hasFailure = signals.some((s) => s.severity === "blocking" || s.severity === "warning");
  const factsChanged =
    input.previousFactsHash !== undefined &&
    input.currentFactsHash !== undefined &&
    input.previousFactsHash !== input.currentFactsHash;

  return finalize({
    classification: hasFailure ? "UNTRUSTED_OBSERVATION" : factsChanged ? "TRUSTED_SOURCE_CHANGE" : "NO_CHANGE",
    publish_allowed: !hasFailure,
    structural_valid: structuralValid,
    signals,
    failed_checks: signals.filter((s) => s.severity !== "info").map((s) => s.name),
    record_count: typedRows.length,
    ranks,
  });
}

function severityFor(value: number, trusted: number, warning: number): "info" | "warning" | "blocking" | null {
  if (value >= trusted) return null;
  if (value >= warning) return "warning";
  return "blocking";
}

function pct(part: number, whole: number): number {
  return Math.round((part / whole) * 100);
}

function finalize(assessment: RunAssessment): RunAssessment {
  return assessment;
}
