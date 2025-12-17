# QuizzMe

## 📖 Projektübersicht

**QuizzMe** ist eine moderne Web‑Applikation, die interaktive Persönlichkeit‑ und Horoskop‑Quizze anbietet. Das Projekt nutzt **Next.js 14**, **React**, **TypeScript** und **Tailwind CSS** und unterstützt mehrere Domains (Quiz‑ und Horoskop‑Vertikale) über ein zentrales Middleware‑Routing.

Die aktuelle Version (1.2) enthält:
- Ein überarbeitetes **Altar‑Dashboard** mit modularen Action‑Tiles und einer dynamischen **Zodiac Shield**‑Komponente.
- Mehrere neue Design‑Assets (Icons, Hintergrundgrafiken) im `public/assets`‑Verzeichnis.
- Integration von Supabase für persistente Benutzerdaten (Psyche‑Profile, Geräte‑IDs).
- Vollständige **Static‑Site‑Generation** (`output: 'export'`) für einfache Bereitstellung auf GitHub Pages oder Vercel.

---

## 🛠️ Installation & Setup

### Voraussetzungen
- **Node.js** (v20 oder neuer) und **npm**
- **Git**
- (Optional) **Docker** für containerisierte Entwicklung

### Schritte
1. **Repository klonen**
   ```bash
   git clone https://github.com/DYAI2025/QuizzMe.git
   cd QuizzMe
   ```
2. **Abhängigkeiten installieren**
   ```bash
   npm ci   # reproduzierbare Installation
   ```
3. **Umgebungsvariablen konfigurieren**
   - Kopiere die Beispiel‑Datei und füge deine Supabase‑Credentials ein:
   ```bash
   cp .env.example .env.local
   # edit .env.local
   ```
   - Benötigte Variablen:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Entwicklungs‑Server starten**
   ```bash
   npm run dev
   ```
   Die Anwendung ist dann unter `http://localhost:3000` erreichbar.
5. **Build & Export (für Produktion)**
   ```bash
   npm run build   # erzeugt .next & static files
   npm run export  # legt das statische `out/`‑Verzeichnis an
   ```
   Das Ergebnis kann auf jedem statischen Host deployed werden.

---

## 🚀 Funktionsumfang (aktuell)
- **Altar‑Dashboard** mit:
  - `ActionSidebar`, `DashboardGrid`, `ProfileSpine`
  - Dynamische **ZodiacShield**‑Komponente, die je nach Nutzer‑Zodiac ein Bild aus `public/assets/shields` anzeigt.
- **Quiz‑Vertikale** (`/quiz/*`) mit modularen Komponenten, z. B. `RPG‑Identity`‑Quiz.
- **Character‑Vertikale** (`/character/*`) für die Anzeige von Psyche‑Profilen.
- **Supabase‑Backend** für:
  - Persistente Speicherung von Nutzer‑Profilen
  - Geräte‑ID‑basiertes Anonym‑Login
- **Middleware** (`src/middleware.ts`) leitet Anfragen anhand des Hostnamens zu den jeweiligen Vertikalen weiter.
- **Design‑Assets** (Icons, Hintergrundbilder) im `public/assets`‑Ordner, bereit für weitere Erweiterungen.

---

## 📈 Aktueller Entwicklungsstand
| Bereich | Status |
|---------|--------|
| UI / Dashboard | ✅ Fertig (Altar‑Layout, Action‑Tiles, Zodiac‑Shield) |
| Quiz‑Komponenten | ✅ Grundlegende Komponenten, weitere Designs in Arbeit |
| Supabase‑Integration | ✅ Grundlegende CRUD‑Operationen, RLS‑Policies werden noch verfeinert |
| CI / Linting | ✅ ESLint, Prettier, Vitest‑Tests laufen |
| Deployment | ✅ GitHub‑Pages‑Export, Vercel‑Ready |

---

## 🗓️ Geplante Integrationen & Roadmap
1. **Erweiterte Quiz‑Designs** – neue „Modern Alchemy“‑Layouts für alle Quiz‑Typen.
2. **Realtime‑Updates** – Supabase‑Realtime für sofortige Synchronisation von Psyche‑Profilen.
3. **Benutzer‑Authentifizierung** – optionales OAuth‑Login (Google, GitHub) neben dem Geräte‑ID‑Login.
4. **Internationalisierung (i18n)** – Unterstützung für Deutsch, Englisch und weitere Sprachen.
5. **Progressive Web App (PWA)** – Offline‑Funktionalität und Installierbarkeit auf Mobilgeräten.
6. **Erweiterte Analytik** – Tracking von Quiz‑Ergebnissen und Nutzer‑Engagement via Supabase‑Analytics.
7. **Theming‑Engine** – dynamische Themen (z. B. Dark‑Mode, Light‑Grimoire) mit Tailwind‑CSS‑Variablen.

---

## 🤝 Beitrag leisten
Beiträge sind herzlich willkommen! Bitte folge diesen Schritten:
1. Fork das Repository.
2. Erstelle einen Feature‑Branch (`git checkout -b feature/mein‑feature`).
3. Schreibe Tests und halte dich an das bestehende Lint‑Setup.
4. Öffne einen Pull‑Request mit einer klaren Beschreibung.

---

## 📜 Lizenz
Dieses Projekt ist unter der **MIT License** lizenziert – siehe die Datei `LICENSE` für Details.

---

*Letzte Aktualisierung: 17. Dezember 2025*
