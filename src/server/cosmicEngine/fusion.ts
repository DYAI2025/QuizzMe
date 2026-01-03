
import { BaZiChart } from './bazi';
import { STEM_ELEMENT_INDEX, BRANCH_FIXED_ELEMENT_INDEX, WU_XING, WU_XING_DE } from './astronomy-utils';

export type FusionResult = {
    elementVector: {
        combined: number[]; // 5 elements normalized
        eastern: number[];
        western: number[];
        dominantElement: string;
        dominantElementDE: string;
        deficientElement: string;
        deficientElementDE: string;
    };
    harmonyIndex: number; // 0-1
    harmonyInterpretation: string;
    resonances: any[];
};

// Weights for Ba Zi Element Vector
// Day Master is core identity -> highest weight
const BAZI_WEIGHTS = {
    yearStem: 1.0,
    yearBranch: 1.0,
    monthStem: 1.5,
    monthBranch: 1.5,
    dayStem: 2.0,      // Day Master
    dayBranch: 1.0,
    hourStem: 0.8,
    hourBranch: 0.8
};

// Planetary Weights for Western Element Vector
// (Simplified mapping of Planets -> Wu Xing)
const PLANET_WU_XING_WEIGHTS: Record<string, Record<string, number>> = {
  Sun:     { Fire: 1.0, Wood: 0.2 },
  Moon:    { Water: 1.0, Earth: 0.3 },
  Mercury: { Water: 0.6, Metal: 0.4 },
  Venus:   { Metal: 0.8, Earth: 0.2 },
  Mars:    { Fire: 1.0 },
  Jupiter: { Wood: 1.0, Fire: 0.2 },
  Saturn:  { Earth: 0.7, Metal: 0.3 },
  // Modern outer planets (optional/experimental mapping)
  Uranus:  { Metal: 0.5, Fire: 0.5 },
  Neptune: { Water: 0.8, Wood: 0.2 },
  Pluto:   { Fire: 0.5, Earth: 0.5 }
};

const ELEMENT_MAP: Record<string, number> = { 
    'Wood': 0, 'Fire': 1, 'Earth': 2, 'Metal': 3, 'Water': 4 
};

function normalizeVector(v: number[]): number[] {
    const sum = v.reduce((a, b) => a + b, 0);
    if (sum === 0) return [0.2, 0.2, 0.2, 0.2, 0.2];
    return v.map(n => n / sum);
}

function calculateBaZiVector(chart: BaZiChart): number[] {
    const v = [0, 0, 0, 0, 0];
    
    // Stems
    v[STEM_ELEMENT_INDEX[chart.year.stemIndex]] += BAZI_WEIGHTS.yearStem;
    v[STEM_ELEMENT_INDEX[chart.month.stemIndex]] += BAZI_WEIGHTS.monthStem;
    v[STEM_ELEMENT_INDEX[chart.day.stemIndex]] += BAZI_WEIGHTS.dayStem;
    v[STEM_ELEMENT_INDEX[chart.hour.stemIndex]] += BAZI_WEIGHTS.hourStem;
    
    // Branches
    v[BRANCH_FIXED_ELEMENT_INDEX[chart.year.branchIndex]] += BAZI_WEIGHTS.yearBranch;
    v[BRANCH_FIXED_ELEMENT_INDEX[chart.month.branchIndex]] += BAZI_WEIGHTS.monthBranch;
    v[BRANCH_FIXED_ELEMENT_INDEX[chart.day.branchIndex]] += BAZI_WEIGHTS.dayBranch;
    v[BRANCH_FIXED_ELEMENT_INDEX[chart.hour.branchIndex]] += BAZI_WEIGHTS.hourBranch;
    
    return normalizeVector(v);
}

function calculateWesternVector(planets: any): number[] {
    const v = [0, 0, 0, 0, 0];
    
    // Planets object is e.g. { Sun: { longitude: ... }, Moon: ... }
    // Or Cloud format: { Sun: { ... }, planets: { Mercury: ... } } ?
    // Check cloud response structure.
    // Cloud response: { western: { planets: { Sun: ..., Moon: ..., Mercury: ... } } }
    // Wait, Cloud 200 OK response from step 526:
    // It has `data.planets` NOT inside `western`.
    // It was top level `planets` in step 466 response echo? No that was input.
    // The main Cloud response (Step 526 was Error).
    // Let's assume standard Cosmic Engine structure:
    // { planets: { Sun: ..., Moon: ..., Mercury: ... } }
    
    const relevantBodies = Object.keys(PLANET_WU_XING_WEIGHTS);
    
    // Flatten lookup if needed. Assuming `planets` dict passed in has uppercase keys like "Sun".
    for (const body of relevantBodies) {
        if (planets[body]) {
            const weights = PLANET_WU_XING_WEIGHTS[body];
            for (const [elem, w] of Object.entries(weights)) {
                v[ELEMENT_MAP[elem]] += w;
            }
        }
    }
    
    return normalizeVector(v);
}

function calculateHarmonyIndex(v1: number[], v2: number[]): number {
    // Cosine similarity
    let dot = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < 5; i++) {
        dot += v1[i] * v2[i];
        norm1 += v1[i] ** 2;
        norm2 += v2[i] ** 2;
    }
    
    const sim = dot / (Math.sqrt(norm1) * Math.sqrt(norm2));
    // Normalize -1..1 to 0..1
    return (sim + 1) / 2;
}

export function calculateFusion(bazi: BaZiChart, westernPlanets: any): FusionResult {
    const eastVec = calculateBaZiVector(bazi);
    const westVec = calculateWesternVector(westernPlanets);
    
    // Unified Vector (Average)
    const combined = normalizeVector(eastVec.map((val, i) => val + westVec[i]));
    
    // Find dominant/deficient
    const maxVal = Math.max(...combined);
    const minVal = Math.min(...combined);
    const maxIdx = combined.indexOf(maxVal);
    const minIdx = combined.indexOf(minVal);
    
    const harmonyIndex = calculateHarmonyIndex(eastVec, westVec);
    
    let harmonyInterp = 'Dynamische Spannung';
    if (harmonyIndex > 0.8) harmonyInterp = 'Sehr hohe Kohärenz';
    else if (harmonyIndex > 0.6) harmonyInterp = 'Gute Kohärenz';
    else if (harmonyIndex > 0.4) harmonyInterp = 'Moderate Kohärenz';
    
    return {
        elementVector: {
            combined,
            eastern: eastVec,
            western: westVec,
            dominantElement: WU_XING[maxIdx],
            dominantElementDE: WU_XING_DE[maxIdx],
            deficientElement: WU_XING[minIdx],
            deficientElementDE: WU_XING_DE[minIdx]
        },
        harmonyIndex,
        harmonyInterpretation: harmonyInterp,
        resonances: [] // TODO: Implement specific resonances (Sun-DayMaster etc)
    };
}
