// UserPromptSubmit: if the last Stop check failed, tell the model before it continues.
import { emit, readPayload, readState } from './lib/io.mjs'

await readPayload()
const state = readState()

if (state && !state.ok) {
  const details = state.failures.map((f) => `### ${f.name}\n${f.output}`).join('\n\n')
  emit({
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: `The automatic checks at the end of your last turn FAILED (${state.at}). Fix these before or alongside the new request:\n\n${details}`,
    },
  })
}
