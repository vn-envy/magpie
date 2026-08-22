import { notFound } from "next/navigation";
import { replaySession, incidentStory } from "@/lib/replay/session";

export const dynamic = "force-dynamic";

const HEAL_TIMELINE = [
  { status: "done", label: "OPEN — semantic failure detected" },
  { status: "done", label: "DIAGNOSING — page inspection confirms extraction drift" },
  { status: "done", label: "READY_TO_HEAL — repair prompt generated" },
  { status: "done", label: "HEALING — Codex runs bdata scraper heal" },
  { status: "done", label: "AWAITING_APPROVAL — human reviews the proposed diff" },
  { status: "done", label: "APPLYING_REPAIR — approved, auto-saved to production" },
  { status: "done", label: "VERIFYING — same Collector ID rerun against the changed page" },
  { status: "done", label: "RESOLVED — contract verified, data released downstream" },
];

function RankList({
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
    <ul className={`font-mono text-xs leading-6 ${color}`}>
      {rows.map((row) => (
        <li key={row.rank}>
          #{row.rank} {row.brand}
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
  const broken = snapshots.broken;
  const baseline = snapshots.baseline;
  const healed = snapshots.healed;
  const blocking = broken.assessment.signals.filter((s) => s.severity === "blocking");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-300">
            Magpie · Incident Room
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">inc_001</h1>
            <span className="rounded-full bg-red-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-400">
              Extraction drift
            </span>
            <span className="rounded-full bg-violet-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-300">
              Resolved
            </span>
          </div>
          <p className="mt-2 font-mono text-xs text-slate-500">
            source_support_platforms · collector {collector_id}
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-red-400/30 bg-red-400/5 p-6">
          <p className="text-lg font-bold tracking-wide text-red-300">
            RUN SUCCEEDED. JSON VALID. BUSINESS CONCLUSION WRONG.
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The page redesigned: the top three vendors moved into a JavaScript featured carousel
            and their evidence behind expandable panels. The collector still succeeded and returned
            schema-valid JSON — but only seven of ten vendors.
          </p>
          <div className="mt-4 rounded-xl border border-slate-700/60 bg-slate-900/70 p-4 text-sm leading-6">
            <p className="font-semibold text-slate-200">Latest run quarantined</p>
            <p className="mt-1 text-slate-400">
              The collector returned ranks 4–10 while the last trusted observation contained ranks
              1–10. Publishing this run could falsely report a source-evidence loss. The last
              trusted snapshot kept powering the dashboard while the collector was reviewed.
            </p>
          </div>
          <p className="mt-4 text-sm text-slate-300">
            <span className="font-semibold text-red-300">Prevented false conclusion:</span>{" "}
            {incidentStory.prevented_conclusion}
            <span className="font-semibold text-violet-300"> Actual cause:</span>{" "}
            {incidentStory.actual_cause}
          </p>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-400/20 bg-slate-900 p-5">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold text-emerald-400">TRUSTED BASELINE</h2>
              <span className="font-mono text-[10px] text-slate-500">
                {baseline.snapshot_id}
              </span>
            </div>
            <p className="font-mono text-3xl font-bold text-emerald-400">
              {baseline.assessment.record_count}
              <span className="text-base text-slate-500"> /10 rows</span>
            </p>
            <p className="mt-1 font-mono text-xs text-slate-500">
              ranks 1–10 · facts {baseline.facts_hash.slice(0, 12)}…
            </p>
            <div className="mt-3">
              <RankList rows={[...baseline.rows].sort((a, b) => a.rank - b.rank)} tone="trusted" />
            </div>
          </div>

          <div className="rounded-2xl border border-red-400/30 bg-slate-900 p-5">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold text-red-400">QUARANTINED RUN</h2>
              <span className="font-mono text-[10px] text-slate-500">{broken.snapshot_id}</span>
            </div>
            <p className="font-mono text-3xl font-bold text-red-400">
              {broken.assessment.record_count}
              <span className="text-base text-slate-500"> /10 rows</span>
            </p>
            <p className="mt-1 font-mono text-xs text-slate-500">
              schema-valid · ranks 4–10 · publish denied
            </p>
            <div className="mt-3">
              <RankList rows={[...broken.rows].sort((a, b) => a.rank - b.rank)} tone="broken" />
            </div>
          </div>

          <div className="rounded-2xl border border-violet-400/30 bg-slate-900 p-5">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold text-violet-300">RECOVERED</h2>
              <span className="font-mono text-[10px] text-slate-500">{healed.snapshot_id}</span>
            </div>
            <p className="font-mono text-3xl font-bold text-violet-300">
              {healed.assessment.record_count}
              <span className="text-base text-slate-500"> /10 rows</span>
            </p>
            <p className="mt-1 font-mono text-xs text-slate-500">
              ranks 1–10 · facts {healed.facts_hash.slice(0, 12)}…
            </p>
            <div className="mt-3">
              <RankList rows={[...healed.rows].sort((a, b) => a.rank - b.rank)} tone="healed" />
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Failed checks (deterministic, no LLM)
            </h2>
            <ul className="space-y-2">
              {blocking.map((signal) => (
                <li key={signal.name} className="rounded-lg bg-red-400/5 p-3 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="font-bold text-red-400">{signal.name}</span>
                    <span className="text-slate-500">
                      expected {signal.expected} · observed {signal.observed}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-400">{signal.message}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Post-heal verification gate
            </h2>
            <table className="w-full font-mono text-xs">
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="py-2 text-slate-400">collector_id</td>
                  <td className="py-2 text-emerald-400">unchanged ✓</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">app contract (SourceEvidenceRowV1)</td>
                  <td className="py-2 text-emerald-400">unchanged ✓</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">business_facts_hash</td>
                  <td className="py-2 text-emerald-400">
                    {baseline.facts_hash === healed.facts_hash ? "identical ✓" : "MISMATCH ✗"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">rows restored</td>
                  <td className="py-2 text-emerald-400">7 → 10 ✓</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">downstream app changes</td>
                  <td className="py-2 text-emerald-400">0</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">human approval</td>
                  <td className="py-2 text-emerald-400">recorded ✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Healing timeline — Codex + Bright Data Self-Healing, human-gated
          </h2>
          <ol className="space-y-2">
            {HEAL_TIMELINE.map((step, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-400/20 text-[10px] font-bold text-violet-300">
                  {i + 1}
                </span>
                <span className="font-mono text-xs text-slate-300">{step.label}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
