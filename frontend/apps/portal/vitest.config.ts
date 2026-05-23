import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: ['node_modules', 'dist', '.next', 'src/tests/e2e/**'],
    globals: true,
    include: ['src/tests/unit/**/*.test.ts', 'src/tests/unit/**/*.test.tsx'],
    passWithNoTests: true,
  },
});
