'use client';

import React from 'react';
import { AlchemyCard, AlchemyCardHeader, AlchemyCardTitle, AlchemyCardContent } from '@/components/ui/AlchemyCard';
import { StatBarRow } from './StatBarRow';
import { PsycheCoreStats } from '@/types/psyche';

interface CoreStatsCardProps {
    stats: PsycheCoreStats;
    deltas?: Partial<PsycheCoreStats>;
    className?: string;
}

export function CoreStatsCard({ stats, deltas, className = '' }: CoreStatsCardProps) {
    return (
        <AlchemyCard className={className} cornerOrnaments>
            <AlchemyCardHeader>
                <AlchemyCardTitle>Wesentliche Natur</AlchemyCardTitle>
            </AlchemyCardHeader>
            <AlchemyCardContent>
                <div className="space-y-1">
                    <StatBarRow
                        label="Klarheit"
                        value={stats.clarity}
                        delta={deltas?.clarity}
                        delay={0.1}
                    />
                    <StatBarRow
                        label="Mut"
                        value={stats.courage}
                        delta={deltas?.courage}
                        delay={0.2}
                    />
                    <StatBarRow
                        label="Verbindung"
                        value={stats.connection}
                        delta={deltas?.connection}
                        delay={0.3}
                    />
                    <StatBarRow
                        label="Struktur"
                        value={stats.order}
                        delta={deltas?.order}
                        delay={0.4}
                    />
                    <StatBarRow
                        label="Schatten"
                        value={stats.shadow}
                        delta={deltas?.shadow}
                        delay={0.5}
                    // Shadow usually gets a deeper color/logic but standard gold for now is consistent
                    />
                </div>
            </AlchemyCardContent>
        </AlchemyCard>
    );
}
