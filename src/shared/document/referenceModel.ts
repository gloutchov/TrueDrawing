import type { AppConfig } from "../config/appConfigSchema";
import { validateImageDataUrl } from "../security/imagePayload";

export type ReferenceImage = {
  id: string; name: string; dataUrl: string; visible: boolean; opacity: number;
  x: number; y: number; width: number; height: number;
};
export type ImportedReference = {name: string; dataUrl: string; width: number; height: number};

export function validateReference(value: unknown, config: AppConfig): ReferenceImage {
  if (!value || typeof value !== "object") throw new Error("Invalid reference image.");
  const input = value as Record<string, unknown>;
  const maxSide = config.canvas.dimensions.maxPixels * config.references.maxScale;
  const number = (key: string, min: number, max: number): number => {
    const v = input[key];
    if (typeof v !== "number" || !Number.isFinite(v) || v < min || v > max) throw new Error("Invalid reference image.");
    return v;
  };
  if (typeof input.id !== "string" || !input.id || typeof input.name !== "string" || input.name.length > 255
    || typeof input.visible !== "boolean") throw new Error("Invalid reference image.");
  return {id: input.id, name: input.name, visible: input.visible,
    dataUrl: validateImageDataUrl(input.dataUrl, config.references.maxImageBytes),
    opacity: number("opacity",0,1),x:number("x",-maxSide,maxSide),y:number("y",-maxSide,maxSide),
    width:number("width",1,maxSide),height:number("height",1,maxSide)};
}
