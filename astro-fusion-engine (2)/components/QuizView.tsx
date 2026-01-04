import React, { useState, useEffect } from 'react';
import { User, Category, Quiz, Question, PersonalityResult, QuestionOption } from '../types';
import { quizService } from '../services/quizService';

export const QuizView: React.FC = () => {
  const [user, setUser] = useState<User | null>(quizService.getCurrentUser());
  const [viewState, setViewState] = useState<'auth' | 'categories' | 'quiz' | 'leaderboard'>('auth');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  // Auth State
  const [usernameInput, setUsernameInput] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  useEffect(() => {
    if (user) {
      setViewState('categories');
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    
    setIsLoadingAuth(true);
    const loggedInUser = await quizService.login(usernameInput);
    setUser(loggedInUser);
    setIsLoadingAuth(false);
  };

  const handleLogout = () => {
    quizService.logout();
    setUser(null);
    setViewState('auth');
    setActiveQuiz(null);
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setViewState('quiz');
  };

  // --- Sub-Components ---

  const AuthScreen = () => (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="bg-white border border-astro-border p-10 rounded-xl shadow-sm max-w-md w-full text-center">
        <div className="w-16 h-16 bg-astro-bg rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
          🔐
        </div>
        <h2 className="font-serif text-3xl text-astro-text mb-2">Quiz Zugang</h2>
        <p className="font-sans text-astro-subtext mb-8">Identifiziere dich, um dein Wissen zu testen.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Dein Kosmischer Name"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="w-full p-4 bg-[#FAFAFA] border border-[#EBEBEB] rounded text-center font-serif text-lg focus:border-astro-gold focus:outline-none transition-colors"
            autoFocus
          />
          <button 
            disabled={isLoadingAuth}
            className="w-full py-4 bg-gradient-to-r from-astro-text to-[#434343] text-white font-sans uppercase tracking-widest text-xs rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
          >
            {isLoadingAuth ? 'Verbinde...' : 'Eintreten'}
          </button>
        </form>
      </div>
    </div>
  );

  const CategoryList = () => {
    const categories = quizService.getCategories();

    return (
      <div className="animate-fade-in">
        <div className="flex justify-between items-end mb-8 border-b border-astro-border pb-4">
          <div>
            <h2 className="font-serif text-3xl text-astro-text">Wissens-Sphären</h2>
            <p className="font-sans text-xs text-astro-subtext uppercase tracking-widest mt-1">Wähle deinen Pfad</p>
          </div>
          <button 
            onClick={() => setViewState('leaderboard')}
            className="text-astro-gold hover:text-astro-text font-serif italic text-lg transition-colors"
          >
            Zur Bestenliste →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {categories.map(cat => (
            <div 
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`cursor-pointer p-6 rounded-xl border transition-all duration-300 group relative overflow-hidden ${selectedCategory === cat.id ? 'border-astro-gold bg-white shadow-md' : 'border-astro-border bg-white/50 hover:border-astro-gold/50'}`}
            >
              {cat.id === 'c_perso' && <div className="absolute top-0 right-0 bg-quiz-emerald text-white text-[10px] px-2 py-1 uppercase tracking-widest">Neu</div>}
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
              <h3 className="font-serif text-xl text-astro-text mb-2">{cat.name}</h3>
              <p className="font-sans text-sm text-astro-subtext leading-relaxed">{cat.description}</p>
            </div>
          ))}
        </div>

        {selectedCategory && (
          <div className="bg-astro-bg border border-astro-border rounded-xl p-8 animate-fade-in-up">
            <h3 className="font-serif text-2xl text-astro-text mb-6">Verfügbare Prüfungen</h3>
            <div className="space-y-4">
              {quizService.getQuizzesByCategory(selectedCategory).map(quiz => (
                <div key={quiz.id} className="flex items-center justify-between bg-white p-4 rounded border border-astro-border hover:border-astro-gold transition-colors">
                  <div>
                    <h4 className="font-medium text-astro-text flex items-center gap-2">
                      {quiz.title}
                      {quiz.type === 'PERSONALITY' && <span className="text-xs text-quiz-emerald-light">✦</span>}
                    </h4>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full mt-1 inline-block ${
                      quiz.difficulty === 'Novice' ? 'bg-green-100 text-green-800' :
                      quiz.difficulty === 'Adept' ? 'bg-yellow-100 text-yellow-800' :
                      quiz.difficulty === 'Self-Discovery' ? 'bg-quiz-cream-dark text-quiz-emerald' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <button 
                    onClick={() => startQuiz(quiz)}
                    className="px-6 py-2 rounded border border-astro-text text-astro-text text-xs uppercase tracking-widest hover:border-transparent hover:bg-gradient-to-r hover:from-astro-text hover:to-[#434343] hover:text-white hover:shadow-md transition-all duration-300"
                  >
                    Starten
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const QuizPlayer = () => {
    if (!activeQuiz) return null;
    const [currentIdx, setCurrentIdx] = useState(0);
    // For Trivia: stores selected option index. For Personality: unused, we track scores directly
    const [answers, setAnswers] = useState<number[]>([]); 
    // For Personality: { [resultId]: score }
    const [personalityScores, setPersonalityScores] = useState<Record<string, number>>({});
    
    const [showResult, setShowResult] = useState(false);
    const [scoreSaved, setScoreSaved] = useState(false);

    const question = activeQuiz.questions[currentIdx];
    const isPersonality = activeQuiz.type === 'PERSONALITY';

    const handleAnswer = (optionIdx: number) => {
      // 1. Record Answer
      if (isPersonality) {
        const option = question.options[optionIdx] as QuestionOption;
        const newScores = { ...personalityScores };
        if (option.weights) {
          Object.entries(option.weights).forEach(([key, value]) => {
            newScores[key] = (newScores[key] || 0) + value;
          });
        }
        setPersonalityScores(newScores);
      } else {
        const newAnswers = [...answers, optionIdx];
        setAnswers(newAnswers);
      }

      // 2. Advance or Finish
      if (currentIdx < activeQuiz.questions.length - 1) {
        setTimeout(() => setCurrentIdx(currentIdx + 1), 300);
      } else {
        setShowResult(true);
      }
    };

    const calculateResult = () => {
      if (isPersonality) {
        // Find result ID with max score
        let maxScore = -1;
        let resultId = '';
        Object.entries(personalityScores).forEach(([id, score]) => {
          if ((score as number) > maxScore) {
            maxScore = (score as number);
            resultId = id;
          }
        });
        // Find Result Object
        return activeQuiz.results?.find(r => r.id === resultId) || activeQuiz.results?.[0];
      } else {
        // Trivia Logic
        let correct = 0;
        activeQuiz.questions.forEach((q, idx) => {
          if (answers[idx] === q.correctAnswer) correct++;
        });
        return correct;
      }
    };

    useEffect(() => {
      if (showResult && !scoreSaved) {
        const result = calculateResult();
        if (isPersonality) {
          // Save Personality Result Title
          const pResult = result as PersonalityResult;
          quizService.submitScore(activeQuiz.id, pResult.title, activeQuiz.questions.length); 
        } else {
          // Save Trivia Score
          quizService.submitScore(activeQuiz.id, result as number, activeQuiz.questions.length);
        }
        setScoreSaved(true);
      }
    }, [showResult, scoreSaved]);

    if (showResult) {
      if (isPersonality) {
        const result = calculateResult() as PersonalityResult;
        return (
          <div className="max-w-xl mx-auto text-center py-8 animate-fade-in">
             <div className="bg-gradient-to-br from-quiz-midnight to-quiz-emerald text-quiz-cream p-8 rounded-2xl shadow-xl border border-astro-gold/30">
                <div className="w-32 h-32 mx-auto mb-6 opacity-90" dangerouslySetInnerHTML={{ __html: result.icon || '' }} />
                <h3 className="font-serif text-3xl text-astro-gold mb-2">{result.title}</h3>
                <p className="font-serif italic text-sm text-quiz-emerald-light mb-6">{result.tagline}</p>
                <p className="font-sans text-sm leading-relaxed opacity-90 mb-8">{result.description}</p>
                
                {result.stats && (
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {result.stats.map((stat, i) => (
                      <div key={i} className="bg-black/20 p-3 rounded">
                        <div className="text-[10px] uppercase tracking-widest opacity-60">{stat.label}</div>
                        <div className="text-lg font-serif text-astro-gold">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {result.compatibility && (
                  <div className="text-xs flex justify-between border-t border-white/10 pt-4">
                    <div>
                      <span className="opacity-50 uppercase">Verbündete</span>
                      <div className="text-quiz-emerald-light">{result.compatibility.ally}</div>
                    </div>
                    <div className="text-right">
                      <span className="opacity-50 uppercase">Herausforderung</span>
                      <div className="text-red-300">{result.compatibility.tension}</div>
                    </div>
                  </div>
                )}
             </div>
             
             <div className="mt-8 flex gap-4 justify-center">
                <button 
                  onClick={() => { setActiveQuiz(null); setViewState('categories'); }}
                  className="px-8 py-3 bg-gradient-to-r from-astro-text to-[#434343] text-white font-sans uppercase tracking-widest text-xs rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Zurück
                </button>
             </div>
          </div>
        );
      }

      // Trivia Result View
      const score = calculateResult() as number;
      const percentage = Math.round((score / activeQuiz.questions.length) * 100);

      return (
        <div className="max-w-xl mx-auto text-center py-12 animate-fade-in">
          <div className="w-24 h-24 bg-astro-gold text-white rounded-full flex items-center justify-center text-3xl font-serif mx-auto mb-6 shadow-lg">
            {percentage}%
          </div>
          <h2 className="font-serif text-4xl text-astro-text mb-4">Prüfung Abgeschlossen</h2>
          <p className="font-sans text-astro-subtext mb-8">
            Du hast {score} von {activeQuiz.questions.length} Fragen korrekt beantwortet.
          </p>
          <div className="flex gap-4 justify-center">
             <button 
               onClick={() => { setActiveQuiz(null); setViewState('categories'); }}
               className="px-8 py-3 bg-gradient-to-r from-astro-text to-[#434343] text-white font-sans uppercase tracking-widest text-xs rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
             >
               Zurück zur Übersicht
             </button>
             <button 
               onClick={() => setViewState('leaderboard')}
               className="px-8 py-3 border border-astro-border text-astro-text font-sans uppercase tracking-widest text-xs rounded-lg hover:border-astro-gold hover:text-astro-gold transition-colors duration-300"
             >
               Bestenliste ansehen
             </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto py-8 animate-fade-in">
        <div className="mb-8 flex justify-between items-center text-xs font-sans tracking-widest text-astro-subtext uppercase">
          <span>{activeQuiz.title}</span>
          <span>Frage {currentIdx + 1} / {activeQuiz.questions.length}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-astro-border h-1 mb-12 rounded-full overflow-hidden">
          <div 
            className={`${isPersonality ? 'bg-quiz-emerald' : 'bg-astro-gold'} h-full transition-all duration-500`}
            style={{ width: `${((currentIdx) / activeQuiz.questions.length) * 100}%` }}
          ></div>
        </div>

        {question.scenario && (
           <div className="font-serif italic text-quiz-emerald text-lg mb-4 opacity-80">
             {question.scenario}
           </div>
        )}

        <h3 className="font-serif text-2xl md:text-3xl text-astro-text mb-12 leading-normal">
          {question.text}
        </h3>

        <div className="space-y-4">
          {question.options.map((opt, idx) => {
            const text = typeof opt === 'string' ? opt : opt.text;
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-6 bg-white border border-astro-border rounded-lg transition-all duration-200 group ${
                  isPersonality 
                  ? 'hover:border-quiz-emerald hover:bg-quiz-cream' 
                  : 'hover:border-astro-gold hover:translate-x-1'
                }`}
              >
                <span className={`font-sans font-medium text-astro-text transition-colors ${isPersonality ? 'group-hover:text-quiz-emerald' : 'group-hover:text-astro-gold'}`}>
                  {text}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const Leaderboard = () => {
    const scores = quizService.getLeaderboard();

    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl text-astro-text">Halle des Ruhms</h2>
            <button 
                onClick={() => setViewState('categories')}
                className="text-sm font-sans uppercase tracking-widest text-astro-subtext hover:text-astro-text"
            >
                ← Zurück
            </button>
        </div>

        <div className="bg-white border border-astro-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#FAF8F5] border-b border-astro-border">
              <tr>
                <th className="p-4 font-serif text-astro-text font-normal">Rang</th>
                <th className="p-4 font-serif text-astro-text font-normal">Astrologe</th>
                <th className="p-4 font-serif text-astro-text font-normal">Prüfung</th>
                <th className="p-4 font-serif text-astro-text font-normal text-right">Ergebnis</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm">
              {scores.map((score, idx) => (
                <tr key={score.id} className="border-b border-astro-border last:border-0 hover:bg-gray-50">
                  <td className="p-4 text-astro-subtext">
                    {idx === 0 ? '👑' : idx + 1}
                  </td>
                  <td className="p-4 font-medium text-astro-text">{score.username}</td>
                  <td className="p-4 text-astro-subtext">{score.quizTitle}</td>
                  <td className="p-4 text-right font-bold text-astro-gold">
                    {score.resultTitle ? score.resultTitle : score.points}
                  </td>
                </tr>
              ))}
              {scores.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-astro-subtext italic">
                    Noch keine Einträge in den Sternen.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[600px]">
      <div className="flex justify-end mb-4">
        {user && (
          <div className="flex items-center gap-4">
             <span className="text-xs font-sans uppercase tracking-widest text-astro-subtext">
               Angemeldet als <span className="text-astro-gold border-b border-astro-gold pb-0.5">{user.username}</span>
             </span>
             <button onClick={handleLogout} className="text-xs hover:text-red-500 transition-colors">Abmelden</button>
          </div>
        )}
      </div>

      {!user ? <AuthScreen /> : (
        <>
          {viewState === 'categories' && <CategoryList />}
          {viewState === 'quiz' && <QuizPlayer />}
          {viewState === 'leaderboard' && <Leaderboard />}
        </>
      )}
    </div>
  );
};