import Link from "next/link";
import { ArrowRight, ChevronDown, UserRound, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MagpieBird } from "@/components/magpie-bird";
import { LiveRun } from "@/components/live-run";
import { RUNS, runSummaries } from "@/lib/replay/runs";
import { incidentStory, lineage } from "@/lib/replay/session";

export const dynamic = "force-dynamic";

const VERDICT_COLOR: Record<string, string> = {
  TRUSTED: "bg-emerald-500",
  TRUSTED_CHANGE: "bg-violet-400",
  QUARANTINED: "bg-red-500",
  EMPTY: "bg-red-800",
  DIAGNOSTIC: "bg-zinc-600",
};

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="reveal mb-14">
      <div className="mb-4 flex items-center gap-3">
        <span className="font-dot text-[10px] font-bold tracking-[0.3em] text-[#D71921]">
          {index}
        </span>
        <h2 className="font-dot text-lg font-bold uppercase tracking-[0.15em] text-zinc-100">
          {title}
        </h2>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>
      {children}
    </section>
  );
}

export default function Story() {
  const baselineBrands = [...runSummaries.baseline.rows].sort((a, b) => a.rank - b.rank);
  const brokenBrands = [...runSummaries.broken.rows].sort((a, b) => a.rank - b.rank);
  const brokenSet = new Set(brokenBrands.map((r) => r.brand));

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* HERO */}
      <section className="dot-grid mb-16 rounded-[4px] border border-zinc-800 bg-black p-10 text-center">
        <div className="flex justify-center">
          <MagpieBird size={140} />
        </div>
        <h1 className="mt-4 font-dot text-5xl font-bold tracking-[0.2em] text-zinc-50">
          MAGPIE<span className="text-[#D71921]">.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-300">
          <span className="font-semibold text-zinc-50">
            Did the market change — or did the measurement break?
          </span>{" "}
          Magpie is the evidence-integrity layer for B2B GEO intelligence: it proves the
          observation underneath your dashboard is trustworthy before anyone acts on it.
        </p>
        <p className="mx-auto mt-3 max-w-xl font-dot text-[10px] font-bold uppercase leading-5 tracking-[0.2em] text-zinc-500">
          CORVIDS KEEP LEARNING. MAGPIES HOARD SHINY CITATIONS. AND THE MAGPIE IS ONE OF THE ONLY
          ANIMALS THAT PASSES THE MIRROR TEST — IT KNOWS A REFLECTION FROM THE REAL THING.
        </p>
        <div className="mt-8 border-t border-zinc-800 pt-6">
          <LiveRun />
        </div>
      </section>

      {/* 01 — THE PAIN */}
      <Section index="01" title="The pain">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardContent>
              <p className="text-lg font-semibold leading-8 text-zinc-100">
                &ldquo;My dashboard says a competitor overtook us. I&rsquo;m about to redirect my
                content and PR teams — but I can&rsquo;t tell whether the market moved, or our
                pipeline broke.&rdquo;
              </p>
              <p className="mt-4 text-sm leading-6 text-zinc-500">
                — every Head of Growth relying on AI-search visibility tooling. 45% of B2B buyers
                now use GenAI for vendor research (Gartner, 2025), and those workflows are fed by
                scrapers observing public evidence sources. When a source-backed signal changes,
                four very different things could have happened.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3">
              {[
                { label: "REAL MARKET MOVEMENT", action: "take competitive action", ok: true },
                { label: "MODEL VARIANCE", action: "re-sample the distribution", ok: true },
                { label: "SOURCE CHANGE", action: "refresh the evidence", ok: true },
                { label: "COLLECTOR FAILURE", action: "quarantine and repair", danger: true },
              ].map((cause) => (
                <div
                  key={cause.label}
                  className="flex items-center justify-between rounded-[4px] border border-zinc-800 bg-black px-4 py-3"
                >
                  <span
                    className={`font-dot text-[10px] font-bold uppercase tracking-[0.15em] ${
                      cause.danger ? "text-[#ff5252]" : "text-zinc-300"
                    }`}
                  >
                    {cause.label}
                  </span>
                  <span className="font-mono text-xs text-zinc-500">{cause.action}</span>
                </div>
              ))}
              <p className="pt-1 text-xs leading-5 text-zinc-500">
                Existing tools blend all four into one red arrow. Magpie is built for the
                dangerous one: the collector that still succeeds, returns valid JSON — and lies.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* 02 — THE LIE */}
      <Section index="02" title="The lie we caught — real run, real snapshot">
        <Card className="border-[#D71921]/40">
          <CardHeader>
            <CardTitle className="text-[#ff5252]">
              RUN SUCCEEDED. JSON VALID. BUSINESS CONCLUSION WRONG.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 max-w-3xl text-sm leading-6 text-zinc-400">
              Our public source redesigned its page — the top three vendors moved into a JavaScript
              carousel. The same Bright Data collector, unchanged, ran again. Transport: success.
              Schema: valid. Output: seven of ten vendors. A naive product would publish it and
              report:{" "}
              <span className="text-red-400">
                &ldquo;{incidentStory.prevented_conclusion}&rdquo;
              </span>
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                  BASELINE — {lineage.snapshot_ids.baseline}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {baselineBrands.map((row) => (
                    <span
                      key={row.brand}
                      className={`rounded-[3px] border px-2 py-1 font-mono text-[11px] ${
                        brokenSet.has(row.brand)
                          ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
                          : "border-red-500/50 bg-red-500/10 text-red-400 line-through"
                      }`}
                    >
                      {row.rank}. {row.brand}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                  QUARANTINED — {lineage.snapshot_ids.broken}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {brokenBrands.map((row) => (
                    <span
                      key={row.brand}
                      className="rounded-[3px] border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[11px] text-zinc-300"
                    >
                      {row.rank}. {row.brand}
                    </span>
                  ))}
                  {[1, 2, 3].map((rank) => (
                    <span
                      key={rank}
                      className="rounded-[3px] border border-dashed border-red-500/50 px-2 py-1 font-mono text-[11px] text-red-500"
                    >
                      {rank}. ✕ missing
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-5 font-mono text-xs leading-5 text-zinc-500">
              record_count 7/10 (70%) — BLOCKING · rank_start 4 — BLOCKING · missing_ranks 1, 2, 3
              — BLOCKING · structural validation: PASS
            </p>
          </CardContent>
        </Card>
      </Section>

      {/* 03 — DRIFT TIMELINE */}
      <Section index="03" title="Nine genuine runs — the drift, visible">
        <Card>
          <CardContent>
            <div className="flex items-end gap-2 overflow-x-auto pb-2">
              {RUNS.map((run) => (
                <div key={run.snapshot_id} className="group flex w-14 flex-col items-center gap-2">
                  <div className="flex h-32 w-full items-end justify-center">
                    <div
                      className={`w-8 rounded-t-[2px] transition-all group-hover:opacity-80 ${
                        VERDICT_COLOR[run.verdict] ?? "bg-zinc-600"
                      }`}
                      style={{ height: `${Math.max(run.rows, 1) * 10}%` }}
                      title={`run ${run.sequence}: ${run.rows} rows — ${run.verdict}`}
                    />
                  </div>
                  <span className="font-dot text-[9px] font-bold text-zinc-600">
                    {String(run.sequence).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-2 font-mono text-[11px] leading-5 text-zinc-500 md:grid-cols-3">
              <p>
                <span className="text-emerald-400">■</span> published ·{" "}
                <span className="text-red-400">■</span> blocked ·{" "}
                <span className="text-violet-300">■</span> trusted market change
              </p>
              <p>
                RUN 05 — the believable lie: 7 rows, schema-valid, quarantined before it reached
                the business.
              </p>
              <p>
                RUN 07 — the caught overfit repair: a healed collector silently returned nothing on
                the original layout. The trust gate blocked that too.
              </p>
            </div>
            <Link
              href="/engineering?tab=drift"
              className="mt-4 inline-block font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 underline decoration-zinc-700 underline-offset-4 hover:text-zinc-50"
            >
              FULL DRIFT ANALYSIS →
            </Link>
          </CardContent>
        </Card>
      </Section>

      {/* 04 — THE HEAL */}
      <Section index="04" title="The repair — human-gated self-healing">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardContent>
              <ol className="space-y-2.5">
                {[
                  "Trust engine quarantines the run, serves last-known-good",
                  "Diagnosis: page still contains ten vendors — collector missed three",
                  "Coding agent runs: bdata scraper heal <collector> <instruction>",
                  "Bright Data proposes a diff — status awaiting_approval",
                  "HUMAN reviews the diff in Scraper Studio and approves",
                  "Same Collector ID reruns the changed page",
                  "Verification gate: schema + hashes must match baseline exactly",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] bg-zinc-900 font-dot text-[9px] font-bold text-zinc-400">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-6 text-zinc-300">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>VERIFICATION GATE — ALL GREEN</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 font-mono text-xs">
              {[
                ["rows restored", "7 → 10", "text-emerald-400"],
                ["collector_id", "unchanged", "text-emerald-400"],
                ["output contract", "unchanged", "text-emerald-400"],
                ["business_facts_hash", "832c8a89… identical", "text-emerald-400"],
                ["downstream app changes", "0", "text-emerald-400"],
                ["false repair caught (run 07)", "blocked", "text-emerald-400"],
              ].map(([label, value, color]) => (
                <div key={label} className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-500">{label}</span>
                  <span className={color}>{value}</span>
                </div>
              ))}
              <p className="pt-2 text-[11px] leading-5 text-zinc-500">
                And when HelioSupport genuinely overtook NimbusDesk with stronger evidence, Magpie
                classified it TRUSTED_SOURCE_CHANGE and published — it does not heal every
                unfavorable result.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* 05 — ENTER */}
      <Section index="05" title="Enter Magpie">
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/business" className="group">
            <Card className="h-full transition-colors group-hover:border-zinc-600">
              <CardContent>
                <UserRound className="mb-3 h-5 w-5 text-zinc-400" />
                <p className="font-dot text-sm font-bold uppercase tracking-[0.15em] text-zinc-100">
                  BUSINESS VIEW
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  For the Head of Growth: verified positions, competitor movement, what almost went
                  wrong, and the recommended action. Plain language, zero jargon.
                </p>
                <p className="mt-3 flex items-center gap-1 font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5252]">
                  ENTER <ArrowRight className="h-3.5 w-3.5" />
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/engineering" className="group">
            <Card className="h-full transition-colors group-hover:border-zinc-600">
              <CardContent>
                <Wrench className="mb-3 h-5 w-5 text-zinc-400" />
                <p className="font-dot text-sm font-bold uppercase tracking-[0.15em] text-zinc-100">
                  ENGINEERING VIEW
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  For judges and engineers: every run, drift analysis, hashes, artifact manifest,
                  and the complete Bright Data journey — create, heal, approve, verify.
                </p>
                <p className="mt-3 flex items-center gap-1 font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5252]">
                  ENTER <ArrowRight className="h-3.5 w-3.5" />
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </Section>

      <div className="flex justify-center">
        <Badge variant="outline">
          <ChevronDown className="h-3 w-3" /> CONTROLLED FIXTURE · GENUINE SNAPSHOTS · HONEST
          LABELS
        </Badge>
      </div>
    </main>
  );
}
