"use client";

import Link from "next/link";
import { ProfileTeaser } from "../components/home/ProfileTeaser";
import { QuizSymbol } from "@/components/ui/QuizSymbol";

export default function Home() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #F7F0E6 0%, #F2E3CF 50%, #FEFBF5 100%)",
      }}
    >
      {/* Subtle mystical background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg viewBox="0 0 1200 900" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="home-constellation" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#D2A95A" opacity="0.4" />
              <circle cx="150" cy="100" r="1.5" fill="#D2A95A" opacity="0.3" />
              <circle cx="250" cy="180" r="2" fill="#6CA192" opacity="0.3" />
              <circle cx="100" cy="220" r="1" fill="#D2A95A" opacity="0.2" />
              <circle cx="320" cy="280" r="1.5" fill="#6CA192" opacity="0.25" />
              <line x1="50" y1="50" x2="150" y2="100" stroke="#D2A95A" strokeWidth="0.5" opacity="0.2" />
              <line x1="150" y1="100" x2="250" y2="180" stroke="#D2A95A" strokeWidth="0.5" opacity="0.15" />
            </pattern>
          </defs>
          <rect width="1200" height="900" fill="url(#home-constellation)" />
        </svg>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: i % 2 === 0 ? '#D2A95A' : '#6CA192',
              opacity: 0.15,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        <ProfileTeaser />
        
        <div className="max-w-4xl w-full text-center">
          {/* Decorative header ornament */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-px" style={{ background: "#D2A95A" }}></div>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#D2A95A" strokeWidth="1" className="mx-4">
              <circle cx="20" cy="20" r="18" opacity="0.3" />
              <circle cx="20" cy="20" r="14" opacity="0.5" />
              <circle cx="20" cy="20" r="10" opacity="0.7" />
              <circle cx="20" cy="20" r="3" fill="#D2A95A" />
              <path d="M20 2 L20 8" opacity="0.6" />
              <path d="M20 32 L20 38" opacity="0.6" />
              <path d="M2 20 L8 20" opacity="0.6" />
              <path d="M32 20 L38 20" opacity="0.6" />
            </svg>
            <div className="w-16 h-px" style={{ background: "#D2A95A" }}></div>
          </div>

          <h1
            className="text-5xl md:text-7xl font-serif font-light mb-6 tracking-wide"
            style={{ color: "#053B3F", letterSpacing: "0.02em" }}
          >
            Entdecke Dich Selbst
          </h1>
          
          <p
            className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#6CA192" }}
          >
            Mysterium und Klarheit vereint. Erkunde deine Persönlichkeit, dein Schicksal und deine sozialen Rollen.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mb-16">
            <div className="w-12 h-px" style={{ background: "#D2A95A" }}></div>
            <span style={{ color: "#D2A95A" }}>◆</span>
            <div className="w-12 h-px" style={{ background: "#D2A95A" }}></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Link
              href="/verticals/quiz"
              className="group block p-10 rounded-2xl transition-all duration-500 text-left overflow-hidden hover:shadow-lg"
              style={{
                background: "#F7F0E6",
                border: "1px solid #D2A95A",
              }}
            >
              <div className="mb-6 flex justify-center">
                <QuizSymbol variant="personality" size="large" state="default" />
              </div>
              <h2
                className="text-3xl font-serif font-light mb-3 text-center"
                style={{ color: "#053B3F" }}
              >
                Quiz Welt
              </h2>
              <p style={{ color: "#6CA192" }} className="text-center leading-relaxed mb-6">
                Psychologische Tests, Liebessprachen und RPG Identität. Entdecke die Facetten deiner Persönlichkeit.
              </p>
              <div
                className="text-center font-medium group-hover:translate-x-1 transition-transform"
                style={{ color: "#A77D38" }}
              >
                Quizze erkunden <span className="ml-2">→</span>
              </div>
            </Link>

            <Link
              href="/verticals/horoscope"
              className="group block p-10 rounded-2xl transition-all duration-500 text-left overflow-hidden hover:shadow-lg"
              style={{
                background: "#F7F0E6",
                border: "1px solid #D2A95A",
              }}
            >
              <div className="mb-6 flex justify-center">
                <QuizSymbol variant="destiny" size="large" state="default" />
              </div>
              <h2
                className="text-3xl font-serif font-light mb-3 text-center"
                style={{ color: "#053B3F" }}
              >
                Horoskop Welt
              </h2>
              <p style={{ color: "#6CA192" }} className="text-center leading-relaxed mb-6">
                Tägliche Einsichten, Sternzeichen-Kompatibilität und Schicksalschecks. Dein kosmischer Wegweiser.
              </p>
              <div
                className="text-center font-medium group-hover:translate-x-1 transition-transform"
                style={{ color: "#A77D38" }}
              >
                Zu den Sternen <span className="ml-2">→</span>
              </div>
            </Link>
          </div>

          <footer
            className="mt-12 pt-8 text-sm border-t border-opacity-20"
            style={{ borderColor: "#D2A95A", color: "#6CA192" }}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-px" style={{ background: "#D2A95A" }}></div>
              <span style={{ color: "#D2A95A", fontSize: "10px" }}>✦</span>
              <div className="w-8 h-px" style={{ background: "#D2A95A" }}></div>
            </div>
            <p>© 2025 QuizzMe. Mystik trifft Substanz.</p>
          </footer>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }
      `}</style>
    </div>
  );
}