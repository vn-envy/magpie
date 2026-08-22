import Link from "next/link";
import { replaySession, incidentStory } from "@/lib/replay/session";

export const dynamic = "force-dynamic";

export default function SignalOverview() {
  const { source, snapshots, collector_id } = replaySession;
  const trustedRows = [...snapshots.healed.rows].sort((a, b) => a.rank - b.rank);
  const tracked = trustedRows.find((r) => r.brand === source.tracked_brand);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-300">
              Magpie · Evidence integrity for GEO
            </p>
            <h1 className="mt-2 text-3xl font-bold">Signal Overview</h1>
          </div>
          <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-mono text-xs text-amber-300">
            REPLAY · genuine artifacts
          </span>
        </header>

        <section className="mb-6 rounded-2xl border border-violet-400/30 bg-violet-400/10 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-violet-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-300">
              Recovered
            </span>
            <span className="text-sm text-slate-300">
              Incident resolved · sensor repaired · serving verified data again
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            <span className="font-semibold text-violet-300">False conclusion prevented:</span>{" "}
            {incidentStory.prevented_conclusion} {incidentStory.containment}
          </p>
          <Link
            href="/incidents/inc_001"
            className="mt-3 inline-block font-mono text-sm text-teal-300 underline decoration-dotted"
          >
            View incident inc_001 →
          </Link>
        </section>

        <section className="mb-8 rounded-2xl border border-teal-400/20 bg-slate-900 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{source.name}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {source.category} · tracked brand:{" "}
                <span className="font-semibold text-teal-300">{source.tracked_brand}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs text-slate-400">current position</p>
              <p className="text-2xl font-bold text-teal-300">#{tracked?.rank}</p>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3 font-mono text-xs text-slate-400 sm:grid-cols-4">
            <div>
              <dt className="text-slate-500">collector_id</dt>
              <dd className="mt-1 truncate text-slate-200">{collector_id}</dd>
            </div>
            <div>
              <dt className="text-slate-500">snapshot_id</dt>
              <dd className="mt-1 truncate text-slate-200">{snapshots.healed.snapshot_id}</dd>
            </div>
            <div>
              <dt className="text-slate-500">rows</dt>
              <dd className="mt-1 text-emerald-400">
                {snapshots.healed.assessment.record_count} / 10
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">business_facts_hash</dt>
              <dd className="mt-1 truncate text-slate-200">
                {snapshots.healed.facts_hash.slice(0, 16)}…
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Trusted source evidence
          </h2>
          <div className="overflow-hidden rounded-2xl border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Evidence</th>
                  <th className="px-4 py-3">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 bg-slate-900/40">
                {trustedRows.map((row) => (
                  <tr
                    key={row.rank}
                    className={row.brand === source.tracked_brand ? "bg-teal-400/5" : ""}
                  >
                    <td className="px-4 py-3 font-mono">{row.rank}</td>
                    <td className="px-4 py-3 font-medium">
                      {row.brand}
                      {row.brand === source.tracked_brand && (
                        <span className="ml-2 rounded-full bg-teal-400/10 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                          YOU
                        </span>
                      )}
                    </td>
                    <td className="max-w-md px-4 py-3 text-slate-400">{row.evidence_text}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {row.outbound_url?.replace("https://", "")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-mono text-xs text-slate-500">
            Every claim above links to the verified evidence snapshot {snapshots.healed.snapshot_id}{" "}
            collected by Bright Data collector {collector_id}.
          </p>
        </section>
      </div>
    </main>
  );
}
