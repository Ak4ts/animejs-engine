import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const alias = { '@': fileURLToPath(new URL('./src', import.meta.url)) }

// Coverage floors per layer (docs/TESTING.md). Never lower them to make a build pass.
const layerThreshold = (pct: number) => ({
  lines: pct,
  functions: pct,
  statements: pct,
  branches: pct - 5,
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'app',
          globals: true,
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
        },
      },
      {
        test: {
          name: 'tooling',
          environment: 'node',
          include: ['scripts/**/*.test.mjs', '.claude/hooks/**/*.test.mjs'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main/**', 'src/**/*.d.ts'],
      reporter: ['text-summary', 'html', 'json-summary'],
      thresholds: {
        'src/domain/**': layerThreshold(95),
        'src/application/**': layerThreshold(90),
        'src/engine/**': layerThreshold(80),
        'src/infrastructure/**': layerThreshold(80),
        'src/presentation/**': layerThreshold(70),
      },
    },
  },
})
