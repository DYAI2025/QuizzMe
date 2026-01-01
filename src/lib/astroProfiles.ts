import { createClient } from '@/lib/supabase/client';

export type ProfileInput = {
    username: string;
    birth_date: string;
    birth_time: string;
    birth_place_name: string;
    birth_lat: number;
    birth_lng: number;
    iana_time_zone: string;
};

export async function upsertProfile(data: ProfileInput) {
    const supabase = createClient();
    
    // Get current user to ensure we have ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("User not authenticated");

    const payload = {
        user_id: user.id,
        ...data,
        updated_at: new Date().toISOString()
    };

    const { error } = await supabase
        .from('astro_profiles')
        .upsert(payload)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to save profile: ${error.message}`);
    }

    return { success: true };
}
