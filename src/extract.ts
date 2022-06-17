/* eslint-disable @typescript-eslint/no-non-null-assertion */

export type Room = {
  place: string;
  timeStart: Date;
  timeEnd: Date;
};

// 講義室予約ページから4週間分のtraPの施設予約を抽出する
export async function extractRooms(): Promise<Room[]> {
  const rooms: Room[] = [];

  await loadWeeklyReservations();
  rooms.push(...extractRoomsOneWeek());
  for (let i = 0; i < 3; i++) {
    await loadNextWeekReservations();
    rooms.push(...extractRoomsOneWeek());
  }

  return rooms
    .filter(({ timeStart }) => new Date().getTime() < timeStart.getTime())
    .sort((a, b) => a.timeStart.getTime() - b.timeStart.getTime());
}

// 施設予約ページで週間表示の講義室予約を表示させる
async function loadWeeklyReservations(): Promise<void> {
  // 週ボタンをクリック
  document.querySelector<HTMLElement>('#lblModeW')!.click();

  // 講義室[大岡山]ボタンをクリック
  document
    .querySelector<HTMLElement>(
      '#tbl2 > tbody > tr:nth-child(2) > td:nth-child(1) > a',
    )!
    .click();

  await waitForLoading();
}

// 翌週分の講義室予約を表示する
async function loadNextWeekReservations(): Promise<void> {
  // 翌週ボタンをクリック
  document
    .querySelector<HTMLElement>(
      '#ctl00_divMainContents > div:nth-child(10) > div.hideAtPrint > table.searchTablex > tbody > tr:nth-child(1) > td:nth-child(2) > a:nth-child(6)',
    )!
    .click();

  await waitForLoading();
}

// 講義室情報が表示されるまで待つ
function waitForLoading(): Promise<void> {
  return new Promise((resolve) => {
    const target = document.querySelector('#divTbl')!;
    const observer = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type !== 'childList') {
          continue;
        }
        if (mutation.addedNodes[1]?.nodeName === 'DIV') {
          observer.disconnect();
          resolve();
          return;
        }
      }
    });
    observer.observe(target, { childList: true });
  });
}

// 週表示の講義室予約ページから1週間分のtraPの施設予約を抽出する
function extractRoomsOneWeek(): Room[] {
  // traPの枠のリストを取得
  const elIter = document.evaluate(
    '//span[contains(., "traP")]',
    document,
    null,
    XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
    null,
  );

  const rooms: Room[] = [];

  for (
    let el = elIter.iterateNext() as HTMLElement | null;
    el !== null;
    el = elIter.iterateNext() as HTMLElement | null
  ) {
    const td = el.closest('td')!;
    const tr = td.closest('tr')!;

    const place = (
      tr.children[tr.classList.contains('trTop') ? 1 : 0] as HTMLElement
    ).innerText;
    // YYYYMMDD
    const date = td.dataset['date']!;
    // HH:mm
    const [, start, end] = el.innerText.match(/(\d\d:\d\d) - (\d\d:\d\d)/)!;

    rooms.push({
      place,
      timeStart: createDate(date, start),
      timeEnd: createDate(date, end),
    });
  }

  return rooms;
}

function createDate(date: string, time: string): Date {
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  return new Date(`${year}-${month}-${day}T${time}:00+09:00`);
}
