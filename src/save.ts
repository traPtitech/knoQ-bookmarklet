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

export function copyTextToClipboard(text: string): boolean {
  const tmp = document.createElement('textarea');
  tmp.value = text;
  document.body.appendChild(tmp);
  tmp.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(tmp);
  return ok;
}
