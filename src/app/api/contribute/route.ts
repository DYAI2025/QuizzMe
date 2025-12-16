/**
 * POST /api/contribute
 *
 * Accepts a ContributionEvent and processes it through the ingestion pipeline.
 *
 * Request body:
 * {
 *   userId?: string,  // defaults to "demo"
 *   event: ContributionEvent
 * }
 *
 * Response:
 * {
 *   accepted: boolean,
 *   snapshot: ProfileSnapshot,
 *   error?: string
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getDefaultProfileStore,
  getDefaultEventStore,
} from "@/lib/storage/json-store";
import { contribute } from "@/lib/api/contribute-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Extract userId (default to "demo" for testing)
    const userId = (body.userId as string) ?? "demo";
    const event = body.event;

    if (!event) {
      return NextResponse.json(
        { error: "Missing 'event' in request body", accepted: false },
        { status: 400 }
      );
    }

    // Process contribution
    const result = await contribute(
      {
        profiles: getDefaultProfileStore(),
        events: getDefaultEventStore(),
      },
      { userId, event }
    );

    // Return appropriate status based on acceptance
    const status = result.accepted ? 200 : 422;

    return NextResponse.json(result, { status });
  } catch (err) {
    console.error("[POST /api/contribute] Error:", err);

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Internal server error",
        accepted: false,
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/contribute",
    method: "POST",
    description: "Submit a ContributionEvent for processing",
  });
}
