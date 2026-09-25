// SessionStart: orient the model — branch, tasks in progress, last check status.
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { currentBranch, emit, projectDir, readFileOr, readPayload, readState } from './lib/io.mjs'

await readPayload()

const tasksDir = join(projectDir, 'docs', 'tasks')
let inProgress = []
try {
  inProgress = readdirSync(tasksDir)
    .filter((file) => file.endsWith('.md'))
    .flatMap((file) =>
      readFileOr(join(tasksDir, file))
        .split('\n')
        .filter((line) => line.startsWith('- [~]'))
        .map((line) => `${line.slice(6)} (docs/tasks/${file})`),
    )
} catch {
  // docs/tasks does not exist yet
}

const state = readState()
const lines = [
  `Branch: ${currentBranch()}`,
  inProgress.length > 0
    ? `Tasks in progress:\n${inProgress.map((task) => `- ${task}`).join('\n')}`
    : 'No task in progress. Use /task <ID> to start one (docs/ROADMAP.md).',
  state
    ? `Last automatic check: ${state.ok ? 'passing' : 'FAILING (details arrive with the next prompt)'}`
    : '',
].filter(Boolean)

emit({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: lines.join('\n') } })
