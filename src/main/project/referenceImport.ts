import fs from "node:fs/promises";
import path from "node:path";
import { dialog, nativeImage } from "electron";
import type { BrowserWindow } from "electron";
import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { ImportedReference } from "../../shared/document/referenceModel";
import { validateImageDataUrl } from "../../shared/security/imagePayload";

export function isSupportedImage(bytes: Uint8Array): boolean {
  const data = Buffer.from(bytes);
  return data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
    || (data[0] === 255 && data[1] === 216 && data[2] === 255)
    || (data.toString("ascii",0,4) === "RIFF" && data.toString("ascii",8,12) === "WEBP");
}

export async function readReferenceImage(filePath: string, config: AppConfig,
  decode = nativeImage.createFromBuffer): Promise<ImportedReference> {
  const file = await fs.open(filePath,"r");
  let bytes: Buffer;
  try {
    const stat = await file.stat();
    if (!stat.isFile() || stat.size > config.references.maxImageBytes) throw new Error("Invalid reference image size.");
    bytes = Buffer.alloc(Math.min(stat.size + 1, config.references.maxImageBytes + 1));
    const {bytesRead} = await file.read(bytes,0,bytes.length,0);
    if (bytesRead > config.references.maxImageBytes) throw new Error("Invalid reference image size.");
    bytes = bytes.subarray(0,bytesRead);
  } finally { await file.close(); }
  if (!isSupportedImage(bytes)) throw new Error("Invalid reference image format.");
  const image = decode(bytes); const {width,height} = image.getSize();
  if (image.isEmpty() || width < 1 || height < 1 || width * height > config.canvas.dimensions.maxAreaPixels
    || width > config.canvas.dimensions.maxPixels || height > config.canvas.dimensions.maxPixels) throw new Error("Invalid reference image dimensions.");
  const dataUrl = `data:image/png;base64,${image.toPNG().toString("base64")}`;
  validateImageDataUrl(dataUrl,config.references.maxImageBytes);
  return {name:path.basename(filePath).slice(0,255),dataUrl,width,height};
}

export async function importReferenceImage(config: AppConfig, parentWindow: BrowserWindow | null): Promise<ImportedReference | null> {
  const options = {properties:["openFile" as const],filters:[{name:"Images",extensions:["png","jpg","jpeg","webp"]}]};
  const result = parentWindow ? await dialog.showOpenDialog(parentWindow,options) : await dialog.showOpenDialog(options);
  if (result.canceled || !result.filePaths[0]) return null;
  return readReferenceImage(result.filePaths[0],config);
}
