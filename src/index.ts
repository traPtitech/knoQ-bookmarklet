import { extractRooms } from './extract';
import { downloadTextAs, createRoomsMdTable, createKnoqCsv } from './export';

async function main() {
  const rooms = await extractRooms();

  if (window.confirm('進捗部屋表をダウンロードしますか?')) {
    const md = createRoomsMdTable(rooms);
    const csv = createKnoqCsv(rooms);
    downloadTextAs('cal.md', md, { type: 'text/markdown' });
    downloadTextAs('cal.csv', csv, { type: 'text/csv' });
  }
}

main();
