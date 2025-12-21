"use client";

/**
 * Character Header (Block A)
 *
 * Shows:
 * - Zodiac wheel with highlighted sun sign
 * - Top archetype
 * - Completion bar
 * - Unlocks row
 */

import { ProfileSnapshot } from "@/lib/lme/types";
import { ZodiacShield } from "./ZodiacShield";

type CharacterHeaderProps = {
  snapshot: ProfileSnapshot;
};

export function CharacterHeader({ snapshot }: CharacterHeaderProps) {
  const sunSign = snapshot.astro?.western?.sunSign;
  const chineseAnimal = snapshot.astro?.chinese?.animal;
  const primaryArchetype = snapshot.psyche?.archetypeMix?.[0];
  const completion = snapshot.meta?.completion?.percent ?? 0;
  const unlockCount = snapshot.meta?.completion?.unlockCount ?? 0;

  return (
    <header className="pt-8 pb-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Top Row: Zodiac + Identity */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          {/* Zodiac Shield (Wappen) - 300% larger */}
          <div className="flex-shrink-0">
            <ZodiacShield sign={sunSign} size={420} className="-my-12" />
          </div>

          {/* Identity Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">
              Character Sheet
            </h1>
            {sunSign && (
              <p className="text-lg text-indigo-400 capitalize">
                {sunSign}
                {chineseAnimal && ` / ${chineseAnimal}`}
              </p>
            )}
            {primaryArchetype && (
              <p className="text-slate-400 mt-1">
                Primary Archetype:{" "}
                <span className="text-slate-200">
                  {primaryArchetype.archetype?.name ?? primaryArchetype.archetypeId}
                </span>
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex-shrink-0 text-center">
            <div className="bg-slate-800/50 rounded-lg px-6 py-4">
              <div className="text-3xl font-bold text-indigo-400">{completion}%</div>
              <div className="text-sm text-slate-400">Complete</div>
            </div>
          </div>
        </div>

        {/* Completion Bar */}
        <div className="bg-slate-800 rounded-full h-3 overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>

        {/* Unlocks Row */}
        {unlockCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="text-amber-400">
              {unlockCount} unlock{unlockCount !== 1 ? "s" : ""}
            </span>
            earned
          </div>
        )}
      </div>
    </header>
  );
}
