#!/usr/bin/env node
/**
 * The Collector ID is your production API.
 *
 * Zero-dependency Node (works in any scheduler: cron, GitHub Actions,
 * systemd, Airflow). Triggers the Bright Data collectors via
 * POST /dca/trigger, polls the dataset, stores results in the repo, and
 * prints a summary. Committing the output auto-deploys the dashboard.
 *
 *   BRIGHTDATA_API_TOKEN=... node scripts/cron-collect.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";

const API = "https://api.brightdata.com";
const TOKEN = process.env.BRIGHTDATA_API_TOKEN;
if (!TOKEN) throw new Error("BRIGHTDATA_API_TOKEN required");

const SOURCES = [
  {
    key: "hn_front_page",
    label: "Hacker News front page",
    url: "https://news.ycombinator.com",
    collector: process.env.HN_COLLECTOR_ID ?? "c_mt5t6oj816r5d7yvfy",
    kind: "hn",
  },
  {
    key: "real_competition",
    label: "awesome-selfhosted — the real open-source software market",
    url: "https://github.com/awesome-selfhosted/awesome-selfhosted",
    collector: process.env.COMPETITION_COLLECTOR_ID ?? "c_mt5z86yu2jvo2kv0yf",
    kind: "catalog",
  },
  {
    key: "b2b_source",
    label: "Enterprise Support Platforms 2026",
    url: "https://magpie-lab.netlify.app/lab/source",
    collector: "c_mt4m8fix1gze0scg44",
    kind: "b2b",
  },
];

async function call(path, init) {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) throw new Error(`${path} -> ${response.status}: ${await response.text()}`);
  return response.json();
}

async function collect(source) {
  const trigger = await call(`/dca/trigger?collector=${source.collector}&queue_next=1`, {
    method: "POST",
    body: JSON.stringify([{ url: source.url }]),
  });
  const snapshotId = trigger.collection_id;
  const deadline = Date.now() + 8 * 60 * 1000;
  let rows = null;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 10000));
    const dataset = await call(`/dca/dataset?id=${snapshotId}`);
    if (Array.isArray(dataset)) {
      rows = dataset;
      break;
    }
  }
  if (rows === null) throw new Error(`${source.key}: timed out`);
  const log = await call(`/dca/log/${snapshotId}`).catch(() => ({}));

  // Flatten wrapper rows (some generated schemas nest records) and drop
  // empty wrappers, which are extraction misses rather than data.
  const flattened = [];
  let misses = 0;
  for (const row of rows) {
    if (!row || typeof row !== "object" || row.error_code) continue;
    if (Array.isArray(row.stories)) {
      if (row.stories.length === 0) misses += 1;
      else flattened.push(...row.stories);
    } else {
      flattened.push(row);
    }
  }
  const withData = flattened;
  console.log(`${source.key}: ${withData.length} records (${misses} empty wrappers dropped)`);
  const ranks = withData.map((row) => row.rank).filter((rank) => Number.isFinite(rank)).sort((a, b) => a - b);
  const sequential = ranks.length > 0 && ranks[0] === 1 && ranks.every((rank, i) => i === 0 || rank === ranks[i - 1] + 1);
  // Ranked sources must return sequential ranks; catalog sources are judged
  // on volume alone.
  const verdict =
    source.kind === "b2b"
      ? sequential && withData.length >= 10
        ? "TRUSTED"
        : "SUSPECT"
      : withData.length >= 20
        ? "TRUSTED"
        : "SUSPECT";

  return {
    source: source.key,
    label: source.label,
    kind: source.kind,
    collector_id: source.collector,
    snapshot_id: snapshotId,
    target_url: source.url,
    captured_at: new Date().toISOString(),
    verdict,
    row_count: withData.length,
    ranks_sequential: sequential,
    brightdata_log: {
      status: log.status,
      lines: log.lines,
      success: log.success,
      fails: log.fails,
      started: log.started,
      finished: log.finished,
    },
    rows: withData,
  };
}

mkdirSync("artifacts/live", { recursive: true });
const index = { updatedAt: new Date().toISOString(), sources: {} };
let failures = 0;
for (const source of SOURCES) {
  try {
    const result = await collect(source);
    writeFileSync(`artifacts/live/${source.key}-latest.json`, JSON.stringify(result, null, 1));
    index.sources[source.key] = {
      label: result.label,
      collector_id: result.collector_id,
      snapshot_id: result.snapshot_id,
      captured_at: result.captured_at,
      verdict: result.verdict,
      row_count: result.row_count,
    };
    console.log(`${source.key}: ${result.row_count} rows · ${result.verdict} · ${result.snapshot_id}`);
  } catch (error) {
    failures += 1;
    console.error(`${source.key}: FAILED — ${error.message}`);
  }
}
writeFileSync("artifacts/live/latest.json", JSON.stringify(index, null, 1));
console.log("live feed index written");
if (failures === SOURCES.length) process.exit(1);
