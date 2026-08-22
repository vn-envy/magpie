import type { Metadata } from "next";
import { getFixtureState } from "@/lib/fixture/state";
import {
  PAGE_TITLE,
  CATEGORY,
  SOURCE_UPDATED_AT,
  METHODOLOGY_NOTE,
  getVendors,
} from "@/lib/fixture/vendors";
import { VendorCard } from "./vendor-card";
import { VendorList } from "./vendor-list";
import { FeaturedCarousel } from "./featured-carousel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: METHODOLOGY_NOTE,
  robots: { index: false },
};

export default async function SourceShiftLab() {
  const state = await getFixtureState();
  const vendors = getVendors(state.facts_mode);
  const featured = vendors.slice(0, 3);
  const rest = vendors.slice(3);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 font-s text-slate-800">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          Source Shift Lab · Enterprise Software Review
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{PAGE_TITLE}</h1>
        <p className="mt-3 text-sm text-slate-500">
          Category: {CATEGORY} · Last updated: {SOURCE_UPDATED_AT}
        </p>
      </header>

      <p className="mb-8 text-sm leading-6 text-slate-600">{METHODOLOGY_NOTE}</p>

      {state.layout_mode === "legacy_cards" ? (
        <VendorList vendors={vendors} />
      ) : (
        <>
          <FeaturedCarousel vendors={featured} />
          <section id="ranked-vendors" className="ranked-vendors mt-10" aria-labelledby="ranked-heading">
            <h2 id="ranked-heading" className="mb-4 text-xl font-semibold text-slate-900">
              More ranked vendors
            </h2>
            <div className="space-y-5">
              {rest.map((vendor) => (
                <VendorCard key={vendor.rank} vendor={vendor} />
              ))}
            </div>
          </section>
        </>
      )}

      <footer className="mt-12 border-t border-slate-200 pt-4 text-xs text-slate-400">
        Synthetic public fixture for scraper-reliability testing · Controlled chaos fixture ·
        Revision {state.revision} · layout: {state.layout_mode} · facts: {state.facts_mode}
      </footer>
    </main>
  );
}
