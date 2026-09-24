#!/usr/bin/env node
// Mirrors docs/tasks/M*.md into GitHub milestones + issues and writes `(#n)` back
// into the markdown. Idempotent: tasks that already end with `(#n)` are skipped.
// Usage: pnpm tasks:sync [--dry]
import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const TASK_LINE = /^- \[[ ~x]\] \*\*(E\d+-\d+)\*\* ((?:`[a-z]+`\/?)+) (.+?)( \(#\d+\))?$/

export const LABEL_COLORS = {
  domain: '5319e7',
  app: '1d76db',
  infra: 'fbca04',
  engine: 'd93f0b',
  ui: '0e8a16',
  backend: '000000',
  docs: 'c5def5',
  ci: 'bfdadc',
}

/**
 * Parses a milestone markdown file.
 * @returns {{ title: string, tasks: Array<{ line: number, id: string, labels: string[], text: string, details: string[], issue: number | null }> }}
 */
export function parseTasks(markdown) {
  const lines = markdown.split('\n')
  const title = (lines[0] ?? '').replace(/^#\s*/, '').trim()
  const tasks = []
  lines.forEach((raw, index) => {
    const match = raw.match(TASK_LINE)
    if (!match) return
    const [, id, labelPart, text, issueRef] = match
    const details = []
    for (let j = index + 1; j < lines.length && /^\s{2,}- /.test(lines[j]); j++) {
      details.push(lines[j].trim().replace(/^- /, ''))
    }
    tasks.push({
      line: index,
      id,
      labels: [...labelPart.matchAll(/`([a-z]+)`/g)].map((m) => m[1]),
      text,
      details,
      issue: issueRef ? Number(issueRef.match(/\d+/)[0]) : null,
    })
  })
  return { title, tasks }
}

export function issueBody(task, milestoneTitle, file) {
  return [
    `Task **${task.id}** — ${milestoneTitle}`,
    '',
    task.text,
    '',
    ...(task.details.length
      ? ['### Detalhes / aceite / testes', ...task.details.map((d) => `- ${d}`), '']
      : []),
    `Fonte: \`docs/tasks/${file}\` · Definition of Done: \`AGENTS.md\``,
  ].join('\n')
}

function main({ root, repo, dry }) {
  const gh = (args, input) => {
    if (dry) {
      console.log('gh', args.join(' '))
      return 'https://github.com/dry/run/issues/0'
    }
    return execFileSync('gh', args, { encoding: 'utf8', input }).trim()
  }

  for (const [name, color] of Object.entries(LABEL_COLORS)) {
    gh(['label', 'create', name, '--repo', repo, '--color', color, '--force'])
  }
  const milestones = dry
    ? []
    : JSON.parse(gh(['api', `repos/${repo}/milestones?state=all&per_page=100`]))

  const tasksDir = join(root, 'docs', 'tasks')
  for (const file of readdirSync(tasksDir)
    .filter((f) => /^M\d.*\.md$/.test(f))
    .sort()) {
    const path = join(tasksDir, file)
    const markdown = readFileSync(path, 'utf8')
    const { title, tasks } = parseTasks(markdown)
    const pending = tasks.filter((t) => t.issue === null)
    if (pending.length === 0) continue

    if (!milestones.some((m) => m.title === title)) {
      gh([
        'api',
        `repos/${repo}/milestones`,
        '-f',
        `title=${title}`,
        '-f',
        `description=Ver docs/tasks/${file}`,
      ])
      milestones.push({ title })
    }

    const lines = markdown.split('\n')
    for (const task of pending) {
      const url = gh(
        [
          'issue',
          'create',
          '--repo',
          repo,
          '--title',
          `${task.id} ${task.text.replaceAll('`', '')}`,
          '--milestone',
          title,
          ...task.labels.flatMap((l) => ['--label', l]),
          '--body-file',
          '-',
        ],
        issueBody(task, title, file),
      )
      lines[task.line] = `${lines[task.line]} (#${url.split('/').pop()})`
      console.log(`${task.id} -> ${url}`)
    }
    if (!dry) writeFileSync(path, lines.join('\n'))
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const repo = execFileSync(
    'gh',
    ['repo', 'view', '--json', 'nameWithOwner', '-q', '.nameWithOwner'],
    {
      encoding: 'utf8',
    },
  ).trim()
  main({ root: process.cwd(), repo, dry: process.argv.includes('--dry') })
}
