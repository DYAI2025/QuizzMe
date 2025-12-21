
"use client";

import Link from "next/link";
import { QuizSymbol, QuizSymbolVariant } from "@/components/ui/QuizSymbol";
import { useEffect, useState } from "react";

interface QuizType {
  href: string;
  title: string;
  description: string;
  variant: QuizSymbolVariant;
}

const quizzes: QuizType[] = [
  {
    href: "/verticals/quiz/aura-colors",
    title: "Deine Aurafarben",
    description: "Welche Farbe hat deine Aura? Entdecke das unsichtbare Licht deiner Seele.",
    variant: "aura",
  },
  {
    href: "/verticals/quiz/social-role",
    title: "Soziale Rolle",
    description: "Der Fels, die Flamme, der Spiegel? Wer bist du für andere?",
    variant: "social-role",
  },
  {
    href: "/verticals/quiz/rpg-identity",
    title: "Krafttier (RPG Identity)",
    description: "Entdecke dein inneres Krafttier und deine archetypische Klasse.",
    variant: "rpg",
  },
  {
    href: "/verticals/quiz/destiny",
    title: "Career DNA (Destiny)",
    description: "Entschlüssele deinen karmischen Karriere-Code.",
    variant: "destiny",
  },
  {
    href: "/verticals/quiz/spotlight",
    title: "Spotlight",
    description: "Bist du bereit für die Bühne des Lebens?",
    variant: "celebrity", // Using 'celebrity' as proxy for Spotlight theme
  },
  {
    href: "/verticals/quiz/party",
    title: "Party Bedürfnis",
    description: "Wie viel Feier steckt wirklich in dir?",
    variant: "personality", // Using 'personality' as proxy for Party theme
  },
  {
    href: "/verticals/quiz/love-languages",
    title: "Die 5 Sprachen der Liebe",
    description: "Wie liebst du? Entdecke deine primäre Sprache der Liebe.",
    variant: "love",
  },
];

interface Particle {
  width: number;
  height: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

export default function QuizLandingPage() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate random particles only on the client
    const newParticles = Array.from({ length: 12 }).map(() => ({
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 15 + 20,
      delay: Math.random() * 8,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(newParticles);
  }, []);

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "linear-gradient(135deg, #F7F0E6 0%, #F2E3CF 50%, #FEFBF5 100%)",
      }}
    >
      {/* Subtle constellation background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1200 900" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="constellation-pattern" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="#D2A95A" opacity="0.5" />
              <circle cx="90" cy="60" r="1" fill="#D2A95A" opacity="0.3" />
              <circle cx="150" cy="120" r="1.5" fill="#D2A95A" opacity="0.4" />
              <circle cx="60" cy="150" r="1" fill="#6CA192" opacity="0.2" />
              <circle cx="200" cy="80" r="1.2" fill="#6CA192" opacity="0.25" />
              <circle cx="240" cy="200" r="1" fill="#D2A95A" opacity="0.35" />
              <line x1="30" y1="30" x2="90" y2="60" stroke="#D2A95A" strokeWidth="0.3" opacity="0.15" />
              <line x1="90" y1="60" x2="150" y2="120" stroke="#D2A95A" strokeWidth="0.3" opacity="0.15" />
              <line x1="150" y1="120" x2="200" y2="80" stroke="#6CA192" strokeWidth="0.3" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="1200" height="900" fill="url(#constellation-pattern)" />
        </svg>
      </div>

      {/* Floating mystical particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${p.width}px`,
              height: `${p.height}px`,
              background: i % 3 === 0 ? '#D2A95A' : i % 3 === 1 ? '#6CA192' : '#A77D38',
              opacity: 0.12,
              left: `${p.left}%`,
              top: `${p.top}%`,
              animation: `float-quiz ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Gold accent line - top decorative */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, #D2A95A, transparent)" }}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <header className="text-center mb-20 pt-8 md:pt-12">
            {/* Decorative ornament */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-px" style={{ background: "#D2A95A" }}></div>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D2A95A" strokeWidth="1" className="mx-4">
                <circle cx="16" cy="16" r="14" />
                <circle cx="16" cy="16" r="10" />
                <circle cx="16" cy="16" r="6" />
                <circle cx="16" cy="16" r="2" fill="#D2A95A" />
              </svg>
              <div className="w-12 h-px" style={{ background: "#D2A95A" }}></div>
            </div>

            {/* Main heading */}
            <h1
              className="text-5xl md:text-7xl font-serif font-light mb-6 tracking-wide"
              style={{ color: "#053B3F", letterSpacing: "0.02em" }}
            >
              Entdecke Dich Selbst
            </h1>

            {/* Subheading */}
            <p
              className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8"
              style={{ color: "#6CA192", fontWeight: 400 }}
            >
              Mysterium und Klarheit vereint. Finde deine wahre Natur durch reflektierte Quizze und persönliche Erkenntnisse.
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-px" style={{ background: "#D2A95A" }}></div>
              <span style={{ color: "#D2A95A" }}>◆</span>
              <div className="w-8 h-px" style={{ background: "#D2A95A" }}></div>
            </div>
          </header>

          {/* Quiz Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.variant} {...quiz} />
            ))}
          </div>

          {/* Trust/Info Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-serif font-light mb-3"
                style={{ color: "#053B3F" }}
              >
                Warum QuizzMe?
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-px" style={{ background: "#D2A95A" }}></div>
                <span style={{ color: "#D2A95A", fontSize: "12px" }}>✦</span>
                <div className="w-6 h-px" style={{ background: "#D2A95A" }}></div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <TrustCard
                icon="◆"
                title="Reflektierte Auswertung"
                description="Basierend auf bewährten psychologischen Modellen und therapeutischen Ansätzen."
              />
              <TrustCard
                icon="✦"
                title="Persönliche Tiefe"
                description="Deine Ergebnisse werden speziell für deine Persönlichkeit generiert."
              />
              <TrustCard
                icon="✧"
                title="Nachhaltige Einsicht"
                description="Echte Erkenntnisse für dein Wachstum und deine Selbsterkenntnis."
              />
            </div>
          </section>

          {/* Featured Destiny Section */}
          <section className="mb-20">
            <Link
              href="/verticals/horoscope"
              className="group block rounded-lg overflow-hidden transition-all duration-500 hover:shadow-lg"
              style={{
                background: "#F7F0E6",
                border: "1px solid #D2A95A",
              }}
            >
              <div className="p-10 md:p-16 flex flex-col md:flex-row items-center gap-12">
                {/* Symbol */}
                <div className="flex-shrink-0 w-40 h-40 flex items-center justify-center">
                  <QuizSymbol
                    variant="destiny"
                    size="large"
                    state="default"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3
                    className="text-3xl md:text-4xl font-serif font-light mb-4"
                    style={{ color: "#053B3F" }}
                  >
                    Dein Schicksal im Kosmos
                  </h3>
                  <p
                    className="text-base md:text-lg leading-relaxed mb-6"
                    style={{ color: "#6CA192" }}
                  >
                    Tritt in unsere Astrologie-Sphäre ein und entdecke die kosmischen Muster, die dein Leben gestalten. Erkunde Sternzeichen, tägliche Vorhersagen und himmlische Führung.
                  </p>
                  <div
                    className="inline-flex items-center font-medium group-hover:translate-x-1 transition-transform"
                    style={{ color: "#A77D38" }}
                  >
                    Zu den Sternen <span className="ml-2">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>

          {/* Footer */}
          <footer
            className="text-center py-12 border-t border-opacity-20"
            style={{ borderColor: "#D2A95A", color: "#6CA192" }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px" style={{ background: "#D2A95A" }}></div>
              <span style={{ color: "#D2A95A", fontSize: "12px" }}>◇</span>
              <div className="w-8 h-px" style={{ background: "#D2A95A" }}></div>
            </div>
            <p className="text-sm">
              © 2025 QuizzMe. Mystik trifft Substanz.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

type QuizCardProps = QuizType;

function QuizCard({ href, title, description, variant }: QuizCardProps) {
  return (
    <Link
      href={href}
      className="group block h-full rounded-lg transition-all duration-500 hover:shadow-lg"
      style={{
        background: "#F7F0E6",
        border: "1px solid #D2A95A",
      }}
    >
      <div className="p-8 flex flex-col h-full">
        {/* Symbol Container */}
        <div className="mb-6 flex justify-center h-28 group-hover:scale-105 transition-transform duration-500">
          <QuizSymbol
            variant={variant}
            size="medium"
            state="default"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3
            className="text-lg md:text-xl font-serif font-light mb-3 text-center leading-tight"
            style={{ color: "#053B3F" }}
          >
            {title}
          </h3>

          <p
            className="text-sm leading-relaxed flex-1 text-center"
            style={{ color: "#6CA192", lineHeight: 1.6 }}
          >
            {description}
          </p>
        </div>

        {/* CTA */}
        <div
          className="mt-6 pt-6 text-center text-sm font-medium group-hover:translate-y-(-1) transition-all duration-300"
          style={{ color: "#A77D38", borderTop: "1px solid #D2A95A" }}
        >
          Quiz starten
        </div>
      </div>
    </Link>
  );
}

interface TrustCardProps {
  icon: string;
  title: string;
  description: string;
}

function TrustCard({ icon, title, description }: TrustCardProps) {
  return (
    <div
      className="p-8 rounded-lg text-center group hover:shadow-md transition-all duration-300"
      style={{
        background: "#F7F0E6",
        border: "1px solid #D2A95A",
      }}
    >
      <div
        className="text-4xl mb-4 group-hover:scale-110 transition-transform"
        style={{ color: "#D2A95A" }}
      >
        {icon}
      </div>
      <h4
        className="text-lg font-serif font-light mb-2"
        style={{ color: "#053B3F" }}
      >
        {title}
      </h4>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "#6CA192" }}
      >
        {description}
      </p>
    </div>
  );
}