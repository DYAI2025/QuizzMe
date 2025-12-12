1. story-map.json
json
Code kopieren
{
  "product": "Dynamisches Persönlichkeitsprofil & Avatar (LME/DUBA-Integration)",
  "actor": "Quiz-Nutzer:in mit Account",
  "goal": "Über mehrere Persönlichkeitstests hinweg ein dynamisches, verständliches Langzeit-Profil und einen Avatar erleben.",
  "activities": [
    {
      "id": "A1",
      "title": "Tests entdecken & starten",
      "steps": [
        {
          "id": "A1-S1",
          "title": "Quiz im Feed/Vertical auswählen"
        },
        {
          "id": "A1-S2",
          "title": "Onboarding 'Langzeit-Profil & Avatar' verstehen"
        }
      ]
    },
    {
      "id": "A2",
      "title": "Quiz beantworten & abschließen",
      "steps": [
        {
          "id": "A2-S1",
          "title": "Quizfragen beantworten"
        },
        {
          "id": "A2-S2",
          "title": "Fun-Ergebnis sehen"
        }
      ]
    },
    {
      "id": "A3",
      "title": "Verstehen wie Tests das Profil formen",
      "steps": [
        {
          "id": "A3-S1",
          "title": "Hinweis 'Tests zahlen aufs Profil ein' sehen"
        },
        {
          "id": "A3-S2",
          "title": "Verstehen 'Avatar/Archetypen = Verdichtung'"
        }
      ]
    },
    {
      "id": "A4",
      "title": "Profil & Avatar erleben",
      "steps": [
        {
          "id": "A4-S1",
          "title": "Profil-/Avatar-Seite öffnen"
        },
        {
          "id": "A4-S2",
          "title": "Archetypen-Mix & Avatar sehen"
        },
        {
          "id": "A4-S3",
          "title": "Timeline-/Story-Snippets lesen"
        }
      ]
    },
    {
      "id": "A5",
      "title": "Veränderung & Kontrolle erleben",
      "steps": [
        {
          "id": "A5-S1",
          "title": "Mehrere Tests machen"
        },
        {
          "id": "A5-S2",
          "title": "Veränderung nach 3–5 Tests erkennen"
        },
        {
          "id": "A5-S3",
          "title": "Kontrolle/Reset & Privacy verstehen"
        }
      ]
    },
    {
      "id": "A6",
      "title": "System verarbeitet Test-Signale (Tech)",
      "steps": [
        {
          "id": "A6-S1",
          "title": "Tests erzeugen psyche_quiz_completed-Events"
        },
        {
          "id": "A6-S2",
          "title": "LME aggregiert user_state_v1.psyche"
        },
        {
          "id": "A6-S3",
          "title": "Archetypen-Mix & Avatar-Parameter berechnen"
        }
      ]
    }
  ],
  "stories": [
    {
      "id": "S-001",
      "title": "Onboarding-Banner zu Langzeit-Profil & Avatar",
      "activity_id": "A1",
      "step_id": "A1-S2",
      "ac": [
        "Given eine neue Nutzer:in ihren ersten Persönlichkeitstest startet, When der Test beginnt, Then sieht sie eine kurze Erklärung, dass Tests auf ein Langzeit-Profil und einen Avatar einzahlen."
      ]
    },
    {
      "id": "S-002",
      "title": "Quiz abschließen & Fun-Ergebnis sehen",
      "activity_id": "A2",
      "step_id": "A2-S2",
      "ac": [
        "Given eine Nutzer:in einen Persönlichkeitstest vollständig beantwortet hat, When sie den Test abschließt, Then erhält sie sofort ein Fun-Ergebnis ohne Verzögerung."
      ]
    },
    {
      "id": "S-003",
      "title": "Hinweis dass Tests aufs Langzeit-Profil einzahlen",
      "activity_id": "A3",
      "step_id": "A3-S1",
      "ac": [
        "Given eine Nutzer:in ein Testergebnis sieht, When das Ergebnis angezeigt wird, Then ist klar sichtbar, dass dieses Ergebnis auf das Langzeit-Profil einzahlt."
      ]
    },
    {
      "id": "S-004",
      "title": "Profil-/Avatar-Seite mit Avatar & Top-Archetypen",
      "activity_id": "A4",
      "step_id": "A4-S2",
      "ac": [
        "Given eine eingeloggte Nutzer:in, When sie die Profilseite für Psyche und Avatar aufruft, Then sieht sie einen Avatar und die Top-3-Archetypen."
      ]
    },
    {
      "id": "S-005",
      "title": "Erklärung 'Avatar/Archetypen = Verdichtung vieler Tests'",
      "activity_id": "A3",
      "step_id": "A3-S2",
      "ac": [
        "Given eine Nutzer:in auf der Profilseite ist, When sie die Sektion 'Wie entsteht das?' öffnet, Then wird erklärt, dass Avatar und Archetypen die Verdichtung vieler Tests sind."
      ]
    },
    {
      "id": "S-006",
      "title": "Sichtbare Veränderung von Avatar & Archetypen-Mix nach 3–5 Tests",
      "activity_id": "A5",
      "step_id": "A5-S2",
      "ac": [
        "Given eine Testperson im internen Test mindestens drei Persönlichkeitstests abgeschlossen hat, When sie den Avatar und Archetypen-Mix erneut betrachtet, Then nimmt sie eine sichtbare Veränderung wahr."
      ]
    },
    {
      "id": "S-007",
      "title": "Reset-/Opt-out-Funktion & Entertainment-Disclaimer",
      "activity_id": "A5",
      "step_id": "A5-S3",
      "ac": [
        "Given eine Nutzer:in ihr Profil betrachtet, When sie nicht mehr möchte, dass Tests auf ihr Langzeit-Profil einzahlen, Then kann sie die Psyche-Daten zurücksetzen oder das Feature deaktivieren und sieht einen klaren Entertainment-Disclaimer."
      ]
    },
    {
      "id": "S-008",
      "title": "Mindestens drei angebundene Persönlichkeitstests",
      "activity_id": "A5",
      "step_id": "A5-S1",
      "ac": [
        "Given eine eingeloggte Testperson, When sie den Quiz-Bereich öffnet, Then stehen mindestens drei unterschiedliche Persönlichkeitstests zur Verfügung, die alle das Psyche-Profil aktualisieren."
      ]
    },
    {
      "id": "S-009",
      "title": "Timeline-/Story-Snippets auf Profilseite",
      "activity_id": "A4",
      "step_id": "A4-S3",
      "ac": [
        "Given eine Nutzer:in mehrere relevante Tests im Laufe der Zeit abgeschlossen hat, When sie die Timeline-Sektion der Profilseite öffnet, Then sieht sie mindestens zwei Story-Snippets, die Veränderungen im Profil beschreiben."
      ]
    },
    {
      "id": "S-010",
      "title": "Psyche-Pack (Dimensionen) als Config definieren",
      "activity_id": "A6",
      "step_id": "A6-S2",
      "ac": [
        "Given das Produktteam das Psyche-Pack definiert, When die Config geladen wird, Then stehen 3 bis 5 dokumentierte Dimensionen mit base_alpha_dim-Werten zur Verfügung."
      ]
    },
    {
      "id": "S-011",
      "title": "user_state_v1.psyche Schema & Default-State",
      "activity_id": "A6",
      "step_id": "A6-S2",
      "ac": [
        "Given ein neuer Account angelegt wird, When der Psyche-State initialisiert wird, Then wird eine valide user_state_v1.psyche-Instanz entsprechend des Schemas gespeichert."
      ]
    },
    {
      "id": "S-012",
      "title": "DUBA-Event psyche_quiz_completed & Quiz-Schema mit Markern",
      "activity_id": "A6",
      "step_id": "A6-S1",
      "ac": [
        "Given eine Nutzer:in einen Persönlichkeitstest abschließt, When der Quiz-Service die Route /api/quiz/complete aufruft, Then wird genau ein validiertes psyche_quiz_completed-Event in DUBA geschrieben."
      ]
    },
    {
      "id": "S-013",
      "title": "Aggregationslogik im LME-Core inklusive Fun-Test-Gewichtung",
      "activity_id": "A6",
      "step_id": "A6-S2",
      "ac": [
        "Given eine Serie von psyche_quiz_completed-Events mit verschiedenen reliability_weight-Werten, When die Aggregationsfunktion ausgeführt wird, Then ändern sich Dimensionen stabil und kein einzelner Fun-Test verschiebt den dominanten Archetyp um mehr als 50 Prozentpunkte."
      ]
    },
    {
      "id": "S-014",
      "title": "Archetypen-Mix Top-N Gewichte berechnen",
      "activity_id": "A6",
      "step_id": "A6-S3",
      "ac": [
        "Given ein aktueller Psyche-State und eine archetypes.json-Konfiguration, When compute_archetype_mix ausgeführt wird, Then summieren sich die Gewichte ungefähr zu 1 und der nächstliegende Prototyp bekommt den höchsten Anteil."
      ]
    },
    {
      "id": "S-015",
      "title": "Avatar-Mapping & Profil-API",
      "activity_id": "A6",
      "step_id": "A6-S3",
      "ac": [
        "Given eine eingeloggte Nutzer:in, When der Client GET /api/profile/psyche aufruft, Then liefert die API Psyche-State, Archetypen-Mix und Avatar-Parameter in einer Payload zurück."
      ]
    },
    {
      "id": "S-016",
      "title": "Archetypen-Deck & XP-Logik",
      "activity_id": "A6",
      "step_id": "A6-S3",
      "ac": [
        "Given eine Nutzer:in über mehrere Wochen Tests macht, When ihre psyche_quiz_completed-Events verarbeitet werden, Then steigen die XP-Werte der häufig aktivierten Archetypen im Deck sichtbar an."
      ]
    }
  ]
}
2. story-slices.md (MVP + Folge-Release)
md
Code kopieren
# Story Slices – Dynamisches Persönlichkeitsprofil & Avatar

## Slice 1 – MVP / Walking Skeleton (Soft-Rollout, Day 0–7)

**Ziel/Outcome**

- Internes Soft-Rollout-MVP mit ≥ 10 Testpersonen.
- SC-1 bis SC-4 sind für den internen Testlauf erfüllbar.
- Dünner, aber vollständiger End-to-End-Weg: Test → Event → State → Archetypen-Mix → Avatar → Profil-UI.

**Enthaltene Stories**

- Backbone-kritisch:
  - A1: S-001
  - A2: S-002
  - A3: S-003, S-005
  - A4: S-004
  - A5: S-006, S-007, S-008
- Tech-Swimlane:
  - S-010, S-011, S-012, S-013, S-014, S-015

**KPIs (Slice-Level)**

- SC-1: ≥ 3 aktive Persönlichkeitstests erzeugen psyche_quiz_completed-Events.
- SC-2: In einem internen Testlauf (≥ 10 Nutzer:innen) geben ≥ 80 % an, nach 3–5 Tests eine sichtbare Veränderung von Avatar/Archetypen-Mix wahrzunehmen.
- SC-3: In Simulationen und manuellen Tests verschiebt kein einzelner kurzer Fun-Test den dominanten Archetyp um > 50 Prozentpunkte.
- SC-4: ≥ 80 % der Testpersonen können in 1–2 Sätzen erklären:
  - dass Tests auf ein Langzeit-Profil einzahlen und
  - dass Avatar/Archetypen eine Verdichtung vieler Tests sind.

**Definition of Done (Slice 1)**

- Psyche-Pack (3–5 Dimensionen) ist dokumentiert und als Config im System hinterlegt.
- user_state_v1.psyche-Schema ist validiert; Default-State wird bei neuen Accounts angelegt.
- psyche_quiz_completed-Events werden bei /api/quiz/complete zuverlässig geschrieben (inkl. marker_scores, reliability_weight).
- LME-Core aggregiert Events in user_state_v1.psyche mit Parametrisierung, die Fun-Tests deutlich schwächer gewichtet.
- compute_archetype_mix liefert Top-N-Archetypen; Profil-API gibt State + Archetypen-Mix + Avatar-Parameter zurück.
- Profilseite zeigt Avatar + Top-Archetypen und eine kurze „Wie entsteht das?“-Erklärung.
- Kurz-Onboarding (S-001) ist in mindestens einem Testflow aktiv.
- Es existieren mindestens 3 Persönlichkeitstests mit Psyche-Markern (S-008).
- Entertainment-Disclaimer & Reset/Opt-out sind sichtbar implementiert (S-007).
- Interner Testlauf (≥ 10 Personen) ist durchgeführt, Ergebnisse dokumentiert.

**Akzeptanzkriterien (Slice 1, Gherkin)**

- Scenario: Interner End-to-End-Test  
  Given eine Testperson mit neuem Account  
  When sie innerhalb einer Woche drei unterschiedliche angebundene Persönlichkeitstests abschließt  
  Then sieht sie auf der Profilseite einen Avatar, einen Archetypen-Mix und nimmt eine Veränderung nach Test 3 wahr.

- Scenario: Fun-Test hat begrenzten Einfluss  
  Given ein stabiler Psyche-State mit dominantem Archetyp A  
  When ein einzelner Fun-Test mit niedriger reliability_weight abgeschlossen wird  
  Then ändert sich der Anteil von Archetyp A um höchstens 50 Prozentpunkte.

- Scenario: Verständnis der Langzeit-Logik  
  Given zehn interne Testpersonen haben das Onboarding gelesen und die Profilseite gesehen  
  When sie gefragt werden „Was zeigt der Avatar und warum ändert er sich?“  
  Then können mindestens acht Personen erklären, dass viele Tests auf ein Langzeit-Profil einzahlen, das Avatar und Archetypen steuert.

**Risiken (Slice 1)**

- Parametrisierung zu aggressiv → State-Sprünge und Frust.
- Onboarding- und Explainability-Copy wird überflogen → SC-4 wird verfehlt.
- Technische Integration in bestehende Quiz-Flows komplizierter als erwartet → Verzögerung im 7-Tage-Loop.

---

## Slice 2 – Story & Gamification Upgrade

**Ziel/Outcome**

- Aufbau eines emotionaleren, gamifizierten Erlebnisses nach MVP:
  - Profil erzählt „Kapitel“ in einer Timeline.
  - Archetypen-Deck (XP) macht langfristige Entwicklung spielerisch sichtbar.

**Enthaltene Stories**

- User-Facing:
  - S-009 (Timeline-/Story-Snippets auf Profilseite)
- Tech:
  - S-016 (Archetypen-Deck & XP-Logik)
- Plus Feintuning auf Basis der MVP-Messungen (Parametrisierung, Copy).

**KPIs (Slice 2)**

- ≥ 60 % der aktiven Profil-Nutzer:innen öffnen die Timeline-/Story-Sektion mindestens einmal pro Woche.
- Mindestens 30 % der Nutzer:innen mit mehreren Tests klicken explizit auf ein Story-Snippet.
- Qualitatives Feedback: „Verstehbarkeit“ und „Motivation weiterzumachen“ steigen in Interviews.

**Definition of Done (Slice 2)**

- timeline_snapshot-Modell implementiert; Snapshots werden nach definierten Heuristiken erzeugt (z. B. starke Abweichung vom Baseline-State).
- generate_timeline_snippets liefert aus einer Test-Historie 2–3 sinnvolle Story-Snippets.
- Archetypen-Deck mit XP-Update-Regeln implementiert; Deck wird im State persistiert.
- Profilseite zeigt Timeline-Sektion mit mind. 2 Snippets bei Test-Historie.
- Interner A/B-Test oder Quali-Studie mit mind. 10 Personen zum Story-/Deck-Feature durchgeführt.

**Akzeptanzkriterien (Slice 2, Gherkin)**

- Scenario: Story-Snippets aus Historie  
  Given eine Test-Historie mit mehreren Shadow-lastigen Quiz-Events  
  When generate_timeline_snippets ausgeführt wird  
  Then entstehen mindestens zwei Snippets, die die „Shadow-Phase“ und eine anschließende Veränderung beschreiben.

- Scenario: XP-Deck reagiert auf Tests  
  Given eine Nutzer:in schließt fünf Tests ab, die denselben Archetyp stark gewichten  
  When der Psyche-State aktualisiert wird  
  Then steigt der XP-Wert dieses Archetyps im Deck deutlich gegenüber anderen Archetypen.

**Risiken (Slice 2)**

- Zu komplexe Story-Snippets verwirren Nutzende (kognitive Last).
- XP-Mechanik wirkt „zu gamified“ für manche Zielgruppen.
- Scope-Drift: Versuch, zu viele Story-Varianten im ersten Schritt umzusetzen.
3. backlog.csv
csv
Code kopieren
id,title,description,depends_on,actor,goal,activity,step,pattern,effort,reach,impact,confidence,bv,tc,rr,js
S-001,Onboarding-Banner zu Langzeit-Profil & Avatar,Kurz-Onboarding vor dem ersten Test,,Nutzer:in,Dynamisches Langzeit-Profil mit Avatar erleben,A1 – Tests entdecken & starten,A1-S2 – Onboarding verstehen,UX-copy,2,4,4,0.8,4,4,2,2
S-002,Quiz abschließen & Fun-Ergebnis sehen,Bestehender Flow mit neuer Event-Anbindung bleibt erhalten,,Nutzer:in,Dynamisches Langzeit-Profil mit Avatar erleben,A2 – Quiz beantworten & abschließen,A2-S2 – Fun-Ergebnis sehen,core-quiz,2,5,4,0.9,4,5,2,2
S-003,Hinweis dass Tests aufs Langzeit-Profil einzahlen,UI-Hinweis auf Ergebnis- oder Onboarding-Screens,S-001,Nutzer:in,Dynamisches Langzeit-Profil mit Avatar erleben,A3 – Verstehen wie Tests das Profil formen,A3-S1 – Hinweis sehen,UX-copy,1,4,4,0.8,4,3,2,1
S-004,Profil-/Avatar-Seite mit Avatar & Top-Archetypen,Neue Profilansicht mit Avatar und Archetypen-Liste,S-014+S-015,Nutzer:in,Dynamisches Langzeit-Profil mit Avatar erleben,A4 – Profil & Avatar erleben,A4-S2 – Avatar und Mix sehen,UI-avatar,3,4,5,0.8,5,4,3,3
S-005,Erklärung 'Avatar/Archetypen = Verdichtung vieler Tests',How-it-works Copy auf der Profilseite,S-004,Nutzer:in,Dynamisches Langzeit-Profil mit Avatar erleben,A3 – Verstehen wie Tests das Profil formen,A3-S2 – Verdichtung verstehen,UX-explain,1,4,4,0.8,4,3,2,1
S-006,Sichtbare Veränderung von Avatar & Archetypen-Mix nach 3–5 Tests,Interner Testlauf mit 10 Personen und Feintuning der Parameter,S-004+S-013+S-014,Nutzer:in,Dynamisches Langzeit-Profil mit Avatar erleben,A5 – Veränderung & Kontrolle erleben,A5-S2 – Veränderung erkennen,UX-validation,2,3,5,0.7,5,4,4,2
S-007,Reset-/Opt-out-Funktion & Entertainment-Disclaimer,Kontrolloption im Profil plus klarer Entertainment-Disclaimer,S-004,Nutzer:in,Dynamisches Langzeit-Profil mit Avatar erleben,A5 – Veränderung & Kontrolle erleben,A5-S3 – Kontrolle & Privacy,ethics,2,4,4,0.8,4,4,3,2
S-008,Mindestens drei angebundene Persönlichkeitstests,Drei Quiz-Configs mit Psyche-Markern sind aktiv,S-012,Nutzer:in,Dynamisches Langzeit-Profil mit Avatar erleben,A5 – Veränderung & Kontrolle erleben,A5-S1 – Mehrere Tests machen,content-config,3,4,4,0.7,4,3,2,3
S-009,Timeline-/Story-Snippets auf Profilseite,Timeline-Heuristiken und Story-Templates in der UI zeigen,S-015,Nutzer:in,Dynamisches Langzeit-Profil mit Avatar erleben,A4 – Profil & Avatar erleben,A4-S3 – Timeline lesen,story-layer,3,3,4,0.7,4,3,3,3
S-010,Psyche-Pack (Dimensionen) als Config definieren,Konfiguration der Psyche-Dimensionen inklusive base_alpha_dim,,Product/Tech-Team,Dynamisches Langzeit-Profil mit Avatar erleben,A6 – System verarbeitet Test-Signale,A6-S2 – LME aggregiert State,config,2,5,5,0.9,5,5,4,2
S-011,user_state_v1.psyche Schema & Default-State,JSON-Schema und Default-Instanz für den Psyche-State,,System,Dynamisches Langzeit-Profil mit Avatar erleben,A6 – System verarbeitet Test-Signale,A6-S2 – LME aggregiert State,schema,2,5,5,0.9,5,4,4,2
S-012,DUBA-Event psyche_quiz_completed & Quiz-Schema mit Markern,Neuer Event-Typ und Marker-Felder in der Quiz-Config,S-010+S-011,System,Dynamisches Langzeit-Profil mit Avatar erleben,A6 – System verarbeitet Test-Signale,A6-S1 – Events erzeugen,eventing,3,5,5,0.9,5,5,4,3
S-013,Aggregationslogik im LME-Core inklusive Fun-Test-Gewichtung,Update-Regeln für Value Momentum und Baseline mit Reliability-Weights,S-010+S-011+S-012,System,Dynamisches Langzeit-Profil mit Avatar erleben,A6 – System verarbeitet Test-Signale,A6-S2 – LME aggregiert State,engine,3,5,5,0.9,5,4,5,3
S-014,Archetypen-Mix Top-N Gewichte berechnen,Mapping von State auf Archetypen-Mix via Distanz und Softmax,S-010+S-011,System,Dynamisches Langzeit-Profil mit Avatar erleben,A6 – System verarbeitet Test-Signale,A6-S3 – Archetypen-Mix berechnen,engine,2,4,5,0.9,5,3,4,2
S-015,Avatar-Mapping & Profil-API,map_psyche_to_avatar_params und GET API für Profil,S-013+S-014,System,Dynamisches Langzeit-Profil mit Avatar erleben,A6 – System verarbeitet Test-Signale,A6-S3 – Avatar-Parameter berechnen,api-avatar,3,4,5,0.8,5,4,3,3
S-016,Archetypen-Deck & XP-Logik,XP-Deck für Archetypen mit einfachen Update-Regeln,S-014,System,Dynamisches Langzeit-Profil mit Avatar erleben,A6 – System verarbeitet Test-Signale,A6-S3 – Archetypen-Deck,gamification,2,3,4,0.7,4,2,3,2
4. storymap.mmd
mermaid
Code kopieren
flowchart LR
  A1["A1 Tests entdecken & starten"]
  A2["A2 Quiz beantworten & abschließen"]
  A3["A3 Verstehen wie Tests das Profil formen"]
  A4["A4 Profil & Avatar erleben"]
  A5["A5 Veränderung & Kontrolle erleben"]
  A6["A6 System verarbeitet Test-Signale (Tech)"]

  A1 --> A2 --> A3 --> A4 --> A5
  A2 --> A6
  A3 --> A6
  A4 --> A6
  A5 --> A6

  S001["S-001 Onboarding-Banner"] --- A1
  S002["S-002 Quiz abschließen & Fun-Ergebnis"] --- A2
  S003["S-003 Hinweis Langzeit-Profil"] --- A3
  S004["S-004 Profilseite mit Avatar"] --- A4
  S005["S-005 Erklärung Verdichtung"] --- A3
  S006["S-006 Sichtbare Veränderung nach 3–5 Tests"] --- A5
  S007["S-007 Reset & Disclaimer"] --- A5
  S008["S-008 Drei angebundene Tests"] --- A5
  S009["S-009 Timeline-Snippets"] --- A4

  S010["S-010 Psyche-Pack Config"] --- A6
  S011["S-011 Psyche-State Schema"] --- A6
  S012["S-012 psyche_quiz_completed Event"] --- A6
  S013["S-013 Aggregationslogik LME-Core"] --- A6
  S014["S-014 Archetypen-Mix"] --- A6
  S015["S-015 Avatar-Mapping & API"] --- A6
  S016["S-016 Archetypen-Deck"] --- A6
5. gate-note.md
md
Code kopieren
# Gate-Note – Dynamisches Persönlichkeitsprofil & Avatar (LME/DUBA)

## 1. Framing

- **Product**: Dynamisches Persönlichkeitsprofil & Avatar (LME/DUBA-Integration)
- **Primäre Persona**: Quiz-Nutzer:in mit Account, die regelmäßig virale Persönlichkeitstests nutzt.
- **Goal**: Über mehrere Persönlichkeitstests hinweg ein dynamisches, verständliches Langzeit-Profil und einen Avatar erleben (statt isolierter Einmal-Ergebnisse).

**Kern-KPIs (aus SC abgeleitet)**

- SC-1: ≥ 3 Persönlichkeitstests sind als psyche_quiz_completed-Signalquelle angebunden.
- SC-2: In einem internen Testlauf (≥ 10 Nutzer:innen) ist nach 3–5 Tests eine sichtbare Veränderung von Avatar & Archetypen-Mix erkennbar.
- SC-3: Kein einzelner kurzer Fun-Test kann den dominanten Archetyp um > 50 Prozentpunkte verschieben.
- SC-4: ≥ 80 % der Testpersonen verstehen nach kurzem Onboarding, dass Tests auf ein Langzeit-Profil einzahlen und Avatar/Archetypen eine Verdichtung vieler Tests sind.

## 2. Entscheidungsreife

- **Backbone** ist definiert (A1–A6, chronologisch).
- **Stories** sind INVEST-fähig geschnitten und der 2D-Map zugeordnet.
- **Vertikale Priorisierung**: MVP-Slice 1 deckt alle kritischen Backbone-Schritte mit mindestens einer Story ab.
- **Slice-Plan** steht:
  - Slice 1 – MVP / Walking Skeleton (Soft-Rollout, Day 0–7)
  - Slice 2 – Story & Gamification Upgrade (Timeline + Deck)

👉 Aus Gate-Sicht ist Slice 1 entscheidungsreif; Risiken sind benannt und an konkrete Stories gekoppelt.

## 3. Wichtige Abhängigkeiten

- Bestehender **DUBA-Event-Layer** und **LME-Core** sind verfügbar und erweiterbar.
- Quiz-Vertical unterstützt:
  - Erweiterung des quiz.schema um Psyche-Felder,
  - Aufruf von /api/quiz/complete mit zusätzlichen Payload-Feldern.
- SRR-/Avatar-Engine ist für Mapping-Parameter ansprechbar.
- Content-Team steht für:
  - sinnvolle Marker-Definitionen,
  - Onboarding- und Disclaimer-Copy („Entertainment, nicht Diagnostik“).

## 4. Offene Risiken & Mitigation

1. **Verwechslung mit Diagnostik**
   - Risiko: Nutzer:innen interpretieren Avatar/Profil als psychologische Diagnose.
   - Mitigation: Sehr klare, wiederholte Entertainment-Disclaimer, keine medizinischen Begriffe, Reset-Option (S-007).

2. **Marker-Qualität**
   - Risiko: Marker sind schlecht kalibriert → Profile wirken zufällig.
   - Mitigation: Guidelines für Marker, internes Marker-Review, Start mit wenigen, gut durchdachten Tests (S-008, S-010, S-012).

3. **State-Sprünge / Frust**
   - Risiko: Zu aggressive Parameter → Profil „springt“.
   - Mitigation: Konservative base_alpha_dim, reliability_weight; Simulationen & Unit-Tests (S-013, SC-3).

4. **Komplexität der Archetypen**
   - Risiko: Nutzer:innen verstehen Archetypenmix nicht intuitiv.
   - Mitigation: Wenige starke Archetypen, klare Copy (S-005), optionale Gamification über Deck (S-016) erst in Slice 2.

5. **Technische Integration**
   - Risiko: Eingriffe in bestehende Flows werden größer als gedacht.
   - Mitigation: Config-first, neue Logik in separaten Modulen, Feature-Flag für graduellen Rollout.

## 5. Nächste Schritte (7-Tage-Loop, orientiert an Slice 1)

- **Day 0**
  - S-010: Psyche-Pack definieren.
  - S-011: user_state_v1.psyche-Schema spezifizieren.
- **Day 1–2**
  - S-012: psyche_quiz_completed-Event & Quiz-Schema-Erweiterung.
  - Integration von aggregateMarkers in den Quiz-Service.
- **Day 3**
  - S-013: Aggregationslogik im LME-Core.
  - Erste Debug-View für user_state_v1.psyche.
- **Day 4–5**
  - S-014: Archetypen-Mix.
  - S-015: Avatar-Mapping & Profil-API.
  - S-004: Erste Profilseite mit Avatar & Mix.
- **Day 6**
  - S-001, S-003, S-005, S-007: Onboarding, Erklär-Text, Disclaimer, Reset.
  - Vorbereitung interner Testlauf (S-006, S-008).
- **Day 7**
  - Interner End-to-End-Test (SC-1–SC-4 messen).
  - Entscheidung: Slice 1 shippen (Soft-Rollout unter Feature-Flag) und Slice 2 planen.

**Empfehlung fürs Gate**

- Slice 1 freigeben mit klarer Auflage:
  - KPIs aus SC-1–SC-4 nach Day-7-Testlauf messen.
  - Parametrisierung und Copy vor Public Rollout einmal iterieren.
  - Dann erst Story-/Gamification-Slice (Slice 2) aktiv planen.