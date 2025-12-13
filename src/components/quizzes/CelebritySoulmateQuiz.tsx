'use client'

import React, { useState, useEffect } from 'react';
import { celebrities, Celebrity } from './celebrity-soulmate/data';

// Modern Alchemy color tokens
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

const questions = [
    {
        scenario: "Du betrittst eine Party, auf der du kaum jemanden kennst...",
        question: "Was ist dein erster Instinkt?",
        options: [
            { text: "Die Tanzfläche gehört mir in 10 Minuten", emoji: "💃", scores: { E: 2, K: 1, B: 0, A: 1 } },
            { text: "Erstmal strategisch umschauen, dann gezielt connecten", emoji: "👀", scores: { E: 0, K: 1, B: 1, A: 1 } },
            { text: "Die eine interessante Person finden und deep talken", emoji: "🎯", scores: { E: -1, K: 0, B: 2, A: 0 } },
            { text: "Kurz zeigen, dann Irish Exit", emoji: "🚪", scores: { E: -2, K: 0, B: 0, A: 0 } }
        ]
    },
    {
        scenario: "Ein Freund erzählt von seinem wilden Startup-Plan...",
        question: "Deine ehrliche Reaktion?",
        options: [
            { text: "Ich bin dabei – wann starten wir?", emoji: "🚀", scores: { E: 1, K: 2, B: 1, A: 2 } },
            { text: "Spannend! Hier sind 5 Dinge, die du bedenken solltest", emoji: "📋", scores: { E: 0, K: 1, B: 1, A: 1 } },
            { text: "Ich unterstütze emotional, aber mein Geld bleibt sicher", emoji: "🤗", scores: { E: 0, K: 0, B: 2, A: 0 } },
            { text: "Interessant... *recherchiert heimlich ob die Idee gut ist*", emoji: "🔍", scores: { E: -1, K: 1, B: 0, A: 1 } }
        ]
    },
    {
        scenario: "Du hast einen freien Tag komplett für dich allein...",
        question: "Wie verbringst du ihn idealerweise?",
        options: [
            { text: "Kreativprojekt – malen, schreiben, Musik machen", emoji: "🎨", scores: { E: 0, K: 2, B: 0, A: 0 } },
            { text: "Wellness, Couch, meine Lieblingsserien", emoji: "🛋️", scores: { E: -1, K: 0, B: 1, A: -1 } },
            { text: "Spontan was Neues ausprobieren – Kochkurs, Wandern?", emoji: "🌄", scores: { E: 1, K: 1, B: 0, A: 1 } },
            { text: "Deep Work an meinen Zielen", emoji: "💻", scores: { E: -1, K: 1, B: -1, A: 2 } }
        ]
    },
    {
        scenario: "Jemand kritisiert öffentlich deine Arbeit...",
        question: "Wie gehst du damit um?",
        options: [
            { text: "Öffentlich und eloquent kontern", emoji: "⚔️", scores: { E: 2, K: 1, B: -1, A: 1 } },
            { text: "Analysieren – ist da was dran? Dann verbessern", emoji: "🔬", scores: { E: 0, K: 1, B: 0, A: 1 } },
            { text: "Mit Vertrauten besprechen, dann Perspektive gewinnen", emoji: "💭", scores: { E: -1, K: 0, B: 2, A: 0 } },
            { text: "Ignorieren – wer nicht mein Fan ist, interessiert mich nicht", emoji: "🙄", scores: { E: 0, K: 0, B: -1, A: 1 } }
        ]
    },
    {
        scenario: "Du könntest eine Superkraft haben...",
        question: "Welche wählst du?",
        options: [
            { text: "Gedanken lesen – endlich echtes Verstehen", emoji: "🧠", scores: { E: 0, K: 1, B: 2, A: 0 } },
            { text: "Zeitreisen – Fehler korrigieren, Chancen nutzen", emoji: "⏰", scores: { E: 0, K: 2, B: 0, A: 2 } },
            { text: "Unsichtbarkeit – beobachten ohne beurteilt zu werden", emoji: "👻", scores: { E: -2, K: 1, B: 0, A: 0 } },
            { text: "Fliegen – Freiheit und Perspektivwechsel", emoji: "🦅", scores: { E: 1, K: 1, B: 0, A: 1 } }
        ]
    },
    {
        scenario: "Bei einem Gruppenprojekt läuft es chaotisch...",
        question: "Welche Rolle übernimmst du automatisch?",
        options: [
            { text: "Ich strukturiere das jetzt – jemand muss ja", emoji: "📊", scores: { E: 1, K: 0, B: 1, A: 2 } },
            { text: "Vermitteln zwischen den Streithähnen", emoji: "🕊️", scores: { E: 0, K: 0, B: 2, A: 0 } },
            { text: "Die kreativen Ideen einbringen, Organisation ist für andere", emoji: "💡", scores: { E: 0, K: 2, B: 0, A: 0 } },
            { text: "Meinen Teil abliefern und hoffen, dass es passt", emoji: "✅", scores: { E: -1, K: 0, B: 0, A: 1 } }
        ]
    },
    {
        scenario: "Dein Social-Media-Stil ist am ehesten...",
        question: "Wie zeigst du dich online?",
        options: [
            { text: "Kuratiert ästhetisch – mein Feed ist Kunst", emoji: "🖼️", scores: { E: 1, K: 2, B: 0, A: 1 } },
            { text: "Authentisch chaotisch – Stories > Posts", emoji: "📱", scores: { E: 1, K: 0, B: 1, A: 0 } },
            { text: "Strategische Präsenz für meine Ziele", emoji: "📈", scores: { E: 0, K: 1, B: 0, A: 2 } },
            { text: "Minimal bis gar nicht – mein echtes Leben ist privat", emoji: "🔒", scores: { E: -2, K: 0, B: 1, A: 0 } }
        ]
    },
    {
        scenario: "Du hast unerwartet 10.000€ gewonnen...",
        question: "Was passiert damit?",
        options: [
            { text: "Investieren – das Geld soll für mich arbeiten", emoji: "💰", scores: { E: 0, K: 1, B: 0, A: 2 } },
            { text: "Epic Trip mit meinen Liebsten", emoji: "✈️", scores: { E: 1, K: 0, B: 2, A: 0 } },
            { text: "Ein verrücktes Projekt finanzieren, das mir am Herzen liegt", emoji: "🎪", scores: { E: 0, K: 2, B: 1, A: 1 } },
            { text: "Sicherheit aufbauen – Notgroschen aufstocken", emoji: "🏦", scores: { E: -1, K: 0, B: 0, A: 1 } }
        ]
    },
    {
        scenario: "In einer Beziehung ist dir am wichtigsten...",
        question: "Was ist non-negotiable?",
        options: [
            { text: "Intellektuelle Tiefe – endlose Gespräche um 3 Uhr nachts", emoji: "🌙", scores: { E: 0, K: 2, B: 1, A: 0 } },
            { text: "Loyalität – durch dick und dünn", emoji: "🤝", scores: { E: 0, K: 0, B: 2, A: 0 } },
            { text: "Gemeinsame Ambitionen – wir pushen uns gegenseitig", emoji: "🏆", scores: { E: 1, K: 1, B: 0, A: 2 } },
            { text: "Freiheit – Liebe ohne Käfig", emoji: "🦋", scores: { E: 1, K: 1, B: 0, A: 0 } }
        ]
    },
    {
        scenario: "Jemand verwechselt deinen Namen auf einer Bühne...",
        question: "Wie reagierst du?",
        options: [
            { text: "Charmant korrigieren und den Moment besitzen", emoji: "😎", scores: { E: 2, K: 1, B: 0, A: 1 } },
            { text: "Später ansprechen – nicht hier peinlich machen", emoji: "⏳", scores: { E: -1, K: 0, B: 1, A: 0 } },
            { text: "Drüber lachen und weitermachen", emoji: "😂", scores: { E: 1, K: 0, B: 1, A: 0 } },
            { text: "Inner cringe, aber smooth wechseln", emoji: "😬", scores: { E: 1, K: 1, B: 0, A: 0 } }
        ]
    },
    {
        scenario: "Du hast eine kontroverse Meinung...",
        question: "Wie gehst du damit um?",
        options: [
            { text: "Laut und stolz vertreten – authentisch bleiben", emoji: "📢", scores: { E: 2, K: 1, B: -1, A: 0 } },
            { text: "Nur mit engen Freunden teilen", emoji: "🤫", scores: { E: -1, K: 0, B: 1, A: 0 } },
            { text: "Diplomatisch verpacken, aber aussprechen", emoji: "🎁", scores: { E: 1, K: 0, B: 1, A: 1 } },
            { text: "Für mich behalten – nicht jeder muss alles wissen", emoji: "🔒", scores: { E: -2, K: 0, B: 0, A: 1 } }
        ]
    },
    {
        scenario: "Eine riesige Chance kommt, aber das Timing ist schlecht...",
        question: "Was tust du?",
        options: [
            { text: "Zugreifen – solche Chancen kommen nicht oft", emoji: "⚡", scores: { E: 1, K: 1, B: -1, A: 2 } },
            { text: "Ablehnen – die bestehenden Commitments zählen", emoji: "🤝", scores: { E: -1, K: 0, B: 2, A: 0 } },
            { text: "Verhandeln – vielleicht geht beides", emoji: "🎭", scores: { E: 1, K: 1, B: 0, A: 1 } },
            { text: "Rat holen bei Menschen, denen ich vertraue", emoji: "💬", scores: { E: 0, K: 0, B: 2, A: 0 } }
        ]
    }
];

const microWins = [
    { emoji: "✨", text: "Interessant..." },
    { emoji: "🔮", text: "Spannende Wahl" },
    { emoji: "💫", text: "Das sagt viel aus" },
    { emoji: "🌟", text: "Typisch du?" },
    { emoji: "⚡", text: "Erkennbar" },
    { emoji: "🎯", text: "Punkt für dich" },
    { emoji: "🌙", text: "Tief" },
    { emoji: "🔥", text: "Hot take" },
    { emoji: "💎", text: "Rar" },
    { emoji: "🎭", text: "Facettenreich" },
    { emoji: "🌈", text: "Bunt" },
    { emoji: "⭐", text: "Fast da..." }
];

// Star Icon SVG for intro
const StarBurstIcon = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="60" cy="60" r="50" stroke={colors.goldPrimary} strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.4" />
        <circle cx="60" cy="60" r="40" stroke={colors.goldPrimary} strokeWidth="1.5" fill="none" opacity="0.2" />
        <path d="M60 15 L62 40 L75 20 L65 42 L85 35 L68 48 L95 50 L70 55 L95 70 L68 62 L85 85 L65 68 L75 100 L62 70 L60 105 L58 70 L45 100 L55 68 L35 85 L52 62 L25 70 L50 55 L25 50 L52 48 L35 35 L55 42 L45 20 L58 40 Z"
            stroke={colors.goldPrimary} strokeWidth="1" fill="none" opacity="0.6" />
        <circle cx="60" cy="60" r="8" fill={colors.goldPrimary} opacity="0.3" />
        <circle cx="60" cy="60" r="4" fill={colors.goldPrimary} />
        <circle cx="30" cy="35" r="2" fill={colors.goldPrimary} opacity="0.6" />
        <circle cx="90" cy="40" r="1.5" fill={colors.goldPrimary} opacity="0.5" />
        <circle cx="85" cy="85" r="2" fill={colors.goldPrimary} opacity="0.4" />
        <circle cx="35" cy="90" r="1.5" fill={colors.goldPrimary} opacity="0.5" />
    </svg>
);

// Loading spinner SVG
const LoadingSpinner = () => (
    <svg viewBox="0 0 80 80" className="w-20 h-20 animate-spin" style={{ animationDuration: '3s' }}>
        <circle cx="40" cy="40" r="35" stroke={colors.goldPrimary} strokeWidth="1.5" fill="none" strokeDasharray="8 4" opacity="0.4" />
        <polygon points="40,10 65,55 15,55" stroke={colors.goldPrimary} strokeWidth="1" fill="none" />
        <polygon points="40,70 65,25 15,25" stroke={colors.goldPrimary} strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="40" cy="40" r="6" fill={colors.goldPrimary} opacity="0.4" />
        <circle cx="40" cy="40" r="3" fill={colors.goldPrimary} />
    </svg>
);

export function CelebritySoulmateQuiz() {
    const [stage, setStage] = useState<'intro' | 'quiz' | 'loading' | 'result'>('intro');
    const [currentQ, setCurrentQ] = useState(0);
    const [scores, setScores] = useState({ E: 5, K: 5, B: 5, A: 5 });
    const [isAnimating, setIsAnimating] = useState(false);
    const [showMicroWin, setShowMicroWin] = useState<{ emoji: string; text: string } | null>(null);
    const [result, setResult] = useState<{
        match: Celebrity & { matchPercent: number },
        runnerUps: (Celebrity & { matchPercent: number })[],
        ally: Celebrity,
        rival: Celebrity
    } | null>(null);

    const startQuiz = () => {
        setCurrentQ(0);
        setScores({ E: 5, K: 5, B: 5, A: 5 });
        setStage('quiz');
    };

    const handleAnswer = (optionScores: { E: number, K: number, B: number, A: number }) => {
        // Show micro win
        const win = microWins[currentQ % microWins.length];
        setShowMicroWin(win);

        setTimeout(() => {
            setShowMicroWin(null);
            setIsAnimating(true);

            const newScores = { ...scores };
            newScores.E = Math.max(1, Math.min(10, newScores.E + optionScores.E));
            newScores.K = Math.max(1, Math.min(10, newScores.K + optionScores.K));
            newScores.B = Math.max(1, Math.min(10, newScores.B + optionScores.B));
            newScores.A = Math.max(1, Math.min(10, newScores.A + optionScores.A));
            setScores(newScores);

            setTimeout(() => {
                if (currentQ < questions.length - 1) {
                    setCurrentQ(currentQ + 1);
                    setIsAnimating(false);
                } else {
                    calculateResult(newScores);
                }
            }, 200);
        }, 600);
    };

    const calculateResult = (finalScores: typeof scores) => {
        setStage('loading');
        setTimeout(() => {
            const matches = celebrities.map(celeb => {
                const distance = Math.sqrt(
                    Math.pow(finalScores.E - celeb.E, 2) +
                    Math.pow(finalScores.K - celeb.K, 2) +
                    Math.pow(finalScores.B - celeb.B, 2) +
                    Math.pow(finalScores.A - celeb.A, 2)
                );
                const matchPercent = Math.round(Math.max(0, 100 - (distance * 5.5)));
                return { ...celeb, distance, matchPercent };
            });

            matches.sort((a, b) => a.distance - b.distance);

            const topMatch = matches[0];
            const runnerUps = matches.slice(1, 4);

            const ally = matches.find(c => c.name !== topMatch.name && Math.abs(c.E - topMatch.E) <= 2 && c.category !== topMatch.category) || matches[2];
            const rival = matches.filter(c => c.name !== topMatch.name && (Math.abs(c.E - topMatch.E) >= 3 || Math.abs(c.A - topMatch.A) >= 3))[0] || matches[matches.length - 5];

            setResult({ match: topMatch, runnerUps, ally, rival });
            setStage('result');
            setIsAnimating(false);
        }, 2500);
    };

    const generateDescription = (match: Celebrity) => {
        const parts = [];
        parts.push(match.E >= 7 ? "Du teilst ihre Fähigkeit, Räume zu füllen und Energie zu verbreiten" : match.E <= 4 ? "Wie du weiß auch " + match.name + ", dass wahre Stärke in der Stille liegt" : "Ihr teilt die Gabe, Energie dosiert und strategisch einzusetzen");
        parts.push(match.K >= 7 ? "Eure Köpfe arbeiten ähnlich – unkonventionell, überraschend, manchmal genial" : match.K <= 4 ? "Ihr beide schätzt das Bewährte und baut darauf auf" : "Kreativität ist für euch beide ein Werkzeug, kein Selbstzweck");
        parts.push(match.B >= 7 ? "Menschen sind für euch beide keine Ressourcen, sondern der eigentliche Punkt" : match.B <= 4 ? "Ihr braucht beide viel Freiraum und wählt eure Menschen sehr bewusst" : "Eure sozialen Batterien funktionieren ähnlich – selektiv, aber loyal");
        parts.push(match.A >= 7 ? "Ihr teilt den unbedingten Willen, Ergebnisse zu sehen" : match.A <= 4 ? "Für euch beide zählt der Weg mindestens so sehr wie das Ziel" : "Ambition ja, aber nicht um jeden Preis – das verbindet euch");
        return parts.join(". ") + ".";
    };

    // Micro Win Popup
    const MicroWinPopup = () => {
        if (!showMicroWin) return null;
        return (
            <div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-full animate-pulse"
                style={{
                    background: colors.cream,
                    border: `1px solid ${colors.goldPrimary}`,
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                    color: colors.textDark,
                    fontWeight: 500
                }}
            >
                <span className="text-xl">{showMicroWin.emoji}</span>
                <span>{showMicroWin.text}</span>
            </div>
        );
    };

    // INTRO SCREEN
    if (stage === 'intro') {
        return (
            <div
                className="min-h-[600px] flex flex-col items-center justify-center p-8 relative overflow-hidden"
                style={{
                    background: `linear-gradient(165deg, ${colors.bgEmerald} 0%, ${colors.bgPrimary} 50%, #031119 100%)`,
                    color: colors.textLight
                }}
            >
                {/* Star background pattern */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `
              radial-gradient(1px 1px at 20% 30%, rgba(210, 169, 90, 0.3) 0%, transparent 100%),
              radial-gradient(1px 1px at 40% 70%, rgba(210, 169, 90, 0.2) 0%, transparent 100%),
              radial-gradient(1px 1px at 60% 20%, rgba(210, 169, 90, 0.25) 0%, transparent 100%),
              radial-gradient(1px 1px at 80% 60%, rgba(210, 169, 90, 0.15) 0%, transparent 100%)
            `
                    }}
                />

                <div className="text-center relative z-10 max-w-md">
                    <div className="w-32 h-32 mx-auto mb-6">
                        <StarBurstIcon />
                    </div>

                    <h1
                        className="text-4xl font-serif font-semibold mb-3 leading-tight"
                        style={{ color: colors.cream }}
                    >
                        Welcher Star ist dein Seelenverwandter?
                    </h1>

                    <p
                        className="text-lg mb-2 leading-relaxed"
                        style={{ color: colors.sage }}
                    >
                        Finde heraus, welcher Celebrity deine Energie teilt – wissenschaftlich fundiert, überraschend ehrlich.
                    </p>

                    <div
                        className="flex justify-center gap-6 text-sm mb-8"
                        style={{ color: colors.goldDark }}
                    >
                        <span className="flex items-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                            </svg>
                            ~3 Min
                        </span>
                        <span className="flex items-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 12l2 2 4-4" />
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                            12 Fragen
                        </span>
                    </div>

                    <button
                        onClick={startQuiz}
                        className="px-10 py-4 rounded-lg font-semibold transition-all hover:translate-y-[-2px]"
                        style={{
                            background: `linear-gradient(135deg, ${colors.goldPrimary} 0%, ${colors.goldDark} 100%)`,
                            color: colors.textDark,
                            boxShadow: '0 4px 20px rgba(210, 169, 90, 0.25)'
                        }}
                    >
                        Quiz starten
                    </button>

                    <p
                        className="text-xs mt-8 leading-relaxed opacity-80"
                        style={{ color: colors.teal }}
                    >
                        Dieser Test dient der spielerischen Selbstreflexion und stellt <strong>keine</strong> psychologische Diagnose dar.
                    </p>
                </div>
            </div>
        );
    }

    // LOADING SCREEN
    if (stage === 'loading') {
        return (
            <div
                className="min-h-[600px] flex flex-col items-center justify-center p-8"
                style={{
                    background: `linear-gradient(165deg, ${colors.bgEmerald} 0%, ${colors.bgPrimary} 50%, #031119 100%)`,
                    color: colors.textLight
                }}
            >
                <LoadingSpinner />
                <p
                    className="text-xl font-serif mt-6 mb-2"
                    style={{ color: colors.cream }}
                >
                    Analysiere deine Sternenkonstellationen...
                </p>
                <p style={{ color: colors.sage }} className="text-sm">
                    Dein Celebrity-Match wird berechnet
                </p>
            </div>
        );
    }

    // QUIZ SCREEN
    if (stage === 'quiz') {
        const q = questions[currentQ];
        const progress = ((currentQ) / questions.length) * 100;

        return (
            <div
                className="min-h-[600px] flex flex-col p-6"
                style={{
                    background: `linear-gradient(165deg, ${colors.bgEmerald} 0%, ${colors.bgPrimary} 50%, #031119 100%)`,
                    color: colors.textLight
                }}
            >
                <MicroWinPopup />

                {/* Quiz Card */}
                <div
                    className={`flex-1 rounded-2xl p-6 md:p-8 max-w-xl mx-auto w-full transition-opacity duration-200 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}
                    style={{
                        background: colors.cream,
                        border: `1px solid ${colors.goldPrimary}`,
                        boxShadow: '0 4px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                    }}
                >
                    {/* Progress */}
                    <div className="mb-6">
                        <div
                            className="flex justify-between text-xs mb-2 font-medium"
                            style={{ color: colors.teal }}
                        >
                            <span>Frage {currentQ + 1} von {questions.length}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div
                            className="h-1 rounded-full overflow-hidden"
                            style={{ background: 'rgba(28, 91, 92, 0.2)' }}
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

                    {/* Question */}
                    <p
                        className="text-sm italic mb-3 font-serif"
                        style={{ color: colors.teal }}
                    >
                        {q.scenario}
                    </p>
                    <h2
                        className="text-2xl font-serif font-semibold mb-6 leading-tight"
                        style={{ color: colors.textDark }}
                    >
                        {q.question}
                    </h2>

                    {/* Options */}
                    <div className="space-y-3">
                        {q.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(opt.scores)}
                                className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all hover:translate-y-[-1px] group"
                                style={{
                                    background: 'rgba(247, 240, 230, 0.6)',
                                    border: '1px solid rgba(167, 125, 56, 0.3)',
                                    color: colors.textDark
                                }}
                            >
                                <span
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-lg flex-shrink-0 group-hover:scale-110 transition-transform"
                                    style={{ background: 'rgba(210, 169, 90, 0.1)' }}
                                >
                                    {opt.emoji}
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
                className="min-h-[600px] p-6 overflow-y-auto"
                style={{
                    background: `linear-gradient(165deg, ${colors.bgEmerald} 0%, ${colors.bgPrimary} 50%, #031119 100%)`,
                    color: colors.textLight
                }}
            >
                {/* Result Card */}
                <div
                    className="max-w-lg mx-auto rounded-2xl p-6 md:p-8 mb-6"
                    style={{
                        background: colors.cream,
                        border: `1px solid ${colors.goldPrimary}`,
                        boxShadow: '0 8px 50px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                    }}
                >
                    <p
                        className="text-xs uppercase tracking-widest text-center mb-2 font-medium"
                        style={{ color: colors.teal }}
                    >
                        Dein Seelenverwandter
                    </p>

                    <h1
                        className="text-3xl font-serif font-bold text-center mb-1"
                        style={{ color: colors.textDark }}
                    >
                        {result.match.name}
                    </h1>

                    <p
                        className="text-center italic mb-5 font-serif"
                        style={{ color: colors.teal }}
                    >
                        „{result.match.tagline}"
                    </p>

                    {/* Match Percentage */}
                    <div className="flex justify-center mb-5">
                        <span
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold"
                            style={{
                                background: `linear-gradient(135deg, ${colors.goldPrimary} 0%, ${colors.goldDark} 100%)`,
                                color: colors.textDark
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            {result.match.matchPercent}% Match
                        </span>
                    </div>

                    <p
                        className="text-sm leading-relaxed mb-5 text-left"
                        style={{ color: colors.textDark, opacity: 0.9 }}
                    >
                        {generateDescription(result.match)}
                    </p>

                    {/* Traits Grid */}
                    <div className="mb-5">
                        <h3
                            className="text-xs uppercase tracking-wider font-semibold mb-3 font-serif"
                            style={{ color: colors.teal }}
                        >
                            Gemeinsame Eigenschaften
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {result.match.traits.map((t, i) => (
                                <div
                                    key={i}
                                    className="p-3 rounded-lg text-left"
                                    style={{
                                        background: 'rgba(28, 91, 92, 0.08)',
                                        border: '1px solid rgba(28, 91, 92, 0.15)'
                                    }}
                                >
                                    <div className="text-xs uppercase tracking-wider mb-1" style={{ color: colors.teal }}>Trait</div>
                                    <div className="text-sm font-medium" style={{ color: colors.textDark }}>{t}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Compatibility */}
                    <div className="mb-5">
                        <h3
                            className="text-xs uppercase tracking-wider font-semibold mb-3 font-serif"
                            style={{ color: colors.teal }}
                        >
                            Deine Kompatibilität
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                className="p-4 rounded-lg"
                                style={{
                                    background: 'rgba(108, 161, 146, 0.15)',
                                    border: '1px solid rgba(108, 161, 146, 0.3)'
                                }}
                            >
                                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: colors.sage }}>Dein Ally</p>
                                <p className="font-serif font-semibold" style={{ color: colors.textDark }}>{result.ally.name}</p>
                            </div>
                            <div
                                className="p-4 rounded-lg"
                                style={{
                                    background: 'rgba(167, 125, 56, 0.1)',
                                    border: '1px solid rgba(167, 125, 56, 0.25)'
                                }}
                            >
                                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: colors.goldDark }}>Gegenspieler</p>
                                <p className="font-serif font-semibold" style={{ color: colors.textDark }}>{result.rival.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Runner Ups */}
                    <div className="mb-5">
                        <h3
                            className="text-xs uppercase tracking-wider font-semibold mb-3 font-serif"
                            style={{ color: colors.teal }}
                        >
                            Weitere Matches
                        </h3>
                        <div className="space-y-2">
                            {result.runnerUps.map((r, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center px-4 py-3 rounded-lg"
                                    style={{
                                        background: 'rgba(28, 91, 92, 0.05)',
                                        border: '1px solid rgba(28, 91, 92, 0.1)'
                                    }}
                                >
                                    <span className="text-sm font-medium" style={{ color: colors.textDark }}>{r.name}</span>
                                    <span className="text-sm font-semibold" style={{ color: colors.teal }}>{r.matchPercent}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="max-w-lg mx-auto space-y-3">
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: 'Mein Celebrity-Seelenverwandter',
                                    text: `Mein Celebrity-Seelenverwandter ist ${result.match.name} (${result.match.matchPercent}% Match)!`,
                                    url: window.location.href
                                })
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all hover:translate-y-[-2px]"
                        style={{
                            background: `linear-gradient(135deg, ${colors.goldPrimary} 0%, ${colors.goldDark} 100%)`,
                            color: colors.textDark,
                            boxShadow: '0 6px 25px rgba(210, 169, 90, 0.35)'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
                        </svg>
                        Ergebnis teilen
                    </button>
                    <button
                        onClick={() => setStage('intro')}
                        className="w-full py-4 rounded-xl font-medium transition-all"
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(210, 169, 90, 0.4)',
                            color: colors.cream
                        }}
                    >
                        Nochmal spielen
                    </button>
                </div>

                <p
                    className="text-center text-xs mt-6 leading-relaxed opacity-70 max-w-lg mx-auto"
                    style={{ color: colors.teal }}
                >
                    Dieser Test dient der spielerischen Selbstreflexion und stellt keine psychologische Diagnose dar.
                </p>
            </div>
        );
    }

    return null;
}
