import fs from "node:fs";
import path from "node:path";

import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { ImageGenerationPreferences } from "../../shared/image-generation/imageGenerationTypes";

export type ImageGenerationPreferencesStore = {
  getPreferences: () => ImageGenerationPreferences;
  setModel: (model: string) => ImageGenerationPreferences;
  setStyle: (style: string) => ImageGenerationPreferences;
  setAutoRedraw: (enabled: boolean, delaySeconds: number) => ImageGenerationPreferences;
};

type StoredPreferences = {
  version: 1;
  model: string;
  style?: string;
  autoRedrawEnabled?: boolean;
  autoRedrawDelaySeconds?: number;
};

const preferencesDirectoryName = "preferences";
const preferencesFileName = "image-generation.json";

export function createImageGenerationPreferencesStore(
  userDataPath: string,
  getConfig: () => AppConfig
): ImageGenerationPreferencesStore {
  return {
    getPreferences: () => readPreferences(userDataPath, getConfig()),
    setModel: (model) => setModel(userDataPath, model, getConfig()),
    setStyle: (style) => setStyle(userDataPath, style, getConfig()),
    setAutoRedraw: (enabled, delaySeconds) => setAutoRedraw(
      userDataPath,
      enabled,
      delaySeconds,
      getConfig()
    )
  };
}

function readPreferences(userDataPath: string, config: AppConfig): ImageGenerationPreferences {
  const preferencesPath = getPreferencesPath(userDataPath);

  if (!fs.existsSync(preferencesPath)) {
    return getDefaultPreferences(config);
  }

  try {
    const storedPreferences = JSON.parse(fs.readFileSync(preferencesPath, "utf8")) as Partial<StoredPreferences>;

    if (
      storedPreferences.version !== 1 ||
      typeof storedPreferences.model !== "string" ||
      !isValidImageModelName(storedPreferences.model)
    ) {
      return getDefaultPreferences(config);
    }

    return normalizePreferences(storedPreferences, config);
  } catch {
    return getDefaultPreferences(config);
  }
}

function setModel(userDataPath: string, model: string, config: AppConfig): ImageGenerationPreferences {
  const trimmedModel = model.trim();

  if (!isValidImageModelName(trimmedModel)) {
    throw new Error("Image model name is not valid.");
  }

  return writePreferences(userDataPath, {
    ...readPreferences(userDataPath, config),
    model: trimmedModel
  });
}

function setStyle(userDataPath: string, style: string, config: AppConfig): ImageGenerationPreferences {
  const trimmedStyle = style.trim();

  if (!isValidImageStyle(trimmedStyle)) {
    throw new Error("Image style is not valid.");
  }

  return writePreferences(userDataPath, {
    ...readPreferences(userDataPath, config),
    style: trimmedStyle
  });
}

function setAutoRedraw(
  userDataPath: string,
  enabled: boolean,
  delaySeconds: number,
  config: AppConfig
): ImageGenerationPreferences {
  if (!Number.isFinite(delaySeconds)) {
    throw new Error("Auto redraw delay is not valid.");
  }

  return writePreferences(userDataPath, {
    ...readPreferences(userDataPath, config),
    autoRedrawEnabled: enabled,
    autoRedrawDelaySeconds: clampDelaySeconds(delaySeconds, config)
  });
}

function writePreferences(
  userDataPath: string,
  preferences: ImageGenerationPreferences
): ImageGenerationPreferences {
  const preferencesPath = getPreferencesPath(userDataPath);
  const storedPreferences: StoredPreferences = {
    version: 1,
    ...preferences
  };

  ensurePreferencesDirectory(preferencesPath);
  fs.writeFileSync(preferencesPath, JSON.stringify(storedPreferences, null, 2), {
    encoding: "utf8",
    mode: 0o600
  });

  return preferences;
}

function getDefaultPreferences(config: AppConfig): ImageGenerationPreferences {
  return {
    model: config.imageGeneration.defaultModel,
    style: config.imageGeneration.defaultStyle,
    autoRedrawEnabled: config.imageGeneration.autoRedrawDefaultEnabled,
    autoRedrawDelaySeconds: config.imageGeneration.autoRedrawDefaultDelaySeconds
  };
}

function isValidImageModelName(model: string): boolean {
  return /^[A-Za-z0-9._:-]{2,100}$/.test(model);
}

function normalizePreferences(
  storedPreferences: Partial<StoredPreferences>,
  config: AppConfig
): ImageGenerationPreferences {
  const defaults = getDefaultPreferences(config);
  const style = typeof storedPreferences.style === "string" && isValidImageStyle(storedPreferences.style)
    ? storedPreferences.style.trim()
    : defaults.style;
  const delaySeconds = typeof storedPreferences.autoRedrawDelaySeconds === "number"
    ? clampDelaySeconds(storedPreferences.autoRedrawDelaySeconds, config)
    : defaults.autoRedrawDelaySeconds;

  return {
    model: storedPreferences.model ?? defaults.model,
    style,
    autoRedrawEnabled: typeof storedPreferences.autoRedrawEnabled === "boolean"
      ? storedPreferences.autoRedrawEnabled
      : defaults.autoRedrawEnabled,
    autoRedrawDelaySeconds: delaySeconds
  };
}

function isValidImageStyle(style: string): boolean {
  const trimmedStyle = style.trim();

  return trimmedStyle.length >= 2
    && trimmedStyle.length <= 80
    && !containsControlCharacter(trimmedStyle);
}

function containsControlCharacter(value: string): boolean {
  return Array.from(value).some((character) => {
    const charCode = character.charCodeAt(0);

    return charCode < 32 || charCode === 127;
  });
}

function clampDelaySeconds(delaySeconds: number, config: AppConfig): number {
  return Math.min(
    config.imageGeneration.autoRedrawDelayRange.max,
    Math.max(config.imageGeneration.autoRedrawDelayRange.min, delaySeconds)
  );
}

function getPreferencesPath(userDataPath: string): string {
  return path.join(userDataPath, preferencesDirectoryName, preferencesFileName);
}

function ensurePreferencesDirectory(preferencesPath: string): void {
  const preferencesDirectory = path.dirname(preferencesPath);

  try {
    fs.mkdirSync(preferencesDirectory, { recursive: true });
  } catch (error: unknown) {
    if (!isFileAlreadyExistsError(error)) {
      throw error;
    }

    const existingPathStats = fs.statSync(preferencesDirectory);

    if (existingPathStats.isDirectory()) {
      return;
    }

    const backupPath = `${preferencesDirectory}.backup-${Date.now()}`;

    fs.renameSync(preferencesDirectory, backupPath);
    fs.mkdirSync(preferencesDirectory, { recursive: true });
  }
}

function isFileAlreadyExistsError(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "EEXIST";
}
