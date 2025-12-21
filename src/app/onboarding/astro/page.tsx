"use client";

/**
 * Astro Onboarding Page
 *
 * Collects birth information and initializes character sheet with astro anchors.
 * This is a runOnce module - can only be completed once per profile.
 */

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { buildAstroOnboardingEvent, previewAstro, BuildAstroEventInput } from "@/modules/onboarding/astro/buildEvent";
import { contributeClient, getSnapshotClient } from "@/lib/api";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type Step = "input" | "preview" | "submitting" | "complete" | "error";

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function AstroOnboardingPage() {
  const router = useRouter();

  // Form state
  const [birthDate, setBirthDate] = useState<string>("");
  const [birthTime, setBirthTime] = useState<string>("");
  const [knowsTime, setKnowsTime] = useState<boolean>(false);

  // UI state
  const [step, setStep] = useState<Step>("input");
  const [error, setError] = useState<string>("");
  const [alreadyCompleted, setAlreadyCompleted] = useState<boolean>(false);

  // Check if already completed on mount
  useState(() => {
    getSnapshotClient().then((result) => {
      // Check if astro onboarding was already completed
      // by looking at the snapshot
      if (!result.isNew && result.snapshot.astro?.western?.sunSign) {
        setAlreadyCompleted(true);
      }
    });
  });

  // Build the input from form state
  const buildInput = useCallback((): BuildAstroEventInput | null => {
    if (!birthDate) return null;

    const date = new Date(birthDate);
    if (isNaN(date.getTime())) return null;

    const input: BuildAstroEventInput = {
      birthDate: date,
    };

    if (knowsTime && birthTime) {
      const [hours, minutes] = birthTime.split(":").map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        input.birthTime = { hour: hours, minute: minutes };
      }
    }

    return input;
  }, [birthDate, birthTime, knowsTime]);

  // Preview the astro data
  const preview = useMemo(() => {
    const input = buildInput();
    if (!input) return null;
    return previewAstro(input);
  }, [buildInput]);

  // Handle form submission to preview
  const handlePreview = useCallback(() => {
    if (!preview) {
      setError("Please enter your birth date");
      return;
    }
    setStep("preview");
    setError("");
  }, [preview]);

  // Handle final submission
  const handleSubmit = useCallback(async () => {
    const input = buildInput();
    if (!input) {
      setError("Invalid birth date");
      return;
    }

    setStep("submitting");
    setError("");

    try {
      const event = buildAstroOnboardingEvent(input);
      const result = await contributeClient(event);

      if (result.accepted) {
        setStep("complete");
        // Redirect to character sheet after a brief delay
        setTimeout(() => {
          router.push("/character");
        }, 2000);
      } else {
        setError(result.error ?? "Submission failed");
        setStep("error");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStep("error");
    }
  }, [buildInput, router]);

  // Handle back to input
  const handleBack = useCallback(() => {
    setStep("input");
    setError("");
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Already Completed
  // ═══════════════════════════════════════════════════════════════════════════

  if (alreadyCompleted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-2xl font-bold mb-4">Already Completed</h1>
          <p className="text-slate-400 mb-6">
            You&apos;ve already set up your cosmic profile. Your character sheet
            is ready to explore!
          </p>
          <button
            onClick={() => router.push("/character")}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            View Character Sheet
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Input Step
  // ═══════════════════════════════════════════════════════════════════════════

  if (step === "input") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌟</div>
            <h1 className="text-2xl font-bold mb-2">Cosmic Setup</h1>
            <p className="text-slate-400">
              Enter your birth date to discover your cosmic blueprint
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Birth Date
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={knowsTime}
                  onChange={(e) => setKnowsTime(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-300">
                  I know my birth time
                </span>
              </label>
            </div>

            {knowsTime && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Birth Time (optional, for future ascendant calculation)
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handlePreview}
              disabled={!birthDate}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Discover My Cosmic Sign
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Preview Step
  // ═══════════════════════════════════════════════════════════════════════════

  if (step === "preview" && preview) {
    const sunSign = preview.western.sunSign;
    const element = {
      fire: "🔥",
      earth: "🌍",
      air: "💨",
      water: "🌊",
    }[
      sunSign === "aries" || sunSign === "leo" || sunSign === "sagittarius"
        ? "fire"
        : sunSign === "taurus" || sunSign === "virgo" || sunSign === "capricorn"
          ? "earth"
          : sunSign === "gemini" || sunSign === "libra" || sunSign === "aquarius"
            ? "air"
            : "water"
    ];

    const zodiacEmojis: Record<string, string> = {
      aries: "♈",
      taurus: "♉",
      gemini: "♊",
      cancer: "♋",
      leo: "♌",
      virgo: "♍",
      libra: "♎",
      scorpio: "♏",
      sagittarius: "♐",
      capricorn: "♑",
      aquarius: "♒",
      pisces: "♓",
    };

    const chineseEmojis: Record<string, string> = {
      rat: "🐀",
      ox: "🐂",
      tiger: "🐅",
      rabbit: "🐇",
      dragon: "🐉",
      snake: "🐍",
      horse: "🐴",
      goat: "🐐",
      monkey: "🐒",
      rooster: "🐓",
      dog: "🐕",
      pig: "🐷",
    };

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {zodiacEmojis[sunSign] || "✨"}
            </div>
            <h1 className="text-2xl font-bold mb-2">Your Cosmic Blueprint</h1>
            <p className="text-slate-400">
              This is your unique astrological signature
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{zodiacEmojis[sunSign]}</span>
                <div>
                  <p className="text-sm text-slate-400">Sun Sign</p>
                  <p className="text-lg font-semibold capitalize">{sunSign}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{element}</span>
                <div>
                  <p className="text-sm text-slate-400">Element</p>
                  <p className="text-lg font-semibold capitalize">
                    {sunSign === "aries" ||
                    sunSign === "leo" ||
                    sunSign === "sagittarius"
                      ? "Fire"
                      : sunSign === "taurus" ||
                          sunSign === "virgo" ||
                          sunSign === "capricorn"
                        ? "Earth"
                        : sunSign === "gemini" ||
                            sunSign === "libra" ||
                            sunSign === "aquarius"
                          ? "Air"
                          : "Water"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {chineseEmojis[preview.chinese.animal]}
                </span>
                <div>
                  <p className="text-sm text-slate-400">Chinese Zodiac</p>
                  <p className="text-lg font-semibold capitalize">
                    {preview.chinese.element} {preview.chinese.animal}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {preview.chinese.yinYang === "yin" ? "☯️" : "☯️"}
                </span>
                <div>
                  <p className="text-sm text-slate-400">Energy</p>
                  <p className="text-lg font-semibold capitalize">
                    {preview.chinese.yinYang}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Create My Character Sheet
            </button>
            <button
              onClick={handleBack}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Change Birth Date
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Submitting Step
  // ═══════════════════════════════════════════════════════════════════════════

  if (step === "submitting") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 rounded-xl p-8 text-center">
          <div className="animate-spin text-6xl mb-4">✨</div>
          <h1 className="text-2xl font-bold mb-2">Creating Your Profile...</h1>
          <p className="text-slate-400">
            Calculating your cosmic coordinates
          </p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Complete Step
  // ═══════════════════════════════════════════════════════════════════════════

  if (step === "complete") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-2">Profile Created!</h1>
          <p className="text-slate-400 mb-6">
            Your cosmic blueprint has been recorded. Redirecting to your
            character sheet...
          </p>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 animate-pulse w-full" />
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Error Step
  // ═══════════════════════════════════════════════════════════════════════════

  if (step === "error") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-2">Something Went Wrong</h1>
          <p className="text-red-400 mb-6">{error || "Unknown error"}</p>
          <button
            onClick={handleBack}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
