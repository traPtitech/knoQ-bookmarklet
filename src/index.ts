import { extractRooms, Room } from './extract';
import { downloadTextAs } from './save';
import { toCsvString, toMdTableString } from './stringify';

const dateString = (date: Date) => date.toLocaleDateString('ja-JP');
const timeString = (date: Date) =>
  date.toLocaleTimeString('ja-JP', { timeStyle: 'short' });

function toMdData(room: Room) {
  return {
    日付: dateString(room.timeStart),
    場所: room.place,
    開始時刻: timeString(room.timeStart),
    終了時刻: timeString(room.timeEnd),
  };
}

function toGoogleCalendarData(room: Room) {
  return {
    Subject: '進捗部屋',
    Location: room.place,
    'Start Date': dateString(room.timeStart),
    'End Date': dateString(room.timeEnd),
    'Start Time': timeString(room.timeStart),
    'End Time': timeString(room.timeEnd),
  };
}

async function main() {
  const rooms = await extractRooms();

  if (window.confirm('進捗部屋表をダウンロードしますか?')) {
    const md = toMdTableString(rooms.map(toMdData));
    const csv = toCsvString(rooms.map(toGoogleCalendarData));
    downloadTextAs('cal.md', md, { type: 'text/markdown' });
    downloadTextAs('cal.csv', csv, { type: 'text/csv' });
  }
}

main();
