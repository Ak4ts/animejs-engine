/**
 * Source of randomness. Injected so that renders are reproducible from a seed (ADR-0004).
 */
export interface Random {
  /** Uniform float in [0, 1). */
  next(): number
}
