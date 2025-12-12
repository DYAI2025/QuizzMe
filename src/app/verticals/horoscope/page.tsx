"use client";

import { CosmicBackground } from "@/components/ui/CosmicBackground";
import { QuizSymbol } from "@/components/ui/QuizSymbol";

export default function HoroscopeLandingPage() {
    return (
        <CosmicBackground>
            <div className="min-h-screen p-8 text-white font-serif">
                <div className="max-w-4xl mx-auto">
                    <header className="text-center mb-16 pt-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-100 tracking-wide drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                            Horoscope & Destiny
                        </h1>
                        <p className="text-amber-200/60 italic text-lg">
                            The stars are just the beginning.
                        </p>
                    </header>

                    {/* Featured Access */}
                    <div className="mb-16">
                        <a href="/quiz/destiny" className="block w-full p-8 rounded-2xl bg-slate-900/40 border border-amber-500/30 hover:border-amber-400/50 hover:bg-slate-900/60 transition-all group text-center backdrop-blur-sm relative overflow-hidden">
                            {/* Subtle amber glow behind the card */}
                            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="mb-6">
                                    <QuizSymbol variant="destiny" size="large" interactive isCta />
                                </div>
                                <h2 className="text-2xl font-bold text-amber-100 mb-2">Destiny Check</h2>
                                <p className="text-amber-200/70 max-w-lg mx-auto mb-6">
                                    Bist du zu Höherem bestimmt? Mache den Test und entdecke dein wahres Potenzial jenseits der Sterne.
                                </p>
                                <div className="inline-block px-8 py-3 rounded-full border border-amber-500/50 text-amber-200 text-sm group-hover:bg-amber-500/10 group-hover:text-amber-100 transition-all font-sans uppercase tracking-wider">
                                    Jetzt starten
                                </div>
                            </div>
                        </a>
                    </div>

                    <h3 className="text-center text-amber-500/50 text-xs uppercase tracking-widest mb-8 font-sans">Daily Insights</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(sign => (
                            <a href={`/verticals/horoscope/${sign.toLowerCase()}`} key={sign} className="aspect-square flex flex-col items-center justify-center p-4 bg-slate-900/30 rounded-xl border border-white/5 hover:bg-slate-800/50 hover:border-amber-500/30 text-center cursor-pointer transition-all group backdrop-blur-sm">
                                <span className="text-3xl mb-3 opacity-50 group-hover:opacity-100 transition-opacity filter drop-shadow-lg">✨</span>
                                <span className="text-slate-300 font-medium group-hover:text-amber-200 transition-colors uppercase text-xs tracking-wider">{sign}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </CosmicBackground>
    )
}
