import { NextRequest, NextResponse } from "next/server";
import {
  getFixtureState,
  updateFixtureState,
  isLocked,
  blobHealth,
  type LayoutMode,
  type FactsMode,
} from "@/lib/fixture/state";

export const dynamic = "force-dynamic";

const LAYOUT_MODES: LayoutMode[] = ["legacy_cards", "featured_carousel"];
const FACTS_MODES: FactsMode[] = ["baseline", "competitor_move"];

function stateResponse(state: Awaited<ReturnType<typeof getFixtureState>>) {
  return NextResponse.json(state, {
    headers: {
      "Cache-Control": "no-store",
      "X-Fixture-Revision": String(state.revision),
    },
  });
}

export async function GET() {
  const [state, health] = await Promise.all([getFixtureState(), blobHealth()]);
  return NextResponse.json(
    { ...state, ...health },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Fixture-Revision": String(state.revision),
      },
    },
  );
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("x-control-token");
  if (!process.env.DEMO_CONTROL_TOKEN || token !== process.env.DEMO_CONTROL_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { layout_mode?: string; facts_mode?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const patch: { layout_mode?: LayoutMode; facts_mode?: FactsMode } = {};
  if (body.layout_mode !== undefined) {
    if (!LAYOUT_MODES.includes(body.layout_mode as LayoutMode)) {
      return NextResponse.json(
        { error: "invalid_layout_mode", allowed: LAYOUT_MODES },
        { status: 422 },
      );
    }
    patch.layout_mode = body.layout_mode as LayoutMode;
  }
  if (body.facts_mode !== undefined) {
    if (!FACTS_MODES.includes(body.facts_mode as FactsMode)) {
      return NextResponse.json(
        { error: "invalid_facts_mode", allowed: FACTS_MODES },
        { status: 422 },
      );
    }
    patch.facts_mode = body.facts_mode as FactsMode;
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "nothing_to_change" }, { status: 400 });
  }

  const current = await getFixtureState();
  if (isLocked(current)) {
    return NextResponse.json(
      { error: "fixture_locked", state: current },
      { status: 423 },
    );
  }

  return stateResponse(await updateFixtureState(patch, "control-api"));
}
