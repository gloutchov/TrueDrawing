import type { DrawingDocument } from "../document/documentTypes";

export function buildRealisticImagePrompt(document: DrawingDocument): string {
  const visibleLayerCount = document.layers.filter((layer) => layer.visible).length;
  const strokeCount = document.layers.reduce((count, layer) => count + layer.strokes.length, 0);

  return [
    "Transform the supplied drawing canvas into a realistic image.",
    "Preserve the composition, silhouette, spatial relationships, and intent of the sketch.",
    "Use natural lighting, plausible materials, and realistic surface detail.",
    "Do not add text, signatures, watermarks, frames, or UI elements.",
    `Visible layers: ${visibleLayerCount}. Total strokes: ${strokeCount}.`
  ].join(" ");
}
