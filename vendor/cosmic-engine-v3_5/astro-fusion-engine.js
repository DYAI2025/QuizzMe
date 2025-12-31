/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 八字 | BA ZI + WESTERN ASTROLOGY FUSION ENGINE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Deterministische Berechnungen für:
 * - Westliche Astrologie (Sonne, Mond, Aszendent, MC, Planeten, Häuser)
 * - Chinesische Astrologie (Ba Zi / Vier Säulen des Schicksals)
 * - Fusionsmetriken (Element-Vektoren, Harmonie-Index)
 * 
 * @version 1.0.0
 * @license MIT
 */

// ═══════════════════════════════════════════════════════════════════════════════
// KONSTANTEN
// ═══════════════════════════════════════════════════════════════════════════════

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
const J2000 = 2451545.0;

// Himmelsstämme (天干)
const STEMS = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
const STEMS_CN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// Erdzweige (地支)
const BRANCHES = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
const BRANCHES_CN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// Tierkreis (12 Tiere)
const ZODIAC_ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 
                        'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
const ZODIAC_ANIMALS_DE = ['Ratte', 'Büffel', 'Tiger', 'Hase', 'Drache', 'Schlange',
                           'Pferd', 'Ziege', 'Affe', 'Hahn', 'Hund', 'Schwein'];

// Westlicher Zodiak
const ZODIAC_WESTERN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const ZODIAC_WESTERN_DE = ['Widder', 'Stier', 'Zwillinge', 'Krebs', 'Löwe', 'Jungfrau',
                           'Waage', 'Skorpion', 'Schütze', 'Steinbock', 'Wassermann', 'Fische'];

// Wu Xing (五行) - Fünf Wandlungsphasen
const WU_XING = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
const WU_XING_DE = ['Holz', 'Feuer', 'Erde', 'Metall', 'Wasser'];
const WU_XING_CN = ['木', '火', '土', '金', '水'];

// Stamm → Element Index
const STEM_ELEMENT_INDEX = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]; // Wood Wood Fire Fire Earth Earth Metal Metal Water Water

// Zweig → Fixiertes Element Index
const BRANCH_FIXED_ELEMENT_INDEX = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4]; // Water Earth Wood Wood Earth Fire Fire Earth Metal Metal Earth Water

// Solar-Monat Start-Längen (beginnend bei Yin = 315°)
const SOLAR_MONTH_START_LONS = [315, 345, 15, 45, 75, 105, 135, 165, 195, 225, 255, 285];

// ═══════════════════════════════════════════════════════════════════════════════
// HILFSFUNKTIONEN
// ═══════════════════════════════════════════════════════════════════════════════

function mod(a, n) {
  return ((a % n) + n) % n;
}

function normalizeDeg(deg) {
  return mod(deg, 360);
}

function degToRad(deg) {
  return deg * DEG2RAD;
}

function radToDeg(rad) {
  return rad * RAD2DEG;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZEIT-BERECHNUNGEN
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Konvertiert Gregorianisches Datum zu Julianischem Datum
 * @param {number} year - Jahr
 * @param {number} month - Monat (1-12)
 * @param {number} day - Tag (1-31)
 * @param {number} hour - Stunde (0-23)
 * @param {number} minute - Minute (0-59)
 * @param {number} second - Sekunde (0-59)
 * @returns {number} Julianisches Datum
 */
function toJulianDate(year, month, day, hour = 0, minute = 0, second = 0) {
  const dayFraction = (hour + minute / 60 + second / 3600) / 24;
  let Y = year;
  let M = month;
  let D = day + dayFraction;

  if (M <= 2) {
    Y -= 1;
    M += 12;
  }

  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
}

/**
 * Julian Day Number (ganzzahlig, wechselt um Mitternacht UT)
 */
function toJDN(jd) {
  return Math.floor(jd + 0.5);
}

/**
 * Berechnet Delta-T (Differenz zwischen TT und UT) in Sekunden
 * Basiert auf NASA/Espenak-Meeus Polynomen
 */
function calculateDeltaT(year, month = 7) {
  const y = year + (month - 0.5) / 12;
  let u, t;

  if (y < -500) {
    u = (y - 1820) / 100;
    return -20 + 32 * u * u;
  } else if (y < 500) {
    u = y / 100;
    return 10583.6 - 1014.41 * u + 33.78311 * u ** 2 - 5.952053 * u ** 3;
  } else if (y < 1600) {
    u = (y - 1000) / 100;
    return 1574.2 - 556.01 * u + 71.23472 * u ** 2 + 0.319781 * u ** 3 - 0.8503463 * u ** 4;
  } else if (y < 1700) {
    t = y - 1600;
    return 120 - 0.9808 * t - 0.01532 * t ** 2 + t ** 3 / 7129;
  } else if (y < 1800) {
    t = y - 1700;
    return 8.83 + 0.1603 * t - 0.0059285 * t ** 2 + 0.00013336 * t ** 3;
  } else if (y < 1860) {
    t = y - 1800;
    return 13.72 - 0.332447 * t + 0.0068612 * t ** 2 + 0.0041116 * t ** 3;
  } else if (y < 1900) {
    t = y - 1860;
    return 7.62 + 0.5737 * t - 0.251754 * t ** 2 + 0.01680668 * t ** 3;
  } else if (y < 1920) {
    t = y - 1900;
    return -2.79 + 1.494119 * t - 0.0598939 * t ** 2 + 0.0061966 * t ** 3;
  } else if (y < 1941) {
    t = y - 1920;
    return 21.20 + 0.84493 * t - 0.076100 * t ** 2 + 0.0020936 * t ** 3;
  } else if (y < 1961) {
    t = y - 1950;
    return 29.07 + 0.407 * t - t ** 2 / 233 + t ** 3 / 2547;
  } else if (y < 1986) {
    t = y - 1975;
    return 45.45 + 1.067 * t - t ** 2 / 260 - t ** 3 / 718;
  } else if (y < 2005) {
    t = y - 2000;
    return 63.86 + 0.3345 * t - 0.060374 * t ** 2 + 0.0017275 * t ** 3;
  } else if (y < 2050) {
    t = y - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t ** 2;
  } else if (y < 2150) {
    u = (y - 1820) / 100;
    return -20 + 32 * u ** 2 - 0.5628 * (2150 - y);
  } else {
    u = (y - 1820) / 100;
    return -20 + 32 * u ** 2;
  }
}

/**
 * Berechnet Greenwich Mean Sidereal Time in Stunden
 */
function calculateGMST(jd_ut1) {
  const d = jd_ut1 - J2000;
  const gmst = 18.697374558 + 24.06570982441908 * d;
  return mod(gmst, 24);
}

/**
 * Berechnet Local Sidereal Time in Stunden
 */
function calculateLST(jd_ut1, longitudeDeg) {
  const gmst = calculateGMST(jd_ut1);
  const lst = gmst + longitudeDeg / 15;
  return mod(lst, 24);
}

/**
 * Berechnet die Zeitgleichung (Equation of Time) in Minuten
 * Basiert auf NOAA-Approximation
 */
function calculateEquationOfTime(utcDate) {
  const year = utcDate.getUTCFullYear();
  const start = Date.UTC(year, 0, 1, 0, 0, 0);
  const doy = Math.floor((utcDate.getTime() - start) / 86400000) + 1;
  const hour = utcDate.getUTCHours() + utcDate.getUTCMinutes() / 60;
  
  const gamma = 2 * Math.PI / 365 * (doy - 1 + (hour - 12) / 24);
  
  return 229.18 * (
    0.000075 +
    0.001868 * Math.cos(gamma) -
    0.032077 * Math.sin(gamma) -
    0.014615 * Math.cos(2 * gamma) -
    0.040849 * Math.sin(2 * gamma)
  );
}

/**
 * Berechnet die Wahre Sonnenzeit (True Solar Time) in Minuten
 */
function calculateTrueSolarTime(localMinutes, utcDate, longitudeDeg, tzOffsetMinutes) {
  const eot = calculateEquationOfTime(utcDate);
  const tzHours = tzOffsetMinutes / 60;
  const timeOffset = eot + 4 * longitudeDeg - 60 * tzHours;
  return mod(localMinutes + timeOffset, 1440);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASTRONOMISCHE BERECHNUNGEN (WESTLICH)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Berechnet die mittlere Schiefe der Ekliptik in Grad
 */
function calculateObliquity(T) {
  const seconds = 84381.406 -
    46.836769 * T -
    0.0001831 * T ** 2 +
    0.00200340 * T ** 3;
  return seconds / 3600;
}

/**
 * Berechnet die scheinbare ekliptikale Länge der Sonne in Grad
 * Basiert auf Meeus-Algorithmen
 */
function calculateSunLongitude(jd_tt) {
  const T = (jd_tt - J2000) / 36525;
  
  const L0 = normalizeDeg(280.46646 + 36000.76983 * T + 0.0003032 * T ** 2);
  const M = normalizeDeg(357.52911 + 35999.05029 * T - 0.0001537 * T ** 2);
  const e = 0.016708634 - 0.000042037 * T;
  
  const Mr = degToRad(M);
  
  const C = (1.914602 - 0.004817 * T - 0.000014 * T ** 2) * Math.sin(Mr) +
            (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) +
            0.000289 * Math.sin(3 * Mr);
  
  const trueLong = L0 + C;
  const Omega = normalizeDeg(125.04 - 1934.136 * T);
  const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(degToRad(Omega));
  
  return normalizeDeg(lambda);
}

/**
 * Berechnet die ekliptikale Länge des Mondes in Grad
 * Vereinfachte Formel nach Schlyter mit Hauptstörungen
 */
function calculateMoonLongitude(jd_tt) {
  const T = (jd_tt - J2000) / 36525;
  const d = jd_tt - J2000;
  
  // Mittlere Elemente
  const L = normalizeDeg(218.32 + 13.1763966 * d);  // Mittlere Länge
  const M = normalizeDeg(134.96 + 13.0649929 * d);   // Mittlere Anomalie Mond
  const Ms = normalizeDeg(357.53 + 0.9856003 * d);   // Mittlere Anomalie Sonne
  const D = normalizeDeg(297.85 + 12.1907491 * d);   // Mittlere Elongation
  const F = normalizeDeg(93.27 + 13.2293504 * d);    // Argument der Breite
  
  const Mr = degToRad(M);
  const Msr = degToRad(Ms);
  const Dr = degToRad(D);
  const Fr = degToRad(F);
  
  // Hauptstörungen
  const longitude = L +
    6.289 * Math.sin(Mr) -
    1.274 * Math.sin(2 * Dr - Mr) +
    0.658 * Math.sin(2 * Dr) +
    0.214 * Math.sin(2 * Mr) -
    0.186 * Math.sin(Msr) -
    0.114 * Math.sin(2 * Fr);
  
  return normalizeDeg(longitude);
}

/**
 * Berechnet den Aszendenten in Grad
 * Formel: tan(ASC) = cos(θ) / [-sin(θ)·cos(ε) - tan(φ)·sin(ε)]
 */
function calculateAscendant(jd_ut1, latitudeDeg, longitudeDeg, obliquityDeg) {
  const lst = calculateLST(jd_ut1, longitudeDeg);
  const theta = lst * 15; // LST in Grad
  
  const thetaRad = degToRad(theta);
  const epsRad = degToRad(obliquityDeg);
  const phiRad = degToRad(latitudeDeg);
  
  const y = Math.cos(thetaRad);
  const x = -(Math.sin(thetaRad) * Math.cos(epsRad) + Math.tan(phiRad) * Math.sin(epsRad));
  
  let asc = radToDeg(Math.atan2(y, x));
  return normalizeDeg(asc);
}

/**
 * Berechnet das Medium Coeli (MC) in Grad
 */
function calculateMC(jd_ut1, longitudeDeg, obliquityDeg) {
  const lst = calculateLST(jd_ut1, longitudeDeg);
  const ramc = lst * 15; // RAMC in Grad
  
  const ramcRad = degToRad(ramc);
  const epsRad = degToRad(obliquityDeg);
  
  let mc = radToDeg(Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(epsRad)));
  return normalizeDeg(mc);
}

/**
 * Bestimmt das westliche Tierkreiszeichen aus der ekliptikalen Länge
 */
function getWesternSign(longitude) {
  const signIndex = Math.floor(normalizeDeg(longitude) / 30);
  return {
    index: signIndex,
    sign: ZODIAC_WESTERN[signIndex],
    signDE: ZODIAC_WESTERN_DE[signIndex],
    degree: longitude % 30
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BA ZI BERECHNUNGEN (ÖSTLICH)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Berechnet den Sexagenary-Index (0-59) aus Stamm und Zweig
 */
function sexagenaryIndex(stemIndex, branchIndex) {
  // Chinesischer Restsatz: finde x mit x ≡ stemIndex (mod 10) und x ≡ branchIndex (mod 12)
  // Lösung: x = (6 * stemIndex - 5 * branchIndex) mod 60
  return mod(6 * stemIndex - 5 * branchIndex, 60);
}

/**
 * Berechnet Stamm und Zweig aus Sexagenary-Index
 */
function ganzhiFromIndex(idx60) {
  const stemIdx = mod(idx60, 10);
  const branchIdx = mod(idx60, 12);
  return {
    stemIndex: stemIdx,
    branchIndex: branchIdx,
    stem: STEMS[stemIdx],
    branch: BRANCHES[branchIdx],
    stemCN: STEMS_CN[stemIdx],
    branchCN: BRANCHES_CN[branchIdx],
    element: WU_XING[STEM_ELEMENT_INDEX[stemIdx]],
    polarity: stemIdx % 2 === 0 ? 'Yang' : 'Yin'
  };
}

/**
 * Findet das Julianische Datum, wenn die Sonne eine bestimmte Länge erreicht
 * (Root-Finding für Solar Terms)
 */
function findSolarLongitude(year, targetLonDeg) {
  // Anfangsschätzung: Mitte des Jahres + Offset
  const offset = (targetLonDeg - 280) / 360;
  const guess = toJulianDate(year, 1, 1) + 365.25 * (0.5 + offset);
  
  let low = guess - 20;
  let high = guess + 20;
  
  // Bisection
  for (let iter = 0; iter < 50; iter++) {
    const mid = (low + high) / 2;
    const sunLon = calculateSunLongitude(mid);
    
    let diff = sunLon - targetLonDeg;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    
    if (Math.abs(diff) < 0.0001) {
      return { ok: true, jd: mid };
    }
    
    if (diff > 0) {
      high = mid;
    } else {
      low = mid;
    }
  }
  
  return { ok: false, jd: (low + high) / 2 };
}

/**
 * Berechnet die Jahressäule (年柱)
 * Beachtet Li Chun (立春) als Jahreswechsel
 */
function calculateYearPillar(year, birthJD, lichunJD) {
  // Vor Li Chun? → Vorjahr verwenden
  const effectiveYear = birthJD < lichunJD ? year - 1 : year;
  
  // Sexagenary Index: 1984 = Jia Zi (Index 0)
  const idx60 = mod(effectiveYear - 1984, 60);
  
  return {
    ...ganzhiFromIndex(idx60),
    effectiveYear,
    animal: ZODIAC_ANIMALS[mod(idx60, 12)],
    animalDE: ZODIAC_ANIMALS_DE[mod(idx60, 12)]
  };
}

/**
 * Bestimmt den Solar-Monat aus der Sonnenlänge
 * Monat 1 (Yin) beginnt bei λ☉ = 315°
 */
function getSolarMonthFromSunLon(sunLonDeg) {
  const lon = normalizeDeg(sunLonDeg);
  
  for (let i = 0; i < 12; i++) {
    const start = SOLAR_MONTH_START_LONS[i];
    const end = SOLAR_MONTH_START_LONS[(i + 1) % 12];
    
    if (start > end) {
      // Wrap-around (z.B. 315° → 345°)
      if (lon >= start || lon < end) return i;
    } else {
      if (lon >= start && lon < end) return i;
    }
  }
  return 0;
}

/**
 * Berechnet die Monatssäule (月柱)
 * Verwendet die "Fünf-Tiger-Formel" (五虎遁)
 */
function calculateMonthPillar(sunLonDeg, yearStemIndex) {
  const monthIdx = getSolarMonthFromSunLon(sunLonDeg);
  
  // Zweig: Yin (Index 2) + monthIdx
  const branchIdx = mod(2 + monthIdx, 12);
  
  // Fünf-Tiger-Formel: Stamm des Yin-Monats basiert auf Jahres-Stamm
  // Jia/Ji → Bing, Yi/Geng → Wu, Bing/Xin → Geng, Ding/Ren → Ren, Wu/Gui → Jia
  const tigerStarts = [2, 4, 6, 8, 0]; // Bing, Wu, Geng, Ren, Jia
  const baseStemIdx = tigerStarts[yearStemIndex % 5];
  const stemIdx = mod(baseStemIdx + monthIdx, 10);
  
  return {
    ...ganzhiFromIndex(sexagenaryIndex(stemIdx, branchIdx)),
    monthIndex: monthIdx,
    solarLongitude: sunLonDeg
  };
}

/**
 * Berechnet die Tagessäule (日柱)
 * Kontinuierlicher 60-Tage-Zyklus
 */
function calculateDayPillar(jd_utc) {
  const jdn = toJDN(jd_utc);
  const idx60 = mod(jdn + 49, 60);
  
  return {
    ...ganzhiFromIndex(idx60),
    jdn
  };
}

/**
 * Bestimmt die Doppelstunde (時辰) aus der Wahren Sonnenzeit
 */
function getDoubleHour(tstMinutes) {
  // Zi (Ratte) = 23:00-01:00
  if (tstMinutes >= 23 * 60 || tstMinutes < 1 * 60) return 0;
  return Math.floor((tstMinutes + 60) / 120);
}

/**
 * Berechnet die Stundensäule (時柱)
 * Verwendet die "Fünf-Ratten-Formel" (五鼠遁)
 */
function calculateHourPillar(tstMinutes, dayStemIndex) {
  const hourIdx = getDoubleHour(tstMinutes);
  const branchIdx = hourIdx;
  
  // Fünf-Ratten-Formel: Stamm der Zi-Stunde basiert auf Tages-Stamm
  // Jia/Ji → Jia, Yi/Geng → Bing, Bing/Xin → Wu, Ding/Ren → Geng, Wu/Gui → Ren
  const ratStarts = [0, 2, 4, 6, 8]; // Jia, Bing, Wu, Geng, Ren
  const baseStemIdx = ratStarts[dayStemIndex % 5];
  const stemIdx = mod(baseStemIdx + hourIdx, 10);
  
  // Frühe Zi-Stunde (23:00+) gehört technisch zum nächsten Tag
  const isEarlyZi = tstMinutes >= 23 * 60;
  
  return {
    ...ganzhiFromIndex(sexagenaryIndex(stemIdx, branchIdx)),
    hourIndex: hourIdx,
    tstMinutes,
    isEarlyZi
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ELEMENT-VEKTOR & FUSION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Berechnet den Element-Vektor aus dem Ba Zi Chart
 * Gewichtung: Tages-Stamm (Day Master) am stärksten
 */
function calculateBaZiElementVector(baziChart) {
  const weights = {
    yearStem: 1.0,
    yearBranch: 1.0,
    monthStem: 1.5,
    monthBranch: 1.5,
    dayStem: 2.0,      // Day Master = Identitätskern
    dayBranch: 1.0,
    hourStem: 0.8,
    hourBranch: 0.8
  };
  
  const vector = [0, 0, 0, 0, 0]; // [Wood, Fire, Earth, Metal, Water]
  
  // Stämme → direktes Element
  vector[STEM_ELEMENT_INDEX[baziChart.year.stemIndex]] += weights.yearStem;
  vector[STEM_ELEMENT_INDEX[baziChart.month.stemIndex]] += weights.monthStem;
  vector[STEM_ELEMENT_INDEX[baziChart.day.stemIndex]] += weights.dayStem;
  vector[STEM_ELEMENT_INDEX[baziChart.hour.stemIndex]] += weights.hourStem;
  
  // Zweige → fixierte Elemente
  vector[BRANCH_FIXED_ELEMENT_INDEX[baziChart.year.branchIndex]] += weights.yearBranch;
  vector[BRANCH_FIXED_ELEMENT_INDEX[baziChart.month.branchIndex]] += weights.monthBranch;
  vector[BRANCH_FIXED_ELEMENT_INDEX[baziChart.day.branchIndex]] += weights.dayBranch;
  vector[BRANCH_FIXED_ELEMENT_INDEX[baziChart.hour.branchIndex]] += weights.hourBranch;
  
  return vector;
}

/**
 * Planetare Wu-Xing-Zuordnungen für westliche Astrologie
 */
const PLANET_WU_XING_WEIGHTS = {
  sun:     { Fire: 1.0, Wood: 0.2 },
  moon:    { Water: 1.0, Earth: 0.3 },
  mercury: { Water: 0.6, Metal: 0.4 },
  venus:   { Metal: 0.8, Earth: 0.2 },
  mars:    { Fire: 1.0 },
  jupiter: { Wood: 1.0, Fire: 0.2 },
  saturn:  { Earth: 0.7, Metal: 0.3 }
};

/**
 * Berechnet den Element-Vektor aus westlichen Planetenpositionen
 */
function calculateWesternElementVector(positions) {
  const vector = [0, 0, 0, 0, 0];
  const elementIndex = { Wood: 0, Fire: 1, Earth: 2, Metal: 3, Water: 4 };
  
  for (const [planet, weights] of Object.entries(PLANET_WU_XING_WEIGHTS)) {
    if (positions[planet]) {
      for (const [element, weight] of Object.entries(weights)) {
        vector[elementIndex[element]] += weight;
      }
    }
  }
  
  return vector;
}

/**
 * Normalisiert einen Vektor (Summe = 1)
 */
function normalizeVector(vector) {
  const sum = vector.reduce((a, b) => a + b, 0);
  if (sum === 0) return vector.map(() => 0.2);
  return vector.map(v => v / sum);
}

/**
 * Berechnet den Harmonie-Index (Cosinus-Ähnlichkeit zwischen zwei Vektoren)
 * Wert nahe 1 = hohe Kohärenz zwischen West und Ost
 */
function calculateHarmonyIndex(vectorWest, vectorEast) {
  let dotProduct = 0;
  let normWest = 0;
  let normEast = 0;
  
  for (let i = 0; i < 5; i++) {
    dotProduct += vectorWest[i] * vectorEast[i];
    normWest += vectorWest[i] ** 2;
    normEast += vectorEast[i] ** 2;
  }
  
  const similarity = dotProduct / (Math.sqrt(normWest) * Math.sqrt(normEast));
  
  // Auf [0, 1] normieren
  return (similarity + 1) / 2;
}

// ═══════════════════════════════════════════════════════════════════════════════
// KOMPATIBILITÄT (San He, Liu He, Liu Chong)
// ═══════════════════════════════════════════════════════════════════════════════

const SAN_HE_TRIADS = {
  Water: [0, 4, 8],   // Zi-Chen-Shen (Ratte-Drache-Affe)
  Metal: [1, 5, 9],   // Chou-Si-You (Büffel-Schlange-Hahn)
  Fire:  [2, 6, 10],  // Yin-Wu-Xu (Tiger-Pferd-Hund)
  Wood:  [3, 7, 11]   // Mao-Wei-Hai (Hase-Ziege-Schwein)
};

const LIU_HE_PAIRS = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];

const LIU_CHONG_PAIRS = [[0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]];

/**
 * Prüft San He (Dreiecksharmonie)
 */
function checkSanHe(branchIndex1, branchIndex2) {
  for (const [element, indices] of Object.entries(SAN_HE_TRIADS)) {
    if (indices.includes(branchIndex1) && indices.includes(branchIndex2)) {
      return { harmony: true, element };
    }
  }
  return { harmony: false };
}

/**
 * Prüft Liu He (Seelenverwandtschaft)
 */
function checkLiuHe(branchIndex1, branchIndex2) {
  for (const pair of LIU_HE_PAIRS) {
    if ((pair[0] === branchIndex1 && pair[1] === branchIndex2) ||
        (pair[1] === branchIndex1 && pair[0] === branchIndex2)) {
      return { bond: true };
    }
  }
  return { bond: false };
}

/**
 * Prüft Liu Chong (Konflikt/Opposition)
 */
function checkLiuChong(branchIndex1, branchIndex2) {
  return { clash: Math.abs(branchIndex1 - branchIndex2) === 6 };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HAUPT-API
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Berechnet das vollständige Fusionsprofil
 * 
 * @param {Object} input
 * @param {number} input.year - Geburtsjahr
 * @param {number} input.month - Geburtsmonat (1-12)
 * @param {number} input.day - Geburtstag (1-31)
 * @param {number} input.hour - Geburtsstunde (0-23)
 * @param {number} input.minute - Geburtsminute (0-59)
 * @param {number} input.second - Geburtssekunde (0-59)
 * @param {number} input.latitudeDeg - Geographische Breite
 * @param {number} input.longitudeDeg - Geographische Länge
 * @param {number} input.tzOffsetMinutes - Zeitzonenoffset in Minuten (Ost = positiv)
 * @returns {Object} Vollständiges Fusionsprofil
 */
function calculateFusionProfile(input) {
  const {
    year, month, day, hour, minute, second = 0,
    latitudeDeg, longitudeDeg, tzOffsetMinutes
  } = input;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. ZEIT-NORMALISIERUNG
  // ─────────────────────────────────────────────────────────────────────────────
  
  // UTC-Zeit berechnen
  const utcMillis = Date.UTC(year, month - 1, day, hour, minute, second) - tzOffsetMinutes * 60 * 1000;
  const utcDate = new Date(utcMillis);
  
  const utc = {
    year: utcDate.getUTCFullYear(),
    month: utcDate.getUTCMonth() + 1,
    day: utcDate.getUTCDate(),
    hour: utcDate.getUTCHours(),
    minute: utcDate.getUTCMinutes(),
    second: utcDate.getUTCSeconds()
  };
  
  // Julianische Daten
  const JD_UTC = toJulianDate(utc.year, utc.month, utc.day, utc.hour, utc.minute, utc.second);
  const deltaT = calculateDeltaT(year, month);
  const JD_TT = JD_UTC + deltaT / 86400;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 2. WESTLICHE BERECHNUNG
  // ─────────────────────────────────────────────────────────────────────────────
  
  const T = (JD_TT - J2000) / 36525;
  const obliquity = calculateObliquity(T);
  
  const sunLon = calculateSunLongitude(JD_TT);
  const moonLon = calculateMoonLongitude(JD_TT);
  const ascLon = calculateAscendant(JD_UTC, latitudeDeg, longitudeDeg, obliquity);
  const mcLon = calculateMC(JD_UTC, longitudeDeg, obliquity);
  
  const western = {
    sun: { longitude: sunLon, ...getWesternSign(sunLon) },
    moon: { longitude: moonLon, ...getWesternSign(moonLon) },
    ascendant: { longitude: ascLon, ...getWesternSign(ascLon) },
    mc: { longitude: mcLon, ...getWesternSign(mcLon) }
  };
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 3. ÖSTLICHE BERECHNUNG (BA ZI)
  // ─────────────────────────────────────────────────────────────────────────────
  
  // Li Chun finden
  const lichun = findSolarLongitude(year, 315);
  
  // Vier Säulen
  const yearPillar = calculateYearPillar(year, JD_UTC, lichun.jd);
  const monthPillar = calculateMonthPillar(sunLon, yearPillar.stemIndex);
  const dayPillar = calculateDayPillar(JD_UTC);
  
  // Wahre Sonnenzeit für Stunde
  const localMinutes = hour * 60 + minute + second / 60;
  const tst = calculateTrueSolarTime(localMinutes, utcDate, longitudeDeg, tzOffsetMinutes);
  const hourPillar = calculateHourPillar(tst, dayPillar.stemIndex);
  
  // Day Master
  const dayMaster = {
    element: WU_XING[STEM_ELEMENT_INDEX[dayPillar.stemIndex]],
    elementDE: WU_XING_DE[STEM_ELEMENT_INDEX[dayPillar.stemIndex]],
    polarity: dayPillar.stemIndex % 2 === 0 ? 'Yang' : 'Yin'
  };
  
  const eastern = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    dayMaster,
    chineseZodiacAnimal: yearPillar.animal,
    chineseZodiacAnimalDE: yearPillar.animalDE,
    lichunJD: lichun.jd
  };
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 4. FUSION
  // ─────────────────────────────────────────────────────────────────────────────
  
  // Element-Vektoren
  const eastVector = calculateBaZiElementVector(eastern);
  const westVector = calculateWesternElementVector({ sun: true, moon: true });
  
  const eastNorm = normalizeVector(eastVector);
  const westNorm = normalizeVector(westVector);
  const combinedNorm = normalizeVector(eastVector.map((e, i) => e + westVector[i]));
  
  // Dominantes und defizientes Element
  const maxIdx = combinedNorm.indexOf(Math.max(...combinedNorm));
  const minIdx = combinedNorm.indexOf(Math.min(...combinedNorm));
  
  // Harmonie-Index
  const harmonyIndex = calculateHarmonyIndex(eastNorm, westNorm);
  
  const fusion = {
    elementVector: {
      combined: combinedNorm,
      eastern: eastNorm,
      western: westNorm,
      dominantElement: WU_XING[maxIdx],
      dominantElementDE: WU_XING_DE[maxIdx],
      deficientElement: WU_XING[minIdx],
      deficientElementDE: WU_XING_DE[minIdx]
    },
    harmonyIndex,
    harmonyInterpretation: harmonyIndex > 0.8 ? 'Sehr hohe Kohärenz' :
                           harmonyIndex > 0.6 ? 'Gute Kohärenz' :
                           harmonyIndex > 0.4 ? 'Moderate Kohärenz' : 'Dynamische Spannung'
  };
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 5. VALIDIERUNG
  // ─────────────────────────────────────────────────────────────────────────────
  
  const sanity = [];
  
  // Sonnenzeichen-Plausibilität
  const expectedMonthSigns = {
    1: ['Capricorn', 'Aquarius'],
    2: ['Aquarius', 'Pisces'],
    3: ['Pisces', 'Aries'],
    4: ['Aries', 'Taurus'],
    5: ['Taurus', 'Gemini'],
    6: ['Gemini', 'Cancer'],
    7: ['Cancer', 'Leo'],
    8: ['Leo', 'Virgo'],
    9: ['Virgo', 'Libra'],
    10: ['Libra', 'Scorpio'],
    11: ['Scorpio', 'Sagittarius'],
    12: ['Sagittarius', 'Capricorn']
  };
  
  if (!expectedMonthSigns[month].includes(western.sun.sign)) {
    // Erlaube Nachbarzeichen bei Cusp
    if (western.sun.degree > 2 && western.sun.degree < 28) {
      sanity.push(`Sun sign ${western.sun.sign} unexpected for month ${month}`);
    }
  }
  
  const valid = sanity.length === 0 && lichun.ok;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ERGEBNIS
  // ─────────────────────────────────────────────────────────────────────────────
  
  return {
    input: {
      local: { year, month, day, hour, minute, second },
      location: { latitudeDeg, longitudeDeg },
      timezone: { tzOffsetMinutes }
    },
    time: {
      utc,
      JD_UTC,
      JD_TT,
      deltaT,
      trueSolarTimeMinutes: tst
    },
    western,
    eastern,
    fusion,
    meta: {
      valid,
      sanity,
      calculatedAt: new Date().toISOString(),
      version: '1.0.0'
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // Hauptfunktion
  calculateFusionProfile,
  
  // Zeit
  toJulianDate,
  toJDN,
  calculateDeltaT,
  calculateGMST,
  calculateLST,
  calculateEquationOfTime,
  calculateTrueSolarTime,
  
  // Westlich
  calculateObliquity,
  calculateSunLongitude,
  calculateMoonLongitude,
  calculateAscendant,
  calculateMC,
  getWesternSign,
  
  // Östlich (Ba Zi)
  ganzhiFromIndex,
  findSolarLongitude,
  calculateYearPillar,
  calculateMonthPillar,
  calculateDayPillar,
  calculateHourPillar,
  getSolarMonthFromSunLon,
  getDoubleHour,
  
  // Fusion
  calculateBaZiElementVector,
  calculateWesternElementVector,
  normalizeVector,
  calculateHarmonyIndex,
  
  // Kompatibilität
  checkSanHe,
  checkLiuHe,
  checkLiuChong,
  
  // Konstanten
  STEMS,
  STEMS_CN,
  BRANCHES,
  BRANCHES_CN,
  ZODIAC_ANIMALS,
  ZODIAC_ANIMALS_DE,
  ZODIAC_WESTERN,
  ZODIAC_WESTERN_DE,
  WU_XING,
  WU_XING_DE,
  WU_XING_CN,
  SAN_HE_TRIADS,
  LIU_HE_PAIRS,
  LIU_CHONG_PAIRS
};

// ═══════════════════════════════════════════════════════════════════════════════
// BEISPIEL-USAGE
// ═══════════════════════════════════════════════════════════════════════════════

/*
const profile = calculateFusionProfile({
  year: 1990,
  month: 6,
  day: 15,
  hour: 10,
  minute: 30,
  second: 0,
  latitudeDeg: 52.52,      // Berlin
  longitudeDeg: 13.405,
  tzOffsetMinutes: 120     // CEST = UTC+2
});

console.log(JSON.stringify(profile, null, 2));
*/
