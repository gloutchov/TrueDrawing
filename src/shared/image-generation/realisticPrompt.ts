import type { DrawingDocument } from "../document/documentTypes";

type RealisticImagePromptOptions = {
  imageStyle?: string;
};

export function buildRealisticImagePrompt(
  document: DrawingDocument,
  options: RealisticImagePromptOptions = {}
): string {
  const visibleLayerCount = document.layers.filter((layer) => layer.visible).length;
  const strokeCount = document.layers.reduce((count, layer) => count + layer.strokes.length, 0);
  const imageStyle = options.imageStyle?.trim();

  return [
    "Transform the supplied drawing canvas into a realistic image.",
    imageStyle ? `Use this visual style: ${imageStyle}.` : null,
    "Preserve the composition, silhouette, spatial relationships, and intent of the sketch.",
    "Use natural lighting, plausible materials, and realistic surface detail.",
    "Do not add text, signatures, watermarks, frames, or UI elements.",
    `Visible layers: ${visibleLayerCount}. Total strokes: ${strokeCount}.`
  ].filter((part): part is string => part !== null).join(" ");
}
