# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multi-vertical quiz and horoscope platform built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. The platform serves two main verticals (Quiz and Horoscope) through domain-based routing, with a shared codebase and config-driven architecture.

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Building & Testing
- The project uses static export (`output: 'export'` in next.config.ts)
- Build output goes to `/platform-app/out/`
- No server-side rendering; all pages are statically generated

## Architecture

### Multi-Domain Strategy
The platform uses Next.js middleware (`src/middleware.ts`) to route requests based on hostname:
- Requests to domains containing "horoskop" or "horoscope" → `/verticals/horoscope`
- All other requests → `/verticals/quiz` (default)
- Middleware rewrites URLs without redirects to maintain clean paths

### Directory Structure
```
platform-app/src/
├── app/                          # Next.js App Router pages
│   ├── verticals/               # Domain-routed verticals
│   │   ├── quiz/                # Quiz vertical pages
│   │   │   ├── [slug]/          # Individual quiz routes
│   │   │   └── page.tsx         # Quiz landing
│   │   └── horoscope/           # Horoscope vertical pages
│   │       ├── [sign]/          # Zodiac sign detail pages
│   │       └── quiz/destiny/    # Destiny quiz integration
│   ├── profile/                 # User profile aggregation
│   └── page.tsx                 # Main landing (vertical selector)
├── components/
│   ├── quizzes/                 # Quiz implementations
│   │   ├── QuizPageShell.tsx    # Shared quiz wrapper
│   │   └── [QuizName]Quiz.tsx   # Individual quiz components
│   ├── avatar/                  # Avatar rendering
│   └── home/                    # Homepage components
└── lib/
    └── lme/                     # "LME/DUBA" - Longitudinal Marker Engine
        ├── lme-core.ts          # Core aggregation logic
        ├── psyche-state.ts      # User psyche state model
        ├── psyche-dimensions.ts # Dimension definitions
        ├── marker-aggregator.ts # Quiz result → marker mapping
        ├── archetypes.ts        # Archetype definitions
        ├── archetype-mix.ts     # Multi-archetype composition
        ├── avatar-mapper.ts     # Avatar visual generation
        └── storage.ts           # LocalStorage persistence
```

### LME/DUBA System (Longitudinal Marker Engine)
The `/lib/lme/` directory implements a sophisticated psychometric aggregation system:

**Purpose**: Aggregate results from multiple quizzes over time to build a comprehensive psychological profile

**Key Concepts**:
1. **Psyche Dimensions**: Core personality dimensions (see `psyche-dimensions.ts`) each with:
   - `value`: Current state (0-1)
   - `momentum`: Rate of change trend
   - `baseline`: Long-term anchor point

2. **Marker System**: Each quiz produces "markers" that map to psyche dimensions
   - Quiz results → marker scores → dimension updates
   - Uses exponential moving averages for smooth integration
   - Reliability weighting per quiz type

3. **Archetype Mix**: Combines multiple archetypes with proportions
   - Primary/secondary archetype selection
   - Visual avatar generation based on archetype mix
   - Stored in localStorage for persistence

**Data Flow**:
```
Quiz Completion → Marker Scores → updatePsycheState() → Archetype Calculation → Avatar Update → localStorage
```

### Quiz Architecture
Quizzes follow two patterns:

1. **Quick-Launch Pattern** (current implementation):
   - Self-contained JSX/TSX components
   - Embedded in `QuizPageShell` for consistent layout
   - Direct routing via `/verticals/quiz/[slug]`

2. **Config-Driven Pattern** (planned):
   - JSON-based quiz definitions
   - Generic quiz engine
   - Content-team editable without code changes

Current quizzes:
- `LoveLanguagesQuiz`: Love language assessment
- `SocialRoleQuiz`: Social archetype identification
- `RpgIdentityQuiz`: RPG character class mapping
- `PersonalityQuiz`: General personality traits
- `CelebritySoulmateQuiz`: Celebrity compatibility
- `DestinyQuiz`: Horoscope integration quiz

### Horoscope Vertical
- 12 zodiac signs with detail pages
- Integration with destiny quiz for sign recommendations
- Config-first approach (planned for sign content)

## Key Implementation Details

### Styling
- Tailwind CSS 4 with dark theme (slate-950 background)
- Gradient effects for visual hierarchy
- Responsive design with mobile-first approach
- Custom animations via Tailwind utilities

### State Management
- Client-side only (localStorage for persistence)
- No server-side state or database
- React hooks for component state
- LME system maintains cross-quiz state

### Path Aliasing
- `@/*` maps to `src/*` (defined in tsconfig.json)
- Use absolute imports: `import { X } from '@/lib/lme/...'`

### Vertical Branding
Currently handled via middleware routing. Planned enhancement: theme/branding config per vertical domain.

## Development Guidelines

### Adding New Quizzes
1. Create quiz component in `src/components/quizzes/[QuizName]Quiz.tsx`
2. Add route at `src/app/verticals/quiz/[slug]/page.tsx`
3. Wrap in `QuizPageShell` for consistent layout
4. Define marker mappings if integrating with LME system
5. Ensure responsive design and accessibility

### Working with LME
- Study `lme-core.ts` for aggregation logic before modifying
- Dimension IDs are defined in `psyche-dimensions.ts`
- Use `updatePsycheState()` to integrate new quiz results
- Test dimension updates with known marker combinations
- Archetypes are defined with scoring thresholds in `archetypes.ts`

### Config System (Future)
Per the implementation strategy document (`Implementierungsstrategie.md`):
- Quiz config schema will support questions, answers, scoring
- Horoscope config will define signs, attributes, content
- Content pipeline enables non-developer quiz creation
- Maintain backward compatibility with quick-launch URLs

## Important Notes

- This is a static site (no SSR/API routes)
- All data persistence uses localStorage (client-side only)
- Multi-domain support requires proper DNS/hosting configuration
- The codebase intentionally avoids over-engineering per project constraints
- German implementation strategy doc provides detailed roadmap
