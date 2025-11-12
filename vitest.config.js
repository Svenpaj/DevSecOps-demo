import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
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
        '**/*.test.js',
        '**/*.spec.js',
      ],

      // all: true
    },
  },
});