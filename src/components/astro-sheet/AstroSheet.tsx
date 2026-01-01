"use client";

import React from 'react';
import Sidebar from './Sidebar';
import IdentityBadges from './IdentityBadges';
import DailyQuest from './DailyQuest';
import StatsCard from './StatsCard';
import LootSection from './LootSection';
import QuizzesCard from './QuizzesCard';
import AgentsSection from './AgentsSection';
import { Search, Activity } from 'lucide-react';
import { useAstroProfile } from '@/hooks/useAstroProfile';
import { mapProfileToViewModel } from './mapper';
import { UserProfile, MasterIdentity, Stat, QuizItem, Agent } from './types';
import { CORE_STATS, IDENTITY_DATA, QUIZZES, AGENTS } from './constants';

export default function AstroSheet() {
  const { profile, loading: loadingProfile } = useAstroProfile();

  const [timestamp, setTimestamp] = React.useState<number>(0);

  React.useEffect(() => {
    setTimestamp(Date.now());
  }, []);

  const viewModel = mapProfileToViewModel(profile);

  // 1. User Adapter
  const user: UserProfile = {
    name: viewModel.identity.displayName || 'TRAVELER',
    level: viewModel.identity.level || 1,
    status: viewModel.identity.status || 'UNPLUGGED',
  };

  // 2. Identity Adapter (Hybrid: Real Western + Real Ba Zi)
  const masterIdentity: MasterIdentity = {
    ...IDENTITY_DATA, 
    konstellation: {
      sun: viewModel.identity.solarSign,
      moon: viewModel.identity.lunarSign,
      rising: viewModel.identity.ascendantSign,
    },
    // Override Ba Zi mocks if available
    element: viewModel.identity.element || IDENTITY_DATA.element,
    animal: viewModel.identity.animal || IDENTITY_DATA.animal,
  };

  // 3. Stats Adapter
  const stats: Stat[] = viewModel.stats.length > 0 ? viewModel.stats : CORE_STATS;

  // 4. Quizzes & Agents (Placeholder/Mock for now as per plan)
  const quizzes: QuizItem[] = QUIZZES;
  const agents: Agent[] = AGENTS;

  if (loadingProfile) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F6F3EE] text-[#0E1B33]">
           <div className="flex flex-col items-center gap-4">
              <Activity className="animate-spin text-[#C9A46A]" size={32} />
              <span className="mono text-xs uppercase tracking-widest font-bold">Loading Matrix...</span>
           </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen">
      <Sidebar user={user} />
      
      <main className="pl-[260px] min-h-screen relative z-10">
        {/* Topbar / Editorial Header */}
        <header className="h-28 px-16 flex items-center justify-between border-b border-[#E6E0D8] bg-white/60 backdrop-blur-xl sticky top-0 z-50">
          <div>
             <h2 className="serif text-4xl font-light text-[#0E1B33] tracking-tight">Dein Character Sheet</h2>
             <div className="flex items-center gap-3 mt-1.5">
                <span className="mono text-[10px] text-[#5A6477] font-bold tracking-[0.3em] uppercase opacity-60">KI-generiert • Keine Vorhersage</span>
             </div>
          </div>
          
          <div className="flex items-center gap-12">
            <div className="relative group hidden lg:block">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" size={16} />
               <input 
                 type="text" 
                 placeholder="Matrix durchsuchen..."
                 className="pl-14 pr-8 py-3.5 bg-[#F6F3EE] border border-[#E6E0D8] rounded-full text-xs font-medium focus:outline-none focus:border-[#C9A46A] w-72 transition-all"
               />
            </div>
            <button className="px-12 py-4 bg-[#0E1B33] text-white text-[11px] font-extrabold uppercase tracking-[0.4em] rounded-full hover:bg-[#8F7AD1] transition-all shadow-xl shadow-[#0E1B33]/10">
              UPGRADE
            </button>
            <a 
              href={user.name === 'TRAVELER' && user.status === 'UNPLUGGED' ? "/login" : "#"} 
              className={`px-8 py-4 ${user.name === 'TRAVELER' ? 'bg-[#C9A46A] hover:bg-[#b08d55]' : 'bg-transparent border border-[#E6E0D8] hover:bg-[#F6F3EE]'} text-white text-[11px] font-extrabold uppercase tracking-[0.4em] rounded-full transition-all`}
            >
              {user.name === 'TRAVELER' ? 'LOGIN' : 'PROFILE'}
            </a>
          </div>
        </header>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-16 py-24 space-y-40">
          
          {/* Identity Section - Consolidated Badge */}
          <section className="animate-reveal" style={{ animationDelay: '0.1s' }}>
            <IdentityBadges data={masterIdentity} />
          </section>

          {/* Daily Horoscope - Oracle Section */}
          <section className="space-y-24 animate-reveal" style={{ animationDelay: '0.2s' }}>
             <div className="text-center relative">
                <div className="cluster-title absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">ORACLE</div>
                <div className="relative z-10">
                  <div className="text-[11px] uppercase tracking-[0.8em] font-extrabold text-[#7AA7A1] mb-5">Daily_Transit</div>
                  <h2 className="serif text-7xl font-light text-[#0E1B33] tracking-tighter">Heutige Resonanz</h2>
                </div>
             </div>
             
             <div className="space-y-12">
               <DailyQuest />
               
               {/* Agents Section directly integrated into the Oracle flow */}
               <div className="grid grid-cols-12">
                 <div className="col-span-12">
                   <AgentsSection agents={agents} />
                 </div>
               </div>
             </div>
          </section>

          {/* Progress & Stats - High Contrast Block */}
          <section className="space-y-24 animate-reveal" style={{ animationDelay: '0.3s' }}>
            <div className="text-center relative">
               <div className="cluster-title absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">STATS</div>
               <div className="relative z-10">
                 <div className="text-[11px] uppercase tracking-[0.8em] font-extrabold text-[#C9A46A] mb-5">System-Status</div>
                 <h2 className="serif text-7xl font-light text-[#0E1B33] tracking-tighter">Entfaltungs-Matrix</h2>
               </div>
            </div>
            <StatsCard stats={stats} />
          </section>

          {/* Loot & Quizzes - High Alignment Block */}
          <section className="space-y-24">
             <div className="text-center relative">
                <div className="cluster-title absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">LOOT</div>
                <div className="relative z-10">
                  <div className="text-[11px] uppercase tracking-[0.8em] font-extrabold text-[#7AA7A1] mb-5">Inventory</div>
                  <h2 className="serif text-7xl font-light text-[#0E1B33] tracking-tighter">Mission & Belohnung</h2>
                </div>
             </div>
             <div className="grid grid-cols-12 gap-12 items-stretch">
               <div className="col-span-12 lg:col-span-8 flex flex-col">
                 <LootSection />
               </div>
               <div className="col-span-12 lg:col-span-4 h-full flex flex-col">
                 <QuizzesCard quizzes={quizzes} />
               </div>
             </div>
          </section>

          {/* Calibration Action */}
          <section className="animate-reveal" style={{ animationDelay: '0.5s' }}>
             <div className="flex justify-center mb-24">
                <a href="/onboarding/astro" className="px-8 py-4 border border-[#E6E0D8] bg-white text-[10px] mono font-bold uppercase tracking-[0.4em] text-[#A1A1AA] hover:text-[#0E1B33] hover:border-[#0E1B33] rounded-full transition-all flex items-center gap-3">
                   <Activity size={14} className="text-[#C9A46A]" />
                   Recalibrate Origin Data
                </a>
             </div>
          </section>

          {/* Event Log Pill */}
          <div className="flex justify-center pt-12">
             <div className="px-8 py-4 bg-white border border-[#E6E0D8] rounded-full shadow-sm flex items-center gap-5 mono text-[10px] text-[#5A6477] font-bold uppercase tracking-[0.4em]">
                <Activity size={14} className="text-[#7AA7A1] animate-pulse" />
                event: cluster_completed ... +tile ... ts: {timestamp}
             </div>
          </div>
        </div>


        {/* Premium Footer */}
        <footer className="p-20 mt-40 border-t border-[#E6E0D8] bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-4 h-4 rounded-full bg-[#7AA7A1] shadow-[0_0_15px_#7AA7A1]" />
              <span className="mono text-[11px] text-[#0E1B33] font-extrabold uppercase tracking-[0.5em]">
                ASTRO • CHARACTER • V10.4
              </span>
            </div>
            <div className="text-[10px] mono uppercase tracking-[0.4em] text-[#A1A1AA] font-medium text-center md:text-right">
              Berechnet ≠ Deutung • Nur Reflexion/Unterhaltung
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
