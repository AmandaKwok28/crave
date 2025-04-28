// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: './src/__tests__/test.setup.ts', 
    coverage: {
      provider: 'v8', 
      reporter: ['text', 'html'], 
      exclude: [
        'node_modules/**',
        'src/__tests__/**',
        'src/mocks/**',
        'src/services/**',
        'seed.ts',
        'seed_liam.ts',
        'vitest.config.ts',
        'prisma/**',
        'src/types.d.ts',
        'src/seed_helpers/**',
        'src/index.ts',
        'src/lib/**'
      ],
    },
  },
  
});
