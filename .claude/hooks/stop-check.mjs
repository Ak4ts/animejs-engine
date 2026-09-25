// Stop: if code changed, run typecheck + related tests + test pairing.
// Warn-only by project decision: reports to the user and records state that
// inject-state.mjs hands to the model on the next prompt.
import { emit, quote, readPayload, run, tail, writeState } from './lib/io.mjs'

await readPayload()

const changed = run('git status --porcelain --untracked-files=all -- src scripts .claude/hooks')
  .output.split('\n')
  .map((line) => line.slice(3).trim().replace(/^"|"$/g, ''))
  .filter((file) => /\.(ts|tsx|mjs)$/.test(file))

if (changed.length === 0) process.exit(0)

const checks = [
  ['typecheck', run('pnpm typecheck')],
  ['tests (related)', run(`pnpm exec vitest related --run ${changed.map(quote).join(' ')}`)],
  ['check:tests', run('pnpm check:tests')],
]
const failed = checks.filter(([, result]) => !result.ok)

writeState({
  at: new Date().toISOString(),
  ok: failed.length === 0,
  changed,
  failures: failed.map(([name, result]) => ({ name, output: tail(result.output, 30) })),
})

if (failed.length > 0) {
  const names = failed.map(([name]) => name).join(', ')
  emit({
    systemMessage: `⚠ Checks falharam após este turno: ${names}. O modelo recebe o detalhe no próximo prompt.`,
  })
}
