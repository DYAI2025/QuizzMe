/**
 * Supabase Database Types
 * 
 * These types match the psyche_profiles table schema
 */

export interface Database {
  public: {
    Tables: {
      psyche_profiles: {
        Row: PsycheProfileRow;
        Insert: PsycheProfileInsert;
        Update: PsycheProfileUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export interface PsycheProfileRow {
  id: string;
  user_id: string | null;
  device_id: string | null;
  
  // Core Stats (0..1)
  clarity: number;
  courage: number;
  connection: number;
  order: number;
  shadow: number;
  
  // Climate State (0..1)
  shadow_light: number;
  cold_warm: number;
  surface_depth: number;
  me_we: number;
  mind_heart: number;
  
  // Optional JSON fields
  meta_stats: MetaStatsJson | null;
  archetype_params: ArchetypeParamsJson | null;
  narrative_snippet: string | null;
  last_delta: DeltaJson | null;
  
  created_at: string;
  updated_at: string;
}

export interface PsycheProfileInsert {
  id?: string;
  user_id?: string | null;
  device_id?: string | null;
  
  clarity: number;
  courage: number;
  connection: number;
  order: number;
  shadow: number;
  
  shadow_light: number;
  cold_warm: number;
  surface_depth: number;
  me_we: number;
  mind_heart: number;
  
  meta_stats?: MetaStatsJson | null;
  archetype_params?: ArchetypeParamsJson | null;
  narrative_snippet?: string | null;
  last_delta?: DeltaJson | null;
  
  created_at?: string;
  updated_at?: string;
}

export interface PsycheProfileUpdate {
  id?: string;
  user_id?: string | null;
  device_id?: string | null;
  
  clarity?: number;
  courage?: number;
  connection?: number;
  order?: number;
  shadow?: number;
  
  shadow_light?: number;
  cold_warm?: number;
  surface_depth?: number;
  me_we?: number;
  mind_heart?: number;
  
  meta_stats?: MetaStatsJson | null;
  archetype_params?: ArchetypeParamsJson | null;
  narrative_snippet?: string | null;
  last_delta?: DeltaJson | null;
  
  updated_at?: string;
}

// JSON field types
interface MetaStatsJson {
  intensity: 'quiet' | 'noticeable' | 'intense';
  tempo: 'calm' | 'dynamic' | 'volatile';
  shadow_confidence: number;
  shadow_confirmed: boolean;
}

interface ArchetypeParamsJson {
  dominant_archetype: string;
  secondary_archetypes?: string[];
  archetype_mix?: Record<string, number>;
}

interface DeltaJson {
  date: string;
  stats_delta: Record<string, number>;
  state_delta: Record<string, number>;
  movers?: Array<{
    dimension: string;
    delta: number;
    magnitude: number;
  }>;
}
