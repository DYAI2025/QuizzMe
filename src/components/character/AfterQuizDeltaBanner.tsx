'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PsycheCoreStats } from '@/types/psyche';

import { characterSheetCopy } from '@/content/character-sheet.de';

interface AfterQuizDeltaBannerProps {
    deltas?: Partial<PsycheCoreStats>;
    visibleDuration?: number; // ms, default 10000
}

export function AfterQuizDeltaBanner({ deltas, visibleDuration = 10000 }: AfterQuizDeltaBannerProps) {
    const [isVisible, setIsVisible] = useState(false);

    // Identify significant changes (> 0.01)
    const movers = deltas
        ? Object.entries(deltas)
            .filter(([_, val]) => Math.abs(val as number) > 0.01)
            .sort((a, b) => Math.abs(b[1] as number) - Math.abs(a[1] as number)) // Sort by magnitude
            .slice(0, 3) // Top 3
        : [];

    useEffect(() => {
        if (movers.length > 0) {
            // Show banner after small delay
            const timer = setTimeout(() => setIsVisible(true), 1000);

            // Auto hide
            const hideTimer = setTimeout(() => setIsVisible(false), 1000 + visibleDuration);

            return () => {
                clearTimeout(timer);
                clearTimeout(hideTimer);
            };
        }
    }, [deltas, visibleDuration, movers.length]);

    if (movers.length === 0) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
                >
                    <div className="bg-alchemy-bg-midnight border border-gold-primary rounded-xl shadow-2xl p-4 flex items-center justify-between text-text-light">
                        <div className="flex-1">
                            <h4 className="text-sm font-serif text-gold-primary mb-1">{characterSheetCopy.banner.title}</h4>
                            <div className="flex gap-2 flex-wrap">
                                {movers.map(([key, val]) => (
                                    <span key={key} className="text-xs bg-white/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <span className="capitalize">{key}</span>
                                        <span className={val! > 0 ? 'text-emerald-400' : 'text-red-300'}>
                                            {val! > 0 ? '+' : ''}{Math.round(val! * 100)}%
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="ml-4 p-2 text-gold-muted hover:text-gold-light transition-colors"
                            aria-label="Schließen"
                        >
                            ✕
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
