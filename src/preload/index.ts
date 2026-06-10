import { contextBridge, ipcRenderer } from "electron";
import type { IpcRendererEvent } from "electron";

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
  setImageGenerationStyle: (style: string): Promise<ImageGenerationPreferences> => (
    ipcRenderer.invoke("preferences:image-generation:set-style", style) as Promise<ImageGenerationPreferences>
  ),
  setImageGenerationAutoRedraw: (
    enabled: boolean,
    delaySeconds: number
  ): Promise<ImageGenerationPreferences> => (
    ipcRenderer.invoke("preferences:image-generation:set-auto-redraw", {
      enabled,
      delaySeconds
    }) as Promise<ImageGenerationPreferences>
  ),
  generateRealisticImage: (request: RealisticImageRequest): Promise<RealisticImageResult> => (
    ipcRenderer.invoke("image-generation:generate-realistic", request) as Promise<RealisticImageResult>
  ),
  saveProject: (request: ProjectSaveRequest): Promise<ProjectSaveResult> => (
    ipcRenderer.invoke("project:save", request) as Promise<ProjectSaveResult>
  ),
  saveProjectAs: (request: ProjectSaveRequest): Promise<ProjectSaveResult> => (
    ipcRenderer.invoke("project:save-as", request) as Promise<ProjectSaveResult>
  ),
  openProject: (): Promise<ProjectOpenResult> => (
    ipcRenderer.invoke("project:open") as Promise<ProjectOpenResult>
  ),
  autosaveProject: (request: ProjectAutosaveRequest): Promise<ProjectAutosaveResult> => (
    ipcRenderer.invoke("project:autosave", request) as Promise<ProjectAutosaveResult>
  ),
  listAutosaves: (): Promise<ProjectAutosaveInfo[]> => (
    ipcRenderer.invoke("project:autosaves:list") as Promise<ProjectAutosaveInfo[]>
  ),
  loadAutosave: (id: string): Promise<ProjectOpenResult> => (
    ipcRenderer.invoke("project:autosave:load", id) as Promise<ProjectOpenResult>
  ),
  clearAutosave: (id: string): Promise<void> => (
    ipcRenderer.invoke("project:autosave:clear", id) as Promise<void>
  ),
  exportProjectImage: (request: ProjectExportRequest): Promise<ProjectExportResult> => (
    ipcRenderer.invoke("project:export", request) as Promise<ProjectExportResult>
  ),
  writeClipboardImage: (dataUrl: string): Promise<void> => (
    ipcRenderer.invoke("clipboard:write-image", dataUrl) as Promise<void>
  ),
  readClipboardImage: (): Promise<string | null> => (
    ipcRenderer.invoke("clipboard:read-image") as Promise<string | null>
  ),
  writeClipboardText: (text: string): Promise<void> => (
    ipcRenderer.invoke("clipboard:write-text", text) as Promise<void>
  ),
  readClipboardText: (): Promise<string> => (
    ipcRenderer.invoke("clipboard:read-text") as Promise<string>
  ),
  setWindowFullscreen: (fullscreen: boolean): Promise<void> => (
    ipcRenderer.invoke("window:set-fullscreen", fullscreen) as Promise<void>
  ),
  isWindowFullscreen: (): Promise<boolean> => (
    ipcRenderer.invoke("window:is-fullscreen") as Promise<boolean>
  ),
  onOpenApiKeySettings: (callback: () => void): (() => void) => {
    const listener = () => callback();

    ipcRenderer.on("settings:open-api-key", listener);

    return () => {
      ipcRenderer.off("settings:open-api-key", listener);
    };
  },
  onOpenImageStyleSettings: (callback: () => void): (() => void) => {
    const listener = () => callback();

    ipcRenderer.on("settings:open-image-style", listener);

    return () => {
      ipcRenderer.off("settings:open-image-style", listener);
    };
  },
  onOpenAutoRedrawSettings: (callback: () => void): (() => void) => {
    const listener = () => callback();

    ipcRenderer.on("settings:open-auto-redraw", listener);

    return () => {
      ipcRenderer.off("settings:open-auto-redraw", listener);
    };
  },
  onFileCommand: (callback: (command: string) => void): (() => void) => {
    const listener = (_event: IpcRendererEvent, command: unknown) => {
      if (typeof command === "string") {
        callback(command);
      }
    };

    ipcRenderer.on("file:command", listener);

    return () => {
      ipcRenderer.off("file:command", listener);
    };
  },
  onEditCommand: (callback: (command: string) => void): (() => void) => {
    const listener = (_event: IpcRendererEvent, command: unknown) => {
      if (typeof command === "string") {
        callback(command);
      }
    };

    ipcRenderer.on("edit:command", listener);

    return () => {
      ipcRenderer.off("edit:command", listener);
    };
  },
  onViewCommand: (callback: (command: string) => void): (() => void) => {
    const listener = (_event: IpcRendererEvent, command: unknown) => {
      if (typeof command === "string") {
        callback(command);
      }
    };

    ipcRenderer.on("view:command", listener);

    return () => {
      ipcRenderer.off("view:command", listener);
    };
  }
};

contextBridge.exposeInMainWorld("trueDrawing", api);

export type TrueDrawingApi = typeof api;

