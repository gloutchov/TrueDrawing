import fs from "node:fs";
import path from "node:path";

import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { ImageGenerationPreferences } from "../../shared/image-generation/imageGenerationTypes";

export type ImageGenerationPreferencesStore = {
  getPreferences: () => ImageGenerationPreferences;
  setModel: (model: string) => ImageGenerationPreferences;
};

type StoredPreferences = {
  version: 1;
  model: string;
};

const preferencesDirectoryName = "preferences";
const preferencesFileName = "image-generation.json";

export function createImageGenerationPreferencesStore(
  userDataPath: string,
  getConfig: () => AppConfig
): ImageGenerationPreferencesStore {
  return {
    getPreferences: () => readPreferences(userDataPath, getConfig()),
    setModel: (model) => setModel(userDataPath, model)
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

    return { model: storedPreferences.model };
  } catch {
    return getDefaultPreferences(config);
  }
}

function setModel(userDataPath: string, model: string): ImageGenerationPreferences {
  const trimmedModel = model.trim();

  if (!isValidImageModelName(trimmedModel)) {
    throw new Error("Image model name is not valid.");
  }

  const preferencesPath = getPreferencesPath(userDataPath);
  const storedPreferences: StoredPreferences = {
    version: 1,
    model: trimmedModel
  };

  fs.mkdirSync(path.dirname(preferencesPath), { recursive: true });
  fs.writeFileSync(preferencesPath, JSON.stringify(storedPreferences, null, 2), {
    encoding: "utf8",
    mode: 0o600
  });

  return { model: trimmedModel };
}

function getDefaultPreferences(config: AppConfig): ImageGenerationPreferences {
  return {
    model: config.imageGeneration.defaultModel
  };
}

function isValidImageModelName(model: string): boolean {
  return /^[A-Za-z0-9._:-]{2,100}$/.test(model);
}

function getPreferencesPath(userDataPath: string): string {
  return path.join(userDataPath, preferencesDirectoryName, preferencesFileName);
}
