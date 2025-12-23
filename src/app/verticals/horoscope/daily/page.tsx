"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSnapshotClient } from "@/lib/api";
import { computeAstro, calculateDailyTransits, BirthInput } from "@/lib/astro/compute";
import { getInterpretation } from "@/lib/astro/interpretations";

export default function DailyHoroscopePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSnapshotClient().then((result) => {
            setProfile(result.snapshot);
            setLoading(false);
        });
    }, []);

    const horoscopeData = useMemo(() => {
        if (!profile?.identity?.birth?.date) return null;

        // Reconstruct birth object
        const birthDate = new Date(profile.identity.birth.date);
        // If we had birth time/place stored in simplified form:
        // profile.identity.birth might have time/place strings if we updated ingestion.
        // Currently buildEvent.ts puts astro RESULTS in payload.astro, but 
        // does it store the RAW birth data? 
        // The ProfileSnapshot definition has `birth?: { date?: string; time?: string; place?: string }`.
        // We need to ensure onboarding actually SAVES this to the profile identity.
        // LME ingestion usually maps event payload to snapshot.
        // If onboarding.astro.v1 doesn't write to identity.birth automatically, we might miss it.
        // But for now let's assume we have the date.

        // We also have calculated astro data in profile.astro.western

        // Recalculate transits
        // Note: We need a 'Natal Chart' structure for compute. 
        // calculateDailyTransits needs a natal chart object (simplified).
        // We can reconstruct a basic one from specific components if full natal chart isn't stored.

        // Wait, computed astro result doesn't give planetary degrees for ALL planets.
        // So "Real Transits" requires re-running the full calc for the birth date.

        const birthTime = profile.identity.birth.time ? {
            hour: parseInt(profile.identity.birth.time.split(":")[0]),
            minute: parseInt(profile.identity.birth.time.split(":")[1])
        } : undefined;

        // We try to parse place if stored? "CityName". 
        // For now, we only need JUPITER/SATURN/SUN positions.
        // Let's re-run computeAstro to get full positions if we had a function returning them.
        // I need to expose 'getPlanetPosition' or 'calculateNatalChart' in compute.ts/astronomy.ts
        // For MVP, I will just call a new helper or use raw astronomy.

        return calculateDailyTransits(null, new Date()); // logic inside needs update to actually work

    }, [profile]);

    // Actually, calculateDailyTransits in compute.ts was left as a TODO for the real logic.
    // I need to update compute.ts to actually perform the transit check against the User's Natal positions.

    if (loading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading your stars...</div>;
    }

    if (!profile?.astro?.western?.sunSign) {
        // Not onboarded
        return (
            <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center">
                <h1 className="text-2xl mb-4">Astralprofil nicht gefunden</h1>
                <button
                    onClick={() => router.push("/onboarding/astro")}
                    className="bg-indigo-600 px-6 py-2 rounded-lg"
                >
                    Profil erstellen
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
            {/* Header */}
            <div className="relative h-48 bg-gradient-to-b from-indigo-900 to-slate-950 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('/assets/stars-bg.png')]"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 to-transparent">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-400">
                        Ihr Tageshoroskop
                    </h1>
                    <p className="text-slate-400">
                        Für {profile.identity.displayName || "Sie"} • {new Date().toLocaleDateString('de-DE')}
                    </p>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 -mt-8 relative z-10 space-y-6">

                {/* Main Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl">☀</div>
                        <div>
                            <h2 className="text-xl font-bold">Die Sonne heute</h2>
                            <p className="text-sm text-indigo-400">Transit-Einfluss</p>
                        </div>
                    </div>

                    <div className="prose prose-invert">
                        {/* We need the REAL text from horoscopeData */}
                        <p>
                            Die Sterne stehen heute... (Text placeholder until logic connected)
                        </p>
                    </div>
                </div>

                {/* Moon Phase */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="text-sm text-slate-400 mb-1">Mondphase</div>
                        <div className="text-lg font-medium">Zunehmend</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="text-sm text-slate-400 mb-1">Element</div>
                        <div className="text-lg font-medium capitalize">{profile.astro.western.elementsMix?.fire ? "Feuer" : "..."}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
