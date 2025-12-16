/**
 * GET /api/profile/snapshot
 *
 * Returns the current ProfileSnapshot for a user.
 *
 * Query params:
 *   userId?: string  // defaults to "demo"
 *
 * Response:
 * {
 *   snapshot: ProfileSnapshot,
 *   isNew: boolean
 * }
 */

export const dynamic = "force-static";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { getDefaultProfileStore } from "@/lib/storage/json-store";
import { getSnapshot } from "@/lib/api/contribute-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") ?? "demo";

    const result = await getSnapshot(getDefaultProfileStore(), userId);

    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET /api/profile/snapshot] Error:", err);

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
