import React from 'react';
import { Transit } from '../types';

interface Props {
  transits: Transit[];
  isLoading: boolean;
}

export const CosmicWeather: React.FC<Props> = ({ transits, isLoading }) => {
  const date = new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (isLoading) {
    return (
      <div className="border border-astro-border rounded-xl p-6 bg-white/50 backdrop-blur-sm animate-pulse h-64 flex items-center justify-center">
        <span className="text-astro-gold font-serif italic">Lade planetare Daten...</span>
      </div>
    );
  }

  return (
    <div className="border border-astro-border rounded-xl p-0 bg-white shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 bg-[#FAFAFA] border-b border-astro-border flex justify-between items-center">
        <div>
          <h3 className="font-serif text-2xl text-astro-text">Kosmisches Wetter</h3>
          <p className="font-sans text-[10px] text-astro-subtext uppercase tracking-widest mt-1">{date}</p>
        </div>
        <div className="text-2xl animate-spin-slow opacity-20">✺</div>
      </div>
      
      <div className="divide-y divide-astro-border">
        {transits.map((transit, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between hover:bg-[#FFFBF5] transition-colors group">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-serif
                ${transit.body === 'Sun' ? 'bg-astro-gold' : 
                  transit.body === 'Moon' ? 'bg-gray-400' : 
                  transit.element === 'Fire' ? 'bg-red-400' :
                  transit.element === 'Water' ? 'bg-blue-400' :
                  transit.element === 'Air' ? 'bg-yellow-400' : 'bg-green-400'
                }`}>
                {transit.body.substring(0, 2)}
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg text-astro-text leading-none">{transit.body}</span>
                {transit.isRetrograde && (
                  <span className="text-[9px] uppercase text-red-500 tracking-widest font-bold">Retrograde</span>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-sans text-sm font-medium text-astro-text group-hover:text-astro-gold transition-colors">
                {transit.sign}
              </div>
              <div className="text-xs text-astro-subtext">
                {transit.degree}°
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-[#FAFAFA] border-t border-astro-border text-center">
        <p className="text-[9px] text-astro-subtext uppercase tracking-widest">
          Datenquelle: AstroPhysics Engine v1.0
        </p>
      </div>
    </div>
  );
};
