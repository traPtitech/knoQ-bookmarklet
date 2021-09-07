const { build } = require('esbuild');
const { readFile, writeFile } = require('fs/promises');

(async () => {
  await build({
    entryPoints: ['./src/index.ts'],
    outfile: './dist/index.js',
    bundle: true,
    minify: true,
  });

  const jsText = (await readFile('./dist/index.js')).toString();
  const replaced = jsText.replace(/`\n`/g, "'\\n'");
  await writeFile('./dist/index.js', replaced);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
