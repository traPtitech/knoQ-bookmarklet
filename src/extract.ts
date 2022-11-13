/* eslint-disable @typescript-eslint/no-non-null-assertion */

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
  // TODO: make robuster
  // 週ボタンをクリック
  document.querySelector<HTMLElement>('#lblModeW')!.click();

  // TODO: make robuster
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
  // TODO: make robuster
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
    // div#divTblの中に講義室情報が表示されるのをMutationObserverで監視
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
  // traPの予約枠のリストを取得
  const elIter = document.evaluate(
    '//text()[contains(., "traP")]/..',
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
    // 予約枠の表示から開始時間と終了時間を抽出 (HH:mm)
    const [, start, end] = el.innerText.match(/(\d\d:\d\d) - (\d\d:\d\d)/)!;

    // 予約枠表示の祖先のdata-dateに日付が入っている (YYYYMMDD)
    const td = el.closest<HTMLElement>('*[data-date]')!;
    const date = td.dataset.date!;

    // TODO: make robuster
    // 予約枠が入っている表の行頭から部屋名を抽出
    // trTopがついている場合は0列目に建物名が入ってくる
    const tr = td.closest('tr')!;
    const place = (
      tr.children[tr.classList.contains('trTop') ? 1 : 0] as HTMLElement
    ).innerText.trim();

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
