import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TARGET_URL = "https://magpie-lab.netlify.app/lab/source";

// Triggers a genuine Bright Data collection from the dashboard. Live runs
// cost credits, so the endpoint stays disabled unless LIVE_RUNS_ENABLED=true
// is set in the environment.
export async function POST() {
  if (process.env.LIVE_RUNS_ENABLED !== "true") {
    return NextResponse.json({ error: "live_runs_disabled" }, { status: 503 });
  }
  const token = process.env.BRIGHT_DATA_API_TOKEN;
  const collector = process.env.BRIGHT_DATA_COLLECTOR_ID;
  if (!token || !collector) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const response = await fetch(
    `https://api.brightdata.com/dca/trigger?collector=${collector}&queue_next=1`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ url: TARGET_URL }]),
    },
  );
  if (!response.ok) {
    return NextResponse.json(
      { error: `trigger_failed_${response.status}` },
      { status: 502 },
    );
  }
  const body = (await response.json()) as { collection_id: string };
  return NextResponse.json({ snapshot_id: body.collection_id });
}
