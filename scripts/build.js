require('esbuild')
  .build({
    entryPoints: ['./src/index.ts'],
    outfile: './dist/index.js',
    bundle: true,
    minify: true,
  })
  .catch(() => process.exit(1));
