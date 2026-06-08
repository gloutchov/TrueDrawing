import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { DrawingDocument } from "../../shared/document/documentTypes";
import { renderCanvas } from "./canvasRenderer";

export function exportDocumentCanvasToPngDataUrl(
  document: DrawingDocument,
  config: AppConfig
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

  return canvas.toDataURL("image/png");
}
