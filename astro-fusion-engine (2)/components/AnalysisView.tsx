import React from 'react';
import { FusionResult, CalculationState } from '../types';

interface Props {
  result: FusionResult;
  state: CalculationState;
  onGenerateImage: () => void;
}

export const AnalysisView: React.FC<Props> = ({ result, state, onGenerateImage }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-block px-3 py-1 border border-green-200 bg-green-50 text-green-700 text-[10px] tracking-widest uppercase rounded-full">
          ✅ Systeme Synchronisiert
        </div>
        <h2 className="font-serif text-4xl text-astro-text">Entdecke Dich Selbst</h2>
        <p className="font-sans text-astro-subtext max-w-lg mx-auto leading-relaxed">
          Mysterium und Klarheit vereint. Finde deine wahre Natur durch reflektierte Analysen und persönliche Erkenntnisse.
        </p>
      </div>

      {/* Synthesis Card */}
      <div className="bg-gradient-to-br from-white to-[#FFFCF7] border border-astro-gold/30 rounded-xl p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg width="100" height="100" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" fill="none">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
          </svg>
        </div>
        
        <div className="text-center mb-8 relative z-10">
          <span className="font-sans text-xs tracking-[0.2em] text-astro-gold uppercase mb-2 block">Cluster</span>
          <h3 className="font-serif text-5xl text-astro-text mb-4">{result.synthesisTitle}</h3>
          <p className="font-serif italic text-lg text-astro-subtext max-w-2xl mx-auto">
            "{result.synthesisDescription}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Western Card */}
          <div className="bg-white/50 backdrop-blur-sm border border-astro-border rounded-lg p-6">
            <h5 className="font-serif text-xl text-astro-text mb-4 border-b border-astro-border pb-2">Westliche Astrologie</h5>
            <div className="space-y-3 font-sans text-sm">
              <div className="flex justify-between items-center">
                <span className="text-astro-subtext">Sonnenzeichen</span>
                <span className="font-medium text-astro-text">{result.western.sunSign}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-astro-subtext">Aszendent</span>
                <span className="font-medium text-astro-text">{result.western.ascendant}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-astro-subtext">Mond (Sim)</span>
                <span className="font-medium text-astro-text">{result.western.moonSign}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-astro-subtext">Element</span>
                <span className="font-medium text-astro-text">{result.western.element}</span>
              </div>
            </div>
          </div>

          {/* Eastern Card */}
          <div className="bg-white/50 backdrop-blur-sm border border-astro-border rounded-lg p-6">
            <h5 className="font-serif text-xl text-astro-text mb-4 border-b border-astro-border pb-2">Chinesische Ba Zi</h5>
            <div className="space-y-3 font-sans text-sm">
              <div className="flex justify-between items-center">
                <span className="text-astro-subtext">Tier (Jahr)</span>
                <span className="font-medium text-astro-text">{result.eastern.yearAnimal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-astro-subtext">Element (Jahr)</span>
                <span className="font-medium text-astro-text">{result.eastern.yearElement}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-astro-subtext">Tier (Monat)</span>
                <span className="font-medium text-astro-text">{result.eastern.monthAnimal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-astro-subtext">Element (Tag)</span>
                <span className="font-medium text-astro-text">{result.eastern.dayElement}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-astro-border text-center">
           <p className="font-sans text-xs text-astro-subtext mb-4">FUSION ENGINE RESULT: {result.elementMatrix}</p>
           
           <button 
             onClick={onGenerateImage}
             disabled={state === CalculationState.GENERATING_IMAGE || state === CalculationState.FINISHED}
             className="bg-gradient-to-r from-astro-text to-[#434343] text-white font-sans uppercase tracking-widest text-xs py-4 px-12 rounded-lg shadow-lg hover:shadow-2xl hover:from-astro-gold hover:to-[#B89628] hover:-translate-y-0.5 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
           >
             {state === CalculationState.GENERATING_IMAGE ? 'Generiere Symbol...' : 'Symbol generieren'}
           </button>
        </div>
      </div>
    </div>
  );
};