"use client";

/**
 * Character Sheet Page v2
 *
 * Renders the character sheet from ProfileSnapshot.
 * Works in both dev (API) and static (localStorage) modes.
 *
 * Structure:
 * - Header: Zodiac wheel, archetype, completion
 * - Body: Trait blocks A-K
 */

import { useProfileSnapshot } from "@/hooks";
import {
  CharacterHeader,
  TraitBlock,
  UnlocksBlock,
  BLOCKS,
} from "@/components/character-v2";

export default function CharacterSheetPage() {
  const { snapshot, isLoading, isNew, error, mode } = useProfileSnapshot();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🔮</div>
          <p className="text-indigo-400 font-medium">
            Profil wird geladen...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-400 font-medium mb-2">
            Fehler beim Laden
          </p>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // New user / no data state
  if (isNew || !snapshot) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-2xl font-bold text-slate-100 mb-3">
            Willkommen!
          </h1>
          <p className="text-slate-400 mb-6">
            Dein Charakterbogen ist noch leer. Mache ein Quiz um dein Profil zu erstellen.
          </p>
          <a
            href="/verticals/quiz"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            <span>Quiz starten</span>
            <span>→</span>
          </a>
        </div>
      </div>
    );
  }

  // Get trait blocks (exclude unlocks block - handled separately)
  const traitBlocks = BLOCKS.filter((b) => b.id !== "block.unlocks");

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header Block */}
      <CharacterHeader snapshot={snapshot} />

      {/* Mode indicator (dev only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="max-w-4xl mx-auto px-4 mb-4">
          <span className="text-xs text-slate-600 bg-slate-800 px-2 py-1 rounded">
            Mode: {mode}
          </span>
        </div>
      )}

      {/* Trait Blocks Grid */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {traitBlocks.map((block) => (
            <TraitBlock
              key={block.id}
              config={block}
              traits={snapshot.traits}
            />
          ))}

          {/* Unlocks Block (full width) */}
          <div className="md:col-span-2">
            <UnlocksBlock unlocks={snapshot.unlocks} />
          </div>
        </div>
      </div>
    </main>
  );
}
