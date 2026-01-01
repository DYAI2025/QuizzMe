import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';

// Mock server-only
vi.mock('server-only', () => ({}));

// 1. Define the mock factory for the engine dependency
const mockCreateEngine = vi.fn();

// 2. Intercept the `createRequire` call used in engine.ts
vi.mock('module', async (importOriginal) => {
    const actual: any = await importOriginal();
    return {
        ...actual,
        createRequire: () => {
             // Return a mock 'require' function
             const requireMock = (id: string) => {
                 if (id === 'cosmic-architecture-engine') {
                     return { createEngine: mockCreateEngine };
                 }
                 if (id === 'path') return require('path');
                 // Fallback for other requires if necessary, or throw
                 return {};
             };
             // Also need to mock require.resolve for path.dirname(entry)
             requireMock.resolve = (id: string) => {
                 if (id === 'cosmic-architecture-engine') return '/mock/path/index.js';
                 return '';
             };
             return requireMock;
        }
    };
});

describe('CosmicEngine Loading Logic', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...originalEnv };
        vi.clearAllMocks();
        mockCreateEngine.mockReset();
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.restoreAllMocks();
    });

    it('attempts to load real engine and gracefully falls back when missing', async () => {
        // In this test env, the real engine is missing (no python), so it should fail and fallback.
        // We verify this flow works.

        // We assert that it falls back to the MOCK engine.
        // We mock the fallback to be sure we hit IT and not the real fallback logic
        vi.doMock('../cosmic-fallback', () => ({
            createMockEngine: vi.fn().mockReturnValue({
                calculateProfile: vi.fn().mockResolvedValue({ status: 'fallback_mock' })
            })
        }));

        const { getCosmicEngine } = await import('../engine');
        const engine = await getCosmicEngine();
        const result = await engine.calculateProfile({});
        
        expect(result.status).toBe('fallback_mock');
    });

    it('forces mock engine when COSMIC_FORCE_MOCK is "true"', async () => {
        process.env.COSMIC_FORCE_MOCK = 'true';
        
        // Even if the real engine WOULD work, we shouldn't use it.
        // But the code instantiates it first then throws/checks env? 
        // No, current logic checks env AFTER createEngine? 
        // Wait, looking at engine.ts: 
        // It checks env inside the `try` block AFTER `createEngine`.
        // So `createEngine` is still called.
        
        mockCreateEngine.mockResolvedValue({
             initialize: vi.fn(),
             calculateProfile: vi.fn()
        });

        // We need to mock the fallback module too
        vi.doMock('../cosmic-fallback', () => ({
            createMockEngine: vi.fn().mockReturnValue({
                calculateProfile: vi.fn().mockResolvedValue({ status: 'mock' })
            })
        }));

        const { getCosmicEngine } = await import('../engine');
        const engine = await getCosmicEngine();
        const result = await engine.calculateProfile({});

        expect(result.status).toBe('mock');
    });

    it('uses Cloud Engine when COSMIC_CLOUD_URL is set', async () => {
        process.env.COSMIC_CLOUD_URL = 'https://my-cosmic-cloud.fly.dev';
        
        // Mock global fetch
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ status: 'cloud' })
        });
        global.fetch = fetchMock;

        const { getCosmicEngine } = await import('../engine');
        const engine = await getCosmicEngine();
        const result = await engine.calculateProfile({});

        expect(fetchMock).toHaveBeenCalledWith(
            'https://my-cosmic-cloud.fly.dev/compute', 
            expect.anything()
        );
        expect(result.status).toBe('cloud');
    });

    it('falls back to mock engine if real engine logic fails', async () => {
        mockCreateEngine.mockRejectedValue(new Error('Import failed'));
        
        vi.doMock('../cosmic-fallback', () => ({
            createMockEngine: vi.fn().mockReturnValue({
                calculateProfile: vi.fn().mockResolvedValue({ status: 'mock' })
            })
        }));

        const { getCosmicEngine } = await import('../engine');
        const engine = await getCosmicEngine();
        const result = await engine.calculateProfile({});

        expect(result.status).toBe('mock');
    });
});
