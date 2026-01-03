import { AstroSheetViewModel, AstroProfileRow } from './model';

export function mapProfileToViewModel(row: AstroProfileRow | null): AstroSheetViewModel {
  if (!row) {
    return getEmptyViewModel();
  }

  const isPremium = row.account_tier === 'premium';
  const status = row.input_status ?? 'ready';

  // Basic validation check based on DB status and JSON presence
  const hasJson = row.astro_json && Object.keys(row.astro_json).length > 0;
  const validationStatus = row.astro_validation_status;

  // Improve readiness check: strict mode might return a json with "validation": { "status": "error" }
  const jsonStatus = row.astro_json?.validation?.status;
  const isOk = (validationStatus === 'ok' || jsonStatus === 'ok') && hasJson;

  const needsCompute = !isOk;
  const hasAmbiguousTime = validationStatus === 'AMBIGUOUS_LOCAL_TIME' || jsonStatus === 'AMBIGUOUS_LOCAL_TIME';
  const errorMessage = status === 'error' || !isOk
    ? (validationStatus || row.astro_validation_json?.message || 'Compute required')
    : undefined;

  // Extract signs from row (cached) or json
  const sun = row.sun_sign || row.astro_json?.western?.sun?.sign || "Unknown";
  const moon = row.moon_sign || row.astro_json?.western?.moon?.sign || "Unknown";
  const asc = row.asc_sign || row.astro_json?.western?.ascendant?.sign || "Unknown";

  // Extract Ba Zi (v3.5 structure)
  const baziYear = row.astro_json?.bazi?.year;
  const element = baziYear?.element || "Metal"; // Default if missing
  const animal = baziYear?.animal || "Horse";   // Default if missing

  return {
    identity: {
      displayName: row.username || "Traveler",
      solarSign: sun,
      lunarSign: moon,
      ascendantSign: asc,
      level: 1, 
      status: "INITIATE",
      // Pass Ba Zi data through identity for the view
      element: element,
      animal: animal,
    },
    stats: [
      // Example placeholder stats - in future map from astro_json elements/modes
      { label: "Fire", value: 45 },
      { label: "Water", value: 60 },
      { label: "Air", value: 30 },
      { label: "Earth", value: 75 },
    ],
    quizzes: [
       // Placeholder quizzes until slot integration
       { id: "q1", title: "Unlock your Moon", href: "#", status: "locked", progress: 0 }
    ],
    agents: [], // Placeholder
    monetization: {
      isPremium,
      showAds: !isPremium,
    },
    validation: {
      needsCompute: needsCompute || status !== 'computed',
      hasAmbiguousTime,
      errorMessage: hasAmbiguousTime ? undefined : errorMessage,
      status,
      computedAt: row.astro_computed_at ?? null,
    }
  };
}

function getEmptyViewModel(): AstroSheetViewModel {
  return {
    identity: { displayName: "", solarSign: "", lunarSign: "", ascendantSign: "", level: 0, status: "" },
    stats: [],
    quizzes: [],
    agents: [],
    monetization: { isPremium: false, showAds: false },
    validation: { needsCompute: true, hasAmbiguousTime: false }
  };
}
