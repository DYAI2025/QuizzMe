'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPsycheState, resetPsycheState } from '../../lib/lme/storage';
import { mapPsycheToAvatar } from '../../lib/lme/avatar-mapper';
import { computeArchetypeMix } from '../../lib/lme/archetype-mix';
import { DynamicAvatar } from '../../components/avatar/DynamicAvatar';
import { PsycheState, DEFAULT_PSYCHE_STATE } from '../../lib/lme/psyche-state';
import { ArchetypeMix } from '../../lib/lme/archetype-mix';
import { AlchemyBackground } from '@/components/ui/AlchemyBackground';

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
        return (
            <AlchemyBackground withStars>
                <div className="min-h-screen flex items-center justify-center text-white">Lade Profil...</div>
            </AlchemyBackground>
        );
    }

    return (
        <AlchemyBackground withStars>
            <div className="min-h-screen text-white font-sans" style={{ color: 'var(--alchemy-text-light)' }}>
                {/* Nav */}
                <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto">
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity"
                        style={{ fontFamily: 'var(--font-serif)', color: 'var(--alchemy-gold-primary)' }}
                    >
                        QuizzMe
                    </Link>
                    <div
                        className="text-sm"
                        style={{ color: 'var(--alchemy-gold-muted)' }}
                    >
                        DEIN PROFIL
                    </div>
                </nav>

                <main className="max-w-4xl mx-auto p-6 md:p-12 mb-20">

                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <h1
                            className="text-4xl md:text-5xl font-bold mb-4"
                            style={{
                                fontFamily: 'var(--font-serif)',
                                background: 'linear-gradient(135deg, var(--alchemy-text-light), var(--alchemy-gold-primary))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Deine Psyche
                        </h1>
                        <p style={{ color: 'var(--alchemy-text-light-muted)' }} className="max-w-lg mx-auto">
                            Ein lebendiges Abbild deiner inneren Welt, basierend auf deinen Antworten.
                        </p>
                    </div>

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-20 relative">
                        <div className="relative group">
                            <div
                                className="absolute inset-0 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-1000"
                                style={{ background: 'radial-gradient(circle, rgba(210, 169, 90, 0.3), transparent)' }}
                            />
                            <DynamicAvatar params={avatarParams} size={350} className="shadow-2xl border-4" style-border-color="var(--alchemy-gold-primary)" />
                        </div>
                    </div>

                    {/* Archetype Mix */}
                    <div className="mb-20">
                        <h2
                            className="text-2xl font-bold mb-8 flex items-center gap-3"
                            style={{ fontFamily: 'var(--font-serif)' }}
                        >
                            <span style={{ color: 'var(--alchemy-gold-primary)' }}>✦</span>
                            Archetypen-Mix
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {archetypes.slice(0, 3).map((item, i) => (
                                <div
                                    key={item.archetypeId}
                                    className={`
                                        rounded-2xl p-6 relative overflow-hidden group transition-colors
                                        ${i === 0 ? 'md:scale-105 shadow-xl' : 'opacity-80 hover:opacity-100'}
                                    `}
                                    style={{
                                        background: 'rgba(210, 169, 90, 0.08)',
                                        border: i === 0 ? '2px solid var(--alchemy-gold-primary)' : '1px solid rgba(210, 169, 90, 0.2)',
                                    }}
                                >
                                    <div
                                        className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl"
                                        style={{ color: 'var(--alchemy-gold-primary)' }}
                                    >
                                        {i + 1}
                                    </div>
                                    <div
                                        className="text-sm mb-2 font-mono"
                                        style={{ color: i === 0 ? 'var(--alchemy-gold-primary)' : 'var(--alchemy-text-light-muted)' }}
                                    >
                                        {(item.weight * 100).toFixed(0)}% Match
                                    </div>
                                    <h3
                                        className="text-xl font-bold mb-2"
                                        style={{ fontFamily: 'var(--font-serif)', color: 'var(--alchemy-gold-primary)' }}
                                    >
                                        {item.archetype.name}
                                    </h3>
                                    <p
                                        className="text-sm leading-relaxed"
                                        style={{ color: 'var(--alchemy-text-light-muted)' }}
                                    >
                                        {item.archetype.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dimensions (Debug/Viz) */}
                    <div
                        className="mb-20 rounded-3xl p-8"
                        style={{
                            background: 'rgba(210, 169, 90, 0.06)',
                            border: '1px solid rgba(210, 169, 90, 0.2)',
                        }}
                    >
                        <h3
                            className="text-sm font-bold uppercase tracking-widest mb-6"
                            style={{ color: 'var(--alchemy-gold-muted)' }}
                        >
                            Psyche Dimensionen
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(state).map(([key, val]) => (
                                <div key={key} className="flex items-center gap-4">
                                    <div
                                        className="w-24 text-sm capitalize text-right"
                                        style={{ color: 'var(--alchemy-text-light-muted)' }}
                                    >
                                        {key}
                                    </div>
                                    <div
                                        className="flex-1 h-2 rounded-full overflow-hidden"
                                        style={{ background: 'rgba(210, 169, 90, 0.15)' }}
                                    >
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${val.value * 100}%`,
                                                background: 'linear-gradient(90deg, var(--alchemy-gold-dark), var(--alchemy-gold-primary))',
                                                opacity: 0.5 + (val.value * 0.5)
                                            }}
                                        />
                                    </div>
                                    <div
                                        className="w-12 text-xs font-mono"
                                        style={{ color: 'var(--alchemy-text-light-muted)' }}
                                    >
                                        {(val.value * 100).toFixed(0)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* How it works */}
                    <div
                        className="prose prose-invert max-w-none mb-20 p-8 rounded-3xl"
                        style={{
                            background: 'rgba(210, 169, 90, 0.04)',
                            border: '1px solid rgba(210, 169, 90, 0.1)',
                        }}
                    >
                        <h2
                            className="text-xl font-bold mb-4"
                            style={{ fontFamily: 'var(--font-serif)', color: 'var(--alchemy-text-light)' }}
                        >
                            Wie funktioniert das?
                        </h2>
                        <p
                            className="text-sm leading-relaxed"
                            style={{ color: 'var(--alchemy-text-light-muted)' }}
                        >
                            Jedes Quiz, das du auf dieser Plattform machst, hinterlässt Spuren in deinem Profil (Marker).
                            Diese Marker werden aggregiert und formen eine kontinuierliche Psyche.
                            Dein Avatar (das Bild oben) generiert sich algorithmisch aus diesen Werten – er ist einzigartig für dich und verändert sich mit jedem Test, den du machst.
                        </p>
                        <p
                            className="text-xs mt-4"
                            style={{ color: 'var(--alchemy-text-light-muted)', opacity: 0.7 }}
                        >
                            Disclaimer: Dies ist ein Experiment (LME Slice 1). Alle Daten werden nur lokal in deinem Browser gespeichert.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="text-center">
                        <button
                            onClick={handleReset}
                            className="text-xs hover:opacity-80 underline transition-colors"
                            style={{ color: 'var(--alchemy-text-light-muted)' }}
                        >
                            Profil vollständig zurücksetzen
                        </button>
                    </div>
                </main>
            </div>
        </AlchemyBackground>
    );
}
