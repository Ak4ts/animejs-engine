// Pure guardrail rules used by the Claude Code hooks. Every rule here is unit tested
// in rules.test.mjs — change the tests first when changing a rule.

const PROTECTED_PATHS = [
  {
    pattern: /(^|\/)pnpm-lock\.yaml$/,
    reason: 'pnpm-lock.yaml is generated. Use `pnpm add/remove`.',
  },
  { pattern: /(^|\/)dist\//, reason: 'dist/ is build output.' },
  { pattern: /(^|\/)coverage\//, reason: 'coverage/ is generated.' },
  { pattern: /(^|\/)\.env(\.|$)/, reason: '.env files may hold secrets and are off limits.' },
]

const CONTENT_RULES = [
  {
    pattern: /\b(?:it|test|describe)\.only\s*\(/,
    reason: 'Focused test (`.only`) would silently skip the rest of the suite.',
  },
  {
    pattern: /@ts-(?:ignore|nocheck)\b/,
    reason: 'Do not silence the type checker. Fix the type, or use `@ts-expect-error -- <reason>`.',
  },
  {
    pattern: /@ts-expect-error(?![ \t]*--[ \t]*\S)/,
    reason: '`@ts-expect-error` needs a justification: `// @ts-expect-error -- <reason>`.',
  },
  {
    pattern: /eslint-disable[^\n]*boundaries\//,
    reason:
      'Layer boundaries cannot be disabled. Move the code to the right layer or add a port (docs/ARCHITECTURE.md).',
  },
  {
    pattern: /eslint-disable(?:-next-line|-line)?(?![^\n]*--[ \t]*\S)/,
    reason: 'eslint-disable needs a reason: `// eslint-disable-next-line <rule> -- <reason>`.',
  },
]

const toPosix = (path) => path.replaceAll('\\', '/')

/**
 * Reconstructs the file content after an Edit/Write/MultiEdit tool call.
 * @param {string} toolName
 * @param {Record<string, unknown>} input tool_input from the hook payload
 * @param {string} before current file content ('' if missing)
 */
export function contentAfter(toolName, input, before) {
  if (toolName === 'Write') return String(input.content ?? '')
  const edits = toolName === 'MultiEdit' ? (input.edits ?? []) : [input]
  return edits.reduce(
    (text, edit) =>
      edit.replace_all
        ? text.split(String(edit.old_string)).join(String(edit.new_string))
        : text.replace(String(edit.old_string), String(edit.new_string)),
    before,
  )
}

/** Text the model is adding in this call (only new text is checked, not pre-existing code). */
export function addedText(toolName, input) {
  if (toolName === 'Write') return String(input.content ?? '')
  const edits = toolName === 'MultiEdit' ? (input.edits ?? []) : [input]
  return edits.map((e) => String(e.new_string ?? '')).join('\n')
}

const thresholds = (text) => [...text.matchAll(/layerThreshold\((\d+)\)/g)].map((m) => Number(m[1]))

/** Coverage floors in vite.config.ts may only go up. */
export function lowersCoverage(before, after) {
  const was = thresholds(before)
  const now = thresholds(after)
  if (was.length === 0) return false
  if (now.length < was.length) return true
  return now.some((value, i) => value < (was[i] ?? 0))
}

/**
 * @returns {string | null} deny reason, or null to allow
 */
export function checkEdit({ toolName, input, before }) {
  const path = toPosix(String(input.file_path ?? ''))
  for (const { pattern, reason } of PROTECTED_PATHS) {
    if (pattern.test(path)) return `Protected file: ${reason}`
  }

  const added = addedText(toolName, input)
  // Only code is checked; docs explain the patterns, and the guardrail sources define them.
  const isCode = /\.(ts|tsx|js|mjs|cjs)$/.test(path)
  const isGuardrailSource = /\.claude\/hooks\//.test(path)
  if (isCode && !isGuardrailSource) {
    for (const { pattern, reason } of CONTENT_RULES) {
      if (pattern.test(added)) return reason
    }
  }

  if (/(^|\/)vite\.config\.ts$/.test(path)) {
    if (lowersCoverage(before, contentAfter(toolName, input, before))) {
      return 'Coverage thresholds may only go up (docs/TESTING.md). Add tests instead.'
    }
  }
  return null
}

const SAFE_RM_TARGETS =
  /^(?:\.\/)?(?:node_modules|dist|coverage|test-results|playwright-report|\.claude\/\.state)\/?$/

/**
 * @param {string} command
 * @param {string} currentBranch
 * @returns {string | null} deny reason, or null to allow
 */
export function checkBash(command, currentBranch) {
  for (const segment of command.split(/&&|\|\||;|\n/)) {
    const cmd = segment.trim()

    if (/\bgit\b.*\s--no-verify\b/.test(cmd)) return 'Never skip git hooks (--no-verify).'

    if (/\bgit\s+push\b/.test(cmd)) {
      if (/\s(?:--force(?!-with-lease)|-f)\b/.test(cmd)) {
        return 'Force push is not allowed. Use --force-with-lease on your own branch if needed.'
      }
      const pushesMainExplicitly = /\s(?:\S+:)?(?:main|master)\s*$/.test(cmd)
      const pushesFromMain =
        /^git\s+push(?:\s+-u)?(?:\s+origin)?\s*$/.test(cmd) && /^(main|master)$/.test(currentBranch)
      if (pushesMainExplicitly || pushesFromMain) {
        return 'Do not push to main. Push a feature branch and open a PR.'
      }
    }

    // Any recursive rm (-r, -R, -rf, --recursive), with or without -f.
    const rm = cmd.match(/\brm\s+((?:-\S+\s+)+)(.+)$/)
    if (rm && /(?:^|\s)(?:-\w*[rR]\w*|--recursive)(?=\s)/.test(rm[1])) {
      const targets = rm[2].split(/\s+/).filter(Boolean)
      const unsafe = targets.filter((t) => !SAFE_RM_TARGETS.test(t.replace(/^["']|["']$/g, '')))
      if (unsafe.length > 0)
        return `Recursive rm is limited to generated folders. Refused: ${unsafe.join(', ')}. Delete files explicitly instead.`
    }
  }
  return null
}
