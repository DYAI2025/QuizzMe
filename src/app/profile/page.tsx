
'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPsycheState, resetPsycheState } from '../../lib/lme/storage';
import { mapPsycheToAvatar } from '../../lib/lme/avatar-mapper';
import { computeArchetypeMix } from '../../lib/lme/archetype-mix';
import { DynamicAvatar } from '../../components/avatar/DynamicAvatar';
import { PsycheState, DEFAULT_PSYCHE_STATE } from '../../lib/lme/psyche-state';
import { ArchetypeMix } from '../../lib/lme/archetype-mix';

export default function ProfilePage() {
    const [state, setState] = useState<PsycheState>(DEFAULT_PSYCHE_STATE);
    const [avatarParams, setAvatarParams] = useState<any>(null);
    const [archetypes, setArchetypes] = useState<ArchetypeMix>([]);
    const [mounted, setMounted] = useState(false);

    // Safety check to ensure localStorage is available
    useEffect(() => {
        setMounted(true);
        const saved = getPsycheState();
        setState(saved);
        setAvatarParams(mapPsycheToAvatar(saved));
        setArchetypes(computeArchetypeMix(saved));
    }, []);

    const handleReset = () => {
        if (confirm("Dies löscht dein gesamtes Profil unwiderruflich. Bist du sicher?")) {
            resetPsycheState();
            setState(DEFAULT_PSYCHE_STATE);
            setAvatarParams(mapPsycheToAvatar(DEFAULT_PSYCHE_STATE));
            setArchetypes(computeArchetypeMix(DEFAULT_PSYCHE_STATE));
        }
    };

    if (!mounted || !avatarParams) {
        return <div className="min-h-screen bg-[#0f0e17] flex items-center justify-center text-white">Lade Profil...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0f0e17] text-white font-sans selection:bg-purple-500/30">
            {/* Nav */}
            <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto">
                <Link href="/" className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    QuizzMe
                </Link>
                <div className="text-sm text-zinc-500">
                    DEIN PROFIL
                </div>
            </nav>

            <main className="max-w-4xl mx-auto p-6 md:p-12 mb-20">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                        Deine Psyche
                    </h1>
                    <p className="text-zinc-400 max-w-lg mx-auto">
                        Ein lebendiges Abbild deiner inneren Welt, basierend auf deinen Antworten.
                    </p>
                </div>

                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-20 relative">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-1000"></div>
                        <DynamicAvatar params={avatarParams} size={350} className="shadow-2xl shadow-purple-900/20 border-4 border-white/5" />
                    </div>
                </div>

                {/* Archetype Mix */}
                <div className="mb-20">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <span className="text-purple-400 text-xl">✦</span>
                        Archetypen-Mix
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {archetypes.slice(0, 3).map((item, i) => (
                            <div
                                key={item.archetypeId}
                                className={`
                                    bg-zinc-800/30 border border-zinc-700/50 rounded-2xl p-6 relative overflow-hidden group hover:bg-zinc-800/50 transition-colors
                                    ${i === 0 ? 'md:scale-105 border-purple-500/30 shadow-xl shadow-purple-900/10' : 'opacity-80 hover:opacity-100'}
                                `}
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl">
                                    {i + 1}
                                </div>
                                <div className={`text-sm mb-2 font-mono ${i === 0 ? 'text-purple-400' : 'text-zinc-500'}`}>
                                    {(item.weight * 100).toFixed(0)}% Match
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${item.archetype.color}`}>
                                    {item.archetype.name}
                                </h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    {item.archetype.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dimensions (Debug/Viz) */}
                <div className="mb-20 bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800/50">
                    <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-6">Psyche Dimensionen</h3>
                    <div className="space-y-4">
                        {Object.entries(state).map(([key, val]) => (
                            <div key={key} className="flex items-center gap-4">
                                <div className="w-24 text-sm text-zinc-400 capitalize text-right">{key}</div>
                                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-zinc-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${val.value * 100}%`, opacity: 0.5 + (val.value * 0.5) }}
                                    ></div>
                                </div>
                                <div className="w-12 text-xs font-mono text-zinc-600">{(val.value * 100).toFixed(0)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How it works */}
                <div className="prose prose-invert max-w-none mb-20 bg-zinc-800/20 p-8 rounded-3xl border border-white/5">
                    <h2 className="text-xl font-bold text-white mb-4">Wie funktioniert das?</h2>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Jedes Quiz, das du auf dieser Plattform machst, hinterlässt Spuren in deinem Profil ("Marker").
                        Diese Marker werden aggregiert und formen eine kontinuierliche "Psyche".
                        Dein Avatar (das Bild oben) generiert sich algorithmisch aus diesen Werten – er ist einzigartig für dich und verändert sich mit jedem Test, den du machst.
                    </p>
                    <p className="text-zinc-500 text-xs mt-4">
                        Disclaimer: Dies ist ein Experiment (LME Slice 1). Alle Daten werden nur lokal in deinem Browser gespeichert.
                    </p>
                </div>

                {/* Actions */}
                <div className="text-center">
                    <button
                        onClick={handleReset}
                        className="text-red-500 text-xs hover:text-red-400 underline transition-colors"
                    >
                        Profil vollständig zurücksetzen
                    </button>
                </div>
            </main>
        </div>
    );
}
