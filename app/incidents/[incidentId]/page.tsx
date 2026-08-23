import { notFound } from "next/navigation";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { replaySession, incidentStory } from "@/lib/replay/session";

export const dynamic = "force-dynamic";

const HEAL_TIMELINE = [
  { label: "OPEN — semantic failure detected" },
  { label: "DIAGNOSING — page inspection confirms extraction drift" },
  { label: "READY_TO_HEAL — repair prompt generated" },
  { label: "HEALING — coding agent runs bdata scraper heal" },
  { label: "AWAITING_APPROVAL — human reviews the proposed diff" },
  { label: "APPLYING_REPAIR — approved, auto-saved to production" },
  { label: "VERIFYING — same Collector ID rerun against the changed page" },
  { label: "RESOLVED — contract verified, data released downstream" },
];

function RankColumn({
  rows,
  tone,
}: {
  rows: { rank: number; brand: string }[];
  tone: "trusted" | "broken" | "healed";
}) {
  const color =
    tone === "trusted"
      ? "text-emerald-400"
      : tone === "broken"
        ? "text-red-400"
        : "text-violet-300";
  return (
    <ul className={`space-y-0.5 font-mono text-xs leading-6 ${color}`}>
      {rows.map((row) => (
        <li key={row.rank}>
          <span className="text-zinc-600">#{String(row.rank).padStart(2, "0")}</span> {row.brand}
        </li>
      ))}
    </ul>
  );
}

export default async function IncidentRoom({
  params,
}: {
  params: Promise<{ incidentId: string }>;
}) {
  const { incidentId } = await params;
  if (incidentId !== "inc_001") notFound();

  const { snapshots, collector_id } = replaySession;
  const { baseline, broken, healed } = snapshots;
  const blocking = broken.assessment.signals.filter((s) => s.severity === "blocking");

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6">
        <p className="font-dot text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
          MAGPIE // INCIDENT ROOM
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-dot text-3xl font-bold tracking-wider">INC_001</h1>
          <Badge variant="quarantined">EXTRACTION DRIFT</Badge>
          <Badge variant="recovered">RESOLVED</Badge>
        </div>
        <p className="mt-2 font-mono text-xs text-zinc-500">
          source_support_platforms · collector {collector_id}
        </p>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#ff5252]">
            <ShieldAlert className="h-4 w-4" /> THE FAILURE MODE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-dot text-sm font-bold uppercase leading-7 tracking-wider text-[#ff5252]">
            RUN SUCCEEDED. JSON VALID.
            <br />
            BUSINESS CONCLUSION WRONG.
          </p>
          <p className="mt-4 max-w-3xl font-sans text-sm leading-6 text-zinc-400">
            The page redesigned: the top three vendors moved into a JavaScript featured carousel
            and their evidence behind expandable panels. The collector still succeeded and returned
            schema-valid JSON — but only seven of ten vendors.{" "}
            <span className="text-zinc-200">
              A naive product would report: {incidentStory.prevented_conclusion}
            </span>
          </p>
          <div className="mt-4 max-w-3xl rounded-[4px] border border-zinc-800 bg-[#111315] p-4">
            <p className="font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Latest run quarantined
            </p>
            <p className="mt-2 font-sans text-sm leading-6 text-zinc-500">
              The collector returned ranks 4–10 while the last trusted observation contained ranks
              1–10. Publishing this run could falsely report a source-evidence loss. The last
              trusted snapshot kept powering the dashboard while the collector was reviewed.
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="mb-6 grid gap-3 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              TRUSTED BASELINE
              <Badge variant="trusted">PUBLISHED</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-bold tabular-nums text-emerald-400">
              {baseline.assessment.record_count}
              <span className="text-sm text-zinc-600"> /10</span>
            </p>
            <p className="mb-3 font-mono text-[11px] text-zinc-500">
              {baseline.snapshot_id} · facts {baseline.facts_hash.slice(0, 12)}…
            </p>
            <RankColumn rows={[...baseline.rows].sort((a, b) => a.rank - b.rank)} tone="trusted" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              QUARANTINED RUN
              <Badge variant="quarantined">BLOCKED</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-bold tabular-nums text-red-400">
              {broken.assessment.record_count}
              <span className="text-sm text-zinc-600"> /10</span>
            </p>
            <p className="mb-3 font-mono text-[11px] text-zinc-500">
              {broken.snapshot_id} · schema-valid
            </p>
            <RankColumn rows={[...broken.rows].sort((a, b) => a.rank - b.rank)} tone="broken" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              RECOVERED
              <Badge variant="recovered">PUBLISHED</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-bold tabular-nums text-violet-300">
              {healed.assessment.record_count}
              <span className="text-sm text-zinc-600"> /10</span>
            </p>
            <p className="mb-3 font-mono text-[11px] text-zinc-500">
              {healed.snapshot_id} · facts {healed.facts_hash.slice(0, 12)}…
            </p>
            <RankColumn rows={[...healed.rows].sort((a, b) => a.rank - b.rank)} tone="healed" />
          </CardContent>
        </Card>
      </section>

      <section className="mb-6 grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>FAILED CHECKS — DETERMINISTIC, NO LLM</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {blocking.map((signal) => (
              <div key={signal.name} className="rounded-[4px] border border-zinc-800 bg-black p-3">
                <div className="flex items-center justify-between font-dot text-[10px] font-bold uppercase tracking-[0.15em]">
                  <span className="text-red-400">{signal.name}</span>
                  <span className="text-zinc-500">
                    expected {String(signal.expected)} · observed {String(signal.observed)}
                  </span>
                </div>
                <p className="mt-1.5 font-mono text-xs text-zinc-500">{signal.message}</p>
              </div>
            ))}
            <p className="pt-1 font-mono text-xs text-zinc-600">
              structural validation: PASS — the lie was schema-valid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> POST-HEAL VERIFICATION GATE
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <Table>
              <TableBody>
                {[
                  ["collector_id", "unchanged ✓"],
                  ["app contract (SourceEvidenceRowV1)", "unchanged ✓"],
                  [
                    "business_facts_hash",
                    baseline.facts_hash === healed.facts_hash ? "identical ✓" : "MISMATCH ✗",
                  ],
                  ["rows restored", "7 → 10 ✓"],
                  ["downstream app changes", "0"],
                  ["human approval", "recorded ✓"],
                ].map(([label, value]) => (
                  <TableRow key={label}>
                    <TableCell className="font-mono text-xs text-zinc-500">{label}</TableCell>
                    <TableCell className="font-dot text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      {value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>HEALING TIMELINE — BRIGHT DATA SELF-HEALING, HUMAN-GATED</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-1.5">
            {HEAL_TIMELINE.map((step, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-[3px] bg-zinc-900 font-dot text-[9px] font-bold text-zinc-400">
                  {i + 1}
                </span>
                <span className="font-dot text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-300">
                  {step.label}
                </span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </main>
  );
}
