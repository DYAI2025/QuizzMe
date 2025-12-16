# Character Sheet v2 Implementation Plan

## Overview

Full integration of Registry + ContributionEvent + Character Sheet UI for the multi-vertical quiz/horoscope platform.

**Branch:** `feature/character-sheet-v2`
**Approach:** Vertical Slice First (Option C from brainstorm)

---

## Phase 1: Registry Foundation

### Task 1.1: Create Registry Type Definitions
**File:** `src/lib/registry/types.ts`

```typescript
// Core registry types
export type TraitDefinition = {
  id: string;                    // trait.*
  category: string;              // values, social, love, lifestyle, etc.
  label: string;                 // German display name
  description?: string;
  anchorable: boolean;           // Can receive baseScore from astro?
  min: 1;
  max: 100;
};

export type MarkerDefinition = {
  id: string;                    // marker.*
  dimension: string;             // LME dimension it maps to
  label: string;
  sign: 1 | -1;                  // Direction of effect
};

export type TagDefinition = {
  id: string;                    // tag.*
  kind: "archetype" | "shadow" | "style" | "astro" | "interest" | "misc";
  label: string;
};

export type UnlockDefinition = {
  id: string;                    // unlock.*
  category: "sigils" | "crests" | "badges" | "sheets";
  label: string;
  rarity: 1 | 2 | 3;
  iconPath?: string;
};

export type FieldDefinition = {
  id: string;                    // field.*
  kind: "text" | "bullets" | "enum";
  label: string;
  maxLength?: number;
};
```

### Task 1.2: Create Trait Registry
**File:** `src/lib/registry/traits.ts`

Define ~50 traits organized by category:
- `trait.values.*` (5 core value traits)
- `trait.social.*` (introversion, battery, dominance, etc.)
- `trait.love.*` (attention_need, independence, etc.)
- `trait.lifestyle.*` (morning_person, spontaneity, etc.)
- `trait.skills.*` (intellect, language, math, focus, curiosity)
- `trait.eq.*` (self_awareness, self_regulation, empathy, motivation, social_skill)
- `trait.aura.*` (warmth, authority, mystery)
- `trait.cognition.*` (system_vs_story)
- `trait.interest.*` (top interests)
- `trait.motivation.*` (achievement, affiliation, power)

### Task 1.3: Create Marker Registry
**File:** `src/lib/registry/markers.ts`

Define ~30 markers mapping to LME dimensions:
- `marker.social.*` (extroversion, dominance)
- `marker.eq.*` (self_awareness, self_regulation, empathy, motivation, social_skill)
- `marker.cognition.*` (system_thinking, narrative_thinking)
- `marker.values.*` (security, autonomy, achievement)
- `marker.astro.*` (element.fire/earth/air/water, modality.cardinal/fixed/mutable)

**Important:** Marker weights are [0, 1] with separate sign field.

### Task 1.4: Create Tag Registry
**File:** `src/lib/registry/tags.ts`

Define tags by kind:
- Archetype tags: `tag.archetype.*` (trickster, sage, hero, etc.)
- Shadow tags: `tag.shadow.*` (jealousy, overthinking, impatience)
- Style tags: `tag.style.*` (humor.dry, humor.observational, deep_talk)
- Astro tags: `tag.astro.*` (aries..pisces, rat..pig)
- Interest tags: `tag.interest.*`

### Task 1.5: Create Unlock Registry
**File:** `src/lib/registry/unlocks.ts`

Define unlockable items:
- Zodiac sigils: `unlock.sigils.zodiac_*` (12 signs)
- Chinese badges: `unlock.badges.chinese_*` (12 animals)
- Quiz crests: `unlock.crests.*` (one per quiz)

### Task 1.6: Create Field Registry
**File:** `src/lib/registry/fields.ts`

Define free-text fields:
- `field.values.alive_when`
- `field.love.repair_ritual`
- `field.love.boundaries`
- `field.lifestyle.ideal_day`
- `field.meta.green_flags`
- `field.meta.red_flags`

### Task 1.7: Create Registry Index & Validators
**File:** `src/lib/registry/index.ts`

```typescript
export * from './types';
export * from './traits';
export * from './markers';
export * from './tags';
export * from './unlocks';
export * from './fields';

// Validator functions
export function isValidTraitId(id: string): boolean;
export function isValidMarkerId(id: string): boolean;
export function isValidTagId(id: string): boolean;
export function isValidUnlockId(id: string): boolean;
export function isValidFieldId(id: string): boolean;
```

### Task 1.8: Create registry-lint Script
**File:** `scripts/registry-lint.ts`

Scans codebase for invalid IDs:
1. Glob `src/**/*.{ts,tsx,json}`
2. Regex for `trait\.\w+\.\w+`, `marker\.\w+\.\w+`, etc.
3. Check each against registry
4. Report unknown IDs
5. Exit 1 if any found (unless in allowlist)

---

## Phase 2: Two-Layer Trait System

### Task 2.1: Create TraitState Type
**File:** `src/lib/lme/trait-state.ts`

```typescript
export type TraitState = {
  traitId: string;
  baseScore: number;     // 1..100, stable anchor from astro
  shiftZ: number;        // dynamic offset in logit space
  shiftStrength: number; // accumulated evidence weight
  updatedAt: string;     // ISO timestamp
};

export type TraitStateMap = Record<string, TraitState>;
```

### Task 2.2: Implement Score <-> Logit Math
**File:** `src/lib/lme/trait-math.ts`

```typescript
export function scoreToP(score: number): number;
export function pToScore(p: number): number;
export function logit(p: number, eps?: number): number;
export function sigmoid(z: number): number;
export function finalScore(state: TraitState): number;
export function clampShift(baseZ: number, shiftZ: number): number;
export function extremenessWeight(score: number, gamma?: number): number;
```

### Task 2.3: Implement Quiz Update Logic
**File:** `src/lib/lme/trait-update.ts`

```typescript
export type Tier = "CORE" | "GROWTH" | "FLAVOR";

export const TIER_Z_GAIN: Record<Tier, number> = {
  CORE: 0.70,
  GROWTH: 0.35,
  FLAVOR: 0.12,
};

export function applyQuizToTrait(
  state: TraitState,
  tier: Tier,
  evidence: number,     // [-1..+1]
  confidence: number,   // [0..1]
  occurredAt: string
): TraitState;
```

---

## Phase 3: ContributionEvent Pipeline

### Task 3.1: Create ContributionEvent Types
**File:** `src/lib/contribution/types.ts`

Implement full ContributionEvent schema from spec:
- Marker, TraitScore, Tag, Unlock, AstroPayload
- ContributionEvent with all required/optional fields

### Task 3.2: Create Event Validator
**File:** `src/lib/contribution/validator.ts`

```typescript
export function validateContributionEvent(event: unknown): {
  valid: boolean;
  errors: string[];
};
```

Validates:
- Required fields present
- IDs exist in registry
- Weights in valid range
- Scores 1-100

### Task 3.3: Create Ingestion Pipeline
**File:** `src/lib/contribution/ingestion.ts`

```typescript
export function ingestContribution(event: ContributionEvent): {
  accepted: boolean;
  profileSnapshot: ProfileSnapshot;
  errors?: string[];
};
```

Steps:
1. Validate schema
2. Persist event to history
3. Apply markers to LME (dimensionDeltas → smoothing → PsycheState)
4. Merge traits/tags/unlocks/astro/fields into ProfileSnapshot
5. Compute completion metrics
6. Return updated ProfileSnapshot

### Task 3.4: Implement Merge Rules
**File:** `src/lib/contribution/merge.ts`

```typescript
export function mergeTrait(existing: TraitScore | undefined, incoming: TraitScore): TraitScore;
export function mergeTag(existing: Tag[], incoming: Tag[]): Tag[];
export function mergeUnlock(existing: Unlock | undefined, incoming: Unlock): Unlock;
export function mergeAstro(existing: AstroPayload | undefined, incoming: AstroPayload): AstroPayload;
export function mergeField(existing: Field | undefined, incoming: Field): Field;
```

---

## Phase 4: ProfileSnapshot & Storage

### Task 4.1: Create ProfileSnapshot Type
**File:** `src/lib/profile/types.ts`

```typescript
export type ProfileSnapshot = {
  psyche: {
    state: PsycheState;
    archetypeMix: Array<{ id: string; score: number }>;
    visualAxes: Record<string, number>;
    avatarParams: Record<string, number | string>;
  };
  identity: {
    displayName?: string;
    birth?: { date?: string; time?: string; place?: string };
  };
  astro?: AstroPayload;
  traits: Record<string, TraitState>;
  tags: Tag[];
  unlocks: Record<string, Unlock>;
  fields: Record<string, Field>;
  meta: {
    completion: {
      percent: number;
      filledBlocks: string[];
      unlockCount: number;
    };
    lastUpdatedAt: string;
  };
};
```

### Task 4.2: Create Profile Storage
**File:** `src/lib/profile/storage.ts`

```typescript
export function loadProfile(): ProfileSnapshot;
export function saveProfile(profile: ProfileSnapshot): void;
export function clearProfile(): void;
```

### Task 4.3: Create useProfile Hook
**File:** `src/hooks/useProfile.ts`

```typescript
export function useProfile(): {
  profile: ProfileSnapshot;
  ingest: (event: ContributionEvent) => void;
  reset: () => void;
  isLoading: boolean;
};
```

---

## Phase 5: Astro Onboarding Module

### Task 5.1: Create Birth Data Input UI
**File:** `src/components/onboarding/AstroOnboarding.tsx`

Multi-step flow:
1. Birth date (required)
2. Birth time (optional, with "I don't know" option)
3. Birth place (optional, with autocomplete)

Design: Dark cosmic theme, progressive disclosure.

### Task 5.2: Create Astro Calculator
**File:** `src/lib/astro/calculator.ts`

```typescript
export function calculateWesternAstro(
  date: Date,
  time?: string,
  place?: { lat: number; lng: number }
): WesternAstro;

export function calculateChineseAstro(date: Date): ChineseAstro;
```

For MVP, use lookup tables (no ephemeris library).

### Task 5.3: Create Astro → baseScore Mapper
**File:** `src/lib/astro/base-score-mapper.ts`

```typescript
export function calculateBaseScores(
  western: WesternAstro,
  chinese: ChineseAstro
): Record<string, number>;
```

Maps zodiac attributes to trait baseScores for anchorable traits.

### Task 5.4: Create Astro Onboarding Event Emitter
**File:** `src/lib/astro/emit-contribution.ts`

Emits ContributionEvent with:
- `source.vertical: "character"`
- `source.moduleId: "onboarding.astro.v1"`
- `payload.markers`: FLAVOR tier astro markers (weight 0.05-0.15)
- `payload.astro`: Full western/chinese data
- `payload.unlocks`: Zodiac sigil + Chinese badge
- `payload.tags`: Astro tags

**Note:** baseScores are NOT in the event; ingestion special-cases `onboarding.astro.v1` to initialize TraitState.baseScore directly.

### Task 5.5: Create Onboarding Route
**File:** `src/app/verticals/quiz/onboarding/page.tsx`

Renders AstroOnboarding component.

---

## Phase 6: Character Sheet UI

### Task 6.1: Create Zodiac Wheel Component
**File:** `src/components/character/ZodiacWheel.tsx`

Features:
- Circular arrangement of 12 zodiac signs
- Current sun sign prominently highlighted
- Ascendant/Descendant indicators (if known)
- Animation on load

### Task 6.2: Create Crest Display Components
**File:** `src/components/character/CrestedHeader.tsx`

Shows unlocked crests/sigils:
- Western zodiac (Astrowappen)
- Chinese zodiac
- Shamanic runes (if applicable)
- Quiz achievement crests

### Task 6.3: Create Trait Slider Component
**File:** `src/components/character/TraitSlider.tsx`

Features:
- Visual 1-100 slider
- 5-band color coding (low/midlow/mid/midhigh/high)
- baseScore indicator (stable anchor mark)
- finalScore display (current position)
- Hover tooltip with trait description

### Task 6.4: Create Character Sheet Sections
**File:** `src/components/character/sections/*.tsx`

One component per block (A-K from spec):
- `HeaderSection.tsx` (A)
- `AstroSection.tsx` (B) - with tabs for Western/Chinese/Addons
- `ValuesSection.tsx` (C)
- `PersonalitySection.tsx` (D)
- `RelationshipSection.tsx` (E)
- `LifestyleSection.tsx` (F)
- `InterestsSection.tsx` (G)
- `CognitionSection.tsx` (H)
- `EmotionSection.tsx` (I)
- `CharmSection.tsx` (J)
- `MetaSection.tsx` (K)

### Task 6.5: Create Main Character Sheet Page
**File:** `src/app/character/page.tsx`

Composes all sections, reads from ProfileSnapshot.

### Task 6.6: Create Completion Progress UI
**File:** `src/components/character/CompletionProgress.tsx`

Shows:
- Overall completion percentage
- Filled vs unfilled blocks
- Suggested next quiz to fill gaps

---

## Phase 7: Quiz Refactoring

### Task 7.1: Update PersonalityQuiz LME Integration
**File:** `src/components/quizzes/PersonalityQuiz.tsx`

- Update to emit spec-compliant ContributionEvent
- Use registry IDs for markers/traits/tags
- Set tier to CORE

### Task 7.2: Update RpgIdentityQuiz LME Integration
**File:** `src/components/quizzes/RpgIdentityQuiz.tsx`

- Update to emit spec-compliant ContributionEvent
- Use registry IDs
- Set tier to GROWTH

### Task 7.3: Update DestinyQuiz for Horoscope Integration
**File:** `src/components/quizzes/DestinyQuiz.tsx`

- Update to emit spec-compliant ContributionEvent
- Set tier to FLAVOR (low-weight markers)
- Include astro payload if applicable

### Task 7.4: Preserve Working Quiz Designs
Do NOT modify visual design of:
- LoveLanguagesQuiz
- SocialRoleQuiz
- CelebritySoulmateQuiz

Only update their LME integration if broken.

---

## Phase 8: Testing & Validation

### Task 8.1: Create Registry Lint CI Check
Add to build pipeline:
```bash
npm run lint:registry
```

### Task 8.2: Create Trait Math Unit Tests
**File:** `src/lib/lme/__tests__/trait-math.test.ts`

Test edge cases:
- Score near 1 and 100
- Opposing vs aligning evidence
- Tier weight differences

### Task 8.3: Create ContributionEvent Validation Tests
**File:** `src/lib/contribution/__tests__/validator.test.ts`

### Task 8.4: End-to-End Flow Test
Manual test flow:
1. Complete Astro Onboarding
2. Complete PersonalityQuiz
3. Verify Character Sheet displays merged data
4. Verify traits show baseScore anchor + quiz shift

---

## Dependency Graph

```
Phase 1 (Registry) ──┬──> Phase 3 (ContributionEvent)
                     │
Phase 2 (Trait Math) ┴──> Phase 4 (ProfileSnapshot)
                              │
                              v
              Phase 5 (Astro Onboarding) ──> Phase 6 (Character Sheet UI)
                              │
                              v
                     Phase 7 (Quiz Refactoring)
                              │
                              v
                     Phase 8 (Testing)
```

---

## Verification Checklist

Before marking complete:

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npm run lint:registry` passes (once created)
- [ ] Astro Onboarding flow works end-to-end
- [ ] Character Sheet renders with real data
- [ ] At least one quiz (PersonalityQuiz) emits valid ContributionEvent
- [ ] ProfileSnapshot persists to localStorage correctly
- [ ] Trait sliders show baseScore anchor mark
