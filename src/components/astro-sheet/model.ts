export interface AstroSheetViewModel {
  identity: {
    displayName: string;
    solarSign: string; // e.g. "Scorpio"
    lunarSign: string;
    ascendantSign: string;
    level: number;
    status: string; // e.g. "Mission Seeker"
    element?: string; // Ba Zi Element
    animal?: string; // Ba Zi Animal
  };
  stats: Array<{
    label: string;
    value: number; // 0-100
    suffix?: string;
  }>;
  quizzes: Array<{
    id: string;
    title: string;
    href: string;
    status: 'completed' | 'in_progress' | 'locked';
    progress: number; // 0-100
  }>;
  agents: Array<{
    id: string;
    name: string;
    description: string;
    status: 'online' | 'offline' | 'premium_only';
  }>;
  monetization: {
    isPremium: boolean;
    showAds: boolean;
  };
  natal: {
    planets: NatalBody[];
    houses: HousePlacement[];
    aspects: NatalAspect[];
  };
  validation: {
    needsCompute: boolean;
    hasAmbiguousTime: boolean; // if true, UI should show fold selector
    errorMessage?: string;
    status?: string;
    computedAt?: string | null;
  };
}

export interface NatalBody {
  name: string;
  sign: string;
  degree: number;
  house?: number;
}

export interface HousePlacement {
  number: number;
  sign: string;
  degree: number;
}

export interface NatalAspect {
  from: string;
  to: string;
  type: string;
  orb?: number;
}

export type AstroProfileRow = {
  user_id: string;
  username: string;
  birth_date: string;
  birth_time: string;
  birth_time_local?: string;
  iana_time_zone: string;
  fold: number | null;
  // ... other fields
  birth_place_name?: string;
  birth_place_country?: string | null;
  birth_lat?: number;
  birth_lng?: number;
  sun_sign: string | null;
  moon_sign: string | null;
  asc_sign: string | null;
  astro_json: Record<string, any>;
  astro_meta_json?: Record<string, any> | null;
  astro_validation_json?: Record<string, any> | null;
  astro_compute_hash?: string | null;
  astro_computed_at?: string | null;
  account_tier: 'free' | 'premium';
  astro_validation_status: string | null; // e.g. "ok", "error", "ambiguous"
  input_status?: 'ready' | 'computing' | 'computed' | 'error';
};

export interface AstroInputData {
  name: string;
  year: string;
  date: string;
  time: string;
  location: string;
  timeUnknown?: boolean;
  timezone?: string;
}
