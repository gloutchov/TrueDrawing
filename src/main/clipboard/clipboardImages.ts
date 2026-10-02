import { ClipboardItem, clipboard, nativeImage } from "electron";
import { defaultMaxImageBytes, validateImageDataUrl } from "../../shared/security/imagePayload";

export async function writeClipboardPng(dataUrl: string): Promise<void> {
  validateImageDataUrl(dataUrl);
  const image = nativeImage.createFromDataURL(dataUrl);
  if (image.isEmpty()) throw new Error("Invalid clipboard image.");
  const png = image.toPNG();
  if (png.byteLength > defaultMaxImageBytes) throw new Error("Clipboard image is too large.");
  const blob = new Blob([Uint8Array.from(png)], { type: "image/png" });
  await clipboard.write([new ClipboardItem({ "image/png": blob })]);
}

export async function readClipboardPng(): Promise<string | null> {
  const items = await clipboard.read();
  const item = items.find(candidate => candidate.types.includes("image/png"));
  if (!item) return null;
  const blob = await item.getType("image/png");
  if (!(blob instanceof Blob)) throw new Error("Invalid clipboard image.");
  if (blob.size > defaultMaxImageBytes) throw new Error("Clipboard image is too large.");
  const image = nativeImage.createFromBuffer(Buffer.from(await blob.arrayBuffer()));
  if (image.isEmpty()) return null;
  const dataUrl = image.toDataURL();
  validateImageDataUrl(dataUrl);
  return dataUrl;
}
