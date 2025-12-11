import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-amber-500 bg-clip-text text-transparent mb-8">
          Discover Yourself
        </h1>
        <p className="text-slate-400 text-xl mb-16 max-w-2xl mx-auto">
          Explore your personality, destiny, and social roles through our immersive quizzes.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/verticals/quiz" className="group relative block p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all text-left overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <span className="text-4xl mb-4 block">🧠</span>
              <h2 className="text-3xl font-bold text-white mb-2">Quiz Vertical</h2>
              <p className="text-slate-400">Psychological tests, Love Languages, and RPG Identity.</p>
              <div className="mt-8 flex items-center text-purple-400 font-medium arrow-link">
                Explore Quizzes <span className="ml-2">→</span>
              </div>
            </div>
          </Link>

          <Link href="/verticals/horoscope" className="group relative block p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all text-left overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <span className="text-4xl mb-4 block">🔮</span>
              <h2 className="text-3xl font-bold text-white mb-2">Horoscope Vertical</h2>
              <p className="text-slate-400">Daily insights, Zodiac compatibility, and Destiny checks.</p>
              <div className="mt-8 flex items-center text-amber-400 font-medium arrow-link">
                View Stars <span className="ml-2">→</span>
              </div>
            </div>
          </Link>
        </div>

        <footer className="mt-24 text-slate-600 text-sm">
          © 2024 DYAI Quiz Platform. Built with Next.js.
        </footer>
      </div>
    </div>
  );
}
