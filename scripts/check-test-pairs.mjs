#!/usr/bin/env node
// Fails when a production source file has no sibling test (docs/TESTING.md).
// Exempt: index files, .d.ts, type-only modules, and files declaring
// `// @no-unit-test: <reason>` (e.g. WebGL adapters covered by visual tests).
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export const LAYER_DIRS = [
  'src/domain',
  'src/application',
  'src/engine',
  'src/infrastructure',
  'src/presentation',
]

const SOURCE = /\.(ts|tsx)$/
const TEST = /\.test\.(ts|tsx)$/
const EXEMPT_MARKER = /^[ \t]*\/\/[ \t]*@no-unit-test:[ \t]*\S+/m
const RUNTIME_DECLARATION =
  /^\s*(export\s+)?(default\s+)?(declare\s+)?(async\s+)?(abstract\s+)?(function|class|const|let|var|enum)\b|^\s*export\s+default\b/m

const stripComments = (code) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')

/** True when a module only declares types (nothing exists at runtime to test). */
export function isTypeOnly(code) {
  return !RUNTIME_DECLARATION.test(stripComments(code))
}

export function needsTest(path, code) {
  if (!SOURCE.test(path) || TEST.test(path)) return false
  if (path.endsWith('.d.ts') || /(^|\/)index\.tsx?$/.test(path)) return false
  if (EXEMPT_MARKER.test(code)) return false
  return !isTypeOnly(code)
}

export function testPathFor(path) {
  return path.replace(/\.(ts|tsx)$/, '.test.$1')
}

/**
 * @param {string[]} files repo-relative, forward-slash paths
 * @param {(path: string) => string} readFile
 * @returns {string[]} source files missing a sibling test
 */
export function findMissingTests(files, readFile) {
  const present = new Set(files)
  return files.filter((file) => {
    if (!needsTest(file, readFile(file))) return false
    const expected = testPathFor(file)
    return !present.has(expected) && !present.has(expected.replace(/\.test\.ts$/, '.test.tsx'))
  })
}

function walk(dir) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return []
  }
  return entries.flatMap((name) => {
    const full = join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

function main(root) {
  const files = LAYER_DIRS.flatMap((dir) => walk(join(root, dir))).map((f) =>
    relative(root, f).split(sep).join('/'),
  )
  const missing = findMissingTests(files, (f) => readFileSync(join(root, f), 'utf8'))
  if (missing.length === 0) {
    console.log(`check-test-pairs: ok (${files.length} files scanned)`)
    return 0
  }
  console.error('check-test-pairs: production files without a sibling test:')
  for (const file of missing) console.error(`  - ${file}  →  create ${testPathFor(file)}`)
  console.error('If a unit test is truly impossible, add `// @no-unit-test: <reason>` at the top.')
  return 1
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.cwd())
}
