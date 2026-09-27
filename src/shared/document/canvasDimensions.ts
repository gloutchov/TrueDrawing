import type { AppConfig } from "../config/appConfigSchema";

export type CanvasDimensions = {
  width: number;
  height: number;
  dpi: number;
};

export type CanvasDimensionLimits = AppConfig["canvas"]["dimensions"];

export function createDefaultCanvasDimensions(config: AppConfig): CanvasDimensions {
  return {
    width: config.canvas.defaultWidth,
    height: config.canvas.defaultHeight,
    dpi: config.canvas.dimensions.defaultDpi
  };
}

export function cmToPixels(centimeters: number, dpi: number): number {
  return Math.round(centimeters * dpi / 2.54);
}

export function pixelsToCm(pixels: number, dpi: number): number {
  return pixels * 2.54 / dpi;
}

export function validateCanvasDimensions(
  value: CanvasDimensions,
  limits: CanvasDimensionLimits
): CanvasDimensions {
  if (!Number.isInteger(value.width) || !Number.isInteger(value.height)
    || value.width < limits.minPixels || value.height < limits.minPixels
    || value.width > limits.maxPixels || value.height > limits.maxPixels
    || value.width * value.height > limits.maxAreaPixels) {
    throw new Error("Canvas dimensions are outside the configured pixel limits.");
  }

  if (!Number.isInteger(value.dpi) || value.dpi < limits.minDpi || value.dpi > limits.maxDpi) {
    throw new Error("Canvas resolution is outside the configured DPI limits.");
  }

  return value;
}
