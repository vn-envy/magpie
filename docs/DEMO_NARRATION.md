# Magpie — end-to-end demo narration

Total runtime target: **2:45** (50s animated film + ~1:55 narrated walkthrough).
Pacing: ~140 words/minute. Every ID mentioned aloud is real.

---

## PART A — the animated opener (0:00–0:50)

Play `motion/out/magpie-launch.mp4` full-screen. Music-led; seven short VO lines
land with the scenes. Don't fight the animation — ride it.

| Time | On screen | Say |
|---|---|---|
| 0:00 | MAGPIE. logo bursts in | "This is Magpie." |
| 0:04 | Magpie meets the mirror; reflection loses three dots | "The magpie is the only bird that passes the mirror test — it knows its reflection isn't real." |
| 0:09 | Stamp: 7/10 — NOT REAL | "Your dashboard is a reflection of the market. Sometimes, it lies." |
| 0:13 | RUN SUCCEEDED. JSON VALID. BUSINESS CONCLUSION WRONG. | "Our collector ran perfectly — valid JSON, successful run — and quietly lost three of ten vendors." |
| 0:19 | Nine-run timeline grows | "Nine genuine runs later, here's everything the sensor saw — including its own repair." |
| 0:26 | Human-gated heal; 7 → 10 count-up | "Bright Data self-healed the collector — behind a human approval gate — and verification matched the original facts hash exactly." |
| 0:35 | Both consoles; LIVE badge | "This is the product. And it's live, right now." |

---

## PART B — narrated walkthrough (0:50–2:35)

Screen-record the browser at magpie-lab.netlify.app. Terminal ready on the side
(pre-filled with the curl command). Click slowly; hover where the narration points.

### Beat 1 — the landing (0:50–1:05)

**On screen:** `/` — let the mirror animation play once. Then scroll slightly.

> "Here's why Magpie exists. A growth team sees a competitor overtake them in
> their dashboard — and they can't tell whether the market moved… or their
> pipeline broke. Four different causes, one red arrow. We built Magpie for the
> dangerous one: the scraper that still succeeds, returns valid JSON — and lies."

### Beat 2 — the research flow (1:05–1:30)

**On screen:** type nothing — the URL is preseeded. Click **Research my market**.
Watch the console lines, then the ranked-bar landscape, then click **Get my
improvement plan**.

> "A business enters their product URL. Magpie researches the ranked source
> through a Bright Data collector — snapshot J-M-T-4-M-S-K — and verifies every
> row before showing anything. NimbusDesk sits at number two, every competitor's
> evidence visible. Then the improvement plan: three deterministic
> recommendations — publish an independent benchmark, quantify the claims — each
> one linked to the exact competitor evidence that motivates it. No LLM wrote
> this. The data did."

### Beat 3 — the deviation, the heart of the story (1:30–2:00)

**On screen:** click **Activate continuous monitoring**. Let the source-update
banner and the second collection run play. Land on the deviation panels, hover
the blocked one, then click **Watch the repair** and let the resolution finish.

> "Now the source redesigns — top vendors move into a carousel. The same
> collector runs again: success, schema-valid, seven rows. A naive dashboard
> would tell this team: NimbusDesk disappeared — reset your strategy. Magpie
> blocks that automatically. The market didn't move; the sensor broke. The last
> verified snapshot keeps serving. Then the repair: Bright Data self-healing
> proposes a fix, a human approves the diff, the same collector reruns — ten
> rows restored, facts hash identical, zero downstream changes. The priority-one
> plan stands."

### Beat 4 — anyone can run it (2:00–2:15)

**On screen:** stay on `/` — the bottom strip. Point at the LIVE SENSORS card,
then type a judge-suggested URL (fallback: `arxiv.org`) into the scanner and
click **Run live fetch**.

> "This isn't a replay. The Collector ID is a production API — an hourly cron
> triggers it with plain Node and this dashboard updates itself. And it's not
> limited to our sources: any public URL, fetched live, right now, through
> Bright Data Web Unlocker. Try yours."

### Beat 5 — the admin proof (2:15–2:30)

**On screen:** `/admin` — KPI strip, run timeline, verdict distribution; then
the LIVE API tab; hover the curl block.

> "For the engineers: every run, every verdict, the SHA-256 manifest, the full
> create-heal-approve journey. Half of all genuine runs were unsafe to publish —
> every one caught. And this curl command is the whole integration: any
> language, any scheduler, no deployment step."

### Beat 6 — close (2:30–2:45)

**On screen:** `/incidents/inc_001` hero line, then cut to the repo on GitHub.

> "Run succeeded. JSON valid. Business conclusion wrong — and blocked. The
> source facts didn't change; the sensor did. Bright Data collectors as trusted
> B2B market sensors — that's Magpie."

---

## Recording checklist

- [ ] Film: `motion/out/magpie-launch.mp4` (music bed optional; duck it under VO)
- [ ] Browser: production URL only — never localhost
- [ ] Mirror animation plays once before you start talking over Beat 1
- [ ] Terminal fallback ready if the live fetch is slow: show the cron's latest commit on GitHub
- [ ] Say real IDs aloud at least twice (baseline + one live scan)
- [ ] End card: `github.com/vn-envy/magpie` on screen for the last 3 seconds

## Why this order

The narration follows the judging weight: **hook (mirror) → pain (the lie) →
product (plan) → drama (deviation + repair) → openness (any URL, cron, curl) →
proof (admin, hashes) → close (the line)**. Every claim spoken is one a judge
can click and verify within thirty seconds.
