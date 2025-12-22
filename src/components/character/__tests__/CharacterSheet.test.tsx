/**
 * TS-2: Component Tests for CharacterSheet Rendering
 *
 * Test Coverage:
 * - Rendering without optional fields (archetype, narrative, delta)
 * - Graceful degradation when data is missing
 * - No crashes with minimal data
 * - Correct display of derived stats
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CharacterSheetPage from '@/app/character/page';
import { CoreStatsCard } from '../CoreStatsCard';
import { ArchetypeStoryCard } from '../ArchetypeStoryCard';
import { DerivedStatsCard } from '../DerivedStatsCard';
import {
  COMPLETE_PROFILE,
  MINIMAL_PROFILE,
  NO_ARCHETYPE_PROFILE,
  NO_NARRATIVE_PROFILE,
  NO_DELTA_PROFILE,
  ALL_ZEROS_PROFILE,
  ALL_MAX_PROFILE,
} from '@/test/mocks/psyche-profiles';

// Mock the hook
vi.mock('@/hooks/usePsycheProfile');

// Mock default return value for usePsycheProfile
const mockUsePsycheProfileReturn = {
  profile: null,
  isLoading: false,
  error: null,
  delta: null,
  movers: [],
  isSignificantChange: false,
  showBanner: false,
  dismissBanner: vi.fn(),
};

// Mock the content file
vi.mock('@/content/character-sheet.de', () => ({
  characterSheetCopy: {
    header: {
      title: 'Dein Character Sheet',
      subtitle: 'Dein Avatar ist ein Klima, kein Label.',
    },
    sections: {
      coreStats: 'Kernwerte',
      climate: 'Dein Klima',
      derived: 'Abgeleitete Werte',
      archetype: 'Archetyp',
    },
    stats: {
      clarity: 'Klarheit',
      courage: 'Mut',
      connection: 'Verbindung',
      order: 'Ordnung',
      shadow: 'Schatten',
    },
    axes: {
      shadow: 'Schatten',
      light: 'Licht',
      cold: 'Kühl',
      warm: 'Warm',
      surface: 'Fläche',
      depth: 'Tiefe',
      me: 'Ich',
      we: 'Wir',
      mind: 'Verstand',
      heart: 'Gefühl',
    },
    derived: {
      vitality: 'Vitalität',
      willpower: 'Willenskraft',
      chaos: 'Chaos',
      harmony: 'Harmonie',
    },
    banner: {
      title: 'Update nach Quiz',
    },
  },
}));

describe('CoreStatsCard', () => {
  it('should render all core stats with values', async () => {
    const { usePsycheProfile } = await import('@/hooks/usePsycheProfile');
    vi.mocked(usePsycheProfile).mockReturnValue(mockUsePsycheProfileReturn);

    render(<CoreStatsCard stats={COMPLETE_PROFILE.stats} />);

    expect(screen.getByText('Kernwerte')).toBeInTheDocument();
    expect(screen.getByText('Klarheit')).toBeInTheDocument();
    expect(screen.getByText('Mut')).toBeInTheDocument();
    expect(screen.getByText('Verbindung')).toBeInTheDocument();
    expect(screen.getByText('Ordnung')).toBeInTheDocument();
    expect(screen.getByText('Schatten')).toBeInTheDocument();
  });

  it('should render without deltas (graceful degradation)', async () => {
    const { usePsycheProfile } = await import('@/hooks/usePsycheProfile');
    vi.mocked(usePsycheProfile).mockReturnValue(mockUsePsycheProfileReturn);

    const { container } = render(<CoreStatsCard stats={MINIMAL_PROFILE.stats} />);
    expect(container).toBeInTheDocument();
    // Should not crash without deltas
  });

  it('should handle zero values', async () => {
    const { usePsycheProfile } = await import('@/hooks/usePsycheProfile');
    vi.mocked(usePsycheProfile).mockReturnValue(mockUsePsycheProfileReturn);

    const { container } = render(<CoreStatsCard stats={ALL_ZEROS_PROFILE.stats} />);
    expect(container).toBeInTheDocument();
  });

  it('should handle max values', async () => {
    const { usePsycheProfile } = await import('@/hooks/usePsycheProfile');
    vi.mocked(usePsycheProfile).mockReturnValue(mockUsePsycheProfileReturn);

    const { container } = render(<CoreStatsCard stats={ALL_MAX_PROFILE.stats} />);
    expect(container).toBeInTheDocument();
  });

  it('should display deltas when provided', async () => {
    const { usePsycheProfile } = await import('@/hooks/usePsycheProfile');
    vi.mocked(usePsycheProfile).mockReturnValue(mockUsePsycheProfileReturn);

    const deltas = {
      clarity: 0.05,
      shadow: -0.03,
    };
    const { container } = render(
      <CoreStatsCard stats={COMPLETE_PROFILE.stats} deltas={deltas} />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('ArchetypeStoryCard', () => {
  it('should render with complete archetype data', () => {
    render(
      <ArchetypeStoryCard
        archetype={COMPLETE_PROFILE.archetype_params?.dominant_archetype}
        secondary={COMPLETE_PROFILE.archetype_params?.secondary_archetypes}
        snippet={COMPLETE_PROFILE.narrative_snippet}
      />
    );

    expect(screen.getByText('The Sage')).toBeInTheDocument();
    expect(screen.getByText(/Du bewegst dich zwischen Weisheit/)).toBeInTheDocument();
  });

  it('should render with only archetype (no snippet)', () => {
    render(
      <ArchetypeStoryCard
        archetype="The Ruler"
        secondary={['The Hero']}
      />
    );

    expect(screen.getByText('The Ruler')).toBeInTheDocument();
  });

  it('should render with only snippet (no archetype)', () => {
    render(
      <ArchetypeStoryCard
        snippet="Eine einzigartige Reise."
      />
    );

    expect(screen.getByText(/Eine einzigartige Reise/)).toBeInTheDocument();
  });

  it('should not render when both archetype and snippet are missing', () => {
    const { container } = render(<ArchetypeStoryCard />);
    expect(container.firstChild).toBeNull();
  });

  it('should handle undefined secondary archetypes gracefully', () => {
    render(
      <ArchetypeStoryCard
        archetype="The Explorer"
        snippet="Auf der Suche."
      />
    );

    expect(screen.getByText('The Explorer')).toBeInTheDocument();
  });
});

describe('DerivedStatsCard', () => {
  it('should render all four derived stats', () => {
    const derivedStats = {
      vitality: 75,
      willpower: 68,
      chaos: 42,
      harmony: 85,
    };

    render(<DerivedStatsCard stats={derivedStats} />);

    expect(screen.getByText('Abgeleitete Werte')).toBeInTheDocument();
    expect(screen.getByText('Vitalität')).toBeInTheDocument();
    expect(screen.getByText('Willenskraft')).toBeInTheDocument();
    expect(screen.getByText('Chaos')).toBeInTheDocument();
    expect(screen.getByText('Harmonie')).toBeInTheDocument();

    // Check values are displayed
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('68')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('should handle zero values', () => {
    const derivedStats = {
      vitality: 0,
      willpower: 0,
      chaos: 0,
      harmony: 0,
    };

    render(<DerivedStatsCard stats={derivedStats} />);

    // Should display 0 for all stats
    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(4);
  });

  it('should handle max values', () => {
    const derivedStats = {
      vitality: 100,
      willpower: 100,
      chaos: 100,
      harmony: 100,
    };

    render(<DerivedStatsCard stats={derivedStats} />);

    const maxValues = screen.getAllByText('100');
    expect(maxValues).toHaveLength(4);
  });
});

describe('CharacterSheetPage - Integration with Missing Fields', () => {
  it('should render with complete profile', async () => {
    const { usePsycheProfile } = await import('@/hooks/usePsycheProfile');
    vi.mocked(usePsycheProfile).mockReturnValue({
      ...mockUsePsycheProfileReturn,
      profile: COMPLETE_PROFILE,
    });

    render(<CharacterSheetPage />);

    expect(screen.getByText('Dein Character Sheet')).toBeInTheDocument();
  });

  it('should render without archetype data', async () => {
    const { usePsycheProfile } = await import('@/hooks/usePsycheProfile');
    vi.mocked(usePsycheProfile).mockReturnValue({
      ...mockUsePsycheProfileReturn,
      profile: NO_ARCHETYPE_PROFILE,
    });

    const { container } = render(<CharacterSheetPage />);
    expect(container).toBeInTheDocument();
    // Should not crash
  });

  it('should render without narrative snippet', async () => {
    const { usePsycheProfile } = await import('@/hooks/usePsycheProfile');
    vi.mocked(usePsycheProfile).mockReturnValue({
      ...mockUsePsycheProfileReturn,
      profile: NO_NARRATIVE_PROFILE,
    });

    const { container } = render(<CharacterSheetPage />);
    expect(container).toBeInTheDocument();
  });

  it('should render without delta data', async () => {
    const { usePsycheProfile } = await import('@/hooks/usePsycheProfile');
    vi.mocked(usePsycheProfile).mockReturnValue({
      ...mockUsePsycheProfileReturn,
      profile: NO_DELTA_PROFILE,
    });

    const { container } = render(<CharacterSheetPage />);
    expect(container).toBeInTheDocument();
  });

  it('should render minimal profile without crashing', async () => {
    const { usePsycheProfile } = await import('@/hooks/usePsycheProfile');
    vi.mocked(usePsycheProfile).mockReturnValue({
      ...mockUsePsycheProfileReturn,
      profile: MINIMAL_PROFILE,
    });

    const { container } = render(<CharacterSheetPage />);
    expect(container).toBeInTheDocument();
  });

  it('should show loading state', async () => {
    const { usePsycheProfile } = await import('@/hooks/usePsycheProfile');
    vi.mocked(usePsycheProfile).mockReturnValue({
      ...mockUsePsycheProfileReturn,
      isLoading: true,
    });

    render(<CharacterSheetPage />);
    expect(screen.getByText(/Grimoire wird geöffnet/i)).toBeInTheDocument();
  });

  it('should show error state when profile fails to load', async () => {
    const { usePsycheProfile } = await import('@/hooks/usePsycheProfile');
    vi.mocked(usePsycheProfile).mockReturnValue({
      ...mockUsePsycheProfileReturn,
      error: new Error('Network error'),
    });

    render(<CharacterSheetPage />);
    expect(screen.getByText(/Fehler beim Laden des Profils/i)).toBeInTheDocument();
  });

  it('should show error state when profile is null', async () => {
    const { usePsycheProfile } = await import('@/hooks/usePsycheProfile');
    vi.mocked(usePsycheProfile).mockReturnValue(mockUsePsycheProfileReturn);

    render(<CharacterSheetPage />);
    expect(screen.getByText(/Fehler beim Laden des Profils/i)).toBeInTheDocument();
  });
});
