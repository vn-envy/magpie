"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Phase = "idle" | "triggering" | "collecting" | "validating" | "done" | "error";

type LiveResult = {
  verdict: string;
  publish_allowed: boolean;
  record_count: number;
  ranks: number[];
  failed_checks: string[];
  classification: string;
};

export function LiveRun() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [snapshotId, setSnapshotId] = useState<string | null>(null);
  const [result, setResult] = useState<LiveResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimers = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    pollRef.current = null;
    timerRef.current = null;
  }, []);

  useEffect(() => stopTimers, [stopTimers]);

  const start = async () => {
    setPhase("triggering");
    setError(null);
    setResult(null);
    setSnapshotId(null);
    setElapsed(0);
    try {
      const response = await fetch("/api/runs", { method: "POST" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "trigger failed");
      setSnapshotId(body.snapshot_id);
      setPhase("collecting");
      const started = Date.now();
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000);
      pollRef.current = setInterval(async () => {
        const status = await fetch(`/api/runs/${body.snapshot_id}`).then((r) => r.json());
        if (status.phase === "collecting") return;
        stopTimers();
        if (status.phase === "error") {
          setPhase("error");
          setError(status.error ?? "collection failed");
          return;
        }
        setPhase("validating");
        await new Promise((r) => setTimeout(r, 900)); // let the verdict land visibly
        setResult(status);
        setPhase("done");
      }, 4000);
    } catch (e) {
      stopTimers();
      setPhase("error");
      setError(e instanceof Error ? e.message : "trigger failed");
    }
  };

  const busy = phase === "triggering" || phase === "collecting" || phase === "validating";

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={start}
        disabled={busy}
        className={cn(
          "rounded-[3px] border px-5 py-2.5 font-dot text-[11px] font-bold uppercase tracking-[0.2em] transition-all",
          busy
            ? "cursor-wait border-zinc-800 bg-zinc-900 text-zinc-500"
            : "border-[#D71921] bg-[#D71921] text-white hover:bg-[#f0252e]",
        )}
      >
        {busy ? "COLLECTING…" : "INITIATE LIVE COLLECTION"}
      </button>

      <div className="flex min-h-6 flex-wrap items-center gap-3 font-dot text-[10px] font-bold uppercase tracking-[0.2em]">
        {phase === "idle" && <span className="text-zinc-500">LIVE BRIGHT DATA RUN · NOT A REPLAY</span>}
        {phase === "triggering" && <span className="text-zinc-400">TRIGGERING COLLECTOR…</span>}
        {phase === "collecting" && (
          <span className="flex items-center gap-2 text-zinc-300">
            <span className="live-dot inline-block h-2 w-2 rounded-full bg-[#D71921]" />
            COLLECTING {snapshotId ? `· ${snapshotId}` : ""} · {elapsed}s
          </span>
        )}
        {phase === "validating" && <span className="text-amber-400">RUNNING TRUST ENGINE…</span>}
        {phase === "error" && (
          <span className="text-red-400">ERROR — {error}</span>
        )}
        {phase === "done" && result && (
          <>
            <Badge variant={result.publish_allowed ? "trusted" : "quarantined"}>
              {result.publish_allowed ? "TRUSTED · PUBLISHED" : "QUARANTINED · BLOCKED"}
            </Badge>
            <span className="font-mono text-xs normal-case tracking-normal text-zinc-400">
              {snapshotId} · {result.record_count} rows · ranks{" "}
              {result.ranks.length ? `${Math.min(...result.ranks)}–${Math.max(...result.ranks)}` : "—"}
              {result.failed_checks.length > 0 && ` · failed: ${result.failed_checks.join(", ")}`}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
