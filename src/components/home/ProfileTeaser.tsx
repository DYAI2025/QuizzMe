
'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPsycheState } from '../../lib/lme/storage';
import { mapPsycheToAvatar } from '../../lib/lme/avatar-mapper';
import { DynamicAvatar } from '../avatar/DynamicAvatar';
import { DEFAULT_PSYCHE_STATE } from '../../lib/lme/psyche-state';

export function ProfileTeaser() {
    const [params, setParams] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const state = getPsycheState();
        setParams(mapPsycheToAvatar(state));
    }, []);

    if (!mounted || !params) {
        // Fallback / Loading state
        return null;
    }

    return (
        <Link href="/profile" className="fixed top-6 right-6 z-50 group">
            <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur border border-purple-500/30 rounded-full p-1 pr-4 shadow-lg hover:shadow-purple-500/20 transition-all hover:scale-105">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 relative">
                    <DynamicAvatar params={params} size={40} />
                </div>
                <div className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                    Mein Profil
                </div>
            </div>
        </Link>
    );
}
