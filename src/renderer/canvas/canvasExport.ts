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
  return renderDocumentToCanvas(document, config).toDataURL(mimeType);
}

export function exportDocumentForGenerationToPngDataUrl(
  document: DrawingDocument,
  config: AppConfig
): string {
  const sourceCanvas = renderDocumentToCanvas(document, config);
  const canvas = window.document.createElement("canvas");
  const sourceWidth = document.canvas.width;
  const sourceHeight = document.canvas.height;
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

  context.drawImage(sourceCanvas, 0, 0);

  return canvas.toDataURL("image/png");
}

function renderDocumentToCanvas(document: DrawingDocument, config: AppConfig): HTMLCanvasElement {
  const canvas = window.document.createElement("canvas");
  canvas.width = document.canvas.width;
  canvas.height = document.canvas.height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create canvas export context.");
  }

  renderCanvas(context, document, {
    backgroundColor: config.canvas.backgroundColor,
    pressureMinSizeFactor: config.tools.pressureMinSizeFactor,
    pressureMaxSizeFactor: config.tools.pressureMaxSizeFactor
  });
  return canvas;
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

  sourceCanvas.width = document.canvas.width;
  sourceCanvas.height = document.canvas.height;

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
