import { getFixtureState } from "@/lib/fixture/state";
import { renderFixtureHtml } from "@/lib/fixture/render";

export const dynamic = "force-dynamic";

// Served as a plain route handler (not a React page): the response is always
// freshly rendered with explicit no-store so the collector sees the current
// fixture layout on every request.
export async function GET() {
  const state = await getFixtureState();
  return new Response(renderFixtureHtml(state), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, must-revalidate",
      "x-fixture-revision": String(state.revision),
    },
  });
}
