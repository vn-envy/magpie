import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RUNS } from "@/lib/replay/runs";

export const dynamic = "force-dynamic";

function VerdictBadge({ verdict }: { verdict: string }) {
  if (verdict === "TRUSTED") return <Badge variant="trusted">TRUSTED</Badge>;
  if (verdict === "QUARANTINED") return <Badge variant="quarantined">QUARANTINED</Badge>;
  if (verdict === "TRUSTED_CHANGE") return <Badge variant="recovered">TRUSTED CHANGE</Badge>;
  if (verdict === "EMPTY") return <Badge variant="quarantined">EMPTY</Badge>;
  return <Badge variant="outline">DIAGNOSTIC</Badge>;
}

export default function RunLedger() {
  const trusted = RUNS.filter((r) => r.verdict === "TRUSTED" || r.verdict === "TRUSTED_CHANGE").length;
  const blocked = RUNS.filter((r) => r.verdict === "QUARANTINED" || r.verdict === "EMPTY").length;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-dot text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
            COLLECTION HISTORY
          </p>
          <h1 className="mt-1 font-dot text-3xl font-bold tracking-wider">RUN LEDGER</h1>
        </div>
        <div className="flex gap-6 font-dot text-[10px] font-bold uppercase tracking-[0.2em]">
          <span className="text-zinc-500">
            TOTAL <span className="text-zinc-100">{RUNS.length}</span>
          </span>
          <span className="text-zinc-500">
            PUBLISHED <span className="text-emerald-400">{trusted}</span>
          </span>
          <span className="text-zinc-500">
            BLOCKED <span className="text-red-400">{blocked}</span>
          </span>
        </div>
      </header>

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
                  {run.captured_at ? new Date(run.captured_at).toISOString().replace("T", " ").slice(0, 19) : "—"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-zinc-400">{run.note}</p>
              <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-zinc-500">
                <span>
                  fixture <span className="text-zinc-300">{run.layout_mode}</span> ·{" "}
                  <span className="text-zinc-300">{run.facts_mode}</span>
                  {run.fixture_revision !== null && ` · rev ${run.fixture_revision}`}
                </span>
                <span>
                  rows <span className="text-zinc-300">{run.rows}</span>
                </span>
                <span>
                  ranks{" "}
                  <span className="text-zinc-300">
                    {run.ranks.length
                      ? `${Math.min(...run.ranks)}–${Math.max(...run.ranks)}`
                      : "—"}
                  </span>
                </span>
                <span>
                  failed checks{" "}
                  <span className={run.failed_checks.length ? "text-red-400" : "text-zinc-300"}>
                    {run.failed_checks.length ? run.failed_checks.join(", ") : "none"}
                  </span>
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
