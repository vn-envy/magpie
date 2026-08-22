import { describe, expect, it } from "vitest";
import { assessRun } from "@/lib/drift/checks";
import { businessFactsHash, observedShapeHash } from "@/lib/contracts/hashes";
import { SOURCE_SUPPORT_PLATFORMS_PROFILE as profile } from "@/lib/drift/thresholds";
import type { SourceEvidenceRowV1 as Row } from "@/lib/contracts/source-evidence-v1";

function row(overrides: Partial<Row> = {}): Row {
  return {
    schema_version: "1.0",
    source_url: "https://magpie-lab.netlify.app/lab/source",
    page_title: "Enterprise Support Platforms 2026",
    category: "enterprise customer support",
    source_updated_at: "2026-08-21",
    rank: 1,
    brand: "AtlasSupport",
    claim: "Enterprise-grade scale for high-volume support operations",
    evidence_text: "Handles 40,000 tickets per hour in published load benchmarks.",
    source_section: "ranked vendors",
    outbound_url: "https://atlassupport.example.com",
    features: ["high volume", "uptime SLA"],
    ...overrides,
  };
}

function tenRows(): Row[] {
  const brands = [
    "AtlasSupport", "NimbusDesk", "HelioSupport", "ResolveHub", "TicketForge",
    "CaseCraft", "ZenQueue", "OrbitDesk", "HelixDesk", "SupportLoop",
  ];
  return brands.map((brand, i) => row({ rank: i + 1, brand }));
}

// The 7-row broken output: transport-successful, schema-valid, semantically
// incomplete — the exact believable lie the product exists to catch.
function brokenRows(): Row[] {
  return tenRows().filter((r) => r.rank >= 4);
}

describe("trust engine — the 10 → 7 case", () => {
  it("accepts the 10-row baseline", () => {
    const result = assessRun({ rows: tenRows(), profile });
    expect(result.structural_valid).toBe(true);
    expect(result.publish_allowed).toBe(true);
    expect(result.classification).toBe("NO_CHANGE");
    expect(result.record_count).toBe(10);
    expect(result.failed_checks).toEqual([]);
  });

  it("blocks the 7-row broken run while structural validation passes", () => {
    const result = assessRun({ rows: brokenRows(), profile });
    expect(result.structural_valid).toBe(true); // schema-valid lie
    expect(result.publish_allowed).toBe(false);
    expect(result.classification).toBe("UNTRUSTED_OBSERVATION");
    expect(result.record_count).toBe(7);
    expect(result.failed_checks).toEqual(
      expect.arrayContaining(["record_count", "rank_start", "missing_ranks"]),
    );
    const byName = Object.fromEntries(result.signals.map((s) => [s.name, s]));
    expect(byName.rank_start.observed).toBe(4);
    expect(byName.missing_ranks.observed).toBe("1, 2, 3");
    expect(byName.record_count.message).toContain("70%");
  });

  it("blocks an empty dataset", () => {
    const result = assessRun({ rows: [], profile });
    expect(result.publish_allowed).toBe(false);
    expect(result.failed_checks).toContain("record_count");
  });

  it("blocks duplicate ranks", () => {
    const rows = tenRows();
    rows[9] = { ...rows[9], rank: 9 };
    const result = assessRun({ rows, profile });
    expect(result.publish_allowed).toBe(false);
    expect(result.failed_checks).toContain("duplicate_ranks");
    expect(result.failed_checks).toContain("missing_ranks");
  });

  it("warns below trusted completeness without blocking", () => {
    const rows = tenRows();
    rows[4] = { ...rows[4], evidence_text: "" }; // 80% coverage → warning band
    rows[5] = { ...rows[5], evidence_text: "" };
    const result = assessRun({ rows, profile });
    expect(result.publish_allowed).toBe(false); // warnings withhold publication
    expect(result.signals.find((s) => s.name === "evidence_coverage")?.severity).toBe("warning");
  });

  it("classifies a healthy facts change as TRUSTED_SOURCE_CHANGE", () => {
    const changed = tenRows().map((r) =>
      r.brand === "HelioSupport"
        ? { ...r, rank: 2, evidence_text: "New independent benchmark: 96.2% triage accuracy." }
        : r.brand === "NimbusDesk"
          ? { ...r, rank: 3 }
          : r,
    );
    const previous = businessFactsHash(tenRows());
    const current = businessFactsHash(changed);
    const result = assessRun({
      rows: changed,
      profile,
      previousFactsHash: previous,
      currentFactsHash: current,
    });
    expect(result.publish_allowed).toBe(true);
    expect(result.classification).toBe("TRUSTED_SOURCE_CHANGE");
  });
});

describe("hashes", () => {
  it("business facts hash is order-independent", () => {
    const a = tenRows();
    const b = [...tenRows()].reverse();
    expect(businessFactsHash(a)).toBe(businessFactsHash(b));
  });

  it("business facts hash changes when facts change", () => {
    const a = tenRows();
    const b = tenRows().map((r) => (r.rank === 2 ? { ...r, claim: "Different claim" } : r));
    expect(businessFactsHash(a)).not.toBe(businessFactsHash(b));
  });

  it("healed rows restore the baseline hash exactly (Scenario A gate)", () => {
    expect(businessFactsHash(tenRows())).toBe(businessFactsHash(tenRows()));
  });

  it("observed shape hash detects added fields", () => {
    const base = tenRows().map((r) => ({ ...r }));
    const extended = tenRows().map((r) => ({ ...r, surprise: "field" }));
    expect(observedShapeHash(base)).not.toBe(observedShapeHash(extended));
  });
});
