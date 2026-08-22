# Magpie — Complete Build Plan

**Status:** Build-ready plan; implementation has not started — see §21.0 for the one-day crash plan now in effect<br>
**Last updated:** 22 August 2026<br>
**Primary objective:** Win **Best Use of Bright Data** at Into the Scrape-Verse<br>
**Product category:** Evidence integrity and self-healing for B2B GEO intelligence
**Core question:** **Did the market change—or did our measurement break?**

---

## 1. Executive decision

Magpie will not be built as another broad AI-visibility dashboard. The hackathon product is the evidence-integrity layer beneath a GEO workflow: it determines whether an observation of a public evidence source is complete and contract-consistent enough to use.

The MVP demonstrates one dangerous production failure:

1. A custom Bright Data Scraper Studio collector extracts ranked B2B vendor evidence.
2. Its structured output powers a customer-facing GEO evidence dashboard.
3. The source changes its layout.
4. The same collector still succeeds and returns schema-valid JSON, but silently omits the top three vendors.
5. A naive product would publish a false source-evidence loss.
6. Magpie detects the semantic failure, quarantines the run and preserves the last trusted result.
7. Codex turns the failed checks into a precise repair instruction and drives Bright Data Self-Healing.
8. A human reviews and approves the proposed repair.
9. The same Collector ID is rerun against the changed page.
10. Magpie verifies the unchanged output contract and only then releases the recovered data downstream.

The memorable product and demo lines are:

> **RUN SUCCEEDED. JSON VALID. BUSINESS CONCLUSION WRONG.**

> **The page changed. Valid-looking output became incomplete. Magpie blocked the conclusion. Bright Data repaired the sensor.**

> **We prove the underlying observation is trustworthy before a growth team acts on it.**

### 1.1 Locked product decisions

| Decision | Choice |
|---|---|
| Product name | **Magpie** — corvids keep learning for life, magpies hoard shiny objects (citations/evidence), and the magpie is one of the only non-mammal animals to pass the mirror self-recognition test: it tells its reflection from the real thing. That is the product's core trick: telling valid-looking JSON from the real market |
| Primary user | Head of Growth at a B2B SaaS company |
| Secondary user | Growth engineer or data analyst maintaining the evidence pipeline |
| Product wedge | Customer-visible trust, quarantine and recovery for GEO evidence |
| Award hero | Bright Data Scraper Studio custom collector and Self-Healing |
| Coding-agent workflow | Codex creates, runs, diagnoses and executes healing/verification; a human authorizes approval |
| Deterministic demo | Public Source Shift Lab with a controlled layout redesign |
| Output utility | Trusted source-evidence position, competitor evidence and recommended action |
| Repair policy | Human approval required; no autonomous approval in the MVP |
| Trust engine | Deterministic TypeScript rules, not an LLM |
| Critical demo path | Bright Data only; TinyFish is not included |
| Ethical boundary | Public data and legitimate content/earned-coverage intelligence only |

### 1.2 Non-negotiable acceptance sentence

The submission is not done until a judge can:

> Watch the source change, see the same Bright Data collector return a believable lie, watch Magpie block that lie, see Codex and Bright Data repair the collector, and verify that the unchanged structured contract resumes powering the B2B product.

---

## 2. Why this product should exist

### 2.1 B2B context

Software production is accelerating. GitHub reported 121 million repositories created in 2025—more than 230 per minute—and 4.3 million AI-related repositories. Stripe found that 20% of the 23,000 companies in its 2025 Atlas cohort charged a first customer within 30 days, up from 8% in 2020.

The bottleneck is shifting from shipping software to being discovered, considered and trusted.

B2B discovery is also changing. Gartner surveyed 645 B2B buyers in 2025 and found:

- 45% used GenAI during a recent purchase, primarily for product and vendor research.
- Buyers used an average of seven information sources.
- 70% preferred a completely digital, self-service experience.
- 51% believed they were more likely to encounter misleading information from GenAI.

As a broader zero-click measurement signal—not a B2B-specific finding—Pew observed that users clicked a citation inside a Google AI summary in only 1% of visits in its March 2025 browsing study.

Investment and consolidation show that AI-search visibility is becoming a serious category, though they do not independently prove Magpie’s reliability problem. Profound announced a $96 million Series C at a $1 billion valuation; Peec AI reported $10 million in annualized revenue based on company internal data reviewed by TechCrunch; Sitecore acquired Scrunch; and Adobe completed its approximately $1.9 billion Semrush acquisition.

### 2.2 The unfilled customer job

Public GEO products primarily answer:

- Are we mentioned?
- What do AI systems say about us?
- Which competitors appear?
- Which sources are cited?
- What content or outreach should we prioritize?

Magpie answers the question that must come before those actions:

> **Can we trust the evidence that produced this change?**

The concrete weekly decision is:

> A Head of Growth is about to tell the content and PR teams that the brand disappeared from a high-value comparison source. Magpie stops that instruction because the collector—not the source facts—lost the featured cards.

We will not claim that competing platforms lack internal reliability systems. The defensible product opportunity is to make collection confidence, evidence lineage, quarantine and repair first-class, customer-visible objects.

### 2.3 Four causes behind one red arrow

| Cause | What happened | Correct response |
|---|---|---|
| Real market movement | A competitor published better proof, earned stronger coverage or changed positioning | Take competitive action |
| Model variance | A probabilistic answer engine sampled or ranked different sources | Repeat sampling and measure the distribution |
| Source change | A publisher changed the facts, ranking or cited evidence | Refresh and verify the evidence |
| Collector failure | The extractor silently missed or misread data after a layout change | Quarantine and repair |

The hackathon MVP handles **the source/collector boundary** deeply: trusted source observation versus unsafe collection. It is not a model-visibility tracker. Model-level repeated sampling and claim-entailment verification are explicitly post-MVP.

### 2.4 Scientific support for the reliability problem

A 2026 longitudinal study of 32 prompts across ChatGPT, Gemini, Google AI Mode and Perplexity found only 34–42% consecutive-day overlap in citation sources. It is a preprint with limited locales and verticals, so the figures are evidence of volatility rather than universal benchmarks.

An EMNLP audit of generative search engines found that only 51.5% of generated sentences were fully supported by citations and 74.5% of citations supported their associated sentence.

The product therefore treats this chain as an explicit evidence contract:

> **Observed answer → cited URL → current page evidence → referenced brand → customer insight**

---

## 3. Award strategy

The hackathon has six equally weighted judging criteria. Every implemented feature must strengthen at least one of them.

| Criterion | Magpie proof |
|---|---|
| Potential impact | Prevents B2B growth teams from redirecting content, PR and positioning based on corrupted evidence |
| Creativity and innovation | Treats a scraper as a market sensor and monitors whether the monitoring can be trusted |
| Technical excellence | Typed contracts, immutable raw artifacts, semantic validation, quarantine, replay and verified promotion |
| Use of Scraper Studio | Custom interactive collector, API execution, stable schema and visible Collector ID |
| Reliability and self-healing | Reproducible silent failure, last-known-good protection, Codex diagnosis, Bright Data repair and verification |
| Presentation | One protagonist, one believable failure, one repair and one restored business decision |

The six criteria are equally weighted and the demo is scored as heavily as the code, which is why replay mode backed by genuine artifacts matters: it makes the presentation deterministic even if a live run misbehaves.

The **Suit-Up (Best Use of Bright Data)** track is judged specifically on four things, all of which this plan already centers: Scraper Studio usage, agent-driven workflow, healing behavior, and downstream use of the structured output. Every hour of work should strengthen at least one of those four plus the six general criteria.

### 3.1 Bright Data must remain visible

- Bright Data appears in the first 60 seconds of the demo.
- The Collector ID remains visible in the product, terminal and incident timeline.
- The custom collector creation prompt and schema are committed as artifacts.
- The app uses the Scraper Studio Collection API for actual runs.
- Codex uses the Bright Data CLI for create, run, heal and verify; the human authorizes the approval command.
- The generated repair diff and preview are shown.
- The same Collector ID, app contract hash and exported collector-schema hash are shown before and after repair.
- No other integration receives more demo time than Bright Data.

### 3.2 What not to build for the award

- A generic SEO dashboard with Bright Data hidden behind an API wrapper.
- A broad multi-agent platform with an incidental scraper.
- An automated backlink or forum-posting system.
- A demo where the scraper merely throws an error.
- A self-heal that replaces the Collector ID or changes the downstream schema.
- A prerecorded animation without genuine Bright Data artifacts and transcripts.

### 3.3 Eligibility and submission constraints

Verified against the official WeMakeDevs pages on 22 August 2026:

- The event runs 17–23 August 2026 and permits solo builders or teams of up to four; the submission form closes with the hackathon on 23 August. No exact closing time or timezone is published — **treat 23 August 12:00 UTC as the internal deadline** and recheck the event page before launching, since the page, not this plan, is authoritative.
- Submission is via a **Google Form linked from the event page — there is no Devpost**. It requires the public repository, demo video, project description, selected track and an explanation of how Scraper Studio was used.
- Bright Data Scraper Studio is mandatory; using only a pre-made scraper from the Scrapers Library does not qualify. Demonstrate at least one real create/run flow with the `c_*` Collector ID as proof.
- Demonstrate self-healing via `bdata scraper heal` where possible, and wire the Collector ID into something real downstream (API trigger, schedule, database, agent or dashboard).
- The coding-agent workflow runs through the Bright Data CLI (`npx -p @brightdata/cli`) inside Claude Code, Cursor or Codex; no specific agent is mandatory.
- Collection is limited to publicly available data; private, login-protected, paywalled and restricted information is excluded. **Government websites are prohibited targets**, and targets already covered by Bright Data's 800+ prebuilt scrapers should be avoided.
- Only original work completed during the event is judged; prior planning and diagrams are explicitly fine (this plan qualifies as planning). AI coding tools are allowed but **must be disclosed in the submission**, and the team must understand, verify and be able to explain all generated code.
- **Bright Data credits:** every participant can claim $50 in credits with the promo code `wemakedevs` (lowercase, billing section); $2,500 is split across top teams. Do this before Phase 0 API smoke tests.
- Keep API tokens and `.env` files out of the repository and the demo video.
- Prize tracks: Web-Slinger (grand, NVIDIA DGX Spark), **Suit-Up (Best Use of Bright Data — our target)**, Spider-Sense (Best UI / Best Clean Code — plausible secondary wins given the design system and typed-contract emphasis), Daily Bugle (Best LinkedIn post tagging WeMakeDevs — post during the event if time permits; only LinkedIn counts).

---

## 4. Personas and jobs to be done

### 4.1 Primary persona: B2B Head of Growth

**Context**

- Owns organic discovery, SEO/GEO, content, category positioning and competitive intelligence.
- Uses external source evidence within SEO/GEO workflows to prioritize content, digital PR, publisher outreach and executive messaging.
- Cannot inspect every cited source or maintain scraper selectors.
- Must explain apparent competitive changes to leadership.

**Core pain**

> “My dashboard says a competitor overtook us. I need to know whether the market actually changed before I redirect my team.”

**Functional jobs**

- See whether every source-backed GEO signal is supported by fresh, trusted evidence.
- Understand exactly why a run was blocked.
- Continue seeing the last trusted result while an incident is active.
- Know what business conclusion was prevented.
- Receive the corrected insight after recovery.

**Emotional job**

- Present defensible growth intelligence instead of caveated guesses.

### 4.2 Secondary persona: Growth engineer or data analyst

**Core pain**

> “When a source changes, I need the pipeline to fail safely, explain the broken contract and recover without rewriting every consumer.”

**Functional jobs**

- Observe Collector IDs, snapshot IDs, schemas, raw output and failed checks.
- Distinguish transport failure from semantic extraction drift.
- Generate a precise repair prompt.
- Review and approve Bright Data’s proposed repair.
- Verify recovery against the same contract.
- Retain a complete audit trail.

### 4.3 Future persona: GEO/SEO agency

An agency operator needs multi-client workspaces, service-level reporting and a defensible audit trail. Multi-tenancy, billing and client permissions are post-hackathon.

---

## 5. Product scope

### 5.1 MVP must-have

- One custom Bright Data Scraper Studio collector.
- One public, dynamic Source Shift Lab at a stable URL.
- One tracked B2B category with ten fictional vendors.
- One customer brand and at least one named competitor.
- Baseline, broken and healed Bright Data snapshots.
- Immutable storage of raw results before normalization.
- A versioned SourceEvidenceRowV1 contract.
- Schema validation plus semantic invariants.
- Trusted, quarantined, healing, verifying and recovered states.
- Last-known-good publication gate.
- Deterministic incident detection, an evidence-rich inspection package and repair-prompt generation after diagnosis.
- Codex-driven Bright Data Self-Healing with human approval.
- Verification of the same Collector ID, app contract and Bright Data production output schema.
- Signal Overview and Incident Room, with evidence details in a drawer.
- One deterministic containment action: hold the apparent source-loss response while evidence is quarantined, then clear it after exact recovery.
- Replay mode backed by genuine captured artifacts.
- Unit, contract, integration and end-to-end replay tests.
- Public README, architecture, transcripts and three-minute demo.
- One real public long-tail source smoke run, or written organizer confirmation that the public controlled fixture is eligible.
- Proof that the target is not merely using a Bright Data prebuilt scraper.

### 5.2 Should-have after the core loop works

- A protected demo-control screen for layout and fact changes.
- A separate healthy source-fact-change scenario.
- A dedicated Evidence Explorer screen.
- Evidence snippet diffing and advanced evidence-gap recommendations.
- Responsive and accessibility polish.
- A shareable incident report.

### 5.3 Explicitly out of scope

- Production tracking across ChatGPT, Gemini, Perplexity and every answer engine.
- Claims of access to any platform’s internal ranking systems.
- Complete model-variance classification.
- Full semantic claim-entailment verification.
- Domain-rating or backlink-index infrastructure.
- Autonomous posting, commenting, upvoting or link creation.
- Multi-tenant authentication, billing or agency workspaces.
- GSC, GA4, CRM or revenue attribution.
- Automatic repair approval.
- Broad ML anomaly detection.
- Multiple production collector templates.
- TinyFish integration.
- Sentiment analysis.
- Native mobile applications.

### 5.4 Product promise boundary

The MVP promises:

> **The freshest verified observable source evidence.**

It does not promise:

- Absolute truth about a probabilistic LLM.
- Guaranteed search or LLM ranking improvement.
- Causal revenue attribution.
- Complete knowledge of why an answer engine selected a source.

---

## 6. Core user stories

### US-01 — Establish a trusted baseline

As a Head of Growth, I want an initial verified snapshot so future changes have a trustworthy reference.

**Acceptance criteria**

- The app triggers the configured Bright Data collector.
- The run records Collector ID, Bright Data snapshot ID, source URL and timestamps.
- The unmodified response is persisted before normalization.
- Structural and semantic validation pass.
- The operator confirms the first baseline once.
- The dashboard displays **TRUSTED**.

### US-02 — Turn evidence into a B2B signal

As a Head of Growth, I want ranked source evidence converted into a clear competitive view.

**Acceptance criteria**

- Brand position is derived only from trusted rows.
- Every claim and recommendation links to its evidence record.
- Evidence coverage and freshness are visible.
- Raw structured output remains inspectable.

### US-03 — Detect a believable extraction failure

As a Head of Growth, I want plausible but incomplete data stopped before it changes my report.

**Acceptance criteria**

- The changed-layout Bright Data run succeeds.
- The output remains valid against the structural schema.
- Semantic invariants detect missing top ranks.
- The run becomes **QUARANTINED**.
- Customer metrics continue using the last trusted snapshot.
- The UI names the false conclusion that was prevented.

### US-04 — Diagnose the incident

As a growth engineer, I want to understand what failed and what is at risk.

**Acceptance criteria**

- The incident compares trusted and broken outputs.
- It lists missing ranks, count change and evidence-completeness change.
- It distinguishes transport failure from extraction drift.
- It lists affected customer metrics and recommendations.
- It generates a copyable Bright Data healing prompt.

### US-05 — Repair through Codex and Bright Data

As a growth engineer, I want to repair the existing collector without rewriting downstream code.

**Acceptance criteria**

- Codex runs the Bright Data heal command.
- Bright Data produces a reviewable diff and preview result.
- Human approval is required.
- The original Collector ID is used.
- No Magpie application code changes during the repair.

### US-06 — Verify and release recovery

As a Head of Growth, I want repaired data published only after it proves trustworthy.

**Acceptance criteria**

- Repaired output passes schema and semantic checks.
- Missing records and evidence are restored.
- Collector ID, app contract hash and exported collector-schema hash remain unchanged.
- The incident advances through **VERIFYING** to **RESOLVED**; the customer-facing display says **RECOVERED**.
- The corrected B2B signal is published.
- Trusted, broken and healed artifacts remain available.

---

## 7. Controlled demo scenarios

The public Source Shift Lab is a realistic but explicitly synthetic B2B publisher page. It uses fictional companies and is labelled **Controlled chaos fixture**.

### 7.1 Independent controls

The fixture has two independent, server-side controls:

| Control | Values | Purpose |
|---|---|---|
| Layout mode | legacy_cards / featured_carousel | Reproduce extraction drift without changing facts |
| Facts mode (stretch only) | baseline / competitor_move | Demonstrate a genuine business change with a healthy collector |

Both modes are stored in the database. The canonical target URL remains unchanged, rendering is dynamic and caching is disabled.

Every control change increments a fixture revision exposed in a response header and small page footer. A collection snapshots the revision onto its run. The fixture is locked while a run is collecting and remains locked to Layout B throughout diagnosis, healing, approval and verification. Control changes are rejected while `locked_until`, `locked_by_run_id` or `locked_by_incident_id` is active.

### 7.2 Scenario A — Extraction drift and self-healing

**Layout A: legacy_cards**

- Ten ranked vendor cards.
- Ranks 1–5 visible initially.
- A Load more interaction reveals ranks 6–10.
- Evidence is visible inside each standard card.
- The initial custom collector extracts all ten.

**Layout B: featured_carousel**

- The same facts and ten vendors remain visible.
- Ranks 1–3 move into a JavaScript carousel with different markup.
- Their evidence moves behind expandable panels.
- Ranks 4–10 retain markup compatible with the old parser.
- The unhealed collector returns seven complete records: ranks 4–10.

**Required result**

| Stage | HTTP/run | Schema | Records | Rank sequence | Publish |
|---|---|---|---:|---|---|
| Baseline | Success | Valid | 10 | 1–10 | Yes |
| Broken | Success | Valid | 7 | 4–10 | No |
| Healed | Success | Valid | 10 | 1–10 | Yes |

### 7.3 Stretch Scenario B — Trusted source-fact movement

Only after Scenario A and its genuine artifact pack are complete:

- Keep the layout unchanged.
- Switch facts mode from baseline to competitor_move.
- HelioSupport moves from #3 to #2 after adding stronger benchmark evidence.
- NimbusDesk, the demo customer, moves from #2 to #3.
- All ten records and evidence fields remain complete.
- Validation passes.
- The event is classified **TRUSTED_SOURCE_CHANGE**, not extraction drift.

The resulting source-level business insight is:

> NimbusDesk did not disappear. A competitor moved ahead by one position after adding stronger benchmark evidence. Recommended response: close the evidence gap; do not overhaul the entire category strategy.

This proves only that the public source changed under a healthy observation. It does not prove that an answer engine changed its ranking for the same reason.

### 7.4 Honest demonstration policy

- The Source Shift Lab is always labelled as controlled.
- We never imply that an unrelated publisher redesigned during filming.
- Baseline, broken and healed artifacts must come from actual Bright Data runs.
- Recorded runs are labelled **REPLAY**; live runs are labelled **LIVE**.
- Long self-healing waits may be time-compressed in the video, with the complete transcript committed.

---

## 8. Functional success metrics

### 8.1 Hackathon proof metrics

- One custom Scraper Studio collector reaches production.
- One stable Collector ID is visible across baseline, broken and healed runs.
- The collector performs at least one meaningful interaction.
- Three timestamped genuine artifacts exist: baseline, broken and healed.
- The broken run is transport-successful and schema-valid but semantically incomplete.
- Validation quarantines the broken result before it changes customer metrics.
- All expected records are restored after healing.
- The app contract hash and exported collector-schema hash are identical before and after repair.
- Zero downstream application changes are required for recovery.
- A complete create/run/heal/approve transcript exists.
- The submitted demo is under three minutes.

### 8.2 Product metrics

**North-star metric**

> Verified evidence freshness: percentage of monitored evidence backed by a recent, validated snapshot.

**Supporting metrics**

- Mean time to detect extraction drift.
- Mean time to verified recovery.
- Percentage of runs quarantined.
- False dashboard updates prevented.
- Evidence completeness.
- Schema-continuity rate after repair.
- Time since last trusted snapshot.
- Incidents per source.
- Repair proposal acceptance rate.
- Repair verification pass rate.

Avoid claims of avoided revenue or causal pipeline lift during the hackathon.

---

## 9. System architecture

### 9.1 High-level architecture

~~~mermaid
flowchart LR
    U["Head of Growth"] --> UI["Magpie web app"]
    UI --> API["Collection and incident API"]
    API --> BD["Bright Data Scraper Studio API"]
    BD --> C["Custom collector c_*"]
    C --> S["Public Source Shift Lab"]
    BD --> RAW["Immutable raw snapshot"]
    RAW --> V["Trust engine"]
    V -->|"passes"| T["Trusted evidence store"]
    V -->|"fails"| Q["Quarantine and incident"]
    T --> I["B2B GEO evidence and actions"]
    Q --> P["Deterministic repair diagnosis"]
    P --> CX["Codex + Bright Data CLI"]
    CX --> H["Bright Data Self-Healing"]
    H --> A["Diff, preview and human approval"]
    A --> R["Rerun same collector ID"]
    R --> RAW
~~~

### 9.2 Architectural principle

Bright Data and Magpie have separate responsibilities:

| Component | Responsibility |
|---|---|
| Bright Data Scraper Studio | Interact with the target, extract structured data and repair collector logic |
| Magpie trust engine | Decide whether output is safe to publish |
| Codex | Drive collector creation, inspect the failure, invoke healing and verification |
| Human operator | Approve or reject the proposed repair |
| Magpie insight layer | Turn trusted evidence into B2B competitive signals |

Bright Data AI does not decide whether a business insight is true. Magpie does not rewrite scraper selectors. This separation is central to the technical story.

### 9.3 Runtime collection flow

1. User or demo controller requests a collection.
2. Server creates a local CollectorRun in **QUEUED** state.
3. Server triggers the Bright Data collector through `POST /dca/trigger`; a trigger failure moves the run to **FAILED**.
4. Bright Data returns a `collection_id` beginning with `j_`.
5. Magpie atomically stores that value as the normalized `snapshot_id` and moves the run to **COLLECTING**.
6. The client requests one bounded sync through `POST /api/collections/:runId/sync` every few seconds, or a server-side worker performs the same action.
7. Each sync request checks `GET /dca/dataset?id=<snapshot_id>` once; the read-only app `GET` endpoint never triggers external work.
8. When the dataset is ready, Magpie persists the raw body immediately.
9. The adapter normalizes the response into EvidenceSnapshotV1.
10. Structural and semantic validation run synchronously.
11. A database transaction either promotes the snapshot or quarantines it.
12. Downstream insights read only from the trusted-snapshot pointer.

No server request remains open for the entire Bright Data job. This avoids serverless timeout problems.

### 9.4 Recommended technology stack

Use the current stable versions at implementation time and pin every dependency in the lockfile.

| Layer | Choice | Reason |
|---|---|---|
| Runtime | Current Node.js LTS | Supported by Bright Data CLI and modern deployment platforms |
| Web framework | Next.js App Router + React + TypeScript | One repository for UI, API and public fixture |
| Styling | Tailwind CSS + Radix/shadcn primitives | Fast, polished and accessible UI |
| Charts | Recharts | Simple evidence and run-history views |
| Contracts | Zod + generated JSON Schema | Shared runtime validation and documentation |
| Database | Serverless Postgres | Durable demo-mode state and incident history |
| ORM | Drizzle ORM | Typed schema and small runtime footprint |
| Unit/contract tests | Vitest | Fast pure-logic tests |
| UI tests | Testing Library | Component behavior and accessibility |
| End-to-end tests | Playwright | Full baseline/quarantine/recovery replay |
| Package manager | pnpm | Deterministic workspace installs |
| Hosting | Vercel or another Node-compatible host | Public app and canonical fixture URL |
| Collection | Bright Data Scraper Studio API | Actual runtime data acquisition |
| Collector operations | Bright Data CLI from Codex | Award-visible create/run/heal/approve workflow |

No LLM API is required for the MVP trust engine. Recommendations are deterministic and evidence-backed. An LLM summarizer may be added only after the award loop is complete.

### 9.5 Repository structure

~~~text
.
├── app/
│   ├── page.tsx                         # Signal Overview
│   ├── incidents/[incidentId]/page.tsx  # Incident Room
│   ├── lab/source/page.tsx              # Public Source Shift Lab
│   ├── lab/control/page.tsx             # Protected demo controls
│   └── api/
│       ├── collections/route.ts
│       ├── collections/[runId]/route.ts
│       ├── collections/[runId]/sync/route.ts
│       ├── collections/[runId]/retry/route.ts
│       ├── collections/[runId]/confirm-baseline/route.ts
│       ├── incidents/[incidentId]/route.ts
│       ├── incidents/[incidentId]/diagnosis/route.ts
│       ├── incidents/[incidentId]/heal-package/route.ts
│       ├── incidents/[incidentId]/healing-attempts/route.ts
│       ├── incidents/[incidentId]/healing-attempts/[attemptId]/artifacts/route.ts
│       ├── incidents/[incidentId]/healing-attempts/[attemptId]/decision/route.ts
│       ├── incidents/[incidentId]/verify/route.ts
│       ├── incidents/[incidentId]/reopen/route.ts
│       ├── incidents/[incidentId]/abandon/route.ts
│       └── lab/control/route.ts
├── components/
│   ├── trust/
│   ├── evidence/
│   ├── incidents/
│   └── shared/
├── db/
│   ├── schema.ts
│   ├── migrations/
│   └── seed.ts
├── lib/
│   ├── brightdata/
│   │   ├── client.ts
│   │   ├── poll.ts
│   │   ├── normalize.ts
│   │   └── errors.ts
│   ├── contracts/
│   │   ├── source-evidence-v1.ts
│   │   ├── evidence-snapshot-v1.ts
│   │   ├── assessment-v1.ts
│   │   └── hashes.ts
│   ├── drift/
│   │   ├── checks.ts
│   │   ├── thresholds.ts
│   │   ├── classifier.ts
│   │   └── heal-prompt.ts
│   ├── pipeline/
│   │   ├── ingest.ts
│   │   ├── promote.ts
│   │   └── trusted-snapshot.ts
│   └── insights/
│       ├── compare.ts
│       └── recommend.ts
├── scraper/
│   ├── creation-prompt.md
│   ├── source-evidence-v1.schema.json
│   └── collector-id.example.txt
├── scripts/
│   └── magpie.ts                    # Codex-driven batch collect/export command
├── artifacts/
│   └── brightdata/
│       ├── README.md
│       ├── baseline-output.example.json
│       ├── broken-output.example.json
│       ├── healed-output.example.json
│       ├── create-transcript.example.txt
│       ├── heal-transcript.example.txt
│       └── studio-heal-diff.example.png
├── tests/
│   ├── fixtures/
│   ├── unit/
│   ├── contract/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── RESEARCH.md
│   ├── ARCHITECTURE.md
│   ├── INCIDENT_STORY.md
│   ├── DEMO_SCRIPT.md
│   └── COMPLIANCE.md
├── .env.example
├── README.md
└── BUILD_PLAN.md
~~~

Actual Collector IDs, run IDs and genuine sanitized artifacts may be committed. API tokens, CLI authentication state and secret control tokens must never be committed.

---

## 10. Data contracts

### 10.1 Collector output: SourceEvidenceRowV1

The custom collector returns **one Bright Data dataset row per vendor**. This makes the failure visible in Bright Data’s own job telemetry: 10 lines → 7 lines → 10 lines.

~~~ts
export type SourceEvidenceRowV1 = {
  schema_version: "1.0";
  source_url: string;
  page_title: string;
  category: string;
  source_updated_at: string | null;
  rank: number;
  brand: string;
  claim: string;
  evidence_text: string;
  source_section: string;
  outbound_url: string | null;
  features: string[];
};
~~~

Rules:

- The output shape describes business meaning, not DOM structure.
- Field names must not change during self-healing.
- `schema_version` is literal and required.
- Every successfully extracted vendor produces exactly one row.
- Rank is a positive integer.
- Evidence is a short excerpt, not a copy of the full page.
- The collector never invents missing evidence.
- Application metadata is not scraped from the page.
- Known Bright Data system fields are separated before strict row validation.
- Present-but-empty strings pass structural typing so completeness rules can explain the semantic failure.
- Completeness trims Unicode whitespace; evidence excerpts are bounded to 1,000 characters and feature arrays to 50 short values.
- The application derives a stable `brand_key` through Unicode normalization, lowercasing, punctuation/whitespace folding and a configured alias map. Business comparison never keys on raw display text.

### 10.2 Application evidence envelope

~~~ts
export type EvidenceSnapshotV1 = {
  run_id: string;
  collector_id: string;
  brightdata_snapshot_id: string;
  schema_version: "1.0";
  app_contract_hash: string;
  collector_schema_hash: string;
  observed_shape_hash: string;
  business_facts_hash: string;
  source_url: string;
  scraped_at: string;
  raw_output_sha256: string;
  raw_artifact_id: string;
  rows: SourceEvidenceRowV1[];
};
~~~

### 10.3 Assessment record

~~~ts
export type CollectorRunStatus =
  | "QUEUED"
  | "COLLECTING"
  | "VALIDATING"
  | "BASELINE_PENDING_APPROVAL"
  | "ACCEPTED"
  | "QUARANTINED"
  | "FAILED";

export type CollectorRunPurpose =
  | "BASELINE"
  | "MONITORING"
  | "VERIFICATION"
  | "RETRY";

export type IncidentStatus =
  | "OPEN"
  | "DIAGNOSING"
  | "READY_TO_HEAL"
  | "HEALING"
  | "AWAITING_APPROVAL"
  | "APPLYING_REPAIR"
  | "READY_TO_VERIFY"
  | "VERIFYING"
  | "RESOLVED"
  | "REJECTED"
  | "REPAIR_FAILED"
  | "ABANDONED";

export type SourceTrustStatus =
  | "UNINITIALIZED"
  | "BASELINE_PENDING"
  | "TRUSTED"
  | "STALE_PROTECTED"
  | "RECOVERING";

export type ObservationClassification =
  | "NO_CHANGE"
  | "TRUSTED_SOURCE_CHANGE"
  | "UNTRUSTED_OBSERVATION"
  | "TRANSPORT_FAILURE"
  | "MODEL_VARIANCE"
  | "ATTRIBUTION_BREAK";

export type IncidentCause =
  | "UNCONFIRMED"
  | "EXTRACTION_DRIFT"
  | "APP_MAPPING_ERROR"
  | "SCHEMA_CONFIGURATION_ERROR"
  | "SOURCE_UNAVAILABLE";

export type RunAssessmentV1 = {
  run_id: string;
  status: CollectorRunStatus;
  purpose: CollectorRunPurpose;
  classification: ObservationClassification;
  publish_allowed: boolean;
  previous_trusted_snapshot_id: string | null;
  signals: Array<{
    name: string;
    severity: "info" | "warning" | "blocking";
    expected: string | number;
    observed: string | number;
    message: string;
  }>;
  failed_checks: string[];
  assessed_at: string;
};
~~~

`MODEL_VARIANCE` and `ATTRIBUTION_BREAK` are reserved for post-MVP use. A failed contract first becomes `UNTRUSTED_OBSERVATION`; it becomes an `EXTRACTION_DRIFT` incident only after page inspection confirms that expected evidence is still present but the collector missed it.

### 10.4 Hash definitions

- **app_contract_hash:** SHA-256 of the RFC 8785-canonicalized committed JSON Schema.
- **collector_schema_hash:** SHA-256 of the normalized Scraper Studio production output schema exported before/after healing.
- **observed_shape_hash:** SHA-256 of sorted runtime field paths and value types after known Bright Data system fields are separated.
- **business_facts_hash:** SHA-256 of normalized rows sorted by brand key, including brand, rank, claim, evidence, features and outbound URL but excluding run metadata and normalized whitespace.

### 10.5 Downstream insight lineage

~~~ts
export type DownstreamInsightV1 = {
  insight_id: string;
  tracked_brand: string;
  type: "BRAND_POSITION" | "COMPETITOR_MOVE" | "EVIDENCE_GAP";
  title: string;
  explanation: string;
  recommendation: string;
  evidence_snapshot_ids: string[];
  generated_at: string;
};
~~~

The insight builder must reject any snapshot with `publish_allowed !== true`. Every number and recommendation links back to exact evidence records.

`evidence_snapshot_ids` is a response convenience only. Persistence uses the foreign-keyed `insight_evidence` junction table defined in Section 13; application code must never use an unenforced snapshot-ID array as the source of lineage.

### 10.6 Example outputs

**Trusted baseline**

~~~json
{
  "schema_version": "1.0",
  "source_url": "https://demo.example/lab/source",
  "page_title": "Enterprise Support Platforms 2026",
  "category": "enterprise customer support",
  "source_updated_at": "2026-08-21",
  "rank": 2,
  "brand": "NimbusDesk",
  "claim": "Strong governance for regulated support teams",
  "evidence_text": "Includes regional data controls and audit exports.",
  "source_section": "ranked vendors",
  "outbound_url": "https://example.com/nimbusdesk",
  "features": ["audit exports", "regional controls"]
}
~~~

**Broken but schema-valid**

~~~text
dataset rows = 7
ranks = [4, 5, 6, 7, 8, 9, 10]
schema validation = PASS
semantic validation = BLOCK
false customer conclusion = "NimbusDesk disappeared"
~~~

**Healed**

~~~text
collector_id = unchanged
app_contract_hash = unchanged
collector_schema_hash = unchanged
dataset rows = 10
ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
semantic validation = PASS
downstream code changes = 0
~~~

---

## 11. Trust engine

### 11.1 Design requirements

- Deterministic and explainable.
- Pure TypeScript for critical checks.
- No LLM required to permit publication.
- Structural validation and semantic validation are separate.
- Hard invariants override any aggregate health score.
- A genuine brand or content change never triggers healing by itself.
- Transport failures are retried and never mislabelled as extraction drift.
- Quarantined output is preserved, not discarded.

### 11.2 Structural checks

- `schema_version === "1.0"`.
- Source URL is valid and matches the configured target.
- The Bright Data result is a non-empty dataset array.
- Every row passes SourceEvidenceRowV1.
- Every rank is a positive integer.
- Brand, claim, evidence and section have valid types.
- Optional outbound URLs are valid when present.
- Unknown top-level fields follow a documented strictness policy.
- Serialized payload stays under the configured size limit.

The broken demo output must pass every structural check.

### 11.3 Semantic checks and initial thresholds

| Check | Trusted | Warning | Quarantine |
|---|---:|---:|---:|
| Record count for the MVP source | At least configured `expected_min_records` (10) | — | Below 10 |
| Required-field completeness | At least 95% | 85–94% | Below 85% |
| Evidence coverage | At least 90% | 75–89% | Below 75% |
| Duplicate brand rate | 0% | 1–10% | Above 10% |
| Duplicate ranks | 0 | — | Greater than 0 |
| Minimum rank on ordered source | 1 | — | Greater than 1 |
| Missing positions inside rank range | 0 | — | Greater than 0 |
| Empty result | — | — | Always |
| Schema hash changed | — | — | Always |

For the controlled incident:

~~~text
Trusted baseline: ranks 1–10
Broken run:      ranks 4–10

Structural schema: PASS
Record ratio:      70% — BLOCKING
Minimum rank:      4 — BLOCKING
Missing ranks:     1, 2, 3 — BLOCKING
~~~

### 11.4 Decision rule

~~~ts
if (authenticationOrConfigurationFailed) {
  classification = "TRANSPORT_FAILURE";
  publishAllowed = false;
  failWithoutRetryOrHealing();
} else if (transientTransportFailed) {
  classification = "TRANSPORT_FAILURE";
  publishAllowed = false;
  createRetryRun();
} else if (schemaInvalid || hardSemanticInvariantFailed || warningSignals.length > 0) {
  classification = "UNTRUSTED_OBSERVATION";
  publishAllowed = false;
  quarantine();
} else if (factsDifferFromPreviousTrustedSnapshot) {
  classification = "TRUSTED_SOURCE_CHANGE";
  publishAllowed = true;
} else {
  classification = "NO_CHANGE";
  publishAllowed = true;
}
~~~

No source change is publishable while any unresolved quality warning exists. For the MVP ordered source, `expected_min_records=10` is a hard invariant: even a gapless nine-row result is quarantined.

Healing is enabled only after diagnosis:

~~~ts
if (
  observation.classification === "UNTRUSTED_OBSERVATION" &&
  inspection.confirmsExpectedEvidenceStillPresent &&
  inspection.confirmsCollectorMissedEvidence
) {
  incident.cause = "EXTRACTION_DRIFT";
  incident.status = "READY_TO_HEAL";
}
~~~

### 11.5 Baseline rules

The first run has no historical reference. It can become the baseline only when:

- Every dataset row passes SourceEvidenceRowV1.
- It meets the source configuration: at least ten vendors and ordered ranks beginning at one.
- Required-field and evidence coverage meet trusted thresholds.
- An operator reviews and confirms it once.

Before confirmation, the run is `BASELINE_PENDING_APPROVAL`, the source is `BASELINE_PENDING`, and no trusted pointer exists. Confirmation records actor and timestamp, changes the run to `ACCEPTED`, and promotes the snapshot atomically.

Production evolution may replace the fixed baseline with rolling median and median-absolute-deviation thresholds. That is not required for the hackathon.

### 11.6 Trusted promotion

When a run passes:

1. Store immutable raw Bright Data output.
2. Store normalized snapshot.
3. Record every validation result.
4. Set `publish_allowed = true`.
5. Atomically update the source’s last-trusted-snapshot pointer in an evidence-promotion transaction.
6. Commit evidence promotion independently of insight generation.
7. Generate insights idempotently after promotion; retain the prior insight with a stale label if generation fails.
8. Preserve the previous snapshot for comparison.

### 11.7 Quarantine

When a run fails:

1. Preserve raw and normalized broken output.
2. Set `publish_allowed = false`.
3. Do not update customer metrics.
4. Continue serving the last trusted snapshot.
5. Display its original collection timestamp and age.
6. Create an incident with failed checks.
7. Calculate affected metrics and recommendations.
8. Generate an inspection package.
9. Generate a repair package only after an operator/Codex inspection confirms extraction drift.

Customer-facing copy:

> **Latest run quarantined**<br>
> The collector returned ranks 4–10 while the last trusted observation contained ranks 1–10. Publishing this run could falsely report a source-evidence loss. Showing the last trusted snapshot while the collector is reviewed.

### 11.8 Repair-prompt generation

The initial prompt is generated only from observed evidence:

~~~text
The current collector returned 7 ranked vendors instead of the
trusted baseline of 10. The returned sequence begins at rank 4,
so ranks 1–3 are missing. Required fields in the seven returned
records remain valid.

Inspect the current page and update interaction/parsing so all
ranked vendors and their evidence are extracted. Preserve the
existing SourceEvidenceRowV1 schema and every field name and type.
~~~

Codex then inspects the changed target and enriches the diagnosis:

~~~text
The top three vendors moved into a JavaScript featured carousel,
and their supporting evidence moved behind expandable panels.
Extract both featured and standard vendor cards, expand evidence
panels, and preserve SourceEvidenceRowV1 exactly.
~~~

This is more credible than claiming a count anomaly alone can identify arbitrary DOM changes.

### 11.9 Post-heal verification gate

A repaired run is promotable only if:

- Collector ID exactly matches the original `c_*`.
- Schema version is still 1.0.
- App contract hash is unchanged.
- The exported Bright Data production output-schema hash matches the pre-heal artifact.
- Observed runtime shape matches SourceEvidenceRowV1.
- Structural validation passes.
- No warning or blocking semantic check remains.
- Record count meets the configured hard minimum of ten.
- Ordered ranks begin at one and contain no gaps.
- Duplicate brands and ranks are zero.
- Required-field completeness is at least 95%.
- Evidence coverage is at least 90%.
- The downstream contract test passes without application changes.
- Raw broken and healed snapshots remain linked to the incident.
- Human approval and verification are recorded in the audit log.

For Scenario A, the baseline and healed `business_facts_hash` must match exactly. This verifies that the layout-only repair restored brand, rank, claim, evidence, features and outbound links—not merely the row count. Brand-set Jaccard is displayed as a diagnostic, not used as the final acceptance gate.

Scenario B deliberately changes facts and therefore uses normal trusted-source-change rules rather than Scenario A’s exact hash match.

---

## 12. State machines

Run, incident and source trust are independent state machines.

### 12.1 Collector run

~~~mermaid
stateDiagram-v2
    [*] --> QUEUED
    QUEUED --> COLLECTING
    QUEUED --> FAILED: trigger or configuration failure
    COLLECTING --> VALIDATING
    COLLECTING --> FAILED: transport or configuration failure
    VALIDATING --> BASELINE_PENDING_APPROVAL: first valid baseline
    BASELINE_PENDING_APPROVAL --> ACCEPTED: operator confirms
    BASELINE_PENDING_APPROVAL --> QUARANTINED: operator rejects
    VALIDATING --> ACCEPTED: trusted monitoring or verification run
    VALIDATING --> QUARANTINED: unsafe observation
~~~

Every verification creates a new run with `purpose=VERIFICATION` and an `incident_id`. It begins at QUEUED; the incident can simultaneously be VERIFYING.

### 12.2 Incident

~~~mermaid
stateDiagram-v2
    [*] --> OPEN
    OPEN --> DIAGNOSING
    DIAGNOSING --> READY_TO_HEAL: extraction drift confirmed
    DIAGNOSING --> RESOLVED: another layer fixed
    READY_TO_HEAL --> HEALING
    HEALING --> AWAITING_APPROVAL: Bright Data fix ready
    HEALING --> REPAIR_FAILED
    AWAITING_APPROVAL --> APPLYING_REPAIR: human authorizes approval
    AWAITING_APPROVAL --> REJECTED: human rejects
    APPLYING_REPAIR --> AWAITING_APPROVAL: another review step requested
    APPLYING_REPAIR --> READY_TO_VERIFY: status done and production saved
    APPLYING_REPAIR --> REPAIR_FAILED
    READY_TO_VERIFY --> VERIFYING: verification run starts
    VERIFYING --> RESOLVED: verification run accepted
    VERIFYING --> READY_TO_HEAL: verification quarantined
    REJECTED --> READY_TO_HEAL: revise and reopen
    REPAIR_FAILED --> READY_TO_HEAL: retry with new attempt
    READY_TO_HEAL --> ABANDONED: operator abandons
    REJECTED --> ABANDONED: operator abandons
    REPAIR_FAILED --> ABANDONED: operator abandons
~~~

### 12.3 Source trust

~~~mermaid
stateDiagram-v2
    [*] --> UNINITIALIZED
    UNINITIALIZED --> BASELINE_PENDING: first valid run
    BASELINE_PENDING --> TRUSTED: operator confirms baseline
    TRUSTED --> STALE_PROTECTED: latest run quarantined
    STALE_PROTECTED --> RECOVERING: saved repair ready to verify
    RECOVERING --> TRUSTED: verification accepted
~~~

Rules:

- Only snapshots from ACCEPTED runs can update the trusted pointer.
- QUARANTINED output is never presented as current evidence.
- The last trusted snapshot remains visible and timestamped.
- Failed repair generation is non-destructive.
- Human rejection leaves the source in STALE_PROTECTED.
- ABANDONED releases the fixture lock but keeps the last trusted snapshot and STALE_PROTECTED source state.
- Every transition records timestamp, cause, actor and related artifact.

---

## 13. Persistence model

### 13.1 Tables

| Table | Key fields |
|---|---|
| `source_targets` | id, name, canonical_url, collector_id, schema_version, validation_profile_id, trust_status, last_trusted_snapshot_id, baseline_confirmed_at/by |
| `validation_profiles` | id, version, ordered, expected_rank_start, count thresholds, required fields, uniqueness policy, evidence threshold |
| `replay_sessions` | id, artifact_pack_hash, started_at, completed_at |
| `collector_runs` | id, source_target_id, execution_mode, brightdata_snapshot_id, provenance_brightdata_snapshot_id, replay_session_id, collector_id, purpose, incident_id, retry_of_run_id, attempt, status, classification, fixture_revision, next_poll_at, poll_lease_until, timestamps, error_code |
| `raw_artifacts` | id, run_id, sha256, media_type, original_body_bytes/text, parsed_json, byte_size, created_at |
| `evidence_snapshots` | id, run_id, source_url, normalized_json, app_contract_hash, collector_schema_hash, observed_shape_hash, business_facts_hash, publish_allowed, scraped_at |
| `run_assessments` | id, run_id, classification, publish_allowed, previous_trusted_snapshot_id, assessed_at |
| `validation_checks` | id, run_id, name, severity, passed, expected, observed, message |
| `incidents` | id, source_target_id, failed_run_id, previous_trusted_snapshot_id, status, cause, diagnosis, diagnosis_confirmed_at/by, diagnosis_artifact_id, created_at, resolved_at |
| `healing_attempts` | id, incident_id, collector_id, prompt, status, CLI artifact hashes, preview_json, Studio diff artifact, decision, decided_at/by, auto_save_confirmed_at, production_version_before/after, final_done_artifact_id, verified_run_id |
| `healing_approval_steps` | id, healing_attempt_id, sequence, envelope_artifact_id, status, preview_sample_json, decision, decided_at/by; unique attempt + sequence |
| `insights` | id, type, title, explanation, recommendation, status, generation_error, generated_at |
| `insight_evidence` | insight_id, evidence_snapshot_id; foreign keys and unique pair |
| `audit_events` | id, entity_type, entity_id, action, actor_type, metadata_json, created_at |
| `demo_config` | singleton_id, layout_mode, facts_mode, revision, locked_by_run_id, locked_by_incident_id, locked_until, updated_at/by |

### 13.2 Storage rules

- Raw output is immutable and byte-preserving; hash the exact received body before parsing.
- A run may have only one assessment, but many validation checks.
- Require one byte-preserving raw artifact for every completed response, including empty and schema-invalid bodies.
- Permit zero or one normalized evidence snapshot per run; an empty or structurally invalid body has raw evidence and checks but no valid EvidenceSnapshotV1.
- For LIVE runs, enforce uniqueness of non-null `brightdata_snapshot_id`. REPLAY runs leave that field null and retain the original ID only in `provenance_brightdata_snapshot_id`.
- Every replay run belongs to a distinct `replay_session_id`; provenance IDs are intentionally reusable across replay sessions.
- Atomically claim completed-run ingestion using compare-and-swap or `SELECT ... FOR UPDATE`.
- Use a short polling lease so concurrent clients do not duplicate Bright Data requests.
- On quarantine, atomically hand the fixture lock from the completed run to the new incident; keep it through diagnosis, healing, application and verification.
- Release the fixture lock only after incident resolution or an audited explicit abandonment.
- Evidence promotion updates the trusted pointer in its own transaction.
- Insight generation is a separate idempotent step with retry status.
- Every retry creates a new run linked through `retry_of_run_id`; failed attempts remain immutable.
- Insight lineage uses `insight_evidence`, not an unenforced JSON ID array.
- Broken data is never deleted when an incident is resolved.
- Small demo JSON may remain in Postgres JSONB.
- Production evolution should move large raw artifacts to object storage.
- Source excerpts are bounded to the evidence needed for verification.

### 13.3 Seed data

Seed:

- One source target: Enterprise Support Platforms 2026.
- Customer: NimbusDesk.
- Competitor: HelioSupport.
- Eight additional fictional vendors.
- Expected minimum records: 10.
- Expected ordered rank sequence: starts at 1.
- Validation profile: ordered, start 1, hard minimum of ten records, zero duplicate ranks/brands, 95% completeness and 90% evidence coverage.
- Layout mode: legacy_cards.
- Facts mode: baseline.
- Fixture revision: 1.

---

## 14. Bright Data implementation

This section was checked against current Bright Data documentation on 21 August 2026.

### 14.1 Prerequisites

- Bright Data account.
- Payment method on file for direct Scraper Studio Collection API access.
- API key/token.
- Node.js 20 or newer for the CLI; use the current LTS in the project.
- Bright Data CLI version 0.3.2 or newer. Self-Healing arrived in 0.3.1; version 0.3.2 added the `--auto-save` flag required by this production-approval flow.
- Public, non-paywalled target URL.

The documented commands pin 0.3.2 for reproducibility. Upgrade only after rerunning the command-contract smoke tests and updating the captured CLI-version artifact.

Validate the toolchain:

~~~bash
node --version
npx -p @brightdata/cli@0.3.2 bdata --version
npx -p @brightdata/cli@0.3.2 bdata login
~~~

For headless authentication:

~~~bash
npx -p @brightdata/cli@0.3.2 bdata login --device
~~~

### 14.2 Environment variables

~~~dotenv
# Recognized by the Bright Data CLI in non-interactive use
BRIGHTDATA_API_KEY=

# Used by Magpie’s server-side REST client
BRIGHT_DATA_API_TOKEN=

# Stable, non-secret collector configuration
BRIGHT_DATA_COLLECTOR_ID=c_xxxxxxxxxxxxxxxx

# Application infrastructure
DATABASE_URL=
NEXT_PUBLIC_APP_URL=
DEMO_CONTROL_TOKEN=
REPLAY_MODE=false
~~~

`BRIGHTDATA_API_KEY` and `BRIGHT_DATA_API_TOKEN` may contain the same underlying credential; the separate names make CLI and application behavior explicit.

Security rules:

- Never prefix a secret with `NEXT_PUBLIC_`.
- Never pass the API key on the CLI command line.
- Never commit CLI credential storage, a populated environment file or an Authorization header.
- Redact credentials from terminal transcripts and video.

### 14.3 Custom collector creation

Create the collector from Codex against the canonical Source Shift Lab URL while it serves Layout A:

~~~bash
npx -p @brightdata/cli@0.3.2 bdata scraper create "$TARGET_URL" "Extract one output record per ranked B2B vendor. Required fields: schema_version fixed to 1.0, source_url, page_title, category, source_updated_at, rank, brand, claim, evidence_text, source_section, outbound_url and features. Use Load more until every vendor is visible. Preserve exact source text and links; never infer missing values."
~~~

Expected result:

- Bright Data AI generates a custom scraper schema and code.
- The collector performs a preview run.
- A stable Collector ID beginning with `c_` is returned.
- The same scraper is visible in Scraper Studio for inspection and editing.

Generation can take 5–15 minutes and occasionally longer. Complete this on the first implementation milestone, not near submission.

After creation:

1. Review the generated schema and code in Scraper Studio.
2. **Hard gate:** verify the worker is a custom Browser Worker capable of the required interaction; if not, configure it in Studio before continuing.
3. Preserve a Studio screenshot/export of worker type, interaction code, parser code and production output schema.
4. Make every SourceEvidenceRowV1 field required; use explicit nulls for the two nullable fields and an empty array for missing features.
5. Confirm one output line per vendor.
6. Confirm Load more interaction.
7. Confirm ten rows and ranks 1–10.
8. Save/publish the collector.
9. Record the Collector ID in the source-target configuration.
10. Preserve the prompt, Codex transcript and Studio screenshots.

### 14.4 CLI proof and authoritative batch runs

Use the CLI once to prove Codex can run the collector and to inspect its output:

~~~bash
npx -p @brightdata/cli@0.3.2 bdata scraper run "$BRIGHT_DATA_COLLECTOR_ID" "$TARGET_URL" --pretty -o artifacts/brightdata/cli-preview-output.json
~~~

The **authoritative baseline, broken and verification runs** must use the asynchronous Collection API so each has a stable `j_*` snapshot and `/dca/log` metadata. Codex drives the project command that calls that API:

~~~bash
pnpm magpie collect --source source_support_platforms --purpose baseline
~~~

The command prints the local run ID and Bright Data snapshot ID. The app ingests that exact snapshot and displays the same ID in its UI.

In `package.json`, map `magpie` to the TypeScript command runner—for example, `tsx scripts/magpie.ts`—so every documented `pnpm magpie ...` command works from a clean checkout.

Switch the server-side layout at the same canonical URL, then:

~~~bash
pnpm magpie collect --source source_support_platforms --purpose monitoring
~~~

Export each completed run’s exact response bytes, parsed rows and Bright Data job metadata to the artifact pack.

Required actual outputs:

~~~text
Baseline job lines: 10
Broken job lines:    7
Baseline ranks:      1–10
Broken ranks:        4–10
Collector ID:        unchanged
Job completion:      confirmed by completed dataset and /dca/log
Snapshot IDs:        distinct j_* values, visible in app and artifacts
~~~

### 14.5 Self-healing from Codex

Generate the repair package in Magpie, inspect the changed page from Codex, then run:

~~~bash
npx -p @brightdata/cli@0.3.2 bdata scraper heal "$BRIGHT_DATA_COLLECTOR_ID" "The page still contains ten vendors, but ranks 1-3 moved into a JavaScript featured carousel and their evidence moved behind expandable panels. Restore all vendor rows and evidence while preserving every SourceEvidenceRowV1 field name and type." --url "$TARGET_URL" --timeout 1200 --pretty -o artifacts/brightdata/heal-envelope.json
~~~

Important: the CLI’s `--url` option adds the URL to its suggested next-step command. It does not send a different custom input to the healing API. The demo therefore changes server-side markup at the same canonical URL.

Expected state:

~~~json
{
  "status": "awaiting_approval",
  "preview_result": [
    {"rank": 1, "brand": "AtlasSupport"},
    {"rank": 2, "brand": "NimbusDesk"}
  ],
  "next_step": "bdata scraper approve c_xxx --url https://..."
}
~~~

The JSON above is illustrative. `preview_result` is a sample, not a completeness proof. Its rows must preserve the expected schema and show that the proposed logic is plausible; only the final authoritative batch verification may prove restoration of all ten rows.

Review:

- CLI status, preview result and next-step instruction.
- The actual Self-Healing code diff in Scraper Studio/Versions via the returned Studio URL.
- Preview sample for schema and representative-value correctness.
- Field names and types.
- A full Studio preview if the account/UI makes one available; otherwise do not infer completeness from the CLI sample.
- Whether the interaction covers the carousel and expanders.
- Whether the fix introduces unnecessary broad selectors.

The human authorizes the reviewed proposal; Codex executes approval with the **existing Collector ID**, never a separate fix ID:

~~~bash
npx -p @brightdata/cli@0.3.2 bdata scraper approve "$BRIGHT_DATA_COLLECTOR_ID" --auto-save --url "$TARGET_URL" --timeout 1200 --pretty -o artifacts/brightdata/approval-step-01.json
~~~

Approval may be multi-step. If the returned envelope is again `awaiting_approval`, persist it, review the new diff/sample, and request another explicit human decision. Do not verify until the final approval envelope reports `status=done`, auto-save is confirmed, and the production template version has changed. Persist that final envelope and version as audit artifacts.

Reject an unsafe proposal:

~~~bash
npx -p @brightdata/cli@0.3.2 bdata scraper approve "$BRIGHT_DATA_COLLECTOR_ID" --reject
~~~

Verify:

~~~bash
pnpm magpie collect --source source_support_platforms --purpose verification --incident "$INCIDENT_ID"
~~~

This command is enabled only after the applied repair reaches READY_TO_VERIFY. It creates a new authoritative batch `j_*` run that the app validates and links to the incident. An optional CLI `scraper run` may also be shown, but it is not the source of the app’s proof.

Do not use `--auto-approve` in the submission. The visible Studio diff, CLI preview, human gate, unchanged Collector ID and verified batch rerun are stronger technically and narratively.

#### Raw AI Flow fallback for a different verification URL

The preferred demo uses the same canonical URL. If a different Layout B URL becomes unavoidable, do not rely on CLI `--url`; use:

~~~text
POST /dca/collectors/{collector_id}/refactor_template
  body: { prompt, custom_input: [{ url: layout_b_url }] }

GET /dca/collectors/{collector_id}/refactor_template/progress
  poll until status = pending_answer

POST /dca/collectors/{collector_id}/resume_automation_job
  approve body: { message: true, auto_save: true }
  reject body:  { message: false }
~~~

The raw API calls the approval state `pending_answer`; the CLI envelope calls it `awaiting_approval`. After every resume call, continue polling. If another `pending_answer` appears, require another review decision; stop only at final `done`, then confirm the production version changed before verification.

### 14.6 Application API flow

Trigger the published collector server-side:

~~~http
POST https://api.brightdata.com/dca/trigger?collector=c_xxx&queue_next=1
Authorization: Bearer <server-side token>
Content-Type: application/json

[
  {
    "url": "https://public-app.example/lab/source"
  }
]
~~~

Response:

~~~json
{
  "collection_id": "j_abc123def456"
}
~~~

Bright Data calls this a `collection_id` in the trigger response and a `snapshot_id` elsewhere. Magpie stores one normalized snapshot identifier.

Poll at five-second intervals with a bounded deadline:

~~~http
GET https://api.brightdata.com/dca/dataset?id=j_abc123def456
Authorization: Bearer <server-side token>
~~~

While running:

~~~json
{"status":"building"}
~~~

When complete, the endpoint returns the vendor-row JSON array.

Also fetch job metadata for the audit trail:

~~~http
GET https://api.brightdata.com/dca/log/j_abc123def456
Authorization: Bearer <server-side token>
~~~

Persist useful Bright Data evidence:

- Collector ID.
- Job/snapshot ID.
- Status and timestamps.
- Output line count.
- Success and failure counts.
- Success rate.
- Template version.
- Job duration.

### 14.7 API client behavior

- Use a server-only Bright Data client.
- Accept only allowlisted source-target IDs; do not expose arbitrary URL scraping.
- Set `queue_next=1` for the controlled demo.
- Poll every five seconds.
- Apply bounded exponential backoff with jitter to transient 5xx responses.
- Persist completed datasets immediately: batch snapshots are retained for 16 days and realtime results for 7 days.
- Enforce snapshot-ID uniqueness and atomically claim ingestion with a database lock/compare-and-swap.
- Use `next_poll_at` and a short poll lease so concurrent clients cannot hammer or double-ingest the same Bright Data job.
- Treat repeated completed responses as safe no-ops.
- Put a total collection deadline in configuration.
- Return app run status to the browser; do not proxy a long-lived Bright Data request.

### 14.8 Failure routing

| Failure | Classification | Response |
|---|---|---|
| 401 | Configuration/authentication | Stop and replace the credential |
| 404 | Collector configuration | Verify Collector ID and account access |
| 422 | Input-schema mismatch | Fix the request body |
| API 5xx | Transient transport failure | Bounded retry; do not heal |
| Timeout/browser disconnect/worker busy | Transient infrastructure | Retry; do not heal immediately |
| Invalid URL/dead page/bad input | Input failure | Correct input; do not retry blindly |
| Expired/missing snapshot or dataset | Retention/transport failure | Stop polling and do not heal |
| Fresh `status=done` job with known-valid input and zero rows | Untrusted observation | Quarantine; inspect before healing |
| Fresh successful run with partial/wrong fields | Untrusted observation | Quarantine; inspect before healing |
| Duplicate or missing ranks | Untrusted observation | Quarantine; confirm cause |
| Unexpected schema change after healing | Verification failure | Reject promotion |
| AI-flow rate limit | Healing transport issue | Let CLI backoff or retry later |
| Vague/ineffective proposal | Repair failure | Reject and resubmit a sharper prompt |

Branch on Bright Data error codes where available, not brittle message text.

### 14.9 Optional stronger source evidence

The worker type is already a hard gate. If time permits:

- Enable system fields such as job ID, collector ID, timestamp, error and warning codes.
- Capture before/after source screenshots.
- Capture WARC snapshots for the baseline and broken runs.

WARC can preserve the exact HTML, JavaScript, XHR and response bytes observed during an incident. It is a stretch feature; do not delay the complete self-healing loop for it.

### 14.10 Bright Data artifacts

~~~text
artifacts/brightdata/
├── cli-version.txt
├── create-transcript.txt
├── studio-worker-type.png
├── studio-interaction-code.png
├── studio-parser-code.png
├── cli-preview-output.json
├── baseline-response.raw.json
├── baseline-output.json
├── baseline-job-metadata.json
├── broken-response.raw.json
├── broken-output.json
├── broken-job-metadata.json
├── heal-envelope.json
├── approval-step-01.json
├── approval-final-done.json
├── studio-heal-diff.png
├── verification-response.raw.json
├── healed-output.json
├── healed-job-metadata.json
├── collector-schema-before.json
├── collector-schema-after.json
├── app-contract.json
├── app-contract-hash.txt
├── collector-schema-hash-before.txt
├── collector-schema-hash-after.txt
├── business-facts-hash-before.txt
├── business-facts-hash-after.txt
├── collector-version-before.txt
├── collector-version-after.txt
├── source-before.png
├── source-after.png
├── collector-id.txt
└── terminal-transcript.txt
~~~

Sanitize every artifact before committing. Preserve real IDs and timestamps where safe; remove credentials and sensitive headers.

---

## 15. Application APIs

### 15.1 Collection endpoints

#### `POST /api/collections`

Input:

~~~json
{
  "sourceTargetId":"source_support_platforms",
  "purpose":"BASELINE",
  "incidentId":null
}
~~~

Behavior:

- Resolve allowlisted source URL and Collector ID.
- Create a new QUEUED local run with purpose, attempt number and fixture revision.
- Acquire the fixture/run lock.
- Trigger Bright Data.
- Store the returned snapshot ID and transition to COLLECTING in one transaction.
- On trigger failure, transition to FAILED and release the run lock.
- Return HTTP 202 with local run ID.

#### `GET /api/collections/:runId`

Behavior:

- Return current local state only; GET has no external calls or writes.
- Return assessment summary and incident ID when relevant.

#### `POST /api/collections/:runId/sync`

- Acquire a short database polling lease.
- Perform at most one bounded Bright Data poll.
- If complete, atomically claim ingestion.
- Persist exact raw bytes, parse, normalize and validate once.
- If accepted, release the run lock after promotion.
- If quarantined, atomically hand the run lock to the incident; do not unlock the fixture between those operations.
- Concurrent callers return the already claimed/current state.

#### `POST /api/collections/:runId/retry`

- Allowed only for transport/infrastructure failures.
- Creates a new run with `retry_of_run_id` and incremented attempt number.
- Never retries schema or semantic drift without operator intent.

#### `POST /api/collections/:runId/confirm-baseline`

- Allowed only from BASELINE_PENDING_APPROVAL.
- Records human actor and timestamp.
- Atomically marks the run ACCEPTED and promotes its snapshot.
- Rejects confirmation if any check is unresolved.

### 15.2 Incident endpoints

#### `GET /api/incidents/:incidentId`

Returns:

- Timeline.
- Previous trusted snapshot.
- Broken snapshot.
- Failed checks.
- Affected insights.
- Generated repair prompt.
- Healing attempts.
- Verification result.

#### `POST /api/incidents/:incidentId/diagnosis`

- Stores inspection actor, timestamp and evidence artifact.
- Confirms incident cause or routes the problem to another layer.
- Only confirmed EXTRACTION_DRIFT can advance to READY_TO_HEAL.

#### `GET /api/incidents/:incidentId/heal-package`

Returns a downloadable JSON/Markdown package containing:

- Collector ID.
- Canonical source URL.
- Expected and observed values.
- Failed checks.
- Initial repair prompt.
- Copyable CLI commands without credentials.

The app does not execute arbitrary shell commands.

#### `POST /api/incidents/:incidentId/healing-attempts`

- Creates a healing attempt.
- Stores the exact prompt and links sanitized CLI/Studio artifacts.
- Advances READY_TO_HEAL to HEALING.

#### `POST /api/incidents/:incidentId/healing-attempts/:attemptId/artifacts`

- Imports each CLI progress/approval envelope, preview sample and Studio-diff evidence.
- Hashes artifacts.
- `awaiting_approval` advances or returns the incident to AWAITING_APPROVAL only if the sample preserves the contract and the diff is reviewable.
- Final `status=done` advances the incident to READY_TO_VERIFY and the source to RECOVERING only when auto-save and the changed production template version are evidenced.
- The endpoint is append-only and supports multiple approval steps.

#### `POST /api/incidents/:incidentId/healing-attempts/:attemptId/decision`

- Records human actor, approve/reject decision, timestamp and artifact hashes.
- Approval moves the incident to APPLYING_REPAIR while Codex executes `approve --auto-save`; it does not yet permit verification.
- Rejection leaves the source protected and may later be reopened with a new attempt.

#### `POST /api/incidents/:incidentId/verify`

- Requires an applied healing attempt with final `status=done`, auto-save confirmation and a changed production template version.
- Creates a new run with purpose VERIFICATION, the same Collector ID and incident ID.
- Marks the incident VERIFYING while the run begins QUEUED/COLLECTING.
- Applies the full promotion gate when complete.

#### `POST /api/incidents/:incidentId/abandon`

- Allowed only after an explicit human decision from READY_TO_HEAL, REJECTED or REPAIR_FAILED.
- Records the reason, moves the incident to ABANDONED and releases the fixture incident lock.
- Leaves the source STALE_PROTECTED and continues serving the last trusted snapshot.

#### `POST /api/incidents/:incidentId/reopen`

- Allowed from REJECTED or REPAIR_FAILED.
- Records the operator’s reason, returns the incident to READY_TO_HEAL and keeps the incident fixture lock.
- A subsequent healing attempt is a new immutable record; prior prompts, decisions and artifacts remain intact.

### 15.3 Demo-control endpoint

#### `POST /api/lab/control`

Input:

~~~json
{
  "layoutMode": "featured_carousel",
  "factsMode": "baseline"
}
~~~

Requirements:

- Server-side secret or authenticated control session.
- CSRF protection.
- Rate limiting.
- Audit event.
- Dynamic fixture rendering with no cache.
- Never expose the control token to the browser bundle.
- Increment fixture revision on every accepted change.
- Reject a change while a collection/healing lock is active.

### 15.4 Replay endpoint behavior

When `REPLAY_MODE=true`:

- Do not call Bright Data.
- Load sanitized genuine baseline/broken/healed artifacts.
- Create a new local run and `replay_session_id` for every replay while preserving the original Bright Data snapshot ID only as provenance.
- Replay original timestamps on a relative demo timeline.
- Display a persistent **REPLAY — recorded Bright Data run** badge.
- Use the same normalization, validation and promotion code as live mode.

Replay mode is a resilience feature, not a substitute for completing the real workflow.

---

## 16. UI and product experience

Limit the polished MVP to two primary screens. Evidence details live in a drawer; a dedicated Evidence Explorer is stretch scope. The lab controller is a minimal protected utility.

### 16.1 Screen 1 — Signal Overview

**Purpose:** Show the B2B outcome powered by verified Bright Data evidence.

**Top section**

- Product statement: “Did the market move—or did our measurement break?”
- Current trust-state badge.
- Verified evidence freshness.
- Last trusted timestamp.
- Collector ID and schema version.
- LIVE or REPLAY label.

**Competitive signal**

- NimbusDesk position in the trusted source observation.
- HelioSupport position in the trusted source observation.
- Position change.
- Evidence coverage.
- Top verified evidence gap.
- Recommended action.

**Incident protection**

When the latest run is quarantined:

> **Latest run quarantined**<br>
> The last trusted observation contained ten ranked vendors; the current extraction returned seven and starts at rank 4. We blocked a potentially false source-evidence loss. Showing the last trusted result from 10:42 while the page is inspected.

Do not show broken values in the main metrics.

### 16.2 Screen 2 — Incident Room

**Purpose:** Make failure, containment and self-healing unmistakable.

Persistent customer-facing sequence:

> TRUSTED → INCOMPLETE RUN DETECTED → QUARANTINED → DRIFT CONFIRMED → HEALING → AWAITING APPROVAL → APPLYING REPAIR → READY TO VERIFY → VERIFYING → RECOVERED

RECOVERED is a customer-facing label for an incident whose persisted status is RESOLVED after an accepted verification run.

The dominant view is one three-column comparison:

> **Trusted baseline: 10** → **Quarantined run: 7** → **Healed run: 10**

Keep these items visible:

- Bright Data run proof: same Collector ID, different snapshot IDs.
- Before/broken/healed output-line counts.
- Rank sequences.
- Schema result versus semantic result.
- Missing top-three rows and a concise baseline/broken/healed diff.
- Failed validation rules.
- “False insight prevented” card.
- Last-known-good protection.
- Source before/after screenshots.
- Generated repair prompt.
- Copyable Codex/CLI command.
- Bright Data preview and diff summary.
- Human approval status.
- Schema-hash and Collector-ID verification.
- Compact audit timeline.

Put raw logs, all checks and full JSON behind expandable details.

Critical copy:

> **False insight prevented:** “NimbusDesk disappeared from the category shortlist.”<br>
> **Confirmed cause:** The collector missed the new featured-vendor carousel.

Show “confirmed” only after Codex/operator inspection is stored with actor, timestamp and source evidence.

### 16.3 Evidence drawer; dedicated screen is stretch

**Purpose:** Prove the structured output powers a useful B2B product.

- Vendor table sorted by rank.
- Brand, claim, evidence excerpt, features and source link.
- Trust badge on each row.
- Baseline/current comparison.
- Evidence and outbound-link coverage.
- Raw Bright Data output.
- Provenance: Collector ID, snapshot ID, app-contract hash, collector-schema hash and timestamp.
- Highlight records restored by healing.
- In stretch mode only, highlight trusted competitor movement after recovery.

### 16.4 Protected Source Shift Lab control utility

- Current canonical target URL.
- Layout toggle: legacy_cards / featured_carousel.
- Optional stretch-only facts toggle: baseline / competitor_move.
- Reset button.
- Clear “controlled fixture” label.
- Preview link.
- Audit log.
- Confirmation before changing mode during a live collection.
- Fixture revision and lock owner/expiry.
- Reject changes while a run or incident owns the fixture lock.

### 16.5 Source Shift Lab page

The public source itself must look like a believable B2B comparison publication, not a test harness.

Required content:

- Publication masthead.
- “Enterprise Support Platforms 2026” headline.
- Methodology note.
- Ten fictional vendor entries.
- Ranked position.
- Concise claim and evidence.
- Feature tags.
- Outbound product link.
- Source update date.
- Accessible carousel and expanders in Layout B.
- Small disclosure footer: “Synthetic public fixture for scraper-reliability testing.”

### 16.6 Design system

- Dark navy/charcoal foundation.
- Iridescent magpie green-blue as the product accent.
- Green: trusted.
- Amber: drift suspected.
- Red: quarantined.
- Blue: healing/verifying.
- Purple: recovered.
- Monospace treatment for IDs, hashes and JSON.
- Do not rely on color alone; pair icon, label and copy.
- Minimum WCAG AA contrast.
- Keyboard access for every control.
- Respect reduced-motion preferences.
- Mobile layout is readable, but desktop judging is the priority.

### 16.7 Product copy rules

Use:

- Trusted evidence.
- Latest run quarantined.
- Showing last verified result.
- Extraction drift.
- Trusted source observation.
- Freshest verified observable evidence.

Avoid:

- Absolute truth.
- Guaranteed ranking lift.
- The AI algorithm changed, unless directly evidenced.
- All GEO tools scrape.
- Your competitor definitely caused this.
- Automated backlink generation.

---

## 17. Insight generation

The downstream product must demonstrate utility without making unsupported causal claims.

### 17.1 Derived metrics

| Metric | Calculation |
|---|---|
| Brand position | Rank of the tracked brand in trusted rows |
| Competitor position | Rank of each configured competitor |
| Evidence completeness | Rows with non-empty evidence divided by total rows |
| Link coverage | Rows with valid outbound URL divided by total rows |
| Feature coverage | Unique normalized features by brand |
| Evidence freshness | Time since the trusted snapshot |
| Trust status | Promotion state of the evidence snapshot |

### 17.2 Snapshot comparison

For two trusted snapshots:

- Added/removed brands.
- Rank changes.
- Claim changes.
- Evidence-text changes.
- New or removed features.
- Outbound-link changes.

A changed fact with a healthy collection becomes TRUSTED_SOURCE_CHANGE. Failed invariants first create UNTRUSTED_OBSERVATION; page inspection must confirm EXTRACTION_DRIFT before healing.

### 17.3 Deterministic recommendation rules

Core Scenario A containment rule:

~~~text
IF latest run is quarantined
AND a last trusted snapshot exists
THEN recommend:
“Hold any source-loss response. Keep the previous content and PR plan
while the collector is repaired; the apparent disappearance is untrusted.”

IF verification matches the Scenario A business-facts hash
THEN recommend:
“Clear the source-loss alert. No source-fact change was observed;
resume the previous plan.”
~~~

Stretch Scenario B evidence-gap rule:

~~~text
IF competitor moved above customer
AND competitor gained benchmark-related evidence
AND customer lacks benchmark-related evidence
THEN recommend:
“Close the benchmark evidence gap with a verifiable study,
customer proof or independently sourced comparison evidence.”
~~~

Recommendations:

- Never suggest fake reviews, automated posting or paid ranking links.
- Link to exact evidence rows.
- Include confidence and snapshot timestamp.
- State that a source-level change is not proof of an LLM ranking cause.

---

## 18. Security, compliance and research honesty

### 18.1 Collection policy

- Collect only publicly available pages.
- Do not target login-protected, private, paywalled or restricted information.
- Do not target government sites for the hackathon.
- Do not collect names, emails or unnecessary personal data.
- Use one controlled source and conservative request frequency.
- Cache and persist results to avoid needless repeated collection.
- Respect Bright Data’s Acceptable Use Policy and applicable source terms.

### 18.2 Application security

- Allowlist source-target IDs and server-resolved URLs.
- Do not provide an arbitrary URL proxy endpoint.
- Validate URL protocol and hostname to prevent SSRF.
- Keep API credentials in server-only environment variables.
- Redact Authorization headers and credentials from logs.
- Protect demo controls with a secret/authenticated session and CSRF checks.
- Rate-limit collection and demo-control endpoints.
- Escape all source text before rendering.
- Sanitize any limited rich text.
- Add `rel="noopener noreferrer"` to external links.
- Enforce response-size and polling-time limits.
- Do not execute generated shell text in the application.
- Export a repair command for Codex; the server never passes untrusted content to a shell.
- Human approval is required for repair promotion.

### 18.3 Data handling

- Persist only bounded evidence excerpts and derived fields for third-party sources.
- Hash raw artifacts and record provenance.
- Store the full controlled fixture freely because the project owns it.
- Document retention and deletion behavior.
- Export Bright Data evidence promptly because platform retention is limited.
- Avoid committing copyrighted page bodies or WARC files from third-party sources.
- Make public demo artifacts synthetic or clearly within permitted use.

### 18.4 SEO/GEO ethics

The product may:

- Identify evidence gaps.
- Recommend original content and verifiable research.
- Recommend legitimate digital PR or publisher outreach.
- Track earned citations and public backlinks.

The product must not:

- Create mass forum comments.
- Automate fake accounts, reviews, votes or engagement.
- Buy or generate ranking links.
- Impersonate users.
- Claim guaranteed search or LLM placement.

### 18.5 Research claims

- Attribute every market statistic.
- Label vendor-reported traction as vendor-reported.
- Label preprints as preprints.
- Do not call GitHub repositories commercial products.
- Do not say GEO replaces SEO.
- Do not claim competing products lack internal safeguards.
- Do not claim a single model response is ground truth.
- Use “freshest verified observable evidence.”

---

## 19. Observability and operations

### 19.1 Structured logging

Every log event includes:

- Local run ID.
- Source-target ID.
- Collector ID.
- Snapshot ID when available.
- Incident ID when available.
- Lifecycle state.
- Event classification.
- Duration.
- Retry count.
- Error code.

Never log the API token, full Authorization header or demo-control token.

### 19.2 Audit events

Record:

- Collection requested.
- Bright Data job created.
- Dataset received.
- Raw artifact stored.
- Validation started/completed.
- Snapshot promoted/quarantined.
- Incident created.
- Heal package generated.
- Codex repair started.
- Bright Data fix ready.
- Human approved/rejected.
- Verification requested.
- Recovery passed/failed.
- Demo layout/facts mode changed.

### 19.3 Operational metrics

- Collection success rate.
- Collection duration.
- Dataset line count.
- Validation failure by rule.
- Quarantine rate.
- Time since last trusted snapshot.
- Incident age.
- Repair attempts per incident.
- Mean time to verified recovery.
- Replay/live mode usage.

### 19.4 Failure-safe behavior

- If the database is unavailable, do not claim new evidence is trusted.
- If Bright Data is unavailable, retain the last trusted snapshot and show its age.
- If polling times out, classify TRANSPORT_FAILURE and offer bounded retry.
- If normalization fails after raw persistence, retain the raw artifact for recovery.
- If verification fails, keep the incident quarantined.
- If the proposed repair is rejected, keep the original collector and last trusted result.
- If a downstream insight fails to generate, never roll back a valid trusted snapshot; record an insight-layer failure separately.

---

## 20. Test strategy

### 20.1 Scenario matrix

| Scenario | Expected classification | Publish? | Heal? |
|---|---|---:|---:|
| Baseline returns ranks 1–10 | NO_CHANGE | Yes after baseline confirmation | No |
| Same facts and healthy collection | NO_CHANGE | Yes | No |
| Schema-valid ranks 4–10 | UNTRUSTED_OBSERVATION; later EXTRACTION_DRIFT if confirmed | No | Only after confirmation |
| Fresh done job with zero rows | UNTRUSTED_OBSERVATION | No | Only after confirmation |
| Expired/missing dataset | Retention/transport failure | No | No |
| Invalid rank type | UNTRUSTED_OBSERVATION | No | Only after diagnosis |
| Duplicate ranks | UNTRUSTED_OBSERVATION | No | Only after diagnosis |
| Count drops to 80% with no hard gap | UNTRUSTED_OBSERVATION | No | Human diagnosis |
| Gapless ranks 1–9 with rank 10 missing | UNTRUSTED_OBSERVATION | No | Human diagnosis |
| HTTP 500 or timeout | TRANSPORT_FAILURE | No | No; retry |
| Invalid API credential | TRANSPORT_FAILURE/config error | No | No |
| Competitor claim changes with ten valid rows | TRUSTED_SOURCE_CHANGE | Yes | No |
| Layout changes but collector still returns complete valid output | NO_CHANGE or TRUSTED_SOURCE_CHANGE | Yes | No |
| Human rejects confirmed repair | EXTRACTION_DRIFT incident remains protected | No | Revise prompt |
| Repair changes schema | Verification failure | No | Reject/repair again |
| Healed output restores ranks 1–10 | NO_CHANGE; incident resolves to RECOVERED | Yes | No |
| Same LLM prompt returns another answer | MODEL_VARIANCE, post-MVP | Aggregate | Never |
| Citation no longer supports a claim | ATTRIBUTION_BREAK, post-MVP | Flag | Do not heal unless extraction failed |

### 20.2 Unit tests

**Contracts**

- Valid SourceEvidenceRowV1.
- Missing required fields.
- Invalid URL.
- Invalid rank.
- Strict schema-version handling.
- App-contract hash stability.
- Exported collector-schema hash comparison.
- Observed-shape hash.
- Exact business-facts hash.

**Semantic checks**

- Configured record-count minimum and missing-tail behavior.
- Required-field completeness.
- Evidence coverage.
- Duplicate brand calculation.
- Duplicate rank detection.
- Minimum-rank invariant.
- Missing-rank detection.
- Empty dataset.
- Brand-set Jaccard.
- Hard expected-minimum boundary at nine versus ten records, including a missing-tail case with otherwise gapless ranks.

**Classifier**

- Transport failure wins over drift rules.
- Hard invariant creates UNTRUSTED_OBSERVATION and quarantine.
- Any unresolved warning prevents publication.
- Fact change plus one warning cannot become TRUSTED_SOURCE_CHANGE.
- Healthy identical snapshot becomes NO_CHANGE.

Stretch classifier test:

- Healthy fact change becomes TRUSTED_SOURCE_CHANGE.

**Pipeline**

- Raw artifact is stored before normalization.
- Empty or structurally invalid completed bodies store raw evidence without creating EvidenceSnapshotV1.
- Quarantined run cannot update trusted pointer.
- Trusted promotion is atomic.
- Last trusted snapshot remains unchanged after failure.
- Incident links correct snapshots.
- Repair prompt contains only observed facts.
- Insight builder rejects untrusted evidence.
- Baseline cannot promote before operator confirmation.
- Verification cannot start before an applied, auto-saved healing attempt with final `status=done`.
- A second `awaiting_approval` envelope returns APPLYING_REPAIR to AWAITING_APPROVAL and requires a new human decision.
- READY_TO_VERIFY requires a changed production version; an approval decision alone is insufficient.
- Scenario A healed facts hash must exactly match baseline.

### 20.3 Contract fixtures

Commit sanitized genuine examples:

- `baseline-output.json`: ten valid rows, ranks 1–10.
- `broken-output.json`: seven valid rows, ranks 4–10.
- `healed-output.json`: ten valid rows, ranks 1–10.
- Stretch only: `competitor-move-output.json`, ten valid rows with HelioSupport #2.

Assertions:

- Baseline passes structural and semantic validation.
- Broken passes structural validation.
- Broken fails semantic validation.
- Healed passes both.
- Baseline and healed share the app-contract and exported collector-schema hashes.
- Baseline and healed share the exact Scenario A business-facts hash.
- Actual artifact metadata shares Collector ID.
- Broken snapshot cannot be consumed by insight generation.

### 20.4 Integration tests

Mock Bright Data at the HTTP boundary:

- Trigger returns snapshot ID.
- Building status is handled.
- Completed array is persisted and normalized.
- Job metadata is captured.
- 401, 404 and 422 are terminal configuration/input failures.
- 5xx receives bounded exponential retry.
- Timeout is not mistaken for extraction drift.
- Duplicate snapshot ingestion is idempotent.
- Verification creates a new run under the same Collector ID.
- Two concurrent completion syncs ingest once.
- Promotion rollback never points at quarantined evidence.
- Quarantine atomically hands the fixture lock from run to incident; control changes remain rejected until resolution or audited abandonment.
- Audited abandonment releases the fixture lock without promoting broken evidence.
- A healed result with correct brands but wrong ranks/evidence fails.
- A rejected repair leaves the collector/trusted pointer unchanged.
- Two replay sessions using the same original Bright Data IDs both complete under distinct local IDs.
- Live snapshot-ID uniqueness is enforced while replay provenance IDs remain reusable.
- Fresh done empty array and expired/not-found dataset route differently.
- Stored raw-body hash matches the exact received bytes.
- Illegal state transitions are rejected.

Keep one opt-in live Bright Data smoke test outside the default CI suite.

### 20.5 End-to-end replay tests

~~~text
reset fixture
→ ingest baseline
→ confirm TRUSTED
→ replay broken artifact
→ confirm QUARANTINED
→ confirm main metrics still show baseline
→ attach healing artifacts
→ move through HEALING, AWAITING_APPROVAL and APPLYING_REPAIR
→ import final done/auto-save artifact and confirm READY_TO_VERIFY
→ request verification and confirm incident VERIFYING
→ replay healed artifact
→ confirm incident RESOLVED / UI RECOVERED
→ confirm trusted pointer and dashboard update
~~~

Stretch-only second flow; exclude it from the MVP/CI completion gate:

~~~text
trusted recovered layout
→ ingest healthy competitor-move artifact
→ classify TRUSTED_SOURCE_CHANGE
→ publish NimbusDesk #3 / HelioSupport #2
→ show evidence-backed recommendation
~~~

### 20.6 UI quality tests

- Loading, empty, trusted, quarantined, healing, awaiting-approval, applying-repair, ready-to-verify, verifying, recovered and failed states.
- LIVE versus REPLAY labels.
- Keyboard navigation.
- Focus order and visible focus.
- Status not communicated by color alone.
- Responsive desktop/tablet/mobile layouts.
- Long evidence text truncation and expansion.
- Safe external links.
- Raw JSON drawer performance.
- Automated accessibility scan with no critical violations.

### 20.7 CI quality gate

The pull request/build gate runs:

~~~text
pnpm lint
pnpm typecheck
pnpm test
pnpm test:contract
pnpm test:e2e
pnpm build
~~~

A clean checkout must reproduce the replay demo without Bright Data credentials.

---

## 21. Build execution plan

The schedule assumes a compressed hackathon build. Complete the risky Bright Data work before visual polish.

### 21.0 Reality check and one-day crash plan (added 22 August 2026)

**Situation:** As of 22 August, no code exists and the submission window closes on 23 August. The 42-hour schedule below cannot be executed in full. It is retained as the reference design; the crash plan below is what actually runs now. The original-work rule is satisfied (this plan counts as pre-event planning; all code is written inside the event window).

**Non-negotiable internal cutoffs:**

- 23 August 12:00 UTC: everything frozen — README, demo video recorded, Google Form submitted.
- 23 August 06:00 UTC: stop all feature work; only the demo recording and submission remain.
- If the Phase 2 evidence pack (genuine 10 → 7 → heal → 10 artifacts) is not captured by 22 August late evening, cut scope to "collector + heal + terminal transcript + README with embedded artifacts" and still submit — an honest small submission beats no submission.

| Block | Hours | What ships | Deferred/cut from the full plan |
|---|---|---|---|
| Crash 0 — Access | 0.5 | Promo-code credits, CLI auth, Studio access verified | P0-02..P0-04 (fixture eligibility question; the controlled lab is public and self-hosted, which satisfies the rules) |
| Crash 1 — Fixture | 1.5 | Source Shift Lab Layout A/B deployed at one URL with a secret toggle | Polish, demo-control screen (use the toggle endpoint + curl) |
| Crash 2 — Evidence pack | 4 | The full P2-01..P2-09 sequence: genuine baseline, broken run, diagnosis, heal, approve, verify, plus saved raw artifacts and transcript. **This is the entire award case — do not leave this block** | — |
| Crash 3 — Trust engine | 3 | Structural/semantic checks, quarantine, last-known-good gate as a small typed module over the captured artifacts; unit tests for the 10→7 case | Postgres/Drizzle (use SQLite or in-memory + JSON artifacts), state-machine ceremony, concurrency locks |
| Crash 4 — Minimal product | 4 | Two screens: Signal Overview + Incident Room reading from replayed genuine artifacts; evidence drawer reduced to a JSON view; replay mode | Live batch trigger from the UI (link the genuine `j_*` runs instead), accessibility scan, responsive polish, Scenario B, Evidence Explorer |
| Crash 5 — README + demo | 3 | Judge-first README with the artifact/hashes table, architecture diagram, transcript excerpt, AI-tooling disclosure; ≤3-minute screen recording (screen-record the replay path, which is deterministic) | Three-viewer testing (get one friend if possible), E2E suite beyond the replay test |

Roughly 16 working hours — feasible for one long day if Bright Data access works on the first try, which is why Crash 2 starts immediately and why every later block consumes its captured artifacts rather than depending on live runs.

**De-risking notes for the crash plan:**

- The presentation criterion is weighted equally with code, and the rules require only a demo video "showing the working project." Recording the deterministic replay path with genuine Collector IDs and `j_*` snapshots visible satisfies it honestly as long as the README labels replay vs live clearly.
- The AI-tooling disclosure is mandatory — state in the README and submission which agent (Codex/ZCode) drove collector creation and healing, and what the human approved.
- Git commit early and often with meaningful messages: original-work-during-the-event compliance is proven by commit history starting inside the window.

### Phase 0 — Eligibility and Bright Data access, hours 0–1

| ID | Task | Done when |
|---|---|---|
| P0-01 | Validate account, payment/API access, CLI v0.3.2+ and authentication | CLI and batch API smoke tests work |
| P0-02 | Confirm custom Scraper Studio eligibility and non-prebuilt use | Requirement documented |
| P0-03 | Choose real-source smoke target or obtain organizer fixture confirmation | Credibility gate documented |
| P0-04 | Reserve public deployment URL | Bright Data can reach a placeholder |

**Gate:** Stop immediately if Scraper Studio creation/healing access is unavailable.

### Phase 1 — Minimal chaos fixture, hours 1–4

| ID | Task | Done when |
|---|---|---|
| P1-01 | Scaffold the smallest deployable app/fixture | Public URL works |
| P1-02 | Render ten fictional vendors in Layout A | Ranks 1–10 visible |
| P1-03 | Add Layout B with top-three carousel and expanders | Same facts, changed DOM |
| P1-04 | Add a minimal protected same-URL toggle with revision/lock | Deterministic switching works |
| P1-05 | Disable caching and deploy | External requests see current revision |

Do not polish the fixture yet.

### Phase 2 — Prize mechanism first, hours 4–11

| ID | Task | Done when |
|---|---|---|
| P2-01 | Create custom collector from Codex | Stable `c_*` exists |
| P2-02 | Verify Browser Worker, interaction, parser and output schema in Studio | Evidence screenshots/exports saved |
| P2-03 | Publish and run authoritative batch baseline | Genuine `j_*`, 10 lines, ranks 1–10 |
| P2-04 | Switch same URL to Layout B and rerun unchanged collector | Genuine `j_*`, 7 lines, ranks 4–10 |
| P2-05 | Inspect page and record confirmed extraction-drift diagnosis | Actor, timestamp and source evidence saved |
| P2-06 | Run heal, capture preview sample and Studio diff | `awaiting_approval`, schema-valid sample and reviewable diff |
| P2-07 | Human authorizes; Codex executes approve with auto-save through every required step | Final `status=done`, changed production version, same Collector ID |
| P2-08 | Run authoritative batch verification | Incident-linked new `j_*`, 10 lines, exact business-facts hash |
| P2-09 | Export raw bytes, logs, schemas, versions, hashes and transcript | Genuine evidence pack complete |

**Hard gate:** Do not build the product until 10 → 7 → heal → 10 has actually succeeded.

### Phase 3 — Core app and persistence, hours 11–17

| ID | Task | Done when |
|---|---|---|
| P3-01 | Pin Next.js/TypeScript, lint, test and build tooling | Clean CI skeleton |
| P3-02 | Configure Postgres/Drizzle and state tables | Migrations and seed work |
| P3-03 | Implement server-only batch trigger/poll/log client | Exact `j_*` lineage works |
| P3-04 | Store byte-preserving raw responses and hashes | Original bodies verifiable |
| P3-05 | Normalize SourceEvidenceRowV1 and all four hashes | Evidence snapshots stored |
| P3-06 | Add replay sessions using genuine Phase 2 artifacts | Same pipeline accepts replay |

### Phase 4 — Trust, quarantine and healing workflow, hours 17–24

| ID | Task | Done when |
|---|---|---|
| P4-01 | Implement structural/semantic checks and boundaries | Unit/contract tests pass |
| P4-02 | Implement separate run/incident/source state machines | Illegal transitions rejected |
| P4-03 | Implement baseline confirmation | No unapproved baseline promotes |
| P4-04 | Implement atomic trusted promotion and last-known-good reads | Broken data cannot reach metrics |
| P4-05 | Implement quarantine, diagnosis confirmation and repair package | Heal locked until confirmed |
| P4-06 | Implement healing-attempt artifact/decision endpoints | Approval is auditable |
| P4-07 | Implement verification-run gate | Only approved attempt can verify |
| P4-08 | Add concurrency locks and fixture locks | Double ingestion/config drift prevented |

**Gate:** Replay the genuine broken artifact and prove the trusted pointer never moves.

### Phase 5 — Two-view product, hours 24–30

| ID | Task | Done when |
|---|---|---|
| P5-01 | Build Signal Overview | Trusted/stale/recovered source evidence clear |
| P5-02 | Build three-column Incident Room | 10 → 7 → 10 dominates |
| P5-03 | Add evidence/provenance drawers | IDs, hashes and rows inspectable |
| P5-04 | Add minimal control utility and mode labels | Controlled/LIVE/REPLAY explicit |
| P5-05 | Add responsive/accessibility essentials | No critical accessibility issue |

### Phase 6 — Production integration and quality, hours 30–35

| ID | Task | Done when |
|---|---|---|
| P6-01 | Ingest an actual new batch API run through production path | Not replay-only |
| P6-02 | Complete concurrency, retention and state-transition tests | Critical tests green |
| P6-03 | Complete full replay E2E twice consecutively | Repeatable |
| P6-04 | Complete security/secret review | No critical findings |
| P6-05 | Run real-source smoke or attach organizer confirmation | Credibility proof complete |

### Stretch Phase 7 — Trusted source-fact change, hours 35–37

Only proceed if every prior gate passes.

| ID | Task | Done when |
|---|---|---|
| P7-01 | Toggle facts to competitor_move with healthy Layout B | Ten rows remain |
| P7-02 | Classify TRUSTED_SOURCE_CHANGE | No healing triggered |
| P7-03 | Generate source-level evidence-gap action | Scope boundary visible |
| P7-04 | Add dedicated Evidence Explorer if time remains | Does not affect core demo |

### Phase 8 — Documentation and submission, hours 35–42

| ID | Task | Done when |
|---|---|---|
| P8-01 | Write judge-first README and architecture/incident/compliance docs | Stranger can follow proof |
| P8-02 | Verify artifacts, hashes, links and clean checkout | Reproducible |
| P8-03 | Record simplified demo under 2:45 | At least 15 seconds buffer |
| P8-04 | Test with three uninvolved viewers | All understand failure/heal/output |
| P8-05 | Submit early and retain confirmation | Submission accepted |

### 21.1 Solo prioritization

If time runs short, preserve this order:

1. Genuine collector.
2. Genuine broken output.
3. Quarantine.
4. Genuine self-heal and verification.
5. Incident Room and Overview.
6. Replay and critical tests.
7. Real-source/eligibility proof.
8. Additional analytics and polish.

Remove Scenario B before weakening Scenario A.

### 21.2 Team parallelization

| Role | Focus |
|---|---|
| Builder A | Source Shift Lab and Bright Data collector |
| Builder B | API, persistence and trust engine |
| Builder C | UI, replay and accessibility |
| Builder D | Testing, documentation, artifacts and demo production |

All team members must understand the complete architecture and be able to explain generated code.

---

## 22. Three-minute judge demo

Target final duration: **2:40–2:45**, leaving at least 15 seconds of margin.

### 0:00–0:12 — The market problem

**Voiceover**

> “Software is becoming abundant. GitHub saw more than 230 new repositories created every minute in 2025. The harder problem is no longer only shipping—it is entering the buyer’s consideration set.”

**On screen**

- One sourced statistic.
- Rapid product/category visual.
- No dense market slide.

### 0:12–0:25 — B2B discovery and trust

**Voiceover**

> “B2B buyers increasingly use GenAI to research products and vendors. GEO workflows depend on public evidence sources, but when a source-backed signal changes, a growth team cannot tell whether the source changed or its collector broke.”

**On screen**

- One Gartner statistic.
- Four-cause red-arrow graphic.

### 0:25–0:38 — Product reveal

**Voiceover**

> “Magpie is the evidence-integrity layer for GEO workflows. It proves the underlying source observation is trustworthy before a growth team acts.”

**On screen**

- Trusted Signal Overview.
- NimbusDesk at #2.
- Ten verified vendor rows.
- Bright Data Collector ID.

### 0:38–0:52 — Scraper Studio and Codex

Do not create the collector live. Show the actual Collector ID, a fast Studio view of worker/interaction/parser/schema, and the Codex-driven batch command whose snapshot appears in the app.

~~~bash
pnpm magpie collect --source source_support_platforms --purpose baseline
~~~

**Voiceover**

> “We created this custom interactive collector in Bright Data Scraper Studio and drove it directly from Codex. Its ten structured rows power the product you just saw.”

**Proof on screen**

- Browser Worker/interaction.
- Output schema.
- Ten job lines.
- Collector ID.

### 0:52–1:20 — The site changes under it

Switch the canonical URL to Layout B, then show the actual unchanged collector run.

**On screen**

- Public page still visibly contains ten vendors.
- Top three now live in a carousel.
- Bright Data run succeeds.
- JSON remains schema-valid.
- Job lines fall 10 → 7.
- Ranks are 4–10.
- NimbusDesk appears to disappear.

**Voiceover**

> “In our controlled chaos test, the same public page redesigns. All ten vendors still exist, but the top three move into a carousel. The collector succeeds and returns valid JSON—yet it creates a believable, false business conclusion.”

Large frame:

> **RUN SUCCEEDED. JSON VALID. BUSINESS CONCLUSION WRONG.**

### 1:20–1:47 — Magpie contains the failure

**On screen**

- Incident Room.
- Record ratio 70%.
- Minimum rank 4.
- Missing ranks 1, 2, 3.
- Latest run QUARANTINED.
- Main dashboard still showing timestamped trusted data.

**Voiceover**

> “Magpie detects the semantic failure, quarantines the run and prevents a false source-evidence-loss report from reaching the growth team.”

### 1:47–2:18 — Bright Data Self-Healing

**Show actual Codex terminal**

~~~bash
npx -p @brightdata/cli@0.3.2 bdata scraper heal "$BRIGHT_DATA_COLLECTOR_ID" "Ranks 1-3 moved into a JavaScript carousel and evidence moved behind expandable panels. Restore all rows while preserving the existing schema."

npx -p @brightdata/cli@0.3.2 bdata scraper approve "$BRIGHT_DATA_COLLECTOR_ID" --auto-save
~~~

**On screen**

- Repair diagnosis.
- Bright Data proposed diff.
- Preview sample.
- Human approval.
- Final `status=done` and saved production version.
- Same Collector ID.

**Voiceover**

> “Codex turns the failed contract into a precise diagnosis. Bright Data rewrites the collector, shows a proposed diff and sample, and waits for human approval before saving the repair.”

Time-compress genuine waiting with an explicit timestamp overlay.

### 2:18–2:36 — Verified recovery

**On screen**

~~~text
Collector ID: unchanged
Rows:         7 → 10
Ranks:        4–10 → 1–10
App contract: unchanged
Collector schema: unchanged
App changes:  0
UI status:    RECOVERED
~~~

Return to Signal Overview and open the evidence drawer.

**Voiceover**

> “The repaired collector restores all ten rows. Magpie verifies the same ID, app contract, collector schema and business-facts hash before releasing the result. No downstream code changes.”

### 2:36–2:44 — Close

**Voiceover**

> “The source facts did not change. The sensor did. Magpie stopped the false conclusion, and Bright Data repaired the sensor.”

**Final frame**

> **Bright Data collectors as trusted B2B market sensors.**

### 22.1 Optional post-credit proof

If submission format allows a longer walkthrough, show Scenario B:

- Healthy Layout B.
- Competitor moves #3 → #2.
- Ten valid rows.
- TRUSTED_SOURCE_CHANGE.
- Correct evidence-gap recommendation.

This proves Magpie does not heal every unfavorable business result.

### 22.2 Demo-production safeguards

- Record the genuine complete workflow early.
- Preserve uncut timestamped terminal output in the repository.
- Time-compress long waits honestly.
- Label every replay.
- Use large text for 10 → 7 → 10 and 1–10 → 4–10 → 1–10.
- Keep the Collector ID on screen.
- Rehearse with the exact submitted build.
- Keep the video to three contexts: Source Shift Lab, Magpie and terminal/Studio.
- Record a clean voiceover separately if needed.
- Verify every public link in an incognito session.

---

## 23. Risk register

| Risk | Likelihood | Impact | Mitigation | Fallback |
|---|---|---|---|---|
| Initial collector is too robust and still captures Layout B | Medium | High | Inspect generated logic before finalizing Layout B; change DOM, interaction and nesting meaningfully | Add client-loaded carousel while retaining ranks 4–10 markup |
| Changed collector returns zero rows instead of seven | Medium | High | Preserve compatible standard-card markup for ranks 4–10 | Adjust Layout B until actual partial output is deterministic |
| Collector creation takes too long | Medium | High | Start in Phase 2; use simple accessible fixture | Simplify interaction, not contract |
| Self-healing takes 15+ minutes | High | Medium | Run and record early; use 1200-second CLI timeout | Honest replay with full transcript |
| Heal proposal does not use Layout B | Low with same URL | High | Toggle server-side markup at the same canonical URL | Raw AI Flow API with custom_input if a different URL becomes necessary |
| Team incorrectly approves with a fix ID | Low | Medium | Commands in app/docs use the existing `c_*` Collector ID | Copy exact CLI next_step |
| Approval requires another review step | Medium | High | Persist each envelope; loop AWAITING_APPROVAL ↔ APPLYING_REPAIR with a fresh human decision | Do not verify until final `done` and saved production version |
| Repair changes schema | Medium | High | Explicit preservation prompt; review Studio diff; app-contract and collector-schema gates | Reject and rerun with sharper prompt |
| Wrong approval workflow leaves a Studio/IDE draft unpublished | Medium | High | Use pinned CLI approve with `--auto-save`; require final `done`, version change and rerun | If using the Studio/IDE draft path, save to production explicitly |
| Bright Data API unavailable during judging | Low/medium | High | Complete genuine run and commit sanitized artifacts | Clearly labelled replay mode |
| Database or deployment unavailable | Low/medium | High | Managed Postgres, health checks and early deployment | Local replay build/video |
| Serverless caching hides fixture change | Medium | High | Force dynamic rendering and no-store; DB-backed modes | Add cache-busting response headers and verify externally |
| Secrets appear in artifacts/video | Medium | Critical | Environment auth, redaction script/checklist and video review | Revoke credential and regenerate artifacts |
| Arbitrary URL endpoint creates SSRF risk | Low if scoped | Critical | Source-target allowlist; server-side resolution | Disable user-added targets in MVP |
| Quarantine threshold flags a genuine change | Medium | Medium | Hard invariants plus human review; healthy fact-change scenario | Mark uncertain and hold rather than heal |
| Dashboard accidentally reads latest rather than trusted | Medium | Critical | Single trusted-snapshot selector and contract tests | Disable insight generation until fixed |
| Fixture feels fake or trivial | Medium | High | Professional page, meaningful JS interaction, transparent chaos-lab label | Add one real public source after core loop |
| Product is mistaken for another GEO dashboard | Medium | High | Lead with “Did the market move or did measurement break?” | Reduce analytics, enlarge Incident Room |
| Bright Data looks incidental | Low if plan followed | Critical | Show Studio, CLI, API, IDs, job metadata, self-heal and output utility | Cut any feature that steals demo time |
| Claims overstate “truth” or competitor weakness | Medium | High | Use observable-evidence wording and claim boundaries | Remove disputed claim from narration |
| Compliance concerns around backlink automation | Medium | High | Explicitly prohibit automated posting/link schemes | Demonstrate evidence/content recommendation only |
| Deadline pressure causes untested live demo | High | High | Hard gates and feature freeze after healing loop | Submission uses genuine tested replay |

### 23.1 Stop conditions

Stop adding features immediately when:

- The actual self-heal has not yet succeeded.
- The broken snapshot can still reach the dashboard.
- The same Collector ID and exported production schema cannot be proved.
- Replay does not use the production validation path.
- The demo exceeds three minutes.
- Documentation or secret review has not been completed.

---

## 24. Definition of done

### 24.1 Scraper Studio

- [ ] A genuinely custom Scraper Studio Browser Worker exists.
- [ ] Custom-collector eligibility and non-prebuilt-scraper use are confirmed.
- [ ] It uses a documented creation prompt.
- [ ] It performs meaningful interaction.
- [ ] It emits one structured row per vendor.
- [ ] Required schema fields are configured.
- [ ] The Collector ID is visible and consistent.
- [ ] Worker type, interaction code, parser code and production schema are preserved as evidence.
- [ ] Layout A produces ten rows and ranks 1–10.
- [ ] One real public long-tail source smoke run is complete, or written organizer confirmation establishes that the controlled public fixture is eligible.

### 24.2 Coding-agent workflow

- [ ] Codex creates or configures the collector.
- [ ] Codex runs the trusted baseline.
- [ ] Baseline confirmation is recorded with human actor, timestamp and accepted snapshot ID before any trusted pointer exists.
- [ ] Codex runs the same collector after the source change.
- [ ] Codex inspects the failed contract and current page.
- [ ] Codex requests Bright Data Self-Healing.
- [ ] A human reviews the proposed diff and preview sample.
- [ ] The human approval decision, actor, timestamp and artifact hash are recorded.
- [ ] Approval uses the same Collector ID, never a proposed-fix identifier.
- [ ] Codex reruns the repaired collector.
- [ ] Transcript or recording proves each action.

### 24.3 Believable failure

- [ ] Layout B remains publicly visible at the same canonical URL.
- [ ] It contains the same ten business facts as Layout A.
- [ ] The original collector succeeds but emits only seven rows.
- [ ] The seven rows pass SourceEvidenceRowV1.
- [ ] Ranks 1–3 are absent.
- [ ] Magpie first classifies UNTRUSTED_OBSERVATION.
- [ ] Page inspection proves the expected evidence remains present before the incident cause becomes EXTRACTION_DRIFT.
- [ ] The broken snapshot is quarantined.
- [ ] It never updates customer-facing metrics.
- [ ] Last trusted evidence remains visible and timestamped.
- [ ] The false conclusion prevented is explicit.

### 24.4 Healing and verification

- [ ] Bright Data produces an actual repair proposal.
- [ ] Preview sample and Studio diff are saved without treating sample size as a completeness check.
- [ ] Human approval is recorded.
- [ ] The final approval envelope reports `status=done` with auto-save confirmed.
- [ ] The same Collector ID processes Layout B successfully.
- [ ] Ten rows and ranks 1–10 return.
- [ ] App-contract and exported collector-schema hashes remain unchanged.
- [ ] Baseline and healed business-facts hashes match exactly.
- [ ] All semantic gates pass.
- [ ] The production template version changes while Collector ID and production schema remain stable.
- [ ] Collector versions, job IDs, timestamps and healing/approval IDs are captured.
- [ ] A new authoritative verification `j_*` is linked to the incident and is the exact snapshot ingested by the app.
- [ ] Git commit or working-tree evidence shows no downstream application code changed during repair.
- [ ] The incident advances to RESOLVED and the UI displays RECOVERED.
- [ ] Broken and healed artifacts remain linked.

### 24.5 Structured-output value

- [ ] Bright Data rows power brand position.
- [ ] They power competitor position.
- [ ] They power evidence and link coverage.
- [ ] They power the evidence/provenance drawer.
- [ ] They power one explainable B2B recommendation.
- [ ] Every downstream value links to trusted evidence.
- [ ] Repaired output restores the correct product state.

### 24.6 Quality

- [ ] Unit tests cover critical validation/classification boundaries.
- [ ] Contract fixtures include baseline, broken and healed.
- [ ] Integration tests cover Bright Data trigger/poll/error behavior.
- [ ] Production ingestion succeeds against an actual authoritative Bright Data batch snapshot, not only a replay fixture.
- [ ] Replay E2E covers the full incident lifecycle.
- [ ] Two consecutive full replays start from a database reset, use the same genuine artifacts and create distinct local replay sessions.
- [ ] Baseline, broken, preview and healed raw artifacts are byte-preserved and hash-verifiable.
- [ ] Clean checkout can run without live Bright Data credentials.
- [ ] Production build passes.
- [ ] No critical accessibility issue remains.
- [ ] No credential appears in repository, history or video.
- [ ] The fixture is reachable at the submitted canonical URL with public-data, synthetic-fixture and controlled-change disclosures present.

### 24.7 Submission

- [ ] Public repository.
- [ ] Public application link.
- [ ] Demo video is 2:45 or shorter, leaving at least 15 seconds below the limit.
- [ ] Project description.
- [ ] Best Use of Bright Data is named as the target track in the official form.
- [ ] Bright Data/Scraper Studio explanation.
- [ ] Architecture diagram.
- [ ] Output examples.
- [ ] Creation and healing transcripts.
- [ ] Setup and replay instructions.
- [ ] Compliance and AI-use disclosure.
- [ ] All links tested logged out.
- [ ] Any backup demo uses only artifacts from genuine runs and is visibly labelled REPLAY.
- [ ] Three uninvolved viewers can explain what failed, why structural checks missed it, what Bright Data healed, what the human approved and what the restored output powers.
- [ ] Official submission form is completed before the authoritative deadline and confirmation is saved.

---

## 25. README and submission outline

The repository README should follow the judge’s path:

1. One-sentence product.
2. Thirty-second failure story.
3. Demo video.
4. Live app.
5. 10 → 7 → 10 proof.
6. Why the B2B problem matters.
7. Architecture.
8. Exact Bright Data usage.
9. Custom schema.
10. Self-healing sequence.
11. Run replay locally.
12. Run live with credentials.
13. Tests.
14. Compliance and limitations.
15. Research sources.

Top README block:

> **Magpie is the evidence-integrity layer for GEO workflows.**<br>
> It detects when a successful scraper run would create a false B2B insight, quarantines the data, and uses Codex plus Bright Data Self-Healing to restore the same collector and output contract.

Judge quickstart:

~~~bash
pnpm install
cp .env.example .env.local
pnpm db:setup
pnpm dev
pnpm demo:replay
~~~

Live Bright Data setup is a separate documented path and is not required to inspect the product safely.

---

## 26. Post-hackathon roadmap

### Phase 1 — Real source network

- Multiple comparison pages, directories, documentation sites and publisher sources.
- Per-template evidence contracts.
- Rolling baselines and robust anomaly statistics.
- Scheduled runs and notifications.
- Source ownership and incident assignment.

### Phase 2 — Model-observation layer

- Repeated prompt sampling across supported answer engines.
- Region, persona and model-version metadata.
- Brand-mention probability and confidence intervals.
- Citation-source churn and Jaccard overlap.
- MODEL_VARIANCE classification.

### Phase 3 — Attribution verification

- Claim-to-citation mapping.
- Current-page evidence retrieval.
- Claim-support scoring with human-review thresholds.
- Citation absorption versus citation selection.
- ATTRIBUTION_BREAK classification.

### Phase 4 — B2B platform

- Multi-tenant workspaces.
- GEO agency reporting.
- Search Console and analytics integrations.
- CRM/revenue correlation without unsupported causality.
- Incident notifications and service-level objectives.
- Verified evidence API for existing GEO platforms.

### Phase 5 — Guarded automation

- Repair suggestions across multiple collectors.
- Historical repair-success scoring.
- Policy-based approval for low-risk fixes.
- Automatic rollback after failed verification.
- Human approval remains mandatory for schema or business-logic changes.

---

## 27. Source references

### Hackathon and Bright Data

- [Into the Scrape-Verse rules, prize and judging criteria](https://www.wemakedevs.org/hackathons/scrape-verse)
- [Bright Data Scraper Studio overview](https://docs.brightdata.com/datasets/scraper-studio/overview)
- [Bright Data Scraper Studio API quickstart](https://docs.brightdata.com/datasets/scraper-studio/quickstart)
- [Bright Data CLI repository and command reference](https://github.com/brightdata/cli)
- [Bright Data CLI installation](https://docs.brightdata.com/cli/installation)
- [Bright Data CLI command reference](https://docs.brightdata.com/cli/commands)
- [Bright Data CLI v0.3.2 release and auto-save behavior](https://github.com/brightdata/cli/releases/tag/v0.3.2)
- [Build a scraper with the Bright Data CLI](https://docs.brightdata.com/datasets/scraper-studio/build-with-the-cli)
- [Bright Data Self-Healing tool](https://docs.brightdata.com/datasets/scraper-studio/self-healing-tool)
- [Bright Data AI Flow overview](https://docs.brightdata.com/api-reference/scraper-studio-api/ai-flow/overview)
- [Bright Data input and output schema](https://docs.brightdata.com/datasets/scraper-studio/input-and-output-schema)
- [Bright Data Scraper Studio error codes](https://docs.brightdata.com/datasets/scraper-studio/error-codes)
- [Bright Data Acceptable Use Policy](https://brightdata.com/acceptable-use-policy)

### B2B and GEO research

- [GitHub Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/)
- [Stripe Atlas startups in 2025](https://stripe.com/blog/stripe-atlas-startups-in-2025-year-in-review)
- [Gartner 2026 B2B buyer survey](https://www.gartner.com/en/newsroom/press-releases/2026-05-20-gartner-survey-finds-sixty-nine-percent-of-b-two-b-buyers-turn-to-sales-reps-to-validate-ai-generated-insights)
- [Pew study of clicks on Google AI summaries](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/)
- [Don’t Measure Once: Measuring Visibility in AI Search](https://arxiv.org/html/2604.07585v1)
- [Evaluating Verifiability in Generative Search Engines](https://arxiv.org/abs/2304.09848)
- [Google AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

### Category validation

- [Profound $96M Series C announcement](https://www.tryprofound.com/blog/profound-raises-96m-series-c)
- [Peec AI revenue reporting](https://techcrunch.com/2026/05/23/peec-one-of-berlins-rising-startups-more-than-doubled-annualized-revenue-in-months-to-10m-sources-say/)
- [Sitecore acquisition of Scrunch](https://www.sitecore.com/company/newsroom/press-releases/2026/06/sitecore-acquires-scrunch-to-help-brands-influence-discovery--and-buying-decisions)
- [Adobe completion of Semrush acquisition](https://news.adobe.com/news/2026/04/adobe-completes-semrush-acquisition)

---

## 28. Start gate

Implementation begins only when these are true:

- [ ] This product scope and demo story are approved.
- [ ] Bright Data account and API access are available.
- [ ] A public deployment URL and database are available.
- [ ] The SourceEvidenceRowV1 schema is accepted.
- [ ] NimbusDesk and HelioSupport may be used as fictional demo brands.
- [ ] The team agrees that Scenario A is the hard priority.
- [ ] A real-source smoke target is chosen, or organizer confirmation for the controlled fixture is saved.

Once approved, the first implementation objective is not the dashboard. It is:

> **Produce a genuine ten-row Bright Data baseline from the public Source Shift Lab and preserve the Collector ID, schema and transcript.**
