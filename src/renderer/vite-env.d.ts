/// <reference types="vite/client" />

import type { AppConfig } from "../shared/config/appConfigSchema";
import type {
  ApiKeyStatus,
  ImageGenerationPreferences,
  RealisticImageRequest,
  RealisticImageResult
} from "../shared/image-generation/imageGenerationTypes";
import type { RuntimeInfo } from "../shared/runtime/runtimeInfo";
import type {
  ProjectAutosaveInfo,
  ProjectAutosaveRequest,
  ProjectAutosaveResult,
  ProjectExportRequest,
  ProjectExportResult,
  ProjectOpenResult,
  ProjectSaveRequest,
  ProjectSaveResult
} from "../shared/project/projectTypes";

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
      saveProject: (request: ProjectSaveRequest) => Promise<ProjectSaveResult>;
      saveProjectAs: (request: ProjectSaveRequest) => Promise<ProjectSaveResult>;
      openProject: () => Promise<ProjectOpenResult>;
      autosaveProject: (request: ProjectAutosaveRequest) => Promise<ProjectAutosaveResult>;
      listAutosaves: () => Promise<ProjectAutosaveInfo[]>;
      loadAutosave: (id: string) => Promise<ProjectOpenResult>;
      clearAutosave: (id: string) => Promise<void>;
      exportProjectImage: (request: ProjectExportRequest) => Promise<ProjectExportResult>;
      writeClipboardImage: (dataUrl: string) => Promise<void>;
      readClipboardImage: () => Promise<string | null>;
      writeClipboardText: (text: string) => Promise<void>;
      readClipboardText: () => Promise<string>;
      setWindowFullscreen: (fullscreen: boolean) => Promise<void>;
      isWindowFullscreen: () => Promise<boolean>;
      onOpenApiKeySettings: (callback: () => void) => () => void;
      onFileCommand: (callback: (command: string) => void) => () => void;
      onEditCommand: (callback: (command: string) => void) => () => void;
      onViewCommand: (callback: (command: string) => void) => () => void;
    };
  }
}
