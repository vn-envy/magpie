import "server-only";
import { getStore } from "@netlify/blobs";

export type LayoutMode = "legacy_cards" | "featured_carousel";
export type FactsMode = "baseline" | "competitor_move";

export type FixtureState = {
  layout_mode: LayoutMode;
  facts_mode: FactsMode;
  revision: number;
  locked_by_run_id: string | null;
  locked_by_incident_id: string | null;
  locked_until: string | null;
  updated_at: string;
  updated_by: string;
};

export const DEFAULT_STATE: FixtureState = {
  layout_mode: "legacy_cards",
  facts_mode: "baseline",
  revision: 1,
  locked_by_run_id: null,
  locked_by_incident_id: null,
  locked_until: null,
  updated_at: "2026-08-22T00:00:00.000Z",
  updated_by: "seed",
};

// Memory fallback so `next dev` without the Netlify runtime still works;
// production goes through Netlify Blobs so all function instances agree.
let memoryState: FixtureState = DEFAULT_STATE;

export async function getFixtureState(): Promise<FixtureState> {
  try {
    const store = await getStore("magpie_fixture");
    const raw = await store.get("state", { type: "json" });
    return raw ? { ...DEFAULT_STATE, ...raw } : DEFAULT_STATE;
  } catch {
    return memoryState;
  }
}

export async function updateFixtureState(
  patch: Partial<Pick<FixtureState, "layout_mode" | "facts_mode">>,
  actor: string,
): Promise<FixtureState> {
  const current = await getFixtureState();
  const layoutChanged = patch.layout_mode !== undefined && patch.layout_mode !== current.layout_mode;
  const factsChanged = patch.facts_mode !== undefined && patch.facts_mode !== current.facts_mode;
  const next: FixtureState = {
    ...current,
    ...patch,
    revision: layoutChanged || factsChanged ? current.revision + 1 : current.revision,
    updated_at: new Date().toISOString(),
    updated_by: actor,
  };
  try {
    const store = await getStore("magpie_fixture");
    await store.setJSON("state", next);
  } catch {
    memoryState = next;
  }
  return next;
}

export function isLocked(state: FixtureState): boolean {
  if (state.locked_by_run_id || state.locked_by_incident_id) return true;
  return Boolean(state.locked_until && new Date(state.locked_until) > new Date());
}

// Temporary production diagnostic: reports whether Netlify Blobs is reachable
// from this function instance so the control API can surface storage health.
export async function blobHealth(): Promise<{ blob_ok: boolean; error?: string }> {
  try {
    const store = await getStore("magpie_fixture");
    await store.setJSON("health", { at: new Date().toISOString() });
    return { blob_ok: true };
  } catch (error) {
    return { blob_ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
