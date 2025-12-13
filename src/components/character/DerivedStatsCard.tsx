'use client';

import React from 'react';
import { AlchemyCard, AlchemyCardHeader, AlchemyCardTitle, AlchemyCardContent } from '@/components/ui/AlchemyCard';
import { DerivedStats } from '@/types/psyche';

// Sub-component for individual derived stat
const StatPill = ({ label, value, delay = 0 }: { label: string; value: number; delay?: number }) => (
    <div className="flex flex-col items-center p-3 bg-parchment rounded-lg border border-gold-subtle/50 text-center">
        <span className="text-xs uppercase tracking-widest text-text-ink-muted mb-1 font-sans">{label}</span>
        <span className="text-2xl font-serif font-bold text-text-ink tabular-nums">{value}</span>
    </div>
);

interface DerivedStatsCardProps {
    stats: DerivedStats;
    className?: string;
}

export function DerivedStatsCard({ stats, className = '' }: DerivedStatsCardProps) {
    return (
        <AlchemyCard className={className} variant="elevated">
            <AlchemyCardHeader>
                <AlchemyCardTitle as="h3" className="text-lg">Potentiale</AlchemyCardTitle>
            </AlchemyCardHeader>
            <AlchemyCardContent>
                <div className="grid grid-cols-2 gap-3">
                    <StatPill label="Vitalität" value={stats.vitality} delay={0.1} />
                    <StatPill label="Willenskraft" value={stats.willpower} delay={0.2} />
                    <StatPill label="Chaos" value={stats.chaos} delay={0.3} />
                    <StatPill label="Harmonie" value={stats.harmony} delay={0.4} />
                </div>
            </AlchemyCardContent>
        </AlchemyCard>
    );
}
