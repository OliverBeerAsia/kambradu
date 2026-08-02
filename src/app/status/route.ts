import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    name: "Kambradu",
    release: process.env.KAMBRADU_RELEASE_SHA ?? "development",
    builtAt: process.env.KAMBRADU_BUILD_DATE ?? "development",
    environment: process.env.KAMBRADU_RELEASE_ENV ?? "local",
    boundary: "Kristang-only, web-only, text-only, local-first"
  }, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300",
      "X-Kambradu-Release": process.env.KAMBRADU_RELEASE_SHA ?? "development"
    }
  });
}
