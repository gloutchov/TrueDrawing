import { importReferenceImage } from "../project/referenceImport";
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

import { maxImageDataUrlLength, validateImageDataUrl } from "../../shared/security/imagePayload";
import { sanitizeIpcError, validateIpcSender } from "../security/ipcSecurity";

const handle: typeof ipcMain.handle = (channel, listener) => {
  ipcMain.handle(channel, async (event, ...args) => {
    try {
      validateIpcSender(event);
      return await listener(event, ...args);
    } catch (error: unknown) { throw new Error(sanitizeIpcError(error)); }
  });
};
const maxPromptLength = 8000;
const maxClipboardTextLength = 1024 * 1024;

type RegisterIpcOptions = {
  getConfig: () => AppConfig;
  getRuntimeInfo: () => RuntimeInfo;
  onUiLocaleChange: (locale: "it" | "en") => void;
  apiKeyStore: ApiKeyStore;
  preferencesStore: ImageGenerationPreferencesStore;
  documentStore: DocumentStore;
};

export function registerIpc({
  getConfig,
  getRuntimeInfo,
  onUiLocaleChange,
  apiKeyStore,
  preferencesStore,
  documentStore
}: RegisterIpcOptions): void {
  handle("config:get", () => getConfig());
  handle("runtime:get", () => getRuntimeInfo());
  handle("settings:ui-menu-locale:set", (_event, locale: unknown) => {
    if (locale !== "it" && locale !== "en") {
      throw new Error("Invalid UI locale.");
    }

    onUiLocaleChange(locale);
  });
  handle("secrets:openai-key-status", () => ({
    configured: apiKeyStore.hasOpenAiApiKey(),
    backend: apiKeyStore.getStorageBackend()
  }));
  handle("secrets:set-openai-key", (_event, apiKey: unknown) => {
    if (typeof apiKey !== "string") {
      throw new Error("Invalid API key input.");
    }

    apiKeyStore.setOpenAiApiKey(apiKey);

    return {
      configured: true,
      backend: apiKeyStore.getStorageBackend()
    };
  });
  handle("secrets:clear-openai-key", () => {
    apiKeyStore.clearOpenAiApiKey();

    return {
      configured: false,
      backend: apiKeyStore.getStorageBackend()
    };
  });
  handle("preferences:image-generation:get", () => preferencesStore.getPreferences());
  handle("preferences:image-generation:set-model", (_event, model: unknown) => {
    if (typeof model !== "string") {
      throw new Error("Invalid image model input.");
    }

    return preferencesStore.setModel(model);
  });
  handle("preferences:image-generation:set-style", (_event, style: unknown) => {
    if (typeof style !== "string") {
      throw new Error("Invalid image style input.");
    }

    return preferencesStore.setStyle(style);
  });
  handle("preferences:image-generation:set-auto-redraw", (_event, options: unknown) => {
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
  handle("image-generation:generate-realistic", async (_event, request: unknown) => {
    const realisticImageRequest = validateRealisticImageRequest(request);
    const apiKey = apiKeyStore.getOpenAiApiKey();

    if (!apiKey) {
      throw new Error("OpenAI API key is not configured.");
    }

    return generateOpenAiRealisticImage(realisticImageRequest, apiKey, getConfig());
  });
  handle("project:save", (event, request: unknown) => (
    documentStore.saveProject(validateProjectSaveRequest(request, getConfig()), {
      showSaveDialog: false,
      parentWindow: BrowserWindow.fromWebContents(event.sender)
    })
  ));
  handle("project:save-as", (event, request: unknown) => (
    documentStore.saveProject(validateProjectSaveRequest(request, getConfig()), {
      showSaveDialog: true,
      parentWindow: BrowserWindow.fromWebContents(event.sender)
    })
  ));
  handle("reference:import", event => importReferenceImage(getConfig(), BrowserWindow.fromWebContents(event.sender)));
  handle("project:open", (event) => (
    documentStore.openProject(BrowserWindow.fromWebContents(event.sender))
  ));
  handle("project:autosave", (_event, request: unknown) => (
    documentStore.autosaveProject(validateProjectAutosaveRequest(request, getConfig()))
  ));
  handle("project:autosaves:list", () => documentStore.listAutosaves());
  handle("project:autosave:load", (_event, id: unknown) => {
    if (typeof id !== "string") {
      throw new Error("Invalid autosave identifier.");
    }

    return documentStore.loadAutosave(id);
  });
  handle("project:autosave:clear", (_event, id: unknown) => {
    if (typeof id !== "string") {
      throw new Error("Invalid autosave identifier.");
    }

    return documentStore.clearAutosave(id);
  });
  handle("project:export", (event, request: unknown) => (
    documentStore.exportImage(
      validateProjectExportRequest(request),
      BrowserWindow.fromWebContents(event.sender)
    )
  ));
  handle("clipboard:write-image", (_event, dataUrl: unknown) => {
    if (typeof dataUrl !== "string" || !isImageDataUrl(dataUrl) || dataUrl.length > maxImageDataUrlLength) {
      throw new Error("Invalid clipboard image.");
    }

    validateImageDataUrl(dataUrl);
    clipboard.writeImage(nativeImage.createFromDataURL(dataUrl));
  });
  handle("clipboard:read-image", () => {
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
  handle("clipboard:write-text", (_event, text: unknown) => {
    if (typeof text !== "string" || text.length > maxClipboardTextLength) {
      throw new Error("Invalid clipboard text.");
    }

    clipboard.writeText(text);
  });
  handle("clipboard:read-text", () => clipboard.readText());
  handle("window:set-fullscreen", (event, fullscreen: unknown) => {
    if (typeof fullscreen !== "boolean") {
      throw new Error("Invalid fullscreen state.");
    }

    BrowserWindow.fromWebContents(event.sender)?.setFullScreen(fullscreen);
  });
  handle("window:is-fullscreen", (event) => (
    BrowserWindow.fromWebContents(event.sender)?.isFullScreen() ?? false
  ));
}

function validateRealisticImageRequest(value: unknown): RealisticImageRequest {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid image generation request.");
  }

  const request = value as Partial<RealisticImageRequest>;
  validateImageDataUrl(request.canvasDataUrl);

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

function validateProjectSaveRequest(value: unknown, config: AppConfig): ProjectSaveRequest {
  const request = validateProjectWriteRequest(value, config);

  return {
    project: request.project,
    filePath: request.filePath,
    canvasDataUrl: request.canvasDataUrl,
    imageDataUrl: request.imageDataUrl
  };
}

function validateProjectAutosaveRequest(value: unknown, config: AppConfig): ProjectAutosaveRequest {
  const request = validateProjectWriteRequest(value, config);

  return {
    project: request.project,
    canvasDataUrl: request.canvasDataUrl,
    imageDataUrl: request.imageDataUrl
  };
}

function validateProjectWriteRequest(value: unknown, config: AppConfig): ProjectSaveRequest {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid project request.");
  }

  const request = value as Partial<ProjectSaveRequest>;

  return {
    project: parseDrawingProjectFile(request.project, config),
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

  return validateImageDataUrl(value);
}

function isImageDataUrl(value: string): boolean {
  return /^data:image\/(png|webp|jpeg);base64,[A-Za-z0-9+/=]+$/.test(value);
}
