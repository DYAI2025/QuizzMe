export const questions = [
    {
        scenario: "Es ist 2 Uhr nachts. Dein Telefon klingelt. Ein Freund.",
        text: "Was ist dein erster Gedanke?",
        options: [
            { text: "Etwas ist passiert. Ich bin wach.", scores: { harbor: 3, stability: 2 }, vibe: "🛡️" },
            { text: "Hoffentlich was Lustiges. Ich nehme ab.", scores: { fire: 2, bridge: 1 }, vibe: "🎉" },
            { text: "Ob alles okay ist? Ich mache mir Sorgen.", scores: { harbor: 2, compass: 1 }, vibe: "💭" },
            { text: "Das muss wichtig sein. Sonst würden sie nicht anrufen.", scores: { truth: 2, stability: 1 }, vibe: "🎯" }
        ]
    },
    {
        scenario: "Eine Freundin erzählt von ihrer schlechten Beziehung. Zum fünften Mal.",
        text: "Was tust du?",
        options: [
            { text: "Zuhören. So oft sie es braucht.", scores: { harbor: 3, stability: 1 }, vibe: "👂" },
            { text: "Ehrlich sein: 'Du weißt was du tun musst.'", scores: { truth: 3, compass: 1 }, vibe: "🪞" },
            { text: "Ablenken. Sie braucht Pause vom Grübeln.", scores: { fire: 2, bridge: 1 }, vibe: "🌈" },
            { text: "Fragen stellen, die sie selbst zur Antwort führen.", scores: { compass: 3, truth: 1 }, vibe: "🧭" }
        ]
    },
    {
        scenario: "Gruppenurlaub. Niemand trifft eine Entscheidung wo es hingeht.",
        text: "Dein Move?",
        options: [
            { text: "Drei Optionen vorstellen. Abstimmung. Fertig.", scores: { compass: 3, bridge: 1 }, vibe: "📋" },
            { text: "Vorschlag machen und Energie reinbringen: 'Das wird episch!'", scores: { fire: 3, bridge: 1 }, vibe: "🔥" },
            { text: "Vermitteln zwischen den verschiedenen Wünschen.", scores: { bridge: 3 }, vibe: "🤝" },
            { text: "Warten. Irgendwer wird's schon regeln. Ich bin flexibel.", scores: { stability: 2, harbor: 1 }, vibe: "🌿" }
        ]
    },
    {
        scenario: "Jemand, den du magst, macht einen offensichtlichen Fehler.",
        text: "Wie reagierst du?",
        options: [
            { text: "Direkt ansprechen. Lieber unbequem als unehrlich.", scores: { truth: 3, compass: 1 }, vibe: "⚡" },
            { text: "Warten bis sie selbst drauf kommen. Ich bin da wenn sie reden wollen.", scores: { harbor: 2, stability: 2 }, vibe: "🌙" },
            { text: "Vorsichtig Fragen stellen, die zum Nachdenken anregen.", scores: { compass: 3, bridge: 1 }, vibe: "💬" },
            { text: "Mit Humor darauf hinweisen. Leichtigkeit hilft mehr als Belehrung.", scores: { fire: 2, bridge: 2 }, vibe: "😄" }
        ]
    },
    {
        scenario: "Ein Freund zweifelt an sich. 'Ich kann das nicht.'",
        text: "Deine Antwort?",
        options: [
            { text: "'Doch, kannst du. Ich glaube an dich.' Punkt.", scores: { stability: 3, harbor: 1 }, vibe: "💪" },
            { text: "'Was genau macht dir Angst?' Ursache finden.", scores: { compass: 3, truth: 1 }, vibe: "🔍" },
            { text: "'Erinnerst du dich, als du X geschafft hast? Same energy.'", scores: { fire: 2, compass: 1 }, vibe: "⭐" },
            { text: "Erstmal da sein. Manchmal braucht man keine Worte.", scores: { harbor: 3 }, vibe: "🫂" }
        ]
    },
    {
        scenario: "Stell dir vor: Deine engsten Menschen beschreiben dich, wenn du nicht im Raum bist.",
        text: "Welchen Satz hörst du am wahrscheinlichsten?",
        options: [
            { text: "'Bei ihr/ihm fühl ich mich sicher.'", scores: { harbor: 3, stability: 2 }, vibe: "🏠" },
            { text: "'Sie/Er sagt dir die Wahrheit, auch wenn's wehtut.'", scores: { truth: 3, compass: 1 }, vibe: "💎" },
            { text: "'Mit ihr/ihm wird's nie langweilig.'", scores: { fire: 3, bridge: 1 }, vibe: "✨" },
            { text: "'Sie/Er bringt Menschen zusammen.'", scores: { bridge: 3, fire: 1 }, vibe: "🌉" },
            { text: "'Wenn ich nicht weiter weiß, frag ich sie/ihn.'", scores: { compass: 3, stability: 1 }, vibe: "🧭" }
        ]
    },
    {
        scenario: "Konflikt in der Freundesgruppe. Zwei Seiten. Du stehst in der Mitte.",
        text: "Deine natürliche Reaktion?",
        options: [
            { text: "Vermitteln. Beide Seiten haben einen Punkt.", scores: { bridge: 3, compass: 1 }, vibe: "⚖️" },
            { text: "Klare Kante zeigen, wenn einer eindeutig falsch liegt.", scores: { truth: 3, stability: 1 }, vibe: "🎯" },
            { text: "Raushalten, aber da sein wenn jemand reden will.", scores: { harbor: 2, stability: 2 }, vibe: "🌊" },
            { text: "Die Stimmung auflockern. Humor hilft.", scores: { fire: 2, bridge: 2 }, vibe: "🌈" }
        ]
    },
    {
        scenario: "Jemand, der dich kaum kennt, fragt einen gemeinsamen Freund über dich.",
        text: "Was glaubst du, wird gesagt?",
        options: [
            { text: "'Absolut verlässlich. Fels in der Brandung.'", scores: { stability: 3, harbor: 1 }, vibe: "🪨" },
            { text: "'Brutal ehrlich, aber auf eine gute Art.'", scores: { truth: 3, compass: 1 }, vibe: "🔮" },
            { text: "'Bringt gute Energie mit. Macht Spaß.'", scores: { fire: 3, bridge: 1 }, vibe: "☀️" },
            { text: "'Versteht Menschen. Guter Zuhörer.'", scores: { harbor: 2, bridge: 2 }, vibe: "💫" },
            { text: "'Hat immer gute Ratschläge.'", scores: { compass: 3 }, vibe: "💡" }
        ]
    },
    {
        scenario: "Du merkst: Ein Freund hat sich verändert. Zieht sich zurück. Etwas stimmt nicht.",
        text: "Was tust du?",
        options: [
            { text: "Direkt fragen: 'Hey, was ist los? Rede mit mir.'", scores: { truth: 2, harbor: 2 }, vibe: "💬" },
            { text: "Präsent bleiben ohne Druck. Da sein, wenn sie bereit sind.", scores: { harbor: 3, stability: 1 }, vibe: "🌙" },
            { text: "Aktivität vorschlagen. Rausbringen. Bewegung hilft.", scores: { fire: 2, compass: 1 }, vibe: "🚀" },
            { text: "Mit anderen absprechen, ob sie auch was bemerkt haben.", scores: { bridge: 2, compass: 2 }, vibe: "🔗" }
        ]
    },
    {
        scenario: "Letzte Frage. Sei ehrlich.",
        text: "Was brauchst DU am meisten von anderen?",
        options: [
            { text: "Dass sie genauso für mich da sind, wie ich für sie.", scores: { harbor: 2, stability: 2 }, vibe: "♾️" },
            { text: "Ehrlichkeit. Auch wenn's unbequem ist.", scores: { truth: 3, compass: 1 }, vibe: "💎" },
            { text: "Jemanden, der meine Energie matcht.", scores: { fire: 3, bridge: 1 }, vibe: "⚡" },
            { text: "Raum zum Atmen. Und Wissen, dass sie da sind.", scores: { stability: 2, harbor: 1 }, vibe: "🌬️" },
            { text: "Menschen, die mich verstehen ohne viele Worte.", scores: { bridge: 2, harbor: 2 }, vibe: "🤝" }
        ]
    }
];

export const roles = {
    rock: {
        name: "DER FELS",
        tagline: "In dir finden andere Boden unter den Füßen.",
        description: "Wenn alles wackelt, stehst du. Nicht weil dir nichts anhaben kann – sondern weil du weißt: Jemand muss der Ruhepol sein. Menschen kommen zu dir, wenn die Welt zu laut wird. Nicht für Ratschläge. Für Ruhe.",
        superpower: "Stabilität in Chaos bringen",
        shadow: "Du trägst oft mehr als du zeigst",
        ingredients: [["85", "Verlässlichkeit"], ["70", "Innere Ruhe"], ["60", "Stille Stärke"]],
        compatible: "Die Flamme • Der Hafen",
        challenging: "Der Spiegel",
        gradient: "from-slate-500 to-zinc-600",
        emoji: "🪨"
    },
    flame: {
        name: "DIE FLAMME",
        tagline: "Du bringst Licht in Räume, die es vergessen haben.",
        description: "Wo du bist, ist Energie. Nicht die laute Art – die ansteckende. Du erinnerst Menschen daran, dass das Leben auch leicht sein darf. Dass Lachen eine Form von Mut ist.",
        superpower: "Menschen aus ihrer Schwere holen",
        shadow: "Wer trägt dich, wenn du selbst schwer wirst?",
        ingredients: [["90", "Lebensenergie"], ["75", "Spontanität"], ["65", "Ansteckende Freude"]],
        compatible: "Der Fels • Die Brücke",
        challenging: "Der Kompass",
        gradient: "from-orange-500 to-amber-500",
        emoji: "🔥"
    },
    mirror: {
        name: "DER SPIEGEL",
        tagline: "Du zeigst Menschen, wer sie wirklich sind.",
        description: "Bullshit hat bei dir keine Chance. Nicht weil du hart bist – weil du ehrlich bist. Menschen kommen zu dir, wenn sie die Wahrheit brauchen, nicht Bestätigung.",
        superpower: "Klarheit schenken durch Wahrheit",
        shadow: "Nicht jeder ist bereit für deinen Blick",
        ingredients: [["95", "Direktheit"], ["80", "Klarsicht"], ["60", "Unbequeme Ehrlichkeit"]],
        compatible: "Der Kompass • Der Fels",
        challenging: "Der Hafen",
        gradient: "from-cyan-500 to-blue-600",
        emoji: "🪞"
    },
    harbor: {
        name: "DER HAFEN",
        tagline: "Bei dir kann man anlegen. Ohne Erklärung.",
        description: "Du bist der Ort, an dem Menschen sein dürfen, wie sie sind. Keine Masken nötig. Du urteilst nicht, du bist da. Menschen verlassen dich leichter, als sie kamen.",
        superpower: "Bedingungsloser Raum für andere sein",
        shadow: "Du vergisst manchmal, dass du auch Hafen brauchst",
        ingredients: [["90", "Akzeptanz"], ["85", "Präsenz"], ["70", "Emotionale Sicherheit"]],
        compatible: "Der Spiegel • Die Flamme",
        challenging: "Die Brücke",
        gradient: "from-teal-500 to-emerald-600",
        emoji: "⚓"
    },
    compass: {
        name: "DER KOMPASS",
        tagline: "Du hilfst anderen, ihren Weg zu finden.",
        description: "Menschen kommen zu dir, wenn sie sich verirrt haben. Nicht für Anweisungen – für Orientierung. Du siehst Muster, wo andere nur Chaos sehen.",
        superpower: "Richtung geben ohne zu bestimmen",
        shadow: "Wer zeigt dir den Weg, wenn du suchst?",
        ingredients: [["85", "Weisheit"], ["80", "Geduld"], ["75", "Strategisches Denken"]],
        compatible: "Der Spiegel • Der Hafen",
        challenging: "Die Flamme",
        gradient: "from-violet-500 to-purple-600",
        emoji: "🧭"
    },
    bridge: {
        name: "DIE BRÜCKE",
        tagline: "Du verbindest Menschen, die sich sonst nie gefunden hätten.",
        description: "Du bist der Grund, warum Fremde Freunde werden. Du siehst, wer zu wem passt. In jeder Gruppe bist du der soziale Klebstoff.",
        superpower: "Unsichtbare Verbindungen sichtbar machen",
        shadow: "Du vergisst dich selbst über dem Verbinden",
        ingredients: [["90", "Soziale Intelligenz"], ["80", "Empathie"], ["70", "Menschenkenntnis"]],
        compatible: "Die Flamme • Der Kompass",
        challenging: "Der Fels",
        gradient: "from-pink-500 to-rose-600",
        emoji: "🌉"
    }
};
