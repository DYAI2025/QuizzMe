import { useState, useEffect } from 'react';
import { PsycheProfileV1 } from '@/types/psyche';

// Mock Data for development/fallback
const MOCK_PROFILE: PsycheProfileV1 = {
    id: 'mock-user-123',
    stats: {
        clarity: 0.72,
        courage: 0.45,
        connection: 0.88,
        order: 0.30,
        shadow: 0.15,
    },
    state: {
        shadow_light: 0.8,
        cold_warm: 0.7,
        surface_depth: 0.9,
        me_we: 0.6,
        mind_heart: 0.4
    },
    narrative_snippet: "Du navigierst mit offenem Herzen, doch deine Wurzeln suchen noch nach festem Halt im Chaos.",
    archetype_params: {
        dominant_archetype: "Der Leuchtturm",
        secondary_archetypes: ["Der Wanderer"]
    },
    // Simulate a recent change for dev purposes
    last_delta: {
        date: new Date().toISOString(),
        stats_delta: {
            connection: 0.05,
            courage: -0.02
        },
        state_delta: {
            cold_warm: 0.1
        }
    }
};

interface UsePsycheProfileResult {
    profile: PsycheProfileV1 | null;
    isLoading: boolean;
    error: Error | null;
}

export function usePsycheProfile(): UsePsycheProfileResult {
    const [profile, setProfile] = useState<PsycheProfileV1 | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // TODO: Replace with actual API fetch
        // fetch('/api/profile/psyche')...

        const fetchProfile = async () => {
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 600));

                // For now, return mock
                setProfile(MOCK_PROFILE);
                setIsLoading(false);
            } catch (err) {
                console.error("Failed to fetch psyche profile", err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return { profile, isLoading, error };
}
