
import React from 'react';
import { CharacterHeader, TraitBlock, UnlocksBlock, BLOCKS } from '@/components/character-v2';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { ProfileSnapshot } from '@/lib/lme/types'; // Assuming this import exists or similar

interface ProfileSpineProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  snapshot: any; // Using any for now to avoid deep type imports issues, should be ProfileSnapshot
  showIntro?: boolean;
}

/**
 * ProfileSpine ("The Book of Self")
 * 
 * The main content column of the dashboard. 
 * Displays the character header and trait blocks in a structured "spine" layout.
 */
export function ProfileSpine({ snapshot, showIntro = false }: ProfileSpineProps) {
  // Filter blocks
  const traitBlocks = BLOCKS.filter((b) => b.id !== "block.unlocks");

  return (
    <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
      {/* Intro Banner for New Users */}
      {showIntro && (
        <div className="rounded-xl p-8 bg-gradient-to-r from-indigo-900/40 to-neutral-900/40 border border-indigo-500/30 backdrop-blur-md mb-8">
            <h2 className="text-2xl font-serif text-white mb-2">Willkommen am Altar</h2>
            <p className="text-slate-300 mb-4">Dein Buch des Selbst ist noch leer. Fülle es mit Leben.</p>
            <a href="/verticals/quiz" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors inline-block">
                Erstes Quiz starten
            </a>
        </div>
      )}

      {/* Basic Skeleton or Empty State if no snapshot */}
      {!snapshot ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-30 pointer-events-none filter grayscale">
            {/* Placeholder Visuals (Ghost Book) */}
             <div className="h-64 bg-neutral-800/50 rounded-2xl border border-dashed border-white/10 flex items-center justify-center">
                <span className="text-4xl opacity-20">?</span>
             </div>
             <div className="h-64 bg-neutral-800/50 rounded-2xl border border-dashed border-white/10 flex items-center justify-center">
                <span className="text-4xl opacity-20">?</span>
             </div>
        </div>
      ) : (
        <>
            {/* Mystic Header Container */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-neutral-900/50 backdrop-blur-sm relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-1000"></div>
                <CharacterHeader snapshot={snapshot} />
            </div>

            {/* Trait Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {traitBlocks.map((block) => (
                <TraitBlock
                    key={block.id}
                    config={block}
                    traits={snapshot.traits}
                />
                ))}

                {/* Unlocks spanning full width */}
                <div className="md:col-span-2">
                <UnlocksBlock unlocks={snapshot.unlocks} />
                </div>
            </div>
        </>
      )}
    </div>
  );
}
