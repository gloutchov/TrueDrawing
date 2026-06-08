/// <reference types="vite/client" />

import type { AppConfig } from "../shared/config/appConfigSchema";
import type {
  ApiKeyStatus,
  ImageGenerationPreferences,
  RealisticImageRequest,
  RealisticImageResult
} from "../shared/image-generation/imageGenerationTypes";
import type { RuntimeInfo } from "../shared/runtime/runtimeInfo";

declare global {
  interface Window {
    trueDrawing: {
      getAppConfig: () => Promise<AppConfig>;
      getRuntimeInfo: () => Promise<RuntimeInfo>;
      getOpenAiApiKeyStatus: () => Promise<ApiKeyStatus>;
      setOpenAiApiKey: (apiKey: string) => Promise<ApiKeyStatus>;
      clearOpenAiApiKey: () => Promise<ApiKeyStatus>;
      getImageGenerationPreferences: () => Promise<ImageGenerationPreferences>;
      setImageGenerationModel: (model: string) => Promise<ImageGenerationPreferences>;
      generateRealisticImage: (request: RealisticImageRequest) => Promise<RealisticImageResult>;
      onOpenApiKeySettings: (callback: () => void) => () => void;
    };
  }
}
