import type { SourceEvidenceRowV1 } from "@/lib/contracts/source-evidence-v1";

export type Recommendation = {
  id: string;
  priority: 1 | 2 | 3;
  gap: string;
  action: string;
  movesRankingBecause: string;
  evidence: { brand: string; rank: number; evidence_text: string } | null;
};

// Deterministic, evidence-linked improvement plan: compare the tracked
// brand's evidence against what competitors actually publish on the ranked
// source. No LLM — every recommendation cites a competitor's evidence row.
export function buildRecommendations(
  tracked: SourceEvidenceRowV1,
  rows: SourceEvidenceRowV1[],
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const ahead = rows.filter((row) => row.rank < tracked.rank);
  const myEvidence = `${tracked.evidence_text} ${tracked.features.join(" ")}`.toLowerCase();

  const benchmarker = rows.find((row) => /benchmark/i.test(row.evidence_text));
  if (benchmarker && !/benchmark/i.test(myEvidence)) {
    recommendations.push({
      id: "rec-benchmark",
      priority: 1,
      gap: `${benchmarker.brand} (#${benchmarker.rank}) ranks on a published benchmark; ${tracked.brand}'s evidence is self-described.`,
      action: `Commission and publish an independent verification of ${tracked.brand}'s core performance claim.`,
      movesRankingBecause:
        "The source's methodology ranks by evidence strength — independently verified claims outrank self-reported ones.",
      evidence: {
        brand: benchmarker.brand,
        rank: benchmarker.rank,
        evidence_text: benchmarker.evidence_text,
      },
    });
  }

  const quantified = rows.find((row) => /\d[\d,.]*\s*(%|tickets|hour|uptime|sla|rating|reviews)/i.test(row.evidence_text));
  if (quantified && !/\d/.test(tracked.evidence_text)) {
    recommendations.push({
      id: "rec-quantify",
      priority: 2,
      gap: `${quantified.brand} (#${quantified.rank}) leads with quantified figures; ${tracked.brand} cites capabilities without numbers.`,
      action: "Publish quantified performance and reliability figures with methodology notes.",
      movesRankingBecause:
        "Ranked claims with concrete numbers are the strongest form of evidence this source cites.",
      evidence: {
        brand: quantified.brand,
        rank: quantified.rank,
        evidence_text: quantified.evidence_text,
      },
    });
  }

  const attested = rows.find((row) => /(hipaa|pci|soc 2|iso 27001|attestation|certified)/i.test(row.evidence_text));
  if (attested && !/(hipaa|pci|soc 2|iso 27001|attestation|certified)/i.test(myEvidence)) {
    recommendations.push({
      id: "rec-attest",
      priority: 3,
      gap: `${attested.brand} (#${attested.rank}) surfaces formal attestations that compliance-first buyers shortlist on.`,
      action: "Convert existing compliance work into named, linkable attestations on public evidence pages.",
      movesRankingBecause:
        "Attestations expand eligibility into regulated segments the source tracks separately.",
      evidence: {
        brand: attested.brand,
        rank: attested.rank,
        evidence_text: attested.evidence_text,
      },
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: "rec-hold",
      priority: 1,
      gap: "No exploitable evidence gap detected among higher-ranked vendors.",
      action: "Maintain the current evidence posture and keep monitoring for source methodology changes.",
      movesRankingBecause: "Position is defended by matching the strongest evidence pattern on the source.",
      evidence: ahead[0]
        ? { brand: ahead[0].brand, rank: ahead[0].rank, evidence_text: ahead[0].evidence_text }
        : null,
    });
  }

  return recommendations.sort((a, b) => a.priority - b.priority);
}
