export default function QuizLandingPage() {
    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        Discover Yourself
                    </h1>
                    <p className="text-xl text-purple-200">
                        Psychological insights, fun revelations, and deep dives into your personality.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <QuizCard
                        href="/love-languages"
                        title="Love Languages"
                        desc="Wie liebst du? Entdecke deine primäre Sprache der Liebe."
                        icon="❤️"
                        color="from-pink-500 to-rose-600"
                    />

                    <QuizCard
                        href="/celebrity-soulmate"
                        title="Celebrity Soulmate"
                        desc="Welcher Star ist dein energetisches Match? Es wird dich überraschen."
                        icon="✨"
                        color="from-amber-400 to-orange-500"
                    />

                    <QuizCard
                        href="/social-role"
                        title="Social Role"
                        desc="Der Fels, die Flamme, der Spiegel? Wer bist du für andere?"
                        icon="👥"
                        color="from-violet-500 to-purple-600"
                    />

                    <QuizCard
                        href="/personality"
                        title="Selbstfürsorge Check"
                        desc="Weltverbesserer oder Selbstbewahrer? Finde deine Balance."
                        icon="🪞"
                        color="from-emerald-400 to-teal-600"
                    />

                    <QuizCard
                        href="/rpg-identity"
                        title="RPG Identity"
                        desc="Welche Fantasy-Klasse bist du im echten Leben? Paladin, Schurke, Seher?"
                        icon="⚔️"
                        color="from-indigo-500 to-blue-600"
                    />
                </div>

                <footer className="mt-16 text-center text-purple-300/50 text-sm">
                    © 2025 Quiz Platform. For entertainment purposes only.
                </footer>
            </div>
        </div>
    )
}

function QuizCard({ href, title, desc, icon, color }: { href: string, title: string, desc: string, icon: string, color: string }) {
    return (
        <a href={href} className="group block relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl">
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${color}`}></div>
            <div className="p-6 pl-8">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 origin-left">{icon}</div>
                <h2 className="text-xl font-bold mb-2 text-white group-hover:text-purple-200 transition-colors">{title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">{desc}</p>
            </div>
        </a>
    )
}
