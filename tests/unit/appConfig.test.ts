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
        pressureMaxSizeFactor: 1.25
      },
      layers: { defaultLayerName: "Layer 1", defaultOpacity: 1 },
      imageGeneration: { defaultProvider: "openai", defaultModel: "gpt-image-1.5", timeoutMs: 120000, defaultOutputFormat: "png" },
      files: { canvasSuffix: "_canvas", imageSuffix: "_image", projectExtension: ".tdraw", canvasExportExtension: ".png", imageExportExtension: ".png" }
    })).toThrow(/tools\.defaultOpacity/);
  });
});
