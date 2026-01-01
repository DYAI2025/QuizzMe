# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server at http://localhost:3000
npm run build            # Production build (.next)
npm run build:static     # Static export (out/) - no API routes
npm run lint             # ESLint
npm run test             # Vitest tests
npm run test:watch       # Vitest in watch mode
npm run registry:lint    # Validate registry IDs in codebase
```

Run a single test file:
```bash
npx vitest run src/lib/traits/__tests__/trait-engine.test.ts
```

## Architecture

### Multi-Domain Routing
Middleware rewrites based on hostname:
- Hostname contains "horoskop"/"horoscope" → `/verticals/horoscope/*`
- Default → `/verticals/quiz/*`

### Core Data Flow

```
Quiz Answer → ContributionEvent → ingestContribution() → ProfileState → ProfileSnapshot (UI)
```

**Key modules:**
- `src/lib/ingestion/` - Entry point for processing quiz results
- `src/lib/lme/` - Lean Micro Experience (psyche dimension aggregation)
- `src/lib/traits/` - Two-layer trait system (baseScore + shiftZ)
- `src/lib/profile/` - State management and snapshots
- `src/lib/registry/` - Centralized ID definitions

### Two-Layer Trait System

Traits use logit-space math for saturation near edges:

```typescript
// Internal state
TraitState { baseScore: number, shiftZ: number }

// UI rendering (always use this)
uiScore(state) → 1-100 integer
```

**Anchor dominance**: Base scores (from astro) resist opposing evidence via `OPPOSITION_FACTOR` and asymmetric shift caps (`MAX_ALIGN_Z` vs `MAX_OPPOSE_Z`).

### Psyche Dimensions (LME)

Five dimensions with exponential moving averages:
- Each has `value`, `momentum`, `baseline`
- `updatePsycheState()` in `lme-core.ts` - sensitive math, read before modifying

### Registry System

All IDs follow namespaced patterns validated by `registry-lint`:
- `trait.{category}.{name}` - Personality sliders
- `marker.{quiz}.{dimension}` - Quiz answer mappings
- `tag.{category}.{name}` - Labels/badges
- `unlock.{type}.{name}` - Achievements
- `field.{block}.{name}` - Free-text content

Add new IDs to `src/lib/registry/` files. Run `npm run registry:lint` to validate.

### Astro System

`src/lib/astro/`:
- `compute.ts` - Sun sign, Chinese zodiac, ascendant/moon (if time/place known)
- `astronomy.ts` - Julian dates, planetary positions, ephemeris calculations
- `interpretations.ts` - Transit text generation

Uses vendored `cosmic-architecture-engine` for precision calculations.

## Quiz Development

### Adding a Quiz

1. Create component: `src/components/quizzes/[QuizName]Quiz.tsx`
2. Create data file: `src/components/quizzes/[quiz-name]/data.ts`
3. Add route: `src/app/verticals/quiz/[quiz-name]/page.tsx`
4. Use `QuizPageShell` wrapper for consistent layout
5. Register markers in `src/lib/registry/markers.ts`
6. Integrate via `ingestContribution()` for trait updates

### Quiz Data Pattern

```typescript
// data.ts
export const questions = [
  {
    id: "q1",
    text: "...",
    options: [
      { id: "a", text: "...", markers: { "marker.quiz.dimension": 0.8 } }
    ]
  }
];
```

## Path Alias

`@/*` → `src/*`

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## API Routes

Available when not using static export:
- `POST /api/contribute` - Submit quiz results
- `GET /api/profile/snapshot` - Get profile snapshot
- `POST /api/astro/compute` - Compute astrology data

## Testing

Tests live in `__tests__/` directories next to source files. Vitest with jsdom environment. Coverage thresholds: 80% statements/functions/lines, 75% branches.

```bash
npm run test              # Run all tests
npx vitest run [pattern]  # Run specific tests
```
