'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { toPercent01 } from '@/lib/derivedStats';

interface StatBarRowProps {
    label: string;
    value: number; // 0..1
    delta?: number; // +/- change, e.g. 0.05
    colorClass?: string;
    showValue?: boolean;
    delay?: number;
}

export function StatBarRow({
    label,
    value,
    delta,
    colorClass = 'bg-gold-gradient', // Default to token gradient
    showValue = true,
    delay = 0
}: StatBarRowProps) {
    const percentage = toPercent01(value);
    const hasDelta = delta !== undefined && Math.abs(delta) > 0.001;
    const deltaPercent = hasDelta ? toPercent01(Math.abs(delta!)) : 0;
    const isPositive = delta! > 0;

    return (
        <div className="flex flex-col gap-1 w-full mb-3 group">
            <div className="flex justify-between items-end mb-1">
                <span className="font-sans text-sm font-medium text-text-ink group-hover:text-gold-dark transition-colors">
                    {label}
                </span>

                <div className="flex items-center gap-2">
                    {/* Delta Pill */}
                    {hasDelta && (
                        <motion.span
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: delay + 0.5 }}
                            className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                        >
                            {isPositive ? '+' : '-'}{deltaPercent}%
                        </motion.span>
                    )}

                    {/* Numeric Value */}
                    {showValue && (
                        <span className="font-sans text-sm font-bold tabular-nums text-text-ink-muted">
                            {percentage}%
                        </span>
                    )}
                </div>
            </div>

            {/* Track */}
            <div className="h-2 w-full bg-parchment-dark rounded-full overflow-hidden relative shadow-inner">
                {/* Fill */}
                <motion.div
                    className={`h-full rounded-full ${colorClass}`}
                    style={{
                        // If colorClass isn't a utility, we might need direct style. 
                        // But we will use utility classes like 'bg-alchemy-gold' where possible or the gradient
                        background: 'linear-gradient(90deg, var(--alchemy-gold-dark) 0%, var(--alchemy-gold-primary) 100%)'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: delay, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}
