'use client'

import React, { useState } from 'react';
import { aggregateMarkers } from '../../lib/lme/marker-aggregator';
import { updatePsycheState } from '../../lib/lme/lme-core';
import { getPsycheState, savePsycheState } from '../../lib/lme/storage';

// Modern Alchemy Botanical colors
const colors = {
    emerald900: '#1B4332',
    emerald800: '#2D5A45',
    emerald700: '#3D6B4F',
    emerald600: '#4A7C59',
    emerald500: '#5A8F68',
    emerald100: '#D8E9DE',
    emerald50: '#EBF3ED',
    gold600: '#9A7B2C',
    gold500: '#B8942F',
    gold400: '#D4AA33',
    gold100: '#FAF6E9',
    stone100: '#F5F5F4',
    stone200: '#E7E5E4',
    stone50: '#FAFAF9',
};

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
            title: "Die Dichterin",
            symbol: "✧",
            tagline: "Du liebst in Sätzen, die andere nie vergessen werden.",
            loveLanguage: "Worte der Anerkennung",
            description: "Es gibt Menschen, die Liebe aussprechen wie ein Geständnis – und dann gibt es dich. Du hast verstanden, dass Worte keine leeren Hüllen sind. Sie sind Brücken. Schlüssel. Manchmal sogar Waffen.\n\nIn bestimmten Momenten findest du Formulierungen, die andere ihr Leben lang suchen. Das ist keine Fähigkeit, die man lernt – es ist die Art, wie dein Herz verdrahtet ist.\n\nDu bist eine der wenigen, die das Unsagbare sagbar machen. In einer Welt voller Small Talk bist du das tiefe Gespräch um 3 Uhr nachts.",
            stats: [
                { label: "Ungesendete Nachrichten", value: "94%" },
                { label: "Emotionale Präzision", value: "97%" },
                { label: "Komplimente annehmen", value: "12%" }
            ],
            allies: ["Das Refugium", "Die Hüterin"],
            nemesis: "Die Architektin",
            accent: colors.emerald800,
            accentLight: colors.emerald50,
            match: (s: Score) => s.expression <= 8 && s.connection >= 8
        },
        {
            id: "the_flame",
            title: "Die Flamme",
            symbol: "❋",
            tagline: "Du liebst mit dem ganzen Körper – Haut spricht lauter als Worte.",
            loveLanguage: "Körperliche Nähe",
            description: "Für dich ist Liebe kein Konzept. Sie ist physisch. Spürbar. Eine Hand auf dem Rücken im richtigen Moment sagt mehr als tausend Textnachrichten.\n\nDu verstehst etwas, das viele vergessen haben: Wir sind Körper. Und Körper brauchen Berührung wie Pflanzen Licht. Wenn du umarmst, dann richtig. Wenn du die Hand hältst, ist es ein Statement.\n\nDu bist die Erinnerung daran, dass wir nicht nur Geist sind. In einer Welt der Distanz bist du radikale Nähe.",
            stats: [
                { label: "Umarmungs-Intensität", value: "200%" },
                { label: "Händchenhalten-Reflex", value: "Auto" },
                { label: "Kuscheln", value: "Olympisch" }
            ],
            allies: ["Das Refugium", "Die Flamme"],
            nemesis: "Der Leuchtturm",
            accent: colors.gold600,
            accentLight: colors.gold100,
            match: (s: Score) => s.intensity >= 14 && s.connection >= 16
        },
        {
            id: "the_architect",
            title: "Die Architektin",
            symbol: "◇",
            tagline: "Du baust Liebe – Stein für Stein, Tat für Tat.",
            loveLanguage: "Hilfsbereitschaft",
            description: "Während andere von Liebe reden, baust du sie. Jeden Tag. In kleinen Handlungen, die niemand sieht. Der Kaffee, der fertig ist, bevor sie aufwacht. Das Auto, das getankt am Straßenrand steht.\n\nFür dich ist Liebe ein Verb, kein Substantiv. Sie existiert nur in der Handlung. Das macht dich unglaublich verlässlich – und manchmal unsichtbar.\n\nDu bist der Beweis, dass Liebe kein Gefühl ist, sondern eine Entscheidung. Jeden Tag neu.",
            stats: [
                { label: "Probleme vorab gelöst", value: "87%" },
                { label: "Zeigen statt Sagen", value: "99%" },
                { label: "To-Do-Listen für andere", value: "Viele" }
            ],
            allies: ["Die Hüterin", "Die Architektin"],
            nemesis: "Die Dichterin",
            accent: colors.emerald700,
            accentLight: colors.emerald100,
            match: (s: Score) => s.expression >= 14 && s.intensity <= 10
        },
        {
            id: "the_sanctuary",
            title: "Das Refugium",
            symbol: "○",
            tagline: "Du liebst, indem du bleibst – deine Präsenz ist das Geschenk.",
            loveLanguage: "Zweisamkeit",
            description: "In einer Welt, die immer lauter wird, bist du der ruhige Raum. Deine Art zu lieben ist die vielleicht unterschätzteste von allen: Du bist einfach da. Mit deiner ungeteilten Aufmerksamkeit.\n\nFür dich ist der größte Liebesbeweis, wenn jemand seine Zeit wählt, bei dir zu sein. Zeit ist endlich. Aufmerksamkeit ist kostbar.\n\nDu bist der Beweis, dass Anwesenheit die radikalste Form der Zuwendung ist.",
            stats: [
                { label: "Handy ignorieren", value: "100%" },
                { label: "'Kurze' Gespräche", value: "4h+" },
                { label: "Präsenz-Sensibilität", value: "Seismograph" }
            ],
            allies: ["Die Dichterin", "Die Flamme"],
            nemesis: "Die Hüterin",
            accent: colors.emerald600,
            accentLight: colors.emerald50,
            match: (s: Score) => s.connection >= 14 && s.intensity <= 12 && s.expression >= 6 && s.expression <= 14
        },
        {
            id: "the_keeper",
            title: "Die Hüterin",
            symbol: "✦",
            tagline: "Du liebst in Symbolen – jedes Geschenk ist ein Stück deiner Seele.",
            loveLanguage: "Geschenke",
            description: "Für dich ist ein Geschenk niemals 'nur' ein Gegenstand. Es ist verdichtete Aufmerksamkeit. Der Beweis, dass jemand zugehört hat. Dass jemand dich gesehen hat.\n\nDu gibst genauso, wie du empfängst: durchdacht. Jedes Geschenk ist eine kleine Forschungsarbeit. Was braucht dieser Mensch? Was sagt 'Ich kenne dich'?\n\nDu bist der Beweis, dass Aufmerksamkeit die wertvollste Währung ist.",
            stats: [
                { label: "Erinnerung an Details", value: "Elefant" },
                { label: "Geschenk-Recherche", value: "FBI-Level" },
                { label: "Gespeicherte Ideen", value: "Archiv" }
            ],
            allies: ["Die Architektin", "Die Dichterin"],
            nemesis: "Das Refugium",
            accent: colors.gold500,
            accentLight: colors.gold100,
            match: (s: Score) => s.connection <= 10 && s.expression >= 6 && s.expression <= 14
        },
        {
            id: "the_lighthouse",
            title: "Der Leuchtturm",
            symbol: "◈",
            tagline: "Du liebst aus der Distanz – dein Licht reicht weiter, als du weißt.",
            loveLanguage: "Freiheit & Konstanz",
            description: "Du verstehst etwas, das viele als Widerspruch sehen: Liebe braucht Raum. Nicht weil du weniger fühlst, sondern weil du weißt, dass Nähe ohne Freiheit zur Fessel wird.\n\nDu liebst, indem du leuchtest – konstant, verlässlich – aber du verschlingst nicht. Du fühlst intensiv – du brauchst nur nicht die konstante Bestätigung durch Nähe.\n\nDu bist der Beweis, dass Liebe nicht klammern muss, um echt zu sein.",
            stats: [
                { label: "Alleinsein-Bedürfnis", value: "Vital" },
                { label: "Liebe ohne Besitz", value: "Selten" },
                { label: "Konstanz über Jahre", value: "Fels" }
            ],
            allies: ["Die Architektin", "Der Leuchtturm"],
            nemesis: "Die Flamme",
            accent: colors.emerald500,
            accentLight: colors.emerald100,
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

// Heart Icon for intro
const HeartIcon = () => (
    <svg viewBox="0 0 60 60" className="w-20 h-20" style={{ color: colors.emerald700 }}>
        <path d="M30 52 C15 40 5 30 5 20 C5 12 12 5 20 5 C25 5 28 8 30 12 C32 8 35 5 40 5 C48 5 55 12 55 20 C55 30 45 40 30 52Z"
            stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M30 48 C18 38 10 30 10 22 C10 16 15 10 22 10 C26 10 28 12 30 15 C32 12 34 10 38 10 C45 10 50 16 50 22 C50 30 42 38 30 48Z"
            stroke="currentColor" strokeWidth="0.5" fill="currentColor" opacity="0.15" />
    </svg>
);

// Divider ornament
const Divider = ({ width = 200 }: { width?: number }) => (
    <svg viewBox="0 0 200 20" style={{ width, height: 20, color: colors.gold500 }} className="mx-auto opacity-60">
        <path d="M0 10 Q50 5 100 10 Q150 15 200 10" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4" />
        <circle cx="100" cy="10" r="3" fill="currentColor" opacity="0.3" />
        <circle cx="85" cy="10" r="1.5" fill="currentColor" opacity="0.2" />
        <circle cx="115" cy="10" r="1.5" fill="currentColor" opacity="0.2" />
        <path d="M90 10 Q100 5 110 10" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
        <path d="M90 10 Q100 15 110 10" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
    </svg>
);

// Leaf icon
const LeafIcon = () => (
    <svg viewBox="0 0 20 30" className="w-4 h-6" style={{ color: colors.emerald600 }}>
        <path d="M10 2 Q18 10 15 20 Q12 28 10 28 Q8 28 5 20 Q2 10 10 2" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
        <path d="M10 5 L10 25" stroke="currentColor" strokeWidth="0.3" opacity="0.3" />
    </svg>
);

export function LoveLanguagesQuiz() {
    const [stage, setStage] = useState<'intro' | 'quiz' | 'result'>('intro');
    const [currentQ, setCurrentQ] = useState(0);
    const [scores, setScores] = useState({ intensity: 0, expression: 0, connection: 0 });
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [result, setResult] = useState<typeof quizData.profiles[0] | undefined>(undefined);
    const [isAnimating, setIsAnimating] = useState(false);
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
        if ((option as any).psyche_markers) {
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
                    setResult(getProfile(newScores));

                    // LME Update
                    if (updatedMarkers.length > 0) {
                        try {
                            const aggregated = aggregateMarkers(updatedMarkers, 0.7);
                            const currentPsyche = getPsycheState();
                            const newPsyche = updatePsycheState(currentPsyche, aggregated.markerScores, aggregated.reliabilityWeight);
                            savePsycheState(newPsyche);
                        } catch (e) {
                            console.error("LME Update failed", e);
                        }
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

    // INTRO SCREEN - Botanical Light Theme
    if (stage === 'intro') {
        return (
            <div
                className={`min-h-[600px] flex flex-col items-center justify-center p-6 relative overflow-hidden transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
                style={{
                    background: `linear-gradient(180deg, ${colors.stone50} 0%, white 50%, rgba(235, 243, 237, 0.3) 100%)`,
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: colors.emerald800
                }}
            >
                <div className="max-w-md text-center">
                    <HeartIcon />
                    <Divider />

                    <h1
                        className="text-3xl font-light mt-6 mb-3 tracking-wide"
                        style={{ color: colors.emerald900, letterSpacing: '0.05em' }}
                    >
                        {quizData.meta.title}
                    </h1>

                    <p
                        className="text-base mb-6"
                        style={{ color: colors.emerald600, opacity: 0.7 }}
                    >
                        {quizData.meta.subtitle}
                    </p>

                    <Divider width={160} />

                    <div className="text-sm my-6" style={{ color: colors.emerald600, opacity: 0.5 }}>
                        <p className="mb-3">12 Fragen · 2-3 Minuten</p>
                        <p className="text-xs max-w-xs mx-auto leading-relaxed">
                            Entdecke, welche Sprache dein Herz spricht – und warum manche Menschen dich sofort verstehen.
                        </p>
                    </div>

                    <button
                        onClick={handleStart}
                        className="px-12 py-4 rounded-full text-base transition-all hover:scale-105"
                        style={{
                            background: `linear-gradient(135deg, ${colors.emerald700} 0%, ${colors.emerald800} 100%)`,
                            color: 'white',
                            letterSpacing: '0.05em',
                            boxShadow: `0 10px 25px rgba(45, 90, 69, 0.2)`
                        }}
                    >
                        Beginnen
                    </button>

                    <Divider width={100} />
                </div>
            </div>
        );
    }

    // QUIZ SCREEN
    if (stage === 'quiz') {
        const question = quizData.questions[currentQ];

        return (
            <div
                className={`min-h-[600px] flex flex-col relative overflow-hidden transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
                style={{
                    background: `linear-gradient(180deg, ${colors.stone50} 0%, white 50%, rgba(235, 243, 237, 0.2) 100%)`,
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: colors.emerald800
                }}
            >
                {/* Progress bar */}
                <div className="w-full h-1" style={{ background: colors.emerald100 }}>
                    <div
                        className="h-full transition-all duration-500"
                        style={{
                            width: `${progress}%`,
                            background: `linear-gradient(90deg, ${colors.emerald500} 0%, ${colors.gold500} 100%)`
                        }}
                    />
                </div>

                {/* Header */}
                <div
                    className="flex justify-between items-center p-4 text-sm"
                    style={{ color: colors.emerald600, opacity: 0.5 }}
                >
                    <span>{currentQ + 1} von {quizData.questions.length}</span>
                    <Divider width={60} />
                    <span>{Math.round(progress)}%</span>
                </div>

                {/* Question content */}
                <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full px-6">
                    {question.context && (
                        <p
                            className="text-sm mb-4 italic text-center"
                            style={{ color: colors.emerald600, opacity: 0.6 }}
                        >
                            {question.context}
                        </p>
                    )}

                    <h2
                        className="text-xl font-light text-center mb-8 leading-relaxed"
                        style={{ color: colors.emerald900 }}
                    >
                        {question.text}
                    </h2>

                    <div className="space-y-3">
                        {question.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleAnswer(option)}
                                disabled={selectedOption !== null}
                                className={`w-full p-4 text-left rounded-2xl transition-all duration-300 ${selectedOption === option.id
                                        ? 'transform scale-98'
                                        : selectedOption !== null
                                            ? 'opacity-50'
                                            : 'hover:scale-[1.01]'
                                    }`}
                                style={{
                                    background: selectedOption === option.id ? colors.emerald50 : 'white',
                                    border: `2px solid ${selectedOption === option.id ? colors.emerald500 : colors.stone200}`,
                                    color: colors.emerald800
                                }}
                            >
                                <span className="text-sm leading-relaxed">{option.text}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <Divider width={120} />
            </div>
        );
    }

    // RESULT SCREEN
    if (stage === 'result' && result) {
        return (
            <div
                className={`min-h-[600px] flex flex-col p-6 pb-8 overflow-y-auto transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
                style={{
                    background: `linear-gradient(180deg, ${colors.stone50} 0%, white 50%, rgba(235, 243, 237, 0.3) 100%)`,
                    fontFamily: "'Cormorant Garamond', Georgia, serif"
                }}
            >
                <div className="max-w-lg mx-auto w-full">
                    {/* Header */}
                    <div className="text-center pt-8 mb-8">
                        <div
                            className="text-5xl mb-4 font-light"
                            style={{ color: result.accent }}
                        >
                            {result.symbol}
                        </div>

                        <h1
                            className="text-3xl font-light mb-3 tracking-wide"
                            style={{ color: colors.emerald900, letterSpacing: '0.05em' }}
                        >
                            {result.title}
                        </h1>

                        <Divider width={100} />

                        <span
                            className="inline-block px-5 py-2 rounded-full text-sm mt-4 mb-4"
                            style={{
                                background: result.accentLight,
                                color: result.accent
                            }}
                        >
                            {result.loveLanguage}
                        </span>

                        <p
                            className="italic text-sm px-4"
                            style={{ color: colors.emerald700, opacity: 0.7 }}
                        >
                            „{result.tagline}"
                        </p>
                    </div>

                    {/* Description Card */}
                    <div
                        className="rounded-3xl p-6 mb-4"
                        style={{ background: `rgba(232, 240, 236, 0.5)` }}
                    >
                        <p
                            className="text-sm leading-relaxed whitespace-pre-line"
                            style={{ color: colors.emerald800, opacity: 0.85 }}
                        >
                            {result.description}
                        </p>
                    </div>

                    {/* Stats Card */}
                    <div
                        className="rounded-3xl p-6 mb-4"
                        style={{
                            background: 'white',
                            border: `2px solid rgba(45, 90, 69, 0.1)`
                        }}
                    >
                        <h3
                            className="text-xs uppercase tracking-widest mb-4 flex items-center gap-2"
                            style={{ color: colors.emerald600, opacity: 0.6, letterSpacing: '0.1em' }}
                        >
                            <LeafIcon /> Deine Stats
                        </h3>
                        <div className="space-y-3">
                            {result.stats.map((stat, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-sm" style={{ color: colors.emerald700, opacity: 0.8 }}>
                                        {stat.label}
                                    </span>
                                    <span className="font-mono text-sm" style={{ color: result.accent }}>
                                        {stat.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Compatibility Card */}
                    <div
                        className="rounded-3xl p-6 mb-6"
                        style={{
                            background: 'white',
                            border: `2px solid rgba(45, 90, 69, 0.1)`
                        }}
                    >
                        <h3
                            className="text-xs uppercase tracking-widest mb-4 flex items-center gap-2"
                            style={{ color: colors.emerald600, opacity: 0.6, letterSpacing: '0.1em' }}
                        >
                            <HeartIcon /> Kompatibilität
                        </h3>
                        <div className="mb-3">
                            <p className="text-xs mb-1" style={{ color: colors.emerald600, opacity: 0.7 }}>Seelenverwandte:</p>
                            <p className="text-sm" style={{ color: colors.emerald800 }}>{result.allies.join(", ")}</p>
                        </div>
                        <div>
                            <p className="text-xs mb-1" style={{ color: colors.gold600, opacity: 0.7 }}>Herausforderung:</p>
                            <p className="text-sm" style={{ color: colors.emerald800 }}>{result.nemesis}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={handleRestart}
                            className="flex-1 py-4 rounded-2xl text-sm transition-all"
                            style={{
                                background: colors.stone100,
                                color: colors.emerald700,
                                border: `2px solid ${colors.stone200}`
                            }}
                        >
                            Nochmal
                        </button>
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: `Ich bin ${result.title}`,
                                        text: result.tagline,
                                        url: window.location.href
                                    });
                                }
                            }}
                            className="flex-1 py-4 rounded-2xl text-sm text-white transition-all"
                            style={{ background: colors.emerald700 }}
                        >
                            Teilen
                        </button>
                    </div>

                    <Divider width={120} />

                    <p
                        className="text-center text-xs leading-relaxed px-4 mt-4"
                        style={{ color: colors.emerald600, opacity: 0.4 }}
                    >
                        Dieser Test dient der spielerischen Selbstreflexion und stellt keine psychologische Bewertung dar.
                    </p>
                </div>
            </div>
        );
    }

    return null;
}
