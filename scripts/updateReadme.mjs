import fs from 'fs/promises';

async function main() {
  const bookmarklet = (await fs.readFile('dist/index.js')).toString();
  const md = (await fs.readFile('README.md')).toString();
  const updated = md.replace(
    /お使いのブラウザに登録\n```(.|[\r\n])*```/,
    `お使いのブラウザに登録\n\`\`\`\n${bookmarklet}\n\`\`\``,
  );
  await fs.writeFile('README.md', updated, 'utf-8');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
