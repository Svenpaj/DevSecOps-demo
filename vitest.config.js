import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.js'],
    exclude: ['node_modules/', 'e2e/**', 'dist/'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      // thresholds: {
      //   lines: 80,      
      //   functions: 80,  
      //   branches: 80,   
      //   statements: 80, 
      // },
      exclude: [
        'node_modules/',
        'dist/',
        'e2e/**',
        '**/*.test.js',
        '**/*.spec.js',
      ],

      // all: true
    },
  },
});