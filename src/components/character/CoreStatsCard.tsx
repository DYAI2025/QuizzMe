'use client';

import React from 'react';
import { AlchemyCard, AlchemyCardHeader, AlchemyCardTitle, AlchemyCardContent } from '@/components/ui/AlchemyCard';
import { StatBarRow } from './StatBarRow';
import { PsycheCoreStats } from '@/types/psyche';
import { characterSheetCopy } from '@/content/character-sheet.de';

interface CoreStatsCardProps {
    stats: PsycheCoreStats;
    deltas?: Partial<PsycheCoreStats>;
    className?: string;
}

export function CoreStatsCard({ stats, deltas, className = '' }: CoreStatsCardProps) {
    return (
        <AlchemyCard className={className} cornerOrnaments>
            <AlchemyCardHeader>
                <AlchemyCardTitle as="h3" className="text-lg">{characterSheetCopy.sections.coreStats}</AlchemyCardTitle>
            </AlchemyCardHeader>
            <AlchemyCardContent>
                <div className="space-y-1">
                    <StatBarRow
                        label={characterSheetCopy.stats.clarity}
                        value={stats.clarity}
                        delta={deltas?.clarity}
                        delay={0.1}
                    />
                    <StatBarRow
                        label={characterSheetCopy.stats.courage}
                        value={stats.courage}
                        delta={deltas?.courage}
                        colorClass="bg-gold-light"
                        delay={0.2}
                    />
                    <StatBarRow
                        label={characterSheetCopy.stats.connection}
                        value={stats.connection}
                        delta={deltas?.connection}
                        delay={0.3}
                    />
                    <StatBarRow
                        label={characterSheetCopy.stats.order}
                        value={stats.order}
                        delta={deltas?.order}
                        colorClass="bg-gold-light"
                        delay={0.4}
                    />
                    <StatBarRow
                        label={characterSheetCopy.stats.shadow}
                        value={stats.shadow}
                        delta={deltas?.shadow}
                        delay={0.5}
                    />
                </div>
            </AlchemyCardContent>
        </AlchemyCard>
    );
}
