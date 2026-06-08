import { contextBridge, ipcRenderer } from "electron";

import type { AppConfig } from "../shared/config/appConfigSchema";
import type {
  ApiKeyStatus,
  ImageGenerationPreferences,
  RealisticImageRequest,
  RealisticImageResult
} from "../shared/image-generation/imageGenerationTypes";
import type { RuntimeInfo } from "../shared/runtime/runtimeInfo";

const api = {
  getAppConfig: (): Promise<AppConfig> => ipcRenderer.invoke("config:get") as Promise<AppConfig>,
  getRuntimeInfo: (): Promise<RuntimeInfo> => ipcRenderer.invoke("runtime:get") as Promise<RuntimeInfo>,
  getOpenAiApiKeyStatus: (): Promise<ApiKeyStatus> => (
    ipcRenderer.invoke("secrets:openai-key-status") as Promise<ApiKeyStatus>
  ),
  setOpenAiApiKey: (apiKey: string): Promise<ApiKeyStatus> => (
    ipcRenderer.invoke("secrets:set-openai-key", apiKey) as Promise<ApiKeyStatus>
  ),
  clearOpenAiApiKey: (): Promise<ApiKeyStatus> => (
    ipcRenderer.invoke("secrets:clear-openai-key") as Promise<ApiKeyStatus>
  ),
  getImageGenerationPreferences: (): Promise<ImageGenerationPreferences> => (
    ipcRenderer.invoke("preferences:image-generation:get") as Promise<ImageGenerationPreferences>
  ),
  setImageGenerationModel: (model: string): Promise<ImageGenerationPreferences> => (
    ipcRenderer.invoke("preferences:image-generation:set-model", model) as Promise<ImageGenerationPreferences>
  ),
  generateRealisticImage: (request: RealisticImageRequest): Promise<RealisticImageResult> => (
    ipcRenderer.invoke("image-generation:generate-realistic", request) as Promise<RealisticImageResult>
  ),
  onOpenApiKeySettings: (callback: () => void): (() => void) => {
    const listener = () => callback();

    ipcRenderer.on("settings:open-api-key", listener);

    return () => {
      ipcRenderer.off("settings:open-api-key", listener);
    };
  }
};

contextBridge.exposeInMainWorld("trueDrawing", api);

export type TrueDrawingApi = typeof api;

