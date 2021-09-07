import { extractRooms } from './extract';
import { downloadTextAs, copyTextToClipboard } from './save';
import { toCsvString, toMdTableString } from './stringify';

async function main() {
  const rooms = extractRooms();

  if (window.confirm('進捗部屋表をコピーしますか?')) {
    const text = toMdTableString(rooms);
    const ok = copyTextToClipboard(text);
    if (ok) {
      window.alert('コピーしました');
    } else {
      window.alert('コピーできませんでした');
    }
  }

  if (window.confirm('CSVをダウンロードしますか?')) {
    const text = toCsvString(rooms);
    downloadTextAs('cal.csv', text, { type: 'text/csv' });
  }
}

main();
