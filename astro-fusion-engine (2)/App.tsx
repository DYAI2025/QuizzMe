import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { InputCard } from './components/InputCard';
import { AnalysisView } from './components/AnalysisView';
import { ResultSymbol } from './components/ResultSymbol';
import { QuizView } from './components/QuizView';
import { CosmicWeather } from './components/CosmicWeather';
import { BirthData, CalculationState, FusionResult, Transit } from './types';
import { runFusionAnalysis } from './services/astroPhysics';
import { generateSymbol } from './services/geminiService';
import { fetchCurrentTransits } from './services/transitService';

type ViewType = 'dashboard' | 'quizzes';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  
  // Astro Engine State
  const [astroState, setAstroState] = useState<CalculationState>(CalculationState.IDLE);
  const [analysisResult, setAnalysisResult] = useState<FusionResult | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Cosmic Weather State
  const [transits, setTransits] = useState<Transit[]>([]);
  const [loadingTransits, setLoadingTransits] = useState(false);

  useEffect(() => {
    // Fetch transits on mount
    const loadTransits = async () => {
      setLoadingTransits(true);
      try {
        const data = await fetchCurrentTransits();
        setTransits(data);
      } catch (e) {
        console.error("Failed to load transits", e);
      } finally {
        setLoadingTransits(false);
      }
    };
    loadTransits();
  }, []);

  const handleValidation = async (data: BirthData) => {
    setAstroState(CalculationState.CALCULATING);
    
    try {
      const result = await runFusionAnalysis(data);
      setAnalysisResult(result);
      setAstroState(CalculationState.COMPLETE);
    } catch (error) {
      console.error("Analysis Failed", error);
      setAstroState(CalculationState.ERROR);
    }
  };

  const handleGenerateImage = async () => {
    if (!analysisResult) return;
    
    setAstroState(CalculationState.GENERATING_IMAGE);
    const imageUrl = await generateSymbol(analysisResult.prompt);
    setGeneratedImage(imageUrl);
    setAstroState(CalculationState.FINISHED);
  };

  return (
    <div className="min-h-screen bg-astro-bg text-astro-text pl-20 md:pl-64 transition-all duration-300">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="max-w-6xl mx-auto p-6 md:p-12 lg:p-16">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2 text-astro-subtext text-xs font-sans tracking-widest uppercase">
            <span>System_Ref_V2.1</span>
            <span className="text-astro-gold">•</span>
            <span>{currentView === 'dashboard' ? 'Fusion_Active' : 'Knowledge_Base'}</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-astro-text text-white flex items-center justify-center font-serif">J</div>
            <span className="font-sans text-sm font-medium">Julian S.</span>
          </div>
        </div>

        {/* View Router */}
        {currentView === 'quizzes' ? (
          <QuizView />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
            {/* Left Column: Input */}
            <div className="lg:col-span-4 space-y-8">
              <InputCard 
                onSubmit={handleValidation} 
                isLoading={astroState === CalculationState.CALCULATING} 
              />
              
              {/* Decorative element */}
              <div className="hidden lg:block border-l border-astro-border pl-6 py-4 space-y-12 opacity-50">
                <div>
                    <h4 className="font-serif text-lg text-astro-gold mb-2">Natur</h4>
                    <p className="text-xs leading-relaxed">Die Essenz deiner Verbindung zur natürlichen Welt.</p>
                </div>
                <div>
                    <h4 className="font-serif text-lg text-astro-gold mb-2">Seele</h4>
                    <p className="text-xs leading-relaxed">Der Kern deiner emotionalen Intelligenz.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Output */}
            <div className="lg:col-span-8">
              {astroState === CalculationState.IDLE && (
                <div className="space-y-8">
                  {/* Cosmic Weather Section (Default view when idle) */}
                  <CosmicWeather transits={transits} isLoading={loadingTransits} />
                  
                  <div className="flex flex-col items-center justify-center text-center opacity-40 py-8">
                    <div className="w-12 h-12 border border-astro-text rounded-full flex items-center justify-center mb-4">
                      <span className="text-xl">?</span>
                    </div>
                    <p className="font-sans text-sm">Warte auf Eingabe für persönliche Fusion.</p>
                  </div>
                </div>
              )}

              {astroState === CalculationState.ERROR && (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 text-red-500">
                  <h3 className="font-serif text-2xl">Fehler bei der Berechnung</h3>
                  <p className="font-sans text-sm mt-2">Die Verbindung zum Kosmos wurde unterbrochen. Bitte versuche es erneut.</p>
                </div>
              )}

              {(astroState !== CalculationState.IDLE && astroState !== CalculationState.ERROR) && analysisResult && (
                <AnalysisView 
                  result={analysisResult} 
                  state={astroState}
                  onGenerateImage={handleGenerateImage}
                />
              )}

              {generatedImage && analysisResult && (
                <ResultSymbol imageUrl={generatedImage} synthesis={analysisResult.synthesisTitle} />
              )}
            </div>
          </div>
        )}

        {/* Footer / Copyright */}
        <div className="mt-20 pt-8 border-t border-astro-border text-center">
          <p className="font-sans text-[10px] text-astro-subtext uppercase tracking-widest">
            © 2025 QuizzMe. Mystik trifft Substanz.
          </p>
        </div>

      </main>
    </div>
  );
}
