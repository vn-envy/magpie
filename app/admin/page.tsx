import Link from "next/link";
import manifest from "@/artifacts/brightdata/MANIFEST.json";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LiveRun } from "@/components/live-run";
import { liveFeed, b2bLiveAssessment } from "@/lib/replay/live-feed";
import { RUNS } from "@/lib/replay/runs";
import { lineage } from "@/lib/replay/session";

export const dynamic = "force-dynamic";

const TABS = [
  { id: "overview", label: "OVERVIEW" },
  { id: "runs", label: "RUN LEDGER" },
  { id: "incidents", label: "INCIDENTS" },
  { id: "evidence", label: "EVIDENCE" },
  { id: "brightdata", label: "BRIGHT DATA" },
  { id: "liveapi", label: "LIVE API" },
] as const;

function VerdictBadge({ verdict }: { verdict: string }) {
  if (verdict === "TRUSTED") return <Badge variant="trusted">TRUSTED</Badge>;
  if (verdict === "QUARANTINED") return <Badge variant="quarantined">QUARANTINED</Badge>;
  if (verdict === "TRUSTED_CHANGE") return <Badge variant="recovered">TRUSTED CHANGE</Badge>;
  if (verdict === "EMPTY") return <Badge variant="quarantined">EMPTY</Badge>;
  return <Badge variant="outline">DIAGNOSTIC</Badge>;
}

function Kpis() {
  const trusted = RUNS.filter((r) => r.verdict === "TRUSTED" || r.verdict === "TRUSTED_CHANGE").length;
  const blocked = RUNS.filter((r) => r.verdict === "QUARANTINED" || r.verdict === "EMPTY").length;
  const stats = [
    { label: "EVIDENCE COVERAGE", value: "100%", sub: "every published claim verified" },
    { label: "FALSE REPORTS BLOCKED", value: String(blocked), sub: "incl. one overfit repair" },
    { label: "GENUINE RUNS", value: String(RUNS.length), sub: `${trusted} published · ${blocked} blocked` },
    { label: "SELF-HEAL ROUNDS", value: "3", sub: "2 human-approved in production" },
    { label: "COLLECTOR", value: "ROBUST", sub: `${lineage.collector_id}` },
    { label: "SENSOR", value: "ONLINE", sub: "live runs enabled" },
  ];
  return (
    <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="py-4">
            <p className="font-dot text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">
              {stat.label}
            </p>
            <p className="mt-2 font-sans text-2xl font-bold tabular-nums tracking-tight text-zinc-50">{stat.value}</p>
            <p className="mt-1 truncate font-sans text-xs text-zinc-500" title={stat.sub}>
              {stat.sub}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}


const VERDICT_COLOR: Record<string, string> = {
  TRUSTED: "#22c55e",
  TRUSTED_CHANGE: "#a78bfa",
  QUARANTINED: "#ef4444",
  EMPTY: "#7f1d1d",
  DIAGNOSTIC: "#52525b",
};

function RunTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ROW COUNT ACROSS NINE GENUINE RUNS — SAME COLLECTOR, CHANGING SOURCE</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2.5 md:gap-3" style={{ height: 170 }}>
          {RUNS.map((run) => (
            <div
              key={run.snapshot_id}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
              title={`Run ${run.sequence} · ${run.rows} rows · ${run.verdict}`}
            >
              <span className="font-mono text-sm font-bold tabular-nums text-zinc-300">
                {run.rows}
              </span>
              <div
                className="block-fill w-full max-w-12 rounded-t-[2px]"
                style={{
                  height: `${Math.max(run.rows, 1) * 9}%`,
                  background: VERDICT_COLOR[run.verdict] ?? "#52525b",
                  opacity: run.rows === 0 ? 0.5 : 1,
                }}
              />
              <span className="font-mono text-[11px] tabular-nums text-zinc-500">
                {String(run.sequence).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[1px] bg-emerald-500" /> published</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[1px] bg-red-500" /> blocked</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[1px] bg-violet-400" /> trusted change</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[1px] bg-zinc-600" /> diagnostic</span>
          <span className="ml-auto hidden text-zinc-600 md:block">
            run 05 — the believable lie · run 07 — the caught overfit repair
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function VerdictDistribution() {
  const trusted = RUNS.filter((r) => r.verdict === "TRUSTED" || r.verdict === "TRUSTED_CHANGE").length;
  const blocked = RUNS.filter((r) => r.verdict === "QUARANTINED" || r.verdict === "EMPTY").length;
  const diagnostic = RUNS.length - trusted - blocked;
  const segments = [
    { label: "PUBLISHED", value: trusted, color: "#22c55e" },
    { label: "BLOCKED", value: blocked, color: "#ef4444" },
    { label: "DIAGNOSTIC", value: diagnostic, color: "#52525b" },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>VERDICT DISTRIBUTION — WHAT THE TRUST ENGINE DID</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-12 w-full overflow-hidden rounded-[3px] border border-[#222]">
          {segments.map((seg) => (
            <div
              key={seg.label}
              style={{ width: `${(seg.value / RUNS.length) * 100}%`, background: seg.color }}
              className="block-fill flex items-center justify-center"
            >
              <span className="font-mono text-sm font-bold tabular-nums text-black/70">
                {seg.value > 0 ? seg.value : ""}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-zinc-400">
          {segments.map((seg) => (
            <span key={seg.label} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[1px]" style={{ background: seg.color }} />
              {seg.label} · {seg.value}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-zinc-500">
          Half of all genuine runs were unsafe to publish — every one caught before it could reach
          a customer dashboard.
        </p>
      </CardContent>
    </Card>
  );
}

function EvidenceSummary() {
  const artifacts = Object.entries(
    (manifest as { artifacts: Record<string, { sha256: string; bytes: number }> }).artifacts,
  );
  const totalBytes = artifacts.reduce((sum, [, meta]) => sum + meta.bytes, 0);
  return (
    <section className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
      {[
        { label: "ARTIFACT FILES", value: String(artifacts.length) },
        { label: "TOTAL SIZE", value: `${(totalBytes / 1024).toFixed(0)} KB` },
        { label: "HASH ALGORITHM", value: "SHA-256" },
        { label: "TAMPER-VERIFIABLE", value: "YES" },
      ].map((stat) => (
        <Card key={stat.label}>
          <CardContent className="py-4">
            <p className="font-dot text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              {stat.label}
            </p>
            <p className="mt-2 font-mono text-xl font-bold tabular-nums text-zinc-50">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function DriftEvents() {
  const events = [
    {
      title: "DRIFT EVENT 1 — THE LIE",
      body: "Run 05: the page redesign dropped extraction to 7 rows (ranks 4–10) while staying schema-valid. The trust engine blocked publication — record ratio 70%, missing ranks 1–3 — and the last verified snapshot kept serving.",
    },
    {
      title: "DRIFT EVENT 2 — OVERFIT REPAIR",
      body: "Run 07: after the first heal restored the carousel, the same collector returned nothing on the original layout. The trust gate quarantined the regression — repairs are verified, never trusted.",
    },
    {
      title: "NON-EVENT — REAL MARKET CHANGE",
      body: "Run 09: HelioSupport overtook NimbusDesk with new benchmark evidence. All checks passed, the facts hash changed, and the run was classified TRUSTED_SOURCE_CHANGE — published without repair. Magpie does not heal real market movement.",
    },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {events.map((event) => (
        <Card key={event.title}>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-sans text-sm leading-6 text-zinc-400">{event.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DriftMatrix() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DRIFT ACROSS EVERY RUN — ROWS RETURNED BY THE SAME COLLECTOR</CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Run</TableHead>
              <TableHead>Snapshot</TableHead>
              <TableHead>Fixture</TableHead>
              <TableHead>Rows</TableHead>
              <TableHead>Ranks</TableHead>
              <TableHead>Verdict</TableHead>
              <TableHead>Failed checks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RUNS.map((run) => (
              <TableRow key={run.snapshot_id}>
                <TableCell className="font-dot text-[10px] font-bold text-zinc-500">
                  {String(run.sequence).padStart(2, "0")}
                </TableCell>
                <TableCell className="font-mono text-[11px] text-zinc-300">
                  {run.snapshot_id}
                </TableCell>
                <TableCell className="font-sans text-xs text-zinc-500">
                  {run.layout_mode === "featured_carousel" ? "carousel" : "cards"} ·{" "}
                  {run.facts_mode === "baseline" ? "base" : "moved"}
                </TableCell>
                <TableCell className="font-mono text-xs">{run.rows}</TableCell>
                <TableCell className="font-mono text-[11px] text-zinc-400">
                  {run.ranks.length ? `${Math.min(...run.ranks)}–${Math.max(...run.ranks)}` : "—"}
                </TableCell>
                <TableCell>
                  <VerdictBadge verdict={run.verdict} />
                </TableCell>
                <TableCell className="font-mono text-[11px] text-zinc-500">
                  {run.failed_checks.join(", ") || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RunCards() {
  return (
    <div className="space-y-3">
      {[...RUNS].reverse().map((run) => (
        <Card key={run.snapshot_id}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-dot text-[11px] font-bold tracking-wider text-zinc-500">
                  RUN {String(run.sequence).padStart(2, "0")}
                </span>
                <span className="font-mono text-xs text-zinc-200">{run.snapshot_id}</span>
                <VerdictBadge verdict={run.verdict} />
                <Badge variant="outline">{run.purpose}</Badge>
              </div>
              <span className="font-mono text-[11px] text-zinc-500">
                {run.captured_at
                  ? new Date(run.captured_at).toISOString().replace("T", " ").slice(0, 19)
                  : "—"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-sans text-sm leading-6 text-zinc-400">{run.note}</p>
            <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 font-sans text-xs text-zinc-500">
              <span>
                fixture <span className="text-zinc-300">{run.layout_mode === "featured_carousel" ? "carousel" : "cards"}</span> ·{" "}
                <span className="text-zinc-300">{run.facts_mode}</span>
                {run.fixture_revision !== null && ` · rev ${run.fixture_revision}`}
              </span>
              <span>
                rows <span className="font-mono text-zinc-300">{run.rows}</span>
              </span>
              <span>
                ranks{" "}
                <span className="font-mono text-zinc-300">
                  {run.ranks.length ? `${Math.min(...run.ranks)}–${Math.max(...run.ranks)}` : "—"}
                </span>
              </span>
              <span>
                failed{" "}
                <span className={`font-mono ${run.failed_checks.length ? "text-red-400" : "text-zinc-300"}`}>
                  {run.failed_checks.length ? run.failed_checks.join(", ") : "none"}
                </span>
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function IncidentSummary() {
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex-1">INC_001 — EXTRACTION DRIFT ON SOURCE REDESIGN</span>
            <Badge variant="quarantined" className="shrink-0">DETECTED</Badge>
            <Badge variant="recovered" className="shrink-0">RESOLVED</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-sans text-sm leading-6 text-zinc-400">
            The source moved its top three vendors into a JavaScript carousel. The unchanged
            collector returned seven schema-valid rows — silently omitting NimbusDesk. Magpie
            quarantined the run, kept serving verified data, drove a Bright Data Self-Healing
            repair through human approval, and verified recovery to an identical business-facts
            hash before releasing it downstream.
          </p>
          <div className="mt-4 flex flex-wrap gap-6 font-sans text-xs text-zinc-500">
            <span>rows <span className="font-mono text-zinc-300">7 → 10</span></span>
            <span>time to contain <span className="font-mono text-zinc-300">immediate</span></span>
            <span>human approvals <span className="font-mono text-zinc-300">2</span></span>
            <span>downstream changes <span className="font-mono text-zinc-300">0</span></span>
          </div>
          <Link
            href="/incidents/inc_001"
            className="mt-4 inline-block font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 underline decoration-zinc-700 underline-offset-4 hover:text-zinc-50"
          >
            OPEN FULL INCIDENT ROOM →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function ArtifactTable() {
  const artifacts = Object.entries(
    (manifest as { artifacts: Record<string, { sha256: string; bytes: number }> }).artifacts,
  ).sort(([a], [b]) => a.localeCompare(b));
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex-1">EVIDENCE PACK — SHA-256 MANIFEST</span>
          <Link
            href="https://github.com/vn-envy/magpie/tree/main/artifacts/brightdata"
            className="shrink-0 font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-50"
          >
            GITHUB →
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>SHA-256</TableHead>
              <TableHead className="text-right">Bytes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artifacts.map(([name, meta]) => (
              <TableRow key={name}>
                <TableCell className="font-mono text-[11px] text-zinc-300">{name}</TableCell>
                <TableCell className="font-mono text-[11px] text-zinc-500">
                  {meta.sha256.slice(0, 24)}…
                </TableCell>
                <TableCell className="text-right font-mono text-[11px] text-zinc-500">
                  {meta.bytes.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function BrightDataJourney() {
  const steps = [
    {
      title: "01 · CREATE — CUSTOM COLLECTOR",
      command: "bdata scraper create https://magpie-lab.netlify.app/lab/source",
      body: "Bright Data AI generated the output schema and Browser Worker code, including the Load-more interaction. One stable collector ID across the entire story.",
    },
    {
      title: "02 · AUTHORITATIVE RUNS — COLLECTION API",
      command: "POST /dca/trigger → GET /dca/dataset → GET /dca/log",
      body: "Every published number comes from a genuine j_* snapshot: baseline 10 rows, broken run 7 rows — same collector, redesigned page.",
    },
    {
      title: "03 · HEAL ROUND 1 — REJECTED BY HUMAN",
      command: "bdata scraper heal … → awaiting_approval → approve --reject",
      body: "Verbose prompt, weak preview sample — no proof of carousel extraction. Human rejected; production untouched.",
    },
    {
      title: "04 · HEAL V3 — APPROVED, VERIFIED, THEN CAUGHT",
      command: "bdata scraper heal … → approve --auto-save → done",
      body: "Preview contained the missing carousel vendors. Human approved. Verification restored 10 rows with an identical facts hash — and a later probe caught the same repair failing on the original layout. The trust gate blocked it.",
    },
    {
      title: "05 · HEAL V4 — ROBUST ACROSS LAYOUTS",
      command: "bdata scraper heal … \"Handle both layouts…\" → approve --auto-save",
      body: "Human approved. Verified on three genuine runs: both layouts 10 rows hash-identical; changed facts correctly classified TRUSTED_SOURCE_CHANGE.",
    },
    {
      title: "06 · LIVE MODE — FROM THE DASHBOARD",
      command: "POST /api/runs → poll /api/runs/:id → deterministic verdict",
      body: "Live collections can be triggered from the product; the trust engine computes the verdict the moment data lands.",
    },
  ];
  return (
    <div className="space-y-3">
      {steps.map((step) => (
        <Card key={step.title}>
          <CardHeader>
            <CardTitle>{step.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-[2px] border border-[#222] bg-[#111315] p-3 font-mono text-[11px] leading-5 text-zinc-300">
              {step.command}
            </pre>
            <p className="mt-3 font-sans text-sm leading-6 text-zinc-400">{step.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


function LiveApiTab() {
  const hn = liveFeed.hn;
  const b2b = liveFeed.b2b;
  const hnTop = [...(hn.rows ?? [])]
    .filter((row) => typeof row === "object" && row !== null && "title" in row)
    .sort((a, b) => (Number(a.rank) || 99) - (Number(b.rank) || 99))
    .slice(0, 5);
  const curl = `curl -X POST "https://api.brightdata.com/dca/trigger?collector=c_mt4m8fix1gze0scg44&queue_next=1" \
  -H "Authorization: Bearer $BRIGHTDATA_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[{"url":"https://magpie-lab.netlify.app/lab/source"}]'`;
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>THE COLLECTOR ID IS YOUR PRODUCTION API</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm leading-6 text-zinc-400">
            Every scraper returns a stable <span className="font-mono text-zinc-200">c_*</span>{" "}
            Collector ID triggerable with <span className="font-mono text-zinc-200">POST /dca/trigger</span>{" "}
            from any language or scheduler — no deployment step. An hourly GitHub Actions cron runs
            plain Node against it, commits the results to this repo, and the push auto-deploys this
            dashboard. Cron → Bright Data → trust engine → git → live site.
          </p>
          <pre className="overflow-x-auto rounded-[3px] border border-[#222] bg-[#111315] p-4 font-mono text-xs leading-6 text-zinc-300">
{curl}
          </pre>
          <p className="mt-3 font-mono text-[11px] text-zinc-500">
            feed last updated: {liveFeed.updatedAt ?? "pending first cron"} · workflow:
            .github/workflows/live-cron.yml
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex-1">REAL COMPETITION — OPEN-SOURCE SOFTWARE MARKET (PUBLIC WEB)</span>
            <Badge variant={liveFeed.realCompetition.verdict === "TRUSTED" ? "trusted" : "outline"} className="shrink-0">
              {liveFeed.realCompetition.verdict}
            </Badge>
          </CardTitle>
          <p className="font-mono text-[11px] text-zinc-500">
            {liveFeed.realCompetition.snapshot_id
              ? `snapshot ${liveFeed.realCompetition.snapshot_id} · ${liveFeed.realCompetition.row_count} real products`
              : "collector generating — first cron run pending"}
          </p>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-xs leading-5 text-zinc-500">
            Genuine competitive intelligence beyond the simulated source: real products with
            descriptions and licenses, extracted hourly from the public awesome-selfhosted
            catalog by a dedicated custom collector.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(liveFeed.realCompetition.rows ?? [])
              .filter((row) => row && typeof row === "object" && "name" in row)
              .slice(0, 12)
              .map((row, i) => (
                <span key={i} className="rounded-[3px] border border-[#222] bg-[#111315] px-2 py-1 font-mono text-[11px] text-zinc-300">
                  {String(row.name)}
                </span>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex-1">LIVE SOURCE — HACKER NEWS (PUBLIC WEB)</span>
              <Badge variant={hn.verdict === "TRUSTED" ? "trusted" : "outline"} className="shrink-0">
                {hn.verdict}
              </Badge>
            </CardTitle>
            <p className="font-mono text-[11px] text-zinc-500">
              {hn.captured_at ? `snapshot ${hn.snapshot_id} · ${hn.row_count} rows` : "awaiting first cron run"}
            </p>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-xs leading-5 text-zinc-500">
              Outside the simulated seed entirely: a second custom collector on a real, public,
              constantly changing ranked list — proof the pipeline works on the open web.
            </p>
            {hnTop.length > 0 ? (
              <div className="space-y-1.5">
                {hnTop.map((row, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate text-zinc-300">
                      <span className="mr-2 font-mono text-zinc-500">{String(row.rank).padStart(2, "0")}</span>
                      {String(row.title)}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-zinc-500">{String(row.points ?? "—")} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-mono text-xs text-zinc-600">
                first hourly run lands in artifacts/live/hn_front_page-latest.json
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex-1">B2B SOURCE — TRUST ENGINE VERDICT</span>
              <Badge
                variant={b2bLiveAssessment.publish_allowed ? "trusted" : "quarantined"}
                className="shrink-0"
              >
                {b2bLiveAssessment.publish_allowed ? "PUBLISHED" : "BLOCKED"}
              </Badge>
            </CardTitle>
            <p className="font-mono text-[11px] text-zinc-500">
              {b2b.captured_at
                ? `snapshot ${b2b.snapshot_id} · ${b2bLiveAssessment.record_count}/10 rows`
                : "awaiting first cron run"}
            </p>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-xs leading-5 text-zinc-500">
              The same cron hits the award-hero collector every hour; the dashboard re-runs the
              deterministic trust engine on every result at deploy time.
            </p>
            {b2bLiveAssessment.signals.length > 0 ? (
              <div className="space-y-1.5">
                {b2bLiveAssessment.signals.map((signal) => (
                  <div key={signal.name} className="flex items-center justify-between font-mono text-xs">
                    <span className={signal.severity === "blocking" ? "text-red-400" : "text-zinc-400"}>
                      {signal.name}
                    </span>
                    <span className="text-zinc-500">{String(signal.observed)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-mono text-xs text-emerald-400">
                all checks passing · {b2bLiveAssessment.record_count}/10 rows verified
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default async function AdminConsole({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const active = TABS.some((t) => t.id === tab) ? (tab as string) : "overview";

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-y border-[#1c1c1f] py-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
            SCREEN 02 · SENSOR ONLINE · FIXTURE REV 27
          </p>
          <p className="font-mono text-[11px] text-zinc-600">{lineage.collector_id}</p>
        </div>
        <p className="font-dot text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
          ADMIN · MARKET INTELLIGENCE OPERATIONS
        </p>
        <h1 className="mt-1 font-dot text-3xl font-bold tracking-wider text-zinc-50">
          CONSOLE<span className="text-[#D71921]">.</span>
        </h1>
        <div className="mt-4 border-y border-[#1c1c1f] py-3">
          <LiveRun />
        </div>
      </header>

      <Kpis />

      <nav className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/admin?tab=${t.id}`}
            className={`rounded-[2px] border px-4 py-2 font-dot text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${
              active === t.id
                ? "border-[#D71921] bg-[#D71921]/10 text-[#ff5252]"
                : "border-[#222] text-zinc-500 hover:border-zinc-600 hover:text-zinc-200"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {active === "overview" && (
        <div className="space-y-4">
          <RunTimeline />
          <VerdictDistribution />
          <DriftMatrix />
          <DriftEvents />
        </div>
      )}
      {active === "runs" && <RunCards />}
      {active === "incidents" && <IncidentSummary />}
      {active === "evidence" && (
        <div className="space-y-4">
          <EvidenceSummary />
          <ArtifactTable />
        </div>
      )}
      {active === "brightdata" && <BrightDataJourney />}
      {active === "liveapi" && <LiveApiTab />}
    </main>
  );
}
