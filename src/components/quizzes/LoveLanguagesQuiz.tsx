
'use client'

import React, { useState } from 'react';
// import { aggregateMarkers } from '../../lib/lme/marker-aggregator';
// import { updatePsycheState } from '../../lib/lme/lme-core';
// import { getPsycheState, savePsycheState } from '../../lib/lme/storage';

const quizData = {
    meta: {
        title: "Welche Sprache spricht dein Herz?",
        subtitle: "Entdecke deinen Liebenden-Archetyp",
    },
    questions: [
        {
            id: "q1",
            context: "Es ist spät. Dein Mensch hatte einen schweren Tag.",
            text: "Was tust du instinktiv?",
            options: [
                { id: "a", text: "Ich sage die Worte, die niemand sonst findet", scores: { intensity: 0, expression: 0, connection: 1 }, psyche_markers: { depth: 0.6, connection: 0.8 } },
                { id: "b", text: "Ich halte einfach still – meine Arme sagen alles", scores: { intensity: 1, expression: 1, connection: 2 }, psyche_markers: { connection: 1.0, shadow: 0.4 } },
                { id: "c", text: "Ich handle: Tee, Decke, das Handy auf lautlos", scores: { intensity: 0, expression: 2, connection: 1 }, psyche_markers: { structure: 0.8, connection: 0.6 } },
                { id: "d", text: "Ich bleibe einfach da – meine Präsenz ist das Geschenk", scores: { intensity: 1, expression: 1, connection: 1 }, psyche_markers: { connection: 0.9, depth: 0.5 } }
            ]
        },
        {
            id: "q2",
            context: "Du denkst an einen perfekten Moment mit jemandem, den du liebst.",
            text: "Was siehst du?",
            options: [
                { id: "a", text: "Ein Gespräch, das die Zeit vergessen lässt", scores: { intensity: 0, expression: 0, connection: 1 }, psyche_markers: { connection: 1.0, depth: 0.8 } },
                { id: "b", text: "Hände, die sich finden, ohne hinzusehen", scores: { intensity: 2, expression: 1, connection: 2 }, psyche_markers: { shadow: 0.5, connection: 0.9 } },
                { id: "c", text: "Ein Ort, den wir gemeinsam gebaut haben", scores: { intensity: 1, expression: 2, connection: 1 }, psyche_markers: { structure: 1.0, connection: 0.5 } },
                { id: "d", text: "Stille, die sich wie Zuhause anfühlt", scores: { intensity: 0, expression: 1, connection: 2 }, psyche_markers: { depth: 0.7, connection: 0.8 } }
            ]
        },
        {
            id: "q3",
            context: "Du erhältst ein Geschenk von jemandem, der dich liebt.",
            text: "Was berührt dich am meisten?",
            options: [
                { id: "a", text: "Die Karte – was jemand schreibt, vergesse ich nie", scores: { intensity: 1, expression: 0, connection: 1 } },
                { id: "b", text: "Die Mühe – dass jemand Zeit investiert hat", scores: { intensity: 0, expression: 2, connection: 1 } },
                { id: "c", text: "Das Objekt selbst – ein greifbarer Beweis der Liebe", scores: { intensity: 1, expression: 1, connection: 0 } },
                { id: "d", text: "Der Moment des Gebens – die Nähe dabei", scores: { intensity: 2, expression: 1, connection: 2 } }
            ]
        },
        {
            id: "q4",
            context: "Du spürst, dass etwas zwischen euch nicht stimmt.",
            text: "Wie reagierst du?",
            options: [
                { id: "a", text: "Ich brauche das Gespräch – Ungesagtes brennt", scores: { intensity: 2, expression: 0, connection: 1 } },
                { id: "b", text: "Ich brauche Nähe – Worte können lügen, Körper nicht", scores: { intensity: 2, expression: 1, connection: 2 } },
                { id: "c", text: "Ich tue etwas – Handeln ist meine Sprache der Versöhnung", scores: { intensity: 1, expression: 2, connection: 1 } },
                { id: "d", text: "Ich brauche Raum – um zu verstehen, was ich fühle", scores: { intensity: 0, expression: 1, connection: 0 } }
            ]
        },
        {
            id: "q5",
            context: "Jemand fragt dich: 'Woran erkenne ich, dass du mich liebst?'",
            text: "Deine ehrlichste Antwort:",
            options: [
                { id: "a", text: "An dem, was ich dir sage, wenn niemand zuhört", scores: { intensity: 1, expression: 0, connection: 1 } },
                { id: "b", text: "Daran, dass ich da bin – auch wenn es unbequem ist", scores: { intensity: 0, expression: 2, connection: 2 } },
                { id: "c", text: "An meinen Händen auf deiner Haut", scores: { intensity: 2, expression: 1, connection: 2 } },
                { id: "d", text: "Daran, dass ich dich sehe – wirklich sehe", scores: { intensity: 1, expression: 0, connection: 1 } }
            ]
        },
        {
            id: "q6",
            context: "Du hast drei Stunden ungestörte Zeit mit deinem Menschen.",
            text: "Was wählst du?",
            options: [
                { id: "a", text: "Reden, bis wir vergessen haben, wo wir angefangen haben", scores: { intensity: 1, expression: 0, connection: 1 } },
                { id: "b", text: "Nebeneinander existieren – lesen, atmen, sein", scores: { intensity: 0, expression: 1, connection: 1 } },
                { id: "c", text: "Etwas zusammen erschaffen oder erleben", scores: { intensity: 1, expression: 2, connection: 1 } },
                { id: "d", text: "Berührung ohne Ziel – einfach nah sein", scores: { intensity: 2, expression: 1, connection: 2 } }
            ]
        },
        {
            id: "q7",
            context: "Ein alter Freund fragt, was deine größte Stärke in Beziehungen ist.",
            text: "Welche Wahrheit würdest du zugeben?",
            options: [
                { id: "a", text: "Ich kann Dinge in Worte fassen, die andere nur fühlen", scores: { intensity: 1, expression: 0, connection: 1 } },
                { id: "b", text: "Ich zeige Liebe durch das, was ich tue, nicht was ich sage", scores: { intensity: 0, expression: 2, connection: 1 } },
                { id: "c", text: "Ich bin physisch präsent in einer Welt voller Ablenkung", scores: { intensity: 2, expression: 1, connection: 2 } },
                { id: "d", text: "Ich gebe Raum – echte Liebe erstickt nicht", scores: { intensity: 0, expression: 1, connection: 0 } }
            ]
        },
        {
            id: "q8",
            context: "Du erinnerst dich an den Moment, als du wusstest: Das ist Liebe.",
            text: "Was hat es verraten?",
            options: [
                { id: "a", text: "Ein Satz, der alles verändert hat", scores: { intensity: 2, expression: 0, connection: 1 } },
                { id: "b", text: "Eine Geste, so klein, dass nur ich sie bemerkt habe", scores: { intensity: 0, expression: 2, connection: 1 } },
                { id: "c", text: "Die Art, wie sich mein Körper in ihrer Nähe entspannt hat", scores: { intensity: 1, expression: 1, connection: 2 } },
                { id: "d", text: "Die Stille, die plötzlich nicht mehr leer war", scores: { intensity: 0, expression: 1, connection: 2 } }
            ]
        },
        {
            id: "q9",
            context: "Du musst eine Liebesszene aus einem Film wählen, die dich am meisten trifft.",
            text: "Welche?",
            options: [
                { id: "a", text: "Das Geständnis – endlich ausgesprochene Wahrheit", scores: { intensity: 2, expression: 0, connection: 1 } },
                { id: "b", text: "Der Kuss im Regen – Körper sprechen lauter", scores: { intensity: 2, expression: 1, connection: 2 } },
                { id: "c", text: "Das Opfer – jemand tut das Unmögliche für den anderen", scores: { intensity: 1, expression: 2, connection: 1 } },
                { id: "d", text: "Der letzte Tanz – Zeit anhalten, nur wir zwei", scores: { intensity: 1, expression: 1, connection: 2 } }
            ]
        },
        {
            id: "q10",
            context: "Dein Herz wurde einmal gebrochen.",
            text: "Was hat am meisten gefehlt?",
            options: [
                { id: "a", text: "Die Worte – 'Ich liebe dich' wurde eine Floskel", scores: { intensity: 1, expression: 0, connection: 1 } },
                { id: "b", text: "Die Berührung – wir waren Mitbewohner, nicht Liebende", scores: { intensity: 2, expression: 1, connection: 2 } },
                { id: "c", text: "Die Taten – Versprechen ohne Handlung sind Lügen", scores: { intensity: 0, expression: 2, connection: 1 } },
                { id: "d", text: "Die Zeit – wir hatten keine Stunden mehr füreinander", scores: { intensity: 1, expression: 1, connection: 2 } }
            ]
        },
        {
            id: "q11",
            context: "Liebe ist für dich...",
            text: "Wähle das Bild, das am stärksten resoniert:",
            options: [
                { id: "a", text: "Eine Flamme – sie muss genährt werden, oder sie erlischt", scores: { intensity: 2, expression: 0, connection: 1 } },
                { id: "b", text: "Ein Ozean – tief, manchmal stürmisch, immer größer als ich", scores: { intensity: 2, expression: 1, connection: 2 } },
                { id: "c", text: "Ein Baum – Wurzeln brauchen Zeit, aber dann halten sie", scores: { intensity: 0, expression: 2, connection: 1 } },
                { id: "d", text: "Der Wind – man sieht ihn nicht, aber man spürt, wenn er fehlt", scores: { intensity: 1, expression: 1, connection: 0 } }
            ]
        },
        {
            id: "q12",
            context: "Letzte Frage. Vervollständige den Satz:",
            text: "Ich weiß, dass ich geliebt werde, wenn...",
            options: [
                { id: "a", text: "...jemand die Worte findet, die ich selbst nicht aussprechen kann", scores: { intensity: 1, expression: 0, connection: 1 } },
                { id: "b", text: "...jemand mich berührt, als wäre ich kostbar", scores: { intensity: 2, expression: 1, connection: 2 } },
                { id: "c", text: "...jemand handelt, bevor ich fragen muss", scores: { intensity: 0, expression: 2, connection: 1 } },
                { id: "d", text: "...jemand seine Zeit wählt, mich zu wählen", scores: { intensity: 1, expression: 1, connection: 2 } }
            ]
        }
    ],
    profiles: [
        {
            id: "the_poet",
            title: "Der Dichter",
            emoji: "🖤",
            tagline: "Du liebst in Sätzen, die andere nie vergessen werden.",
            loveLanguage: "Worte der Anerkennung",
            description: "Es gibt Menschen, die Liebe aussprechen wie ein Geständnis – und dann gibt es dich. Du hast verstanden, dass Worte keine leeren Hüllen sind. Sie sind Brücken. Schlüssel. Manchmal sogar Waffen.\\n\\nIn bestimmten Momenten findest du Formulierungen, die andere ihr Leben lang suchen. Das ist keine Fähigkeit, die man lernt – es ist die Art, wie dein Herz verdrahtet ist.\\n\\nDu bist einer der wenigen, die das Unsagbare sagbar machen. In einer Welt voller Small Talk bist du das tiefe Gespräch um 3 Uhr nachts.",
            stats: [
                { label: "Ungesendete Nachrichten", value: "94%" },
                { label: "Emotionale Präzision", value: "97%" },
                { label: "Komplimente annehmen", value: "12%" }
            ],
            allies: ["Das Refugium", "Der Hüter"],
            nemesis: "Der Architekt",
            color: "#1a1a2e",
            accent: "#e94560",
            match: (s: Score) => s.expression <= 8 && s.connection >= 8
        },
        {
            id: "the_flame",
            title: "Die Flamme",
            emoji: "🔥",
            tagline: "Du liebst mit dem ganzen Körper – Haut spricht lauter als Worte.",
            loveLanguage: "Körperliche Nähe",
            description: "Für dich ist Liebe kein Konzept. Sie ist physisch. Spürbar. Eine Hand auf dem Rücken im richtigen Moment sagt mehr als tausend Textnachrichten.\\n\\nDu verstehst etwas, das viele vergessen haben: Wir sind Körper. Und Körper brauchen Berührung wie Pflanzen Licht. Wenn du umarmst, dann richtig. Wenn du die Hand hältst, ist es ein Statement.\\n\\nDu bist die Erinnerung daran, dass wir nicht nur Geist sind. In einer Welt der Distanz bist du radikale Nähe.",
            stats: [
                { label: "Umarmungs-Intensität", value: "200%" },
                { label: "Händchenhalten-Reflex", value: "Auto" },
                { label: "Kuscheln", value: "Olympisch" }
            ],
            allies: ["Das Refugium", "Die Flamme"],
            nemesis: "Der Leuchtturm",
            color: "#2d132c",
            accent: "#ff6b6b",
            match: (s: Score) => s.intensity >= 14 && s.connection >= 16
        },
        {
            id: "the_architect",
            title: "Der Architekt",
            emoji: "🔧",
            tagline: "Du baust Liebe – Stein für Stein, Tat für Tat.",
            loveLanguage: "Hilfsbereitschaft",
            description: "Während andere von Liebe reden, baust du sie. Jeden Tag. In kleinen Handlungen, die niemand sieht. Der Kaffee, der fertig ist, bevor sie aufwacht. Das Auto, das getankt am Straßenrand steht.\\n\\nFür dich ist Liebe ein Verb, kein Substantiv. Sie existiert nur in der Handlung. Das macht dich unglaublich verlässlich – und manchmal unsichtbar.\\n\\nDu bist der Beweis, dass Liebe kein Gefühl ist, sondern eine Entscheidung. Jeden Tag neu.",
            stats: [
                { label: "Probleme vorab gelöst", value: "87%" },
                { label: "Zeigen statt Sagen", value: "99%" },
                { label: "To-Do-Listen für andere", value: "Viele" }
            ],
            allies: ["Der Hüter", "Der Architekt"],
            nemesis: "Der Dichter",
            color: "#1b262c",
            accent: "#3282b8",
            match: (s: Score) => s.expression >= 14 && s.intensity <= 10
        },
        {
            id: "the_sanctuary",
            title: "Das Refugium",
            emoji: "🌙",
            tagline: "Du liebst, indem du bleibst – deine Präsenz ist das Geschenk.",
            loveLanguage: "Zweisamkeit",
            description: "In einer Welt, die immer lauter wird, bist du der ruhige Raum. Deine Art zu lieben ist die vielleicht unterschätzteste von allen: Du bist einfach da. Mit deiner ungeteilten Aufmerksamkeit.\\n\\nFür dich ist der größte Liebesbeweis, wenn jemand seine Zeit wählt, bei dir zu sein. Zeit ist endlich. Aufmerksamkeit ist kostbar.\\n\\nDu bist der Beweis, dass Anwesenheit die radikalste Form der Zuwendung ist.",
            stats: [
                { label: "Handy ignorieren", value: "100%" },
                { label: "'Kurze' Gespräche", value: "4h+" },
                { label: "Präsenz-Sensibilität", value: "Seismograph" }
            ],
            allies: ["Der Dichter", "Die Flamme"],
            nemesis: "Der Hüter",
            color: "#16213e",
            accent: "#7f5af0",
            match: (s: Score) => s.connection >= 14 && s.intensity <= 12 && s.expression >= 6 && s.expression <= 14
        },
        {
            id: "the_keeper",
            title: "Der Hüter",
            emoji: "🎁",
            tagline: "Du liebst in Symbolen – jedes Geschenk ist ein Stück deiner Seele.",
            loveLanguage: "Geschenke",
            description: "Für dich ist ein Geschenk niemals 'nur' ein Gegenstand. Es ist verdichtete Aufmerksamkeit. Der Beweis, dass jemand zugehört hat. Dass jemand dich gesehen hat.\\n\\nDu gibst genauso, wie du empfängst: durchdacht. Jedes Geschenk ist eine kleine Forschungsarbeit. Was braucht dieser Mensch? Was sagt 'Ich kenne dich'?\\n\\nDu bist der Beweis, dass Aufmerksamkeit die wertvollste Währung ist.",
            stats: [
                { label: "Erinnerung an Details", value: "Elefant" },
                { label: "Geschenk-Recherche", value: "FBI-Level" },
                { label: "Gespeicherte Ideen", value: "Archiv" }
            ],
            allies: ["Der Architekt", "Der Dichter"],
            nemesis: "Das Refugium",
            color: "#2b2e4a",
            accent: "#e84545",
            match: (s: Score) => s.connection <= 10 && s.expression >= 6 && s.expression <= 14
        },
        {
            id: "the_lighthouse",
            title: "Der Leuchtturm",
            emoji: "🌊",
            tagline: "Du liebst aus der Distanz – dein Licht reicht weiter, als du weißt.",
            loveLanguage: "Freiheit & Konstanz",
            description: "Du verstehst etwas, das viele als Widerspruch sehen: Liebe braucht Raum. Nicht weil du weniger fühlst, sondern weil du weißt, dass Nähe ohne Freiheit zur Fessel wird.\\n\\nDu liebst, indem du leuchtest – konstant, verlässlich – aber du verschlingst nicht. Du fühlst intensiv – du brauchst nur nicht die konstante Bestätigung durch Nähe.\\n\\nDu bist der Beweis, dass Liebe nicht klammern muss, um echt zu sein.",
            stats: [
                { label: "Alleinsein-Bedürfnis", value: "Vital" },
                { label: "Liebe ohne Besitz", value: "Selten" },
                { label: "Konstanz über Jahre", value: "Fels" }
            ],
            allies: ["Der Architekt", "Der Leuchtturm"],
            nemesis: "Die Flamme",
            color: "#0f0e17",
            accent: "#2cb67d",
            match: (s: Score) => s.connection <= 8 && s.intensity <= 10
        }
    ]
};

type Score = {
    intensity: number;
    expression: number;
    connection: number;
}

function getProfile(scores: Score) {
    for (const profile of quizData.profiles) {
        if (profile.match(scores)) {
            return profile;
        }
    }
    const intensityHigh = scores.intensity > 12;
    const expressionHigh = scores.expression > 12;
    const connectionHigh = scores.connection > 12;

    if (intensityHigh && connectionHigh) return quizData.profiles.find(p => p.id === "the_flame");
    if (expressionHigh) return quizData.profiles.find(p => p.id === "the_architect");
    if (connectionHigh) return quizData.profiles.find(p => p.id === "the_sanctuary");
    if (!connectionHigh && !intensityHigh) return quizData.profiles.find(p => p.id === "the_lighthouse");
    return quizData.profiles.find(p => p.id === "the_poet");
}

export function LoveLanguagesQuiz() {
    const [stage, setStage] = useState('intro');
    const [currentQ, setCurrentQ] = useState(0);
    const [scores, setScores] = useState({ intensity: 0, expression: 0, connection: 0 });
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [result, setResult] = useState<typeof quizData.profiles[0] | undefined>(undefined);
    const [isAnimating, setIsAnimating] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [collectedMarkers, setCollectedMarkers] = useState<any[]>([]);

    const handleStart = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setStage('quiz');
            setIsAnimating(false);
        }, 300);
    };

    const handleAnswer = (option: typeof quizData.questions[0]['options'][0]) => {
        setSelectedOption(option.id);
        const newScores = {
            intensity: scores.intensity + option.scores.intensity,
            expression: scores.expression + option.scores.expression,
            connection: scores.connection + option.scores.connection
        };
        setScores(newScores);

        // Collect markers if they exist
        const updatedMarkers = [...collectedMarkers];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((option as any).psyche_markers) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updatedMarkers.push((option as any).psyche_markers);
            setCollectedMarkers(updatedMarkers);
        }

        setTimeout(() => {
            if (currentQ < quizData.questions.length - 1) {
                setIsAnimating(true);
                setTimeout(() => {
                    setCurrentQ(currentQ + 1);
                    setSelectedOption(null);
                    setIsAnimating(false);
                }, 300);
            } else {
                setIsAnimating(true);
                setTimeout(() => {
                    const finalProfile = getProfile(newScores) || quizData.profiles[0];
                    setResult(finalProfile);

                    // LME Update
                    if (updatedMarkers.length > 0) {
                        import('../../lib/lme/ingestion').then(({ ingestContribution }) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const explicitMarkers: any[] = updatedMarkers || [];

                            const event = {
                                specVersion: "sp.contribution.v1" as const,
                                eventId: crypto.randomUUID(),
                                occurredAt: new Date().toISOString(),
                                source: {
                                    vertical: "quiz" as const,
                                    moduleId: "quiz.lovelang.v1",
                                    domain: window.location.hostname
                                },
                                payload: {
                                    // Flatten explicit markers
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    markers: explicitMarkers.flatMap((m: any) =>
                                        Object.entries(m).map(([k, v]) => ({ id: `marker.psyche.${k}`, weight: v as number }))
                                    ),
                                    traits: [
                                        { id: `trait.lovelang.${finalProfile.id}`, score: 100, confidence: 0.9 }
                                    ],
                                    tags: [{ id: 'tag.lovelang.result', label: finalProfile.title, kind: 'misc' as const }],
                                    summary: {
                                        title: `Liebessprache: ${finalProfile.title}`,
                                        bullets: [finalProfile.tagline],
                                        resultId: finalProfile.id
                                    }
                                }
                            };

                            try {
                                ingestContribution(event);
                            } catch (e) {
                                console.error("Ingestion failed", e);
                            }
                        });
                    }

                    setStage('result');
                    setIsAnimating(false);
                }, 500);
            }
        }, 400);
    };

    const handleRestart = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setStage('intro');
            setCurrentQ(0);
            setScores({ intensity: 0, expression: 0, connection: 0 });
            setCollectedMarkers([]);
            setSelectedOption(null);
            setResult(undefined);
            setIsAnimating(false);
        }, 300);
    };

    const progress = ((currentQ + 1) / quizData.questions.length) * 100;

    // Render logic adapted to fit inside container
    const containerClass = `min-h-[600px] rounded-xl overflow-hidden shadow-2xl relative transition-all duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'} bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900`;

    if (stage === 'intro') {
        return (
            <div className={containerClass + " flex items-center justify-center p-4"}>
                <div className="max-w-md w-full text-center">
                    <div className="text-6xl mb-6">💜</div>
                    <h1 className="text-3xl font-light text-white mb-3 tracking-wide">
                        {quizData.meta.title}
                    </h1>
                    <p className="text-purple-200/70 mb-8 text-lg">
                        {quizData.meta.subtitle}
                    </p>
                    <div className="space-y-4 text-purple-200/50 text-sm mb-10">
                        <p>12 Fragen · 2-3 Minuten</p>
                        <p className="text-xs leading-relaxed max-w-xs mx-auto">
                            Entdecke, welche Sprache dein Herz spricht – und warum manche Menschen dich sofort verstehen, während andere nie ankommen.
                        </p>
                    </div>
                    <button
                        onClick={handleStart}
                        className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-lg font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30"
                    >
                        Starten
                    </button>
                </div>
            </div>
        );
    }

    if (stage === 'quiz') {
        const question = quizData.questions[currentQ];
        return (
            <div className={containerClass + " flex flex-col"}>
                <div className="w-full h-1 bg-slate-800 absolute top-0 left-0">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="p-4 text-purple-300/50 text-sm flex justify-between pt-6">
                    <span>{currentQ + 1} / {quizData.questions.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>

                <div className={`flex-1 flex flex-col justify-center p-6 max-w-lg mx-auto w-full transition-all duration-300`}>
                    {question.context && (
                        <p className="text-purple-300/60 text-sm mb-3 italic">
                            {question.context}
                        </p>
                    )}
                    <h2 className="text-xl text-white mb-8 font-light leading-relaxed">
                        {question.text}
                    </h2>

                    <div className="space-y-3">
                        {question.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleAnswer(option)}
                                disabled={selectedOption !== null}
                                className={`w-full p-4 text-left rounded-xl border transition-all duration-300 ${selectedOption === option.id
                                    ? 'border-purple-400 bg-purple-500/20 text-white scale-98'
                                    : selectedOption !== null
                                        ? 'border-slate-700/50 bg-slate-800/30 text-slate-500'
                                        : 'border-slate-700 bg-slate-800/50 text-purple-100 hover:border-purple-500/50 hover:bg-slate-800 active:scale-98'
                                    }`}
                            >
                                <span className="text-sm leading-relaxed">{option.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (stage === 'result' && result) {
        return (
            <div
                className={containerClass + " flex flex-col"}
                style={{ background: `linear-gradient(135deg, ${result.color} 0%, #0f0e17 100%)` }}
            >
                <div className="flex-1 p-6 max-w-lg mx-auto w-full overflow-y-auto no-scrollbar">
                    <div className="text-center mb-6 pt-4">
                        <div className="text-5xl mb-4">{result.emoji}</div>
                        <h1 className="text-3xl font-light text-white mb-2">{result.title}</h1>
                        <p className="text-sm px-4 py-2 rounded-full inline-block mb-4" style={{ backgroundColor: `${result.accent}30`, color: result.accent }}>
                            {result.loveLanguage}
                        </p>
                        <p className="text-white/70 italic text-sm">
                            &quot;{result.tagline}&quot;
                        </p>
                    </div>

                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-5 mb-5">
                        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">
                            {result.description}
                        </p>
                    </div>

                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-5 mb-5">
                        <h3 className="text-white/50 text-xs uppercase tracking-wider mb-4">Deine Stats</h3>
                        <div className="space-y-3">
                            {result.stats.map((stat, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-white/70 text-sm">{stat.label}</span>
                                    <span className="font-mono text-sm" style={{ color: result.accent }}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-5 mb-6">
                        <h3 className="text-white/50 text-xs uppercase tracking-wider mb-4">Kompatibilität</h3>
                        <div className="mb-4">
                            <span className="text-green-400/70 text-xs">Allies:</span>
                            <p className="text-white/80 text-sm">{result.allies.join(", ")}</p>
                        </div>
                        <div>
                            <span className="text-red-400/70 text-xs">Nemesis:</span>
                            <p className="text-white/80 text-sm">{result.nemesis}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={handleRestart}
                            className="flex-1 py-3 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-all text-sm"
                        >
                            Nochmal
                        </button>
                        <button
                            onClick={() => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const nav = navigator as any;
                                if (nav.share) {
                                    nav.share({
                                        title: `Ich bin ${result.title}`,
                                        text: result.tagline,
                                        url: typeof window !== 'undefined' ? window.location.href : ''
                                    });
                                }
                            }}
                            className="flex-1 py-3 rounded-xl text-white font-medium transition-all text-sm"
                            style={{ backgroundColor: result.accent }}
                        >
                            Teilen
                        </button>
                    </div>

                    <p className="text-white/30 text-xs text-center leading-relaxed pb-4">
                        Dieser Test dient der spielerischen Selbstreflexion und stellt keine psychologische Bewertung dar.
                        <br /><span className="text-purple-400/50">Dein dynamisches Profil wurde aktualisiert.</span>
                    </p>
                </div>
            </div>
        );
    }

    return null;
}
