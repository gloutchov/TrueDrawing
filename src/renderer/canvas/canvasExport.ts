import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { DrawingDocument } from "../../shared/document/documentTypes";
import type { CanvasSelection } from "../../shared/document/selectionTypes";
import { normalizeCanvasSelection } from "../../shared/document/selectionTypes";
import { renderCanvas } from "./canvasRenderer";

export function exportDocumentCanvasToPngDataUrl(
  document: DrawingDocument,
  config: AppConfig
): string {
  return exportDocumentCanvasToDataUrl(document, config, "image/png");
}

export function exportDocumentCanvasToDataUrl(
  document: DrawingDocument,
  config: AppConfig,
  mimeType: "image/png" | "image/webp"
): string {
  const canvas = window.document.createElement("canvas");
  const sourceWidth = config.canvas.defaultWidth;
  const sourceHeight = config.canvas.defaultHeight;
  const padding = Math.round(
    Math.min(sourceWidth, sourceHeight) * config.imageGeneration.canvasPaddingRatio
  );

  canvas.width = sourceWidth + (padding * 2);
  canvas.height = sourceHeight + (padding * 2);

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create canvas export context.");
  }

  context.fillStyle = config.canvas.backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.translate(padding, padding);

  const sourceCanvas = window.document.createElement("canvas");

  sourceCanvas.width = sourceWidth;
  sourceCanvas.height = sourceHeight;

  const sourceContext = sourceCanvas.getContext("2d");

  if (!sourceContext) {
    throw new Error("Unable to create canvas source export context.");
  }

  renderCanvas(sourceContext, document, {
    backgroundColor: config.canvas.backgroundColor,
    pressureMinSizeFactor: config.tools.pressureMinSizeFactor,
    pressureMaxSizeFactor: config.tools.pressureMaxSizeFactor
  });
  context.drawImage(sourceCanvas, 0, 0);

  return canvas.toDataURL(mimeType);
}

export async function convertImageDataUrl(
  dataUrl: string,
  mimeType: "image/png" | "image/webp"
): Promise<string> {
  const image = new Image();

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Unable to load generated image for export."));
    image.src = dataUrl;
  });

  const canvas = window.document.createElement("canvas");

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create image export context.");
  }

  context.drawImage(image, 0, 0);

  return canvas.toDataURL(mimeType);
}

export function exportDocumentSelectionToPngDataUrl(
  document: DrawingDocument,
  config: AppConfig,
  selection: CanvasSelection
): string {
  const normalizedSelection = normalizeCanvasSelection(selection);
  const sourceCanvas = window.document.createElement("canvas");

  sourceCanvas.width = config.canvas.defaultWidth;
  sourceCanvas.height = config.canvas.defaultHeight;

  const sourceContext = sourceCanvas.getContext("2d");

  if (!sourceContext) {
    throw new Error("Unable to create selection export context.");
  }

  renderCanvas(sourceContext, document, {
    backgroundColor: config.canvas.backgroundColor,
    pressureMinSizeFactor: config.tools.pressureMinSizeFactor,
    pressureMaxSizeFactor: config.tools.pressureMaxSizeFactor
  });

  const cropCanvas = window.document.createElement("canvas");

  cropCanvas.width = Math.max(1, Math.round(normalizedSelection.width));
  cropCanvas.height = Math.max(1, Math.round(normalizedSelection.height));

  const cropContext = cropCanvas.getContext("2d");

  if (!cropContext) {
    throw new Error("Unable to create selection crop context.");
  }

  cropContext.drawImage(
    sourceCanvas,
    normalizedSelection.x,
    normalizedSelection.y,
    normalizedSelection.width,
    normalizedSelection.height,
    0,
    0,
    cropCanvas.width,
    cropCanvas.height
  );

  return cropCanvas.toDataURL("image/png");
}
