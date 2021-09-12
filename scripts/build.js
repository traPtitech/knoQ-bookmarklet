const { build } = require('esbuild');
const { readFile, writeFile } = require('fs/promises');

(async () => {
  await build({
    entryPoints: ['./src/index.ts'],
    outfile: './dist/index.js',
    bundle: true,
    minify: true,
  });

  let src = (await readFile('./dist/index.js')).toString();
  src = src.replace(/`\n`/g, "'\\n'");
  src = 'javascript:' + src;
  await writeFile('./dist/index.js', src);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
