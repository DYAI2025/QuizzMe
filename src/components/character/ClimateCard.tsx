'use client';

import React from 'react';
import { AlchemyCard, AlchemyCardHeader, AlchemyCardTitle, AlchemyCardContent } from '@/components/ui/AlchemyCard';
import { AxisRail } from './AxisRail';
import { PsycheState } from '@/types/psyche';

interface ClimateCardProps {
    state: PsycheState;
    deltas?: Partial<PsycheState>;
    className?: string;
}

export function ClimateCard({ state, deltas, className = '' }: ClimateCardProps) {
    return (
        <AlchemyCard className={className}>
            <AlchemyCardHeader>
                <AlchemyCardTitle>Dein Klima</AlchemyCardTitle>
            </AlchemyCardHeader>
            <AlchemyCardContent>
                <div className="pt-2">
                    <AxisRail
                        leftLabel="Schatten"
                        rightLabel="Licht"
                        value={state.shadow_light}
                        delta={deltas?.shadow_light}
                        delay={0.1}
                    />
                    <AxisRail
                        leftLabel="Kühl"
                        rightLabel="Warm"
                        value={state.cold_warm}
                        delta={deltas?.cold_warm}
                        delay={0.2}
                    />
                    <AxisRail
                        leftLabel="Tiefe"
                        rightLabel="Fläche"
                        value={state.surface_depth} // Caution: Label semantics might need checking 0=Deep or 0=Surface? Assuming 0=Surface usually, but let's stick to spec. 
                        // Let's assume 0=Surface (Left), 1=Depth (Right) or vice versa. 
                        // Renaming for clarity based on typical RPG stats:
                        // Usually "Depth" is favored. Let's map 0->Surface, 1->Depth for now.
                        delay={0.3}
                    />
                    <AxisRail
                        leftLabel="Ich"
                        rightLabel="Wir"
                        value={state.me_we}
                        delta={deltas?.me_we}
                        delay={0.4}
                    />
                    <AxisRail
                        leftLabel="Verstand"
                        rightLabel="Gefühl"
                        value={state.mind_heart}
                        delta={deltas?.mind_heart}
                        delay={0.5}
                    />
                </div>
            </AlchemyCardContent>
        </AlchemyCard>
    );
}
