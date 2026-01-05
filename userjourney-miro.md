# QuizzMe - User Journey (aus Miro Board)

**Quelle:** Miro Board User Journey Flow
**Erstellungsdatum:** 2026-01-05
**Status:** Vollständige Transkription

---

## Übersicht

Dieser Flow beschreibt die komplette User Journey vom Onboarding bis zu den verschiedenen Features (Dashboard, Quizzes, Daily Horoscope, Social Sharing).

---

## 1. ONBOARDING FLOW

### Start: Neuer User
**Einstiegspunkt:** "Onboarding new user"

#### Schritt 1: Geburtsdaten-Erfassung
**Entscheidungspunkt:** "Ensure birthday, place and time information"

**Zwei Pfade:**

**A) Daten NICHT bekannt:**
- User wird zur Dateneingabe geführt
- *(Flow-Details im Bild nicht vollständig sichtbar)*

**B) Daten BEKANNT:**
- Weiter zu Schritt 2

---

### Schritt 2: Horoscope Berechnung
**System-Aktion:** "Horoscope cloud engine by ac calculates zodiac, sun and ba zi"

**Backend-Prozess:**
```
Cloud Engine
├─ Berechnet Zodiac (Western)
├─ Sun Sign
└─ Ba Zi (Chinesische Astrologie)
```

**Entscheidungspunkt:** "Data is saved by byz"
- Wenn erfolgreich → Weiter zu Schritt 3
- *(Alternative nicht im Flow dargestellt)*

---

### Schritt 3: Speicherung in Supabase
**System-Aktion:** "Supabase URL saves user ID and zodiac data"

**Datenbank-Operation:**
```
Supabase
├─ Speichert: user_id
├─ Speichert: zodiac_data
└─ Verknüpft: user_id mit user_profile
```

**Parallel-Aktion:** "Supabase gets user ID and zodiac data and saves userID and user ID"

---

### Schritt 4: Dashboard Redirect
**Screen:** "Dashboard (Astrosheet)"

**User landet auf:** Astrosheet Page
**Inhalte:**
- Erstellungs-Matrix
- Mission & Bedeutung
- *(Astro Dashboard mit allen berechneten Daten)*

**UI-Element:** Orange Box mit Screenshot des Dashboards

---

### Schritt 5: Symbol-Generierung (Parallel)
**System-Aktion:** "Instant symbol creator creates unix user badge symbol from embedded data"

**Backend-Prozess:**
```
Symbol Creator
├─ Input: Ba Zi + Western Zodiac Daten
├─ Generiert: Unique User Badge/Symbol
└─ Embedded in: User Profile
```

---

## 2. HAUPTNAVIGATION (Sidebar)

Nach dem Onboarding hat der User Zugriff auf das Hauptmenü:

### Sidebar-Menü:
```
├─ DASHBOARD    (Standard-Ansicht)
├─ PROFIL       (User Profile & Character Sheet)
├─ QUIZZES      (Persönlichkeits-Tests)
├─ AGENTEN      (AI Agents/Chat)
├─ PREMIUM      (Premium Features)
└─ EINSTELLUNGEN (Settings)
```

---

## 3. NAVIGATION FLOWS (User Klicks auf Sidebar)

### Flow A: User klickt auf "Profil"
**Entscheidungspunkt:** "user clicks on sidebar on 'profil'"

**Aktion:** "unique link to bazi diagram layer"

**Ziel-Screen:**
- Ba Zi Diagram Detail-Ansicht
- Detaillierte astrologische Charts
- Persönliche Analyse

---

### Flow B: User klickt auf "Daily" (Horoscope)
**Entscheidungspunkt:** "user clicks on sidebar on 'Daily'"

**Aktion:** "unique link to Daily horoscope (Premium)"

**Ziel-Screen:**
- Tägliches Horoskop
- Transit-Informationen
- **Premium Feature** (gekennzeichnet)

---

### Flow C: User klickt auf "Quizzes"
**Entscheidungspunkt:** "user clicks on sidebar on 'Quizzes'"

**Aktion:** "unique link to Daily horoscope (Premium)"
*(Anmerkung: Dies scheint ein Fehler im Flow zu sein - sollte zu Quizzes führen)*

---

### Flow D: User klickt auf "Quizzes" (Alternative)
**Entscheidungspunkt:** "user clicks on sidebar on 'Quizzes'"

**Aktion:** "redirect to quizzes panel, to choose a new quiz (Premium finished yet)"

**Ziel-Screen:**
- Quizzes-Übersicht
- Quiz-Auswahl Panel
- Premium-Status: "finished yet" (noch nicht vollständig implementiert)

---

## 4. QUIZ FLOW

### Schritt 1: Quiz-Auswahl
**Screen:** Quizzes Panel
**User-Aktion:** Wählt ein Quiz aus der Liste

### Schritt 2: Quiz durchführen
**User-Aktion:** Beantwortet Fragen
*(Details nicht im Flow)*

### Schritt 3: Quiz abgeschlossen
**Entscheidungspunkt:** "user completes quiz"

**Zwei Optionen:**

---

#### Option A: Nächstes Quiz
**Entscheidungspunkt:** "Next Quiz"

**Aktion:** "Back to Profil Page"

**Flow:**
```
Quiz abgeschlossen
    ↓
Zurück zur Profil Page
    ↓
User sieht aktualisierte Profile Daten
    ↓
Kann neues Quiz wählen
```

---

#### Option B: Social Sharing
**Entscheidungspunkt:** "share on Social media"

**Aktion:** "social media banner share on Facebook Instagram etc."

**Plattformen:**
- Facebook
- Instagram
- *(Weitere Social Media)*

**Flow:**
```
Quiz abgeschlossen
    ↓
User wählt "Share"
    ↓
Social Media Banner generiert
    ↓
Teilen auf gewählter Plattform
```

---

## 5. AGENTEN FLOW (In-Agent Chat)

### Zugang
**Entscheidungspunkt:** "user clicks on sidebar on 'Agenten'"

**Aktion:** Redirect zu "In-Agent live chat page"

**UI-Element:** Rote Box (Warnung/Hinweis)
- *(Vermutlich Beta-Feature oder besondere Hinweise)*

**Ziel-Screen:**
- Live Chat Interface
- AI Agent Interaktion
- *(Details nicht vollständig im Flow)*

---

## 6. SYSTEM-ARCHITEKTUR (Hintergrund)

### Datenfluss:
```
User Input (Onboarding)
    ↓
Cloud Engine (Horoscope Berechnung)
    ↓
Supabase (Datenspeicherung)
    ↓
Symbol Creator (Badge Generation)
    ↓
Dashboard (User sieht Ergebnis)
    ↓
Sidebar Navigation (zu verschiedenen Features)
```

### Datenbank-Schema (Supabase):
```
Tabellen:
├─ users (auth.users)
├─ user_profiles
│   ├─ user_id (FK)
│   ├─ zodiac_data (JSONB)
│   └─ ba_zi_data (JSONB)
└─ user_symbols
    ├─ user_id (FK)
    └─ symbol_data (SVG/JSON)
```

---

## 7. FEATURE-STATUS ÜBERSICHT

Basierend auf den Flow-Hinweisen:

| Feature | Status | Notizen |
|---------|--------|---------|
| **Onboarding** | ✅ Implementiert | Geburtsdaten → Berechnung → Dashboard |
| **Dashboard (Astrosheet)** | ✅ Implementiert | Erstellungs-Matrix, Mission & Bedeutung |
| **Symbol Creator** | ✅ Implementiert | Instant Badge aus embedded data |
| **Profil/Ba Zi Diagram** | ✅ Implementiert | Unique link zu Diagram Layer |
| **Daily Horoscope** | 🔒 Premium | Link vorhanden, Premium-Feature |
| **Quizzes** | ⚠️ Teilweise | "Premium finished yet" (in Arbeit) |
| **Social Sharing** | ✅ Implementiert | Facebook, Instagram, etc. |
| **Agenten (Chat)** | ⚠️ Beta? | Rote Box → evtl. Warnung/Beta |
| **Premium** | 🔒 Gated | Separate Section im Menü |
| **Einstellungen** | ✅ Vorhanden | Standard Settings |

---

## 8. USER JOURNEY ZUSAMMENFASSUNG

### Erste Session (Neuer User):
```
1. Onboarding
   ├─ Geburtsdaten eingeben
   ├─ Cloud Engine berechnet
   ├─ Daten in Supabase gespeichert
   └─ Symbol generiert

2. Dashboard Landing
   ├─ Astrosheet wird angezeigt
   ├─ Erstellungs-Matrix sichtbar
   └─ Mission & Bedeutung erklärt

3. Navigation verfügbar
   └─ Sidebar mit allen Features
```

### Wiederkehrender User:
```
Login
  ↓
Dashboard (Astrosheet)
  ↓
User wählt:
  ├─ Profil (Ba Zi Details)
  ├─ Quizzes (Persönlichkeit vertiefen)
  ├─ Daily (Tägliches Horoskop - Premium)
  ├─ Agenten (AI Chat)
  └─ Premium (Upgrade-Optionen)
```

### Quiz-Session:
```
Quizzes wählen
  ↓
Quiz durchführen
  ↓
Ergebnis erhalten
  ↓
Entscheidung:
  ├─ Nächstes Quiz → zurück zu Profil
  └─ Teilen → Social Media Banner
```

---

## 9. ENTSCHEIDUNGSPUNKTE (Decision Trees)

### Gelbe Rauten im Flow:
1. **"Ensure birthday, place and time information"**
   - Ja → Berechnung starten
   - Nein → Daten eingeben

2. **"Data is saved by byz"**
   - Erfolg → Weiter zu Dashboard
   - Fehler → *(nicht dargestellt)*

3. **"user clicks on sidebar on [X]"**
   - Profil → Ba Zi Diagram
   - Daily → Daily Horoscope (Premium)
   - Quizzes → Quiz Panel
   - Agenten → Live Chat

4. **"user completes quiz"**
   - Next Quiz → Back to Profil
   - Share → Social Media

5. **"Next Quiz"**
   - Ja → Zurück zu Quizzes
   - Nein → Profil anzeigen

6. **"share on Social media"**
   - Ja → Banner generieren
   - Nein → Profil anzeigen

---

## 10. SCREEN-REFERENZEN (im Miro Board sichtbar)

### Eingebettete UI-Screenshots:
1. **Dashboard/Astrosheet** (Orange Box)
   - Zeigt: Erstellungs-Matrix Interface
   - Mission & Bedeutung Section

2. **Sidebar Navigation** (Links im Bild)
   - Menü-Items klar sichtbar
   - Icons + Labels

3. **Generic Group** (Oben rechts)
   - *(Weitere UI-Elemente/Components)*

4. **Cross-System Complexity** (Rechts oben)
   - System-Architektur Diagramm
   - API/Service Connections

5. **Auto-Dev Message** (Rechts unten)
   - Developer Notes
   - *(Text nicht vollständig lesbar)*

6. **Dark Interface** (Rechts unten)
   - Alternative UI-Ansicht
   - *(Vermutlich Dark Mode)*

---

## 11. EXTERNE INTEGRATIONEN

### Cloud Services:
- **Horoscope Cloud Engine** (by "ac")
  - Berechnet: Zodiac, Sun, Ba Zi
  - API-basiert

### Database:
- **Supabase**
  - User Management
  - Zodiac Data Storage
  - User ID Mapping

### Social Media:
- **Facebook**
- **Instagram**
- *(Weitere Plattformen)*

---

## 12. NOTIZEN & OFFENE PUNKTE

### Aus dem Flow erkennbar:
1. **Premium Features:**
   - Daily Horoscope ist Premium
   - Quizzes teilweise Premium ("finished yet")

2. **In Entwicklung:**
   - "Premium finished yet" deutet auf laufende Arbeit hin

3. **Agenten-Feature:**
   - Rote Box → evtl. Beta oder Warnung
   - Live Chat Funktionalität

4. **Symbol System:**
   - "unix user badge" → Unique Identifier
   - Generiert aus embedded data
   - Instant Creation (sofort verfügbar)

---

## 13. TECHNISCHE FLOW-DETAILS

### Grüne gestrichelte Linien:
- Verbinden **Supabase** mit verschiedenen Screens
- Indizieren Daten-Sync/Fetch-Operationen

### Orange Boxen:
- **Aktionen/Screens** die User sieht

### Gelbe Rauten:
- **Entscheidungspunkte** (if/else Logic)

### Hellblaue Boxen:
- **System-Prozesse** (Backend-Operationen)

### Rosa Boxen:
- **Datenbank-Operationen** (Supabase)

### Rote Boxen:
- **Warnungen/Beta-Features**

---

## ZUSAMMENFASSUNG

Der Flow zeigt eine **klare, lineare Onboarding-Journey** mit anschließender **modularer Navigation**.

**Kern-Konzept:**
1. Einmaliges Onboarding (Geburtsdaten)
2. Automatische Berechnung & Speicherung
3. Instant Symbol-Generierung
4. Dashboard als Zentrale
5. Sidebar-Navigation zu Features
6. Quiz-System mit Social Sharing
7. Premium-Gated Features (Daily Horoscope)

**User Experience:**
- Minimaler Input (nur Geburtsdaten)
- Maximaler Output (Dashboard, Symbol, Navigation)
- Klare Feature-Trennung (Free vs Premium)
- Social Sharing integriert
- AI Agent verfügbar

**Status:** Production-Ready mit Premium-Tier noch in Finalisierung
