import { BrowserWindow, clipboard, ipcMain, nativeImage } from "electron";

import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { ImageGenerationPreferencesStore } from "../preferences/imageGenerationPreferencesStore";
import type { ApiKeyStore } from "../secret-store/apiKeyStore";
import type { RuntimeInfo } from "../../shared/runtime/runtimeInfo";
import type { RealisticImageRequest } from "../../shared/image-generation/imageGenerationTypes";
import { generateOpenAiRealisticImage } from "../image-generation/openAiImageAdapter";
import type { DocumentStore } from "../project/documentStore";
import { parseDrawingProjectFile } from "../../shared/project/projectModel";
import type {
  ProjectAutosaveRequest,
  ProjectExportRequest,
  ProjectSaveRequest
} from "../../shared/project/projectTypes";

const maxImageDataUrlLength = 32 * 1024 * 1024;
const maxPromptLength = 8000;
const maxClipboardTextLength = 1024 * 1024;

type RegisterIpcOptions = {
  getConfig: () => AppConfig;
  getRuntimeInfo: () => RuntimeInfo;
  apiKeyStore: ApiKeyStore;
  preferencesStore: ImageGenerationPreferencesStore;
  documentStore: DocumentStore;
};

export function registerIpc({
  getConfig,
  getRuntimeInfo,
  apiKeyStore,
  preferencesStore,
  documentStore
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
  ipcMain.handle("preferences:image-generation:set-style", (_event, style: unknown) => {
    if (typeof style !== "string") {
      throw new Error("Invalid image style input.");
    }

    return preferencesStore.setStyle(style);
  });
  ipcMain.handle("preferences:image-generation:set-auto-redraw", (_event, options: unknown) => {
    if (!options || typeof options !== "object") {
      throw new Error("Invalid auto redraw preferences.");
    }

    const preferences = options as Partial<{
      enabled: unknown;
      delaySeconds: unknown;
    }>;

    if (typeof preferences.enabled !== "boolean" || typeof preferences.delaySeconds !== "number") {
      throw new Error("Invalid auto redraw preferences.");
    }

    return preferencesStore.setAutoRedraw(preferences.enabled, preferences.delaySeconds);
  });
  ipcMain.handle("image-generation:generate-realistic", async (_event, request: unknown) => {
    const realisticImageRequest = validateRealisticImageRequest(request);
    const apiKey = apiKeyStore.getOpenAiApiKey();

    if (!apiKey) {
      throw new Error("OpenAI API key is not configured.");
    }

    return generateOpenAiRealisticImage(realisticImageRequest, apiKey, getConfig());
  });
  ipcMain.handle("project:save", (event, request: unknown) => (
    documentStore.saveProject(validateProjectSaveRequest(request), {
      showSaveDialog: false,
      parentWindow: BrowserWindow.fromWebContents(event.sender)
    })
  ));
  ipcMain.handle("project:save-as", (event, request: unknown) => (
    documentStore.saveProject(validateProjectSaveRequest(request), {
      showSaveDialog: true,
      parentWindow: BrowserWindow.fromWebContents(event.sender)
    })
  ));
  ipcMain.handle("project:open", (event) => (
    documentStore.openProject(BrowserWindow.fromWebContents(event.sender))
  ));
  ipcMain.handle("project:autosave", (_event, request: unknown) => (
    documentStore.autosaveProject(validateProjectAutosaveRequest(request))
  ));
  ipcMain.handle("project:autosaves:list", () => documentStore.listAutosaves());
  ipcMain.handle("project:autosave:load", (_event, id: unknown) => {
    if (typeof id !== "string") {
      throw new Error("Invalid autosave identifier.");
    }

    return documentStore.loadAutosave(id);
  });
  ipcMain.handle("project:autosave:clear", (_event, id: unknown) => {
    if (typeof id !== "string") {
      throw new Error("Invalid autosave identifier.");
    }

    return documentStore.clearAutosave(id);
  });
  ipcMain.handle("project:export", (event, request: unknown) => (
    documentStore.exportImage(
      validateProjectExportRequest(request),
      BrowserWindow.fromWebContents(event.sender)
    )
  ));
  ipcMain.handle("clipboard:write-image", (_event, dataUrl: unknown) => {
    if (typeof dataUrl !== "string" || !isImageDataUrl(dataUrl) || dataUrl.length > maxImageDataUrlLength) {
      throw new Error("Invalid clipboard image.");
    }

    clipboard.writeImage(nativeImage.createFromDataURL(dataUrl));
  });
  ipcMain.handle("clipboard:read-image", () => {
    const image = clipboard.readImage();

    if (image.isEmpty()) {
      return null;
    }

    const dataUrl = image.toDataURL();

    if (dataUrl.length > maxImageDataUrlLength) {
      throw new Error("Clipboard image is too large.");
    }

    return dataUrl;
  });
  ipcMain.handle("clipboard:write-text", (_event, text: unknown) => {
    if (typeof text !== "string" || text.length > maxClipboardTextLength) {
      throw new Error("Invalid clipboard text.");
    }

    clipboard.writeText(text);
  });
  ipcMain.handle("clipboard:read-text", () => clipboard.readText());
  ipcMain.handle("window:set-fullscreen", (event, fullscreen: unknown) => {
    if (typeof fullscreen !== "boolean") {
      throw new Error("Invalid fullscreen state.");
    }

    BrowserWindow.fromWebContents(event.sender)?.setFullScreen(fullscreen);
  });
  ipcMain.handle("window:is-fullscreen", (event) => (
    BrowserWindow.fromWebContents(event.sender)?.isFullScreen() ?? false
  ));
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

  if (
    typeof request.prompt !== "string" ||
    request.prompt.trim().length === 0 ||
    request.prompt.length > maxPromptLength
  ) {
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

function validateProjectSaveRequest(value: unknown): ProjectSaveRequest {
  const request = validateProjectWriteRequest(value);

  return {
    project: request.project,
    filePath: request.filePath,
    canvasDataUrl: request.canvasDataUrl,
    imageDataUrl: request.imageDataUrl
  };
}

function validateProjectAutosaveRequest(value: unknown): ProjectAutosaveRequest {
  const request = validateProjectWriteRequest(value);

  return {
    project: request.project,
    canvasDataUrl: request.canvasDataUrl,
    imageDataUrl: request.imageDataUrl
  };
}

function validateProjectWriteRequest(value: unknown): ProjectSaveRequest {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid project request.");
  }

  const request = value as Partial<ProjectSaveRequest>;

  return {
    project: parseDrawingProjectFile(request.project),
    filePath: request.filePath === null || typeof request.filePath === "string"
      ? request.filePath
      : null,
    canvasDataUrl: expectImageDataUrl(request.canvasDataUrl, "canvasDataUrl"),
    imageDataUrl: request.imageDataUrl === null || request.imageDataUrl === undefined
      ? null
      : expectImageDataUrl(request.imageDataUrl, "imageDataUrl")
  };
}

function validateProjectExportRequest(value: unknown): ProjectExportRequest {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid export request.");
  }

  const request = value as Partial<ProjectExportRequest>;

  if (request.target !== "canvas" && request.target !== "image") {
    throw new Error("Invalid export target.");
  }

  if (request.format !== "png" && request.format !== "webp") {
    throw new Error("Invalid export format.");
  }

  if (typeof request.name !== "string" || request.name.trim().length === 0) {
    throw new Error("Invalid export name.");
  }

  return {
    name: request.name.trim(),
    target: request.target,
    format: request.format,
    dataUrl: expectImageDataUrl(request.dataUrl, "dataUrl")
  };
}

function expectImageDataUrl(value: unknown, label: string): string {
  if (typeof value !== "string" || !isImageDataUrl(value) || value.length > maxImageDataUrlLength) {
    throw new Error(`Invalid ${label}.`);
  }

  return value;
}

function isImageDataUrl(value: string): boolean {
  return /^data:image\/(png|webp|jpeg);base64,[A-Za-z0-9+/=]+$/.test(value);
}

