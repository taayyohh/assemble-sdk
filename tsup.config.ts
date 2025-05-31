import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    splitting: false,
    minify: false,
    external: ['viem', 'react', 'react-dom'],
  },
  // Temporarily disabled React build until React modules are created
  // {
  //   entry: ['src/react.tsx'],
  //   format: ['cjs', 'esm'],
  //   dts: true,
  //   sourcemap: true,
  //   treeshake: true,
  //   splitting: false,
  //   minify: false,
  //   external: ['viem', 'react', 'react-dom'],
  // },
]) 