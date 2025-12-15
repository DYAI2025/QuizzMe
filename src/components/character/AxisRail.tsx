'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AxisRailProps {
    leftLabel: string;
    rightLabel: string;
    value: number; // 0..1, 0.5 is center
    delta?: number;
    delay?: number;
}

export function AxisRail({
    leftLabel,
    rightLabel,
    value,
    delta,
    delay = 0
}: AxisRailProps) {
    // Clamp value to 0..1
    const safeValue = Math.max(0, Math.min(1, value));

    return (
        <div className="flex flex-col mb-4">
            <div className="flex justify-between text-xs font-serif text-text-ink-muted uppercase tracking-wider mb-1.5 px-1">
                <span className={safeValue < 0.4 ? 'text-text-ink font-semibold' : ''}>{leftLabel}</span>
                <span className={safeValue > 0.6 ? 'text-text-ink font-semibold' : ''}>{rightLabel}</span>
            </div>

            <div className="relative h-2.5 w-full bg-parchment-dark rounded-full overflow-hidden shadow-inner flex items-center">

                {/* Center Marker Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gold-muted z-0"></div>

                {/* Active Range Fill (Optional: Just show a thumb or show fill from center?) 
                    The design specs often imply a slider thumb or a fill from center. 
                    Let's do a simple thumb marker + subtle fill from center for clarity.
                */}

                <motion.div
                    className="absolute top-0 bottom-0 bg-gold-muted/30"
                    initial={{ left: '50%', right: '50%' }}
                    animate={{
                        left: safeValue < 0.5 ? `${safeValue * 100}%` : '50%',
                        right: safeValue > 0.5 ? `${(1 - safeValue) * 100}%` : '50%'
                    }}
                    transition={{ duration: 0.8, delay: delay }}
                />

                {/* Thumb Marker */}
                <motion.div
                    className="absolute w-3 h-3 bg-gold-primary border border-white rounded-full shadow-sm z-10"
                    initial={{ left: '50%' }}
                    animate={{ left: `${safeValue * 100}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20, delay: delay }}
                    style={{ x: '-50%' }} // Center the thumb on the point
                />
            </div>
        </div>
    );
}
