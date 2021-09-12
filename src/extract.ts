/* eslint-disable @typescript-eslint/no-non-null-assertion */

export type Room = {
  place: string;
  timeStart: Date;
  timeEnd: Date;
};

// 講義室予約ページから4週間分のtraPの施設予約を抽出する
export async function extractRooms(): Promise<Room[]> {
  await showWeekMode();

  const rooms: Room[] = [];
  for (let i = 0; i < 4; i++) {
    rooms.push(...extractRoomsOneWeek());
    await showNextWeek();
  }

  // timeStartの昇順でソート
  rooms.sort((a, b) => a.timeStart.getTime() - b.timeStart.getTime());

  return rooms;
}

// 施設予約ページで週間表示の講義室予約を表示させる
async function showWeekMode(): Promise<void> {
  // 講義室[大岡山]ボタンをクリック
  document
    .querySelector<HTMLElement>('#tbl2 > tbody > tr > td:nth-child(3) > a')!
    .click();

  // 週ボタンをクリック
  document.querySelector<HTMLElement>('#lblModeW')!.click();

  await waitForLoading();
}

// 翌週分の講義室予約を表示する
async function showNextWeek(): Promise<void> {
  // 翌週ボタンをクリック
  document
    .querySelector<HTMLElement>(
      '#ctl00_divMainContents > div:nth-child(10) > div.hideAtPrint > table.searchTablex > tbody > tr:nth-child(1) > td:nth-child(2) > a:nth-child(6)',
    )!
    .click();

  await waitForLoading();
}

// 講義室情報が表示されるまで待つ
async function waitForLoading(): Promise<void> {
  for (let limit = 100; limit--; ) {
    await new Promise((r) => setTimeout(r, 100));

    // ロード中の時は#divTblの子がimgになる
    const loaded =
      document.querySelector('#divTbl')?.firstElementChild?.tagName === 'DIV';
    if (loaded) {
      return;
    }
  }

  throw new Error('講義室情報がロードされませんでした');
}

// 週表示の講義室予約ページから1週間分のtraPの施設予約を抽出する
function extractRoomsOneWeek(): Room[] {
  const roomRows = document.querySelectorAll<HTMLTableRowElement>(
    'table.tblMonth > tbody > tr.trRoom',
  );
  return Array.from(roomRows).flatMap(extractRoomsOfRow);
}

// 週表示の講義室予約表の行から1週間分のtraPの施設予約を抽出する
function extractRoomsOfRow(row: HTMLTableRowElement): Room[] {
  const roomName = row.classList.contains('trTop')
    ? row.cells[1].innerText.trim()
    : row.cells[0].innerText.trim();
  const cells = row.querySelectorAll('td');
  return Array.from(cells).flatMap((cell) =>
    extractRoomOfCell(cell).map((room) => ({ ...room, place: roomName })),
  );
}

// 週表示の講義室予約の表のマスからtraPの施設予約情報を抽出する
function extractRoomOfCell(cell: HTMLTableCellElement): Omit<Room, 'place'>[] {
  return Array.from(
    cell.querySelectorAll<HTMLSpanElement>('span > span'),
  ).flatMap((info) => {
    const text = info.innerText;
    if (!/デジタル創作同好会traP/.test(text)) {
      return [];
    }

    let date = cell.dataset.date!; // yyyymmdd;
    const [, timeStart, timeEnd] = text.match(/\((\d\d:\d\d).*(\d\d:\d\d)\)/)!; // hh:mm

    date = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
    const datetimeStart = new Date(`${date}T${timeStart}:00`);
    const datetimeEnd = new Date(`${date}T${timeEnd}:00`);
    return { timeStart: datetimeStart, timeEnd: datetimeEnd };
  });
}
