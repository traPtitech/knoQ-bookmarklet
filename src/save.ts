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
