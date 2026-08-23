"use client";

import { useState } from "react";
import { Globe, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ScanResult = {
  url: string;
  title: string | null;
  stats: { words: number; headings: number; links: number; sample_links: string[] };
  preview: string;
  fetched_at: string;
  engine: string;
};

// Open-ended live run: any public URL, fetched through Bright Data Web
// Unlocker on demand — for judges to test the API thesis themselves.
export function UrlScanner() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scan = async () => {
    if (!url.trim()) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "scan failed");
      setResult(body);
    } catch (e) {
      setError(e instanceof Error ? e.message : "scan failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex-1">TRY ANY PUBLIC URL — OPEN-ENDED LIVE RUN</span>
          <Badge variant="accent" className="shrink-0">● UNLOCKER</Badge>
        </CardTitle>
        <p className="text-xs leading-5 text-zinc-500">
          Not limited to our sources: fetch any public page right now through Bright Data Web
          Unlocker — the same API-first thesis, one shot.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && scan()}
            spellCheck={false}
            placeholder="news.ycombinator.com or any public URL"
            className="min-w-64 flex-1 rounded-[3px] border border-[#222] bg-[#111315] px-4 py-2.5 font-mono text-sm text-zinc-100 outline-none focus:border-zinc-500"
          />
          <button
            type="button"
            onClick={scan}
            disabled={busy}
            className={cn(
              "flex items-center gap-2 rounded-[3px] border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all",
              busy
                ? "cursor-wait border-zinc-800 bg-zinc-900 text-zinc-500"
                : "border-[#D71921] bg-[#D71921] text-white hover:bg-[#f0252e]",
            )}
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
            {busy ? "Unlocking…" : "Run live fetch"}
          </button>
        </div>

        {error && (
          <p className="mt-3 font-mono text-xs text-red-400">
            {error === "invalid_public_url"
              ? "Enter a valid public http(s) URL — private and local addresses are blocked."
              : `Error: ${error}`}
          </p>
        )}

        {result && (
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="max-w-full truncate text-sm font-semibold text-zinc-100">
                {result.title ?? result.url}
              </p>
              <span className="font-mono text-[11px] text-zinc-500">{result.url}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "WORDS", value: result.stats.words.toLocaleString() },
                { label: "HEADINGS", value: result.stats.headings },
                { label: "LINKS", value: result.stats.links },
              ].map((stat) => (
                <div key={stat.label} className="rounded-[3px] border border-[#222] bg-[#111315] p-3">
                  <p className="font-dot text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                    {stat.label}
                  </p>
                  <p className="mt-1 font-mono text-lg font-bold tabular-nums text-zinc-50">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
            {result.stats.sample_links.length > 0 && (
              <div className="space-y-1">
                {result.stats.sample_links.map((link) => (
                  <p key={link} className="truncate font-mono text-[11px] text-zinc-500">
                    → {link}
                  </p>
                ))}
              </div>
            )}
            <pre className="max-h-44 overflow-y-auto whitespace-pre-wrap rounded-[3px] border border-[#222] bg-[#111315] p-3 font-mono text-[11px] leading-5 text-zinc-400">
              {result.preview}
            </pre>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-600">
              {result.engine} · {result.fetched_at.replace("T", " ").slice(0, 19)} UTC
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
