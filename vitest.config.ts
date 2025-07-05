import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    include: [
      'tests/**/*.test.ts',
      'tests/**/*.test.tsx',
      '**/__tests__/**/*.test.ts',
      '**/__tests__/**/*.test.tsx',
    ],
    exclude: ['tests/e2e/**', 'tests/**/*.spec.ts', 'node_modules/**'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    retry: process.env.CI ? 2 : 0,
    testTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      all: true,
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**',
        'coverage/**',
        '.next/**',
      ],
    },
    // Add module name mapping for better compatibility
    alias: {
      '@': new URL('./', import.meta.url).pathname,
      '@/app': new URL('./app', import.meta.url).pathname,
      '@/components': new URL('./components', import.meta.url).pathname,
      '@/features': new URL('./features', import.meta.url).pathname,
      '@/hooks': new URL('./hooks', import.meta.url).pathname,
      '@/lib': new URL('./lib', import.meta.url).pathname,
      '@/prisma': new URL('./prisma', import.meta.url).pathname,
      '@/public': new URL('./public', import.meta.url).pathname,
      '@/schemas': new URL('./schemas', import.meta.url).pathname,
      '@/types': new URL('./types', import.meta.url).pathname,
      '@/config': new URL('./config', import.meta.url).pathname,
    },
  },
  resolve: {
    alias: {
      '@': new URL('./', import.meta.url).pathname,
      '@/app': new URL('./app', import.meta.url).pathname,
      '@/components': new URL('./components', import.meta.url).pathname,
      '@/features': new URL('./features', import.meta.url).pathname,
      '@/hooks': new URL('./hooks', import.meta.url).pathname,
      '@/lib': new URL('./lib', import.meta.url).pathname,
      '@/prisma': new URL('./prisma', import.meta.url).pathname,
      '@/public': new URL('./public', import.meta.url).pathname,
      '@/schemas': new URL('./schemas', import.meta.url).pathname,
      '@/types': new URL('./types', import.meta.url).pathname,
      '@/config': new URL('./config', import.meta.url).pathname,
    },
  },
});
