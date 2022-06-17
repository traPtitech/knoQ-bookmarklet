import esbuild from 'esbuild';
import fs from 'fs/promises';

async function main() {
  await esbuild.build({
    entryPoints: ['./src/index.ts'],
    outfile: './dist/index.js',
    bundle: true,
    minify: true,
  });

  const src = (await fs.readFile('./dist/index.js')).toString();
  const bookmarklet = 'javascript:' + src.trim().split('\n').join('\\n');
  await fs.writeFile('./dist/index.js', bookmarklet);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
