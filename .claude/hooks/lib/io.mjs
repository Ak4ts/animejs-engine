// Shared plumbing for hook entrypoints (stdin payload, shell, persisted state).
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const stateDir = join(projectDir, '.claude', '.state')
const stateFile = join(stateDir, 'last-check.json')

export async function readPayload() {
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8').trim()
  return raw ? JSON.parse(raw) : {}
}

export function emit(json) {
  process.stdout.write(JSON.stringify(json))
}

/** Quotes one shell argument (paths may contain spaces). */
export const quote = (arg) => `"${String(arg).replaceAll('"', '\\"')}"`

/** Runs a full shell command line in the project dir. Never throws. */
export function run(commandLine) {
  const result = spawnSync(commandLine, {
    cwd: projectDir,
    encoding: 'utf8',
    shell: true,
    maxBuffer: 16 * 1024 * 1024,
  })
  return {
    ok: result.status === 0,
    output: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim(),
  }
}

export function readFileOr(path, fallback = '') {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    return fallback
  }
}

/** Project-relative, forward-slash path for any absolute or relative path. */
export function toProjectPath(filePath) {
  const posix = (p) => p.replaceAll('\\', '/')
  const root = posix(projectDir).replace(/\/$/, '')
  const path = posix(filePath)
  return path.toLowerCase().startsWith(`${root.toLowerCase()}/`)
    ? path.slice(root.length + 1)
    : path
}

export function currentBranch() {
  return run('git rev-parse --abbrev-ref HEAD').output.trim()
}

export function readState() {
  return existsSync(stateFile) ? JSON.parse(readFileOr(stateFile, 'null')) : null
}

export function writeState(state) {
  mkdirSync(stateDir, { recursive: true })
  writeFileSync(stateFile, JSON.stringify(state, null, 2))
}

/** Keeps the tail of long tool output so hook messages stay readable. */
export function tail(text, lines = 40) {
  return text.split('\n').slice(-lines).join('\n')
}
