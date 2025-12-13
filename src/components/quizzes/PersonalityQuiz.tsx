'use client'

import React, { useState } from 'react';

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

const questions = [
    {
        id: "f1", text: "Wenn ich morgens aufwache, denke ich zuerst an das, was ICH heute brauche.",
        options: [
            { text: "Trifft gar nicht zu", scores: { focus: 100 } },
            { text: "Trifft eher nicht zu", scores: { focus: 66 } },
            { text: "Trifft eher zu", scores: { focus: 33 } },
            { text: "Trifft genau zu", scores: { focus: 0 } }
        ]
    },
    {
        id: "f2", text: "Ich bemerke schnell, wenn es jemandem in meiner Umgebung nicht gut geht.",
        options: [
            { text: "Trifft gar nicht zu", scores: { focus: 0 } },
            { text: "Trifft eher nicht zu", scores: { focus: 33 } },
            { text: "Trifft eher zu", scores: { focus: 66 } },
            { text: "Trifft genau zu", scores: { focus: 100 } }
        ]
    },
    {
        id: "f3", text: "In einer Gruppe achte ich vor allem auf...",
        options: [
            { text: "...wie ich wahrgenommen werde", scores: { focus: 0 } },
            { text: "...wie es den anderen geht", scores: { focus: 100 } }
        ]
    },
    {
        id: "r1", text: "Ich investiere regelmäßig Zeit in Dinge, die nur mir selbst nützen (Hobbys, Weiterbildung, Selbstpflege).",
        options: [
            { text: "Trifft gar nicht zu", scores: { resources: 100 } },
            { text: "Trifft eher nicht zu", scores: { resources: 66 } },
            { text: "Trifft eher zu", scores: { resources: 33 } },
            { text: "Trifft genau zu", scores: { resources: 0 } }
        ]
    },
    {
        id: "r2", text: "Wenn Freunde mich um Hilfe bitten, sage ich fast nie Nein – auch wenn es mich viel kostet.",
        options: [
            { text: "Trifft gar nicht zu", scores: { resources: 0 } },
            { text: "Trifft eher nicht zu", scores: { resources: 33 } },
            { text: "Trifft eher zu", scores: { resources: 66 } },
            { text: "Trifft genau zu", scores: { resources: 100 } }
        ]
    },
    {
        id: "r3", text: "Du hast unerwartet 500€ übrig. Was tust du eher?",
        options: [
            { text: "Etwas Schönes für mich kaufen", scores: { resources: 0 } },
            { text: "Anderen eine Freude machen oder spenden", scores: { resources: 100 } }
        ]
    },
    {
        id: "r4", text: "Mein Kalender ist voll mit Terminen für andere (Gefälligkeiten, Ehrenamt, Hilfe).",
        options: [
            { text: "Trifft gar nicht zu", scores: { resources: 0 } },
            { text: "Trifft eher nicht zu", scores: { resources: 33 } },
            { text: "Trifft eher zu", scores: { resources: 66 } },
            { text: "Trifft genau zu", scores: { resources: 100 } }
        ]
    },
    {
        id: "e1", text: "Wenn jemand vor mir weint, spüre ich körperlich einen Druck, zu helfen.",
        options: [
            { text: "Trifft gar nicht zu", scores: { empathy: 0 } },
            { text: "Trifft eher nicht zu", scores: { empathy: 33 } },
            { text: "Trifft eher zu", scores: { empathy: 66 } },
            { text: "Trifft genau zu", scores: { empathy: 100 } }
        ]
    },
    {
        id: "e2", text: "Ich kann gut abschalten, wenn die Probleme anderer mich nichts angehen.",
        options: [
            { text: "Trifft gar nicht zu", scores: { empathy: 100 } },
            { text: "Trifft eher nicht zu", scores: { empathy: 66 } },
            { text: "Trifft eher zu", scores: { empathy: 33 } },
            { text: "Trifft genau zu", scores: { empathy: 0 } }
        ]
    },
    {
        id: "e3", text: "Ein Obdachloser bittet dich um Geld. Dein erster Impuls:",
        options: [
            { text: "Weitergehen – ich kann nicht allen helfen", scores: { empathy: 0 } },
            { text: "Stehen bleiben – zumindest kurz schauen, was ich tun kann", scores: { empathy: 100 } }
        ]
    },
    {
        id: "e4", text: "Nachrichten über Leid in der Welt beschäftigen mich noch tagelang.",
        options: [
            { text: "Trifft gar nicht zu", scores: { empathy: 0 } },
            { text: "Trifft eher nicht zu", scores: { empathy: 33 } },
            { text: "Trifft eher zu", scores: { empathy: 66 } },
            { text: "Trifft genau zu", scores: { empathy: 100 } }
        ]
    },
    {
        id: "x1", text: "Stell dir vor: Du könntest entweder deine Traumkarriere verwirklichen ODER ein Projekt leiten, das vielen Menschen hilft. Was wählst du?",
        weight: 1.5,
        options: [
            { text: "Traumkarriere – ich muss zuerst bei mir sein", scores: { focus: 0, resources: 0 } },
            { text: "Das Projekt – mein Beitrag für andere zählt mehr", scores: { focus: 100, resources: 100 } }
        ]
    }
];

const profiles = [
    {
        id: "giver",
        title: "Der Weltverbesserer",
        subtitle: "Dein Kompass zeigt auf andere",
        symbol: "🌍",
        description: "Du lebst mit einem tiefen Bewusstsein für das Wohlergehen anderer. Empathie ist für dich keine Anstrengung, sondern dein natürlicher Modus.",
        strengths: ["Tiefe Empathie und emotionale Intelligenz", "Fähigkeit, Vertrauen aufzubauen", "Natürliche Führungskraft durch Fürsorge"],
        affirmation: "Ich darf mir selbst geben, was ich anderen so großzügig schenke.",
        match: (s: any) => s.focus >= 60 && s.resources >= 60 && s.empathy >= 55,
        priority: 1
    },
    {
        id: "selfkeeper",
        title: "Der Eigenständige",
        subtitle: "Du bist deine erste Priorität – und das ist gesund",
        symbol: "🏔️",
        description: "Du hast verstanden, was viele erst spät lernen: Man kann nur geben, was man hat. Deine Fähigkeit zur Selbstfürsorge ist emotionale Intelligenz.",
        strengths: ["Gesunde Grenzsetzung", "Emotionale Stabilität unter Druck", "Klare Prioritäten und Fokus"],
        affirmation: "Meine Stärke liegt darin, meine Schale zu füllen, um dann überfließen zu können.",
        match: (s: any) => s.focus <= 40 && s.resources <= 40 && s.empathy <= 45,
        priority: 1
    },
    {
        id: "balancer",
        title: "Der Ausgewogene",
        subtitle: "Die seltene Kunst der Balance",
        symbol: "⚖️",
        description: "Du hast das geschafft, woran viele scheitern: ein echtes Gleichgewicht zwischen Selbstfürsorge und Fürsorge für andere.",
        strengths: ["Nachhaltige Energie durch ausgewogenes Geben und Nehmen", "Gesunde Beziehungen ohne Abhängigkeit", "Flexibilität in beide Richtungen"],
        affirmation: "Ich vertraue meinem inneren Pendel, das immer wieder zur Mitte findet.",
        match: (s: any) => s.focus >= 40 && s.focus <= 60 && s.resources >= 40 && s.resources <= 60,
        priority: 0
    },
    {
        id: "strategist",
        title: "Der Strategische Geber",
        subtitle: "Du gibst klug – nicht blind",
        symbol: "🎯",
        description: "Du hilfst – aber mit Verstand. Deine Fürsorge für andere ist durchdacht: Du fragst dich, wo dein Beitrag den größten Unterschied macht.",
        strengths: ["Hohe Wirksamkeit bei Hilfeleistungen", "Gute Ressourcen-Allokation", "Verbindet Kopf und Herz"],
        affirmation: "Mein Geben ist ein bewusster Akt der Gestaltung, nicht nur Reaktion.",
        match: (s: any) => s.focus >= 45 && s.resources >= 40 && s.resources <= 65 && s.empathy <= 55,
        priority: 0
    },
    {
        id: "empath",
        title: "Der Empathische Schwamm",
        subtitle: "Du fühlst alles – ob du willst oder nicht",
        symbol: "💧",
        description: "Deine empathische Antenne ist auf voller Empfangsstärke. Du nimmst die Emotionen anderer auf wie ein Schwamm.",
        strengths: ["Tiefes, authentisches Verstehen anderer", "Fähigkeit, Trost zu spenden der wirklich ankommt", "Hohe emotionale Intelligenz"],
        affirmation: "Ich schütze meinen inneren Raum, damit mein Mitgefühl nachhaltig bleibt.",
        match: (s: any) => s.empathy >= 70,
        priority: 2
    }
];

// Balance scale icon
const BalanceIcon = () => (
    <svg viewBox="0 0 120 120" className="w-24 h-24">
        <circle cx="60" cy="60" r="50" stroke={colors.goldPrimary} strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.4" />
        <line x1="60" y1="25" x2="60" y2="95" stroke={colors.goldPrimary} strokeWidth="1.5" />
        <line x1="25" y1="50" x2="95" y2="50" stroke={colors.goldPrimary} strokeWidth="1.5" />
        <path d="M25 50 L35 70 L15 70 Z" fill={colors.goldPrimary} fillOpacity="0.3" stroke={colors.goldPrimary} strokeWidth="1" />
        <path d="M95 50 L105 70 L85 70 Z" fill={colors.goldPrimary} fillOpacity="0.3" stroke={colors.goldPrimary} strokeWidth="1" />
        <circle cx="60" cy="25" r="5" fill={colors.goldPrimary} />
    </svg>
);

export function PersonalityQuiz() {
    const [stage, setStage] = useState<'intro' | 'quiz' | 'result'>('intro');
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<string, { scores: any, weight: number }>>({});
    const [result, setResult] = useState<typeof profiles[0] | null>(null);
    const [scores, setScores] = useState({ focus: 0, resources: 0, empathy: 0 });
    const [isAnimating, setIsAnimating] = useState(false);

    const startQuiz = () => setStage('quiz');

    const handleAnswer = (option: any, question: any) => {
        setIsAnimating(true);
        setTimeout(() => {
            const newAnswers = { ...answers, [question.id]: { scores: option.scores, weight: question.weight || 1 } };
            setAnswers(newAnswers);

            if (currentQ < questions.length - 1) {
                setCurrentQ(currentQ + 1);
                setIsAnimating(false);
            } else {
                calculateResult(newAnswers);
            }
        }, 200);
    };

    const calculateResult = (finalAnswers: any) => {
        const dimCounts = { focus: 0, resources: 0, empathy: 0 };
        const dimSums = { focus: 0, resources: 0, empathy: 0 };

        Object.values(finalAnswers).forEach((a: any) => {
            Object.entries(a.scores).forEach(([dim, score]) => {
                // @ts-ignore
                dimSums[dim] += score * a.weight;
                // @ts-ignore
                dimCounts[dim] += a.weight;
            });
        });

        const finalScores = {
            focus: Math.round(dimSums.focus / Math.max(dimCounts.focus, 1)),
            resources: Math.round(dimSums.resources / Math.max(dimCounts.resources, 1)),
            empathy: Math.round(dimSums.empathy / Math.max(dimCounts.empathy, 1))
        };

        setScores(finalScores);

        const sorted = [...profiles].sort((a, b) => b.priority - a.priority);
        const match = sorted.find(p => p.match(finalScores)) || profiles.find(p => p.id === 'balancer');

        setResult(match || profiles[2]);
        setStage('result');
        setIsAnimating(false);
    };

    const progress = ((currentQ + 1) / questions.length) * 100;
    const q = questions[currentQ];

    // INTRO SCREEN
    if (stage === 'intro') {
        return (
            <div
                className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 rounded-3xl"
                style={{
                    background: `linear-gradient(165deg, ${colors.bgEmerald} 0%, ${colors.bgPrimary} 50%, #031119 100%)`,
                    color: colors.textLight
                }}
            >
                <div className="flex justify-center mb-6">
                    <BalanceIcon />
                </div>

                <h1
                    className="text-3xl font-serif font-semibold mb-4"
                    style={{ color: colors.goldPrimary }}
                >
                    Selbstfürsorge oder Weltverbesserer?
                </h1>

                <p className="text-lg mb-8 max-w-md" style={{ color: colors.sage }}>
                    Entdecke dein persönliches Gleichgewicht zwischen Geben und Nehmen.
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
                    Test starten
                </button>

                <p className="text-xs mt-6" style={{ color: colors.teal }}>
                    Zur Selbstreflexion. Keine Diagnose.
                </p>
            </div>
        );
    }

    // QUIZ SCREEN
    if (stage === 'quiz') {
        return (
            <div
                className={`min-h-[500px] p-6 rounded-3xl flex flex-col transition-opacity duration-200 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}
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
                                onClick={() => handleAnswer(opt, q)}
                                className="w-full text-left p-4 rounded-xl transition-all duration-200 hover:translate-y-[-1px]"
                                style={{
                                    background: 'rgba(247, 240, 230, 0.6)',
                                    border: '1px solid rgba(167, 125, 56, 0.3)',
                                    color: colors.textDark
                                }}
                            >
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
                            <div className="text-5xl mb-4">{result.symbol}</div>
                            <h1
                                className="text-2xl font-serif font-bold mb-2"
                                style={{ color: colors.textDark }}
                            >
                                {result.title}
                            </h1>
                            <p className="italic text-sm" style={{ color: colors.teal }}>
                                {result.subtitle}
                            </p>
                        </div>

                        <div className="p-6 space-y-5">
                            <p
                                className="leading-relaxed text-lg"
                                style={{ color: colors.textDark, opacity: 0.9 }}
                            >
                                {result.description}
                            </p>

                            {/* Strengths */}
                            <div
                                className="rounded-xl p-5"
                                style={{
                                    background: 'rgba(108, 161, 146, 0.08)',
                                    border: '1px solid rgba(108, 161, 146, 0.2)'
                                }}
                            >
                                <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.sage }}>
                                    ✨ Deine Stärken
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    {result.strengths.map((s, i) => (
                                        <li key={i} className="flex gap-2" style={{ color: colors.textDark }}>
                                            <span style={{ color: colors.sage }}>•</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Affirmation */}
                            <div
                                className="rounded-xl p-5"
                                style={{
                                    background: 'rgba(210, 169, 90, 0.08)',
                                    border: '1px solid rgba(210, 169, 90, 0.2)'
                                }}
                            >
                                <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.goldDark }}>
                                    🌟 Affirmation
                                </h3>
                                <p className="italic font-medium leading-relaxed" style={{ color: colors.textDark }}>
                                    „{result.affirmation}"
                                </p>
                            </div>

                            {/* Balance Stats */}
                            <div
                                className="rounded-xl p-5"
                                style={{
                                    background: 'rgba(28, 91, 92, 0.08)',
                                    border: '1px solid rgba(28, 91, 92, 0.15)'
                                }}
                            >
                                <h4 className="text-xs uppercase tracking-wide mb-4" style={{ color: colors.teal }}>
                                    Deine Balance
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Fokus (Selbst vs. Andere)', val: scores.focus },
                                        { label: 'Ressourcen (Behalten vs. Geben)', val: scores.resources },
                                        { label: 'Empathie (Abgrenzung vs. Resonanz)', val: scores.empathy }
                                    ].map((d, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs mb-1" style={{ color: colors.textDark, opacity: 0.7 }}>
                                                <span>{d.label}</span>
                                                <span>{d.val}%</span>
                                            </div>
                                            <div
                                                className="h-2 rounded-full overflow-hidden"
                                                style={{ background: 'rgba(28, 91, 92, 0.15)' }}
                                            >
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${d.val}%`,
                                                        background: `linear-gradient(90deg, ${colors.goldDark} 0%, ${colors.goldPrimary} 100%)`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={() => {
                                const text = `${result.symbol} Mein Ergebnis: ${result.title} – ${result.subtitle}`;
                                if (navigator.share) {
                                    navigator.share({ title: 'Selbstfürsorge Test', text });
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
                                setAnswers({});
                                setScores({ focus: 0, resources: 0, empathy: 0 });
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
