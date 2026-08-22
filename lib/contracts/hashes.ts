import { createHash } from "node:crypto";
import type { SourceEvidenceRowV1 } from "./source-evidence-v1";

// Business facts hash: SHA-256 of rows sorted by brand key, covering the
// business-meaningful fields only — run metadata is excluded so the same
// facts always hash identically (baseline vs healed must match exactly).
export function businessFactsHash(rows: SourceEvidenceRowV1[]): string {
  const normalized = rows
    .map((row) => ({
      brand_key: brandKey(row.brand),
      rank: row.rank,
      claim: row.claim.trim().replace(/\s+/g, " "),
      evidence_text: row.evidence_text.trim().replace(/\s+/g, " "),
      features: row.features.map((f) => f.trim()).sort(),
      outbound_url: row.outbound_url,
    }))
    .sort((a, b) => a.brand_key.localeCompare(b.brand_key));
  return sha256(canonicalJson(normalized));
}

// Observed shape hash: sorted runtime field paths and value types.
export function observedShapeHash(rows: Record<string, unknown>[]): string {
  const shape = rows.map((row) => {
    const entries = Object.keys(row)
      .filter((key) => key !== "input")
      .sort()
      .map((key) => {
        const value = row[key];
        const type =
          value === null
            ? "null"
            : Array.isArray(value)
              ? "array"
              : typeof value;
        return `${key}:${type}`;
      });
    return entries.join("|");
  }).sort();
  return sha256(canonicalJson(shape));
}

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function brandKey(brand: string): string {
  return brand
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\p{P}\p{S}]/gu, "")
    .replace(/\s+/g, "-")
    .trim();
}

function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_key, val) =>
    val === undefined ? null : val,
  );
}
