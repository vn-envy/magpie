import type { Vendor } from "@/lib/fixture/vendors";

// The original (Layout A) card markup. Ranks 4-10 keep this exact structure in
// Layout B so the unhealed collector still parses them.
export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <article className="vendor-card rounded-lg border border-slate-200 p-5" data-rank={vendor.rank}>
      <div className="flex items-center gap-3">
        <span className="rank-badge flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
          {vendor.rank}
        </span>
        <h3 className="vendor-name text-lg font-semibold text-slate-900">{vendor.brand}</h3>
      </div>
      <p className="vendor-claim mt-3 text-sm font-medium text-slate-700">{vendor.claim}</p>
      <p className="vendor-evidence mt-2 text-sm leading-6 text-slate-600">{vendor.evidence}</p>
      <ul className="feature-tags mt-3 flex flex-wrap gap-2">
        {vendor.features.map((feature) => (
          <li
            key={feature}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
          >
            {feature}
          </li>
        ))}
      </ul>
      <a
        className="vendor-link mt-3 inline-block text-sm font-semibold text-indigo-600 underline"
        href={vendor.outbound_url}
      >
        Visit {vendor.brand}
      </a>
    </article>
  );
}
