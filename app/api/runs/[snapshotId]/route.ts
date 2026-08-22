import { NextRequest, NextResponse } from "next/server";
import { assessRun } from "@/lib/drift/checks";
import { separateSystemFields, SourceEvidenceRowV1 } from "@/lib/contracts/source-evidence-v1";
import { SOURCE_SUPPORT_PLATFORMS_PROFILE as profile } from "@/lib/drift/thresholds";

export const dynamic = "force-dynamic";

// Live status for a triggered run. Polls the Bright Data dataset endpoint
// once per request and runs the deterministic trust engine the moment rows
// arrive — the dashboard's verdict is computed in the product, not by the
// scraper.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ snapshotId: string }> },
) {
  const { snapshotId } = await params;
  const token = process.env.BRIGHT_DATA_API_TOKEN;
  if (!token) {
    return NextResponse.json({ phase: "error", error: "not_configured" });
  }

  const response = await fetch(`https://api.brightdata.com/dca/dataset?id=${snapshotId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) {
    return NextResponse.json({ phase: "error", error: `dataset_${response.status}` });
  }
  const dataset = await response.json();
  if (!Array.isArray(dataset)) {
    return NextResponse.json({ phase: "collecting" });
  }

  const { dataRows } = separateSystemFields(dataset);
  const assessment = assessRun({ rows: dataRows, profile });
  return NextResponse.json({
    phase: "done",
    verdict: assessment.publish_allowed
      ? assessment.classification === "TRUSTED_SOURCE_CHANGE"
        ? "TRUSTED_SOURCE_CHANGE"
        : "TRUSTED"
      : "QUARANTINED",
    publish_allowed: assessment.publish_allowed,
    classification: assessment.classification,
    record_count: assessment.record_count,
    ranks: assessment.ranks,
    failed_checks: assessment.failed_checks,
    rows: dataset
      .filter((row): row is SourceEvidenceRowV1 => typeof row === "object" && row !== null && "brand" in row)
      .map((row) => ({ rank: row.rank, brand: row.brand })),
  });
}
