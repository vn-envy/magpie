import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Open-ended live run for judges: fetch ANY public URL through Bright Data
// Web Unlocker — the same "Collector ID is your API" thesis, one-shot.
// Gated like live runs; public http(s) targets only.

function isPublicUrl(raw: string): URL | null {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  const host = parsed.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host === "0.0.0.0" ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    /^169\.254\./.test(host)
  ) {
    return null;
  }
  return parsed;
}

export async function POST(request: NextRequest) {
  if (process.env.LIVE_RUNS_ENABLED !== "true") {
    return NextResponse.json({ error: "live_runs_disabled" }, { status: 503 });
  }
  const token = process.env.BRIGHT_DATA_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const raw = (body.url ?? "").trim();
  if (raw.length > 2000) {
    return NextResponse.json({ error: "url_too_long" }, { status: 400 });
  }
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const parsed = isPublicUrl(withScheme);
  if (!parsed) {
    return NextResponse.json({ error: "invalid_public_url" }, { status: 422 });
  }

  const response = await fetch("https://api.brightdata.com/request", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      zone: process.env.BRIGHTDATA_UNLOCKER_ZONE ?? "cli_unlocker",
      url: parsed.toString(),
      format: "json",
      data_format: "markdown",
    }),
  });
  if (!response.ok) {
    return NextResponse.json(
      { error: `unlocker_${response.status}`, detail: (await response.text()).slice(0, 200) },
      { status: 502 },
    );
  }

  const payload = await response.text();
  let content = payload;
  let httpStatus: number | null = null;
  try {
    const asJson = JSON.parse(payload) as { body?: string; status_code?: number };
    if (typeof asJson.body === "string") {
      content = asJson.body;
      httpStatus = asJson.status_code ?? null;
    }
  } catch {
    // plain markdown response
  }

  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  const titleLine =
    lines.find((l) => l.startsWith("# "))?.slice(2).trim() ??
    lines[0]?.replace(/^#+\s*/, "").slice(0, 120) ??
    null;
  const headings = lines.filter((l) => /^#{1,3}\s/.test(l)).length;
  const links = [...content.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
  const words = content.split(/\s+/).filter(Boolean).length;

  return NextResponse.json({
    url: parsed.toString(),
    title: titleLine,
    http_status: httpStatus,
    stats: {
      words,
      headings,
      links: links.length,
      sample_links: [...new Set(links)].slice(0, 5),
    },
    preview: content.slice(0, 900),
    fetched_at: new Date().toISOString(),
    engine: "Bright Data Web Unlocker · live",
  });
}
