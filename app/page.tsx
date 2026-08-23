import { BusinessFlow } from "@/components/business-flow";
import { MirrorScene } from "@/components/mirror-scene";
import { runSummaries } from "@/lib/replay/runs";
import { lineage, replaySession } from "@/lib/replay/session";
import { buildRecommendations } from "@/lib/insights/recommend";

export const dynamic = "force-dynamic";

export default function BusinessTab() {
  const verifiedRows = [...runSummaries.healed.rows].sort((a, b) => a.rank - b.rank);
  const tracked = verifiedRows.find((row) => row.brand === "NimbusDesk") ?? verifiedRows[0];
  const recommendations = buildRecommendations(tracked, verifiedRows);

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <section className="mb-6 text-center">
        <h1 className="font-dot text-4xl font-bold tracking-[0.2em] text-zinc-50">
          MAGPIE<span className="text-[#D71921]">.</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          The evidence-integrity layer for B2B GEO intelligence — it knows when your dashboard is
          lying.
        </p>
      </section>

      <section className="mb-8">
        <MirrorScene />
      </section>

      <BusinessFlow
        collectorId={lineage.collector_id}
        snapshotIds={lineage.snapshot_ids}
        factsHashPrefix={replaySession.snapshots.healed.facts_hash.slice(0, 12)}
        topTen={verifiedRows.map((row) => ({
          rank: row.rank,
          brand: row.brand,
          claim: row.claim,
          evidence_text: row.evidence_text,
          outbound_url: row.outbound_url,
        }))}
        brokenSummary={{
          recordCount: runSummaries.broken.assessment.record_count,
          ranks: runSummaries.broken.assessment.ranks,
          missing: [1, 2, 3],
          failedChecks: runSummaries.broken.assessment.failed_checks,
        }}
        recommendations={recommendations}
      />
    </main>
  );
}
