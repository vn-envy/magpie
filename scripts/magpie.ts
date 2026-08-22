#!/usr/bin/env tsx
/**
 * Magpie collect — the authoritative Bright Data Collection API runner.
 *
 *   pnpm magpie collect --source source_support_platforms --purpose baseline
 *   pnpm magpie collect --source source_support_platforms --purpose monitoring
 *   pnpm magpie collect --source source_support_platforms --purpose verification --incident inc_001
 *
 * Triggers the published collector, polls the dataset endpoint, and writes the
 * raw rows plus job metadata into artifacts/brightdata/.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const TARGET_URL = "https://magpie-lab.netlify.app/lab/source";
const COLLECTOR_ID = process.env.BRIGHT_DATA_COLLECTOR_ID ?? "c_mt4m8fix1gze0scg44";
const API_BASE = "https://api.brightdata.com";

type Purpose = "baseline" | "monitoring" | "verification";

function apiKey(): string {
  if (process.env.BRIGHT_DATA_API_TOKEN) return process.env.BRIGHT_DATA_API_TOKEN;
  const creds = path.join(homedir(), "Library/Application Support/brightdata-cli/credentials.json");
  if (existsSync(creds)) {
    return JSON.parse(readFileSync(creds, "utf8")).api_key;
  }
  throw new Error("No BRIGHT_DATA_API_TOKEN and no Bright Data CLI credentials found");
}

async function api<T>(pathname: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`${pathname} -> ${response.status}: ${await response.text()}`);
  }
  return (await response.json()) as T;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  if (command !== "collect") {
    console.error("usage: pnpm magpie collect --source <id> --purpose <baseline|monitoring|verification> [--incident <id>]");
    process.exit(1);
  }
  const get = (flag: string) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };
  const purpose = (get("--purpose") ?? "baseline") as Purpose;
  const incident = get("--incident");

  mkdirSync("artifacts/brightdata", { recursive: true });

  console.log(`Triggering collector ${COLLECTOR_ID} on ${TARGET_URL} (${purpose})...`);
  const trigger = await api<{ collection_id: string }>(
    `/dca/trigger?collector=${COLLECTOR_ID}&queue_next=1`,
    { method: "POST", body: JSON.stringify([{ url: TARGET_URL }]) },
  );
  const snapshotId = trigger.collection_id;
  console.log(`Bright Data snapshot: ${snapshotId}`);

  const deadline = Date.now() + 12 * 60 * 1000;
  let rows: unknown[] | null = null;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const dataset = await api<unknown>(`/dca/dataset?id=${snapshotId}`);
    if (Array.isArray(dataset)) {
      rows = dataset;
      break;
    }
    process.stdout.write(".");
  }
  console.log("");
  if (rows === null) {
    throw new Error("Collection timed out");
  }

  const log = await api<Record<string, unknown>>(`/dca/log/${snapshotId}`).catch(() => ({}));
  const meta = {
    purpose,
    incident: incident ?? null,
    collector_id: COLLECTOR_ID,
    brightdata_snapshot_id: snapshotId,
    target_url: TARGET_URL,
    captured_at: new Date().toISOString(),
    brightdata_log: log,
  };
  const suffix = incident ? `-${incident}` : "";
  writeFileSync(`artifacts/brightdata/${purpose}${suffix}-output.json`, JSON.stringify(rows, null, 1));
  writeFileSync(`artifacts/brightdata/${purpose}${suffix}-meta.json`, JSON.stringify(meta, null, 1));

  const withBrand = rows.filter(
    (row): row is { rank?: number; brand?: string } =>
      typeof row === "object" && row !== null && "brand" in row,
  );
  console.log(`\nRows: ${withBrand.length} (of ${rows.length} returned)`);
  for (const row of withBrand.sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))) {
    console.log(`  #${row.rank} ${row.brand}`);
  }
  console.log(`\nSaved: artifacts/brightdata/${purpose}${suffix}-output.json (+meta)`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
