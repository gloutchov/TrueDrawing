import { ipcMain } from "electron";

import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { ImageGenerationPreferencesStore } from "../preferences/imageGenerationPreferencesStore";
import type { ApiKeyStore } from "../secret-store/apiKeyStore";
import type { RuntimeInfo } from "../../shared/runtime/runtimeInfo";
import type { RealisticImageRequest } from "../../shared/image-generation/imageGenerationTypes";
import { generateOpenAiRealisticImage } from "../image-generation/openAiImageAdapter";

type RegisterIpcOptions = {
  getConfig: () => AppConfig;
  getRuntimeInfo: () => RuntimeInfo;
  apiKeyStore: ApiKeyStore;
  preferencesStore: ImageGenerationPreferencesStore;
};

export function registerIpc({
  getConfig,
  getRuntimeInfo,
  apiKeyStore,
  preferencesStore
}: RegisterIpcOptions): void {
  ipcMain.handle("config:get", () => getConfig());
  ipcMain.handle("runtime:get", () => getRuntimeInfo());
  ipcMain.handle("secrets:openai-key-status", () => ({
    configured: apiKeyStore.hasOpenAiApiKey(),
    backend: apiKeyStore.getStorageBackend()
  }));
  ipcMain.handle("secrets:set-openai-key", (_event, apiKey: unknown) => {
    if (typeof apiKey !== "string") {
      throw new Error("Invalid API key input.");
    }

    apiKeyStore.setOpenAiApiKey(apiKey);

    return {
      configured: true,
      backend: apiKeyStore.getStorageBackend()
    };
  });
  ipcMain.handle("secrets:clear-openai-key", () => {
    apiKeyStore.clearOpenAiApiKey();

    return {
      configured: false,
      backend: apiKeyStore.getStorageBackend()
    };
  });
  ipcMain.handle("preferences:image-generation:get", () => preferencesStore.getPreferences());
  ipcMain.handle("preferences:image-generation:set-model", (_event, model: unknown) => {
    if (typeof model !== "string") {
      throw new Error("Invalid image model input.");
    }

    return preferencesStore.setModel(model);
  });
  ipcMain.handle("image-generation:generate-realistic", async (_event, request: unknown) => {
    const realisticImageRequest = validateRealisticImageRequest(request);
    const apiKey = apiKeyStore.getOpenAiApiKey();

    if (!apiKey) {
      throw new Error("OpenAI API key is not configured.");
    }

    return generateOpenAiRealisticImage(realisticImageRequest, apiKey, getConfig());
  });
}

function validateRealisticImageRequest(value: unknown): RealisticImageRequest {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid image generation request.");
  }

  const request = value as Partial<RealisticImageRequest>;

  if (typeof request.canvasDataUrl !== "string" || !isPngDataUrl(request.canvasDataUrl)) {
    throw new Error("Invalid image generation request.");
  }

  if (typeof request.model !== "string" || !isValidImageModelName(request.model)) {
    throw new Error("Invalid image generation model.");
  }

  if (typeof request.prompt !== "string" || request.prompt.trim().length === 0) {
    throw new Error("Invalid image generation request.");
  }

  return {
    canvasDataUrl: request.canvasDataUrl,
    model: request.model.trim(),
    prompt: request.prompt.trim()
  };
}

function isPngDataUrl(value: string): boolean {
  return /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(value);
}

function isValidImageModelName(model: string): boolean {
  return /^[A-Za-z0-9._:-]{2,100}$/.test(model.trim());
}

