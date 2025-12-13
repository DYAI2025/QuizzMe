/**
 * Derived Stats Calculator
 * Implements logic to compute secondary stats from core psyche profile.
 */
import { PsycheCoreStats, DerivedStats } from '@/types/psyche';

/**
 * Maps a 0..1 value to a 0..100 integer percentage
 */
export function toPercent01(value: number): number {
    return Math.round(Math.max(0, Math.min(1, value)) * 100);
}

/**
 * Calculates derived stats based on core stats
 * 
 * Rules:
 * - vitality = avg(clarity, connection)
 * - willpower = avg(courage, order)
 * - chaos = shadow
 * - harmony = 1 - abs(shadow - connection) [mapped to 0..100]
 */
export function calcDerivedStats(stats: PsycheCoreStats): DerivedStats {
    // Helpers
    const avg = (a: number, b: number) => (a + b) / 2;

    const vitalityRaw = avg(stats.clarity, stats.connection);
    const willpowerRaw = avg(stats.courage, stats.order);
    const chaosRaw = stats.shadow;

    // Harmony: 1 - distance between shadow and connection
    // If shadow and connection are far apart (dist=1), harmony is 0
    // If they are equal (dist=0), harmony is 1
    const dist = Math.abs(stats.shadow - stats.connection);
    const harmonyRaw = 1 - dist;

    return {
        vitality: toPercent01(vitalityRaw),
        willpower: toPercent01(willpowerRaw),
        chaos: toPercent01(chaosRaw),
        harmony: toPercent01(harmonyRaw),
    };
}
