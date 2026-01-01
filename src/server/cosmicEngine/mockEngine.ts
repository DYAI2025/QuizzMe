import * as Astronomy from 'astronomy-engine';

// Redefining proper calculation using the library correctly
export async function createMockEngine() {
    return {
        calculateProfile: async (input: any) => {
            const date = new Date(`${input.year}-${String(input.month).padStart(2, '0')}-${String(input.day).padStart(2, '0')}T${String(input.hour).padStart(2, '0')}:${String(input.minute).padStart(2, '0')}:00Z`);
            
            // Proper Ecliptic Longitude
            const sunVec = Astronomy.GeoVector(Astronomy.Body.Sun, date, false);
            const sunLon = Astronomy.Ecliptic(sunVec).elon;
            const sunSign = getSignFromLon(sunLon);
            
            const moonVec = Astronomy.GeoVector(Astronomy.Body.Moon, date, false);
            const moonLon = Astronomy.Ecliptic(moonVec).elon;
            const moonSign = getSignFromLon(moonLon);
            
             // Chinese Year starts approx Feb 4.
            const isAfterFeb4 = (input.month > 2) || (input.month === 2 && input.day >= 4);
            const chineseYear = isAfterFeb4 ? input.year : input.year - 1;
            
            const animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
            const animal = animals[(chineseYear - 1984 + 1200) % 12]; // 1984 = Rat
            
            const elements = ["Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water"];
            const element = elements[(chineseYear - 1984 + 1200) % 10]; // 1984 = Wood
            
            return {
                western: {
                    sun: { sign: sunSign, longitude: sunLon },
                    moon: { sign: moonSign, longitude: moonLon },
                    // Mock Ascendant (static for now) 
                    ascendant: { sign: "Libra", longitude: 180 } 
                },
                bazi: {
                    year: {
                        animal: animal, // e.g. "Dragon"
                        element: element, // e.g. "Metal"
                        pillar: `${element} ${animal}`
                    }
                },
                validation: {
                    status: "ok",
                    issues: []
                }
            };
        }
    }
}

function getSignFromLon(lon: number) {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs[Math.floor(lon / 30) % 12];
}
