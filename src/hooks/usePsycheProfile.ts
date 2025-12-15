import { useState, useEffect } from 'react';
import { PsycheProfileV1 } from '@/types/psyche';
import { MOCK_PSYCHE_PROFILE } from '@/data/mocks/psyche';

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
                setProfile(MOCK_PSYCHE_PROFILE);
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
