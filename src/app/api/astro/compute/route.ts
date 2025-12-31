import { NextResponse } from "next/server";
import crypto from "crypto";

// Ensure this path matches your project structure for the Supabase server client
import { createClient } from "@/lib/supabase/server";
import { getCosmicEngine } from "@/server/cosmicEngine/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ComputeRequestBody = {
  force?: boolean;
};

type AstroProfileRow = {
  user_id: string;
  username: string;
  birth_date: string; // YYYY-MM-DD
  birth_time: string; // HH:MM:SS
  iana_time_zone: string;
  fold: number | null;
  birth_place_name: string;
  birth_place_country: string | null;
  birth_lat: number;
  birth_lng: number;

  astro_json: any;
  astro_compute_hash: string | null;
  astro_computed_at: string | null;
  astro_validation_status: string | null;
};

function parseDateParts(dateStr: string) {
  // "YYYY-MM-DD"
  const [y, m, d] = dateStr.split("-").map((x) => Number(x));
  if (!y || !m || !d) throw new Error(`Invalid birth_date: ${dateStr}`);
  return { year: y, month: m, day: d };
}

function parseTimeParts(timeStr: string) {
  // "HH:MM:SS" (Supabase TIME usually returns with seconds)
  const parts = timeStr.split(":").map((x) => Number(x));
  const hour = parts[0];
  const minute = parts[1];
  const second = parts.length >= 3 ? parts[2] : 0;

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    Number.isNaN(second)
  ) {
    throw new Error(`Invalid birth_time: ${timeStr}`);
  }
  return { hour, minute, second };
}

function sha256(input: object): string {
  const s = JSON.stringify(input);
  return crypto.createHash("sha256").update(s).digest("hex");
}

function pickWesternAnchors(result: any) {
  const western = result?.western;
  return {
    sun_sign: western?.sun?.sign ?? null,
    moon_sign: western?.moon?.sign ?? null,
    asc_sign: western?.ascendant?.sign ?? null,
  };
}

function pickValidationStatus(result: any): string | null {
  const status = result?.validation?.status;
  return typeof status === "string" ? status : null;
}

// PrecisionError is defined inside cosmic engine (CommonJS).
// We treat any thrown object with .code as a "precision-style error".
function isPrecisionLikeError(err: unknown): err is { code?: string; details?: any; message?: string } {
  return typeof err === "object" && err !== null && "code" in err;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    let body: ComputeRequestBody = {};
    try {
      body = (await req.json()) as ComputeRequestBody;
    } catch {
      // empty body ok
      body = {};
    }

    const force = body.force === true;

    // Fetch existing profile
    const { data: row, error: rowErr } = await supabase
      .from("astro_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single<AstroProfileRow>();

    if (rowErr || !row) {
      return NextResponse.json(
        { ok: false, error: "Astro profile not found. Complete onboarding first." },
        { status: 404 }
      );
    }

    // Required fields for Cosmic strict mode
    const missing: string[] = [];
    if (!row.birth_date) missing.push("birth_date");
    if (!row.birth_time) missing.push("birth_time");
    if (!row.iana_time_zone) missing.push("iana_time_zone");
    if (typeof row.birth_lat !== "number") missing.push("birth_lat");
    if (typeof row.birth_lng !== "number") missing.push("birth_lng");

    if (missing.length > 0) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields", missing },
        { status: 422 }
      );
    }

    // Compute hash to skip recomputation when unchanged
    const computeInputForHash = {
      birth_date: row.birth_date,
      birth_time: row.birth_time,
      iana_time_zone: row.iana_time_zone,
      fold: row.fold ?? null,
      birth_lat: row.birth_lat,
      birth_lng: row.birth_lng,
      // include engine policy toggles that affect output
      strict: process.env.COSMIC_STRICT_MODE ?? "1",
      allow_moshier: process.env.ASTRO_PRECISION_ALLOW_MOSHIER ?? "0",
    };

    const computeHash = sha256(computeInputForHash);

    if (!force && row.astro_compute_hash === computeHash && row.astro_computed_at) {
      // Return cached result (mostly validation status and meta)
      // Note: We might want to pass back more data if the UI needs it, 
      // but typically the UI reads from the DB row which has the full JSON.
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "unchanged",
        astro_compute_hash: row.astro_compute_hash,
        astro_computed_at: row.astro_computed_at,
        astro_validation_status: row.astro_validation_status,
      });
    }

    // Prepare inputs
    const { year, month, day } = parseDateParts(row.birth_date);
    const { hour, minute, second } = parseTimeParts(row.birth_time);

    const engine = await getCosmicEngine();

    const engineInput = {
      year,
      month,
      day,
      hour,
      minute,
      second,
      latitude: row.birth_lat,
      longitude: row.birth_lng,
      timezone: row.iana_time_zone,
      ...(row.fold === 0 || row.fold === 1 ? { fold: row.fold } : {}),
    };

    let result: any;
    try {
      result = await engine.calculateProfile(engineInput);
    } catch (err) {
      // Preserve CosmicEngine/Precision error codes for UI resolution (DST fold etc.)
      if (isPrecisionLikeError(err)) {
        const code = (err as any).code ?? "PRECISION_ERROR";
        const details = (err as any).details ?? {};
        const message = (err as any).message ?? "Precision error";

        // Known UX-relevant statuses
        const httpStatus =
          typeof details.httpStatus === "number" ? details.httpStatus :
          code === "AMBIGUOUS_LOCAL_TIME" ? 409 :
          code === "NONEXISTENT_LOCAL_TIME" ? 422 :
          422;

        return NextResponse.json(
          {
            ok: false,
            error: message,
            code,
            details,
          },
          { status: httpStatus }
        );
      }

      console.error("[POST /api/astro/compute] Unknown error:", err);
      return NextResponse.json(
        { ok: false, error: "Compute failed" },
        { status: 500 }
      );
    }

    const anchors = pickWesternAnchors(result);
    const validationStatus = pickValidationStatus(result);

    const updatePayload = {
      astro_json: result,
      astro_compute_hash: computeHash,
      astro_computed_at: new Date().toISOString(),
      astro_validation_status: validationStatus,

      // quick-access anchors (optional but practical)
      sun_sign: anchors.sun_sign,
      moon_sign: anchors.moon_sign,
      asc_sign: anchors.asc_sign,
    };

    const { error: upErr } = await supabase
      .from("astro_profiles")
      .update(updatePayload)
      .eq("user_id", user.id);

    if (upErr) {
      console.error("[POST /api/astro/compute] DB update error:", upErr);
      return NextResponse.json(
        { ok: false, error: "Failed to persist computed profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      skipped: false,
      astro_compute_hash: computeHash,
      astro_computed_at: updatePayload.astro_computed_at,
      astro_validation_status: validationStatus,
      anchors,
      // optionally return only lightweight meta instead of full astro_json
      meta: result?.meta ?? null,
      validation: result?.validation ?? null,
    });
  } catch (err) {
    console.error("[POST /api/astro/compute] Fatal error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
