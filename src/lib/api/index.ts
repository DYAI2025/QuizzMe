/**
 * API Service Layer
 *
 * Pure business logic for API endpoints.
 * No Next.js dependencies - can be tested independently.
 */

export {
  contribute,
  contributeStrict,
  getSnapshot,
  type ContributeRequest,
  type ContributeResult,
  type GetSnapshotResult,
  type Stores,
} from "./contribute-service";
