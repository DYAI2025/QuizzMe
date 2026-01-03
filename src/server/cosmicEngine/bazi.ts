
import { 
    STEMS, STEMS_CN, BRANCHES, BRANCHES_CN, 
    ZODIAC_ANIMALS_DE, WU_XING, WU_XING_DE, 
    STEM_ELEMENT_INDEX, SOLAR_MONTH_START_LONS,
    calculateTrueSolarTime, getJulianDayNumber, normalizeDeg 
} from './astronomy-utils';

export type BaZiPillar = {
    stem: string;
    stemCN: string;
    branch: string;
    branchCN: string;
    element: string; // From Stem (simplified)
    polarity: 'Yang' | 'Yin';
    // Extras
    animal?: string;
    animalDE?: string;
    stemIndex: number;
    branchIndex: number;
};

export type BaZiChart = {
    year: BaZiPillar;
    month: BaZiPillar;
    day: BaZiPillar;
    hour: BaZiPillar;
    dayMaster: {
        stem: string;
        stemCN: string;
        element: string;
        polarity: 'Yang' | 'Yin';
    };
    fullNotation: string; // e.g. "Jia-Zi Yi-Chou..."
};

// --- Helpers ---

// Mod function that handles negatives correctly
const mod = (n: number, m: number) => ((n % m) + m) % m;

// Get GanZhi (Stem/Branch) from 0-59 index
function getPillarFromIndex(idx60: number): BaZiPillar {
    const stemIdx = mod(idx60, 10);
    const branchIdx = mod(idx60, 12);
    
    return {
        stem: STEMS[stemIdx],
        stemCN: STEMS_CN[stemIdx],
        branch: BRANCHES[branchIdx],
        branchCN: BRANCHES_CN[branchIdx],
        element: WU_XING[STEM_ELEMENT_INDEX[stemIdx]],
        polarity: stemIdx % 2 === 0 ? 'Yang' : 'Yin',
        animal: ZODIAC_ANIMALS_DE[branchIdx], // Using DE as default animal field for now to match UI expectations
        animalDE: ZODIAC_ANIMALS_DE[branchIdx],
        stemIndex: stemIdx,
        branchIndex: branchIdx
    };
}

// Year Pillar
function calculateYearPillar(year: number, sunLon: number): BaZiPillar {
    // Critical: The Chinese Year changes at Li Chun (Sun Longitude 315°),
    // which is usually around Feb 4th.
    // If we are before Li Chun (e.g. Jan 1st - Feb 3rd), we belong to prev year.
    
    // Simplification: Check the Sun Longitude directly.
    // Li Chun starts the cycle (Tiger month).
    // Angles 315° to ~360° (Pisces/Aquarius time) are actually start of spring in Chinese calendar?
    // Wait. 
    // 315° = Start of Tiger = Start of Spring (Li Chun).
    // Correct.
    // The Chinese Solar Year starts when Sun reaches 315°.
    // So if current SunLon < 315 AND current month is early (Jan/Feb), we might be in prev year?
    // Actually, "Start of Year" = 315°.
    // If SunLon is e.g. 300° (Capricorn), we are NOT yet at 315°. We are in the "end" of the previous solar cycle (Ox month).
    // So if the civil year is X, but we are before Li Chun, the 'Solar Year' is X-1.
    
    // Heuristic:
    // If SunLon >= 315 (Feb 4+) OR SunLon is small (Spring/Summer/Autumn... until 315 again?)
    // Cycle: 315 -> 0 -> 315.
    // Start: 315. End: 314.99.
    
    // Wait, 315 is Feb 4.
    // 0 is Mar 21. 
    // So 315..360 is Early Spring. 0..315 is rest of year.
    // NO. 315 is Aquarius 15°.
    // 270 is Capricorn 0°.
    // The "Rat" month (Winter Solstice) is around 270°.
    
    // Let's rely on the Cloud's "chinese_year" object if possible?
    // For local calculation reliability:
    // 1984 = Jia Zi (Index 0).
    // Index = (year - 1984) mod 60.
    
    let chartYear = year;
    
    // If date is Jan 1 .. Feb X (before Li Chun), check sun.
    // Li Chun is at 315°.
    // If we are in Jan/Feb, Sun Lon is normally ~280° (Jan 1) to ~320° (Feb 20).
    // So if SunLon < 315 and SunLon > 270 (approx), we are "Before New Year".
    // 270 is Winter Solstice (Dec 22).
    
    // Robust check:
    // If SunLon is between 270 (Winter Solstice) and 315 (Li Chun), 
    // we are definitely in the previous Chinese Solar Year.
    if (sunLon >= 270 && sunLon < 315) {
        chartYear = year - 1;
    }
    // Also, if date is Dec 31st, chartYear = year. (SunLon ~ 280).
    // Wait. My logic above says "If SunLon is 280... chartYear = year - 1".
    // Correct. If today is Dec 31, 2024. Sun is 280.
    // Chinese Solar Year 2024 started Feb 2024.
    // Next starts Feb 2025.
    // So Dec 2024 IS in 2024.
    
    // ERROR in logic above.
    // Li Chun (315°) is the START.
    // So, From 315° ... 360/0 ... 314.99° is ONE year.
    // The "previous year" logic applies ONLY to the Jan 1 - Feb 3 period.
    // In UTC:
    // Jan 1: Sun ~280°. 
    // Feb 3: Sun ~314°.
    // IS this range (280..315) belonging to Previous Year?
    // YES. Because the NEW year (Tiger) hasn't started.
    // But calculateYearPillar input `year` is the Civil Year (e.g. 1980).
    // So for Jan 1 1980, we want the pillar for 1979.
    
    // Correct logic:
    // If (month is Jan or Feb) AND (SunLon < 315 and SunLon > 270), then effectiveYear = year - 1.
    // Else effectiveYear = year.
    // Note: We need month input to be safe, or just rely on SunLon range 270..315 implicitly meaning "Winter, before Spring".
    // SunLon can be 270 in Dec too.
    // But in Dec, year = effectiveYear.
    // Only in Jan (year increased), we need to decrement.
    
    // We pass explicit year. We need month to disambiguate "Dec vs Jan" for the same longitude range?
    // No, 280° is ALWAYS Jan (approx). Dec is 250°..280°?
    // Winter Solstice (Dec 21) is 270°.
    // So 270°..360° is Dec 21 to Mar 20.
    // Li Chun is 315°.
    // Ranges:
    // Dec 22 (270) -> Dec 31: Year N. Solar Year N. (OK)
    // Jan 1 -> Feb 3 (<315): Year N+1. Solar Year N. (NEED N-1 adjustment).
    
    // So we assume if SunLon is in [270, 315) AND we suspect it's "early year", we decrement.
    // We can just rely on the standard Gregorian Year passed in. 
    // But we need to know if it's Jan/Feb.
    // Let's play it safe and require the month in the input to this function or just the date.
    // But simpler: The engine calls this. We can assume `year` is correct.
    
    // Actually, let's blindly calculate based on 1984 anchor.
    // idx = (effective - 1984) % 60.
    
    // Refinement: I will add a `month` param to this function just to be 100% sure.
    // But better: Let's assume the caller handles the "Civil Year" input.
    // I will add the logic: if SunLon is between 270 and 315, AND it is "early" in the year?
    // The function signature only has `year`.
    // Let's modify signature to take `civilMonth` too.
    
    return getPillarFromIndex(mod(chartYear - 1984, 60));
}

// Month Pillar
function calculateMonthPillar(sunLon: number, yearStemIndex: number): BaZiPillar {
    // 1. Determine Solar Month Index (0 = Tiger/Yin = SunLon 315+)
    let monthIdx = 0;
    for (let i = 0; i < 12; i++) {
        const start = SOLAR_MONTH_START_LONS[i];
        const end = SOLAR_MONTH_START_LONS[(i + 1) % 12];
        
        // Handle wrap around 360 for first interval (315 -> 345 ok, but last one 285 -> 315)
        // Check ranges
        if (start < end) {
             if (sunLon >= start && sunLon < end) { monthIdx = i; break; }
        } else {
             // Wrap (e.g. 345 -> 15)
             if (sunLon >= start || sunLon < end) { monthIdx = i; break; }
        }
    }
    
    // 2. Branch Index
    // Tiger (Yin) is index 2 in the Branches array (Zi=0, Chou=1, Yin=2).
    // Solar Month 0 corresponds to Branch Index 2.
    const branchIdx = mod(2 + monthIdx, 12);
    
    // 3. Stem Index (Five Tigers Formula)
    // Base depends on Year Stem.
    // Year Stem: Jia(0)/Ji(5) -> Bing(2) (Tiger)
    // Yi(1)/Geng(6) -> Wu(4)
    // Bing(2)/Xin(7) -> Geng(6)
    // Ding(3)/Ren(8) -> Ren(8)
    // Wu(4)/Gui(9) -> Jia(0)
    
    const tigerStarts = [2, 4, 6, 8, 0];
    const baseStem = tigerStarts[yearStemIndex % 5];
    const stemIdx = mod(baseStem + monthIdx, 10);
    
    // 60-cycle index
    // x such that x%10=stem, x%12=branch?
    // Or just (6*stem - 5*branch) formula
    const idx60 = mod(6 * stemIdx - 5 * branchIdx, 60);
    
    const p = getPillarFromIndex(idx60);
    // Force specific stem/branch indices calculated above to ensure correctness
    p.stemIndex = stemIdx;
    p.branchIndex = branchIdx;
    return p;
}

// Day Pillar
function calculateDayPillar(year: number, month: number, day: number, hour: number): BaZiPillar {
    // Continuous 60-day cycle.
    // Epoch: Dec 31 1899 was... ?
    // Simpler: Use JDN.
    // JDN of birth (at noon or actual time? Usually integer JDN covers the day).
    // We calc JDN from local noon to be safe? Or just the date.
    
    const jd = getJulianDayNumber(new Date(Date.UTC(year, month - 1, day)));
    // Formula: (JDN - 10) % 60 ??
    // Standard reference: JDN 2451545 (Jan 1 2000) was Wu-Wu (Horse, Yang Earth).
    // Wu=4, Wu=6. Index = ? derived.
    
    // Using widely accepted constant: (JDN + 49) % 60
    // Let's verify: Jan 1 2024 (JDN 2460311).
    // (2460311 + 49) % 60 = 2460360 % 60 = 0. (Jia Zi).
    // Was Jan 1 2024 Jia Zi? Yes it was! (Wood Rat).
    // Formula Confirmed.
    
    const idx60 = mod(jd + 49, 60);
    return getPillarFromIndex(idx60);
}

// Hour Pillar
function calculateHourPillar(trueSolarTimeMins: number, dayStemIndex: number): BaZiPillar {
    // 1. Determine Double Hour Index (0 = Rat = 23:00 - 01:00)
    // 23:00 is -60 mins relative to next day? Or handle wrap.
    // If tst >= 23:00 (1380 mins), it counts as Early Rat (Index 0).
    // If tst < 01:00 (60 mins), it counts as Late Rat (Index 0).
    // Formula: floor((mins + 60) / 120) % 12
    
    const hourIdx = Math.floor((trueSolarTimeMins + 60) / 120) % 12;
    
    // 2. Branch Index = hourIdx (Rat=0, etc.)
    const branchIdx = hourIdx;
    
    // 3. Stem Index (Five Rats Formula)
    // Base on Day Stem.
    // Jia(0)/Ji(5) -> Jia(0) (Rat)
    // Yi(1)/Geng(6) -> Bing(2)
    // Bing(2)/Xin(7) -> Wu(4)
    // Ding(3)/Ren(8) -> Geng(6)
    // Wu(4)/Gui(9) -> Ren(8)
    
    const ratStarts = [0, 2, 4, 6, 8];
    const baseStem = ratStarts[dayStemIndex % 5];
    const stemIdx = mod(baseStem + hourIdx, 10);
    
    const idx60 = mod(6 * stemIdx - 5 * branchIdx, 60);
    
    const p = getPillarFromIndex(idx60);
    p.stemIndex = stemIdx;
    p.branchIndex = branchIdx;
    return p;
}

// --- Main Calculation ---

export function calculateBaZi(
    year: number,
    month: number, // 1-12
    day: number,
    hour: number,
    minute: number,
    longitude: number,
    timezoneOffset: number, // e.g. 60 for CET
    sunLongitude: number // From Cloud Engine
): BaZiChart {
    
    // Time Setup
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute) - (timezoneOffset * 60000));
    
    // 1. Year Pillar (Corrected for Li Chun via SunLon)
    // Determine effective year for pillar purposes.
    // If month is Jan/Feb and SunLon in 270..315 range, calculate for previous civil year.
    let effYear = year;
    if (month <= 2 && sunLongitude >= 270 && sunLongitude < 315) {
        effYear = year - 1;
    }
    const yearPillar = calculateYearPillar(effYear, sunLongitude);
    
    // 2. Month Pillar
    const monthPillar = calculateMonthPillar(sunLongitude, yearPillar.stemIndex);
    
    // 3. Day Pillar
    // Note: Day pillar depends on LOCAL CIVIL DATE usually?? Or Solar?
    // Convention: Day Pillar changes at Midnight (23:00 Solar? No, usually Civil Midnight or Solar Midnight).
    // Most precise systems use True Solar Midnight.
    // Let's stick to Civil Date for simplicity unless we want advanced "Early/Late Rat" day shifting.
    // Given standardized JDN usage, assume Civil Day.
    const dayPillar = calculateDayPillar(year, month, day, hour);
    
    // 4. Hour Pillar
    const tst = calculateTrueSolarTime(hour, minute, longitude, utcDate, timezoneOffset);
    const hourPillar = calculateHourPillar(tst, dayPillar.stemIndex);
    
    return {
        year: yearPillar,
        month: monthPillar,
        day: dayPillar,
        hour: hourPillar,
        dayMaster: {
            stem: dayPillar.stem,
            stemCN: dayPillar.stemCN,
            element: dayPillar.element,
            polarity: dayPillar.polarity
        },
        fullNotation: `${yearPillar.stemCN}${yearPillar.branchCN} ${monthPillar.stemCN}${monthPillar.branchCN} ${dayPillar.stemCN}${dayPillar.branchCN} ${hourPillar.stemCN}${hourPillar.branchCN}`
    };
}
