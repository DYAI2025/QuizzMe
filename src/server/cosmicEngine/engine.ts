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
      // Helper: Initialize Local Engine (Python Bridge or Mock)
      // We lazily call this only if Cloud is not used or fails.
      const getLocalEngineInstance = async (): Promise<CosmicEngineInstance> => {
        let pythonEngine: CosmicEngineInstance | null = null;
        
        try {
            const require = createRequire(import.meta.url);
            // "cosmic-architecture-engine": "file:./vendor/cosmic-engine-v3_5"
            const cosmic = require("cosmic-architecture-engine") as {
                createEngine: (opts: any) => Promise<CosmicEngineInstance>;
            };

            const entry = require.resolve("cosmic-architecture-engine");
            const moduleDir = path.dirname(entry);

            const pythonPath = options.pythonPath ?? process.env.COSMIC_PYTHON_PATH ?? "python3";
            const scriptPath = options.scriptPath ?? process.env.COSMIC_PY_SCRIPT_PATH ?? path.resolve(
                moduleDir,
                "../astro-precision-horoscope/scripts/compute_horoscope.py"
            );
             
            const strictModeEnv = process.env.COSMIC_STRICT_MODE;
            const strictMode = options.strictMode ?? (strictModeEnv === "0" ? false : true);

            // Attempt to create Python engine
            pythonEngine = await cosmic.createEngine({
                strictMode,
                pythonPath,
                scriptPath,
            });
            
            if (process.env.COSMIC_FORCE_MOCK === "true") {
                throw new Error("Forcing Mock Engine via COSMIC_FORCE_MOCK env var");
            }
            
            if (pythonEngine.initialize) {
                await pythonEngine.initialize();
            }
        } catch (e) {
            console.error("[CosmicEngine] Failed to initialize local python bridge.", e);
            // Fallthrough to return wrapped mock below
        }

        // Import Mock Engine for fallback
        const { createMockEngine } = await import('./cosmic-fallback');
        const mockEngine = await createMockEngine();

        // Return a proxy engine that tries Python first, then Mock
        return {
            calculateProfile: async (input: any) => {
                if (pythonEngine) {
                    try {
                        return await pythonEngine.calculateProfile(input);
                    } catch (err: any) {
                        console.error("[CosmicEngine] Local Python execution failed:", err.message);
                        console.warn("[CosmicEngine] Switching to Mock Engine for this request.");
                    }
                }
                return mockEngine.calculateProfile(input);
            },
            initialize: async () => {
                // Already did what we could
            }
        };
      };

      // 1. Cloud Engine Logic with Fallback
      const cloudUrl = process.env.COSMIC_CLOUD_URL;
      console.log("[CosmicEngine] DEBUG: Resolved cloudUrl =", cloudUrl);

      
      // We keep a reference to a local fallback singleton if we ever need it.
      let fallbackEngine: CosmicEngineInstance | null = null;

      if (cloudUrl) {
          console.log("[CosmicEngine] Configured for Cloud Engine at:", cloudUrl);
          return {
              calculateProfile: async (input: any) => {
                  try {
                      // Attempt Cloud Calculation
                      const controller = new AbortController();
                      const id = setTimeout(() => controller.abort(), 10000); // 10s timeout

                      const response = await fetch(`${cloudUrl}/compute`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(input),
                          signal: controller.signal
                      });
                      clearTimeout(id);

                      if (!response.ok) {
                          throw new Error(`Cloud engine HTTP error: ${response.status}`);
                      }
                      
                      const data = await response.json();
                      return data;
                  } catch (err: any) {
                      // CLOUD FAILED -> FALLBACK
                      console.warn(`[CosmicEngine] Cloud calculation failed (${err.message}). Switching to Local Fallback.`);
                      
                      if (!fallbackEngine) {
                          fallbackEngine = await getLocalEngineInstance();
                      }
                      return fallbackEngine.calculateProfile(input);
                  }
              },
              initialize: async () => {
                  // Pre-warm fallback if desired? 
                  // No, keep it lazy to save resources if cloud works.
              }
          };
      }

      // 2. Default: Local only
      return getLocalEngineInstance();
    })();
  }

  return enginePromise;
}
