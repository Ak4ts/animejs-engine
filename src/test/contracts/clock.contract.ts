import type { Clock } from '@/application/ports/Clock'

/**
 * Contract every Clock adapter must satisfy.
 * Usage in an adapter test: `clockContract('RafClock', () => ({ clock, advance }))`.
 */
export interface ClockHarness {
  clock: Clock
  /** Makes time pass for this adapter by `ms` milliseconds. */
  advance: (ms: number) => void
}

export function clockContract(name: string, makeHarness: () => ClockHarness) {
  describe(`Clock contract: ${name}`, () => {
    it('starts at a non-negative time', () => {
      const { clock } = makeHarness()
      expect(clock.now()).toBeGreaterThanOrEqual(0)
    })

    it('never goes backwards', () => {
      const { clock, advance } = makeHarness()
      const samples: number[] = []
      for (const step of [0, 1, 16, 0, 1000]) {
        advance(step)
        samples.push(clock.now())
      }
      expect(samples).toEqual([...samples].sort((a, b) => a - b))
    })

    it('reflects the time that has passed', () => {
      const { clock, advance } = makeHarness()
      const start = clock.now()
      advance(250)
      expect(clock.now() - start).toBeCloseTo(250, 0)
    })
  })
}
