import { describe, expect, it } from 'vitest'
import { addedText, checkBash, checkEdit, contentAfter, lowersCoverage } from './rules.mjs'

const write = (file_path, content, before = '') => ({
  toolName: 'Write',
  input: { file_path, content },
  before,
})
const edit = (file_path, old_string, new_string, before) => ({
  toolName: 'Edit',
  input: { file_path, old_string, new_string },
  before,
})

describe('checkEdit — protected paths', () => {
  it.each([
    'pnpm-lock.yaml',
    'C:\\repo\\pnpm-lock.yaml',
    'dist/index.js',
    '.env',
    '.env.local',
    'coverage/index.html',
  ])('denies %s', (path) => {
    expect(checkEdit(write(path, 'x'))).toMatch(/Protected file/)
  })

  it('allows regular source files', () => {
    expect(checkEdit(write('src/domain/a.ts', 'export const a = 1'))).toBeNull()
  })

  it('does not treat .envrc-like names inside words as env files', () => {
    expect(checkEdit(write('src/environment.ts', 'export {}'))).toBeNull()
  })
})

describe('checkEdit — content rules', () => {
  it.each([
    ['it.only(', /Focused test/],
    ['describe.only (', /Focused test/],
    ['// @ts-ignore', /type checker/],
    ['// @ts-nocheck', /type checker/],
    ['// @ts-expect-error', /justification/],
    ['// eslint-disable-next-line no-console', /needs a reason/],
    ['/* eslint-disable */', /needs a reason/],
    ['// eslint-disable-next-line boundaries/dependencies -- because', /boundaries cannot/],
  ])('denies %s', (snippet, reason) => {
    expect(checkEdit(write('src/a.ts', snippet))).toMatch(reason)
  })

  it.each([
    '// eslint-disable-next-line no-console -- CLI output',
    '// @ts-expect-error -- testing invalid input',
    'it("only when ready", () => {})',
  ])('allows %s', (snippet) => {
    expect(checkEdit(write('src/a.ts', snippet))).toBeNull()
  })

  it('only checks text being added, not pre-existing code', () => {
    const before = 'it.only(legacy)\nconst a = 1'
    expect(checkEdit(edit('src/a.test.ts', 'const a = 1', 'const a = 2', before))).toBeNull()
  })

  it('exempts the guardrail sources themselves', () => {
    expect(checkEdit(write('.claude/hooks/lib/rules.test.mjs', 'it.only('))).toBeNull()
  })

  it('does not check documentation, which explains the forbidden patterns', () => {
    expect(checkEdit(write('docs/TESTING.md', 'Never commit `it.only(`'))).toBeNull()
  })
})

describe('coverage thresholds', () => {
  const config = "'src/domain/**': layerThreshold(95),\n'src/presentation/**': layerThreshold(70),"

  it('detects lowered, removed and kept thresholds', () => {
    expect(lowersCoverage(config, config.replace('95', '90'))).toBe(true)
    expect(lowersCoverage(config, config.split('\n')[0] ?? '')).toBe(true)
    expect(lowersCoverage(config, config.replace('70', '75'))).toBe(false)
    expect(lowersCoverage('', 'anything')).toBe(false)
  })

  it('denies an Edit on vite.config.ts that lowers a floor', () => {
    const call = edit('vite.config.ts', 'layerThreshold(95)', 'layerThreshold(50)', config)
    expect(checkEdit(call)).toMatch(/only go up/)
  })

  it('allows raising a floor', () => {
    const call = edit('vite.config.ts', 'layerThreshold(70)', 'layerThreshold(80)', config)
    expect(checkEdit(call)).toBeNull()
  })
})

describe('contentAfter / addedText', () => {
  it('applies MultiEdit edits in order, honoring replace_all', () => {
    const input = {
      edits: [
        { old_string: 'a', new_string: 'b', replace_all: true },
        { old_string: 'bc', new_string: 'X' },
      ],
    }
    expect(contentAfter('MultiEdit', input, 'aac')).toBe('bX')
    expect(addedText('MultiEdit', input)).toBe('b\nX')
  })
})

describe('checkBash', () => {
  it.each([
    ['git push --force', 'feat/x'],
    ['git push -f origin feat/x', 'feat/x'],
    ['git push origin main', 'feat/x'],
    ['git push origin HEAD:main', 'feat/x'],
    ['git push', 'main'],
    ['git push -u origin', 'main'],
    ['git commit --no-verify -m x', 'feat/x'],
    ['pnpm test && git push --force', 'feat/x'],
    ['rm -rf src', 'feat/x'],
    ['rm -rf node_modules /', 'feat/x'],
    ['rm -fr ~', 'feat/x'],
    ['rm -r src/domain', 'feat/x'],
    ['rm -R docs', 'feat/x'],
    ['rm --recursive src', 'feat/x'],
    ['rm -v -r src', 'feat/x'],
  ])('denies `%s` on %s', (command, branch) => {
    expect(checkBash(command, branch)).not.toBeNull()
  })

  it.each([
    ['git push -u origin feat/x', 'feat/x'],
    ['git push --force-with-lease origin feat/x', 'feat/x'],
    ['git push', 'feat/x'],
    ['rm -rf node_modules dist coverage', 'main'],
    ['rm -rf ./dist', 'main'],
    ['rm src/domain/probe/a.ts', 'main'],
    ['rm -f src/domain/probe/a.ts', 'main'],
    ['pnpm verify', 'main'],
    ['git checkout main', 'feat/x'],
  ])('allows `%s` on %s', (command, branch) => {
    expect(checkBash(command, branch)).toBeNull()
  })
})
