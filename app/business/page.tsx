import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, CheckCircle2, Clock3, FileWarning } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { brandPositions, runSummaries } from "@/lib/replay/runs";
import { lineage } from "@/lib/replay/session";

export const dynamic = "force-dynamic";

export default function BusinessView() {
  const trustedRows = [...runSummaries.healed.rows].sort((a, b) => a.rank - b.rank);
  const tracked = trustedRows.find((r) => r.brand === "NimbusDesk");
  const movers = brandPositions.filter((b) => b.after !== null && b.after !== b.before);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-dot text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
            FOR THE HEAD OF GROWTH
          </p>
          <h1 className="mt-1 font-dot text-3xl font-bold tracking-wider">BUSINESS VIEW</h1>
        </div>
        <Badge variant="trusted">
          <CheckCircle2 className="h-3 w-3" /> EVIDENCE VERIFIED
        </Badge>
      </header>

      {/* THE BOTTOM LINE */}
      <Card className="mb-6 border-emerald-500/30">
        <CardContent className="py-6">
          <p className="text-lg font-semibold leading-8 text-zinc-50">
            Nothing happened to NimbusDesk. The source&rsquo;s page layout changed, our collector
            briefly lost three vendors — and Magpie stopped that from ever reaching your report.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500">
            On the redesigned page, the tool returned seven of ten vendors in perfectly valid
            format. Without Magpie, your dashboard would have shown NimbusDesk falling out of the
            top three — a false alarm that typically triggers weeks of unnecessary content and PR
            rework. Magpie blocked it automatically and kept showing verified data while the
            collector was repaired.
          </p>
        </CardContent>
      </Card>

      {/* POSITION + MOVEMENT */}
      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="py-5">
            <p className="font-dot text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              NIMBUSDESK — VERIFIED POSITION
            </p>
            <p className="mt-2 font-dot text-6xl font-bold text-zinc-50">
              #{tracked?.rank}
              <span className="text-[#D71921]">.</span>
            </p>
            <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-zinc-500">
              <Clock3 className="h-3 w-3" /> snapshot {lineage.snapshot_ids.healed}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>COMPETITOR MOVEMENT — VERIFIED</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {movers.map((brand) => {
              const up = (brand.after ?? 0) < brand.before;
              return (
                <div key={brand.brand} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-100">{brand.brand}</p>
                    <p className="font-mono text-[11px] text-zinc-500">
                      #{brand.before} → #{brand.after}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1 font-dot text-[10px] font-bold ${
                      up ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {up ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {up ? "UP" : "DOWN"}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>RECOMMENDED ACTION</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-zinc-300">
              HelioSupport moved ahead by publishing an independent triage benchmark. Close the
              evidence gap with your own third-party verification — do not overhaul category
              strategy.
            </p>
            <p className="mt-3 font-mono text-[11px] text-zinc-500">
              every number links to verified evidence records
            </p>
          </CardContent>
        </Card>
      </section>

      {/* WITHOUT / WITH */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>WHAT ALMOST HAPPENED vs WHAT DID</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div className="rounded-[4px] border border-red-500/30 bg-red-500/5 p-4">
            <p className="flex items-center gap-2 font-dot text-[10px] font-bold uppercase tracking-[0.15em] text-red-400">
              <FileWarning className="h-3.5 w-3.5" /> WITHOUT MAGPIE
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-400">
              <li>· Dashboard: &ldquo;NimbusDesk out of the top three&rdquo;</li>
              <li>· Growth team redirects content and PR for weeks</li>
              <li>· The false conclusion is never traced back to the collector</li>
            </ul>
          </div>
          <div className="rounded-[4px] border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="flex items-center gap-2 font-dot text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> WITH MAGPIE
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-400">
              <li>· Broken run quarantined; verified data kept showing</li>
              <li>· Collector repaired behind a human approval gate</li>
              <li>· Recovery verified before anything was published</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* EVIDENCE TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            VERIFIED SOURCE EVIDENCE — ENTERPRISE SUPPORT PLATFORMS 2026
            <Link
              href="/incidents/inc_001"
              className="font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-50"
            >
              TECHNICAL DETAILS →
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Why they rank (evidence)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trustedRows.map((row) => (
                <TableRow key={row.rank} className={row.brand === "NimbusDesk" ? "bg-zinc-900/60" : ""}>
                  <TableCell className="font-mono">{row.rank}</TableCell>
                  <TableCell className="font-medium">
                    {row.brand}
                    {row.brand === "NimbusDesk" && (
                      <span className="ml-2 font-dot text-[9px] font-bold text-[#ff5252]">YOU</span>
                    )}
                  </TableCell>
                  <TableCell className="text-zinc-400">{row.evidence_text}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
