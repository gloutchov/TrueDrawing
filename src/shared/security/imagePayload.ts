export const defaultMaxImageBytes = 16 * 1024 * 1024;
export const maxImageDataUrlLength = Math.ceil(defaultMaxImageBytes / 3) * 4 + 64;

export function validateImageDataUrl(value: unknown, maxBytes = defaultMaxImageBytes): string {
  if (typeof value !== "string" || value.length > Math.ceil(maxBytes / 3) * 4 + 64) {
    throw new Error("Image payload is too large or invalid.");
  }
  const match = /^data:image\/(png|webp|jpeg);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match || match[2].length % 4 !== 0
    || match[2].length / 4 * 3 - (match[2].endsWith("==") ? 2 : match[2].endsWith("=") ? 1 : 0) > maxBytes) {
    throw new Error("Image payload is too large or invalid.");
  }
  return value;
}
