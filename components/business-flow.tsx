"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw, Search, ShieldCheck, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/lib/insights/recommend";

type Phase =
  | "enter"
  | "research1"
  | "position"
  | "plan"
  | "monitoring"
  | "shift"
  | "research2"
  | "deviation"
  | "resolution";

type TopRow = {
  rank: number;
  brand: string;
  claim: string;
  evidence_text: string;
  outbound_url: string | null;
};

export type BusinessFlowProps = {
  collectorId: string;
  snapshotIds: { baseline: string; broken: string; healed: string };
  factsHashPrefix: string;
  topTen: TopRow[];
  brokenSummary: {
    recordCount: number;
    ranks: number[];
    missing: number[];
    failedChecks: string[];
  };
  recommendations: Recommendation[];
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const STEP_INDEX: Record<Phase, number> = {
  enter: 0,
  research1: 0,
  position: 1,
  plan: 2,
  monitoring: 2,
  shift: 3,
  research2: 3,
  deviation: 3,
  resolution: 3,
};

const STEP_LABELS = ["YOUR PRODUCT", "VERIFIED LANDSCAPE", "IMPROVEMENT PLAN", "DEVIATION"];

function Stepper({ phase }: { phase: Phase }) {
  const active = STEP_INDEX[phase];
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <span
            className={cn(
              "h-1.5 w-8 rounded-full transition-colors",
              i < active ? "bg-[#D71921]" : i === active ? "bg-[#ff5252]" : "bg-zinc-800",
            )}
          />
          <span
            className={cn(
              "font-dot text-[11px] font-bold uppercase tracking-[0.14em]",
              i === active ? "text-zinc-200" : "text-zinc-600",
            )}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

function ConsoleLine({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p className="line-in font-mono text-xs leading-7 text-zinc-300" style={style}>
      <span className="mr-2 text-[#D71921]">›</span>
      {children}
      <span className="live-dot ml-1.5 inline-block h-2.5 w-1.5 bg-zinc-500 align-middle" />
    </p>
  );
}

function PrimaryCta({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "press flex items-center gap-2 rounded-[3px] border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-transform",
        disabled
          ? "cursor-wait border-zinc-800 bg-zinc-900 text-zinc-500"
          : "border-[#D71921] bg-[#D71921] text-white hover:bg-[#f0252e]",
      )}
    >
      {children}
    </button>
  );
}

export function BusinessFlow(props: BusinessFlowProps) {
  const { collectorId, snapshotIds, factsHashPrefix, topTen, brokenSummary, recommendations } = props;
  const tracked = topTen.find((row) => row.brand === "NimbusDesk");

  const [phase, setPhase] = useState<Phase>("enter");
  const [url, setUrl] = useState("https://nimbusdesk.example.com");
  const [lines, setLines] = useState<string[]>([]);

  const pushLines = useCallback(async (newLines: string[], step = 800) => {
    for (const line of newLines) {
      setLines((prev) => [...prev, line]);
      await sleep(step);
    }
  }, []);

  // DEMO PATH — every beat is a deterministic replay of genuine captured
  // artifacts (baseline j_*, broken j_*, healed j_*). Live runs live in the
  // LIVE zone below the flow, never inside the guided story.
  useEffect(() => {
    if (phase === "research1") {
      setLines([]);
      (async () => {
        await pushLines([`TRIGGERING COLLECTOR ${collectorId}`, `COLLECTING — SNAPSHOT ${snapshotIds.baseline}`], 1000);
        await sleep(1400);
        await pushLines(["10/10 ROWS RETURNED · STRUCTURAL PASS · SEMANTIC PASS"], 500);
        await sleep(700);
        setPhase("position");
      })();
    }
    if (phase === "monitoring") {
      const t = setTimeout(() => setPhase("shift"), 3200);
      return () => clearTimeout(t);
    }
    if (phase === "shift") {
      const t = setTimeout(() => setPhase("research2"), 2800);
      return () => clearTimeout(t);
    }
    if (phase === "research2") {
      setLines([]);
      (async () => {
        await pushLines([`TRIGGERING COLLECTOR ${collectorId} (UNCHANGED)`, `COLLECTING — SNAPSHOT ${snapshotIds.broken}`], 1000);
        await sleep(1500);
        await pushLines(["7/10 ROWS RETURNED · STRUCTURAL PASS"], 600);
        await sleep(500);
        await pushLines(["SEMANTIC CHECKS — 3 BLOCKING · QUARANTINED"], 600);
        await sleep(900);
        setPhase("deviation");
      })();
    }
  }, [phase, collectorId, snapshotIds, pushLines]);

  const startResearch = () => setPhase("research1");

  const restart = () => {
    setPhase("enter");
    setLines([]);
  };

  return (
    <div className="space-y-5">
      {/* header: step progress + replay badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[#1c1c1f] py-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-600">
            SCREEN 01
          </span>
          <Stepper phase={phase} />
        </div>
        <span className="flex items-center gap-2 rounded-[3px] border border-amber-400/40 bg-amber-400/10 px-3 py-1.5">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-amber-300" />
          <span className="font-dot text-[11px] font-bold uppercase tracking-[0.14em] text-amber-300">
            Replay · genuine captured incident inc_001
          </span>
        </span>
      </div>

      {/* STEP 1 — ENTER */}
      {phase === "enter" && (
        <Card className="card-in">
          <CardHeader>
            <CardTitle>STEP 1 — WHERE DO YOU COMPETE?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm leading-6 text-zinc-400">
              Enter your product&rsquo;s URL. Magpie researches the public evidence source that
              ranks your category, verifies every observation, and builds your improvement plan.
              <span className="text-zinc-500">
                {" "}
                Preseeded with the demo brand — any URL maps to NimbusDesk in this controlled
                demonstration.
              </span>
            </p>
            <div className="flex flex-wrap gap-3">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                spellCheck={false}
                className="min-w-72 flex-1 rounded-[3px] border border-[#222] bg-[#111315] px-4 py-2.5 font-mono text-sm text-zinc-100 outline-none focus:border-zinc-500"
                placeholder="https://your-product.com"
              />
              <PrimaryCta onClick={startResearch}>
                <Search className="h-3.5 w-3.5" /> Research my market
              </PrimaryCta>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RESEARCH CONSOLE */}
      {(phase === "research1" || phase === "research2") && (
        <Card className={phase === "research2" ? "border-[#D71921]/50" : undefined}>
          <CardHeader>
            <CardTitle className={phase === "research2" ? "text-[#ff5252]" : undefined}>
              {phase === "research1" ? "RESEARCHING YOUR MARKET" : "SECOND COLLECTION — SOURCE CHANGED"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {lines.map((line, i) => (
              <ConsoleLine key={i} style={{ animationDelay: `${i * 60}ms` }}>{line}</ConsoleLine>
            ))}
          </CardContent>
        </Card>
      )}

      {/* STEP 2 — POSITION */}
      {phase === "position" && (
        <Card className="card-in">
          <CardHeader>
            <CardTitle>
              <span className="flex-1">STEP 2 — VERIFIED LANDSCAPE, TOP 10</span>
              <Badge variant="trusted" className="shrink-0">
                <ShieldCheck className="h-3 w-3" /> TRUSTED
              </Badge>
            </CardTitle>
            <p className="font-mono text-[11px] text-zinc-500">
              snapshot {snapshotIds.healed} · evidence coverage 100%
            </p>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <div className="space-y-3.5 px-5 py-5">
              {topTen.map((row) => {
                const width = 100 - (row.rank - 1) * 7.5;
                const you = row.brand === "NimbusDesk";
                return (
                  <div key={row.rank} className="flex items-center gap-4">
                    <span className="w-9 shrink-0 font-mono text-sm font-bold tabular-nums text-zinc-500">
                      #{row.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className={`text-sm ${you ? "font-bold text-zinc-50" : "font-medium text-zinc-200"}`}>
                          {row.brand}
                          {you && (
                            <span className="ml-2 rounded-[2px] bg-[#D71921] px-1.5 py-0.5 font-dot text-[10px] font-bold tracking-wide text-white">
                              YOU
                            </span>
                          )}
                        </span>
                        <span className="hidden truncate text-xs text-zinc-500 md:block md:max-w-[45%]">
                          {row.evidence_text}
                        </span>
                      </div>
                      <div className="dashed-sep mt-1.5 pb-3">
                        <div className="h-3 overflow-hidden rounded-[2px] bg-[#111315]">
                          <div
                            className={`block-fill h-full rounded-[2px] ${you ? "bg-[#D71921]" : "bg-zinc-500"}`}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1c1c1f] px-5 py-4">
              <p className="text-xs text-zinc-500">
                Bar = verified rank position · every row backed by a genuine Bright Data snapshot
              </p>
              <p className="text-sm text-zinc-300">
                Your verified position:{" "}
                <span className="font-mono text-base font-bold tabular-nums text-zinc-50">
                  #{tracked?.rank}
                </span>
              </p>
            </div>
            <div className="flex justify-end border-t border-[#1c1c1f] px-5 py-4">
              <PrimaryCta onClick={() => setPhase("plan")}>
                Get my improvement plan <ArrowRight className="h-3.5 w-3.5" />
              </PrimaryCta>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3 — PLAN */}
      {phase === "plan" && (
        <Card className="card-in">
          <CardHeader>
            <CardTitle>STEP 3 — YOUR IMPROVEMENT PLAN</CardTitle>
            <p className="text-xs text-zinc-500">
              Structured, deterministic, and linked to the exact competitor evidence that motivates
              each move.
            </p>
          </CardHeader>
          <CardContent className="stagger space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className="card-in rounded-[3px] border border-[#222] bg-[#111315] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-dot text-[11px] font-bold uppercase tracking-[0.14em] text-[#ff5252]">
                    Priority {rec.priority}
                  </p>
                  {rec.evidence && (
                    <p className="font-mono text-[11px] text-zinc-500">
                      cited: #{rec.evidence.rank} {rec.evidence.brand}
                    </p>
                  )}
                </div>
                <p className="mt-2 text-sm font-semibold leading-6 text-zinc-100">{rec.action}</p>
                <p className="mt-1.5 text-sm leading-6 text-zinc-400">
                  <span className="text-zinc-500">Gap — </span>
                  {rec.gap}
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  <span className="text-zinc-500">Why it moves the ranking — </span>
                  {rec.movesRankingBecause}
                </p>
              </div>
            ))}
            <div className="flex justify-end pt-1">
              <PrimaryCta onClick={() => setPhase("monitoring")}>
                Activate continuous monitoring
              </PrimaryCta>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MONITORING */}
      {phase === "monitoring" && (
        <Card className="card-in">
          <CardContent className="flex items-center gap-3 py-6">
            <span className="live-dot inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <p className="font-dot text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              MONITORING ACTIVE — EVERY COLLECTION VALIDATED BEFORE IT REACHES YOU
            </p>
          </CardContent>
        </Card>
      )}

      {/* SHIFT BANNER */}
      {phase === "shift" && (
        <Card className="card-in border-[#D71921]/60">
          <CardContent className="flex items-start gap-3 py-5">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#ff5252]" />
            <div>
              <p className="font-dot text-[11px] font-bold uppercase leading-5 tracking-[0.18em] text-[#ff5252]">
                SOURCE UPDATE DETECTED — TOP VENDORS MOVED INTO A FEATURED CAROUSEL
              </p>
              <p className="mt-1.5 text-sm text-zinc-400">
                &ldquo;Enterprise Support Platforms 2026&rdquo; redesigned. Re-running the same
                collector…
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 4 — DEVIATION */}
      {phase === "deviation" && (
        <Card className="card-in border-[#D71921]/60">
          <CardHeader>
            <CardTitle className="text-[#ff5252]">STEP 4 — DEVIATION DETECTED</CardTitle>
            <p className="font-mono text-[11px] leading-5 text-zinc-500">
              snapshot {snapshotIds.broken} · {brokenSummary.recordCount}/10 rows · schema-valid
            </p>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[3px] border border-red-500/30 bg-red-500/5 p-4">
              <p className="font-dot text-[11px] font-bold uppercase tracking-[0.14em] text-red-400">
                WHAT A NAIVE DASHBOARD WOULD TELL YOU
              </p>
              <p className="mt-2.5 text-sm leading-6 text-zinc-300">
                &ldquo;NimbusDesk disappeared from the top three — reset your content and PR
                strategy immediately.&rdquo;
              </p>
              <p className="mt-3 inline-block rounded-[3px] border border-red-500/50 px-2 py-1 font-dot text-[11px] font-bold uppercase tracking-[0.12em] text-red-400">
                ✕ BLOCKED BY MAGPIE — TRUST ENGINE
              </p>
              <p className="mt-2.5 font-mono text-xs leading-5 text-zinc-500">
                failed checks: {brokenSummary.failedChecks.join(" · ")}
              </p>
            </div>
            <div className="rounded-[3px] border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="font-dot text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-400">
                WHAT MAGPIE DETERMINED
              </p>
              <p className="mt-2.5 text-sm leading-6 text-zinc-300">
                The market did not move. The sensor broke: the collector lost the top three vendors
                when the page redesigned. Your verified position is unchanged and your plan still
                stands.
              </p>
              <p className="mt-3 inline-block rounded-[3px] border border-emerald-500/50 px-2 py-1 font-dot text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-400">
                ✓ LAST VERIFIED SNAPSHOT STILL SERVING · REPAIR READY
              </p>
            </div>
          </CardContent>
          <div className="flex justify-end px-5 pb-4">
            <PrimaryCta onClick={() => setPhase("resolution")}>Watch the repair</PrimaryCta>
          </div>
        </Card>
      )}

      {/* RESOLUTION */}
      {phase === "resolution" && (
        <Card className="card-in border-emerald-500/30">
          <CardHeader>
            <CardTitle className="text-emerald-400">
              <span className="flex-1">RECOVERED — SENSOR REPAIRED, CONTRACT VERIFIED</span>
              <Badge variant="recovered" className="shrink-0">RESOLVED</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {[
                "Quarantine held; verified data kept serving throughout",
                "Diagnosis: page contains all ten vendors — collector missed three",
                "Bright Data Self-Healing proposed a repair — human reviewed and approved",
                "Same Collector ID rerun: 10/10 rows restored",
                "Verification gate: schema unchanged · business-facts hash identical",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] bg-[#111315] font-mono text-[10px] font-bold text-emerald-400">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-6 text-zinc-300">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 rounded-[3px] border border-[#222] bg-[#111315] p-4 font-mono text-xs leading-6 text-zinc-400">
              rows 7 → 10 · collector {collectorId} unchanged · facts hash {factsHashPrefix}…
              identical · downstream changes 0 · priority-1 plan stands
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/incidents/inc_001"
                className="rounded-[3px] border border-zinc-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-300 hover:border-zinc-500 hover:text-zinc-50"
              >
                View full audit →
              </Link>
              <button
                type="button"
                onClick={restart}
                className="flex items-center gap-2 rounded-[3px] border border-zinc-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-300 hover:border-zinc-500 hover:text-zinc-50"
              >
                <RefreshCw className="h-3 w-3" /> Restart demo
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
