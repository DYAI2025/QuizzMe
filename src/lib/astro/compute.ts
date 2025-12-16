/**
 * Astro Compute
 *
 * Computes astrological data from birth date.
 *
 * MVP (Phase 5a):
 * - sunSign: always computed from birth date
 * - chineseAnimal/element/yinYang: computed from birth year
 *
 * Future (Phase 5b):
 * - ascendant/moonSign: requires birth time + ephemeris library
 */

import type { ZodiacSign, ChineseAnimal } from "@/lib/registry/astro-anchor-map.v1";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ChineseElement = "wood" | "fire" | "earth" | "metal" | "water";
export type YinYang = "yin" | "yang";

export type AstroResult = {
  western: {
    sunSign: ZodiacSign;
    // Future: ascendant, moonSign (requires birth time)
  };
  chinese: {
    animal: ChineseAnimal;
    element: ChineseElement;
    yinYang: YinYang;
  };
};

export type BirthInput = {
  date: Date;
  time?: { hour: number; minute: number }; // Optional for future use
  place?: { lat: number; lng: number }; // Optional for future use
};

// ═══════════════════════════════════════════════════════════════════════════
// WESTERN ZODIAC (Sun Sign)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Zodiac sign date ranges (approximate, using tropical zodiac)
 * Format: [startMonth, startDay, endMonth, endDay]
 */
const ZODIAC_RANGES: [ZodiacSign, number, number, number, number][] = [
  ["capricorn", 12, 22, 1, 19],
  ["aquarius", 1, 20, 2, 18],
  ["pisces", 2, 19, 3, 20],
  ["aries", 3, 21, 4, 19],
  ["taurus", 4, 20, 5, 20],
  ["gemini", 5, 21, 6, 20],
  ["cancer", 6, 21, 7, 22],
  ["leo", 7, 23, 8, 22],
  ["virgo", 8, 23, 9, 22],
  ["libra", 9, 23, 10, 22],
  ["scorpio", 10, 23, 11, 21],
  ["sagittarius", 11, 22, 12, 21],
];

/**
 * Get sun sign from birth date
 */
export function getSunSign(date: Date): ZodiacSign {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  for (const [sign, startMonth, startDay, endMonth, endDay] of ZODIAC_RANGES) {
    // Handle Capricorn wrapping around year end
    if (startMonth > endMonth) {
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      ) {
        return sign;
      }
    } else {
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (month > startMonth && month < endMonth)
      ) {
        return sign;
      }
    }
  }

  // Fallback (should never reach)
  return "aries";
}

// ═══════════════════════════════════════════════════════════════════════════
// CHINESE ZODIAC
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Chinese zodiac animals in cycle order (starting from Rat)
 */
const CHINESE_ANIMALS: ChineseAnimal[] = [
  "rat",
  "ox",
  "tiger",
  "rabbit",
  "dragon",
  "snake",
  "horse",
  "goat",
  "monkey",
  "rooster",
  "dog",
  "pig",
];

/**
 * Chinese elements in cycle order
 */
const CHINESE_ELEMENTS: ChineseElement[] = [
  "wood",
  "fire",
  "earth",
  "metal",
  "water",
];

/**
 * Get Chinese zodiac animal from birth year.
 * Note: This is simplified and doesn't account for lunar new year dates.
 * For more accuracy, would need to check if birthdate is before/after
 * Chinese New Year for that year.
 */
export function getChineseAnimal(year: number): ChineseAnimal {
  // 1900 was Year of the Rat
  const index = ((year - 1900) % 12 + 12) % 12;
  return CHINESE_ANIMALS[index];
}

/**
 * Get Chinese element from birth year.
 * Elements cycle every 2 years (same element for yin and yang year).
 */
export function getChineseElement(year: number): ChineseElement {
  // Element changes every 2 years
  // 1900 was Metal Rat (yang)
  const index = Math.floor(((year - 1900) % 10 + 10) % 10 / 2);
  return CHINESE_ELEMENTS[index];
}

/**
 * Get Yin/Yang from birth year.
 * Even years are Yang, odd years are Yin.
 */
export function getYinYang(year: number): YinYang {
  return year % 2 === 0 ? "yang" : "yin";
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPUTE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Compute astrological data from birth information.
 *
 * MVP: Only sun sign and chinese zodiac (no birth time required)
 * Future: Add ascendant/moon when birth time is provided
 */
export function computeAstro(input: BirthInput): AstroResult {
  const year = input.date.getFullYear();

  return {
    western: {
      sunSign: getSunSign(input.date),
      // Future: ascendant and moonSign would go here (requires birth time + ephemeris)
    },
    chinese: {
      animal: getChineseAnimal(year),
      element: getChineseElement(year),
      yinYang: getYinYang(year),
    },
  };
}

/**
 * Check if birth time is known (for future asc/moon calculation)
 */
export function hasBirthTime(input: BirthInput): boolean {
  return input.time !== undefined;
}

/**
 * Check if birth place is known (for future asc calculation)
 */
export function hasBirthPlace(input: BirthInput): boolean {
  return input.place !== undefined;
}
