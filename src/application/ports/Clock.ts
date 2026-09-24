/**
 * Source of time for the runtime. Domain and engine never read wall-clock time
 * directly (ADR-0004); they receive a Clock.
 * Adapters: realtime clock for the editor, frame clock for deterministic export.
 */
export interface Clock {
  /** Milliseconds elapsed since the clock started. Never decreases. */
  now(): number
}
