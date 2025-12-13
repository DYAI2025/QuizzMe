/**
 * Psyche Profile Domain Types
 * Defines the shape of the character sheet data contract (psyche_profile_v1)
 */

export interface PsycheState {
    // Dimensional Axes (0..1)
    // Maps to: [Shadow, Light]
    shadow_light: number;
    // Maps to: [Cold, Warm]
    cold_warm: number;
    // Maps to: [Surface, Depth]
    surface_depth: number;
    // Maps to: [Me, We]
    me_we: number;
    // Maps to: [Mind, Heart]
    mind_heart: number;
}

export interface PsycheCoreStats {
    // Core Values (0..1 or 0..100 depending on raw vs view, usually 0..1 from API)
    clarity: number;
    courage: number;
    connection: number;
    order: number;
    shadow: number;
}

export interface DerivedStats {
    // Calculated on frontend (0..100)
    vitality: number; // avg(clarity, connection)
    willpower: number; // avg(courage, order)
    chaos: number; // = shadow
    harmony: number; // 1 - abs(shadow - connection)
}

export interface PsycheProfileV1 {
    id: string;
    user_id?: string;
    created_at?: string;

    // Core Data
    stats: PsycheCoreStats;
    state: PsycheState; // The axes/climate

    // Optional / Narrative
    archetype_params?: {
        dominant_archetype: string;
        secondary_archetypes?: string[];
        // mix description, etc.
    };

    // Narrative Snippet
    narrative_snippet?: string;

    // Delta / History
    last_delta?: {
        date: string;
        stats_delta: Partial<PsycheCoreStats>;
        state_delta: Partial<PsycheState>;
    };
}
