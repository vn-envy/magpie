import Link from "next/link";
import manifest from "@/artifacts/brightdata/MANIFEST.json";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RUNS } from "@/lib/replay/runs";
import { lineage } from "@/lib/replay/session";

export const dynamic = "force-dynamic";

const TABS = [
  { id: "runs", label: "RUNS" },
  { id: "drift", label: "DRIFT" },
  { id: "artifacts", label: "ARTIFACTS" },
  { id: "brightdata", label: "BRIGHT DATA" },
] as const;

function VerdictBadge({ verdict }: { verdict: string }) {
  if (verdict === "TRUSTED") return <Badge variant="trusted">TRUSTED</Badge>;
  if (verdict === "QUARANTINED") return <Badge variant="quarantined">QUARANTINED</Badge>;
  if (verdict === "TRUSTED_CHANGE") return <Badge variant="recovered">TRUSTED CHANGE</Badge>;
  if (verdict === "EMPTY") return <Badge variant="quarantined">EMPTY</Badge>;
  return <Badge variant="outline">DIAGNOSTIC</Badge>;
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
            <p className="text-sm leading-6 text-zinc-400">{run.note}</p>
            <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-zinc-500">
              <span>
                fixture{" "}
                <span className="text-zinc-300">{run.layout_mode === "featured_carousel" ? "carousel" : "cards"}</span>{" "}
                · <span className="text-zinc-300">{run.facts_mode}</span>
                {run.fixture_revision !== null && ` · rev ${run.fixture_revision}`}
              </span>
              <span>
                rows <span className="text-zinc-300">{run.rows}</span>
              </span>
              <span>
                ranks{" "}
                <span className="text-zinc-300">
                  {run.ranks.length ? `${Math.min(...run.ranks)}–${Math.max(...run.ranks)}` : "—"}
                </span>
              </span>
              <span>
                failed{" "}
                <span className={run.failed_checks.length ? "text-red-400" : "text-zinc-300"}>
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

function DriftMatrix() {
  return (
    <div className="space-y-4">
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
                  <TableCell className="font-mono text-[11px] text-zinc-500">
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
      <div className="grid gap-3 md:grid-cols-3">
        {[
          {
            title: "DRIFT EVENT 1 — THE LIE",
            body: "Run 05: page redesign drops extraction to 7 rows (ranks 4–10) while staying schema-valid. Trust engine: record_count 70%, rank_start 4, missing_ranks 1-3 — all blocking. Quarantined.",
          },
          {
            title: "DRIFT EVENT 2 — OVERFIT REPAIR",
            body: "Run 07: after heal V3 restored the carousel, the same collector returned 0 rows on the original layout. The trust gate blocked the regression — repairs are verified, not trusted.",
          },
          {
            title: "NON-EVENT — REAL MARKET CHANGE",
            body: "Run 09: HelioSupport overtakes NimbusDesk with new benchmark evidence. All checks pass, facts hash changes, classification TRUSTED_SOURCE_CHANGE — published without repair.",
          },
        ].map((event) => (
          <Card key={event.title}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-zinc-400">{event.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
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
        <CardTitle className="flex items-center justify-between">
          EVIDENCE PACK — SHA-256 MANIFEST
          <Link
            href="https://github.com/vn-envy/magpie/tree/main/artifacts/brightdata"
            className="font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-50"
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
      command:
        "bdata scraper create https://magpie-lab.netlify.app/lab/source \"Extract one output record per ranked B2B vendor…\"",
      body: "Bright Data AI generated the output schema and Browser Worker code, including the Load-more interaction. Collector c_mt4m8fix1gze0scg44 — one stable ID across the entire story.",
    },
    {
      title: "02 · AUTHORITATIVE RUNS — COLLECTION API",
      command:
        "pnpm magpie collect --source source_support_platforms --purpose baseline  → j_mt4mskyc7o888bkba",
      body: "POST /dca/trigger + GET /dca/dataset + GET /dca/log for every run. Baseline 10 rows, broken run 7 rows — same collector, redesigned page.",
    },
    {
      title: "03 · HEAL ROUND 1 — REJECTED BY HUMAN",
      command: "bdata scraper heal … → awaiting_approval → bdata scraper approve --reject",
      body: "Verbose prompt produced a preview sample showing only legacy rows — no proof of carousel extraction. Human rejected; production untouched.",
    },
    {
      title: "04 · HEAL ROUND V3 — APPROVED, VERIFIED, THEN CAUGHT",
      command: "bdata scraper heal … → awaiting_approval → bdata scraper approve --auto-save → status done",
      body: "Terse prompt; preview contained the missing carousel vendors with evidence. Human approved. Verification run restored 10 rows with an identical business-facts hash. A later probe on the original layout returned 0 rows — the trust gate quarantined the overfit repair.",
    },
    {
      title: "05 · HEAL ROUND V4 — ROBUST ACROSS LAYOUTS",
      command: "bdata scraper heal … \"Handle both layouts…\" → approve --auto-save",
      body: "Human approved. Verified: original layout 10 rows hash-identical; carousel layout 10 rows hash-identical; changed facts extracted correctly and classified TRUSTED_SOURCE_CHANGE.",
    },
    {
      title: "06 · LIVE MODE — FROM THE DASHBOARD",
      command: "POST /api/runs → { snapshot_id } → GET /api/runs/:id → verdict",
      body: "The INITIATE LIVE COLLECTION button on the story page triggers a genuine collection from the deployed app and runs the deterministic trust engine on the result.",
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
            <pre className="overflow-x-auto rounded-[4px] border border-zinc-800 bg-black p-3 font-mono text-[11px] leading-5 text-zinc-300">
              {step.command}
            </pre>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{step.body}</p>
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardContent className="font-mono text-[11px] leading-6 text-zinc-500">
          collector {lineage.collector_id} · baseline {lineage.snapshot_ids.baseline} · broken{" "}
          {lineage.snapshot_ids.broken} · healed {lineage.snapshot_ids.healed} · full transcripts
          in artifacts/brightdata/ + GitHub
        </CardContent>
      </Card>
    </div>
  );
}

export default async function EngineeringConsole({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const active = TABS.some((t) => t.id === tab) ? (tab as string) : "runs";

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6">
        <p className="font-dot text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
          FOR JUDGES AND ENGINEERS
        </p>
        <h1 className="mt-1 font-dot text-3xl font-bold tracking-wider">ENGINEERING CONSOLE</h1>
      </header>

      <nav className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/engineering?tab=${t.id}`}
            className={`rounded-[3px] border px-4 py-2 font-dot text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
              active === t.id
                ? "border-[#D71921] bg-[#D71921]/10 text-[#ff5252]"
                : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-200"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {active === "runs" && <RunCards />}
      {active === "drift" && <DriftMatrix />}
      {active === "artifacts" && <ArtifactTable />}
      {active === "brightdata" && <BrightDataJourney />}
    </main>
  );
}
