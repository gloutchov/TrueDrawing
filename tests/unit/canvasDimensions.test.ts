import { afterEach, describe, expect, it, vi } from "vitest";

import type { AppConfig } from "../../src/shared/config/appConfigSchema";
import {
  cmToPixels,
  linkedCanvasLength,
  pixelsToCm,
  validateCanvasDimensions
} from "../../src/shared/document/canvasDimensions";
import { createInitialDrawingDocument } from "../../src/shared/document/layerModel";
import { commitHistory, createHistory, redoHistory, undoHistory } from "../../src/shared/history/historyModel";
import {
  exportDocumentCanvasToDataUrl,
  exportDocumentForGenerationToPngDataUrl
} from "../../src/renderer/canvas/canvasExport";

const limits = {
  minPixels: 64,
  maxPixels: 4096,
  maxAreaPixels: 12000000,
  defaultDpi: 300,
  minDpi: 72,
  maxDpi: 600
};

afterEach(() => vi.unstubAllGlobals());

describe("canvas dimensions", () => {
  it("converts centimeters to integer pixels at the chosen DPI", () => {
    expect(cmToPixels(2.54, 300)).toBe(300);
    expect(cmToPixels(21, 300)).toBe(2480);
    expect(pixelsToCm(300, 300)).toBeCloseTo(2.54);
  });

  it("links the opposite side at the locked ratio in pixels and centimeters", () => {
    expect(linkedCanvasLength(1200, 3 / 2, "width", "px")).toBe(800);
    expect(linkedCanvasLength(10, 3 / 2, "height", "cm")).toBe(15);
    expect(linkedCanvasLength(20, 3 / 2, "width", "cm")).toBe(13.333);
  });

  it("rejects pixel, area and DPI limits", () => {
    expect(validateCanvasDimensions({ width: 2480, height: 3508, dpi: 300 }, limits).width).toBe(2480);
    expect(() => validateCanvasDimensions({ width: 63, height: 100, dpi: 300 }, limits)).toThrow();
    expect(() => validateCanvasDimensions({ width: 4096, height: 4096, dpi: 300 }, limits)).toThrow();
    expect(() => validateCanvasDimensions({ width: 100, height: 100, dpi: 601 }, limits)).toThrow();
    expect(() => validateCanvasDimensions({ width: 100.5, height: 100, dpi: 300 }, limits)).toThrow();
  });

  it("resizes through undo and redo without changing strokes or layers", () => {
    const original = createInitialDrawingDocument(
      { id: "layer-1", name: "Layer 1", opacity: 1 },
      { width: 2048, height: 2048, dpi: 300 }
    );
    const history = commitHistory(createHistory(original, 10), {
      ...original,
      canvas: { width: 1000, height: 1500, dpi: 240 }
    });

    expect(undoHistory(history).present).toBe(original);
    expect(redoHistory(undoHistory(history)).present).toBe(history.present);
    expect(history.present.layers).toBe(original.layers);
  });

  it("exports at the document size and pads only the image sent for generation", () => {
    const canvases: Array<{ width: number; height: number }> = [];
    const createCanvas = () => {
      const canvas = {
        width: 0,
        height: 0,
        getContext: () => ({
          canvas,
          clearRect: () => undefined,
          fillRect: () => undefined,
          translate: () => undefined,
          drawImage: () => undefined,
          fillStyle: ""
        }),
        toDataURL: () => `data:image/png;size=${canvas.width}x${canvas.height}`
      };
      canvases.push(canvas);
      return canvas;
    };
    vi.stubGlobal("window", { document: { createElement: createCanvas } });
    const document = createInitialDrawingDocument(
      { id: "layer-1", name: "Layer 1", opacity: 1 },
      { width: 1000, height: 1500, dpi: 300 }
    );
    const config = {
      canvas: { backgroundColor: "#fff" },
      tools: { pressureMinSizeFactor: 0.5, pressureMaxSizeFactor: 1.5 },
      imageGeneration: { canvasPaddingRatio: 0.08 }
    } as AppConfig;

    expect(exportDocumentCanvasToDataUrl(document, config, "image/png")).toBe("data:image/png;size=1000x1500");
    expect(exportDocumentForGenerationToPngDataUrl(document, config)).toBe("data:image/png;size=1160x1660");
    expect(canvases).toHaveLength(3);
  });
});
