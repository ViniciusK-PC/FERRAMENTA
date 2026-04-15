import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/unit/frontend/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['lib/**/*.ts', 'lib/**/*.tsx', 'components/**/*.tsx'],
      exclude: ['node_modules', 'tests']
    },
    include: ['tests/unit/frontend/**/*.test.{ts,tsx}'],
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/*': path.resolve(__dirname, './'),
    },
  },
});
