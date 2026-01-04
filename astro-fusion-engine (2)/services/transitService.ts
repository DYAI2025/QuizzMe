import { Transit } from '../types';

// We reuse the logic from astroPhysics roughly, but adapted for current transits.
// In a full production app, this would fetch from an Ephemeris API (e.g. NASA JPL or specific Astrology API).

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const ZODIAC_ELEMENTS: Record<string, string> = {
  "Aries": "Fire", "Leo": "Fire", "Sagittarius": "Fire",
  "Taurus": "Earth", "Virgo": "Earth", "Capricorn": "Earth",
  "Gemini": "Air", "Libra": "Air", "Aquarius": "Air",
  "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water"
};

// Helper: Calculate Julian Date for today
const getJulianDate = (date: Date) => {
  return (date.getTime() / 86400000) + 2440587.5;
};

// Real-ish calculation for Moon Position (Simplified algo)
const getMoonPosition = (date: Date): { sign: string, degree: number } => {
  const jd = getJulianDate(date);
  const d = jd - 2451545.0;
  const L = 218.316 + 13.176396 * d;
  const M = 134.963 + 13.064993 * d;
  
  const normalize = (deg: number) => {
    deg = deg % 360;
    if (deg < 0) deg += 360;
    return deg;
  };
  const toRad = (deg: number) => deg * (Math.PI / 180);

  let lambda = L + 6.289 * Math.sin(toRad(normalize(M)));
  lambda = normalize(lambda);

  const signIndex = Math.floor(lambda / 30);
  const degree = Math.floor(lambda % 30);
  
  return { 
    sign: ZODIAC_SIGNS[signIndex % 12], 
    degree 
  };
};

// Real-ish calculation for Sun Position
const getSunPosition = (date: Date): { sign: string, degree: number } => {
  // Approximate based on day of year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  // Aries starts roughly day 80
  // 360 degrees / 365 days ~= 0.98 deg/day
  let degrees = (dayOfYear - 80) * 0.9856;
  if (degrees < 0) degrees += 360;
  
  const signIndex = Math.floor(degrees / 30);
  const degree = Math.floor(degrees % 30);

  return {
    sign: ZODIAC_SIGNS[signIndex % 12],
    degree
  };
};

export const fetchCurrentTransits = async (): Promise<Transit[]> => {
  // In a real scenario, we might fetch from: https://astrology-api.com/transits
  // Here we calculate the Luminaries (Sun/Moon) locally for accuracy,
  // and simulate the slower planets to create a realistic dashboard experience.
  
  const now = new Date();
  const sun = getSunPosition(now);
  const moon = getMoonPosition(now);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          body: 'Sun',
          sign: sun.sign,
          degree: sun.degree,
          isRetrograde: false,
          element: ZODIAC_ELEMENTS[sun.sign]
        },
        {
          body: 'Moon',
          sign: moon.sign,
          degree: moon.degree,
          isRetrograde: false,
          element: ZODIAC_ELEMENTS[moon.sign]
        },
        {
          body: 'Mercury',
          sign: 'Virgo', // Mocked
          degree: 14,
          isRetrograde: true,
          element: 'Earth'
        },
        {
          body: 'Venus',
          sign: 'Leo', // Mocked
          degree: 22,
          isRetrograde: false,
          element: 'Fire'
        },
        {
          body: 'Mars',
          sign: 'Libra', // Mocked
          degree: 5,
          isRetrograde: false,
          element: 'Air'
        },
        {
          body: 'Saturn',
          sign: 'Pisces', // Mocked (Saturn is actually in Pisces in 2024/25)
          degree: 12,
          isRetrograde: true,
          element: 'Water'
        }
      ]);
    }, 800); // Simulate network latency
  });
};
