/**
 * API Module
 *
 * Server-side service layer and client-side API client.
 *
 * Service (server-side):
 * - contribute: Pure ingestion function for API routes
 * - contributeStrict: Throws on validation errors
 * - getSnapshot: Get profile snapshot from store
 *
 * Client (browser):
 * - contributeClient: Dual-mode client (auto-detects static vs API mode)
 * - getSnapshotClient: Dual-mode snapshot getter
 */

// Server-side service (for API routes)
export {
  contribute as contributeService,
  contributeStrict,
  getSnapshot as getSnapshotService,
  type ContributeRequest,
  type ContributeResult,
  type GetSnapshotResult as ServiceGetSnapshotResult,
  type Stores,
} from "./contribute-service";

// Client-side API (for UI components)
export {
  contribute as contributeClient,
  getSnapshot as getSnapshotClient,
  getProfileState,
  getClientMode,
  resetLocalProfile,
  type ContributeClientResult,
  type GetSnapshotResult as ClientGetSnapshotResult,
} from "./contribute-client";
