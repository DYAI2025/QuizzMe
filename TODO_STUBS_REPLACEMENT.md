# TODO Liste zur Entfernung von Platzhaltern (stubs2B-rm.md)

Diese Liste priorisiert die Aufgaben aus `stubs2B-rm.md` für die nächsten Sprints.

## 🔴 KRITISCH (Blockiert Features)
- [ ] **1.1 Horoscope Daily Transits Implementieren**
  - *Datei:* `src/lib/astro/compute.ts`
  - *Aufgabe:* `calculateDailyTransits` Funktion vollständig implementieren. Ephemeriden-Daten oder präzise Berechnung integrieren.
- [ ] **1.2 E2E Playwright Tests Aufsetzen**
  - *Datei:* `e2e/` (Setup & Config)
  - *Aufgabe:* `playwright` installieren, `playwright.config.ts` erstellen, CI Pipeline einrichten.
  - *Status:* Test-Skelett erstellt in `e2e/user-journey.spec.ts`.
- [ ] **1.3 Deprecated Code Löschen**
  - *Datei:* `DEPRECATED.md` und referenzierte Dateien.
  - *Aufgabe:* Alle Dateien löschen, die als DEPRECATED markiert sind (alte Quiz-Files).

## 🟡 WICHTIG (Feature Completion)
- [ ] **2.1 DST Fold Handling (Onboarding)**
  - *Datei:* `src/app/onboarding/astro/page.tsx`
  - *Aufgabe:* Modal für "Fall Back" Zeitumstellung bauen (Standard vs Daylight Time Auswahl).
- [ ] **2.2 Social Sharing System**
  - *Dateien:* `src/components/quiz/ShareButton.tsx`, `api/share/image`
  - *Aufgabe:* Image-Generation API und Share-Links implementieren.
- [ ] **2.3 Party Quiz Scoring Fix**
  - *Datei:* `src/components/quizzes/PartyQuiz.tsx`
  - *Aufgabe:* Scoring-Logik in `data.ts` zentralisieren und "HACK" entfernen.
- [ ] **2.4 API Implementation Lücken füllen**
  - *Datei:* `Implementation_API.md`
  - *Aufgabe:* Fingerprinting, Timezone Checks und Validation implementieren.

## 🟢 NIEDRIG (Cleanup & Polish)
- [ ] **3.1 Mock Data Ersetzen**
  - *Datei:* `src/test/mocks/psyche-profiles.ts`, `IdentityBadges.tsx`
  - *Aufgabe:* Echte Data-Hooks verwenden / "Not Available" State anzeigen statt Mock-Daten.
- [ ] **3.2 UI Visuals Aktualisieren**
  - *Datei:* `AlchemyCard.tsx`, `ProfileSpine.tsx`
  - *Aufgabe:* Finale Assets (SVGs) vom Design-Team einbauen.
- [ ] **3.3 i18n Vorbereitung**
  - *Aufgabe:* Hardcoded Strings in Translation Files extrahieren (falls i18n gewünscht in Phase >5).
- [ ] **3.4 Skipped Tests Fixen**
  - *Datei:* `SocialRoleQuiz.test.tsx`
  - *Aufgabe:* Fake Timers Problematik lösen und Test aktivieren.
