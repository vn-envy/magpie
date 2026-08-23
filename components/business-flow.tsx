"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

type LiveResult = {
  snapshot_id: string;
  verdict: string;
  publish_allowed: boolean;
  record_count: number;
  ranks: number[];
  failed_checks: string[];
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

function ConsoleLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] leading-6 text-zinc-400">
      <span className="text-[#D71921]">›</span> {children}
      <span className="live-dot ml-1 inline-block h-2 w-1.5 bg-zinc-500 align-middle" />
    </p>
  );
}

function PrimaryCta({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-[3px] border px-5 py-2.5 font-dot text-[11px] font-bold uppercase tracking-[0.2em] transition-all",
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
  const [mode, setMode] = useState<"replay" | "live">("replay");
  const [url, setUrl] = useState("https://nimbusdesk.example.com");
  const [lines, setLines] = useState<string[]>([]);
  const [live1, setLive1] = useState<LiveResult | null>(null);
  const [live2, setLive2] = useState<LiveResult | null>(null);
  const [busy, setBusy] = useState(false);
  const guard = useRef("");

  const pushLines = useCallback(async (newLines: string[], step = 800) => {
    for (const line of newLines) {
      setLines((prev) => [...prev, line]);
      await sleep(step);
    }
  }, []);

  // REPLAY auto-advance choreography
  useEffect(() => {
    if (mode !== "replay") return;
    if (phase === "research1") {
      guard.current = "research1";
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
  }, [phase, mode, collectorId, snapshotIds, pushLines]);

  const triggerAndPoll = useCallback(async (): Promise<LiveResult> => {
    const trigger = await fetch("/api/runs", { method: "POST" }).then((r) => r.json());
    const snapshotId: string = trigger.snapshot_id;
    setLines((prev) => [...prev, `COLLECTING — SNAPSHOT ${snapshotId}`]);
    for (;;) {
      await sleep(4000);
      const status = await fetch(`/api/runs/${snapshotId}`).then((r) => r.json());
      if (status.phase === "collecting") continue;
      if (status.phase === "error") throw new Error(status.error ?? "collection failed");
      return {
        snapshot_id: snapshotId,
        verdict: status.verdict,
        publish_allowed: status.publish_allowed,
        record_count: status.record_count,
        ranks: status.ranks ?? [],
        failed_checks: status.failed_checks ?? [],
      };
    }
  }, []);

  const startResearch = async () => {
    setPhase("research1");
    if (mode === "replay") return;
    setBusy(true);
    setLines([]);
    guard.current = "research1-live";
    try {
      const result = await triggerAndPoll();
      setLive1(result);
      await pushLines([`${result.record_count}/10 ROWS · ${result.publish_allowed ? "TRUSTED" : "QUARANTINED"}`], 400);
      setPhase("position");
    } catch {
      setLines((prev) => [...prev, "LIVE COLLECTION FAILED — SWITCH TO REPLAY"]);
    } finally {
      setBusy(false);
    }
  };

  const startMonitoring = () => setPhase("monitoring");

  const runSecond = async () => {
    setPhase("research2");
    if (mode === "replay") return;
    setBusy(true);
    setLines([]);
    try {
      await fetch("/api/demo/shift-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layout_mode: "featured_carousel" }),
      });
      setLines((prev) => [...prev, "SOURCE UPDATED — REDESIGN DETECTED (REV +1)"]);
      await sleep(6000);
      const result = await triggerAndPoll();
      setLive2(result);
      await pushLines([`${result.record_count}/10 ROWS · ${result.publish_allowed ? "TRUSTED" : "QUARANTINED — " + result.failed_checks.join(", ")}`], 400);
      setPhase("deviation");
    } catch {
      setLines((prev) => [...prev, "LIVE COLLECTION FAILED — SWITCH TO REPLAY"]);
    } finally {
      setBusy(false);
    }
  };

  const finish = () => {
    setPhase("resolution");
    if (mode === "live") {
      void fetch("/api/demo/shift-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layout_mode: "legacy_cards" }),
      });
    }
  };

  const restart = () => {
    setPhase("enter");
    setLines([]);
    setLive1(null);
    setLive2(null);
  };

  const secondSnapshot = mode === "live" && live2 ? live2.snapshot_id : snapshotIds.broken;
  const secondRows = mode === "live" && live2 ? live2.record_count : brokenSummary.recordCount;
  const secondFailed =
    mode === "live" && live2 ? live2.failed_checks : brokenSummary.failedChecks;

  return (
    <div className="space-y-6">
      {/* mode toggle */}
      <div className="flex items-center justify-between">
        <p className="font-dot text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
          BUSINESS VIEW · GEO EVIDENCE INTELLIGENCE
        </p>
        <div className="flex gap-1 rounded-[3px] border border-zinc-800 p-1">
          {(["replay", "live"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "rounded-[2px] px-3 py-1 font-dot text-[9px] font-bold uppercase tracking-[0.2em] transition-colors",
                mode === m ? "bg-[#D71921] text-white" : "text-zinc-500 hover:text-zinc-200",
              )}
            >
              {m === "live" ? "● LIVE" : "REPLAY"}
            </button>
          ))}
        </div>
      </div>

      {/* ENTER */}
      {phase === "enter" && (
        <Card>
          <CardHeader>
            <CardTitle>STEP 1 — WHERE DO YOU COMPETE?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm leading-6 text-zinc-400">
              Enter your product&rsquo;s URL. Magpie researches the public evidence source that
              ranks your category, verifies every observation, and builds your improvement plan.
              <span className="text-zinc-500"> (Preseeded with the demo brand — any URL maps to NimbusDesk in this controlled demonstration.)</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                spellCheck={false}
                className="min-w-72 flex-1 rounded-[3px] border border-zinc-800 bg-black px-4 py-2.5 font-mono text-sm text-zinc-100 outline-none focus:border-zinc-500"
                placeholder="https://your-product.com"
              />
              <PrimaryCta onClick={startResearch} disabled={busy}>
                <span className="flex items-center gap-2">
                  <Search className="h-3.5 w-3.5" /> RESEARCH MY MARKET
                </span>
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
              <ConsoleLine key={i}>{line}</ConsoleLine>
            ))}
          </CardContent>
        </Card>
      )}

      {/* POSITION */}
      {phase === "position" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              VERIFIED LANDSCAPE — TOP 10
              <Badge variant="trusted">
                <ShieldCheck className="h-3 w-3" />
                {mode === "live" && live1 ? live1.snapshot_id : snapshotIds.healed} · TRUSTED
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <table className="w-full text-sm">
              <tbody>
                {topTen.map((row) => (
                  <tr
                    key={row.rank}
                    className={cn(
                      "border-b border-zinc-900",
                      row.brand === "NimbusDesk" && "bg-zinc-900/70",
                    )}
                  >
                    <td className="w-12 px-5 py-2.5 font-mono text-zinc-500">#{row.rank}</td>
                    <td className="py-2.5 pr-4 font-medium">
                      {row.brand}
                      {row.brand === "NimbusDesk" && (
                        <span className="ml-2 font-dot text-[9px] font-bold text-[#ff5252]">YOU</span>
                      )}
                    </td>
                    <td className="py-2.5 pr-5 text-xs text-zinc-500">{row.evidence_text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 px-5 py-4">
              <p className="font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                YOUR VERIFIED POSITION: <span className="text-zinc-50">#{tracked?.rank}</span> ·
                EVIDENCE COVERAGE 100%
              </p>
              <PrimaryCta onClick={() => setPhase("plan")}>
                GET MY IMPROVEMENT PLAN <ArrowRight className="inline h-3.5 w-3.5" />
              </PrimaryCta>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PLAN */}
      {phase === "plan" && (
        <Card>
          <CardHeader>
            <CardTitle>YOUR PLAN — STRUCTURED, EVIDENCE-LINKED RECOMMENDATIONS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className="rounded-[4px] border border-zinc-800 bg-black p-4">
                <div className="flex items-center justify-between">
                  <p className="font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5252]">
                    PRIORITY {rec.priority}
                  </p>
                  {rec.evidence && (
                    <p className="font-mono text-[10px] text-zinc-600">
                      cited: #{rec.evidence.rank} {rec.evidence.brand}
                    </p>
                  )}
                </div>
                <p className="mt-2 text-sm font-semibold text-zinc-100">{rec.action}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  <span className="text-zinc-500">Gap:</span> {rec.gap}
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  <span className="text-zinc-500">Why it moves the ranking:</span>{" "}
                  {rec.movesRankingBecause}
                </p>
              </div>
            ))}
            <div className="flex justify-end pt-1">
              <PrimaryCta onClick={startMonitoring}>ACTIVATE CONTINUOUS MONITORING</PrimaryCta>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MONITORING */}
      {phase === "monitoring" && (
        <Card>
          <CardContent className="flex items-center gap-3 py-6">
            <span className="live-dot inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <p className="font-dot text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              MONITORING ACTIVE — EVERY COLLECTION VALIDATED BEFORE IT REACHES YOU
            </p>
          </CardContent>
        </Card>
      )}

      {/* SHIFT BANNER */}
      {phase === "shift" && (
        <Card className="border-[#D71921]/60">
          <CardContent className="flex items-start gap-3 py-5">
            <TriangleAlert className="mt-1 h-5 w-5 text-[#ff5252]" />
            <div>
              <p className="font-dot text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff5252]">
                SOURCE UPDATE DETECTED — &ldquo;ENTERPRISE SUPPORT PLATFORMS 2026&rdquo; REDESIGNED
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Top vendors moved into a featured carousel. Re-running the same collector…
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DEVIATION */}
      {phase === "deviation" && (
        <div className="space-y-4">
          <Card className="border-[#D71921]/60">
            <CardHeader>
              <CardTitle className="text-[#ff5252]">
                DEVIATION — {secondRows}/10 ROWS FROM SNAPSHOT {secondSnapshot}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[4px] border border-red-500/30 bg-red-500/5 p-4">
                <p className="font-dot text-[10px] font-bold uppercase tracking-[0.15em] text-red-400">
                  WHAT A NAIVE DASHBOARD WOULD TELL YOU
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  &ldquo;NimbusDesk disappeared from the top three — reset your content and PR
                  strategy immediately.&rdquo;
                </p>
                <p className="mt-3 inline-block rounded-[3px] border border-red-500/50 px-2 py-1 font-dot text-[9px] font-bold uppercase tracking-[0.15em] text-red-400">
                  ✕ BLOCKED BY MAGPIE — TRUST ENGINE
                </p>
                <p className="mt-2 font-mono text-[10px] leading-5 text-zinc-600">
                  failed checks: {secondFailed.join(" · ")}
                </p>
              </div>
              <div className="rounded-[4px] border border-emerald-500/30 bg-emerald-500/5 p-4">
                <p className="font-dot text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400">
                  WHAT MAGPIE DETERMINED
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  The market did not move. The sensor broke: the collector lost the top three
                  vendors when the page redesigned. Your verified position is unchanged and your
                  plan still stands.
                </p>
                <p className="mt-3 inline-block rounded-[3px] border border-emerald-500/50 px-2 py-1 font-dot text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-400">
                  ✓ LAST VERIFIED SNAPSHOT STILL SERVING · INCIDENT OPENED · REPAIR READY
                </p>
              </div>
            </CardContent>
            <div className="flex justify-end px-5 pb-4">
              <PrimaryCta onClick={finish}>WATCH THE REPAIR</PrimaryCta>
            </div>
          </Card>
        </div>
      )}

      {/* RESOLUTION */}
      {phase === "resolution" && (
        <Card className="border-emerald-500/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-emerald-400">
              RECOVERED — SENSOR REPAIRED, CONTRACT VERIFIED
              <Badge variant="recovered">RESOLVED</Badge>
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
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] bg-zinc-900 font-dot text-[9px] font-bold text-emerald-400">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-6 text-zinc-300">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 rounded-[4px] border border-zinc-800 bg-black p-4 font-mono text-xs leading-6 text-zinc-400">
              rows 7 → 10 · collector {collectorId} unchanged · facts hash {factsHashPrefix}…
              identical · downstream changes 0 · recommendation: PRIORITY 1 plan stands
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/incidents/inc_001"
                className="rounded-[3px] border border-zinc-700 px-4 py-2 font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 hover:border-zinc-500 hover:text-zinc-50"
              >
                VIEW FULL AUDIT →
              </Link>
              <button
                type="button"
                onClick={restart}
                className="flex items-center gap-2 rounded-[3px] border border-zinc-700 px-4 py-2 font-dot text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 hover:border-zinc-500 hover:text-zinc-50"
              >
                <RefreshCw className="h-3 w-3" /> RESTART DEMO
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
