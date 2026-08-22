"use client";

import { useState } from "react";
import type { Vendor } from "@/lib/fixture/vendors";

// Layout B carousel for ranks 1-3: different markup from VendorCard, and each
// slide's evidence renders only after its panel is expanded, so the unhealed
// collector (built against Layout A) can neither match nor read them.
export function FeaturedCarousel({ vendors }: { vendors: Vendor[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const active = vendors[activeIndex];

  return (
    <section id="featured-carousel" className="featured-carousel" aria-labelledby="featured-heading">
      <h2 id="featured-heading" className="mb-4 text-xl font-semibold text-slate-900">
        Editor&rsquo;s featured platforms
      </h2>
      <div className="carousel-track relative overflow-hidden rounded-xl border border-indigo-100 bg-indigo-50 p-8">
        <div className="carousel-slide flex flex-col items-center text-center" data-featured-rank={active.rank}>
          <span className="position-chip rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            No. {active.rank} featured
          </span>
          <h2 className="featured-name mt-4 text-2xl font-bold text-slate-900">{active.brand}</h2>
          <p className="featured-tagline mt-2 text-sm text-slate-600">{active.claim}</p>

          <button
            type="button"
            className="toggle-evidence mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm"
            aria-expanded={expanded[active.rank] ?? false}
            onClick={() => setExpanded((prev) => ({ ...prev, [active.rank]: !prev[active.rank] }))}
          >
            {expanded[active.rank] ? "Hide evidence" : "Show evidence"}
          </button>

          {expanded[active.rank] && (
            <div className="evidence-drawer mt-4 rounded-lg bg-white p-4 text-left shadow-inner">
              <p className="featured-evidence text-sm leading-6 text-slate-700">{active.evidence}</p>
              <ul className="featured-features mt-2 flex flex-wrap justify-center gap-2">
                {active.features.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                className="featured-link mt-2 inline-block text-sm font-semibold text-indigo-600 underline"
                href={active.outbound_url}
              >
                Visit {active.brand}
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            className="carousel-prev rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm disabled:opacity-40"
            disabled={activeIndex === 0}
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
          >
            &larr; Previous
          </button>
          <div className="text-xs font-medium text-slate-400">
            {activeIndex + 1} of {vendors.length}
          </div>
          <button
            type="button"
            className="carousel-next rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm disabled:opacity-40"
            disabled={activeIndex === vendors.length - 1}
            onClick={() => setActiveIndex((i) => Math.min(vendors.length - 1, i + 1))}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}
