import js from '@eslint/js'
import boundaries from 'eslint-plugin-boundaries'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Clean architecture layers. Order matters: first matching element wins.
// See docs/ARCHITECTURE.md for the dependency table.
const elements = [
  { type: 'test-support', pattern: 'src/test' },
  { type: 'domain', pattern: 'src/domain' },
  { type: 'application', pattern: 'src/application' },
  { type: 'engine', pattern: 'src/engine' },
  { type: 'infrastructure', pattern: 'src/infrastructure' },
  { type: 'presentation', pattern: 'src/presentation' },
  // Composition root + entry point: the only layer that knows every other layer.
  { type: 'main', pattern: 'src/main' },
]

const layer = (...types) => ({ to: { element: { types } } })

const layerPolicies = [
  { from: { element: { type: 'domain' } }, allow: layer('domain') },
  { from: { element: { type: 'application' } }, allow: layer('domain', 'application') },
  { from: { element: { type: 'engine' } }, allow: layer('domain', 'application', 'engine') },
  {
    from: { element: { type: 'infrastructure' } },
    allow: layer('domain', 'application', 'engine', 'infrastructure'),
  },
  {
    from: { element: { type: 'presentation' } },
    allow: layer('domain', 'application', 'engine', 'presentation'),
  },
  {
    from: { element: { type: 'main' } },
    allow: layer('domain', 'application', 'engine', 'infrastructure', 'presentation', 'main'),
  },
]

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'playwright-report', 'test-results', '.remember']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': elements,
      'boundaries/include': ['src/**/*'],
      // Global stylesheet imported by the entry point.
      'boundaries/files': [{ pattern: 'src/*.css', category: 'style' }],
      'import/resolver': { typescript: { project: './tsconfig.app.json' } },
    },
    rules: {
      'boundaries/no-unknown-files': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          checkAllOrigins: true,
          policies: [
            ...layerPolicies,
            {
              from: { element: { type: 'main' } },
              allow: { to: { file: { categories: 'style' } } },
            },
            // Every layer except domain may use npm packages and platform modules.
            {
              from: { element: { type: '!domain' } },
              allow: { to: { module: { origin: ['external', 'core'] } } },
            },
          ],
        },
      ],
    },
  },
  {
    // Tests may use test tooling (vitest, testing-library) and shared test support in any layer.
    files: ['src/**/*.test.{ts,tsx}'],
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          checkAllOrigins: true,
          policies: [
            ...layerPolicies,
            { allow: layer('test-support') },
            { allow: { to: { module: { origin: ['external', 'core'] } } } },
          ],
        },
      ],
    },
  },
  prettier,
])
