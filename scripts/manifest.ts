#!/usr/bin/env tsx
/**
 * pnpm manifest — hash every genuine Bright Data artifact into
 * artifacts/brightdata/MANIFEST.json so judges can verify integrity.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const dir = "artifacts/brightdata";
const entries: Record<string, { sha256: string; bytes: number }> = {};

for (const name of readdirSync(dir).sort()) {
  if (name === "MANIFEST.json" || name === "README.md") continue;
  const full = path.join(dir, name);
  if (!statSync(full).isFile()) continue;
  const buffer = readFileSync(full);
  entries[name] = {
    sha256: createHash("sha256").update(buffer).digest("hex"),
    bytes: buffer.byteLength,
  };
}

const manifest = {
  generated_at: new Date().toISOString(),
  note: "SHA-256 of every genuine Bright Data artifact in this directory",
  artifacts: entries,
};
writeFileSync(path.join(dir, "MANIFEST.json"), JSON.stringify(manifest, null, 1));
console.log(`Manifest: ${Object.keys(entries).length} artifacts hashed`);
for (const [name, meta] of Object.entries(entries)) {
  console.log(`  ${name}  ${meta.sha256.slice(0, 16)}… (${meta.bytes} bytes)`);
}
