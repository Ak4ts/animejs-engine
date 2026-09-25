import type { Clock } from '@/application/ports/Clock'

/** Manually driven clock for deterministic tests. */
export class FakeClock implements Clock {
  #now: number

  constructor(startMs = 0) {
    this.#now = startMs
  }

  now(): number {
    return this.#now
  }

  advance(ms: number): void {
    if (ms < 0) throw new RangeError('FakeClock cannot go backwards')
    this.#now += ms
  }
}
