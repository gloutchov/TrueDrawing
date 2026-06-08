import { ipcMain } from "electron";

import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { ApiKeyStore } from "../secret-store/apiKeyStore";
import type { RuntimeInfo } from "../../shared/runtime/runtimeInfo";
import type { RealisticImageRequest } from "../../shared/image-generation/imageGenerationTypes";
import { generateOpenAiRealisticImage } from "../image-generation/openAiImageAdapter";

type RegisterIpcOptions = {
  getConfig: () => AppConfig;
  getRuntimeInfo: () => RuntimeInfo;
  apiKeyStore: ApiKeyStore;
};

export function registerIpc({ getConfig, getRuntimeInfo, apiKeyStore }: RegisterIpcOptions): void {
  ipcMain.handle("config:get", () => getConfig());
  ipcMain.handle("runtime:get", () => getRuntimeInfo());
  ipcMain.handle("secrets:openai-key-status", () => ({
    configured: apiKeyStore.hasOpenAiApiKey()
  }));
  ipcMain.handle("secrets:set-openai-key", (_event, apiKey: unknown) => {
    if (typeof apiKey !== "string") {
      throw new Error("Invalid API key input.");
    }

    apiKeyStore.setOpenAiApiKey(apiKey);

    return { configured: true };
  });
  ipcMain.handle("secrets:clear-openai-key", () => {
    apiKeyStore.clearOpenAiApiKey();

    return { configured: false };
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

  if (
    typeof request.canvasDataUrl !== "string" ||
    typeof request.model !== "string" ||
    typeof request.prompt !== "string"
  ) {
    throw new Error("Invalid image generation request.");
  }

  return {
    canvasDataUrl: request.canvasDataUrl,
    model: request.model,
    prompt: request.prompt
  };
}

