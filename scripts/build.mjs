import esbuild from 'esbuild';
import fs from 'fs/promises';

async function main() {
  await esbuild.build({
    entryPoints: ['./src/index.ts'],
    outfile: './dist/index.js',
    bundle: true,
    minify: true,
  });

  let src = (await fs.readFile('./dist/index.js')).toString();
  src = src.replace(/`\n`/g, '"\\n"');
  src = src.replaceAll('"', "'");
  src = 'javascript:' + src;
  src = src.trim();
  await fs.writeFile('./dist/index.js', src);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
