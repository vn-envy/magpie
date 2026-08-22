import "server-only";
import baselineRows from "@/artifacts/brightdata/baseline-output.json";
import brokenRows from "@/artifacts/brightdata/broken-output.json";
import healedRows from "@/artifacts/brightdata/healed-output.json";
import lineageJson from "@/artifacts/brightdata/lineage.json";
import { assessRun } from "@/lib/drift/checks";
import { businessFactsHash } from "@/lib/contracts/hashes";
import { SOURCE_SUPPORT_PLATFORMS_PROFILE as profile } from "@/lib/drift/thresholds";
import type { SourceEvidenceRowV1 } from "@/lib/contracts/source-evidence-v1";

export const lineage = lineageJson as {
  collector_id: string;
  snapshot_ids: { baseline: string; broken: string; healed: string };
  fixture_revisions: { baseline: number; broken: number; healed: number };
  captured_at: string | null;
  note?: string;
};

const baseline = baselineRows as SourceEvidenceRowV1[];
const broken = brokenRows as SourceEvidenceRowV1[];
const healed = healedRows as SourceEvidenceRowV1[];

const baselineFactsHash = businessFactsHash(baseline);

export const replaySession = {
  source: {
    id: "source_support_platforms",
    name: "Enterprise Support Platforms 2026",
    url: "https://magpie-lab.netlify.app/lab/source",
    category: "enterprise customer support",
    tracked_brand: "NimbusDesk",
  },
  collector_id: lineage.collector_id,
  snapshots: {
    baseline: {
      snapshot_id: lineage.snapshot_ids.baseline,
      fixture_revision: lineage.fixture_revisions.baseline,
      rows: baseline,
      assessment: assessRun({ rows: baseline, profile }),
      facts_hash: baselineFactsHash,
    },
    broken: {
      snapshot_id: lineage.snapshot_ids.broken,
      fixture_revision: lineage.fixture_revisions.broken,
      rows: broken,
      assessment: assessRun({ rows: broken, profile }),
      facts_hash: businessFactsHash(broken),
    },
    healed: {
      snapshot_id: lineage.snapshot_ids.healed,
      fixture_revision: lineage.fixture_revisions.healed,
      rows: healed,
      assessment: assessRun({
        rows: healed,
        profile,
        previousFactsHash: baselineFactsHash,
        currentFactsHash: businessFactsHash(healed),
      }),
      facts_hash: businessFactsHash(healed),
    },
  },
};

export type ReplaySession = typeof replaySession;

// The deterministic containment story: what the customer would have falsely
// concluded, and what Magpie did instead.
export const incidentStory = {
  prevented_conclusion:
    "NimbusDesk disappeared from the top three of Enterprise Support Platforms 2026.",
  actual_cause:
    "The collector lost the top three vendors when they moved into the featured carousel. The source facts never changed.",
  containment:
    "The run was quarantined and the last trusted snapshot kept powering the dashboard while the sensor was repaired.",
  recovered:
    "After Bright Data Self-Healing, the same Collector ID restored all ten rows with an identical business-facts hash.",
};
