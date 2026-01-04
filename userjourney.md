# QuizzMe - User Journey & Workflows

**Erstellungsdatum:** 2026-01-04
**Status:** Aktuelle Analyse der implementierten Features

---

## Übersicht

QuizzMe ist eine psychologisch-astrologische Persönlichkeitsplattform, die Quiz-Antworten, westliche Astrologie und chinesische Ba Zi (Vier Säulen) kombiniert, um ein dynamisches Persönlichkeitsprofil zu erstellen.

---

## 1. Neue Nutzer: Onboarding Journey

### Phase 1: Authentifizierung
**URL:** `/login`
**Akteur:** Nicht-authentifizierter Besucher

#### Schritte:
1. **Landing Page Ankunft**
   - Nutzer sieht Login/Signup Formular
   - Optionen: Email/Passwort oder OAuth (falls konfiguriert)

2. **Registrierung**
   - Email + Passwort eingeben
   - Supabase Auth verarbeitet Registrierung
   - Email-Verifizierung (je nach Config)

3. **Redirect nach Auth Callback**
   - URL: `/auth/callback`
   - Session wird verifiziert
   - Redirect zu `/onboarding/astro` falls Geburtsdaten fehlen

---

### Phase 2: Astro Onboarding
**URL:** `/onboarding/astro`
**Akteur:** Authentifizierter Nutzer ohne Geburtsdaten

#### UI Komponenten:
- **Name Input** ("Callsign")
- **Geburtsdatum** (date picker)
- **Geburtszeit** (time picker)
- **Geburtsort** (MAJOR_CITIES autocomplete dropdown)

#### Hintergrund-Prozess:
1. **Formular Submit**
   ```
   Frontend → POST /api/astro-compute
   ```

2. **Backend Verarbeitung** (`src/lib/astroProfiles.ts`):
   ```
   upsertProfile() → Supabase `profiles` Table
   ├─ username
   ├─ birth_date
   ├─ birth_time
   ├─ birth_place_name
   ├─ birth_lat, birth_lng
   └─ iana_time_zone
   ```

3. **Astro Computation** (Hybrid Engine):
   ```
   Cosmic Engine
   ├─ Western Astro (Cloud API oder Local)
   │  ├─ Sun Sign (tropischer Zodiak)
   │  ├─ Chinese Zodiac (Animal + Element)
   │  └─ Optional: Ascendant/Moon (falls Zeit + Ort bekannt)
   │
   ├─ Ba Zi Calculation (Local/Python)
   │  ├─ 4 Pillars (Year, Month, Day, Hour)
   │  ├─ Stems & Branches (干支)
   │  └─ Wu Xing Element Balance
   │
   └─ Fusion Sign Creator
      ├─ Combines Western + Ba Zi Elements
      ├─ Generates SymbolSpecV1 (SVG + Prompt)
      └─ "Systemic Minimalism" Visual
   ```

4. **Profile Initialization**:
   ```
   ingestContribution(source: "onboarding.astro.v1")
   ├─ Extract Trait Anchors from Astro Anchor Map
   │  (z.B. Cancer Sun → trait.empathy.sensitivity: baseScore 70)
   ├─ Initialize TraitStates mit baseScore + shiftZ=0
   ├─ Psyche Dimensions Baseline Setup
   └─ Save to Supabase profiles.astro_data (JSONB)
   ```

5. **Redirect**:
   - **Erfolg:** `/astrosheet` (Astro-Sheet Dashboard)
   - **Fehler:** Fehlermeldung (z.B. DST Ambiguität)

---

## 2. Quiz Flow: Persönlichkeit Vertiefen

### Verfügbare Quizzes (15 aktiv)
1. **Personality Quiz** - Core traits (Focus, Resources, Empathy)
2. **Love Languages Quiz** - Beziehungs-Präferenzen
3. **EQ Quiz** - Emotionale Intelligenz
4. **Aura Colors Quiz** - Energetische Signatur
5. **Charme Quiz** - Soziale Ausstrahlung
6. **Celebrity Soulmate Quiz** - Berühmte Matches
7. **Social Role Quiz** - Gruppendynamik
8. **Spotlight Quiz** - Aufmerksamkeits-Präferenz
9. **Party Quiz** - Soziale Situationen
10. **RPG Identity Quiz** - Archetypen & Klassen
11. **Energiestein Quiz** - Mineral-Resonanz
12. **Blumenwesen Quiz** - Botanische Entsprechung
13. **Krafttier Quiz** - Animal Spirit
14. **Career DNA Quiz** - Berufliche Neigungen
15. **Destiny Quiz** - Horoscope-Integration

### Quiz Journey

#### Schritt 1: Quiz Auswahl
**URL:** `/verticals/quiz` oder `/verticals/quiz/{quiz-name}`

- Nutzer browst verfügbare Quizzes
- Klickt auf Quiz-Karte

#### Schritt 2: Quiz Durchführung
**Komponente:** `{QuizName}Quiz.tsx` + `QuizPageShell`

```
Frage 1 von N
├─ Optionen anzeigen (A, B, C, D)
├─ Nutzer wählt Option
├─ Interner Score wird akkumuliert
└─ Weiter zur nächsten Frage
```

**Marker System:**
- Jede Option hat `markers` (z.B. `"marker.eq.empathy": 0.8`)
- Marker werden aufkumuliert während Quiz
- Finale Auswertung: Dominanter Marker bestimmt Ergebnis

#### Schritt 3: Ergebnis Anzeige
**UI:** Quiz-Ergebnis Popup

```
Dein Ergebnis: [Title]
├─ Beschreibung / Interpretation
├─ Visuals (optional: Bild, Badge)
└─ CTA: "Zum Profil" oder "Nächstes Quiz"
```

#### Schritt 4: Contribution Event
**Backend:** `POST /api/contribute`

```json
{
  "source": "quiz.personality.v1",
  "markers": {
    "marker.eq.empathy": 0.75,
    "marker.psyche.connection": 0.6
  },
  "traitUpdates": [
    { "traitId": "trait.empathy.sensitivity", "evidence": 0.35, "tier": "GROWTH" }
  ],
  "tags": ["tag.identity.empath"],
  "unlocks": ["unlock.achievement.first_quiz"],
  "fields": {
    "field.quiz_result.personality": "Du bist ein Empath..."
  }
}
```

**Backend Verarbeitung:**
```
contribute-service.ts
├─ 1. Lade ProfileState aus Supabase
├─ 2. Validate ContributionEvent (Zod Schema)
├─ 3. ingestContribution(state, event)
│    ├─ Map Markers → Psyche Dimensions
│    ├─ updatePsycheState() [LME EMA Update]
│    │   ├─ Reliability Weight (Personality=0.7, General=0.5)
│    │   ├─ EMA Formula: newValue = (1-α)*baseline + α*signal
│    │   └─ Momentum Tracking
│    ├─ applyTraitUpdates() [Two-Layer System]
│    │   ├─ Evidence → Shift Z (logit space)
│    │   ├─ Anchor Dominance (baseScore resists opposing)
│    │   ├─ Asymmetric Caps (MAX_ALIGN_Z vs MAX_OPPOSE_Z)
│    │   └─ Bounds Check (shiftZ clamping)
│    ├─ Merge Tags, Unlocks, Fields
│    └─ buildProfileSnapshot() [UI-ready]
│        ├─ uiScore(TraitState) → 1-100 integer
│        ├─ calcDerivedStats(PsycheState)
│        └─ ArchetypeMix derivation
├─ 4. Save ProfileState → Supabase
└─ 5. Return ProfileSnapshot to Frontend
```

#### Schritt 5: Character Sheet Update
**URL:** `/character`

**Frontend erhält neue ProfileSnapshot:**
```
AfterQuizDeltaBanner erscheint (Top of Page)
├─ "Top Movers" angezeigt (1-3 Traits mit größtem Delta)
├─ Auto-Dismiss nach 10s
└─ Framer Motion Animationen

Character Sheet re-rendered mit neuen Werten:
├─ CoreStatsCard (Clarity, Courage, Connection, Order, Shadow)
│   └─ StatBarRow: Delta-driven Animation (450-1400ms)
├─ ClimateCard (5 bipolare Achsen)
│   └─ AxisRail: Marker slides mit Delta-driven Duration
├─ MetaBadgesRow (Intensity, Tempo, Shadow Confidence)
├─ DerivedStatsCard (Vitality, Willpower, Chaos, Harmony)
└─ ArchetypeStoryCard (Dominant + Secondary Archetypes)
```

**Animation Details:**
- **Duration Formula:** `clamp(450, 1400, 450 + 1200 * magnitude)`
- **Top Movers Glow:** 2.5s keyframe animation
- **Reduced Motion:** ≤250ms, kein Glow (WCAG AA konform)

---

## 3. Astro Sheet Journey

### URL: `/astrosheet`
**Zugang:** Nach Onboarding oder via Navigation

#### Komponenten:
1. **HoroscopeInput** (oberer Bereich)
   - Name, Geburtsdatum, Zeit, Ort
   - "Berechnen" Button → trigger re-compute

2. **ZodiacShield** (zentrales Visual)
   - SVG Darstellung des westlichen Zeichens
   - Animierte Elemente

3. **IdentityBadges** (unterer Bereich)
   - Sun Sign, Moon Sign, Ascendant
   - Chinese Zodiac (Animal + Element)
   - Wu Xing Element Balance (Radar Chart)

4. **FusionCard** (Sprint 3 Feature)
   - Fusion Sign Display (Systemic Minimalism Symbol)
   - SVG Render + AI Prompt
   - Element Dominance/Deficiency Indicators
   - Wu Xing Breakdown:
     ```
     Wood: ███████ 35% (Dominance)
     Fire: ████ 20%
     Earth: ███ 15%
     Metal: ██ 10% (Deficiency)
     Water: ████ 20%
     ```
   - Interactive Radar Chart (hover states)

---

## 4. Horoscope System (Partial Implementation)

### Freemium Features (geplant):
**URL:** `/verticals/horoscope/daily`

```
Tägliches Horoskop
├─ Haupttransit (Sonne)
├─ Mondphase
├─ Aktuelle Planetenpositionen
└─ CTA: Premium für mehr
```

### Premium Features (TODO):
```
├─ Vollständige Transit-Matrix
├─ Liebeshoroskop
├─ Planetenstunden
├─ Langfristige Themen (Jupiter-Pluto Transite)
└─ Geburtshoroskop-Vollanalyse
```

**Status:** Transit-Berechnung ist `TODO` (siehe `src/lib/astro/compute.ts:240`)

---

## 5. Datenfluss-Zusammenfassung

### Vollständiger Pipeline-Fluss:

```
User Input (Quiz/Astro)
    ↓
ContributionEvent generiert
    ↓
POST /api/contribute
    ↓
contribute-service.ts
    ├─ Fetch ProfileState (Supabase)
    ├─ ingestContribution()
    │   ├─ Marker → Psyche Mapping
    │   ├─ updatePsycheState() [EMA]
    │   ├─ applyTraitUpdates() [Two-Layer]
    │   └─ Merge Cosmetics
    ├─ buildProfileSnapshot()
    └─ Save ProfileState (Supabase)
    ↓
Frontend erhält ProfileSnapshot
    ↓
UI Update (Character Sheet)
    ├─ AfterQuizDeltaBanner
    ├─ Animated Stat Bars
    └─ Delta Chips (2.5s fade-out)
```

---

## 6. Key User Actions & Backend Responses

| User Aktion | Frontend Komponente | Backend Handler | Datenbank Update | UI Feedback |
|-------------|---------------------|-----------------|------------------|-------------|
| **Registrierung** | `/login` | Supabase Auth | `auth.users` | Redirect `/onboarding/astro` |
| **Astro Submit** | `/onboarding/astro` | `/api/astro-compute` | `profiles.astro_data` | Redirect `/astrosheet` |
| **Quiz Answer** | `QuizPageShell` | `buildContributionEvent()` | (local state) | Result Popup |
| **Quiz Complete** | Result Popup → "Profil" | `POST /api/contribute` | `profiles` (JSONB) | Redirect `/character` |
| **View Character** | `/character` | `usePsycheProfile()` | Read `profiles` | Render Stats |
| **Re-compute Astro** | `/astrosheet` → "Berechnen" | `/api/astro-compute` | `profiles.astro_data` | FusionCard Update |

---

## 7. Multidomän-Routing

### Middleware Logic:
```typescript
// src/middleware.ts
if (hostname.includes("horoskop") || hostname.includes("horoscope")) {
    rewrite → /verticals/horoscope/*
} else {
    rewrite → /verticals/quiz/*
}
```

**Domains:**
- `quizzme.com` → Quiz Vertical
- `horoskop.quizzme.com` → Horoscope Vertical (geplant)

---

## 8. Geplante Features (Roadmap)

### Phase 5: Social & Sharing
- [ ] Share Buttons (Facebook, Twitter, WhatsApp, etc.)
- [ ] Server-side Image Generation (Quiz-Ergebnis als Bild)
- [ ] Referral-Tracking

### Phase 6: Premium Tier
- [ ] Subscription Management (Supabase)
- [ ] Vollständiges Horoscope System
- [ ] Transit-Berechnungen (Echtzeit)
- [ ] PDF-Export

### Phase 7: Community
- [ ] Partner-Synastrie (Compatibility)
- [ ] Composite Charts
- [ ] User-Matching basierend auf Astro-Profilen

---

## 9. Technische Besonderheiten

### Two-Layer Trait System
**Problem:** Lineare Scores können über 100 oder unter 0 gehen.
**Lösung:** Logit/Sigmoid Mathematik

```
TraitState = { baseScore: 1-100, shiftZ: float }
uiScore = sigmoid(logit(baseScore) + shiftZ) * 100

Properties:
- Natürliche Saturation bei Edges (1, 100)
- Anchor Dominance via asymmetrische Caps
- Garantierte Bounds (nie NaN, nie Overflow)
```

### LME (Lean Micro Experience)
**Exponential Moving Average für Psyche:**
```
newValue = (1 - α) * baseline + α * signal
momentum = newValue - baseline
```

**Dimensions:**
- Connection (0-1)
- Structure (0-1)
- Emergence (0-1)
- Depth (0-1)
- Shadow (0-1)

### Registry System
**Alle IDs sind validiert gegen Registry:**
```
trait.{category}.{name}
marker.{quiz}.{dimension}
tag.{category}.{name}
unlock.{type}.{name}
field.{block}.{name}
```

Linting: `npm run registry:lint`

---

## 10. User Pain Points & Mitigations

### 1. DST Ambiguität
**Problem:** Geburtszeit fällt in "Fall Back" Stunde
**Status:** TODO (Onboarding Seite zeigt Warnung)
**Geplant:** Fold-Dialog zur Disambiguation

### 2. Quiz Retake Warning
**Problem:** User retaken Quiz ohne Warnung
**Status:** Feature designed, nicht implementiert
**Geplant:** Modal "Vorheriges Ergebnis wird überschrieben"

### 3. Completed Quiz Status
**Problem:** Keine visuelle Markierung für abgeschlossene Quizzes
**Status:** Feature designed, nicht implementiert
**Geplant:** Grayscale + "Completed" Stamp

---

## 11. Accessibility & UX

### WCAG AA Konformität:
- ✅ Reduced Motion Support (`prefers-reduced-motion: reduce`)
- ✅ Keyboard Navigation (alle interaktiven Elemente)
- ✅ ARIA Labels (Axis Rails, Stat Bars)
- ✅ Kontrast-Ratios (Text: ≥4.5:1, Large: ≥3:1)
- ✅ Semantic HTML Structure

### Performance:
- ✅ GPU-accelerated Animations (transform, width)
- ✅ Framer Motion (optimierte lib)
- ✅ Lazy Loading (Next.js automatic)
- ✅ Caching (Supabase Client caching)

---

## Zusammenfassung

QuizzMe kombiniert:
1. **Westliche Astrologie** (Sun Sign, Ascendant)
2. **Chinesische Ba Zi** (4 Pillars, Wu Xing)
3. **Psychometrische Quizzes** (15 verfügbar)
4. **Two-Layer Trait Engine** (Logit/Sigmoid Math)
5. **LME Psyche System** (EMA Dimensionen)

Nutzer durchlaufen:
1. **Auth** → `/login`
2. **Onboarding** → `/onboarding/astro` (Geburtsdaten)
3. **Quizzes** → `/verticals/quiz/{name}` (Persönlichkeit)
4. **Character Sheet** → `/character` (Profil Visualisierung)
5. **Astro Sheet** → `/astrosheet` (Astro Dashboard)

Alle Änderungen fließen durch **Ingestion Pipeline** und werden als **ProfileState** gespeichert. UI rendert **ProfileSnapshot** mit animierten Deltas.

**Status:** Phase 3 & 4 vollständig implementiert ✅
**Next:** Phase 5 (Social Sharing), Phase 6 (Horoscope Premium)
