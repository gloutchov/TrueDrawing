import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { validateAppConfig } from "../../src/shared/config/appConfigSchema";

describe("app configuration", () => {
  it("validates the repository configuration file", () => {
    const configPath = path.join(process.cwd(), "config", "app.config.json");
    const parsedConfig: unknown = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const config = validateAppConfig(parsedConfig);

    expect(config.app.name).toBe("True Drawing");
    expect(config.imageGeneration.defaultProvider).toBe("openai");
    expect(config.imageGeneration.defaultModel).toBe("gpt-image-1.5");
    expect(config.imageGeneration.availableModels).toContain("gpt-image-1.5");
    expect(config.tools.presets.map((preset) => preset.id)).toEqual([
      "pencil",
      "marker",
      "brush",
      "eraser"
    ]);
  });

  it("rejects invalid opacity values", () => {
    expect(() => validateAppConfig({
      app: { name: "True Drawing", defaultLocale: "it", autosaveIntervalMs: 30000, historyLimit: 100 },
      window: { width: 1280, height: 860, minWidth: 960, minHeight: 640 },
      layout: { topBarHeight: 46, toolRailWidth: 58, sidePanelWidth: 320, workspacePadding: 28 },
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
        defaultOpacity: 2,
        defaultBrushHardness: 0.85,
        pressureMinSizeFactor: 0.65,
        pressureMaxSizeFactor: 1.25,
        sizeRange: { min: 1, max: 96, step: 1 },
        opacityRange: { min: 0.05, max: 1, step: 0.05 },
        hardnessRange: { min: 0.1, max: 1, step: 0.05 },
        presets: [
          { id: "pencil", label: "Pencil", size: 4, opacity: 1, hardness: 0.95 },
          { id: "marker", label: "Marker", size: 16, opacity: 0.45, hardness: 0.75 },
          { id: "brush", label: "Brush", size: 22, opacity: 0.9, hardness: 0.35 },
          { id: "eraser", label: "Eraser", size: 28, opacity: 1, hardness: 0.8 }
        ]
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
        availableModels: ["gpt-image-1.5"],
        defaultSize: "1024x1024",
        defaultQuality: "auto",
        canvasPaddingRatio: 0.08,
        timeoutMs: 120000,
        defaultOutputFormat: "png"
      },
      files: { canvasSuffix: "_canvas", imageSuffix: "_image", projectExtension: ".tdraw", canvasExportExtension: ".png", imageExportExtension: ".png" }
    })).toThrow(/tools\.defaultOpacity/);
  });
});
