import { extractRooms, Room } from './extract';
import { downloadTextAs, copyTextToClipboard } from './save';
import { toCsvString, toMdTableString } from './stringify';

function toGoogleCalendarData(room: Room) {
  const dateString = (date: Date) =>
    new Intl.DateTimeFormat('en-US').format(date);
  const timeString = (date: Date) =>
    new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(date);

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
    const text = toCsvString(rooms.map(toGoogleCalendarData));
    downloadTextAs('cal.csv', text, { type: 'text/csv' });
  }
}

main();
