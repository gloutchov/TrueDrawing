import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { createImageGenerationPreferencesStore } from "../../src/main/preferences/imageGenerationPreferencesStore";
import type { AppConfig } from "../../src/shared/config/appConfigSchema";

const config: AppConfig = {
  app: { name: "True Drawing", defaultLocale: "it", autosaveIntervalMs: 30000, historyLimit: 100 },
  window: { width: 1280, height: 860, minWidth: 960, minHeight: 640 },
  layout: { topBarHeight: 46, toolRailWidth: 76, sidePanelWidth: 320, workspacePadding: 28 },
  canvas: {
    defaultWidth: 2048,
    defaultHeight: 2048,
    backgroundColor: "#ffffff",
    maxZoom: 8,
    minZoom: 0.1,
    maxPixelRatio: 2,
    minPointDistance: 1.25,
    strokeSmoothing: 0.55,
    defaultPointerPressure: 0.5
  },
  tools: {
    defaultTool: "pencil",
    defaultColor: "#111111",
    defaultSize: 8,
    defaultOpacity: 1,
    defaultBrushHardness: 0.85,
    defaultStrokeStyle: "solid",
    pressureMinSizeFactor: 0.65,
    pressureMaxSizeFactor: 1.25,
    sizeRange: { min: 1, max: 96, step: 1 },
    opacityRange: { min: 0.05, max: 1, step: 0.05 },
    hardnessRange: { min: 0.1, max: 1, step: 0.05 },
    presets: [{ id: "pencil", label: "Pencil", size: 4, opacity: 1, hardness: 0.95 }]
  },
  layers: {
    defaultLayerName: "Layer 1",
    newLayerNamePrefix: "Layer",
    defaultOpacity: 1,
    maxLayers: 32,
    opacityRange: { min: 0.05, max: 1, step: 0.05 }
  },
  imageGeneration: {
    defaultProvider: "openai",
    baseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-image-1.5",
    availableModels: ["gpt-image-1.5", "gpt-image-1-mini"],
    defaultSize: "1024x1024",
    defaultQuality: "auto",
    canvasPaddingRatio: 0.08,
    timeoutMs: 120000,
    defaultOutputFormat: "png"
  },
  files: {
    defaultProjectName: "Untitled Drawing",
    autosaveDirectoryName: "autosave",
    autosaveExtension: ".autosave.tdraw",
    canvasSuffix: "_canvas",
    imageSuffix: "_image",
    projectExtension: ".tdraw",
    canvasExportExtension: ".png",
    imageExportExtension: ".png",
    webpExportExtension: ".webp"
  }
};

describe("image generation preferences store", () => {
  it("returns the default configured image model when no preference exists", () => {
    const userDataPath = fs.mkdtempSync(path.join(os.tmpdir(), "truedrawing-"));
    const store = createImageGenerationPreferencesStore(userDataPath, () => config);

    expect(store.getPreferences()).toEqual({ model: "gpt-image-1.5" });
  });

  it("persists a custom future image model name", () => {
    const userDataPath = fs.mkdtempSync(path.join(os.tmpdir(), "truedrawing-"));
    const store = createImageGenerationPreferencesStore(userDataPath, () => config);

    expect(store.setModel("gpt-image-2-future")).toEqual({ model: "gpt-image-2-future" });
    expect(store.getPreferences()).toEqual({ model: "gpt-image-2-future" });
  });

  it("rejects invalid image model names", () => {
    const userDataPath = fs.mkdtempSync(path.join(os.tmpdir(), "truedrawing-"));
    const store = createImageGenerationPreferencesStore(userDataPath, () => config);

    expect(() => store.setModel("bad model name")).toThrow(/not valid/);
  });
});
