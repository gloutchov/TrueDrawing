import appConfig from "../../config/app.config.json";
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
    expect(config.imageGeneration.availableStyles).toEqual([
      "acquerello",
      "cartoon",
      "infantile",
      "olio",
      "realistica",
      "surreale"
    ]);
    expect(config.ui.preferencesStorageKey).toBe("true-drawing-ui-preferences");
    expect(config.ui.defaultLocaleMode).toBe("system");
    expect(config.ui.availableLocaleModes).toEqual(["system", "it", "en"]);
    expect(config.ui.defaultThemeMode).toBe("system");
    expect(config.ui.availableThemeModes).toEqual(["system", "light", "dark"]);
    expect(config.tools.presets.map((preset) => preset.id)).toEqual([
      "pencil",
      "marker",
      "brush",
      "eraser"
    ]);
    expect(config.canvas.dimensions.defaultDpi).toBe(300);
  });

  it("rejects inconsistent canvas defaults and limits", () => {
    const configPath = path.join(process.cwd(), "config", "app.config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8")) as Record<string, unknown>;
    const canvas = config.canvas as Record<string, unknown>;
    canvas.defaultWidth = 5000;

    expect(() => validateAppConfig(config)).toThrow(/canvas dimensions and DPI limits/);
  });

  it("rejects invalid opacity values", () => {
    expect(() => validateAppConfig({
      ...appConfig, tools: {...appConfig.tools, defaultOpacity: 2}
    })).toThrow(/tools\.defaultOpacity/);
  });
});
