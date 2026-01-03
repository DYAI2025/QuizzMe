"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AstroProfileRow } from "@/components/astro-sheet/model";

export function useAstroProfile() {
  const [profile, setProfile] = useState<AstroProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Session expired. Please log in again.");
        router.replace('/login');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("astro_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" which is valid for new users
         throw error;
      }
      
      setProfile(data as AstroProfileRow | null);
    } catch (err: any) {
      console.error("Error fetching astro profile:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [router, supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
}
