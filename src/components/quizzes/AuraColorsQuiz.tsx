'use client'

import React, { useState } from 'react';
import {
  questions,
  profiles,
  elements,
  quizMeta,
  dimensions,
  normalizeScores,
  calculateColorScores,
  determinePrimaryColor,
  determineSecondaryColor,
  determineElement,
  type DimensionScores,
  type AuraProfile,
  type ElementInfo
} from './aura-colors/data';
import { contributeClient as contribute } from '@/lib/api';
import { useClusterProgress } from '@/lib/stores/useClusterProgress';
import { ValidationProfile } from './types';
import { AlchemyButton, AlchemyLinkButton } from '@/components/ui/AlchemyButton';

// Micro-win messages (no emojis)
const microWinMessages = [
  "Die Energie fließt...",
  "Interessant...",
  "Deine Aura formt sich...",
  "Ein Muster entsteht...",
  "Weiter so...",
  "Tiefe Einblicke...",
  "Die Farben werden klarer...",
  "Fast da..."
];

interface QuizResult {
  primary: AuraProfile;
  secondary: AuraProfile;
  element: ElementInfo;
}

// Marker type for collected markers
interface CollectedMarker {
  id: string;
  weight: number;
}

export function AuraColorsQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<DimensionScores>({
    energiefluss: 0,
    rhythmus: 0,
    wahrnehmung: 0,
    resonanz: 0
  });
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [started, setStarted] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [microWin, setMicroWin] = useState<string | null>(null);
  const [collectedMarkers, setCollectedMarkers] = useState<CollectedMarker[]>([]);

  const { completeQuiz } = useClusterProgress();

  const calculateResult = (finalScores: DimensionScores, allMarkers: CollectedMarker[]): QuizResult => {
    const normalized = normalizeScores(finalScores);
    const colorScores = calculateColorScores(normalized);
    
    const primaryColorId = determinePrimaryColor(colorScores);
    const secondaryColorId = determineSecondaryColor(colorScores, primaryColorId);
    const elementId = determineElement(normalized);
    
    const primary = profiles[primaryColorId];
    const secondary = profiles[secondaryColorId];
    const element = elements[elementId];

    // Combine collected markers with profile markers (following established pattern)
    const finalMarkers = [...allMarkers, ...primary.markers];

    // Emit contribution event
    const event = {
      specVersion: "sp.contribution.v1" as const,
      eventId: crypto.randomUUID(),
      occurredAt: new Date().toISOString(),
      source: {
        vertical: "quiz" as const,
        moduleId: quizMeta.id,
        domain: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
        locale: "de-DE"
      },
      payload: {
        markers: finalMarkers.map((m) => ({
          id: m.id,
          weight: m.weight
        })),
        fields: [
          { id: 'field.aura.primary_color', value: primary.title, kind: 'text' as const },
          { id: 'field.aura.secondary_color', value: secondary.title, kind: 'text' as const },
          { id: 'field.aura.element', value: element.name, kind: 'text' as const },
          { id: 'field.aura.archetype', value: primary.archetype, kind: 'text' as const }
        ],
        tags: [
          { id: `tag.aura.${primary.id}`, label: primary.title, kind: 'archetype' as const },
          { id: `tag.element.${elementId}`, label: element.name, kind: 'astro' as const }
        ],
        summary: {
          title: `Aurafarbe: ${primary.title}`,
          bullets: [primary.tagline, `Element: ${element.name}`],
          resultId: primary.id
        }
      }
    };

    void contribute(event);

    return { primary, secondary, element };
  };

  const handleAnswer = (option: typeof questions[0]['options'][0]) => {
    // Accumulate scores
    const newScores = { ...scores };
    if (option.scores) {
      Object.entries(option.scores).forEach(([key, value]) => {
        newScores[key] = (newScores[key] || 0) + (value as number);
      });
    }
    setScores(newScores);

    // Collect markers from the selected option
    const newMarkers = [...collectedMarkers];
    if (option.markers) {
      newMarkers.push(...option.markers);
    }
    setCollectedMarkers(newMarkers);

    // Show micro-win with deterministic variety
    const msgIndex = (currentQuestion + scores.energiefluss) % microWinMessages.length;
    const winMessage = microWinMessages[msgIndex];
    setMicroWin(winMessage);
    setTimeout(() => setMicroWin(null), 800);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        const finalResult = calculateResult(newScores, newMarkers);
        setResult(finalResult);
        setShowResult(true);

        // Mark completion in Cluster Store
        completeQuiz("cluster.naturkind.v1", quizMeta.id, finalResult.primary.id, finalResult.primary.title);
      }, 500);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores({ energiefluss: 0, rhythmus: 0, wahrnehmung: 0, resonanz: 0 });
    setCollectedMarkers([]);
    setShowResult(false);
    setResult(null);
    setStarted(false);
    setShowDescription(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const currentDimension = dimensions.find(d => d.id === currentQ?.dimension);

  // Intro Screen
  if (!started) {
    return (
      <div 
        className="min-h-[600px] flex items-center justify-center rounded-3xl p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(165deg, #053B3F 0%, #041726 50%, #031119 100%)'
        }}
      >
        {/* Background glow effects */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 20% 30%, rgba(210, 169, 90, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(108, 161, 146, 0.06) 0%, transparent 50%)'
          }}
        />
        
        <div className="relative z-10 max-w-lg w-full text-center">
          {/* Aura Icon */}
          <div className="w-28 h-28 mx-auto mb-8 relative">
            <svg viewBox="0 0 120 120" fill="none" className="w-full h-full animate-pulse">
              <defs>
                <radialGradient id="auraGrad1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D2A95A" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#D2A95A" stopOpacity="0"/>
                </radialGradient>
                <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E8C87A"/>
                  <stop offset="100%" stopColor="#A77D38"/>
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="50" fill="url(#auraGrad1)"/>
              <circle cx="60" cy="60" r="35" stroke="url(#goldLine)" strokeWidth="1.5" fill="none" opacity="0.6"/>
              <circle cx="60" cy="60" r="20" stroke="url(#goldLine)" strokeWidth="1" fill="none" opacity="0.4"/>
              <circle cx="60" cy="60" r="8" fill="#D2A95A"/>
              <path d="M60 20 L60 10 M60 110 L60 100 M20 60 L10 60 M110 60 L100 60" stroke="#D2A95A" strokeWidth="1" opacity="0.5"/>
              <path d="M32 32 L26 26 M88 32 L94 26 M32 88 L26 94 M88 88 L94 94" stroke="#D2A95A" strokeWidth="1" opacity="0.3"/>
            </svg>
          </div>
          
          <h1 
            className="text-4xl md:text-5xl font-serif font-medium mb-4" 
            style={{ color: '#D2A95A' }}
          >
            {quizMeta.title}
          </h1>
          
          <p 
            className="text-lg mb-8 leading-relaxed max-w-md mx-auto"
            style={{ color: '#A8B5A0' }}
          >
            {quizMeta.subtitle} — und die Farbe, in der deine Seele spricht.
          </p>
          
          <div 
            className="flex justify-center gap-6 mb-10 text-sm"
            style={{ color: '#A8B5A0' }}
          >
            <span>3 Min</span>
            <span>12 Fragen</span>
          </div>
          
          <button
            onClick={() => setStarted(true)}
            className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #D2A95A 0%, #A77D38 100%)',
              color: '#041726',
              boxShadow: '0 4px 20px rgba(210, 169, 90, 0.3)'
            }}
          >
            Enthülle deine Aura
          </button>
          
          <p 
            className="text-xs mt-8 opacity-70"
            style={{ color: '#A8B5A0' }}
          >
            {quizMeta.disclaimer}
          </p>
        </div>
      </div>
    );
  }

  // Result Screen
  if (showResult && result) {
    const { primary, secondary, element } = result;
    
    return (
      <div 
        className="min-h-[600px] rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(165deg, #053B3F 0%, #041726 50%, #031119 100%)'
        }}
      >
        {/* Background glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${primary.color}25 0%, transparent 60%)`
          }}
        />
        
        <div className="relative z-10 max-w-lg mx-auto p-4">
          <div 
            className="rounded-3xl p-8 mb-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(165deg, #0A2540 0%, #132F4C 100%)',
              border: '1px solid rgba(210, 169, 90, 0.25)',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Dynamic glow based on result color */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${primary.color}25 0%, transparent 60%)`
              }}
            />
            
            <div className="relative z-10">
              {/* Badge */}
              <div 
                className="text-xs font-semibold tracking-widest uppercase mb-4 text-center"
                style={{ color: '#D2A95A' }}
              >
                Deine Aura
              </div>
              
              {/* Aura Visual */}
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <div 
                  className="w-full h-full rounded-full opacity-60"
                  style={{
                    background: `radial-gradient(circle, ${primary.color} 0%, transparent 70%)`,
                    animation: 'pulse 3s ease-in-out infinite'
                  }}
                />
                <div 
                  className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full"
                  style={{
                    background: primary.color,
                    boxShadow: `0 0 40px ${primary.color}`
                  }}
                />
              </div>
              
              {/* Title & Archetype */}
              <h1 
                className="text-3xl font-serif font-semibold text-center mb-2"
                style={{ color: '#F7F3EA' }}
              >
                {primary.title}
              </h1>
              <p 
                className="text-lg font-serif italic text-center mb-6"
                style={{ color: '#D2A95A' }}
              >
                „{primary.archetype}&ldquo;
              </p>
              <p 
                className="text-center leading-relaxed mb-6 px-4"
                style={{ color: '#A8B5A0' }}
              >
                {primary.tagline}
              </p>
              
              {/* Secondary Color & Element */}
              <div 
                className="flex justify-center gap-6 mb-6 p-4 rounded-xl"
                style={{ background: 'rgba(0,0,0,0.2)' }}
              >
                <div className="text-center">
                  <div 
                    className="text-xs uppercase tracking-wider mb-2"
                    style={{ color: '#A8B5A0' }}
                  >
                    Zweitfarbe
                  </div>
                  <div className="flex items-center gap-2" style={{ color: '#F7F3EA' }}>
                    <span 
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ background: secondary.color }}
                    />
                    <span className="font-serif">{secondary.title.split(' ').pop()}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-xs uppercase tracking-wider mb-2"
                    style={{ color: '#A8B5A0' }}
                  >
                    Element
                  </div>
                  <div className="font-serif" style={{ color: '#F7F3EA' }}>
                    {element.name}
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {primary.stats.map((stat, i) => (
                  <div 
                    key={i}
                    className="rounded-lg p-3 text-center"
                    style={{ background: 'rgba(0,0,0,0.2)' }}
                  >
                    <div 
                      className="font-serif text-xl mb-1"
                      style={{ color: '#D2A95A' }}
                    >
                      {stat.value}
                    </div>
                    <div 
                      className="text-xs uppercase tracking-wider"
                      style={{ color: '#A8B5A0' }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Compatibility */}
              <div 
                className="p-4 rounded-xl mb-6"
                style={{ background: 'rgba(108, 161, 146, 0.1)' }}
              >
                <h3 
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: '#6CA192' }}
                >
                  Aura-Kompatibilität
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm" style={{ color: '#A8B5A0' }}>Verbündete:</span>
                    <div className="flex gap-2 ml-auto">
                      {primary.allies.map(ally => (
                        <span 
                          key={ally}
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ background: profiles[ally]?.color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm" style={{ color: '#A8B5A0' }}>Herausforderung:</span>
                    <div className="flex gap-2 ml-auto">
                      {primary.nemesis.map(nem => (
                        <span 
                          key={nem}
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ background: profiles[nem]?.color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Description Toggle */}
              <div 
                className="rounded-2xl p-4"
                style={{ background: 'rgba(0,0,0,0.15)' }}
              >
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="w-full flex items-center justify-center gap-2 text-sm py-2"
                  style={{ color: '#D2A95A' }}
                >
                  <span>Mehr über deine Aura erfahren</span>
                  <span className="transition-transform" style={{ transform: showDescription ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                  </span>
                </button>
                {showDescription && (
                  <div 
                    className="mt-4 text-sm leading-relaxed whitespace-pre-line text-left"
                    style={{ color: '#A8B5A0' }}
                  >
                    {primary.description}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col gap-3">
            <AlchemyButton
              className="w-full"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Aura Farben Quiz', text: primary.share_text });
                } else {
                  navigator.clipboard.writeText(primary.share_text).then(() => alert('Kopiert!'));
                }
              }}
            >
              Teile dein Ergebnis
            </AlchemyButton>
            <AlchemyLinkButton href="/character" variant="secondary" className="w-full text-center">
              Zum Profil
            </AlchemyLinkButton>
            <button
              onClick={resetQuiz}
              className="py-3 text-sm transition-all"
              style={{ color: '#6CA192' }}
            >
              Test wiederholen
            </button>
          </div>
          
          <p 
            className="text-xs text-center mt-6 opacity-70"
            style={{ color: '#A8B5A0' }}
          >
            {quizMeta.disclaimer}
          </p>
        </div>
      </div>
    );
  }

  // Quiz Flow Screen
  return (
    <div 
      className="min-h-[600px] p-4 rounded-3xl"
      style={{ background: '#053B3F' }}
    >
      {/* Micro-win feedback */}
      {microWin && (
        <div 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 font-serif text-2xl pointer-events-none"
          style={{
            color: '#D2A95A',
            textShadow: '0 0 30px rgba(210, 169, 90, 0.5)',
            animation: 'fadeInOut 0.8s ease-out forwards'
          }}
        >
          {microWin}
        </div>
      )}
      
      <div 
        className="rounded-3xl p-6 min-h-[calc(100vh-4rem)] flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #F7F0E6 0%, #F2E3CF 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}
      >
        {/* Progress */}
        <div className="mb-6">
          <div 
            className="text-xs font-medium uppercase tracking-wider mb-2"
            style={{ color: '#5A4D3F' }}
          >
            Frage {currentQuestion + 1} von {questions.length}
          </div>
          <div 
            className="h-1 rounded-full overflow-hidden"
            style={{ background: '#E5D9C3' }}
          >
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #053B3F, #6CA192)'
              }}
            />
          </div>
        </div>
        
        {/* Question Area */}
        <div className="flex-1 flex flex-col">
          {/* Dimension Label */}
          <div 
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#6CA192' }}
          >
            {currentDimension?.label}
          </div>
          
          {/* Question Text */}
          <h2 
            className="text-xl md:text-2xl font-serif font-medium leading-snug mb-4"
            style={{ color: '#271C16' }}
          >
            {currentQ.text}
          </h2>
          
          {/* Context */}
          <div 
            className="text-sm italic p-4 rounded-xl mb-6"
            style={{
              color: '#5A4D3F',
              background: 'rgba(108, 161, 146, 0.08)',
              borderLeft: '3px solid #6CA192'
            }}
          >
            {currentQ.context}
          </div>
          
          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option)}
                className="w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 hover:translate-x-1"
                style={{
                  background: '#FFFFFF',
                  borderColor: '#E5D9C3',
                  color: '#271C16'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#6CA192';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(108, 161, 146, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5D9C3';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span className="font-medium text-sm leading-relaxed">
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeInOut {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          30% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -60%) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
