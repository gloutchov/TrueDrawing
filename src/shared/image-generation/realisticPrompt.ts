import { findStylePreset, validateCustomStyle, type StylePreset } from "./stylePresets";

type RealisticImagePromptOptions = {
  imageStyle?: string;
  presets?: readonly StylePreset[];
  maxCustomStyleLength?: number;
};

export function buildRealisticImagePrompt(
  options: RealisticImagePromptOptions = {}
): string {
  const imageStyle = options.imageStyle?.trim();
  const preset = imageStyle ? findStylePreset(options.presets ?? [], imageStyle) : undefined;
  const styleInstruction = preset?.promptFragment ?? (imageStyle
    ? `Use this visual style: ${validateCustomStyle(imageStyle, options.maxCustomStyleLength)}.`
    : "Use natural lighting, plausible materials, and realistic surface detail.");

  return [
    "Transform the supplied drawing canvas into a finished image.",
    "Preserve the composition, silhouette, spatial relationships, and intent of the sketch.",
    "Render coherent lighting, forms, and materials that fit the requested visual style.",
    "Do not add text, signatures, watermarks, frames, or UI elements.",
    styleInstruction
  ].join(" ");
}
