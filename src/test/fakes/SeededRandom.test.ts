import fc from 'fast-check'
import { SeededRandom } from './SeededRandom'

const take = (random: SeededRandom, n: number) => Array.from({ length: n }, () => random.next())

describe('SeededRandom', () => {
  it('produces the same sequence for the same seed', () => {
    fc.assert(
      fc.property(fc.integer(), (seed) => {
        expect(take(new SeededRandom(seed), 5)).toEqual(take(new SeededRandom(seed), 5))
      }),
    )
  })

  it('always returns values in [0, 1)', () => {
    fc.assert(
      fc.property(fc.integer(), (seed) => {
        for (const value of take(new SeededRandom(seed), 20)) {
          expect(value).toBeGreaterThanOrEqual(0)
          expect(value).toBeLessThan(1)
        }
      }),
    )
  })

  it('differs between seeds', () => {
    expect(new SeededRandom(1).next()).not.toBe(new SeededRandom(2).next())
  })
})
