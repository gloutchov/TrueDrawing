import { containsCredentialText } from "../security/credentialText";

export type ImageQuality = "auto" | "low" | "medium" | "high";
export type ImageSize = "auto" | "1024x1024" | "1536x1024" | "1024x1536";
export type StylePreset = {
  id: string;
  name: { it: string; en: string };
  description: { it: string; en: string };
  promptFragment: string;
  parameters: { quality?: ImageQuality; size?: ImageSize };
};

export function validateStylePresets(value: unknown): StylePreset[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 32) {
    throw new Error("Invalid style presets configuration.");
  }
  const ids = new Set<string>();
  return value.map((entry: unknown) => {
    const preset = object(entry);
    const id = text(preset.id, 40);
    if (!/^[a-z][a-z0-9-]+$/.test(id) || ids.has(id) || id === "custom") {
      throw new Error("Invalid style preset identity.");
    }
    ids.add(id);
    const name = object(preset.name);
    const description = object(preset.description);
    const parameters = object(preset.parameters);
    if (Object.keys(parameters).some(key => key !== "quality" && key !== "size")) {
      throw new Error("Invalid style preset parameters.");
    }
    return {
      id,
      name: { it: text(name.it, 80), en: text(name.en, 80) },
      description: { it: text(description.it, 240), en: text(description.en, 240) },
      promptFragment: text(preset.promptFragment, 2000),
      parameters: {
        ...(parameters.quality === undefined ? {} : { quality: validateImageQuality(parameters.quality) }),
        ...(parameters.size === undefined ? {} : { size: validateImageSize(parameters.size) })
      }
    };
  });
}

export function validateImageQuality(value: unknown): ImageQuality {
  if (value !== "auto" && value !== "low" && value !== "medium" && value !== "high") {
    throw new Error("Invalid image quality.");
  }
  return value;
}

export function validateImageSize(value: unknown): ImageSize {
  if (value !== "auto" && value !== "1024x1024" && value !== "1536x1024" && value !== "1024x1536") {
    throw new Error("Invalid image size.");
  }
  return value;
}

export function findStylePreset(presets: readonly StylePreset[], id: string): StylePreset | undefined {
  return presets.find(preset => preset.id === id);
}

export function validateCustomStyle(value: string, maxLength = 80): string {
  const style = value.trim();
  if (style.length < 2 || style.length > maxLength || containsCredentialText(style)
    || Array.from(style).some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) {
    throw new Error("Invalid image style.");
  }
  return style;
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid style preset configuration.");
  return value as Record<string, unknown>;
}

function text(value: unknown, maxLength: number): string {
  if (typeof value !== "string" || !value.trim() || value.length > maxLength
    || containsCredentialText(value)
    || Array.from(value).some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) {
    throw new Error("Invalid style preset text.");
  }
  return value.trim();
}
