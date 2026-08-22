export type Severity = "info" | "warning" | "blocking";

export type Signal = {
  name: string;
  severity: Severity;
  expected: string | number;
  observed: string | number;
  message: string;
};

export type ValidationProfile = {
  source_id: string;
  ordered: boolean;
  expected_rank_start: number;
  expected_min_records: number;
  required_fields: string[];
  completeness_trusted: number; // percent
  completeness_warning: number; // percent
  evidence_coverage_trusted: number; // percent
  evidence_coverage_warning: number; // percent
  duplicate_brand_quarantine: number; // percent
};

export const SOURCE_SUPPORT_PLATFORMS_PROFILE: ValidationProfile = {
  source_id: "source_support_platforms",
  ordered: true,
  expected_rank_start: 1,
  expected_min_records: 10,
  required_fields: ["brand", "claim", "evidence_text", "source_section"],
  completeness_trusted: 95,
  completeness_warning: 85,
  evidence_coverage_trusted: 90,
  evidence_coverage_warning: 75,
  duplicate_brand_quarantine: 10,
};

export type ObservationClassification =
  | "NO_CHANGE"
  | "TRUSTED_SOURCE_CHANGE"
  | "UNTRUSTED_OBSERVATION"
  | "TRANSPORT_FAILURE";

export type RunAssessment = {
  classification: ObservationClassification;
  publish_allowed: boolean;
  structural_valid: boolean;
  signals: Signal[];
  failed_checks: string[];
  record_count: number;
  ranks: number[];
};
