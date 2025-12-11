export default function HoroscopeLandingPage() {
    return (
        <div className="min-h-screen p-8 bg-slate-900 text-white font-serif">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-100 tracking-wide">
                        Horoscope & Destiny
                    </h1>
                    <p className="text-amber-200/60 italic">
                        The stars are just the beginning.
                    </p>
                </header>

                {/* Featured Access */}
                <div className="mb-16">
                    <a href="/quiz/destiny" className="block w-full p-8 rounded-2xl bg-gradient-to-r from-amber-900/40 to-slate-800 border border-amber-500/30 hover:border-amber-400/50 transition-all group text-center">
                        <span className="text-4xl mb-4 block">🔮</span>
                        <h2 className="text-2xl font-bold text-amber-100 mb-2">Destiny Check</h2>
                        <p className="text-amber-200/70 max-w-lg mx-auto">
                            Bist du zu Höherem bestimmt? Mache den Test und entdecke dein wahres Potenzial jenseits der Sterne.
                        </p>
                        <div className="mt-6 inline-block px-6 py-2 rounded-full border border-amber-500/50 text-amber-200 text-sm group-hover:bg-amber-500/10 transition-colors">
                            Jetzt starten
                        </div>
                    </a>
                </div>

                <h3 className="text-center text-amber-500/50 text-xs uppercase tracking-widest mb-8">Daily Insights</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(sign => (
                        <a href={`/verticals/horoscope/${sign.toLowerCase()}`} key={sign} className="aspect-square flex flex-col items-center justify-center p-4 bg-slate-800/50 rounded-xl border border-white/5 hover:bg-slate-800 hover:border-amber-500/30 text-center cursor-pointer transition-all group">
                            <span className="text-2xl mb-2 opacity-50 group-hover:opacity-100 transition-opacity">✨</span>
                            <span className="text-slate-300 font-medium group-hover:text-amber-200 transition-colors">{sign}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}
