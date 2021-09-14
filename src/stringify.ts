/* eslint-disable @typescript-eslint/no-explicit-any */

type Table = Record<string, string | number | Date>;

export function toJsonString<T extends Table>(xs: T[]): string {
  return JSON.stringify(xs, null, 2);
}

export function toCsvString<T extends Table>(xs: T[]): string {
  if (xs.length === 0) {
    return '';
  }

  return withSettingDateFormatISO(() => {
    const header = [...Object.keys(xs[0])];
    const rows = xs.map((x) => [...Object.values(x)].map(String));
    return [header, ...rows].map((row) => row.join(',')).join('\n');
  });
}

export function toMdTableString<T extends Table>(xs: T[]): string {
  if (xs.length === 0) {
    return '';
  }

  return withSettingDateFormatISO(() => {
    const header = [...Object.keys(xs[0])];
    const alignment = Array(header.length).fill('-');
    const rows = xs.map((x) => [...Object.values(x)].map(String));
    return [header, alignment, ...rows]
      .map((row) => `|${row.join('|')}|`)
      .join('\n');
  });
}

// 一時的にDate.toStringをtoISOStringにすり替える
function withSettingDateFormatISO<T>(f: () => T): T {
  const toString = Date.prototype.toString;
  Date.prototype.toString = Date.prototype.toISOString;
  try {
    return f();
  } finally {
    Date.prototype.toString = toString;
  }
}
