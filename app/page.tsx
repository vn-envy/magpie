import { BusinessFlow } from "@/components/business-flow";
import { MirrorScene } from "@/components/mirror-scene";
import { UrlScanner } from "@/components/url-scanner";
import { LiveRun } from "@/components/live-run";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { liveFeed, b2bLiveAssessment } from "@/lib/replay/live-feed";
import { runSummaries } from "@/lib/replay/runs";
import { lineage, replaySession } from "@/lib/replay/session";
import { buildRecommendations } from "@/lib/insights/recommend";

export const dynamic = "force-dynamic";

function LiveSensors() {
  const hn = liveFeed.hn;
  const hnTop = [...(hn.rows ?? [])]
    .filter((row) => typeof row === "object" && row !== null && "title" in row)
    .sort((a, b) => (Number(a.rank) || 99) - (Number(b.rank) || 99))
    .slice(0, 3);
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex-1">LIVE SENSORS — UPDATED HOURLY BY CRON</span>
          <Badge variant="trusted" className="shrink-0">
            <span className="live-dot mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            ONLINE
          </Badge>
        </CardTitle>
        <p className="text-xs leading-5 text-zinc-500">
          A GitHub Actions cron triggers these collectors with plain Node every hour — the
          Collector ID is the production API. No deployment step.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-zinc-100">Hacker News front page</p>
            <p className="font-mono text-[11px] text-zinc-500">
              {hn.snapshot_id ? `${hn.snapshot_id} · public web` : "awaiting first cron"}
            </p>
          </div>
          <div className="mt-2 space-y-1">
            {hnTop.length > 0 ? (
              hnTop.map((row, i) => (
                <p key={i} className="truncate text-xs text-zinc-400">
                  <span className="mr-2 font-mono text-zinc-600">
                    {String(row.rank).padStart(2, "0")}
                  </span>
                  {String(row.title)}
                  <span className="ml-2 font-mono text-zinc-600">{String(row.points ?? "—")} pts</span>
                </p>
              ))
            ) : (
              <p className="font-mono text-xs text-zinc-600">first hourly run in progress…</p>
            )}
          </div>
        </div>
        <div className="border-t border-[#1c1c1f] pt-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-zinc-100">
              Real competitive landscape — live from the open-source market
            </p>
            <p className="font-mono text-[11px] text-zinc-500">
              {liveFeed.realCompetition.snapshot_id
                ? `${liveFeed.realCompetition.row_count} real products · ${liveFeed.realCompetition.verdict}`
                : "collector generating — first run soon"}
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(liveFeed.realCompetition.rows ?? [])
              .filter((row) => row && typeof row === "object" && "name" in row)
              .slice(0, 8)
              .map((row, i) => (
                <span
                  key={i}
                  className="rounded-[3px] border border-[#222] bg-[#111315] px-2 py-1 text-xs text-zinc-300"
                >
                  {String(row.name)}
                </span>
              ))}
            {(liveFeed.realCompetition.rows ?? []).length === 0 && (
              <p className="font-mono text-xs text-zinc-600">
                real products with licenses — extracted hourly from the public awesome-selfhosted catalog
              </p>
            )}
          </div>
        </div>
        <div className="border-t border-[#1c1c1f] pt-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-zinc-100">
              Enterprise Support Platforms 2026
            </p>
            <p className="font-mono text-[11px] text-zinc-500">
              {b2bLiveAssessment.publish_allowed ? "TRUSTED · PUBLISHED" : "BLOCKED"} ·{" "}
              {b2bLiveAssessment.record_count}/10 rows
            </p>
          </div>
          <p className="mt-1.5 text-xs text-zinc-500">
            The hourly result re-runs the deterministic trust engine on every deploy.
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-600">
          feed updated {liveFeed.updatedAt ? liveFeed.updatedAt.replace("T", " ").slice(0, 16) : "—"} UTC
        </p>
      </CardContent>
    </Card>
  );
}

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

      {/* DEMO PATH — deterministic replay of the genuine captured incident */}
      <section className="mb-3 flex items-center gap-3">
        <span className="rounded-[3px] border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-dot text-[11px] font-bold uppercase tracking-[0.16em] text-amber-300">
          Demo path
        </span>
        <span className="font-mono text-[11px] text-zinc-500">
          replay of genuine captured artifacts — baseline → lie → repair → verified recovery
        </span>
        <div className="h-px flex-1 bg-[#1c1c1f]" />
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

      {/* LIVE PATH — real runs, real web, real competition */}
      <section className="mt-10 mb-3 flex items-center gap-3">
        <span className="flex items-center gap-2 rounded-[3px] border border-emerald-500/40 bg-emerald-500/10 px-3 py-1">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="font-dot text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">
            Live path
          </span>
        </span>
        <span className="font-mono text-[11px] text-zinc-500">
          real runs against the real web — hourly cron, on-demand triggers, open-ended scans
        </span>
        <div className="h-px flex-1 bg-[#1c1c1f]" />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <LiveSensors />
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <span className="flex-1">RUN THE SENSOR NOW</span>
                <Badge variant="accent" className="shrink-0">● LIVE</Badge>
              </CardTitle>
              <p className="text-xs leading-5 text-zinc-500">
                Trigger the production collector from the dashboard — a genuine Bright Data
                collection, validated by the trust engine on arrival. Not a replay.
              </p>
            </CardHeader>
            <CardContent>
              <LiveRun />
            </CardContent>
          </Card>
          <UrlScanner />
        </div>
      </section>
    </main>
  );
}
