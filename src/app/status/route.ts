import { NextResponse } from "next/server";

/**
 * The build fingerprint, as a plain file.
 *
 * This ships as a static file, so it carries no response headers of its own.
 * Anything a reader needs is in the body.
 */

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    name: "Kambradu",
    release: process.env.KAMBRADU_RELEASE_SHA ?? "development",
    builtAt: process.env.KAMBRADU_BUILD_DATE ?? "development",
    environment: process.env.KAMBRADU_RELEASE_ENV ?? "local",
    boundary: "web-only, local-first, no accounts, no uploads"
  });
}
