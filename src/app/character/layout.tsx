
import React from 'react';

/**
 * Character Dashboard Layout
 * 
 * Sets the "Deep Space Nebula" atmosphere for "The Altar".
 * Uses a fixed background to ensure smooth scrolling of content over it.
 */
export default function CharacterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      
      {/* Background Layer: Deep Nebula */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Base dark noise/gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,20,80,0.15),transparent_70%)]"></div>
        
        {/* Subtle Stars (Simple CSS implementation instead of heavy Particles for now to ensure perf) */}
        <div className="absolute inset-0 opacity-30" 
             style={{ 
               backgroundImage: 'radial-gradient(white 1px, transparent 1px)', 
               backgroundSize: '50px 50px' 
             }}>
        </div>
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
