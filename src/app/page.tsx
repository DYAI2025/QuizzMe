"use client";

import Link from "next/link";
import { ProfileTeaser } from "../components/home/ProfileTeaser";
import { CosmicBackground } from "@/components/ui/CosmicBackground";
import { QuizSymbol } from "@/components/ui/QuizSymbol";

export default function Home() {
  return (
    <CosmicBackground animated>
      <div className="min-h-screen flex flex-col items-center justify-center p-8 font-sans text-white">
        <ProfileTeaser />
        <div className="max-w-4xl w-full text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-amber-200 bg-clip-text text-transparent mb-8 drop-shadow-[0_0_25px_rgba(59,130,246,0.3)]">
            Discover Yourself
          </h1>
          <p className="text-slate-300 text-xl mb-16 max-w-2xl mx-auto">
            Explore your personality, destiny, and social roles through our immersive quizzes.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/verticals/quiz" className="group relative block p-8 rounded-3xl bg-slate-900/40 border border-slate-700/50 hover:border-purple-500/50 transition-all text-left overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="mb-6">
                  <QuizSymbol variant="social-role" size="medium" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Quiz Vertical</h2>
                <p className="text-slate-400 group-hover:text-slate-200 transition-colors">Psychological tests, Love Languages, and RPG Identity.</p>
                <div className="mt-8 flex items-center text-purple-400 font-medium arrow-link group-hover:text-purple-300">
                  Explore Quizzes <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>

            <Link href="/verticals/horoscope" className="group relative block p-8 rounded-3xl bg-slate-900/40 border border-slate-700/50 hover:border-amber-500/50 transition-all text-left overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="mb-6">
                  <QuizSymbol variant="destiny" size="medium" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Horoscope Vertical</h2>
                <p className="text-slate-400 group-hover:text-slate-200 transition-colors">Daily insights, Zodiac compatibility, and Destiny checks.</p>
                <div className="mt-8 flex items-center text-amber-400 font-medium arrow-link group-hover:text-amber-300">
                  View Stars <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          </div>

          <footer className="mt-24 text-slate-500 text-sm">
            © 2024 DYAI Quiz Platform. Built with Next.js.
          </footer>
        </div>
      </div>
    </CosmicBackground>
  );
}
