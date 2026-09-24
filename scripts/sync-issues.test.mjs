import { describe, expect, it } from 'vitest'
import { issueBody, parseTasks } from './sync-issues.mjs'

const markdown = [
  '# M9 — Exemplo',
  '',
  '- [x] **E9-1** `domain` Primeira task (#12)',
  '  - Aceite: algo verificável.',
  '  - Testes: unit + property.',
  '- [~] **E9-2** `infra`/`ui` Segunda `com código`',
  '- [ ] não é task',
  '- [ ] **E9-3** `ci` Terceira',
].join('\n')

describe('parseTasks', () => {
  const { title, tasks } = parseTasks(markdown)

  it('reads the milestone title', () => {
    expect(title).toBe('M9 — Exemplo')
  })

  it('parses ids, labels, issue refs and detail lines', () => {
    expect(tasks.map((t) => [t.id, t.labels, t.issue])).toEqual([
      ['E9-1', ['domain'], 12],
      ['E9-2', ['infra', 'ui'], null],
      ['E9-3', ['ci'], null],
    ])
    expect(tasks[0]?.details).toEqual(['Aceite: algo verificável.', 'Testes: unit + property.'])
    expect(tasks[0]?.text).toBe('Primeira task')
  })

  it('keeps the line index so the issue number can be written back', () => {
    expect(tasks[1]?.line).toBe(5)
  })
})

describe('issueBody', () => {
  it('includes details and points to the source and DoD', () => {
    const [task] = parseTasks(markdown).tasks
    const body = issueBody(task, 'M9 — Exemplo', 'M9.md')
    expect(body).toContain('- Testes: unit + property.')
    expect(body).toContain('docs/tasks/M9.md')
    expect(body).toContain('AGENTS.md')
  })
})
