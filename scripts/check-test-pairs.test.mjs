import { describe, expect, it } from 'vitest'
import { findMissingTests, isTypeOnly, needsTest, testPathFor } from './check-test-pairs.mjs'

describe('isTypeOnly', () => {
  it('accepts interfaces and type aliases, even with arrow function types', () => {
    const code = `import type { A } from './a'\nexport interface Port { run(): void; cb: (t: number) => void }\nexport type Id = string`
    expect(isTypeOnly(code)).toBe(true)
  })

  it.each([
    'export const x = 1',
    'export function f() {}',
    'export class C {}',
    'export enum E { A }',
    'export default {}',
    'export abstract class Base {}',
  ])('flags runtime code: %s', (code) => {
    expect(isTypeOnly(code)).toBe(false)
  })

  it('ignores runtime keywords inside comments', () => {
    expect(isTypeOnly('// const x = 1\n/* function f() {} */\nexport type T = 1')).toBe(true)
  })
})

describe('needsTest', () => {
  it('skips tests, index files and declaration files', () => {
    expect(needsTest('src/domain/a.test.ts', 'export const a = 1')).toBe(false)
    expect(needsTest('src/domain/index.ts', 'export const a = 1')).toBe(false)
    expect(needsTest('src/domain/a.d.ts', 'declare const a: number')).toBe(false)
  })

  it('skips files with a justified exemption marker', () => {
    expect(
      needsTest(
        'src/infrastructure/r.ts',
        '// @no-unit-test: WebGL, covered by visual\nexport class R {}',
      ),
    ).toBe(false)
  })

  it('does not accept an exemption without a reason', () => {
    expect(needsTest('src/infrastructure/r.ts', '// @no-unit-test:\nexport class R {}')).toBe(true)
  })
})

describe('findMissingTests', () => {
  const code = {
    'src/domain/a.ts': 'export const a = 1',
    'src/domain/b.ts': 'export const b = 1',
    'src/presentation/C.tsx': 'export function C() {}',
  }
  const read = (f) => code[f] ?? ''

  it('reports only files without a sibling test', () => {
    const files = [...Object.keys(code), 'src/domain/a.test.ts', 'src/presentation/C.test.tsx']
    expect(findMissingTests(files, read)).toEqual(['src/domain/b.ts'])
  })

  it('maps source to test path', () => {
    expect(testPathFor('src/presentation/C.tsx')).toBe('src/presentation/C.test.tsx')
  })
})
