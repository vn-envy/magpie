import { NextRequest, NextResponse } from "next/server";
import { updateFixtureState, getFixtureState, isLocked, type LayoutMode } from "@/lib/fixture/state";

export const dynamic = "force-dynamic";

// LIVE business-flow support: performs the controlled "source redesign" on
// the public fixture so a live second collection genuinely observes the
// carousel layout. Gated by the same flag as live runs.
const LAYOUTS: LayoutMode[] = ["legacy_cards", "featured_carousel"];

export async function POST(request: NextRequest) {
  if (process.env.LIVE_RUNS_ENABLED !== "true") {
    return NextResponse.json({ error: "live_runs_disabled" }, { status: 503 });
  }
  let body: { layout_mode?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!body.layout_mode || !LAYOUTS.includes(body.layout_mode as LayoutMode)) {
    return NextResponse.json({ error: "invalid_layout_mode" }, { status: 422 });
  }
  const current = await getFixtureState();
  if (isLocked(current)) {
    return NextResponse.json({ error: "fixture_locked" }, { status: 423 });
  }
  const next = await updateFixtureState(
    { layout_mode: body.layout_mode as LayoutMode },
    "business-flow-live",
  );
  return NextResponse.json({
    layout_mode: next.layout_mode,
    revision: next.revision,
  });
}
