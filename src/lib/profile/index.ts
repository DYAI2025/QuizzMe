/**
 * Profile Module
 *
 * Internal state management and UI snapshot generation.
 *
 * Key distinction:
 * - ProfileState: Internal, mutable state with TraitState objects
 * - ProfileSnapshot: UI-ready, immutable with rendered scores
 */

export * from "./profile-state";
export * from "./snapshot";
