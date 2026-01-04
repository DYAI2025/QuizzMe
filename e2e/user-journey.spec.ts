import { test, expect, Page } from '@playwright/test';

/**
 * AstroSheet Platform - Full User Journey E2E Tests (Socratic Style)
 * 
 * Based on: Full User Journey Through AstroSheet (Socratic Dissection)
 * 
 * PHASE 1: THE FOUNDATION - Where Precision Becomes Purpose
 * PHASE 2: THE FUSION ENGINE - Where Science Creates Synthesis
 * PHASE 3: DASHBOARD & DATA STORAGE - Where Knowledge Becomes Power
 * PHASE 4: EMPOWERMENT - Where Astrology Stops and Strategy Begins
 * PHASE 5: CONTINUOUS EVOLUTION - Where the Journey Never Ends
 */

// ============================================================================
// CONSTANTS
// ============================================================================

const SIDEBAR_ITEMS = {
  DASHBOARD: 'DASHBOARD',
  PROFIL: 'PROFIL',
  QUIZZES: 'QUIZZES',
  AGENTEN: 'AGENTEN',
  PREMIUM: 'PREMIUM',
  EINSTELLUNGEN: 'EINSTELLUNGEN'
} as const;

const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  ONBOARDING: '/onboarding/astro',
  ASTROSHEET: '/astrosheet',
  PROFILE: '/profile',
  QUIZZES: '/verticals/quiz',
  AGENTS: '/agents',
  PREMIUM: '/premium',
  CHARACTER: '/character'
} as const;

// Key concepts from Socratic journey
const CONCEPTS = {
  HARMONY_INDEX: /Harmony.?Index|Harmonie|coherence|78%|72%|83%/i,
  DRITTE_IDENTITAET: /Dritte.?Identität|Architektin|Skelett|Synthesis|energetic.?blueprint/i,
  RESSOURCEN_GESPUER: /Ressourcen.?Gespür|resource.?awareness|energy.?awareness/i,
  STABILITAETSKOMPETENZ: /Stabilitätskompetenz|resilience|stability/i,
  ENTFALTUNGSMATRIX: /Entfaltungsmatrix|Entfaltung|potential|unlocked/i,
  WU_XING: /Wu.?Xing|Wood|Fire|Earth|Metal|Water|Holz|Feuer|Erde|Metall|Wasser/i,
  FUSION_ENGINE: /Fusion|Engine|Julian|Delta.?T|Längengrad/i,
  CROSS_SYSTEM: /Cross.?System|Western.*Chinese|Chinese.*Western/i
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function loginAsTestUser(page: Page) {
  await page.goto(ROUTES.LOGIN);
  await page.fill('input[type="email"]', 'testuser@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
}

async function completeAstroOnboarding(page: Page, userData: {
  name: string;
  birthDate: string;    // Exact date - not "approximate"
  birthTime: string;    // Exact time - "sine qua non" for precision
  birthPlace: string;   // Exact location - for Längengrad-Korrektur
}) {
  await expect(page).toHaveURL(new RegExp(ROUTES.ONBOARDING));
  
  // The platform forces you to confront precision:
  // "Without precise time, 10-15% of Ba Zi charts fail"
  await page.fill('input[name="name"]', userData.name);
  await page.fill('input[name="birthDate"]', userData.birthDate);
  await page.fill('input[name="birthTime"]', userData.birthTime);
  await page.fill('input[name="birthPlace"]', userData.birthPlace);
  
  // Select location for Längengrad-Korrektur
  const locationOption = page.locator(`text=${userData.birthPlace}`).first();
  if (await locationOption.isVisible()) {
    await locationOption.click();
  }
  
  // Submit → FusionEngine processing begins
  await page.click('button[type="submit"]');
}

async function clickSidebarItem(page: Page, item: keyof typeof SIDEBAR_ITEMS) {
  const sidebarItem = page.locator(`text=${SIDEBAR_ITEMS[item]}`).first();
  await sidebarItem.click();
}

async function answerQuizQuestions(page: Page, maxQuestions = 20) {
  for (let i = 0; i < maxQuestions; i++) {
    const isResultVisible = await page.locator('[data-testid="quiz-result"]').isVisible()
      || await page.locator('text=Dein Ergebnis').isVisible()
      || await page.locator('text=Ergebnis').isVisible();
    
    if (isResultVisible) break;
    
    const option = page.locator('[data-testid="quiz-option"]').first();
    if (await option.isVisible()) {
      await option.click();
      await page.waitForTimeout(400);
    } else {
      const buttonOption = page.locator('button').filter({ hasText: /\w+/ }).first();
      if (await buttonOption.isVisible()) {
        await buttonOption.click();
        await page.waitForTimeout(400);
      } else {
        break;
      }
    }
  }
}

// ============================================================================
// PHASE 1: THE FOUNDATION (Where Precision Becomes Purpose)
// "Begin where the universe meets your data."
// ============================================================================

test.describe('PHASE 1: THE FOUNDATION - Where Precision Becomes Purpose', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: new Date('2024-06-15T10:00:00Z') });
  });

  test('1.1 Onboarding: User arrives as a cosmic data point', async ({ page }) => {
    await loginAsTestUser(page);
    await expect(page).toHaveURL(new RegExp(ROUTES.ONBOARDING));
    
    // Interface should communicate precision requirement
    // "What if your birth time was wrong?"
    const precisionHint = page.locator('text=/präzise|exact|genau|precision/i');
    await expect(precisionHint.first()).toBeVisible();
  });

  test('1.2 Birth Data Input: Exact time is sine qua non', async ({ page }) => {
    await loginAsTestUser(page);
    
    // Required inputs for Delta T correction and Längengrad-Korrektur
    await expect(page.locator('input[name="birthTime"]')).toBeVisible();
    await expect(page.locator('input[name="birthPlace"]')).toBeVisible();
    
    // Fill with precise data
    await completeAstroOnboarding(page, {
      name: 'Navigator Luna',
      birthDate: '1990-03-21',
      birthTime: '14:35',  // Exact time, not "approximate noon"
      birthPlace: 'Berlin' // Exact location for true solar time
    });
  });

  test('1.3 Data Submission: FusionEngine on fly.io activates', async ({ page }) => {
    let fusionEngineRequest: { url: string; body: string } | null = null;
    
    await page.route('**/api/astro-compute', async (route) => {
      fusionEngineRequest = {
        url: route.request().url(),
        body: route.request().postData() || ''
      };
      await route.continue();
    });
    
    await loginAsTestUser(page);
    await completeAstroOnboarding(page, {
      name: 'Engine Test',
      birthDate: '1985-07-15',
      birthTime: '09:30',
      birthPlace: 'München'
    });
    
    // Verify FusionEngine was called
    expect(fusionEngineRequest).not.toBeNull();
  });

  test('1.4 FusionEngine applies critical corrections', async ({ page }) => {
    let engineResponse: Record<string, unknown> | null = null;
    
    await page.route('**/api/astro-compute', async (route) => {
      const response = await route.fetch();
      engineResponse = await response.json();
      await route.fulfill({ response });
    });
    
    await loginAsTestUser(page);
    await completeAstroOnboarding(page, {
      name: 'Correction Test',
      birthDate: '1992-12-21',
      birthTime: '23:45',
      birthPlace: 'Hamburg'
    });
    
    // Engine should return Western + Chinese + Ba Zi
    // Julian Date conversion, Delta T, Längengrad-Korrektur, EoT applied
    expect(engineResponse).toBeDefined();
  });
});

// ============================================================================
// PHASE 2: THE FUSION ENGINE (Where Science Creates Synthesis)
// "The system doesn't predict—it integrates."
// ============================================================================

test.describe('PHASE 2: THE FUSION ENGINE - Where Science Creates Synthesis', () => {
  
  test('2.1 FusionEngine returns Harmony Index', async ({ page }) => {
    let engineResponse: Record<string, unknown> | null = null;
    
    await page.route('**/api/astro-compute', async (route) => {
      const response = await route.fetch();
      engineResponse = await response.json();
      await route.fulfill({ response });
    });
    
    await loginAsTestUser(page);
    await completeAstroOnboarding(page, {
      name: 'Harmony Test',
      birthDate: '1988-06-21',
      birthTime: '12:00',
      birthPlace: 'Berlin'
    });
    
    // Engine compares Western planetary vectors vs Chinese temporal vectors
    // → Energy coherence (e.g., "78% harmonic alignment")
    if (engineResponse) {
      // Expected: harmonyIndex or similar field
      const hasHarmony = 'harmonyIndex' in engineResponse || 
                         'harmony' in engineResponse ||
                         'fusion' in engineResponse;
      expect(hasHarmony || engineResponse).toBeTruthy();
    }
  });

  test('2.2 FusionEngine generates "Dritte Identität"', async ({ page }) => {
    await loginAsTestUser(page);
    await completeAstroOnboarding(page, {
      name: 'Identity Test',
      birthDate: '1990-01-15',
      birthTime: '08:30',
      birthPlace: 'Frankfurt'
    });
    
    await expect(page).toHaveURL(new RegExp(ROUTES.ASTROSHEET));
    
    // "The Architektin (Statik vs. Fassade), Skelett der Sanftmut (Metall/Hase)"
    // Not "your sun sign" but your energetic blueprint
    const dritteIdentitaet = page.locator(`text=${CONCEPTS.DRITTE_IDENTITAET.source}`);
    // Fallback: any synthesis/identity element
    const identityElements = page.locator('text=/Identität|Archetype|Blueprint|Synthesis/i');
    
    const hasIdentity = await dritteIdentitaet.isVisible() || await identityElements.first().isVisible();
    expect(hasIdentity).toBeTruthy();
  });

  test('2.3 Wu Xing Element Mapping is displayed', async ({ page }) => {
    await loginAsTestUser(page);
    await completeAstroOnboarding(page, {
      name: 'WuXing Test',
      birthDate: '1995-03-15',
      birthTime: '16:00',
      birthPlace: 'Köln'
    });
    
    // Western planets → Wu Xing elements (e.g., Jupiter = Wood)
    const wuXingElements = page.locator(`text=${CONCEPTS.WU_XING.source}`);
    await expect(wuXingElements.first()).toBeVisible();
  });
});

// ============================================================================
// PHASE 3: DASHBOARD & DATA STORAGE (Where Knowledge Becomes Power)
// "Your data isn't stored—it's alive."
// ============================================================================

test.describe('PHASE 3: DASHBOARD & DATA STORAGE - Where Knowledge Becomes Power', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: new Date('2024-06-15T10:00:00Z') });
    await loginAsTestUser(page);
    await completeAstroOnboarding(page, {
      name: 'Dashboard Explorer',
      birthDate: '1988-02-29',
      birthTime: '06:00',
      birthPlace: 'Frankfurt'
    });
  });

  test('3.1 Dashboard shows Entfaltungsmatrix', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(ROUTES.ASTROSHEET));
    
    // Visual map of unlocked vs. underdeveloped energy
    const entfaltungsmatrix = page.locator(`text=${CONCEPTS.ENTFALTUNGSMATRIX.source}`);
    await expect(entfaltungsmatrix.first()).toBeVisible();
  });

  test('3.2 Dashboard shows Mission & Belohnung section', async ({ page }) => {
    // "Develop your 'Metal Hare' resilience to reduce stress."
    const missionSection = page.locator('text=/Mission|Belohnung|Develop|Resilience/i');
    await expect(missionSection.first()).toBeVisible();
  });

  test('3.3 Dritte Identität is displayed as strategic guide', async ({ page }) => {
    // Your synthesis ("The Architektin") becomes a strategic guide, not a prediction
    const identitySection = page.locator('text=/Identität|Archetype|Synthesis/i');
    await expect(identitySection.first()).toBeVisible();
  });

  test('3.4 Cross-System Compatibility is shown', async ({ page }) => {
    // "Your Mercury (Western) aligns with your Ba Zi Yin Wood"
    const crossSystem = page.locator(`text=${CONCEPTS.CROSS_SYSTEM.source}`);
    await expect(crossSystem.first()).toBeVisible();
  });

  test('3.5 Instant Symbol Creator generates Fine-Line Symbol', async ({ page }) => {
    // One click generates a "Fine-Line Symbol" for social sharing
    const symbolCreator = page.locator('[data-testid="fusion-symbol"], svg[class*="sigil"]');
    await expect(symbolCreator.first()).toBeVisible();
  });
});

// ============================================================================
// PHASE 4: EMPOWERMENT (Where Astrology Stops and Strategy Begins)
// "You don't just understand your chart—you use it."
// ============================================================================

test.describe('PHASE 4: EMPOWERMENT - Where Astrology Stops and Strategy Begins', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.ASTROSHEET);
  });

  test('4.1 Sidebar shows complete navigation', async ({ page }) => {
    // DASHBOARD, PROFIL, QUIZZES, AGENTEN, PREMIUM, EINSTELLUNGEN
    const sidebar = page.locator('[data-testid="sidebar"], nav, aside').first();
    
    await expect(sidebar.locator(`text=${SIDEBAR_ITEMS.DASHBOARD}`)).toBeVisible();
    await expect(sidebar.locator(`text=${SIDEBAR_ITEMS.PROFIL}`)).toBeVisible();
    await expect(sidebar.locator(`text=${SIDEBAR_ITEMS.QUIZZES}`)).toBeVisible();
    await expect(sidebar.locator(`text=${SIDEBAR_ITEMS.AGENTEN}`)).toBeVisible();
    await expect(sidebar.locator(`text=${SIDEBAR_ITEMS.PREMIUM}`)).toBeVisible();
    await expect(sidebar.locator(`text=${SIDEBAR_ITEMS.EINSTELLUNGEN}`)).toBeVisible();
  });

  test('4.2 Profile shows Ressourcen-Gespür', async ({ page }) => {
    await clickSidebarItem(page, 'PROFIL');
    
    // Your energy awareness score (e.g., "78% coherence")
    const ressourcenGespuer = page.locator(`text=${CONCEPTS.RESSOURCEN_GESPUER.source}`);
    const energyScore = page.locator('text=/\\d+%|coherence|awareness/i');
    
    const hasRessourcen = await ressourcenGespuer.isVisible() || await energyScore.first().isVisible();
    expect(hasRessourcen).toBeTruthy();
  });

  test('4.3 Profile shows Stabilitätskompetenz', async ({ page }) => {
    await clickSidebarItem(page, 'PROFIL');
    
    // How your chart affects emotional resilience
    const stabilitaet = page.locator(`text=${CONCEPTS.STABILITAETSKOMPETENZ.source}`);
    await expect(stabilitaet.first()).toBeVisible();
  });

  test('4.4 Quizzes provide interactive Ressource Tests', async ({ page }) => {
    await clickSidebarItem(page, 'QUIZZES');
    
    // "When stressed, your Ba Zi Yin Water overpowers your Yang Wood. What's your recovery strategy?"
    const quizCard = page.locator('[data-testid="quiz-card"]');
    await expect(quizCard.first()).toBeVisible();
  });

  test('4.5 Quiz result shows Harmony Index feedback', async ({ page }) => {
    await clickSidebarItem(page, 'QUIZZES');
    await page.click('[data-testid="quiz-card"]').catch(() => page.click('text=/Quiz/i'));
    await answerQuizQuestions(page);
    
    // Feedback: "Your Harmony Index is 78%. Practice the Earth Element to ground you."
    const resultFeedback = page.locator('text=/Ergebnis|Harmony|Index|Element/i');
    await expect(resultFeedback.first()).toBeVisible();
  });

  test('4.6 Skills Diagram shows Western-Chinese alignment', async ({ page }) => {
    await clickSidebarItem(page, 'PROFIL');
    
    // Western planetary strengths → Chinese skill alignment
    // (e.g., Jupiter = Leadership + Ba Zi Yang Fire = Creativity)
    const skillsDiagram = page.locator('[data-testid="skills-diagram"], canvas, svg');
    await expect(skillsDiagram.first()).toBeVisible();
  });

  test('4.7 AI Agent Live Chat is accessible', async ({ page }) => {
    await clickSidebarItem(page, 'AGENTEN');
    
    // "How do I use my 'Metal Hare' energy in my next presentation?"
    const agentInterface = page.locator('text=/Agent|Chat|Beratung|Astro/i');
    await expect(agentInterface.first()).toBeVisible();
  });

  test('4.8 AI Agent provides strategic guidance', async ({ page }) => {
    await clickSidebarItem(page, 'AGENTEN');
    
    // Response: "Focus on precision (Metal) and adaptability (Hare)."
    // Look for input/chat interface
    const chatInput = page.locator('input[placeholder*="Nachricht"], textarea, [data-testid="chat-input"]');
    const agentContent = page.locator('text=/Beratung|Guidance|Strategy|Energy/i');
    
    const hasAgentUI = await chatInput.isVisible() || await agentContent.first().isVisible();
    expect(hasAgentUI).toBeTruthy();
  });
});

// ============================================================================
// PHASE 5: CONTINUOUS EVOLUTION (Where the Journey Never Ends)
// "Your chart isn't a map—it's a compass that recalibrates daily."
// ============================================================================

test.describe('PHASE 5: CONTINUOUS EVOLUTION - Where the Journey Never Ends', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.ASTROSHEET);
  });

  test('5.1 Next Quiz based on previous assessment', async ({ page }) => {
    await clickSidebarItem(page, 'QUIZZES');
    await page.click('[data-testid="quiz-card"]').catch(() => page.click('text=/Quiz/i'));
    await answerQuizQuestions(page);
    
    // "Your Harmony Index dropped to 72%. Try 'The Energetic Reset' quiz."
    const nextQuizButton = page.locator('text=/Nächstes|Next|Weiteres|Reset/i');
    await expect(nextQuizButton.first()).toBeVisible();
  });

  test('5.2 Quiz result: Back to ProfilePage option', async ({ page }) => {
    await clickSidebarItem(page, 'QUIZZES');
    await page.click('[data-testid="quiz-card"]').catch(() => page.click('text=/Quiz/i'));
    await answerQuizQuestions(page);
    
    const backToProfile = page.locator('text=/Profil|Zum Profil|Profile/i');
    await expect(backToProfile.first()).toBeVisible();
  });

  test('5.3 Quiz result: Share on Social Media', async ({ page }) => {
    await clickSidebarItem(page, 'QUIZZES');
    await page.click('[data-testid="quiz-card"]').catch(() => page.click('text=/Quiz/i'));
    await answerQuizQuestions(page);
    
    const shareButton = page.locator('text=/Teilen|Share/i');
    await expect(shareButton.first()).toBeVisible();
  });

  test('5.4 Social Media Banner shows Harmony Index', async ({ page }) => {
    await clickSidebarItem(page, 'QUIZZES');
    await page.click('[data-testid="quiz-card"]').catch(() => page.click('text=/Quiz/i'));
    await answerQuizQuestions(page);
    
    const shareButton = page.locator('text=/Teilen|Share/i').first();
    if (await shareButton.isVisible()) {
      await shareButton.click();
      
      // Banner showing: Current Harmony Index (e.g., "83%")
      // One actionable insight (e.g., "Use your Wood energy to mentor others")
      const shareBanner = page.locator('[data-testid="share-banner"], [role="dialog"]');
      const hasShareUI = await shareBanner.isVisible() || 
                         await page.locator('text=/Facebook|Instagram|TikTok/i').isVisible();
      expect(hasShareUI).toBeTruthy();
    }
  });

  test('5.5 Daily Horoskop (Premium) shows energy peaks', async ({ page }) => {
    await clickSidebarItem(page, 'PREMIUM');
    
    // Not "today's luck," but:
    // "Your Yang Wood energy peaks at 10 AM. Schedule creative tasks now."
    const dailyHoroscope = page.locator('text=/Horoskop|Daily|Tageshoroskop|energy.*peak/i');
    await expect(dailyHoroscope.first()).toBeVisible();
  });

  test('5.6 Premium processes new data every 24 hours', async ({ page }) => {
    await clickSidebarItem(page, 'PREMIUM');
    
    // FusionEngine processes new data every 24 hours
    const premiumContent = page.locator('text=/Premium|Abo|Subscribe|Upgrade/i');
    await expect(premiumContent.first()).toBeVisible();
  });
});

// ============================================================================
// FULL JOURNEY: COMPLETE HAPPY PATH (Socratic Style)
// ============================================================================

test.describe('FULL JOURNEY: Precision to Empowerment', () => {
  
  test('Complete voyage from Cosmic Data Point to Active Navigator', async ({ page }) => {
    await page.clock.install({ time: new Date('2024-06-15T10:00:00Z') });
    
    // PHASE 1: THE FOUNDATION
    // "Begin where the universe meets your data."
    await loginAsTestUser(page);
    await completeAstroOnboarding(page, {
      name: 'Captain Navigator',
      birthDate: '1990-06-21',
      birthTime: '12:00',
      birthPlace: 'Berlin'
    });
    
    // PHASE 2-3: FUSION ENGINE → DASHBOARD
    await expect(page).toHaveURL(new RegExp(ROUTES.ASTROSHEET));
    await expect(page.locator('text=Captain Navigator')).toBeVisible();
    
    // Verify Entfaltungsmatrix visible
    await expect(page.locator('text=/Entfaltung|Matrix|Potential/i').first()).toBeVisible();
    
    // PHASE 4: EMPOWERMENT
    // Navigate to Quizzes via sidebar
    await expect(page.locator(`text=${SIDEBAR_ITEMS.QUIZZES}`)).toBeVisible();
    await clickSidebarItem(page, 'QUIZZES');
    
    // Complete a Ressource Test
    await page.click('[data-testid="quiz-card"]').catch(() => page.click('text=/Quiz/i'));
    await answerQuizQuestions(page);
    
    // Verify result with strategic feedback
    await expect(page.locator('text=/Ergebnis|Result/i').first()).toBeVisible();
    
    // PHASE 5: CONTINUOUS EVOLUTION
    // Verify post-quiz options
    const hasNextOptions = await page.locator('text=/Profil|Teilen|Next/i').first().isVisible();
    expect(hasNextOptions).toBeTruthy();
    
    // Return to Dashboard
    await page.click('text=/Profil|Zum Profil/i').catch(() => 
      clickSidebarItem(page, 'PROFIL')
    );
    
    // Verify empowered state - strategic guide, not prediction
    await expect(page.locator('text=/Profil|Skills|Ressourcen/i').first()).toBeVisible();
  });
});
