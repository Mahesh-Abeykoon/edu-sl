import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    types: 'src/types.ts',
    universities: 'src/universities.ts'
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: false,
  splitting: false,
  treeshake: true,
  esbuildOptions(options) {
    options.legalComments = 'none';
  }
});
