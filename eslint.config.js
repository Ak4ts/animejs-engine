import comments from '@eslint-community/eslint-plugin-eslint-comments/configs'
import js from '@eslint/js'
import vitest from '@vitest/eslint-plugin'
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
  // Builders, fakes and contract suites implement ports and build domain objects.
  {
    from: { element: { type: 'test-support' } },
    allow: layer('domain', 'application', 'engine', 'test-support'),
  },
]

// Domain and engine must be deterministic: time and randomness come from injected
// Clock / Random ports so that `seek(t)` always yields the same frame (ADR-0004).
const determinismMessage = 'Non-deterministic API. Inject the Clock/Random port instead (ADR-0004).'
const determinismRules = {
  'no-restricted-globals': [
    'error',
    ...['setTimeout', 'setInterval', 'requestAnimationFrame', 'performance'].map((name) => ({
      name,
      message: determinismMessage,
    })),
  ],
  'no-restricted-properties': [
    'error',
    { object: 'Math', property: 'random', message: determinismMessage },
    { object: 'Date', property: 'now', message: determinismMessage },
  ],
  'no-restricted-syntax': [
    'error',
    {
      selector: "NewExpression[callee.name='Date'][arguments.length=0]",
      message: determinismMessage,
    },
  ],
}

export default defineConfig([
  globalIgnores([
    'dist',
    'coverage',
    'playwright-report',
    'test-results',
    '.remember',
    '.claude/.state',
  ]),

  // Plain JS tooling: eslint config, scripts, Claude Code hooks.
  {
    files: ['**/*.{js,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },

  // TypeScript: strict, type-aware rules. AI-written code gets no slack on types.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      // Small, focused files are easier to review and to fit in a model's context.
      'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
      complexity: ['warn', 12],
    },
  },

  // Every eslint-disable must say why, and can never be blanket.
  comments.recommended,
  {
    rules: {
      '@eslint-community/eslint-comments/require-description': ['error', { ignore: [] }],
      '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
      '@eslint-community/eslint-comments/disable-enable-pair': 'error',
    },
  },

  // Layer boundaries.
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
    files: ['src/domain/**/*.{ts,tsx}', 'src/engine/**/*.{ts,tsx}'],
    rules: determinismRules,
  },

  // Tests: any layer may use test tooling and src/test support.
  {
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
  {
    files: ['**/*.test.{ts,tsx,mjs}', 'e2e/**/*.ts'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/no-focused-tests': 'error',
      'vitest/no-disabled-tests': 'warn',
      'vitest/valid-title': 'error',
      'vitest/expect-expect': [
        'error',
        { assertFunctionNames: ['expect', 'expect*', 'fc.assert', '*.contract'] },
      ],
      'max-lines': 'off',
    },
  },

  prettier,
])
