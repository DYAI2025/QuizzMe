import React from 'react';

interface Props {
  imageUrl: string;
  synthesis: string;
}

export const ResultSymbol: React.FC<Props> = ({ imageUrl, synthesis }) => {
  return (
    <div className="mt-12 animate-fade-in-up">
      <div className="border border-[#EBEBEB] bg-[#FFFBF5] p-8 rounded-xl text-center max-w-lg mx-auto shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-astro-gold/10 to-transparent rounded-full blur-xl opacity-50"></div>
          <img 
            src={imageUrl} 
            alt="Generated Cosmic Symbol" 
            className="w-64 h-64 mx-auto rounded-full object-cover border-4 border-white shadow-inner relative z-10 transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        
        <h3 className="font-serif text-3xl text-astro-text mb-2">Dein Schicksal im Kosmos</h3>
        <p className="font-sans text-sm text-astro-subtext mb-6">
          Tritt in unsere Astrologie-Sphäre ein und entdecke die kosmischen Muster.
        </p>
        
        <div className="inline-flex items-center gap-2 text-astro-gold font-serif italic border-b border-astro-gold pb-1 cursor-pointer hover:opacity-75 transition-opacity">
          <span>Zu den Sternen</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </div>
      </div>
    </div>
  );
};