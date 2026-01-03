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

                      // Map Internal Input to Cloud API Payload
                      const pad = (n: number) => String(n).padStart(2, '0');
                      const cloudPayload = {
                          birth_date: `${input.year}-${pad(input.month)}-${pad(input.day)}`,
                          birth_time: `${pad(input.hour)}:${pad(input.minute)}:${pad(input.second || 0)}`,
                          birth_location: {
                              lat: Number(input.latitude),
                              lon: Number(input.longitude)
                          },
                          iana_time_zone: input.iana_time_zone || input.timezone || 'UTC',
                          house_system: input.houseSystem || 'P',
                          strict_mode: false
                      };

                      const response = await fetch(`${cloudUrl}/compute`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(cloudPayload),
                          signal: controller.signal
                      });
                      clearTimeout(id);

                      if (!response.ok) {
                          const errText = await response.text();
                          throw new Error(`Cloud engine HTTP error: ${response.status} - ${errText}`);
                      }
                      
                      const data = await response.json();
                      
                      // HYBRID ENGINE: Enhance Cloud Data with Local Ba Zi & Fusion
                      try {
                          // Import dynamically to avoid heavy load if not needed? 
                          // Or standard import. Let's assume standard import at top, or dynamic here to keep closure clean.
                          const { calculateBaZi } = await import('./bazi');
                          const { calculateFusion } = await import('./fusion');
                          
                          // Cloud Data Mapping
                          // Cloud returns: { planets: { Sun: { longitude: ... } }, houses: ... }
                          const sunLon = data.planets?.Sun?.longitude || 0;
                          
                          // Safe extracting of numeric input
                          const year = Number(input.year);
                          const month = Number(input.month);
                          const day = Number(input.day);
                          const hour = Number(input.hour);
                          const minute = Number(input.minute);
                          const lat = Number(input.latitude);
                          const lon = Number(input.longitude);
                          const tzOffset = 0; // TODO: If input has offset? But Cloud uses 'iana_time_zone'. 
                          // The `bazi` logic needs offset to compute UTC. 
                          // `input` to engine typically has raw local time + timezone info.
                          // If `input` has `timezone` string (e.g. Europe/Berlin), we might need to resolve it locally?
                          // OR rely on the fact that `calculateBaZi` reconstructs UTC.
                          // Wait. We need the offset (e.g. 60 mins) to get UTC from Local.
                          // Cloud response `audit` usually contains `utc_offset_minutes`.
                          const auditOffset = data.audit?.utc_offset_minutes || 0;
                          
                          const baziChart = calculateBaZi(
                              year, month, day, hour, minute, 
                              lon, auditOffset, sunLon
                          );
                          
                          const fusionResult = calculateFusion(baziChart, data.planets);
                          
                          return {
                              ...data,
                              bazi: baziChart,
                              fusion: fusionResult,
                              hybrid: true
                          };
                          
                      } catch (hybridErr) {
                          console.error("[CosmicEngine] Hybrid enhancement failed:", hybridErr);
                          // Fallback: return cloud data only (better than crash)
                          return data;
                      }
                  } catch (err: any) {
                      // CLOUD FAILED -> FALLBACK
                      console.warn(`[CosmicEngine] Cloud calculation failed (${err.message}). Switching to Local Fallback.`);
                      
                      if (!fallbackEngine) {
                          fallbackEngine = await getLocalEngineInstance();
                      }
                      const fallbackResult = await fallbackEngine.calculateProfile(input);
                      return fallbackResult;
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
