import { extractRooms, Room } from './extract';
import { downloadTextAs, copyTextToClipboard } from './save';
import { toCsvString, toMdTableString } from './stringify';

function toMdData(room: Room) {
  const dateString = (date: Date) => date.toLocaleDateString('ja-JP');
  const timeString = (date: Date) =>
    date.toLocaleTimeString('ja-JP', { timeStyle: 'short' });

  return {
    日付: dateString(room.timeStart),
    場所: room.place,
    開始時刻: timeString(room.timeStart),
    終了時刻: timeString(room.timeEnd),
  };
}

function toGoogleCalendarData(room: Room) {
  const dateString = (date: Date) => date.toLocaleDateString('en-US');
  const timeString = (date: Date) =>
    date.toLocaleTimeString('en-US', { timeStyle: 'short' });

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
    const text = toMdTableString(rooms.map(toMdData));
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
