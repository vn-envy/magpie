import { z } from "zod";

// Structural contract for one Bright Data dataset row. Present-but-empty
// strings pass structural validation so semantic completeness checks can
// explain the failure instead of a bare schema error.
export const SourceEvidenceRowV1 = z.object({
  schema_version: z.literal("1.0"),
  source_url: z.string().url(),
  page_title: z.string(),
  category: z.string(),
  source_updated_at: z.string().nullable(),
  rank: z.number().int().positive(),
  brand: z.string(),
  claim: z.string(),
  evidence_text: z.string(),
  source_section: z.string(),
  outbound_url: z.string().url().nullable(),
  features: z.array(z.string()),
});

export type SourceEvidenceRowV1 = z.infer<typeof SourceEvidenceRowV1>;

// Bright Data system fields separated before strict row validation.
const BRIGHTDATA_SYSTEM_FIELDS = new Set([
  "input",
  "error",
  "error_code",
  "url",
  "timestamp",
]);

export function separateSystemFields(rows: unknown[]): {
  dataRows: unknown[];
  errorRows: unknown[];
} {
  const dataRows: unknown[] = [];
  const errorRows: unknown[] = [];
  for (const row of rows) {
    if (
      row &&
      typeof row === "object" &&
      "error_code" in (row as Record<string, unknown>)
    ) {
      errorRows.push(row);
    } else {
      dataRows.push(row);
    }
  }
  return { dataRows, errorRows };
}
