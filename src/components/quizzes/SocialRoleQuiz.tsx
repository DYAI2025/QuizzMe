
'use client'

import React, { useState } from 'react';
import { questions, roles } from './social-role/data';
// import { aggregateMarkers } from '../../lib/lme/marker-aggregator'; 
// import { updatePsycheState } from '../../lib/lme/lme-core'; 
// import { getPsycheState, savePsycheState } from '../../lib/lme/storage'; 

type Scores = {
    stability: number;
    fire: number;
    truth: number;
    harbor: number;
    compass: number;
    bridge: number;
};

export function SocialRoleQuiz() {
    const [stage, setStage] = useState('intro');
    const [currentQ, setCurrentQ] = useState(0);
    const [scores, setScores] = useState<Scores>({ stability: 0, fire: 0, truth: 0, harbor: 0, compass: 0, bridge: 0 });
    const [result, setResult] = useState<typeof roles[keyof typeof roles] | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((option as any).psyche_markers) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const calculateResult = (finalScores: Scores, finalMarkers: any[]) => {
        setStage('loading');

        // Logic for role determination
        let maxScore = 0;
        let dominantTrait = 'stability';

        Object.entries(finalScores).forEach(([trait, score]) => {
            if (score > maxScore) {
                maxScore = score;
                dominantTrait = trait;
            }
        });

        const roleMapping: Record<string, keyof typeof roles> = {
            stability: 'rock',
            fire: 'flame',
            truth: 'mirror',
            harbor: 'harbor',
            compass: 'compass',
            bridge: 'bridge'
        };
        const resultRole = roles[roleMapping[dominantTrait]];

        // LME Update via Ingestion Pipeline
        import('../../lib/lme/ingestion').then(({ ingestContribution }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const explicitMarkers: any[] = finalMarkers || [];

            const event = {
                specVersion: "sp.contribution.v1" as const,
                eventId: crypto.randomUUID(),
                occurredAt: new Date().toISOString(),
                source: {
                    vertical: "quiz" as const,
                    moduleId: "quiz.social_role.v1",
                    domain: window.location.hostname
                },
                payload: {
                    // Start with explicit markers, add derived ones
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    markers: explicitMarkers.map((m: any) => ({ id: m.id || 'unknown', weight: m.weight || 0.5 })),
                    traits: [
                        { id: `trait.social_role.${dominantTrait}`, score: 80, confidence: 0.7 }
                    ],
                    tags: [{ id: 'tag.social_role.quiz_completed', label: 'Social Role Quiz', kind: 'misc' as const }],
                    summary: {
                        title: `Rolle: ${resultRole.name}`,
                        bullets: [resultRole.tagline],
                        resultId: resultRole.name
                    }
                }
            };

            try {
                ingestContribution(event);
            } catch (e) {
                console.error("Ingestion failed", e);
            }
        });

        // Simulate suspense
        setTimeout(() => {
            setResult(resultRole);
            setStage('result');
            setIsAnimating(false);
        }, 1500);
    };

    const progress = ((currentQ + 1) / questions.length) * 100;

    if (stage === 'intro') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] text-center p-8 bg-gradient-to-br from-zinc-900 to-black text-white rounded-3xl">
                <div className="text-6xl mb-6">👥</div>
                <h1 className="text-3xl font-bold mb-4">Wer bist du für andere?</h1>
                <p className="text-zinc-400 text-lg mb-8 max-w-md">
                    Der Fels? Die Flamme? Der Spiegel? <br />
                    Finde heraus, welche Rolle du unbewusst in deinem Umfeld spielst.
                </p>
                <button
                    onClick={startQuiz}
                    className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl font-bold text-lg 
                         shadow-lg shadow-violet-500/30 hover:scale-105 transition-transform"
                >
                    Entdecken
                </button>
                <p className="text-zinc-600 text-xs mt-6">
                    Zur Selbstreflexion. Keine Diagnose. <span className="text-violet-500">Syncts mit deinem Profil.</span>
                </p>
            </div>
        );
    }

    if (stage === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] bg-zinc-900 text-white rounded-3xl">
                <div className="text-6xl mb-6 animate-pulse">🔮</div>
                <p className="text-zinc-400 text-lg">Dein soziales Profil nimmt Form an...</p>
                <p className="text-zinc-500 text-sm mt-2">Berechne Interaktionen...</p>
            </div>
        );
    }

    if (stage === 'quiz') {
        const q = questions[currentQ];

        return (
            <div className={`bg-zinc-900 text-white p-6 rounded-3xl min-h-[600px] flex flex-col transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
                <div className="mb-8">
                    <div className="flex justify-between text-xs text-zinc-500 mb-2">
                        <span>Frage {currentQ + 1} von {questions.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="flex-grow flex flex-col justify-center max-w-xl mx-auto w-full">
                    <p className="text-violet-400 italic mb-4 text-sm">{q.scenario}</p>
                    <h2 className="text-2xl font-bold mb-8 leading-snug">
                        {q.text}
                    </h2>

                    <div className="space-y-3">
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt)}
                                className="w-full text-left p-4 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 hover:border-violet-500/50 
                                       rounded-xl transition-all duration-200 flex items-center gap-4 group"
                            >
                                <span className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">{opt.vibe}</span>
                                <span className="text-zinc-300 group-hover:text-white">{opt.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (stage === 'result' && result) {
        return (
            <div className={`bg-gradient-to-br ${result.gradient} text-white p-1 rounded-3xl shadow-2xl overflow-hidden`}>
                <div className="bg-zinc-900/90 backdrop-blur-sm p-8 h-full rounded-[20px] overflow-y-auto max-h-[800px] no-scrollbar">
                    <div className="text-center mb-10">
                        <div className="text-6xl mb-4">{result.emoji}</div>
                        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                            {result.name}
                        </h1>
                        <p className="text-zinc-400 text-lg italic">&quot;{result.tagline}&quot;</p>
                    </div>

                    <p className="text-zinc-200 leading-relaxed mb-8 text-lg text-center">
                        {result.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                            <div className="text-2xl mb-2">⚡</div>
                            <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Superkraft</h3>
                            <p className="font-medium text-white">{result.superpower}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                            <div className="text-2xl mb-2">🌑</div>
                            <h3 className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Schattenseite</h3>
                            <p className="font-medium text-white">{result.shadow}</p>
                        </div>
                    </div>

                    <div className="bg-zinc-950/50 rounded-xl p-6 mb-8">
                        <h3 className="text-zinc-500 text-xs uppercase tracking-wide mb-4">Deine Zutaten</h3>
                        <div className="space-y-4">
                            {result.ingredients.map(([pct, label], i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${result.gradient}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-zinc-300 w-32 text-right">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-6 mb-8">
                        <h3 className="text-center text-zinc-500 text-xs uppercase tracking-wide mb-6">Deine Dynamiken</h3>
                        <div className="flex justify-between text-center max-w-md mx-auto">
                            <div>
                                <p className="text-xs text-zinc-500 mb-1">Verstärkt durch</p>
                                <p className="text-emerald-400 font-medium">{result.compatible}</p>
                            </div>
                            <div className="w-px bg-white/10 mx-4"></div>
                            <div>
                                <p className="text-xs text-zinc-500 mb-1">Herausfordernd</p>
                                <p className="text-amber-400 font-medium">{result.challenging}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                const text = `${result.emoji} Ich bin ${result.name}\n\n"${result.tagline}"\n\nFinde heraus, wer DU für andere bist.`;
                                if (navigator.share) {
                                    navigator.share({ title: 'Wer bist du für andere?', text });
                                } else {
                                    navigator.clipboard.writeText(text).then(() => alert('Kopiert!'));
                                }
                            }}
                            className={`flex-1 py-3 px-6 rounded-xl font-bold bg-gradient-to-r ${result.gradient} shadow-lg hover:opacity-90 transition-opacity`}
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
                            className="px-6 py-3 rounded-xl font-semibold border border-zinc-700 hover:bg-zinc-800 transition-colors text-zinc-400"
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
