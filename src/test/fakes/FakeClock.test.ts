import { clockContract } from '../contracts/clock.contract'
import { FakeClock } from './FakeClock'

clockContract('FakeClock', () => {
  const clock = new FakeClock()
  return {
    clock,
    advance: (ms) => {
      clock.advance(ms)
    },
  }
})

describe('FakeClock', () => {
  it('starts at the given time', () => {
    expect(new FakeClock(500).now()).toBe(500)
  })

  it('rejects negative steps', () => {
    expect(() => {
      new FakeClock().advance(-1)
    }).toThrow(RangeError)
  })
})
