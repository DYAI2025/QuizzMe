'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        // Simple safe effect
        const timer = setTimeout(() => setAuthChecked(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!authChecked) {
        return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F6F3EE] text-[#0E1B33]">
            <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-serif mb-4 text-center">Origin Point</h1>
                <p className="text-center text-sm mb-8 text-gray-500">Calibration Sequence</p>
                
                <div className="text-center p-4 bg-yellow-50 text-yellow-800 rounded mb-4">
                    <p>Wartungsmodus: Onboarding temporarily simplified for deployment verification.</p>
                </div>

                <button 
                    onClick={() => router.push('/astrosheet')}
                    className="w-full py-4 bg-[#0E1B33] text-white rounded-lg font-bold hover:bg-opacity-90"
                >
                    Enter System
                </button>
            </div>
        </div>
    );
}
