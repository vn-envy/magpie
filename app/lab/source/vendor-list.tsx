"use client";

import { useState } from "react";
import type { Vendor } from "@/lib/fixture/vendors";
import { VendorCard } from "./vendor-card";

// Layout A list: ranks 1-5 ship in the initial HTML; ranks 6-10 render only
// after the Load more interaction, so the collector must click to see them.
export function VendorList({ vendors }: { vendors: Vendor[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? vendors : vendors.slice(0, 5);

  return (
    <section id="ranked-vendors" className="ranked-vendors" aria-labelledby="ranked-heading">
      <h2 id="ranked-heading" className="mb-4 text-xl font-semibold text-slate-900">
        Ranked vendors
      </h2>
      <div className="space-y-5">
        {visible.map((vendor) => (
          <VendorCard key={vendor.rank} vendor={vendor} />
        ))}
      </div>
      {!expanded && (
        <button
          type="button"
          id="load-more"
          className="load-more mt-6 w-full rounded-lg border border-slate-300 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          onClick={() => setExpanded(true)}
        >
          Load more vendors
        </button>
      )}
    </section>
  );
}
