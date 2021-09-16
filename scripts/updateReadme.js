const https = require('https');
const fs = require('fs');

const bookmarkletUrl =
  'https://github.com/traPtitech/knoQ-bookmarklet/releases/latest/download/index.js';

https.get(bookmarkletUrl, (res) => {
  res.setEncoding('utf-8');

  let bookmarklet = '';
  res.on('data', (data) => (bookmarklet += data));

  res.on('end', () => {
    const md = fs.readFileSync('README.md').toString();
    const updated = md.replace(
      /<a id="bookmarklet" href=".*">/,
      `<a id="bookmarklet" href="${bookmarklet}">"`,
    );
    fs.writeFileSync('README.md', updated, 'utf-8');
  });
});
