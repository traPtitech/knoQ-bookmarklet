/* eslint-disable @typescript-eslint/no-explicit-any */

export function toJsonString<T extends Record<any, any>>(xs: T[]): string {
  return JSON.stringify(xs, null, 2);
}

export function toCsvString<T extends Record<any, any>>(xs: T[]): string {
  if (xs.length === 0) {
    return '';
  }

  const header = [...Object.keys(xs[0])];
  const rows = xs.map((x) => [...Object.values(x)].map(String));
  return [header, ...rows].map((row) => row.join(',')).join('\n');
}

export function toMdTableString<T extends Record<any, any>>(xs: T[]): string {
  if (xs.length === 0) {
    return '';
  }

  const header = [...Object.keys(xs[0])];
  const rows = xs.map((x) => [...Object.values(x)].map(String));
  return [header, ...rows].map((row) => `|${row.join('|')}|`).join('\n');
}
