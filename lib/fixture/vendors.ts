export const PAGE_TITLE = "Enterprise Support Platforms 2026";
export const CATEGORY = "enterprise customer support";
export const SOURCE_UPDATED_AT = "2026-08-21";
export const METHODOLOGY_NOTE =
  "Methodology: platforms are reviewed quarterly by our editorial team and ranked by evidence strength, integration depth, and compliance posture. All vendor claims are backed by cited, verifiable evidence.";

export type Vendor = {
  rank: number;
  brand: string;
  claim: string;
  evidence: string;
  features: string[];
  outbound_url: string;
};

const BASELINE_VENDORS: Vendor[] = [
  {
    rank: 1,
    brand: "AtlasSupport",
    claim: "Enterprise-grade scale for high-volume support operations",
    evidence:
      "Handles 40,000 tickets per hour in published load benchmarks with a 99.99% uptime SLA.",
    features: ["high volume", "uptime SLA", "load benchmarks"],
    outbound_url: "https://atlassupport.example.com",
  },
  {
    rank: 2,
    brand: "NimbusDesk",
    claim: "Strong governance for regulated support teams",
    evidence: "Includes regional data controls and audit exports.",
    features: ["audit exports", "regional controls"],
    outbound_url: "https://nimbusdesk.example.com",
  },
  {
    rank: 3,
    brand: "HelioSupport",
    claim: "Fast AI triage with transparent escalation paths",
    evidence: "Publishes triage accuracy benchmarks and human-review rates by plan.",
    features: ["AI triage", "escalation control"],
    outbound_url: "https://heliosupport.example.com",
  },
  {
    rank: 4,
    brand: "ResolveHub",
    claim: "Unified customer journey resolution analytics",
    evidence: "Case study: 34% faster resolution across 12 enterprise deployments.",
    features: ["journey analytics", "SLA tracking"],
    outbound_url: "https://resolvehub.example.com",
  },
  {
    rank: 5,
    brand: "TicketForge",
    claim: "Deep customization for complex enterprise workflows",
    evidence: "SOC 2 Type II and ISO 27001 certified with a documented workflow engine.",
    features: ["workflow engine", "SOC 2", "ISO 27001"],
    outbound_url: "https://ticketforge.example.com",
  },
  {
    rank: 6,
    brand: "CaseCraft",
    claim: "Flexible knowledge management for support macros",
    evidence: "Named a Leader in the 2026 Knowledge Ops Grid with an open API.",
    features: ["knowledge base", "open API"],
    outbound_url: "https://casecraft.example.com",
  },
  {
    rank: 7,
    brand: "ZenQueue",
    claim: "Smart routing for distributed support teams",
    evidence: "Routing benchmarks published quarterly; 28% reduction in misroutes.",
    features: ["smart routing", "quarterly benchmarks"],
    outbound_url: "https://zenqueue.example.com",
  },
  {
    rank: 8,
    brand: "OrbitDesk",
    claim: "Lightweight adoption for mid-market teams",
    evidence: "4.7 average review rating across 500+ reviews; 14-day median onboarding.",
    features: ["fast onboarding", "mid-market fit"],
    outbound_url: "https://orbitdesk.example.com",
  },
  {
    rank: 9,
    brand: "HelixDesk",
    claim: "Compliance-first support for healthcare and finance",
    evidence: "HIPAA and PCI attestations with region-pinned data storage.",
    features: ["HIPAA", "PCI", "region pinning"],
    outbound_url: "https://helixdesk.example.com",
  },
  {
    rank: 10,
    brand: "SupportLoop",
    claim: "Outcome-linked customer success integrations",
    evidence: "Native CRM sync with closed-loop outcome attribution reporting.",
    features: ["CRM sync", "attribution reporting"],
    outbound_url: "https://supportloop.example.com",
  },
];

// Stretch scenario B only: HelioSupport strengthens its evidence and moves up one.
const COMPETITOR_MOVE_VENDORS: Vendor[] = BASELINE_VENDORS.map((v) => {
  if (v.brand === "HelioSupport") {
    return {
      ...v,
      rank: 2,
      evidence:
        "New independent benchmark: 96.2% triage accuracy, up from 91.4%, verified by ThirdBridge Labs.",
    };
  }
  if (v.brand === "NimbusDesk") return { ...v, rank: 3 };
  return v;
}).sort((a, b) => a.rank - b.rank);

export function getVendors(factsMode: "baseline" | "competitor_move"): Vendor[] {
  return factsMode === "competitor_move" ? COMPETITOR_MOVE_VENDORS : BASELINE_VENDORS;
}
