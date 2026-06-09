import { describe, expect, it, vi } from "vitest";

import { generateOpenAiRealisticImage } from "../../src/main/image-generation/openAiImageAdapter";
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
    presets: [
      { id: "pencil", label: "Pencil", size: 4, opacity: 1, hardness: 0.95 }
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
    availableModels: ["gpt-image-1.5", "gpt-image-1", "gpt-image-1-mini"],
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

describe("OpenAI image adapter", () => {
  it("returns a realistic image result from an OpenAI image response", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      data: [{ b64_json: "aW1hZ2U=", revised_prompt: "revised" }]
    }), { status: 200 }));

    const result = await generateOpenAiRealisticImage({
      canvasDataUrl: "data:image/png;base64,aW1hZ2U=",
      model: "gpt-image-1.5",
      prompt: "make it realistic"
    }, "test-api-key", config, fetchMock);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.openai.com/v1/images/edits",
      expect.objectContaining({ method: "POST" })
    );
    expect(result.dataUrl).toBe("data:image/png;base64,aW1hZ2U=");
    expect(result.revisedPrompt).toBe("revised");
  });

  it("supports image responses that provide a URL instead of base64 data", async () => {
    const fetchMock = vi.fn(async (url: RequestInfo | URL) => {
      if (String(url).endsWith("/images/edits")) {
        return new Response(JSON.stringify({
          data: [{ url: "https://example.test/generated.png" }]
        }), { status: 200 });
      }

      return new Response(new Uint8Array([1, 2, 3]), { status: 200 });
    });

    const result = await generateOpenAiRealisticImage({
      canvasDataUrl: "data:image/png;base64,aW1hZ2U=",
      model: "gpt-image-1.5",
      prompt: "make it realistic"
    }, "test-api-key", config, fetchMock);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(2, "https://example.test/generated.png");
    expect(result.dataUrl).toBe("data:image/png;base64,AQID");
  });

  it("sanitizes API keys from error messages", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      error: { message: "Bad header Bearer very-secret-token" }
    }), { status: 401 }));

    await expect(generateOpenAiRealisticImage({
      canvasDataUrl: "data:image/png;base64,aW1hZ2U=",
      model: "gpt-image-1.5",
      prompt: "make it realistic"
    }, "test-api-key", config, fetchMock)).rejects.toThrow("[redacted]");
  });
});
