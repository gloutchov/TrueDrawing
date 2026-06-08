import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { DrawingDocument } from "../../shared/document/documentTypes";
import { renderCanvas } from "./canvasRenderer";

export function exportDocumentCanvasToPngDataUrl(
  document: DrawingDocument,
  config: AppConfig
): string {
  const canvas = window.document.createElement("canvas");

  canvas.width = config.canvas.defaultWidth;
  canvas.height = config.canvas.defaultHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create canvas export context.");
  }

  renderCanvas(context, document, {
    backgroundColor: config.canvas.backgroundColor,
    pressureMinSizeFactor: config.tools.pressureMinSizeFactor,
    pressureMaxSizeFactor: config.tools.pressureMaxSizeFactor
  });

  return canvas.toDataURL("image/png");
}
