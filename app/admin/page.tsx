import Link from "next/link";
import manifest from "@/artifacts/brightdata/MANIFEST.json";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LiveRun } from "@/components/live-run";
import { RUNS } from "@/lib/replay/runs";
import { lineage } from "@/lib/replay/session";

export const dynamic = "force-dynamic";

const TABS = [
  { id: "overview", label: "OVERVIEW" },
  { id: "runs", label: "RUN LEDGER" },
  { id: "incidents", label: "INCIDENTS" },
  { id: "evidence", label: "EVIDENCE" },
  { id: "brightdata", label: "BRIGHT DATA" },
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
            <p className="font-dot text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              {stat.label}
            </p>
            <p className="mt-2 font-dot text-xl font-bold text-zinc-50">{stat.value}</p>
            <p className="mt-1 truncate font-sans text-xs text-zinc-500" title={stat.sub}>
              {stat.sub}
            </p>
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
        <p className="font-dot text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
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
            className={`rounded-[2px] border px-4 py-2 font-dot text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
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
          <DriftMatrix />
          <DriftEvents />
        </div>
      )}
      {active === "runs" && <RunCards />}
      {active === "incidents" && <IncidentSummary />}
      {active === "evidence" && <ArtifactTable />}
      {active === "brightdata" && <BrightDataJourney />}
    </main>
  );
}
