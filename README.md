# Magpie

**Evidence integrity and self-healing for B2B GEO intelligence.**

> **RUN SUCCEEDED. JSON VALID. BUSINESS CONCLUSION WRONG.**

Magpie answers the question that must come before every GEO action: *did the market actually change — or did our measurement break?* It is the evidence-integrity layer beneath a GEO workflow: it decides whether an observation of a public evidence source is complete and contract-consistent enough to act on.

**Why "Magpie"?** Corvids keep learning for life. Magpies hoard shiny objects — we hoard citations. And the magpie is one of the only non-mammal animals to pass the mirror self-recognition test: it can tell its reflection from the real thing. That is this product's core trick — telling a valid-looking JSON reflection from the real market.

Built for **Into the Scrape-Verse** (WeMakeDevs), targeting **Suit-Up — Best Use of Bright Data**.

---

## The failure Magpie catches

A Bright Data Scraper Studio collector extracts ranked B2B vendor evidence from a public source and powers a customer-facing dashboard. Then the source redesigns:

| Stage | Bright Data run | Schema | Rows | Ranks | Publish |
|---|---|---|---:|---|---|
| Baseline | success (`j_mt4mskyc7o888bkba`) | valid | 10 | 1–10 | ✅ |
| Source redesigns; **same collector** | success (`j_mt4qvbykzs0z36ag6`) | **valid** | **7** | **4–10** | ❌ blocked |
| After Self-Healing (same Collector ID) | success (`j_mt4s453e2aktj9woky`) | valid | 10 | 1–10 | ✅ |

The broken run is the dangerous one: transport-successful, schema-valid, and semantically incomplete. A naive product would publish it and tell the growth team that **NimbusDesk — the tracked brand, previously #2 — disappeared from the source**. Nothing actually changed in the market; the top three vendors had merely moved into a JavaScript carousel the collector no longer understood.

Magpie's deterministic trust engine blocks that conclusion, quarantines the run, keeps serving the last trusted snapshot, and hands the coding agent a precise repair instruction. Bright Data Self-Healing rewrites the collector behind a **human approval gate**, and the same Collector ID is rerun — verified against the unchanged contract before anything reaches the dashboard.

## Multi-round healing: the trust gate catches overfit repairs too

The healing story genuinely iterated, with a human deciding at every gate:

| Round | Prompt approach | Outcome |
|---|---|---|
| V1 | Verbose, prescriptive | Preview showed only legacy rows — **human rejected** |
| V3 | Terse carousel fix | Restored 10 rows on the redesigned page, **business-facts hash identical to baseline** — human approved, verified. But on the *original* layout it regressed to 0 rows — **caught by Magpie's trust gate** (empty result = quarantined, never published) |
| V4 | Handle **both** layouts | Human approved. Verified on three genuine runs: original layout → 10 rows hash-identical; redesigned layout → 10 rows hash-identical; changed facts (competitor moves #3→#2 with new evidence) → 10 rows, correctly classified `TRUSTED_SOURCE_CHANGE` and published |

The last row also demonstrates the scope boundary: **Magpie does not heal every unfavorable result.** A genuine market change (HelioSupport overtaking NimbusDesk with stronger evidence) passes every check, publishes, and produces a "close the evidence gap" insight — not a repair.

## Genuine Bright Data artifacts

Every number in the demo comes from real Bright Data Collection API runs against the public [Source Shift Lab fixture](https://magpie-lab.netlify.app/lab/source):

| Artifact | Value |
|---|---|
| Custom collector (created via CLI, AI-generated) | `c_mt4m8fix1gze0scg44` |
| Baseline snapshot | `j_mt4mskyc7o888bkba` — 10 rows, ranks 1–10 |
| Broken snapshot (source redesigned) | `j_mt4qvbykzs0z36ag6` — 7 rows, ranks 4–10, schema-valid |
| Healed snapshot | see `artifacts/brightdata/lineage.json` (same collector, verified) |
| Creation / heal / approve transcripts | `artifacts/brightdata/*-transcript.txt`, `*-envelope.json` |

## How Bright Data is used (award track)

1. **Custom collector creation** — `bdata scraper create` against the live fixture URL; Bright Data AI generates the schema + Browser Worker code (including a Load-more interaction). Verified in Scraper Studio.
2. **Collection API for authoritative runs** — `POST /dca/trigger` + `GET /dca/dataset` + `GET /dca/log` via `pnpm magpie collect` (see `scripts/magpie.ts`). Every run gets a stable `j_*` snapshot displayed in the product.
3. **Self-Healing with a human gate** — after diagnosis, `bdata scraper heal` produces a reviewable diff (`awaiting_approval`); a human reviews in Scraper Studio and authorizes `bdata scraper approve --auto-save`. The repair restores all ten rows **without changing the output schema or the Collector ID**.
4. **Structured output powering a real product** — the typed `SourceEvidenceRowV1` contract feeds the Signal Overview and Incident Room, with evidence lineage, hashes, and last-known-good protection.

## Architecture

```
Head of Growth ── Magpie web app (Signal Overview / Incident Room)
                       │
              deterministic trust engine (pure TypeScript)
                       │  pass            │ fail
             trusted evidence store   quarantine + incident
                       │                  │
             B2B GEO insights       repair prompt → coding agent
                       │                  │
                Bright Data ◄───── bdata scraper heal/approve (human-gated)
                       │
             custom collector c_mt4m8fix1gze0scg44
                       │
             public Source Shift Lab (controlled fixture)
```

**Separation of responsibilities:** Bright Data interacts with the target and repairs collector logic. Magpie decides whether output is safe to publish. A human approves repairs. No LLM is involved in the publication decision — the trust engine is deterministic and explainable.

### Trust engine

- Structural validation: every dataset row against the versioned `SourceEvidenceRowV1` Zod contract.
- Semantic invariants: record-count hard minimum, ordered ranks starting at 1 with no gaps, required-field completeness, evidence coverage, duplicate brands/ranks.
- Decision rule: any blocking or warning signal ⇒ `UNTRUSTED_OBSERVATION`, `publish_allowed = false`, last trusted snapshot keeps powering the product.
- Post-heal verification gate: same Collector ID, unchanged contract, and for a layout-only change an **exact business-facts hash match** against the baseline.

For the captured broken run, the engine outputs exactly:

```
record_count   BLOCKING  expected 10, observed 7   (ratio 70%)
rank_start     BLOCKING  expected 1,  observed 4
missing_ranks  BLOCKING  expected none, observed 1, 2, 3
structural validation: PASS  ← the lie was schema-valid
```

Run the engine's test suite: `pnpm test`.

## The Source Shift Lab (honest demonstration policy)

The target is an explicitly synthetic, labelled public fixture ("Controlled chaos fixture") at one canonical URL, deployed on Netlify with server-side layout switching:

- **Layout A — legacy_cards:** ranked vendor cards; 1–5 visible, Load more reveals 6–10.
- **Layout B — featured_carousel:** the same ten vendors and facts; ranks 1–3 move into a JS carousel with expandable evidence panels; the ranked list keeps the publisher's pagination pattern (4 visible + Load more).

The layout is switched server-side via a token-protected control API; a revision counter in the page footer and an `X-Fixture-Revision` header make every change auditable. Baseline, broken and healed artifacts all come from genuine Bright Data runs — replay mode is labelled `REPLAY`, live runs `LIVE`.

## Repository

- `app/` — Next.js App Router: Signal Overview (`/`), Incident Room (`/incidents/inc_001`), fixture (`/lab/source`), control API (`/api/lab/control`)
- `lib/contracts/` — `SourceEvidenceRowV1` contract + canonical hashes (business facts, observed shape)
- `lib/drift/` — the deterministic trust engine (checks, thresholds)
- `lib/fixture/` — fixture state (Netlify Blobs), rendering, vendor facts
- `scripts/magpie.ts` — `pnpm magpie collect` authoritative Collection API runner
- `artifacts/brightdata/` — genuine outputs, transcripts, envelopes, manifest
- `tests/unit/trust.test.ts` — the 10→7 case and hash gates

Push to `main` auto-deploys via GitHub Actions → Netlify.

## Reproduce

```bash
pnpm install
pnpm test                 # trust engine unit tests
pnpm build && pnpm start  # product + fixture locally
pnpm magpie collect --source source_support_platforms --purpose baseline   # needs Bright Data auth
```

Environment: `DEMO_CONTROL_TOKEN`, `BRIGHT_DATA_API_TOKEN`, `BRIGHT_DATA_COLLECTOR_ID` (see `.env.example`; secrets never committed).

## AI-tooling disclosure (required by the rules)

- **Bright Data AI** generated the collector's output schema and Browser Worker code (`bdata scraper create`) and the self-healing repairs (`bdata scraper heal`).
- **ZCode (an AI coding agent)** drove the end-to-end workflow: project code, fixture, trust engine, CLI orchestration, and the heal/approve commands.
- **The human** reviewed the heal proposal in Scraper Studio and explicitly approved every repair applied to production. No repair was auto-approved.

## Scope honesty

The MVP demonstrates the source/collector boundary deeply: trusted observation vs unsafe collection. Model-level answer-engine variance and full claim-entailment verification are explicitly out of scope. The fixture is controlled and labelled; we never imply a real publisher redesign happened during filming.
