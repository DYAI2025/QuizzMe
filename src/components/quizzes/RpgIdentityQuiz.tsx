'use client'

import React, { useState } from 'react';
import { quizData, profileNames } from './rpg-identity/data';

// Modern Alchemy colors - Dark theme
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
    d1: number;
    d2: number;
    d3: number;
};

// Sword icon for intro
const SwordIcon = () => (
    <svg viewBox="0 0 120 120" className="w-28 h-28">
        <circle cx="60" cy="60" r="50" stroke={colors.goldPrimary} strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.4" />
        <path d="M60 20 L65 65 L80 70 L65 75 L60 100 L55 75 L40 70 L55 65 Z"
            stroke={colors.goldPrimary} strokeWidth="1.5" fill={colors.goldPrimary} fillOpacity="0.1" />
        <circle cx="60" cy="60" r="6" fill={colors.goldPrimary} />
        <line x1="35" y1="35" x2="85" y2="85" stroke={colors.goldPrimary} strokeWidth="0.5" opacity="0.3" />
        <line x1="85" y1="35" x2="35" y2="85" stroke={colors.goldPrimary} strokeWidth="0.5" opacity="0.3" />
    </svg>
);

export function RpgIdentityQuiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [scores, setScores] = useState<Scores>({ d1: 0, d2: 0, d3: 0 });
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState<typeof quizData.profiles[0] | null>(null);
    const [started, setStarted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const calculateResult = (finalScores: Scores) => {
        const d1 = finalScores.d1;
        const d2 = finalScores.d2;
        const d3 = finalScores.d3;

        const maxD1 = 60, maxD2 = 60, maxD3 = 60;
        const d1Pct = d1 / maxD1;
        const d2Pct = d2 / maxD2;
        const d3Pct = d3 / maxD3;

        if (d1Pct > 0.6 && d3Pct > 0.6 && d2Pct > 0.5) return quizData.profiles.find(p => p.id === 'paladin');
        if (d1Pct < 0.4 && d2Pct < 0.4 && d3Pct < 0.4) return quizData.profiles.find(p => p.id === 'nekromant');
        if (d1Pct < 0.5 && d2Pct > 0.6) return quizData.profiles.find(p => p.id === 'heiler');
        if (d1Pct > 0.65 && d2Pct < 0.4) return quizData.profiles.find(p => p.id === 'berserker');
        if (d3Pct > 0.65 && d1Pct < 0.5) return quizData.profiles.find(p => p.id === 'stratege');
        if (d3Pct < 0.45 && d1Pct < 0.5) return quizData.profiles.find(p => p.id === 'seher');

        if (d1Pct >= 0.5) {
            return d2Pct >= 0.5 ? quizData.profiles.find(p => p.id === 'paladin') : quizData.profiles.find(p => p.id === 'berserker');
        } else {
            return d2Pct >= 0.5 ? quizData.profiles.find(p => p.id === 'heiler') : quizData.profiles.find(p => p.id === 'seher');
        }
    };

    const handleAnswer = (option: any) => {
        setIsAnimating(true);
        setTimeout(() => {
            const newScores = {
                d1: scores.d1 + (option.scores.d1 || 0),
                d2: scores.d2 + (option.scores.d2 || 0),
                d3: scores.d3 + (option.scores.d3 || 0)
            };
            setScores(newScores);

            if (currentQuestion < quizData.questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setIsAnimating(false);
            } else {
                const finalResult = calculateResult(newScores);
                // @ts-ignore
                setResult(finalResult || quizData.profiles[0]);
                setShowResult(true);
                setIsAnimating(false);
            }
        }, 200);
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setScores({ d1: 0, d2: 0, d3: 0 });
        setShowResult(false);
        setResult(null);
        setStarted(false);
    };

    const progress = ((currentQuestion) / quizData.questions.length) * 100;

    // INTRO SCREEN
    if (!started) {
        return (
            <div
                className="min-h-[600px] flex items-center justify-center p-6 rounded-3xl"
                style={{
                    background: `linear-gradient(165deg, ${colors.bgEmerald} 0%, ${colors.bgPrimary} 50%, #031119 100%)`,
                    color: colors.textLight
                }}
            >
                <div className="max-w-lg w-full text-center">
                    <div className="flex justify-center mb-6">
                        <SwordIcon />
                    </div>

                    <h1
                        className="text-3xl font-serif font-semibold mb-3"
                        style={{ color: colors.goldPrimary }}
                    >
                        {quizData.meta.title}
                    </h1>

                    <p className="mb-8 text-lg" style={{ color: colors.sage }}>
                        {quizData.meta.subtitle}
                    </p>

                    <div
                        className="rounded-xl p-6 mb-8"
                        style={{
                            background: 'rgba(210, 169, 90, 0.08)',
                            border: `1px solid rgba(210, 169, 90, 0.2)`
                        }}
                    >
                        <div className="flex justify-around text-sm" style={{ color: colors.goldDark }}>
                            <div className="text-center">
                                <div className="text-2xl mb-1 font-serif" style={{ color: colors.goldPrimary }}>12</div>
                                <div>Fragen</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl mb-1 font-serif" style={{ color: colors.goldPrimary }}>~3</div>
                                <div>Minuten</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl mb-1 font-serif" style={{ color: colors.goldPrimary }}>6</div>
                                <div>Klassen</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setStarted(true)}
                        className="w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all hover:translate-y-[-2px]"
                        style={{
                            background: `linear-gradient(135deg, ${colors.goldPrimary} 0%, ${colors.goldDark} 100%)`,
                            color: colors.textDark,
                            boxShadow: '0 4px 20px rgba(210, 169, 90, 0.25)'
                        }}
                    >
                        Beginne deine Reise
                    </button>

                    <p className="text-xs mt-6" style={{ color: colors.teal }}>
                        {quizData.meta.disclaimer}
                    </p>
                </div>
            </div>
        );
    }

    // RESULT SCREEN
    if (showResult && result) {
        return (
            <div
                className="min-h-[600px] rounded-3xl overflow-hidden p-6"
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
                            <div className="text-sm mb-2" style={{ color: colors.teal }}>
                                Deine Rollenspiel-Seele ist...
                            </div>
                            <h1
                                className="text-2xl font-serif font-bold mb-2"
                                style={{ color: colors.textDark }}
                            >
                                {result.title}
                            </h1>
                            <p className="italic text-sm font-serif" style={{ color: colors.teal }}>
                                „{result.tagline}"
                            </p>
                        </div>

                        <div className="p-6 space-y-5 max-h-[500px] overflow-y-auto">
                            <p
                                className="text-sm leading-relaxed whitespace-pre-line"
                                style={{ color: colors.textDark, opacity: 0.85 }}
                            >
                                {result.description}
                            </p>

                            {/* Stats */}
                            <div
                                className="rounded-xl p-4"
                                style={{
                                    background: 'rgba(28, 91, 92, 0.08)',
                                    border: '1px solid rgba(28, 91, 92, 0.15)'
                                }}
                            >
                                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: colors.teal }}>
                                    Deine Stats
                                </h3>
                                <div className="space-y-2">
                                    {result.stats.map((stat, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span style={{ color: colors.textDark, opacity: 0.7 }}>{stat.label}</span>
                                            <span className="font-mono" style={{ color: colors.goldDark }}>{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Compatibility */}
                            <div className="grid grid-cols-2 gap-3">
                                <div
                                    className="rounded-xl p-4"
                                    style={{
                                        background: 'rgba(108, 161, 146, 0.12)',
                                        border: '1px solid rgba(108, 161, 146, 0.25)'
                                    }}
                                >
                                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.sage }}>
                                        ⚔️ Allies
                                    </h3>
                                    <div className="space-y-1">
                                        {result.compatibility.allies.map(id => (
                                            <div key={id} className="text-sm" style={{ color: colors.textDark }}>
                                                {/* @ts-ignore */}
                                                {profileNames[id]}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div
                                    className="rounded-xl p-4"
                                    style={{
                                        background: 'rgba(167, 125, 56, 0.1)',
                                        border: '1px solid rgba(167, 125, 56, 0.25)'
                                    }}
                                >
                                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.goldDark }}>
                                        💀 Nemesis
                                    </h3>
                                    <div className="space-y-1">
                                        {result.compatibility.nemesis.map(id => (
                                            <div key={id} className="text-sm" style={{ color: colors.textDark }}>
                                                {/* @ts-ignore */}
                                                {profileNames[id]}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 space-y-3">
                        <button
                            onClick={() => {
                                const text = result.share_text;
                                if (navigator.share) {
                                    navigator.share({ title: 'RPG Identity', text });
                                } else {
                                    navigator.clipboard.writeText(text).then(() => alert('Kopiert!'));
                                }
                            }}
                            className="w-full py-4 rounded-xl font-semibold transition-all hover:translate-y-[-2px]"
                            style={{
                                background: `linear-gradient(135deg, ${colors.goldPrimary} 0%, ${colors.goldDark} 100%)`,
                                color: colors.textDark,
                                boxShadow: '0 6px 25px rgba(210, 169, 90, 0.35)'
                            }}
                        >
                            Ergebnis teilen
                        </button>

                        <button
                            onClick={resetQuiz}
                            className="w-full py-3 rounded-xl transition-all"
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(210, 169, 90, 0.4)',
                                color: colors.cream
                            }}
                        >
                            Erneut spielen
                        </button>
                    </div>

                    <p className="text-xs text-center mt-4" style={{ color: colors.teal, opacity: 0.7 }}>
                        {quizData.meta.disclaimer}
                    </p>
                </div>
            </div>
        );
    }

    // QUIZ SCREEN
    const question = quizData.questions[currentQuestion];

    return (
        <div
            className="min-h-[600px] p-6 rounded-3xl"
            style={{
                background: `linear-gradient(165deg, ${colors.bgEmerald} 0%, ${colors.bgPrimary} 50%, #031119 100%)`,
                color: colors.textLight
            }}
        >
            <div className="max-w-lg mx-auto">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between text-xs mb-2" style={{ color: colors.goldDark }}>
                        <span>Frage {currentQuestion + 1} von {quizData.questions.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div
                        className="h-1 rounded-full overflow-hidden"
                        style={{ background: 'rgba(210, 169, 90, 0.2)' }}
                    >
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${progress}%`,
                                background: `linear-gradient(90deg, ${colors.goldDark} 0%, ${colors.goldPrimary} 100%)`,
                                boxShadow: '0 0 8px rgba(210, 169, 90, 0.4)'
                            }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div
                    className={`rounded-2xl p-6 transition-opacity duration-200 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}
                    style={{
                        background: colors.cream,
                        border: `1px solid ${colors.goldPrimary}`,
                        boxShadow: '0 4px 40px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    {question.narrative && (
                        <p
                            className="text-sm italic mb-4 pb-4 font-serif"
                            style={{
                                color: colors.teal,
                                borderBottom: `1px solid rgba(28, 91, 92, 0.2)`
                            }}
                        >
                            {question.narrative}
                        </p>
                    )}

                    <h2
                        className="text-xl font-serif font-semibold mb-6"
                        style={{ color: colors.textDark }}
                    >
                        {question.text}
                    </h2>

                    <div className="space-y-3">
                        {question.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleAnswer(option)}
                                className="w-full text-left p-4 rounded-xl transition-all duration-200 hover:translate-y-[-1px]"
                                style={{
                                    background: 'rgba(247, 240, 230, 0.6)',
                                    border: '1px solid rgba(167, 125, 56, 0.3)',
                                    color: colors.textDark
                                }}
                            >
                                <span className="text-sm">{option.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
