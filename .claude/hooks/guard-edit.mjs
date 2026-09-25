// PreToolUse (Edit|Write|MultiEdit): blocks protected files and forbidden patterns.
import { isAbsolute, join } from 'node:path'
import { emit, projectDir, readFileOr, readPayload, toProjectPath } from './lib/io.mjs'
import { checkEdit } from './lib/rules.mjs'

const payload = await readPayload()
const input = payload.tool_input ?? {}
const filePath = String(input.file_path ?? '')
const absolute = isAbsolute(filePath) ? filePath : join(projectDir, filePath)

const reason = checkEdit({
  toolName: payload.tool_name,
  input: { ...input, file_path: toProjectPath(absolute) },
  before: readFileOr(absolute),
})

if (reason) {
  emit({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: `[guardrail] ${reason}`,
    },
  })
}
