import fs from 'fs/promises';

async function main() {
  const bookmarklet = (await fs.readFile('dist/index.js')).toString();
  const md = (await fs.readFile('README.md')).toString();
  const updated = md.replace(
    /<a id="bookmarklet" href=".*">/,
    `<a id="bookmarklet" href="${bookmarklet}">`,
  );
  await fs.writeFile('README.md', updated, 'utf-8');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
