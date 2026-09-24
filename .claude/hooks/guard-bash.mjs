// PreToolUse (Bash|PowerShell): blocks force pushes, pushes to main, --no-verify, broad rm -rf.
import { currentBranch, emit, readPayload } from './lib/io.mjs'
import { checkBash } from './lib/rules.mjs'

const payload = await readPayload()
const command = String(payload.tool_input?.command ?? '')
const reason = checkBash(command, currentBranch())

if (reason) {
  emit({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: `[guardrail] ${reason}`,
    },
  })
}
