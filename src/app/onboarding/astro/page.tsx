'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';
import { MAJOR_CITIES, PlaceOption } from '@/lib/places';
import { upsertProfile } from '@/lib/astroProfiles';

export default function OnboardingPage() {
    const router = useRouter();
    // const [step, setStep] = useState(1); // Unused for now
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [selectedPlace, setSelectedPlace] = useState<PlaceOption | null>(null);
    const [name, setName] = useState('');

    const canSubmit = date && time && selectedPlace && name;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        setLoading(true);
        try {
            // 1. Persist Profile
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

            // 2. Trigger Compute
            const res = await fetch('/api/astro/compute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ force: true })
            });

            const data = await res.json();

            if (!res.ok) {
                // Handle Errors
                if (data.code === 'AMBIGUOUS_LOCAL_TIME') {
                   alert("DST Ambiguity detected (Implementation pending for Phase 3.2)");
                   // TODO: Open Fold Choice Dialog
                } else if (data.code === 'NONEXISTENT_LOCAL_TIME') {
                   alert("Invalid Time detected (DST gap) (Implementation pending for Phase 3.3)");
                   // TODO: Show Error on time field
                } else {
                   throw new Error(data.error || 'Computation failed');
                }
                setLoading(false);
                return;
            }

            // 3. Success -> Redirect
            router.push('/character');
            
        } catch (err: unknown) {
            console.error("Onboarding failed:", err);
            const msg = err instanceof Error ? err.message : 'Unknown error';
            alert(`Error: ${msg}`);
            setLoading(false);
        }
    };

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
              </form>
           </div>
        </div>
    );
}
