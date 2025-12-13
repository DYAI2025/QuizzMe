'use client';

import React, { useMemo } from 'react';
import { usePsycheProfile } from '@/hooks/usePsycheProfile';
import { calcDerivedStats } from '@/lib/derivedStats';
import { CoreStatsCard } from '@/components/character/CoreStatsCard';
import { ClimateCard } from '@/components/character/ClimateCard';
import { DerivedStatsCard } from '@/components/character/DerivedStatsCard';
import { ArchetypeStoryCard } from '@/components/character/ArchetypeStoryCard';

import { AfterQuizDeltaBanner } from '@/components/character/AfterQuizDeltaBanner';

export default function CharacterSheetPage() {
    const { profile, isLoading, error } = usePsycheProfile();

    const derivedStats = useMemo(() => {
        if (!profile) return null;
        return calcDerivedStats(profile.stats);
    }, [profile]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-gold-primary font-serif text-xl">
                    Grimoire wird geöffnet...
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-400 font-sans">
                    Fehler beim Laden des Profils.
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-bg-emerald text-text-ink pb-20">
            {/* Header Section */}
            <header className="pt-20 pb-10 px-4 text-center">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-light mb-3 text-gold-gradient">
                    Dein Charakter
                </h1>
                <p className="font-sans text-text-light-muted max-w-lg mx-auto">
                    Dein Avatar ist ein Klima, kein Label. Er wandelt sich mit jeder Entscheidung.
                </p>
            </header>

            {/* Main Content Grid */}
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

                    {/* LEFT COLUMN (Core & Climate) - Span 7 */}
                    <div className="lg:col-span-7 space-y-6">
                        <CoreStatsCard
                            stats={profile.stats}
                            deltas={profile.last_delta?.stats_delta}
                        />
                        <ClimateCard
                            state={profile.state}
                            deltas={profile.last_delta?.state_delta}
                        />
                    </div>

                    {/* RIGHT COLUMN (Derived, Story, Meta) - Span 5 */}
                    <div className="lg:col-span-5 space-y-6">
                        <ArchetypeStoryCard
                            archetype={profile.archetype_params?.dominant_archetype}
                            secondary={profile.archetype_params?.secondary_archetypes}
                            snippet={profile.narrative_snippet}
                        />

                        {derivedStats && (
                            <DerivedStatsCard stats={derivedStats} />
                        )}

                        {/* Additional spacing or footer CTAs could go here */}
                    </div>
                </div>
            </div>

            <AfterQuizDeltaBanner deltas={profile.last_delta?.stats_delta} />
        </main>
    );
}
