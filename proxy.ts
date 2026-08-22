import { NextResponse, type NextRequest } from "next/server";

// The fixture must always reflect the live layout mode, never a cached copy.
export function proxy(_request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, must-revalidate");
  return response;
}

export const config = {
  matcher: ["/lab/source", "/api/lab/:path*"],
};
