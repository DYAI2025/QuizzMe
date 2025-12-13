'use client'

import React, { useState } from 'react';
import { questions, roles } from './social-role/data';
import { aggregateMarkers } from '../../lib/lme/marker-aggregator';
import { updatePsycheState } from '../../lib/lme/lme-core';
import { getPsycheState, savePsycheState } from '../../lib/lme/storage';

// Modern Alchemy colors
const colors = {
    bgPrimary: '#041726',
    bgEmerald: '#0D5A5F',
    goldPrimary: '#D2A95A',
    goldDark: '#A77D38',
    sage: '#6CA192',
    teal: '#1C5B5C',
    cream: '#F7F0E6',
    creamDark: '#F2E3CF',
    textDark: '#271C16',
    textLight: '#F7F3EA',
};

type Scores = {
    stability: number;
    fire: number;
    truth: number;
    harbor: number;
    compass: number;
    bridge: number;
};

// Social connections icon
const ConnectionsIcon = () => (
    <svg viewBox="0 0 120 120" className="w-28 h-28">
        <circle cx="60" cy="60" r="50" stroke={colors.goldPrimary} strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.4" />
        <circle cx="60" cy="35" r="10" stroke={colors.goldPrimary} strokeWidth="1.5" fill={colors.goldPrimary} fillOpacity="0.2" />
        <circle cx="35" cy="75" r="10" stroke={colors.goldPrimary} strokeWidth="1.5" fill={colors.goldPrimary} fillOpacity="0.2" />
        <circle cx="85" cy="75" r="10" stroke={colors.goldPrimary} strokeWidth="1.5" fill={colors.goldPrimary} fillOpacity="0.2" />
        <line x1="60" y1="45" x2="40" y2="67" stroke={colors.goldPrimary} strokeWidth="1" opacity="0.5" />
        <line x1="60" y1="45" x2="80" y2="67" stroke={colors.goldPrimary} strokeWidth="1" opacity="0.5" />
        <line x1="45" y1="75" x2="75" y2="75" stroke={colors.goldPrimary} strokeWidth="1" opacity="0.5" />
    </svg>
);

// Loading spinner
const LoadingSpinner = () => (
    <svg viewBox="0 0 80 80" className="w-20 h-20 animate-spin" style={{ animationDuration: '3s' }}>
        <circle cx="40" cy="40" r="35" stroke={colors.goldPrimary} strokeWidth="1.5" fill="none" strokeDasharray="8 4" opacity="0.4" />
        <circle cx="40" cy="40" r="6" fill={colors.goldPrimary} opacity="0.4" />
        <circle cx="40" cy="40" r="3" fill={colors.goldPrimary} />
    </svg>
);

export function SocialRoleQuiz() {
    const [stage, setStage] = useState<'intro' | 'quiz' | 'loading' | 'result'>('intro');
    const [currentQ, setCurrentQ] = useState(0);
    const [scores, setScores] = useState<Scores>({ stability: 0, fire: 0, truth: 0, harbor: 0, compass: 0, bridge: 0 });
    const [result, setResult] = useState<typeof roles[keyof typeof roles] | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [collectedMarkers, setCollectedMarkers] = useState<any[]>([]);

    const startQuiz = () => setStage('quiz');

    const handleAnswer = (option: typeof questions[0]['options'][0]) => {
        setIsAnimating(true);
        setTimeout(() => {
            const newScores = { ...scores };
            Object.entries(option.scores).forEach(([key, val]) => {
                newScores[key as keyof Scores] += val as number;
            });
            setScores(newScores);

            const newMarkers = [...collectedMarkers];
            if ((option as any).psyche_markers) {
                newMarkers.push((option as any).psyche_markers);
                setCollectedMarkers(newMarkers);
            }

            if (currentQ < questions.length - 1) {
                setCurrentQ(currentQ + 1);
                setIsAnimating(false);
            } else {
                calculateResult(newScores, newMarkers);
            }
        }, 300);
    };

    const calculateResult = (finalScores: Scores, finalMarkers: any[]) => {
        setStage('loading');

        // LME Update immediately
        if (finalMarkers.length > 0) {
            try {
                const aggregated = aggregateMarkers(finalMarkers, 0.8);
                const currentPsyche = getPsycheState();
                const newPsyche = updatePsycheState(currentPsyche, aggregated.markerScores, aggregated.reliabilityWeight);
                savePsycheState(newPsyche);
            } catch (e) {
                console.error("LME Update failed", e);
            }
        }

        setTimeout(() => {
            const roleMapping: Record<string, keyof typeof roles> = {
                stability: 'rock',
                fire: 'flame',
                truth: 'mirror',
                harbor: 'harbor',
                compass: 'compass',
                bridge: 'bridge'
            };

            let maxScore = 0;
            let dominantTrait = 'stability';

            Object.entries(finalScores).forEach(([trait, score]) => {
                if (score > maxScore) {
                    maxScore = score;
                    dominantTrait = trait;
                }
            });

            const resultRole = roles[roleMapping[dominantTrait]];
            setResult(resultRole);
            setStage('result');
            setIsAnimating(false);
        }, 2000);
    };

    const progress = ((currentQ + 1) / questions.length) * 100;

    // INTRO SCREEN
    if (stage === 'intro') {
        return (
            <div
                className="flex flex-col items-center justify-center min-h-[600px] text-center p-8 rounded-3xl"
                style={{
                    background: `linear-gradient(165deg, ${colors.bgEmerald} 0%, ${colors.bgPrimary} 50%, #031119 100%)`,
                    color: colors.textLight
                }}
            >
                <div className="flex justify-center mb-6">
                    <ConnectionsIcon />
                </div>

                <h1
                    className="text-3xl font-serif font-semibold mb-4"
                    style={{ color: colors.goldPrimary }}
                >
                    Wer bist du für andere?
                </h1>

                <p className="text-lg mb-8 max-w-md" style={{ color: colors.sage }}>
                    Der Fels? Die Flamme? Der Spiegel?<br />
                    Finde heraus, welche Rolle du unbewusst in deinem Umfeld spielst.
                </p>

                <button
                    onClick={startQuiz}
                    className="px-10 py-4 rounded-xl font-semibold text-lg transition-all hover:translate-y-[-2px]"
                    style={{
                        background: `linear-gradient(135deg, ${colors.goldPrimary} 0%, ${colors.goldDark} 100%)`,
                        color: colors.textDark,
                        boxShadow: '0 4px 20px rgba(210, 169, 90, 0.25)'
                    }}
                >
                    Entdecken
                </button>

                <p className="text-xs mt-6" style={{ color: colors.teal }}>
                    Zur Selbstreflexion. Keine Diagnose. <span style={{ color: colors.sage }}>Syncts mit deinem Profil.</span>
                </p>
            </div>
        );
    }

    // LOADING SCREEN
    if (stage === 'loading') {
        return (
            <div
                className="flex flex-col items-center justify-center min-h-[600px] rounded-3xl"
                style={{
                    background: `linear-gradient(165deg, ${colors.bgEmerald} 0%, ${colors.bgPrimary} 50%, #031119 100%)`,
                    color: colors.textLight
                }}
            >
                <LoadingSpinner />
                <p className="text-lg mt-6 font-serif" style={{ color: colors.cream }}>
                    Dein soziales Profil nimmt Form an...
                </p>
            </div>
        );
    }

    // QUIZ SCREEN
    if (stage === 'quiz') {
        const q = questions[currentQ];

        return (
            <div
                className={`min-h-[600px] p-6 rounded-3xl flex flex-col transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}
                style={{
                    background: `linear-gradient(165deg, ${colors.bgEmerald} 0%, ${colors.bgPrimary} 50%, #031119 100%)`,
                    color: colors.textLight
                }}
            >
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs mb-2" style={{ color: colors.goldDark }}>
                        <span>Frage {currentQ + 1} von {questions.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div
                        className="h-1 rounded-full overflow-hidden"
                        style={{ background: 'rgba(210, 169, 90, 0.2)' }}
                    >
                        <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                                width: `${progress}%`,
                                background: `linear-gradient(90deg, ${colors.goldDark} 0%, ${colors.goldPrimary} 100%)`
                            }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div
                    className="flex-grow flex flex-col justify-center rounded-2xl p-6"
                    style={{
                        background: colors.cream,
                        border: `1px solid ${colors.goldPrimary}`,
                        boxShadow: '0 4px 40px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    <p
                        className="text-sm italic mb-4 font-serif"
                        style={{ color: colors.teal }}
                    >
                        {q.scenario}
                    </p>

                    <h2
                        className="text-xl font-serif font-semibold mb-8 leading-snug"
                        style={{ color: colors.textDark }}
                    >
                        {q.text}
                    </h2>

                    <div className="space-y-3">
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt)}
                                className="w-full text-left p-4 rounded-xl transition-all duration-200 hover:translate-y-[-1px] flex items-center gap-4 group"
                                style={{
                                    background: 'rgba(247, 240, 230, 0.6)',
                                    border: '1px solid rgba(167, 125, 56, 0.3)',
                                    color: colors.textDark
                                }}
                            >
                                <span
                                    className="text-xl opacity-70 group-hover:opacity-100 transition-opacity"
                                >
                                    {opt.vibe}
                                </span>
                                <span className="text-sm">{opt.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // RESULT SCREEN
    if (stage === 'result' && result) {
        return (
            <div
                className="rounded-3xl overflow-hidden p-6"
                style={{
                    background: `linear-gradient(165deg, ${colors.bgEmerald} 0%, ${colors.bgPrimary} 50%, #031119 100%)`,
                    color: colors.textLight
                }}
            >
                <div className="max-w-lg mx-auto">
                    {/* Result Card */}
                    <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                            background: colors.cream,
                            border: `1px solid ${colors.goldPrimary}`,
                            boxShadow: '0 8px 50px rgba(0, 0, 0, 0.35)'
                        }}
                    >
                        {/* Header */}
                        <div
                            className="p-6 text-center"
                            style={{
                                background: `linear-gradient(135deg, ${colors.goldPrimary}15 0%, ${colors.goldPrimary}05 100%)`,
                                borderBottom: `1px solid ${colors.goldPrimary}`
                            }}
                        >
                            <div className="text-5xl mb-4">{result.emoji}</div>
                            <h1
                                className="text-2xl font-serif font-bold mb-2"
                                style={{ color: colors.textDark }}
                            >
                                {result.name}
                            </h1>
                            <p className="italic text-sm" style={{ color: colors.teal }}>
                                „{result.tagline}"
                            </p>
                        </div>

                        <div className="p-6 space-y-5 max-h-[500px] overflow-y-auto">
                            <p
                                className="leading-relaxed text-center"
                                style={{ color: colors.textDark, opacity: 0.9 }}
                            >
                                {result.description}
                            </p>

                            {/* Superpower & Shadow */}
                            <div className="grid grid-cols-2 gap-3">
                                <div
                                    className="rounded-xl p-4"
                                    style={{
                                        background: 'rgba(108, 161, 146, 0.12)',
                                        border: '1px solid rgba(108, 161, 146, 0.25)'
                                    }}
                                >
                                    <div className="text-xl mb-2">⚡</div>
                                    <h3 className="text-xs uppercase tracking-wider mb-1" style={{ color: colors.sage }}>
                                        Superkraft
                                    </h3>
                                    <p className="font-medium text-sm" style={{ color: colors.textDark }}>{result.superpower}</p>
                                </div>
                                <div
                                    className="rounded-xl p-4"
                                    style={{
                                        background: 'rgba(167, 125, 56, 0.1)',
                                        border: '1px solid rgba(167, 125, 56, 0.25)'
                                    }}
                                >
                                    <div className="text-xl mb-2">🌑</div>
                                    <h3 className="text-xs uppercase tracking-wider mb-1" style={{ color: colors.goldDark }}>
                                        Schattenseite
                                    </h3>
                                    <p className="font-medium text-sm" style={{ color: colors.textDark }}>{result.shadow}</p>
                                </div>
                            </div>

                            {/* Ingredients */}
                            <div
                                className="rounded-xl p-5"
                                style={{
                                    background: 'rgba(28, 91, 92, 0.08)',
                                    border: '1px solid rgba(28, 91, 92, 0.15)'
                                }}
                            >
                                <h3 className="text-xs uppercase tracking-wider mb-4" style={{ color: colors.teal }}>
                                    Deine Zutaten
                                </h3>
                                <div className="space-y-3">
                                    {result.ingredients.map(([pct, label], i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div
                                                className="flex-1 h-2 rounded-full overflow-hidden"
                                                style={{ background: 'rgba(28, 91, 92, 0.15)' }}
                                            >
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${pct}%`,
                                                        background: `linear-gradient(90deg, ${colors.goldDark} 0%, ${colors.goldPrimary} 100%)`
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm w-32 text-right" style={{ color: colors.textDark }}>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dynamics */}
                            <div
                                className="rounded-xl p-5"
                                style={{
                                    background: 'rgba(28, 91, 92, 0.05)',
                                    border: '1px solid rgba(28, 91, 92, 0.1)'
                                }}
                            >
                                <h3 className="text-xs uppercase tracking-wider mb-4 text-center" style={{ color: colors.teal }}>
                                    Deine Dynamiken
                                </h3>
                                <div className="flex justify-between text-center">
                                    <div>
                                        <p className="text-xs mb-1" style={{ color: colors.teal }}>Verstärkt durch</p>
                                        <p className="font-medium text-sm" style={{ color: colors.sage }}>{result.compatible}</p>
                                    </div>
                                    <div
                                        className="w-px mx-4"
                                        style={{ background: 'rgba(28, 91, 92, 0.2)' }}
                                    />
                                    <div>
                                        <p className="text-xs mb-1" style={{ color: colors.teal }}>Herausfordernd</p>
                                        <p className="font-medium text-sm" style={{ color: colors.goldDark }}>{result.challenging}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={() => {
                                const text = `${result.emoji} Ich bin ${result.name}\n\n"${result.tagline}"\n\nFinde heraus, wer DU für andere bist.`;
                                if (navigator.share) {
                                    navigator.share({ title: 'Wer bist du für andere?', text });
                                } else {
                                    navigator.clipboard.writeText(text).then(() => alert('Kopiert!'));
                                }
                            }}
                            className="flex-1 py-4 rounded-xl font-semibold transition-all hover:translate-y-[-2px]"
                            style={{
                                background: `linear-gradient(135deg, ${colors.goldPrimary} 0%, ${colors.goldDark} 100%)`,
                                color: colors.textDark,
                                boxShadow: '0 6px 25px rgba(210, 169, 90, 0.35)'
                            }}
                        >
                            Teilen
                        </button>
                        <button
                            onClick={() => {
                                setStage('intro');
                                setCurrentQ(0);
                                setScores({ stability: 0, fire: 0, truth: 0, harbor: 0, compass: 0, bridge: 0 });
                                setCollectedMarkers([]);
                            }}
                            className="px-6 py-4 rounded-xl font-medium transition-colors"
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(210, 169, 90, 0.4)',
                                color: colors.cream
                            }}
                        >
                            Nochmal
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
