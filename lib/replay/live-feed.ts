import "server-only";
import latest from "@/artifacts/live/latest.json";
import hnLatest from "@/artifacts/live/hn_front_page-latest.json";
import b2bLatest from "@/artifacts/live/b2b_source-latest.json";
import { assessRun } from "@/lib/drift/checks";
import { SOURCE_SUPPORT_PLATFORMS_PROFILE as profile } from "@/lib/drift/thresholds";
import type { SourceEvidenceRowV1 } from "@/lib/contracts/source-evidence-v1";

type LiveRun = {
  source: string | null;
  label: string | null;
  kind: string | null;
  collector_id: string | null;
  snapshot_id: string | null;
  target_url: string | null;
  captured_at: string | null;
  verdict: string;
  row_count: number;
  ranks_sequential?: boolean;
  brightdata_log?: { status?: string; lines?: number; success?: number; fails?: number };
  rows: Record<string, unknown>[];
};

// Live cron feed: refreshed by the hourly GitHub Action that triggers the
// collectors via POST /dca/trigger and commits results — the dashboard
// re-evaluates them through the trust engine on every deploy.
export const liveFeed = {
  updatedAt: (latest as { updatedAt: string | null }).updatedAt,
  hn: hnLatest as unknown as LiveRun,
  b2b: b2bLatest as unknown as LiveRun,
};

export const b2bLiveAssessment = assessRun({
  rows: liveFeed.b2b.rows ?? [],
  profile,
});

export type { LiveRun };
export type LiveRow = SourceEvidenceRowV1;
