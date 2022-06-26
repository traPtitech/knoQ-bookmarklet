const dateString = (date: Date) =>
  date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
const timeString = (date: Date) =>
  date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

export function createRoomsMdTable(rooms: Room[]): string {
  const headerStr = '|日付|場所|開始時刻|終了時刻|\n|-|-|-|-|\n';
  const rowsStr = rooms
    .map((room) => {
      const date = dateString(room.timeStart);
      const start = timeString(room.timeStart);
      const end = timeString(room.timeEnd);
      return `|${date}|${room.place}|${start}|${end}|`;
    })
    .join('\n');
  return headerStr + rowsStr;
}

export function createKnoqCsv(rooms: Room[]): string {
  const headerStr =
    'Subject,Location,Start date,End date,Start time,End time\n';
  const rowsStr = rooms
    .map((room) => {
      const startDate = dateString(room.timeStart);
      const endDate = dateString(room.timeEnd);
      const startTime = timeString(room.timeStart);
      const endTime = timeString(room.timeEnd);
      return `進捗部屋,${room.place},${startDate},${endDate},${startTime},${endTime}`;
    })
    .join('\n');
  return headerStr + rowsStr;
}

export function downloadTextAs(
  fileName: string,
  text: string,
  option?: { type: string },
): void {
  const blob = new Blob([text], option);
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', blobUrl);
  a.setAttribute('download', fileName);
  a.click();
}
