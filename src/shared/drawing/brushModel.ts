import type { DrawingPoint } from "./strokeTypes";
import type { StrokeToolId } from "./toolTypes";

export const textureKinds = ["none", "grain", "dots", "hatch"] as const;
export type BrushSettings = {
  presetId: string;
  spacing: number;
  pressureSize: number;
  pressureOpacity: number;
  velocitySize: number;
  texture: typeof textureKinds[number];
  textureAmount: number;
  textureScale: number;
};
export type BrushPreset = BrushSettings & {
  label: {it: string; en: string};
  tool: StrokeToolId;
  size: number;
  opacity: number;
  hardness: number;
};

export function validateBrush(value: unknown): BrushSettings {
  if (!value || typeof value !== "object") throw new Error("Invalid brush settings.");
  const input = value as Record<string, unknown>;
  if (typeof input.presetId !== "string" || !/^[a-z0-9-]{1,64}$/.test(input.presetId)
    || !textureKinds.includes(input.texture as BrushSettings["texture"])) throw new Error("Invalid brush settings.");
  const number = (name: string, min: number, max: number): number => {
    const n = input[name];
    if (typeof n !== "number" || !Number.isFinite(n) || n < min || n > max) throw new Error("Invalid brush settings.");
    return n;
  };
  return {presetId: input.presetId, texture: input.texture as BrushSettings["texture"],
    spacing: number("spacing", 0.05, 1), pressureSize: number("pressureSize", 0, 1),
    pressureOpacity: number("pressureOpacity", 0, 1), velocitySize: number("velocitySize", 0, 1),
    textureAmount: number("textureAmount", 0, 1), textureScale: number("textureScale", 1, 64)};
}

export function brushDynamics(brush: BrushSettings, point: DrawingPoint, previous?: DrawingPoint) {
  const velocity = previous ? Math.min(1, Math.hypot(point.x - previous.x, point.y - previous.y)
    / Math.max(1, point.timestamp - previous.timestamp) / 2) : 0;
  return {
    sizeFactor: Math.max(0.1, (1 - brush.pressureSize + brush.pressureSize * point.pressure)
      * (1 - brush.velocitySize * velocity)),
    opacityFactor: 1 - brush.pressureOpacity + brush.pressureOpacity * point.pressure
  };
}

export function textureAlpha(brush: BrushSettings, x: number, y: number): number {
  const sx = Math.floor(x / brush.textureScale), sy = Math.floor(y / brush.textureScale);
  const noise = Math.abs(Math.sin(sx * 127.1 + sy * 311.7) * 43758.5453) % 1;
  const pattern = brush.texture === "grain" ? noise : brush.texture === "dots"
    ? ((sx + sy) % 3 === 0 ? 1 : 0.15) : brush.texture === "hatch" ? (sx % 3 === 0 ? 1 : 0.2) : 1;
  return 1 - brush.textureAmount + brush.textureAmount * pattern;
}
