
export const quizMeta = {
  id: "quiz.krafttier.v2",
  title: "Dein Krafttier",
  subtitle: "Welcher Instinkt lenkt dich?",
  description: "Entdecke deine natürliche Energiequelle und deinen Seelengefährten.",
  questions_count: 10,
  disclaimer: "Spirituelle Inspiration, basierend auf Persönlichkeits-Archetypen."
};

// Valid Registry IDs mapped from the plan
// wolf: marker.values.connection, marker.values.security
// owl: marker.cognition.system_thinking, marker.eq.self_awareness
// eagle: marker.values.autonomy, marker.values.risk_taking
// bear: marker.values.security, marker.aura.authority
// fox: marker.skills.curiosity, marker.lifestyle.spontaneity
// dolphin: marker.lifestyle.spontaneity, marker.aura.warmth

export const questions = [
  {
    id: "kq1",
    scenario: "Ein unbekannter Pfad zweigt ab...",
    text: "Was fühlst du?",
    options: [
      { text: "Neugier – was gibt es zu entdecken?", scores: { fox: 5, eagle: 3 }, markers: [{ id: "marker.skills.curiosity", weight: 0.1 }] },
      { text: "Vorsicht – ist es sicher?", scores: { bear: 5, wolf: 3 }, markers: [{ id: "marker.values.security", weight: 0.1 }] },
      { text: "Freiheit – endlich raus aus dem Alltag", scores: { eagle: 5, dolphin: 3 }, markers: [{ id: "marker.values.autonomy", weight: 0.1 }] },
      { text: "Analyse – wohin führt er wohl?", scores: { owl: 5, fox: 2 }, markers: [{ id: "marker.cognition.system_thinking", weight: 0.1 }] }
    ]
  },
  {
    id: "kq2",
    scenario: "Du bist in einer Gruppe...",
    text: "Deine natürliche Position?",
    options: [
      { text: "Im Zentrum, wo der Spaß ist", scores: { dolphin: 5, wolf: 2 }, markers: [{ id: "marker.social.extroversion", weight: 0.1 }] },
      { text: "Beobachtend am Rand", scores: { owl: 5, bear: 3 }, markers: [{ id: "marker.social.introversion", weight: 0.1 }] },
      { text: "Schützend für die anderen", scores: { bear: 5, wolf: 4 }, markers: [{ id: "marker.aura.warmth", weight: 0.1 }] },
      { text: "Unabhängig, komme und gehe", scores: { eagle: 5, fox: 3 }, markers: [{ id: "marker.values.autonomy", weight: 0.1 }] }
    ]
  },
  {
    id: "kq3",
    scenario: "Ein Sturm zieht auf...",
    text: "Dein erster Gedanke?",
    options: [
      { text: "Wo sind meine Liebsten?", scores: { wolf: 5, bear: 4 }, markers: [{ id: "marker.values.connection", weight: 0.1 }] },
      { text: "Wie nutze ich die Energie?", scores: { eagle: 5, fox: 3 }, markers: [{ id: "marker.aura.energy", weight: 0.1 }] },
      { text: "Ich baue einen sicheren Unterschlupf", scores: { bear: 5, owl: 3 }, markers: [{ id: "marker.values.security", weight: 0.1 }] },
      { text: "Ich spiele im Regen!", scores: { dolphin: 5, fox: 2 }, markers: [{ id: "marker.lifestyle.spontaneity", weight: 0.1 }] }
    ]
  },
  {
    id: "kq4",
    scenario: "Du musst ein Problem lösen...",
    text: "Deine Strategie?",
    options: [
      { text: "Ich denke lange und tief nach", scores: { owl: 5, eagle: 2 }, markers: [{ id: "marker.cognition.system_thinking", weight: 0.1 }] },
      { text: "Ich probiere einfach aus", scores: { fox: 5, dolphin: 3 }, markers: [{ id: "marker.method.trial_and_error", weight: 0.1 }] },
      { text: "Ich hole Hilfe von Freunden", scores: { wolf: 5, dolphin: 4 }, markers: [{ id: "marker.eq.social_skill", weight: 0.1 }] },
      { text: "Ich vertraue meinem Instinkt", scores: { bear: 5, eagle: 3 }, markers: [{ id: "marker.cognition.intuition", weight: 0.1 }] }
    ]
  },
  {
    id: "kq5",
    scenario: "Was ist dir am wichtigsten?",
    text: "Wähle einen Wert:",
    options: [
      { text: "Weisheit und Wissen", scores: { owl: 5, fox: 2 }, markers: [{ id: "marker.skills.intellect", weight: 0.1 }] },
      { text: "Gemeinschaft und Loyalität", scores: { wolf: 5, bear: 3 }, markers: [{ id: "marker.values.loyalty", weight: 0.1 }] },
      { text: "Freiheit und Weitblick", scores: { eagle: 5, wolf: 1 }, markers: [{ id: "marker.values.autonomy", weight: 0.1 }] },
      { text: "Freude und Spiel", scores: { dolphin: 5, fox: 3 }, markers: [{ id: "marker.values.joy", weight: 0.1 }] }
    ]
  },
  {
    id: "kq6",
    scenario: "Jemand lügt dich an...",
    text: "Wie reagierst du?",
    options: [
      { text: "Ich durchschaue es sofort", scores: { fox: 5, owl: 4 }, markers: [{ id: "marker.skills.perception", weight: 0.1 }] },
      { text: "Ich bin tief verletzt", scores: { wolf: 5, dolphin: 3 }, markers: [{ id: "marker.eq.empathy", weight: 0.1 }] },
      { text: "Ich distanziere mich", scores: { eagle: 5, bear: 2 }, markers: [{ id: "marker.social.reserve", weight: 0.1 }] },
      { text: "Ich konfrontiere kraftvoll", scores: { bear: 5, wolf: 3 }, markers: [{ id: "marker.social.dominance", weight: 0.1 }] }
    ]
  },
  {
    id: "kq7",
    scenario: "Urlaubszeit! Wohin geht es?",
    text: "Dein Traumziel?",
    options: [
      { text: "Berge mit Weitblick", scores: { eagle: 5, bear: 2 }, markers: [{ id: "marker.values.freedom", weight: 0.1 }] },
      { text: "Hütte im tiefen Wald", scores: { bear: 5, owl: 3 }, markers: [{ id: "marker.preference.nature", weight: 0.1 }] },
      { text: "Strandparty mit Vielen", scores: { dolphin: 5, wolf: 2 }, markers: [{ id: "marker.social.extroversion", weight: 0.1 }] },
      { text: "Rucksack-Trip ins Unbekannte", scores: { fox: 5, eagle: 3 }, markers: [{ id: "marker.values.adventure", weight: 0.1 }] }
    ]
  },
  {
    id: "kq8",
    scenario: "Deine größte Stärke?",
    text: "Worauf bist du stolz?",
    options: [
      { text: "Ich gebe niemals auf", scores: { wolf: 5, bear: 4 }, markers: [{ id: "marker.values.perseverance", weight: 0.1 }] },
      { text: "Ich sehe das große Ganze", scores: { eagle: 5, owl: 4 }, markers: [{ id: "marker.cognition.system_thinking", weight: 0.1 }] },
      { text: "Ich finde immer eine Lösung", scores: { fox: 5, owl: 3 }, markers: [{ id: "marker.skills.problem_solving", weight: 0.1 }] },
      { text: "Ich mache andere glücklich", scores: { dolphin: 5, wolf: 3 }, markers: [{ id: "marker.aura.warmth", weight: 0.1 }] }
    ]
  },
  {
    id: "kq9",
    scenario: "Nachtaktiv oder Frühaufsteher?",
    text: "Dein Rhythmus?",
    options: [
      { text: "Nacht - da ist es ruhig", scores: { owl: 5, fox: 3 }, markers: [{ id: "marker.lifestyle.night_owl", weight: 0.1 }] },
      { text: "Früh - der Tag gehört mir", scores: { eagle: 5, dolphin: 2 }, markers: [{ id: "marker.lifestyle.early_bird", weight: 0.1 }] },
      { text: "Immer bereit, wenn nötig", scores: { wolf: 5, bear: 4 }, markers: [{ id: "marker.values.duty", weight: 0.1 }] },
      { text: "Ich schlafe, wenn ich müde bin", scores: { bear: 5, dolphin: 3 }, markers: [{ id: "marker.lifestyle.intuition", weight: 0.1 }] }
    ]
  },
  {
    id: "kq10",
    scenario: "Wähle ein Element.",
    text: "Was zieht dich an?",
    options: [
      { text: "Luft und Weite", scores: { eagle: 5, owl: 2 }, markers: [{ id: "marker.values.freedom", weight: 0.1 }] },
      { text: "Erde und Stabilität", scores: { bear: 5, wolf: 3 }, markers: [{ id: "marker.values.security", weight: 0.1 }] },
      { text: "Wasser und Flow", scores: { dolphin: 5, owl: 1 }, markers: [{ id: "marker.lifestyle.flexibility", weight: 0.1 }] },
      { text: "Feuer und Wandel", scores: { fox: 5, eagle: 2 }, markers: [{ id: "marker.lifestyle.change", weight: 0.1 }] }
    ]
  }
];

export const profiles = [
  {
    id: "wolf",
    title: "Der Wolf",
    icon: "🐺",
    tagline: "Loyal, ausdauernd und tief verbunden.",
    description: "Du bist ein Rudeltier, aber mit einer stolzen, unabhängigen Seele. Loyalität ist für dich kein leeres Wort, sondern Gesetz. Du beschützt die Deinen mit allem, was du hast. Gleichzeitig brauchst du die wilde Freiheit, um atmen zu können.",
    stats: [
      { label: "Loyalität", value: 98 },
      { label: "Ausdauer", value: 95 },
      { label: "Instinkt", value: 92 },
      { label: "Kompromissbereitschaft", value: 40 }
    ],
    compatibility: "Bär, Rabe",
    share_text: "🐺 Mein Krafttier: Der Wolf – Loyal und instinktiv.",
    markers: [
        { id: "marker.values.connection", weight: 0.5 },
        { id: "marker.values.security", weight: 0.4 }
    ]
  },
  {
    id: "owl",
    title: "Die Eule",
    icon: "🦉",
    tagline: "Weise, beobachtend und geheimnisvoll.",
    description: "Du siehst Dinge, die anderen verborgen bleiben. Während die Welt im Chaos versinkt, bewahrst du den Überblick. Deine Weisheit kommt aus der Stille. Du handelst nicht impulsiv, sondern präzise und durchdacht.",
    stats: [
      { label: "Weisheit", value: 97 },
      { label: "Wahrnehmung", value: 99 },
      { label: "Geduld", value: 95 },
      { label: "Lautstärke", value: 20 }
    ],
    compatibility: "Fuchs, Bär",
    share_text: "🦉 Mein Krafttier: Die Eule – Weise und sehend.",
    markers: [
        { id: "marker.cognition.system_thinking", weight: 0.5 },
        { id: "marker.eq.self_awareness", weight: 0.4 }
    ]
  },
  {
    id: "eagle",
    title: "Der Adler",
    icon: "🦅",
    tagline: "Frei, visionär und majestätisch.",
    description: "Der Boden ist dir zu eng, du brauchst den Himmel. Du hast den Blick für das Große Ganze und verlierst dich nicht in Details. Deine Visionen sind stark, und du hast den Mut, alleine zu fliegen, wenn es sein muss.",
    stats: [
      { label: "Vision", value: 98 },
      { label: "Freiheitsdrang", value: 100 },
      { label: "Fokus", value: 94 },
      { label: "Bodenhaftung", value: 30 }
    ],
    compatibility: "Wolf, Löwe",
    share_text: "🦅 Mein Krafttier: Der Adler – Frei und visionär.",
    markers: [
        { id: "marker.values.autonomy", weight: 0.6 },
        { id: "marker.values.risk_taking", weight: 0.3 }
    ]
  },
  {
    id: "bear",
    title: "Der Bär",
    icon: "🐻",
    tagline: "Stark, schützend und in sich ruhend.",
    description: "Du bist der Fels in der Brandung. Deine Stärke ist nicht aggressiv, sondern präsent. Wer Schutz sucht, findet ihn bei dir. Du genießt das Leben und die Ruhe, aber wenn man dich reizt, zeigst du deine Kraft.",
    stats: [
      { label: "Stärke", value: 96 },
      { label: "Schutzinstinkt", value: 98 },
      { label: "Gemütlichkeit", value: 85 },
      { label: "Hektik", value: 15 }
    ],
    compatibility: "Wolf, Eule",
    share_text: "🐻 Mein Krafttier: Der Bär – Stark und schützend.",
    markers: [
        { id: "marker.values.security", weight: 0.5 },
        { id: "marker.aura.authority", weight: 0.4 }
    ]
  },
  {
    id: "fox",
    title: "Der Fuchs",
    icon: "🦊",
    tagline: "Schlau, anpassungsfähig und charmant.",
    description: "Es gibt kein Problem, für das du keine Lösung findest – oft auf Wegen, die andere übersehen. Deine Intelligenz ist praktisch und schnell. Du nimmst das Leben spielerisch und nutzt jede Chance.",
    stats: [
      { label: "Schläue", value: 97 },
      { label: "Anpassung", value: 95 },
      { label: "Charme", value: 92 },
      { label: "Ernsthaftigkeit", value: 35 }
    ],
    compatibility: "Eule, Delfin",
    share_text: "🦊 Mein Krafttier: Der Fuchs – Schlau und charmant.",
    markers: [
        { id: "marker.skills.curiosity", weight: 0.5 },
        { id: "marker.lifestyle.spontaneity", weight: 0.3 }
    ]
  },
  {
    id: "dolphin",
    title: "Der Delfin",
    icon: "🐬",
    tagline: "Verspielt, kommunikativ und empathisch.",
    description: "Für dich ist das Leben ein Spielplatz. Du bringst Freude, wo immer du auftauchst. Deine emotionale Intelligenz ist hoch, du spürst Schwingungen sofort. Du brauchst die Gemeinschaft wie die Luft zum Atmen.",
    stats: [
      { label: "Freude", value: 98 },
      { label: "Kommunikation", value: 96 },
      { label: "Empathie", value: 94 },
      { label: "Alleinsein", value: 20 }
    ],
    compatibility: "Fuchs, Wolf",
    share_text: "🐬 Mein Krafttier: Der Delfin – Verspielt und empathisch.",
    markers: [
        { id: "marker.lifestyle.spontaneity", weight: 0.5 },
        { id: "marker.aura.warmth", weight: 0.4 }
    ]
  }
];

export const profileNames = Object.fromEntries(profiles.map(p => [p.id, p.title]));
