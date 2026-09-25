import { defineConfig, devices } from '@playwright/test'

const isCI = !!process.env.CI
// Explicit IPv4: `localhost` may resolve to ::1 while the preview server binds elsewhere.
const baseURL = 'http://127.0.0.1:4173'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [['list'], ['github']] : 'list',
  // A hung browser must fail fast instead of burning the runner (seen: 6h CI hang).
  timeout: 30_000,
  globalTimeout: isCI ? 10 * 60_000 : 0,
  use: { baseURL, trace: 'on-first-retry' },
  projects: [
    {
      name: 'chromium',
      // PW_CHANNEL=msedge|chrome uses a locally installed browser instead of Playwright's download.
      use: { ...devices['Desktop Chrome'], channel: process.env.PW_CHANNEL },
    },
  ],
  webServer: {
    command: 'pnpm build && pnpm preview --host 127.0.0.1 --port 4173 --strictPort',
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
})
