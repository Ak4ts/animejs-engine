// PostToolUse (Edit|Write|MultiEdit): format + lint the touched file and feed problems
// back to the model immediately; remind about missing sibling tests.
import { existsSync } from 'node:fs'
import { isAbsolute, join } from 'node:path'
import { needsTest, testPathFor } from '../../scripts/check-test-pairs.mjs'
import {
  emit,
  projectDir,
  quote,
  readFileOr,
  readPayload,
  run,
  tail,
  toProjectPath,
} from './lib/io.mjs'

const payload = await readPayload()
const filePath = String(payload.tool_input?.file_path ?? '')
const absolute = isAbsolute(filePath) ? filePath : join(projectDir, filePath)
const rel = toProjectPath(absolute)

const insideProject = !isAbsolute(rel) && !/^[a-zA-Z]:/.test(rel) && !rel.startsWith('..')
if (!insideProject || !existsSync(absolute)) process.exit(0)

if (/\.(ts|tsx|js|mjs|json|md|css|ya?ml)$/.test(rel)) {
  run(`pnpm exec prettier --write --log-level silent ${quote(rel)}`)
}

const messages = []
if (/\.(ts|tsx|js|mjs)$/.test(rel)) {
  const lint = run(`pnpm exec eslint ${quote(rel)}`)
  if (!lint.ok)
    messages.push(`ESLint found problems in ${rel}. Fix them now:\n${tail(lint.output)}`)
}

const layerFile = /^src\/(domain|application|engine|infrastructure|presentation)\//.test(rel)
if (layerFile && needsTest(rel, readFileOr(absolute))) {
  const testPath = testPathFor(rel)
  const tsxTest = testPath.replace(/\.test\.ts$/, '.test.tsx')
  if (!existsSync(join(projectDir, testPath)) && !existsSync(join(projectDir, tsxTest))) {
    messages.push(
      `Reminder: ${rel} has no sibling test. Create ${testPath} (docs/TESTING.md) before finishing.`,
    )
  }
}

if (messages.length > 0) emit({ decision: 'block', reason: messages.join('\n\n') })
