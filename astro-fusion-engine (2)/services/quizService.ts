import { Category, Quiz, Score, User, QuestionOption, PersonalityResult } from '../types';

// --- Mock Data ---

const MOCK_CATEGORIES: Category[] = [
  { id: 'c_perso', name: 'Archetypen & Persönlichkeit', icon: '⚜️', description: 'Entdecke deine verborgenen Muster und Seelen-Signaturen.' },
  { id: 'c1', name: 'Zodiac Origins', icon: '♈', description: 'The ancient roots of the 12 signs.' },
  { id: 'c2', name: 'Planetary Forces', icon: '🪐', description: 'Understanding the gravity of our solar neighbors.' },
  { id: 'c3', name: 'Elemental Alchemy', icon: '🔥', description: 'Fire, Earth, Air, and Water mastery.' },
];

// Helper to create weighted options easily
const wo = (text: string, weights: Record<string, number>): QuestionOption => ({ text, weights });

const MOCK_QUIZZES: Quiz[] = [
  // --- EXISTING TRIVIA QUIZZES ---
  {
    id: 'q1', categoryId: 'c1', type: 'TRIVIA', title: 'Sun Sign Symbols', difficulty: 'Novice',
    questions: [
      { id: 'q1_1', text: 'Which sign is represented by the Scales?', options: ['Libra', 'Scorpio', 'Gemini', 'Pisces'], correctAnswer: 0 },
      { id: 'q1_2', text: 'Which sign is known as the Water Bearer?', options: ['Cancer', 'Aquarius', 'Pisces', 'Aries'], correctAnswer: 1 },
      { id: 'q1_3', text: 'The Lion represents which Zodiac sign?', options: ['Aries', 'Leo', 'Taurus', 'Sagittarius'], correctAnswer: 1 },
    ]
  },
  {
    id: 'q2', categoryId: 'c2', type: 'TRIVIA', title: 'Ruling Planets', difficulty: 'Adept',
    questions: [
      { id: 'q2_1', text: 'Which planet rules Gemini?', options: ['Mars', 'Venus', 'Mercury', 'Jupiter'], correctAnswer: 2 },
      { id: 'q2_2', text: 'Mars is the ruling planet of which sign?', options: ['Aries', 'Leo', 'Capricorn', 'Virgo'], correctAnswer: 0 },
      { id: 'q2_3', text: 'Which planet is associated with structure and discipline?', options: ['Saturn', 'Uranus', 'Pluto', 'Neptune'], correctAnswer: 0 },
    ]
  },
  {
    id: 'q3', categoryId: 'c3', type: 'TRIVIA', title: 'Elemental Natures', difficulty: 'Master',
    questions: [
      { id: 'q3_1', text: 'Which of the following is NOT a Fire sign?', options: ['Aries', 'Leo', 'Scorpio', 'Sagittarius'], correctAnswer: 2 },
      { id: 'q3_2', text: 'Earth signs are known for being:', options: ['Emotional', 'Grounded', 'Intellectual', 'Spirited'], correctAnswer: 1 },
    ]
  },

  // --- NEW PERSONALITY QUIZZES ---
  
  // 1. KRAFTTIER QUIZ
  {
    id: 'p_krafttier',
    categoryId: 'c_perso',
    type: 'PERSONALITY',
    title: 'Welcher uralte Wächter schlummert in deiner Seele?',
    difficulty: 'Self-Discovery',
    results: [
      {
        id: 'wolf', title: 'Der Wolf', tagline: 'Hüter des Rudels',
        description: 'Der Wolf erwacht in dir – loyal, instinktiv und zutiefst verbunden mit deinem Rudel. Du führst nicht durch Dominanz, sondern durch das tiefe Verständnis, dass wahre Stärke in der Gemeinschaft liegt.',
        stats: [{label: 'Loyalität', value: '98%'}, {label: 'Instinkt', value: '94%'}],
        compatibility: { ally: 'Adler • Bär', tension: 'Fuchs' },
        icon: `<svg viewBox="0 0 100 100" fill="none" stroke="#D2A95A" stroke-width="1.5"><path d="M50 85 L30 75 L20 55 L25 35 L35 25 L35 15 L45 25 L50 20 L55 25 L65 15 L65 25 L75 35 L80 55 L70 75 Z"/><circle cx="40" cy="45" r="4" fill="#D2A95A"/><circle cx="60" cy="45" r="4" fill="#D2A95A"/></svg>`
      },
      {
        id: 'eagle', title: 'Der Adler', tagline: 'Herrscher der Lüfte',
        description: 'Der Adler erwacht in dir – frei, weitblickend und mit dem Mut, über alle Grenzen hinauszufliegen. Du siehst das große Ganze und scheust nicht davor, deinen eigenen Weg in den Himmel zu bahnen.',
        stats: [{label: 'Freiheit', value: '99%'}, {label: 'Weitblick', value: '96%'}],
        compatibility: { ally: 'Wolf • Bär', tension: 'Eule' },
        icon: `<svg viewBox="0 0 100 100" fill="none" stroke="#D2A95A" stroke-width="1.5"><path d="M50 25 Q55 35 50 45 Q45 35 50 25"/><path d="M50 45 Q45 55 30 50 Q15 48 5 55"/><path d="M50 45 Q55 55 70 50 Q85 48 95 55"/><path d="M50 50 L50 70"/></svg>`
      },
      {
        id: 'owl', title: 'Die Eule', tagline: 'Seherin der Nacht',
        description: 'Die Eule wacht in dir – weise, geduldig und mit der Gabe, durch den Schleier der Illusion zu blicken. Du siehst, was anderen verborgen bleibt.',
        stats: [{label: 'Weisheit', value: '97%'}, {label: 'Intuition', value: '95%'}],
        compatibility: { ally: 'Fuchs • Wolf', tension: 'Delfin' },
        icon: `<svg viewBox="0 0 100 100" fill="none" stroke="#D2A95A" stroke-width="1.5"><ellipse cx="50" cy="55" rx="25" ry="30"/><circle cx="40" cy="50" r="8"/><circle cx="60" cy="50" r="8"/><path d="M47 65 L50 70 L53 65"/></svg>`
      }
    ],
    questions: [
      {
        id: 'k1', text: 'Du stehst vor einem unbekannten Pfad im Wald. Wie reagierst du?', scenario: 'Der Nebel lichtet sich...',
        options: [
          wo('Ich gehe voran – Neuland ruft nach mir', { eagle: 3, wolf: 1 }),
          wo('Ich beobachte erst, lese die Zeichen', { owl: 3 }),
          wo('Ich suche Begleitung für die Reise', { wolf: 3 }),
        ]
      },
      {
        id: 'k2', text: 'Welche Energie zieht dich am meisten an?', scenario: 'In einer stillen Nacht...',
        options: [
          wo('Die Kraft der Gemeinschaft – zusammen sind wir stark', { wolf: 3 }),
          wo('Die Stille der Betrachtung – Weisheit kommt von innen', { owl: 3 }),
          wo('Die Freiheit des Himmels – leben ohne Grenzen', { eagle: 3 }),
        ]
      },
      {
        id: 'k3', text: 'Wie triffst du wichtige Entscheidungen?', scenario: 'Am Scheideweg...',
        options: [
          wo('Aus dem Bauch heraus – mein Instinkt täuscht selten', { wolf: 2, eagle: 2 }),
          wo('Nach gründlicher Analyse aller Optionen', { owl: 3 }),
          wo('Im Gespräch mit Menschen, denen ich vertraue', { wolf: 3 }),
        ]
      },
      {
        id: 'k4', text: 'Was ist deine größte Gabe?', scenario: 'Das Echo deiner Seele...',
        options: [
          wo('Mut – ich gehe, wohin andere nicht wagen', { eagle: 3 }),
          wo('Weisheit – ich sehe durch den Nebel', { owl: 3 }),
          wo('Loyalität – ich stehe zu meinen Leuten', { wolf: 3 }),
        ]
      }
    ]
  },

  // 2. EQ SIGNATURE QUIZ
  {
    id: 'p_eq',
    categoryId: 'c_perso',
    type: 'PERSONALITY',
    title: 'Deine Emotionale Signatur',
    difficulty: 'Self-Discovery',
    results: [
      {
        id: 'resonator', title: 'Der Resonator', tagline: 'Du spürst, was andere noch nicht sagen können',
        description: 'Du bist ein emotionaler Seismograph. Noch bevor jemand spricht, hast du die Atmosphäre gelesen. Menschen fühlen sich gesehen in deiner Gegenwart.',
        stats: [{label: 'Empathie-Radar', value: '95%'}, {label: 'Nuancen', value: 'Hoch'}],
        compatibility: { ally: 'Der Regulator', tension: 'Der Stratege' },
        icon: `<svg viewBox="0 0 160 160" fill="none" stroke="#D2A95A" stroke-width="2"><circle cx="80" cy="80" r="40"/><path d="M80 30 Q110 30 130 50" opacity="0.5"/><path d="M80 30 Q50 30 30 50" opacity="0.5"/></svg>`
      },
      {
        id: 'regulator', title: 'Der Regulator', tagline: 'Du bist der ruhige Pol im Sturm',
        description: 'Du bist der emotionale Thermostat – fähig, die Temperatur zu spüren und zu justieren. Du fühlst mit Abstand und beobachtest deine Emotionen weise.',
        stats: [{label: 'Ruhe', value: 'Legendär'}, {label: 'Balance', value: '100%'}],
        compatibility: { ally: 'Der Resonator', tension: 'Der Navigator' },
        icon: `<svg viewBox="0 0 160 160" fill="none" stroke="#D2A95A" stroke-width="2"><line x1="80" y1="20" x2="80" y2="140"/><line x1="40" y1="80" x2="120" y2="80"/><circle cx="80" cy="80" r="10" fill="#D2A95A"/></svg>`
      },
      {
        id: 'strategist', title: 'Der Stratege', tagline: 'Du wandelst Gefühle in Treibstoff',
        description: 'Du betrachtest Emotionen als Ressourcen. Nervosität transformierst du in Energie, Ärger in Durchsetzungskraft. Du bist effektiv in High-Stakes-Situationen.',
        stats: [{label: 'Fokus', value: 'Laser'}, {label: 'Energie', value: 'Hoch'}],
        compatibility: { ally: 'Der Navigator', tension: 'Der Resonator' },
        icon: `<svg viewBox="0 0 160 160" fill="none" stroke="#D2A95A" stroke-width="2"><rect x="60" y="60" width="40" height="40"/><path d="M80 60 L80 30"/><path d="M100 80 L130 80"/></svg>`
      }
    ],
    questions: [
      {
        id: 'eq1', text: 'Du wachst mit einem diffusen Unbehagen auf. Was passiert in dir?', scenario: 'Selbstwahrnehmung',
        options: [
          wo('Ich frage mich: Ist das Angst? Traurigkeit? Ich benenne es präzise.', { resonator: 3 }),
          wo('Ich starte meinen Tag. Stimmungen kommen und gehen.', { regulator: 3 }),
          wo('Ich nutze das Gefühl als Signal für meine Tagesplanung.', { strategist: 3 })
        ]
      },
      {
        id: 'eq2', text: 'Ein Streit bricht aus. Du stehst dazwischen.', scenario: 'Konfliktnavigation',
        options: [
          wo('Ich spüre beide Seiten körperlich – ihre Anspannung ist meine.', { resonator: 3 }),
          wo('Ich distanziere mich emotional und analysiere den Kern.', { regulator: 3 }),
          wo('Ich überlege strategisch, wie ich die Situation nutzen oder lösen kann.', { strategist: 3 })
        ]
      },
      {
        id: 'eq3', text: 'Deadline-Druck. Zu viel zu tun.', scenario: 'Stressreaktion',
        options: [
          wo('Ich spüre den Stress intensiv und teile ihn mit anderen.', { resonator: 2 }),
          wo('Ich beobachte meinen Stress wie einen Wetterbericht und mache Pausen.', { regulator: 3 }),
          wo('Ich nutze das Adrenalin. Unter Druck bin ich schneller.', { strategist: 3 })
        ]
      }
    ]
  },

  // 3. CHARME QUIZ
  {
    id: 'p_charme',
    categoryId: 'c_perso',
    type: 'PERSONALITY',
    title: 'Die Kunst des Charmes',
    difficulty: 'Self-Discovery',
    results: [
      {
        id: 'herzoffner', title: 'Der Herzöffner', tagline: 'In deiner Gegenwart tauen Eisberge auf',
        description: 'Du bist das menschliche Äquivalent eines offenen Kaminfeuers. Menschen entspannen sich bei dir, weil du authentische Menschenfreundlichkeit ohne Agenda ausstrahlst.',
        stats: [{label: 'Wärme', value: 'Max'}, {label: 'Präsenz', value: '9/10'}],
        icon: `<svg viewBox="0 0 100 100" fill="none" stroke="#D2A95A"><path d="M50 30 Q70 10 90 30 Q90 60 50 90 Q10 60 10 30 Q30 10 50 30"/><path d="M20 30 L80 30" stroke-opacity="0.3"/></svg>`
      },
      {
        id: 'esprit', title: 'Der Esprit-Funke', tagline: 'Dein Witz öffnet Türen',
        description: 'Dein Charme ist eine Waffe, die nie verletzt. Du findest den perfekten Moment für den perfekten Satz. Intellekt und Wärme sind bei dir untrennbar.',
        stats: [{label: 'Witz', value: 'Scharf'}, {label: 'Timing', value: 'Perfekt'}],
        icon: `<svg viewBox="0 0 100 100" fill="none" stroke="#D2A95A"><path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z"/></svg>`
      }
    ],
    questions: [
      {
        id: 'ch1', text: 'Du betrittst einen Raum voller Fremder. Was tust du?', scenario: 'Der erste Eindruck',
        options: [
          wo('Ich suche die Person, die am unsichersten wirkt, und gehe auf sie zu.', { herzoffner: 3 }),
          wo('Ich beobachte die Dynamik und mache eine geistreiche Bemerkung zur Gruppe.', { esprit: 3 }),
        ]
      },
      {
        id: 'ch2', text: 'Jemand erzählt einen schlechten Witz.', scenario: 'Reaktion',
        options: [
          wo('Ich schmunzle warm, damit er sich nicht schlecht fühlt.', { herzoffner: 3 }),
          wo('Ich finde einen spielerischen Weg, den Witz zu retten oder zu drehen.', { esprit: 3 }),
        ]
      }
    ]
  }
];

// --- Service ---

class QuizService {
  private users: User[] = [];
  private scores: Score[] = [];
  private currentUser: User | null = null;

  constructor() {
    // Load from local storage if available (Mock persistence)
    try {
      const storedScores = localStorage.getItem('astro_scores');
      if (storedScores) this.scores = JSON.parse(storedScores);
    } catch (e) {
      console.warn('LocalStorage unavailable');
    }
  }

  // Auth
  async login(username: string): Promise<User> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { username, email: `${username.toLowerCase()}@example.com` };
        this.currentUser = user;
        resolve(user);
      }, 800);
    });
  }

  logout() {
    this.currentUser = null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // Data Access
  getCategories(): Category[] {
    return MOCK_CATEGORIES;
  }

  getQuizzesByCategory(categoryId: string): Quiz[] {
    return MOCK_QUIZZES.filter(q => q.categoryId === categoryId);
  }

  // Scoring
  submitScore(quizId: string, pointsOrResult: number | string, totalQuestions: number): Score {
    if (!this.currentUser) throw new Error("Must be logged in to save score");
    
    const quiz = MOCK_QUIZZES.find(q => q.id === quizId);
    const isPersonality = quiz?.type === 'PERSONALITY';
    
    const newScore: Score = {
      id: Math.random().toString(36).substr(2, 9),
      quizId,
      quizTitle: quiz?.title || 'Unknown Quiz',
      username: this.currentUser.username,
      points: typeof pointsOrResult === 'number' ? pointsOrResult : 0,
      resultTitle: typeof pointsOrResult === 'string' ? pointsOrResult : undefined,
      totalQuestions,
      timestamp: Date.now()
    };

    this.scores.push(newScore);
    this.persistScores();
    return newScore;
  }

  getLeaderboard(): Score[] {
    // Return top scores sorted by points descending, filter out personality quizzes for the main points board
    // or include them differently? For now, we only show points-based scores on main leaderboard.
    return [...this.scores]
      .filter(s => s.points > 0) 
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
  }

  private persistScores() {
    try {
      localStorage.setItem('astro_scores', JSON.stringify(this.scores));
    } catch (e) {
      console.error(e);
    }
  }
}

export const quizService = new QuizService();
