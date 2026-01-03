'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';
import { MAJOR_CITIES, PlaceOption } from '@/lib/places';
import { upsertProfile } from '@/lib/astroProfiles';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);
    // const [step, setStep] = useState(1); // Unused for now
    const [loading, setLoading] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    // Form State
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [selectedPlace, setSelectedPlace] = useState<PlaceOption | null>(null);
    const [name, setName] = useState('');

    const canSubmit = date && time && selectedPlace && name;

    useEffect(() => {
        const ensureSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    router.replace('/login');
                    return;
                }
                setAuthChecked(true);
            } catch (err) {
                console.error('Session check failed', err);
                router.replace('/login');
            }
        };

        ensureSession();
    }, [router, supabase]);

    const runFlow = async () => {
        if (!canSubmit) return;
        setErrorMessage(null);
        setLoading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.replace('/login');
                setLoading(false);
                return;
            }

            if (selectedPlace) {
                await upsertProfile({
                    username: name,
                    birth_date: date,
                    birth_time: time,
                    birth_place_name: selectedPlace.name,
                    birth_lat: selectedPlace.lat,
                    birth_lng: selectedPlace.lng,
                    iana_time_zone: selectedPlace.tz,
                });
            }

            const res = await fetch('/api/astro/compute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ force: true })
            });

            const data = await res.json();

            if (res.status === 401) {
                router.replace('/login');
                setLoading(false);
                return;
            }

            if (!res.ok) {
                if (data.code === 'AMBIGUOUS_LOCAL_TIME') {
                    setErrorMessage('DST Ambiguity detected (Implementation pending for Phase 3.2)');
                } else if (data.code === 'NONEXISTENT_LOCAL_TIME') {
                    setErrorMessage('Invalid Time detected (DST gap) (Implementation pending for Phase 3.3)');
                } else {
                    setErrorMessage(data.error || 'Computation failed');
                }
                setLoading(false);
                return;
            }

            router.push('/character');
        } catch (err: unknown) {
            console.error("Onboarding failed:", err);
            const msg = err instanceof Error ? err.message : 'Unknown error';
            setErrorMessage(msg);
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await runFlow();
    };

    if (!authChecked) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#F6F3EE] text-[#0E1B33]">
                <Loader2 className="animate-spin text-[#C9A46A]" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#F6F3EE] text-[#0E1B33]">
           <div className="w-full max-w-lg p-12 bg-white border border-[#E6E0D8] shadow-xl rounded-3xl">
              <div className="text-center mb-12">
                 <h1 className="serif text-4xl mb-2">Origin Point</h1>
                 <p className="mono text-[10px] uppercase tracking-widest text-[#5A6477]">
                    Calibration Sequence
                 </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                 {/* Name */}
                 <div className="space-y-3">
                    <label htmlFor="name-input" className="mono text-[10px] uppercase tracking-widest font-bold">Callsign</label>
                    <input 
                       id="name-input"
                       type="text" 
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       placeholder="Enter your name"
                       className="w-full p-4 bg-[#F6F3EE] rounded-xl border-none focus:ring-1 focus:ring-[#C9A46A] transition-all"
                    />
                 </div>

                 {/* Date */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <label htmlFor="date-input" className="mono text-[10px] uppercase tracking-widest font-bold">Date</label>
                        <input 
                           id="date-input"
                           title="Birth Date"
                           type="date"
                           value={date}
                           onChange={(e) => setDate(e.target.value)}
                           className="w-full p-4 bg-[#F6F3EE] rounded-xl border-none focus:ring-1 focus:ring-[#C9A46A] transition-all"
                        />
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="time-input" className="mono text-[10px] uppercase tracking-widest font-bold">Time</label>
                        <input 
                           id="time-input"
                           title="Birth Time"
                           type="time"
                           value={time}
                           onChange={(e) => setTime(e.target.value)}
                           className="w-full p-4 bg-[#F6F3EE] rounded-xl border-none focus:ring-1 focus:ring-[#C9A46A] transition-all"
                        />
                    </div>
                 </div>

                 {/* Place */}
                 <div className="space-y-3">
                    <label htmlFor="place-select" className="mono text-[10px] uppercase tracking-widest font-bold">Location</label>
                    <select 
                       id="place-select"
                       title="Birth Place"
                       value={selectedPlace?.name || ''}
                       onChange={(e) => {
                           const place = MAJOR_CITIES.find(p => p.name === e.target.value);
                           setSelectedPlace(place || null);
                       }}
                       className="w-full p-4 bg-[#F6F3EE] rounded-xl border-none focus:ring-1 focus:ring-[#C9A46A] transition-all"
                    >
                       <option value="">Select major city...</option>
                       {MAJOR_CITIES.map(c => (
                           <option key={c.name} value={c.name}>{c.name}, {c.country}</option>
                       ))}
                    </select>
                    <p className="text-[10px] text-[#A1A1AA] text-right">
                       *MVP: Validated Major Cities Only
                    </p>
                 </div>

                 <button
                    type="submit"
                    disabled={!canSubmit || loading}
                    className="w-full py-5 bg-[#0E1B33] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#1a2c4e] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                 >
                    {loading ? <Loader2 className="animate-spin" /> : <>Initialize <ArrowRight size={16}/></>}
                 </button>
                 {errorMessage && (
                    <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-xl flex flex-col gap-3">
                        <p className="mono text-[12px]">{errorMessage}</p>
                        <div className="flex gap-3 flex-wrap">
                            <button
                                type="button"
                                onClick={runFlow}
                                className="px-4 py-3 bg-[#0E1B33] text-white rounded-lg text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-[#1a2c4e]"
                            >
                                Erneut versuchen
                            </button>
                            <a
                                href="/login"
                                className="px-4 py-3 border border-[#E6E0D8] rounded-lg text-[12px] font-bold uppercase tracking-[0.2em] hover:border-[#0E1B33]"
                            >
                                Zur Login-Seite
                            </a>
                        </div>
                    </div>
                 )}
              </form>
           </div>
        </div>
    );
}
