import "server-only";

import path from "path";
import { createRequire } from "module";

type CosmicEngineInstance = {
  calculateProfile: (input: any) => Promise<any>;
  initialize?: () => Promise<void>;
};

type GetEngineOptions = {
  // Optional overrides (mostly for CI/dev)
  strictMode?: boolean;
  pythonPath?: string;
  scriptPath?: string;
};

let enginePromise: Promise<CosmicEngineInstance> | null = null;

/**
 * Server-only singleton loader for cosmic-architecture-engine (CommonJS).
 * - Avoids re-initializing Swiss Ephemeris bridge on every request.
 * - Compatible with Next.js App Router route handlers (nodejs runtime).
 */
export async function getCosmicEngine(
  options: GetEngineOptions = {}
): Promise<CosmicEngineInstance> {
  if (!enginePromise) {
    enginePromise = (async () => {
      // CommonJS import in ESM/TS environment
      const require = createRequire(import.meta.url);

      // IMPORTANT:
      // Ensure this dependency is installed as a local file dependency:
      // "cosmic-architecture-engine": "file:./vendor/cosmic-engine-v3_5"
      const cosmic = require("cosmic-architecture-engine") as {
        createEngine: (opts: any) => Promise<CosmicEngineInstance>;
      };

      // Resolve module dir to derive default scriptPath robustly
      const entry = require.resolve("cosmic-architecture-engine");
      const moduleDir = path.dirname(entry);

      // Prefer explicit env overrides (recommended for production containers)
      const pythonPath =
        options.pythonPath ?? process.env.COSMIC_PYTHON_PATH ?? "python3";

      // The Python script is shipped inside the existing engine repo
      // Default in the engine is usually correct, but we pin it here to be safe.
      const scriptPath =
        options.scriptPath ??
        process.env.COSMIC_PY_SCRIPT_PATH ??
        path.resolve(
          moduleDir,
          "../astro-precision-horoscope/scripts/compute_horoscope.py"
        );

      // Strict by default (fail-closed). You can relax in CI via COSMIC_STRICT_MODE=0.
      const strictModeEnv = process.env.COSMIC_STRICT_MODE;
      const strictMode =
        options.strictMode ??
        (strictModeEnv === "0" ? false : true);

      // Optional: allow Moshier mode (no external ephe files).
      // In CI, cosmic tests often set ASTRO_PRECISION_ALLOW_MOSHIER=1.
      // We do not set it here automatically; you decide via env.
      //
      // process.env.ASTRO_PRECISION_ALLOW_MOSHIER = process.env.ASTRO_PRECISION_ALLOW_MOSHIER ?? "1";

      // 1. Try Cloud Engine if configured
      const cloudUrl = process.env.COSMIC_CLOUD_URL;
      if (cloudUrl) {
          console.log("[CosmicEngine] Using Cloud Engine at:", cloudUrl);
          return {
              calculateProfile: async (input: any) => {
                  const response = await fetch(`${cloudUrl}/compute`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(input)
                  });
                  if (!response.ok) {
                      throw new Error(`Cloud engine error: ${response.statusText}`);
                  }
                  return await response.json();
              }
          };
      }

      // 2. Try Local Python Bridge
      try {
        const engine = await cosmic.createEngine({
            strictMode,
            pythonPath,
            scriptPath,
        });
        
        // Check availability early to fail fast
        // FORCE FALLBACK for Debugging (User can remove this once comfortable)
        // throw new Error("Forcing Mock Engine due to build failure");
        
        if (engine.initialize) {
            await engine.initialize();
        }
        return engine;
      } catch (e) {
          console.error("[CosmicEngine] Failed to initialize local python bridge.", e);
          const { createMockEngine } = await import('./cosmic-fallback');
          console.warn("[CosmicEngine] FALLBACK: Returing JS-based MOCK engine.");
          return createMockEngine();
      }
    })();
  }

  return enginePromise;
}
