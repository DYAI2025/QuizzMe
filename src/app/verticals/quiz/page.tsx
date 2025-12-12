"use client";

import { CosmicBackground } from "@/components/ui/CosmicBackground";
import { QuizSymbol, QuizSymbolVariant } from "@/components/ui/QuizSymbol";

export default function QuizLandingPage() {
    return (
        <CosmicBackground animated>
            <div className="min-h-screen p-8 text-white font-sans">
                <div className="max-w-4xl mx-auto">
                    <header className="text-center mb-16 pt-8">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                            Discover Yourself
                        </h1>
                        <p className="text-xl text-slate-300">
                            Psychological insights, fun revelations, and deep dives into your personality.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <QuizCard
                            href="/verticals/quiz/love-languages"
                            title="Love Languages"
                            desc="Wie liebst du? Entdecke deine primäre Sprache der Liebe."
                            variant="love"
                        />

                        <QuizCard
                            href="/verticals/quiz/celebrity-soulmate"
                            title="Celebrity Soulmate"
                            desc="Welcher Star ist dein energetisches Match? Es wird dich überraschen."
                            variant="celebrity"
                        />

                        <QuizCard
                            href="/verticals/quiz/social-role"
                            title="Social Role"
                            desc="Der Fels, die Flamme, der Spiegel? Wer bist du für andere?"
                            variant="social-role"
                        />

                        <QuizCard
                            href="/verticals/quiz/personality"
                            title="Selbstfürsorge Check"
                            desc="Weltverbesserer oder Selbstbewahrer? Finde deine Balance."
                            variant="personality"
                        />

                        <QuizCard
                            href="/verticals/quiz/rpg-identity"
                            title="RPG Identity"
                            desc="Welche Fantasy-Klasse bist du im echten Leben?"
                            variant="rpg"
                        />
                    </div>

                    <footer className="mt-16 text-center text-slate-500 text-sm pb-8">
                        © 2025 Quiz Platform. For entertainment purposes only.
                    </footer>
                </div>
            </div>
        </CosmicBackground>
    )
}

function QuizCard({ href, title, desc, variant }: { href: string, title: string, desc: string, variant: QuizSymbolVariant }) {
    return (
        <a href={href} className="group block relative overflow-hidden rounded-2xl bg-slate-900/40 border border-white/10 hover:border-white/30 hover:bg-slate-900/60 transition-all duration-300 backdrop-blur-sm">
            <div className="p-6 flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <QuizSymbol variant={variant} size="medium" interactive className="group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2 text-slate-100 group-hover:text-white transition-colors">{title}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">{desc}</p>
                </div>
            </div>
        </a>
    )
}
