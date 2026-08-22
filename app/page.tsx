import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RUNS, brandPositions, runSummaries } from "@/lib/replay/runs";
import { lineage, incidentStory } from "@/lib/replay/session";
import { LiveRun } from "@/components/live-run";

export const dynamic = "force-dynamic";

function VerdictBadge({ verdict }: { verdict: string }) {
  if (verdict === "TRUSTED") return <Badge variant="trusted">TRUSTED</Badge>;
  if (verdict === "QUARANTINED") return <Badge variant="quarantined">QUARANTINED</Badge>;
  if (verdict === "TRUSTED_CHANGE") return <Badge variant="recovered">TRUSTED CHANGE</Badge>;
  if (verdict === "EMPTY") return <Badge variant="quarantined">EMPTY</Badge>;
  return <Badge variant="outline">DIAGNOSTIC</Badge>;
}

export default function Overview() {
  const trustedRows = [...runSummaries.healed.rows].sort((a, b) => a.rank - b.rank);
  const tracked = trustedRows.find((r) => r.brand === "NimbusDesk");
  const recentRuns = [...RUNS].reverse().slice(0, 5);
  const movers = brandPositions.filter((b) => b.after !== null && b.after !== b.before);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      {/* HERO */}
      <section className="dot-grid mb-8 rounded-[4px] border border-zinc-800 bg-black p-8">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <p className="font-dot text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
              TRACKED BRAND
            </p>
            <h1 className="mt-2 font-dot text-4xl font-bold tracking-wider text-zinc-50">
              NIMBUSDESK
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
              Position on <span className="text-zinc-200">Enterprise Support Platforms 2026</span> —
              enterprise customer support. Every number below is backed by a verified Bright Data
              snapshot.
            </p>
          </div>
          <div className="text-right">
            <p className="font-dot text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
              VERIFIED POSITION
            </p>
            <p className="font-dot text-7xl font-bold leading-none text-zinc-50">
              #{tracked?.rank}
              <span className="text-[#D71921]">.</span>
            </p>
            <p className="mt-2 font-mono text-xs text-zinc-500">
              snapshot {lineage.snapshot_ids.healed}
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-800 pt-5">
          <LiveRun />
        </div>
      </section>

      {/* STAT STRIP */}
      <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "EVIDENCE ROWS", value: "10/10", sub: "complete + verified" },
          { label: "EVIDENCE COVERAGE", value: "100%", sub: "every claim sourced" },
          { label: "FALSE CONCLUSIONS BLOCKED", value: "2", sub: "incl. 1 overfit repair" },
          { label: "INCIDENTS", value: "1", sub: "resolved via self-healing" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="py-4">
              <p className="font-dot text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                {stat.label}
              </p>
              <p className="mt-2 font-dot text-2xl font-bold text-zinc-50">{stat.value}</p>
              <p className="mt-1 text-xs text-zinc-500">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* INCIDENT + COMPETITOR MOVEMENT */}
      <section className="mb-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              INCIDENT inc_001
              <Badge variant="recovered">RESOLVED</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-dot text-[11px] font-bold uppercase leading-5 tracking-wider text-[#ff5252]">
              RUN SUCCEEDED. JSON VALID.
              <br />
              BUSINESS CONCLUSION WRONG.
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {incidentStory.prevented_conclusion} {incidentStory.actual_cause}
            </p>
            <Link
              href="/incidents/inc_001"
              className="mt-4 inline-block font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 underline decoration-zinc-700 underline-offset-4 hover:text-zinc-50"
            >
              OPEN INCIDENT ROOM →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              COMPETITOR MOVEMENT — TRUSTED
              <Badge variant="trusted">
                <ShieldCheck className="h-3 w-3" /> VERIFIED MARKET CHANGE
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-xs leading-5 text-zinc-500">
              From the facts-change run: HelioSupport published stronger benchmark evidence and
              moved up. Magpie classified it TRUSTED_SOURCE_CHANGE and published — no repair
              triggered.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Before</TableHead>
                  <TableHead>After</TableHead>
                  <TableHead>Move</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movers.map((brand) => {
                  const up = (brand.after ?? 0) < brand.before;
                  return (
                    <TableRow key={brand.brand}>
                      <TableCell className="font-medium">
                        {brand.brand}
                        {brand.tracked && (
                          <span className="ml-2 font-dot text-[9px] font-bold text-[#ff5252]">
                            YOU
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-zinc-500">#{brand.before}</TableCell>
                      <TableCell className="font-mono">#{brand.after}</TableCell>
                      <TableCell>
                        {up ? (
                          <span className="flex items-center gap-1 font-dot text-[10px] font-bold text-emerald-400">
                            <ArrowUpRight className="h-3.5 w-3.5" /> UP
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-dot text-[10px] font-bold text-red-400">
                            <ArrowDownRight className="h-3.5 w-3.5" /> DOWN
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {brandPositions
                  .filter((b) => b.after === b.before)
                  .slice(0, 2)
                  .map((brand) => (
                    <TableRow key={brand.brand} className="opacity-50">
                      <TableCell className="font-medium">{brand.brand}</TableCell>
                      <TableCell className="font-mono text-zinc-500">#{brand.before}</TableCell>
                      <TableCell className="font-mono">#{brand.after}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 font-dot text-[10px] font-bold text-zinc-500">
                          <Minus className="h-3.5 w-3.5" /> HELD
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* RECENT RUNS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            RECENT COLLECTIONS
            <Link
              href="/runs"
              className="font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-50"
            >
              FULL LEDGER →
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Snapshot</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Fixture</TableHead>
                <TableHead>Rows</TableHead>
                <TableHead>Verdict</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRuns.map((run) => (
                <TableRow key={run.snapshot_id}>
                  <TableCell className="font-mono text-xs text-zinc-300">
                    {run.snapshot_id}
                  </TableCell>
                  <TableCell className="font-dot text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    {run.purpose}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-zinc-500">
                    {run.layout_mode === "featured_carousel" ? "carousel" : "cards"} ·{" "}
                    {run.facts_mode === "baseline" ? "base" : "moved"}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{run.rows}</TableCell>
                  <TableCell>
                    <VerdictBadge verdict={run.verdict} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
