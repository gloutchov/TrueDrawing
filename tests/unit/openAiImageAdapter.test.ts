import { describe, expect, it, vi } from "vitest";

import { generateOpenAiRealisticImage } from "../../src/main/image-generation/openAiImageAdapter";
import type { AppConfig } from "../../src/shared/config/appConfigSchema";
import { validateAppConfig } from "../../src/shared/config/appConfigSchema";
import repositoryConfig from "../../config/app.config.json";

const config: AppConfig = {
  app: { name: "True Drawing", defaultLocale: "it", autosaveIntervalMs: 30000, historyLimit: 100 },
  window: { width: 1280, height: 860, minWidth: 960, minHeight: 640 },
  layout: { topBarHeight: 46, statusBarHeight: 28, toolRailWidth: 76, sidePanelWidth: 320, workspacePadding: 28 },
  ui: { preferencesStorageKey: "true-drawing-ui-preferences", statusMessageDurationMs: 6000 },
  canvas: {
    defaultWidth: 2048,
    defaultHeight: 2048,
    dimensions: { minPixels: 64, maxPixels: 4096, maxAreaPixels: 12000000, defaultDpi: 300, minDpi: 72, maxDpi: 600 },
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
    defaultStyle: "realistica",
    availableStyles: ["acquerello", "cartoon", "infantile", "olio", "realistica", "surreale"],
    autoRedrawDefaultEnabled: false,
    autoRedrawDefaultDelaySeconds: 5,
    autoRedrawDelayRange: { min: 1, max: 120, step: 1 },
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
    expect(result.revisedPrompt).toBeUndefined();
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
    }, "test-api-key", config, fetchMock, async () => "AQID");

    expect(fetchMock).toHaveBeenCalledTimes(1);
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
    }, "test-api-key", config, fetchMock)).rejects.toThrow("OpenAI image generation failed with status 401.");
  });

  it("uses only quality and size from the selected validated preset", async () => {
    const trustedConfig = validateAppConfig(repositoryConfig);
    trustedConfig.imageGeneration.stylePresets[0].parameters = { quality: "medium", size: "1536x1024" };
    let sent: FormData | undefined;
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, options?: RequestInit) => {
      sent = options?.body as FormData;
      return new Response(JSON.stringify({ data: [{ b64_json: "aW1hZ2U=" }] }), { status: 200 });
    });
    await generateOpenAiRealisticImage({
      canvasDataUrl: "data:image/png;base64,aW1hZ2U=", model: "gpt-image-1.5", prompt: "watercolor", stylePresetId: "acquerello",
      ...{ quality: "invalid", size: "9999x9999", favoriteStyleId: "private" }
    }, "test-api-key", trustedConfig, fetchMock);
    expect(sent?.get("quality")).toBe("medium");
    expect(sent?.get("size")).toBe("1536x1024");
    expect(sent?.get("favoriteStyleId")).toBeNull();
  });

  it("rejects unknown preset ids and credential-like prompts before any network request", async () => {
    const trustedConfig = validateAppConfig(repositoryConfig);
    const fetchMock = vi.fn();
    const request = { canvasDataUrl: "data:image/png;base64,aW1hZ2U=", model: "gpt-image-1.5", prompt: "make realistic" };
    await expect(generateOpenAiRealisticImage({ ...request, stylePresetId: "missing" }, "test-api-key", trustedConfig, fetchMock)).rejects.toThrow(/Invalid image style preset/);
    await expect(generateOpenAiRealisticImage({ ...request, prompt: "Bearer " + "x".repeat(32) }, "test-api-key", trustedConfig, fetchMock)).rejects.toThrow(/Invalid image generation request/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("discards network exception details and provider-revised prompts", async () => {
    const sensitive = "sk-" + "x".repeat(32);
    const request = { canvasDataUrl: "data:image/png;base64,aW1hZ2U=", model: "gpt-image-1.5", prompt: "make realistic" };
    const fail = vi.fn(async () => { throw new Error(sensitive + " /Users/private/project.tdraw"); });
    const failure = await generateOpenAiRealisticImage(request, "test-api-key", config, fail).catch((error: unknown) => error);
    expect(failure).toMatchObject({message: "Image generation failed."});
    expect(failure).not.toHaveProperty("cause");
    expect(failure instanceof Error ? failure.stack : "").not.toContain(sensitive);
    const success = vi.fn(async () => new Response(JSON.stringify({ data: [{ b64_json: "aW1hZ2U=", revised_prompt: sensitive }] }), { status: 200 }));
    expect(JSON.stringify(await generateOpenAiRealisticImage(request, "test-api-key", config, success))).not.toContain(sensitive);
  });
});
