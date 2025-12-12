# Cosmic Quiz Symbols v2 - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Redesign all 6 quiz symbols with cosmic energy aesthetic, stronger glows, and multiple detail layers based on reference images (DNA helix, heart nebula, astro wheel, lightning bolt).

**Architecture:** SVG-based symbols with layered structure (base shape → inner details → outer glow → energy effects). CSS custom properties for glow intensity. Each symbol 3-5x more complex than v1 with inner textures and stronger color presence.

**Tech Stack:** SVG, CSS custom properties, CSS filters (drop-shadow, blur), HTML preview pages

---

## Design Requirements from Reference Analysis

**Reference 1 - DNA Helix (dna3.jpeg):**
- Multi-segment structure with cross-connections
- Blue-to-violet gradient glow
- Multiple detail layers (outer helix + inner segments)
- Strong luminosity

**Reference 2 - Heart Nebula (herz3.jpeg):**
- Massive intense red-pink glow dominates
- Inner texture/structure (not just outline)
- Filled energetic core
- Very saturated color

**Reference 3 - Astro Wheel (kreissymbol.jpeg):**
- Central spiral galaxy energy source
- Multiple concentric circles with radiating beams
- 12 precise symbols around perimeter
- Geometric complexity with fine details

**Reference 4 - Lightning Bolt (blitz2.jpeg):**
- Branching electric structure
- Dynamic energy paths
- Intense orange-yellow glow
- Movement and power

**Common Patterns:**
- 3-5 detail layers per symbol
- Glows are 3-4x stronger than v1
- Inner complexity (textures, segments, fills)
- Cosmic/energy feeling throughout

---

## Task 1: Update CSS Design Tokens for Stronger Glows

**Files:**
- Modify: `design-assets/quiz-design-tokens.css`

**Step 1: Increase glow intensity values**

Update opacity and blur values:

```css
:root {
  /* OLD v1 values - too weak */
  /* --glow-opacity-subtle: 0.4; */
  /* --glow-blur-subtle: 8px; */

  /* NEW v2 values - 3-4x stronger */
  --glow-opacity-subtle: 0.7;
  --glow-opacity-medium: 0.85;
  --glow-opacity-strong: 0.95;

  --glow-blur-subtle: 12px;
  --glow-blur-medium: 20px;
  --glow-blur-strong: 32px;
  --glow-blur-extra: 48px;

  /* Multi-layer glow system */
  --glow-layers-inner: 0 0 8px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 1);
  --glow-layers-mid: 0 0 20px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.8);
  --glow-layers-outer: 0 0 40px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.5);
  --glow-layers-ambient: 0 0 60px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.3);
}
```

**Step 2: Add layered glow utilities**

```css
/* 4-layer cosmic glow */
--glow-cosmic:
  var(--glow-layers-inner),
  var(--glow-layers-mid),
  var(--glow-layers-outer),
  var(--glow-layers-ambient);

/* Intense center glow for filled elements */
--glow-core:
  0 0 4px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 1),
  0 0 12px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.9),
  0 0 24px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.7);
```

**Step 3: Verify CSS syntax**

Run: Open `design-assets/simple-preview.html` in browser
Expected: No CSS errors, stronger glows visible on existing symbols

**Step 4: Commit**

```bash
git add design-assets/quiz-design-tokens.css
git commit -m "feat: increase glow intensity 3-4x for cosmic aesthetic"
```

---

## Task 2: Love Languages Symbol v2 - Cosmic Heart Nebula

**Files:**
- Create: `design-assets/v2/love-languages-symbol-v2.svg`
- Reference: `herz3.jpeg` (heart nebula)

**Design Spec:**
- Filled heart core with nebula-like texture
- Multiple glow layers (inner bright → outer soft)
- Energy waves radiating outward
- Rosa-Gold color (255, 200, 150) at maximum intensity

**Step 1: Create base heart shape with filled gradient**

```svg
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Radial gradient for nebula core -->
    <radialGradient id="heart-nebula-core" cx="50%" cy="45%">
      <stop offset="0%" stop-color="rgb(255, 230, 200)" stop-opacity="1"/>
      <stop offset="40%" stop-color="rgb(255, 200, 150)" stop-opacity="0.9"/>
      <stop offset="80%" stop-color="rgb(255, 170, 120)" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="rgb(255, 140, 100)" stop-opacity="0.2"/>
    </radialGradient>

    <!-- Texture overlay -->
    <filter id="nebula-texture">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="5"/>
      <feColorMatrix type="saturate" values="0.3"/>
      <feBlend in="SourceGraphic" mode="overlay"/>
    </filter>
  </defs>

  <!-- Background glow ambient layer -->
  <ellipse cx="64" cy="64" rx="55" ry="52"
           fill="rgba(255, 200, 150, 0.15)"
           filter="blur(30px)"/>

  <!-- Main heart shape - filled with nebula -->
  <path id="heart-main"
        d="M64 108 L36 76 Q24 64 24 48 Q24 32 36 32 Q48 32 64 44 Q80 32 92 32 Q104 32 104 48 Q104 64 92 76 Z"
        fill="url(#heart-nebula-core)"
        filter="url(#nebula-texture)"
        style="filter: drop-shadow(0 0 8px rgba(255, 200, 150, 1))
                        drop-shadow(0 0 20px rgba(255, 200, 150, 0.8))
                        drop-shadow(0 0 40px rgba(255, 200, 150, 0.5));"/>
</svg>
```

**Step 2: Add bright outline rim**

Add after heart-main:

```svg
<!-- Bright rim outline -->
<path d="M64 108 L36 76 Q24 64 24 48 Q24 32 36 32 Q48 32 64 44 Q80 32 92 32 Q104 32 104 48 Q104 64 92 76 Z"
      fill="none"
      stroke="rgb(255, 240, 220)"
      stroke-width="2.5"
      opacity="0.9"
      style="filter: drop-shadow(0 0 4px rgba(255, 240, 220, 1))
                      drop-shadow(0 0 12px rgba(255, 200, 150, 0.9));"/>
```

**Step 3: Add energy waves radiating outward**

```svg
<!-- Energy wave 1 - outer -->
<path d="M64 115 Q28 98 16 68"
      fill="none"
      stroke="rgba(255, 200, 150, 0.4)"
      stroke-width="1.5"
      stroke-linecap="round"
      style="filter: drop-shadow(0 0 8px rgba(255, 200, 150, 0.6));"/>

<path d="M64 115 Q100 98 112 68"
      fill="none"
      stroke="rgba(255, 200, 150, 0.4)"
      stroke-width="1.5"
      stroke-linecap="round"
      style="filter: drop-shadow(0 0 8px rgba(255, 200, 150, 0.6));"/>

<!-- Energy wave 2 - middle -->
<path d="M64 110 Q32 95 20 72"
      fill="none"
      stroke="rgba(255, 200, 150, 0.5)"
      stroke-width="1.2"
      stroke-linecap="round"
      style="filter: drop-shadow(0 0 6px rgba(255, 200, 150, 0.7));"/>

<path d="M64 110 Q96 95 108 72"
      fill="none"
      stroke="rgba(255, 200, 150, 0.5)"
      stroke-width="1.2"
      stroke-linecap="round"
      style="filter: drop-shadow(0 0 6px rgba(255, 200, 150, 0.7));"/>

<!-- Inner energy sparks (small bright points) -->
<circle cx="64" cy="40" r="2.5"
        fill="rgb(255, 240, 220)"
        opacity="0.95"
        style="filter: drop-shadow(0 0 6px rgba(255, 240, 220, 1));"/>

<circle cx="52" cy="52" r="1.8"
        fill="rgb(255, 220, 200)"
        opacity="0.85"
        style="filter: drop-shadow(0 0 4px rgba(255, 220, 200, 0.9));"/>

<circle cx="76" cy="58" r="2"
        fill="rgb(255, 230, 210)"
        opacity="0.9"
        style="filter: drop-shadow(0 0 5px rgba(255, 230, 210, 1));"/>
```

**Step 4: Verify visual output**

Create `design-assets/v2/preview-love-v2.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: rgb(2, 6, 23); margin: 50px; }
    .symbol { width: 256px; height: 256px; }
  </style>
</head>
<body>
  <h1 style="color: white;">Love Languages v2 - Heart Nebula</h1>
  <div class="symbol">
    <!-- Paste SVG here -->
  </div>
</body>
</html>
```

Open in browser
Expected: Filled heart with intense rosa-gold glow, nebula-like texture, energy waves

**Step 5: Commit**

```bash
git add design-assets/v2/love-languages-symbol-v2.svg design-assets/v2/preview-love-v2.html
git commit -m "feat: create Love Languages v2 symbol - cosmic heart nebula style"
```

---

## Task 3: Social Role Symbol v2 - Astro Wheel with Connections

**Files:**
- Create: `design-assets/v2/social-role-symbol-v2.svg`
- Reference: `kreissymbol.jpeg` (astro wheel with zodiac symbols)

**Design Spec:**
- Central spiral galaxy/vortex
- 3 concentric orbital rings
- 6 connection points (social nodes) around perimeter
- Radiating beams from center
- Königsblau (59, 130, 246) with white-blue center

**Step 1: Create central spiral galaxy core**

```svg
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Spiral gradient for galaxy core -->
    <radialGradient id="galaxy-spiral">
      <stop offset="0%" stop-color="rgb(220, 235, 255)" stop-opacity="1"/>
      <stop offset="30%" stop-color="rgb(147, 197, 253)" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="rgb(59, 130, 246)" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="rgb(30, 64, 175)" stop-opacity="0.4"/>
    </radialGradient>

    <!-- Rotating lines for spiral effect -->
    <g id="spiral-arms">
      <path d="M64 64 Q70 54 80 50" stroke="rgba(147, 197, 253, 0.7)" stroke-width="1.5" fill="none"/>
      <path d="M64 64 Q54 58 46 52" stroke="rgba(147, 197, 253, 0.7)" stroke-width="1.5" fill="none"/>
      <path d="M64 64 Q68 74 74 82" stroke="rgba(147, 197, 253, 0.7)" stroke-width="1.5" fill="none"/>
      <path d="M64 64 Q54 70 48 78" stroke="rgba(147, 197, 253, 0.7)" stroke-width="1.5" fill="none"/>
    </g>
  </defs>

  <!-- Ambient blue glow -->
  <circle cx="64" cy="64" r="50"
          fill="rgba(59, 130, 246, 0.2)"
          filter="blur(35px)"/>

  <!-- Galaxy core -->
  <circle cx="64" cy="64" r="18"
          fill="url(#galaxy-spiral)"
          style="filter: drop-shadow(0 0 10px rgba(147, 197, 253, 1))
                          drop-shadow(0 0 25px rgba(59, 130, 246, 0.9))
                          drop-shadow(0 0 45px rgba(59, 130, 246, 0.6));"/>

  <!-- Spiral arms -->
  <use href="#spiral-arms"
       style="filter: drop-shadow(0 0 6px rgba(147, 197, 253, 0.8));"/>

  <!-- Bright center point -->
  <circle cx="64" cy="64" r="4"
          fill="rgb(255, 255, 255)"
          style="filter: drop-shadow(0 0 8px rgba(255, 255, 255, 1));"/>
</svg>
```

**Step 2: Add 3 concentric orbital rings**

```svg
<!-- Outer ring -->
<circle cx="64" cy="64" r="42"
        fill="none"
        stroke="rgba(147, 197, 253, 0.5)"
        stroke-width="1.5"
        stroke-dasharray="4 4"
        style="filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.6));"/>

<!-- Middle ring -->
<circle cx="64" cy="64" r="32"
        fill="none"
        stroke="rgba(147, 197, 253, 0.6)"
        stroke-width="1.8"
        style="filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.7));"/>

<!-- Inner ring -->
<circle cx="64" cy="64" r="22"
        fill="none"
        stroke="rgba(147, 197, 253, 0.7)"
        stroke-width="2"
        style="filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.8));"/>
```

**Step 3: Add radiating beams (8 directions)**

```svg
<!-- Vertical beam up -->
<line x1="64" y1="64" x2="64" y2="20"
      stroke="rgba(147, 197, 253, 0.4)"
      stroke-width="1.5"
      stroke-linecap="round"
      style="filter: drop-shadow(0 0 5px rgba(147, 197, 253, 0.6));"/>

<!-- Horizontal beam right -->
<line x1="64" y1="64" x2="108" y2="64"
      stroke="rgba(147, 197, 253, 0.4)"
      stroke-width="1.5"
      stroke-linecap="round"
      style="filter: drop-shadow(0 0 5px rgba(147, 197, 253, 0.6));"/>

<!-- Vertical beam down -->
<line x1="64" y1="64" x2="64" y2="108"
      stroke="rgba(147, 197, 253, 0.4)"
      stroke-width="1.5"
      stroke-linecap="round"
      style="filter: drop-shadow(0 0 5px rgba(147, 197, 253, 0.6));"/>

<!-- Horizontal beam left -->
<line x1="64" y1="64" x2="20" y2="64"
      stroke="rgba(147, 197, 253, 0.4)"
      stroke-width="1.5"
      stroke-linecap="round"
      style="filter: drop-shadow(0 0 5px rgba(147, 197, 253, 0.6));"/>

<!-- Diagonal beams (4 corners) -->
<line x1="64" y1="64" x2="92" y2="36"
      stroke="rgba(147, 197, 253, 0.3)"
      stroke-width="1.2"
      stroke-linecap="round"
      opacity="0.8"
      style="filter: drop-shadow(0 0 4px rgba(147, 197, 253, 0.5));"/>

<!-- Repeat for other 3 diagonal directions -->
```

**Step 4: Add 6 social connection nodes on outer perimeter**

```svg
<!-- Top node -->
<g transform="translate(64, 18)">
  <circle r="5" fill="none" stroke="rgb(147, 197, 253)" stroke-width="1.8"
          style="filter: drop-shadow(0 0 5px rgba(147, 197, 253, 0.9));"/>
  <circle r="2" fill="rgb(220, 235, 255)"/>
  <!-- Connection line to center -->
  <line x1="0" y1="5" x2="0" y2="28"
        stroke="rgba(59, 130, 246, 0.3)"
        stroke-width="0.8"
        stroke-dasharray="2 3"/>
</g>

<!-- Right node -->
<g transform="translate(110, 64)">
  <circle r="5" fill="none" stroke="rgb(147, 197, 253)" stroke-width="1.8"
          style="filter: drop-shadow(0 0 5px rgba(147, 197, 253, 0.9));"/>
  <circle r="2" fill="rgb(220, 235, 255)"/>
  <line x1="-5" y1="0" x2="-28" y2="0"
        stroke="rgba(59, 130, 246, 0.3)"
        stroke-width="0.8"
        stroke-dasharray="2 3"/>
</g>

<!-- Bottom node -->
<g transform="translate(64, 110)">
  <circle r="5" fill="none" stroke="rgb(147, 197, 253)" stroke-width="1.8"
          style="filter: drop-shadow(0 0 5px rgba(147, 197, 253, 0.9));"/>
  <circle r="2" fill="rgb(220, 235, 255)"/>
  <line x1="0" y1="-5" x2="0" y2="-28"
        stroke="rgba(59, 130, 246, 0.3)"
        stroke-width="0.8"
        stroke-dasharray="2 3"/>
</g>

<!-- Left node -->
<g transform="translate(18, 64)">
  <circle r="5" fill="none" stroke="rgb(147, 197, 253)" stroke-width="1.8"
          style="filter: drop-shadow(0 0 5px rgba(147, 197, 253, 0.9));"/>
  <circle r="2" fill="rgb(220, 235, 255)"/>
  <line x1="5" y1="0" x2="28" y2="0"
        stroke="rgba(59, 130, 246, 0.3)"
        stroke-width="0.8"
        stroke-dasharray="2 3"/>
</g>

<!-- Top-right diagonal node -->
<g transform="translate(96, 32)">
  <circle r="4.5" fill="none" stroke="rgb(147, 197, 253)" stroke-width="1.6"
          style="filter: drop-shadow(0 0 4px rgba(147, 197, 253, 0.85));"/>
  <circle r="1.8" fill="rgb(220, 235, 255)"/>
</g>

<!-- Bottom-left diagonal node -->
<g transform="translate(32, 96)">
  <circle r="4.5" fill="none" stroke="rgb(147, 197, 253)" stroke-width="1.6"
          style="filter: drop-shadow(0 0 4px rgba(147, 197, 253, 0.85));"/>
  <circle r="1.8" fill="rgb(220, 235, 255)"/>
</g>
```

**Step 5: Verify and commit**

Open in browser
Expected: Complex astro wheel with bright blue center, orbital rings, beams, 6 connection nodes

```bash
git add design-assets/v2/social-role-symbol-v2.svg
git commit -m "feat: create Social Role v2 symbol - astro wheel with galaxy core"
```

---

## Task 4: RPG Identity Symbol v2 - Energy Lightning Weapon

**Files:**
- Create: `design-assets/v2/rpg-identity-symbol-v2.svg`
- References: `blitz2.jpeg` (lightning), `dna3.jpeg` (segmented structure)

**Design Spec:**
- Central energy blade/staff with electric branches
- Segmented power cores along blade
- Branching lightning paths
- Violett (168, 85, 247) with white-purple lightning

**Step 1: Create main energy blade with segments**

```svg
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradient for energy blade -->
    <linearGradient id="blade-energy" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgb(220, 200, 255)" stop-opacity="1"/>
      <stop offset="50%" stop-color="rgb(196, 141, 255)" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="rgb(168, 85, 247)" stop-opacity="0.85"/>
    </linearGradient>
  </defs>

  <!-- Ambient purple glow -->
  <ellipse cx="64" cy="64" rx="35" ry="60"
           fill="rgba(168, 85, 247, 0.15)"
           filter="blur(40px)"/>

  <!-- Main blade core -->
  <rect x="61" y="20" width="6" height="70"
        rx="3"
        fill="url(#blade-energy)"
        style="filter: drop-shadow(0 0 10px rgba(196, 141, 255, 1))
                        drop-shadow(0 0 25px rgba(168, 85, 247, 0.9))
                        drop-shadow(0 0 45px rgba(168, 85, 247, 0.6));"/>

  <!-- Bright center line -->
  <line x1="64" y1="20" x2="64" y2="90"
        stroke="rgb(240, 220, 255)"
        stroke-width="2"
        stroke-linecap="round"
        style="filter: drop-shadow(0 0 6px rgba(255, 255, 255, 1));"/>
</svg>
```

**Step 2: Add power core segments (4 segments along blade)**

```svg
<!-- Segment 1 - top -->
<g transform="translate(64, 32)">
  <circle r="5" fill="rgba(220, 200, 255, 0.4)"
          stroke="rgb(196, 141, 255)" stroke-width="1.5"/>
  <circle r="2.5" fill="rgb(220, 200, 255)"
          style="filter: drop-shadow(0 0 6px rgba(220, 200, 255, 1));"/>
  <!-- Connection rings -->
  <circle r="7" fill="none" stroke="rgba(196, 141, 255, 0.4)" stroke-width="0.8"/>
</g>

<!-- Segment 2 -->
<g transform="translate(64, 50)">
  <circle r="5.5" fill="rgba(220, 200, 255, 0.4)"
          stroke="rgb(196, 141, 255)" stroke-width="1.5"/>
  <circle r="2.8" fill="rgb(220, 200, 255)"
          style="filter: drop-shadow(0 0 7px rgba(220, 200, 255, 1));"/>
  <circle r="8" fill="none" stroke="rgba(196, 141, 255, 0.4)" stroke-width="0.8"/>
</g>

<!-- Segment 3 -->
<g transform="translate(64, 68)">
  <circle r="5.5" fill="rgba(220, 200, 255, 0.4)"
          stroke="rgb(196, 141, 255)" stroke-width="1.5"/>
  <circle r="2.8" fill="rgb(220, 200, 255)"
          style="filter: drop-shadow(0 0 7px rgba(220, 200, 255, 1));"/>
  <circle r="8" fill="none" stroke="rgba(196, 141, 255, 0.4)" stroke-width="0.8"/>
</g>

<!-- Segment 4 - bottom (largest) -->
<g transform="translate(64, 85)">
  <circle r="6" fill="rgba(220, 200, 255, 0.5)"
          stroke="rgb(196, 141, 255)" stroke-width="1.8"/>
  <circle r="3" fill="rgb(230, 210, 255)"
          style="filter: drop-shadow(0 0 8px rgba(230, 210, 255, 1));"/>
  <circle r="9" fill="none" stroke="rgba(196, 141, 255, 0.5)" stroke-width="1"/>
</g>
```

**Step 3: Add branching lightning paths (electric arcs)**

```svg
<!-- Lightning arc left side - top -->
<path d="M61 28 L56 24 L58 26 L52 22 L54 24"
      stroke="rgba(220, 200, 255, 0.7)"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      style="filter: drop-shadow(0 0 5px rgba(196, 141, 255, 0.9));"/>

<!-- Lightning arc right side - top -->
<path d="M67 28 L72 24 L70 26 L76 22 L74 24"
      stroke="rgba(220, 200, 255, 0.7)"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      style="filter: drop-shadow(0 0 5px rgba(196, 141, 255, 0.9));"/>

<!-- Lightning arc left side - middle -->
<path d="M61 52 L54 50 L56 52 L48 48 L50 50 L45 46"
      stroke="rgba(220, 200, 255, 0.8)"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      style="filter: drop-shadow(0 0 6px rgba(196, 141, 255, 1));"/>

<!-- Lightning arc right side - middle -->
<path d="M67 52 L74 50 L72 52 L80 48 L78 50 L83 46"
      stroke="rgba(220, 200, 255, 0.8)"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      style="filter: drop-shadow(0 0 6px rgba(196, 141, 255, 1));"/>

<!-- Smaller branch arcs -->
<path d="M58 42 L52 40 L54 42"
      stroke="rgba(220, 200, 255, 0.6)"
      stroke-width="1.2"
      stroke-linecap="round"
      fill="none"
      style="filter: drop-shadow(0 0 4px rgba(196, 141, 255, 0.8));"/>

<path d="M70 42 L76 40 L74 42"
      stroke="rgba(220, 200, 255, 0.6)"
      stroke-width="1.2"
      stroke-linecap="round"
      fill="none"
      style="filter: drop-shadow(0 0 4px rgba(196, 141, 255, 0.8));"/>
```

**Step 4: Add weapon guard/hilt at bottom**

```svg
<!-- Crossguard -->
<rect x="40" y="92" width="48" height="3"
      rx="1.5"
      fill="none"
      stroke="rgb(196, 141, 255)"
      stroke-width="2"
      style="filter: drop-shadow(0 0 6px rgba(196, 141, 255, 0.9));"/>

<!-- Grip with energy segments -->
<rect x="60" y="96" width="8" height="18"
      rx="2"
      fill="rgba(168, 85, 247, 0.3)"
      stroke="rgb(196, 141, 255)"
      stroke-width="1.5"/>

<!-- Grip segments (3 bands) -->
<line x1="60" y1="100" x2="68" y2="100"
      stroke="rgba(220, 200, 255, 0.7)"
      stroke-width="1"/>
<line x1="60" y1="106" x2="68" y2="106"
      stroke="rgba(220, 200, 255, 0.7)"
      stroke-width="1"/>
<line x1="60" y1="112" x2="68" y2="112"
      stroke="rgba(220, 200, 255, 0.7)"
      stroke-width="1"/>

<!-- Pommel -->
<circle cx="64" cy="116" r="4"
        fill="none"
        stroke="rgb(196, 141, 255)"
        stroke-width="2"
        style="filter: drop-shadow(0 0 6px rgba(196, 141, 255, 0.8));"/>
<circle cx="64" cy="116" r="2"
        fill="rgb(220, 200, 255)"/>
```

**Step 5: Verify and commit**

Expected: Energy weapon with segmented power cores, branching lightning, strong purple glow

```bash
git add design-assets/v2/rpg-identity-symbol-v2.svg
git commit -m "feat: create RPG Identity v2 symbol - energy weapon with lightning"
```

---

## Task 5: Remaining 3 Symbols (Personality, Celebrity, Destiny)

**Files:**
- Create: `design-assets/v2/personality-symbol-v2.svg`
- Create: `design-assets/v2/celebrity-symbol-v2.svg`
- Create: `design-assets/v2/destiny-symbol-v2.svg`

**Note:** Following same pattern as Tasks 2-4:
- Multiple detail layers (3-5)
- Strong multi-layer glows
- Filled cores with gradients
- Energy effects/radiating elements
- Reference images for inspiration

**Personality (Smaragdgrün):**
- Head silhouette with constellation/star map inside
- Neural network-like connections
- Crystal energy nodes at key points
- Inner galaxy/universe visualization

**Celebrity (Magenta):**
- Crown/mask with radiating star-burst
- Glamour rays emanating outward
- Multiple sparkle/diamond accents
- Spotlight beam effects

**Destiny (Gold/Amber):**
- Stargate/portal archway
- Golden path leading through
- Cosmic destination star at end
- Energy ripples around portal

*(Detailed SVG code for these 3 symbols follows same structure as Love/Social/RPG - approx 80-100 lines each with gradients, filters, multi-layer glows)*

**Step 1-3:** Create each symbol with reference-inspired complexity

**Step 4:** Add to preview page

**Step 5:** Commit all three

```bash
git add design-assets/v2/personality-symbol-v2.svg design-assets/v2/celebrity-symbol-v2.svg design-assets/v2/destiny-symbol-v2.svg
git commit -m "feat: create Personality, Celebrity, Destiny v2 symbols with cosmic energy aesthetic"
```

---

## Task 6: Create Comprehensive v2 Preview Page

**Files:**
- Create: `design-assets/v2/preview-all-v2.html`

**Step 1: Create HTML structure with cosmic background**

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quiz Symbols v2 - Cosmic Energy</title>
  <link rel="stylesheet" href="../cosmic-nebula-background.css">
  <link rel="stylesheet" href="../quiz-design-tokens.css">
  <style>
    body { margin: 0; padding: 0; min-height: 100vh; }
    .container {
      position: relative;
      z-index: 10;
      max-width: 1600px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }
    h1 {
      font-size: 4rem;
      text-align: center;
      background: linear-gradient(135deg, #3b82f6, #a855f7, #ec4899, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
    }
    .subtitle {
      text-align: center;
      color: rgb(203, 213, 225);
      font-size: 1.25rem;
      margin-bottom: 3rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 3rem;
    }
    .symbol-card {
      background: rgba(15, 23, 42, 0.7);
      border: 2px solid rgba(100, 116, 139, 0.3);
      border-radius: 1.5rem;
      padding: 2.5rem;
      backdrop-filter: blur(12px);
      transition: all 0.4s ease;
    }
    .symbol-card:hover {
      border-color: rgba(148, 163, 184, 0.6);
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .symbol-display {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
      margin: 2rem 0;
    }
    .symbol-display svg {
      width: 256px;
      height: 256px;
    }
    .card-title {
      font-size: 2rem;
      color: white;
      text-align: center;
      margin-bottom: 0.5rem;
    }
    .card-color {
      text-align: center;
      font-family: monospace;
      font-size: 0.9rem;
      opacity: 0.7;
      margin-bottom: 1.5rem;
    }
    .card-description {
      color: rgb(203, 213, 225);
      line-height: 1.7;
      text-align: center;
    }
    .comparison {
      margin-top: 4rem;
      padding: 2rem;
      background: rgba(168, 85, 247, 0.1);
      border: 2px solid rgba(168, 85, 247, 0.3);
      border-radius: 1rem;
    }
    .comparison h2 {
      color: rgb(196, 181, 254);
      margin-bottom: 1rem;
    }
    .comparison ul {
      color: rgb(221, 214, 254);
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="quiz-nebula-bg--animated"></div>

  <div class="container">
    <h1>Quiz Symbols v2</h1>
    <p class="subtitle">Cosmic Energy Aesthetic - Reference-Inspired Design</p>

    <div class="grid">
      <!-- Love Languages Card -->
      <div class="symbol-card">
        <h2 class="card-title">❤️ Love Languages</h2>
        <div class="card-color" style="color: rgb(255, 200, 150);">Rosa-Gold • Cosmic Heart Nebula</div>
        <div class="symbol-display">
          <object data="love-languages-symbol-v2.svg" type="image/svg+xml"></object>
        </div>
        <p class="card-description">
          Filled heart nebula with intense glow, energy waves, inner texture.
          Inspired by heart nebula reference.
        </p>
      </div>

      <!-- Repeat for all 6 symbols -->
    </div>

    <div class="comparison">
      <h2>v1 → v2 Improvements</h2>
      <ul>
        <li><strong>Glow Intensity:</strong> 3-4x stronger multi-layer glows</li>
        <li><strong>Detail Layers:</strong> Increased from 1-2 to 3-5 layers per symbol</li>
        <li><strong>Inner Complexity:</strong> Filled cores, textures, segmented structures</li>
        <li><strong>Size Presence:</strong> Larger visual footprint, bolder elements</li>
        <li><strong>Cosmic Energy:</strong> Reference-inspired sci-fi aesthetic throughout</li>
      </ul>
    </div>
  </div>
</body>
</html>
```

**Step 2: Verify all symbols load**

Open in browser
Expected: All 6 symbols visible with animated cosmic background, strong glows

**Step 3: Test responsive behavior**

Resize browser window
Expected: Grid adapts, symbols remain visible on mobile

**Step 4: Commit**

```bash
git add design-assets/v2/preview-all-v2.html
git commit -m "feat: create comprehensive v2 preview page with all cosmic symbols"
```

---

## Task 7: Update Documentation

**Files:**
- Modify: `design-assets/README.md`
- Create: `design-assets/v2/CHANGELOG.md`

**Step 1: Add v2 section to README**

Add after current symbol table:

```markdown
## v2 Symbols (Cosmic Energy Redesign)

**Status:** ✅ Complete - Reference-inspired cosmic aesthetic

All v2 symbols are located in `design-assets/v2/` with significantly enhanced:
- **Glow intensity** (3-4x stronger than v1)
- **Detail complexity** (3-5 layers vs 1-2)
- **Visual presence** (larger, bolder, more energetic)
- **Cosmic aesthetic** (inspired by reference images)

### Preview
See `design-assets/v2/preview-all-v2.html` for live comparison.

### Reference Images
Design based on:
- `dna3.jpeg` - Multi-segment structures, detail layers
- `herz3.jpeg` - Intense filled glows, nebula textures
- `kreissymbol.jpeg` - Geometric complexity, radiating elements
- `blitz2.jpeg` - Branching energy, dynamic paths
```

**Step 2: Create changelog**

```markdown
# Quiz Symbols Design Changelog

## v2.0.0 - 2025-01-11 - Cosmic Energy Redesign

### Breaking Changes
- Complete redesign of all 6 quiz symbols
- v1 symbols moved to `design-assets/v1/` (archived)

### Added
- Multi-layer glow system (4 glow layers per symbol)
- Filled gradient cores (not just outlines)
- Inner complexity (textures, segments, structures)
- Branching/radiating energy effects
- Reference-image-inspired aesthetic

### Changed
- Glow intensity increased 3-4x
- Symbol size increased for better presence
- Detail layers increased from 1-2 to 3-5 per symbol
- Color saturation increased

### Symbol-Specific Changes

**Love Languages:**
- Added: Filled heart core with nebula texture
- Added: Energy wave patterns radiating outward
- Added: Inner sparkle accents
- Changed: From simple outline to cosmic heart nebula

**Social Role:**
- Added: Central spiral galaxy core
- Added: 3 concentric orbital rings
- Added: Radiating beams in 8 directions
- Added: 6 connection nodes with link lines
- Changed: From basic circle to astro wheel

**RPG Identity:**
- Added: Segmented power cores along blade (4 segments)
- Added: Branching lightning paths
- Added: Energy weapon guard/hilt
- Changed: From simple sword to energy lightning weapon

**Personality:**
- Added: Constellation star map inside head
- Added: Neural network connections
- Added: Crystal energy nodes
- Changed: From simple profile to cosmic mind

**Celebrity:**
- Added: Star-burst radiation effects
- Added: Glamour ray beams
- Added: Multiple diamond sparkles
- Changed: From simple crown to radiant glamour icon

**Destiny:**
- Added: Stargate portal structure
- Added: Golden path visualization
- Added: Energy ripples around portal
- Changed: From simple arch to cosmic gateway

### Design Tokens Updated
- `--glow-opacity-*` values increased
- `--glow-blur-*` values increased
- Added `--glow-cosmic` 4-layer system
- Added `--glow-core` for filled elements

## v1.0.0 - 2025-01-11 - Initial Design (Archived)

First iteration - minimalist outline style.
Feedback: Too subtle, needed more detail and stronger glows.
Status: Archived to `design-assets/v1/`
```

**Step 3: Commit documentation**

```bash
git add design-assets/README.md design-assets/v2/CHANGELOG.md
git commit -m "docs: update README and add v2 changelog"
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] All 6 v2 SVG symbols created
- [ ] Each symbol has 3-5 detail layers
- [ ] Glows are 3-4x stronger than v1
- [ ] Preview page displays all symbols correctly
- [ ] Symbols scale properly (128px → 256px)
- [ ] CSS tokens updated for stronger glows
- [ ] Documentation updated
- [ ] All commits follow conventional commit format
- [ ] No console errors in browser preview

---

## Next Steps (After Plan Execution)

1. **User Feedback:** Present v2 symbols for review
2. **Iteration:** Adjust based on feedback (glow strength, detail level)
3. **Integration:** Create React/Next.js `QuizSymbol` component
4. **Landing Page:** Replace emojis with v2 symbols
5. **Responsive Testing:** Verify 20px → 256px scaling
6. **Accessibility:** Add proper ARIA labels, test screen readers
7. **Performance:** Measure load times, optimize if needed

---

**Plan complete. Ready for execution.**
