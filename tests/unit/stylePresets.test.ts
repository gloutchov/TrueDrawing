import { describe, expect, it } from "vitest";
import repositoryConfig from "../../config/app.config.json";
import { validateAppConfig } from "../../src/shared/config/appConfigSchema";
import { validateStylePresets, validateCustomStyle } from "../../src/shared/image-generation/stylePresets";

describe("style presets", () => {
  it("preserves configured order, bilingual content and supported parameters", () => {
    const presets = validateStylePresets(repositoryConfig.imageGeneration.stylePresets);
    expect(presets.map(preset => preset.id)).toEqual(repositoryConfig.imageGeneration.availableStyles);
    expect(presets[0]).toMatchObject({ name: {it: "Acquerello", en: "Watercolor"}, parameters: { quality: "auto", size: "1024x1024" } });
  });

  it.each(["duplicate", "missingName", "emptyFragment", "quality", "size", "unknownParameter", "credential"])("rejects %s", issue => {
    const presets = structuredClone(repositoryConfig.imageGeneration.stylePresets);
    if (issue === "duplicate") presets[1].id = presets[0].id;
    if (issue === "missingName") presets[0].name.en = "";
    if (issue === "emptyFragment") presets[0].promptFragment = "";
    if (issue === "quality") Object.assign(presets[0].parameters, { quality: "ultra" });
    if (issue === "size") Object.assign(presets[0].parameters, { size: "4096x4096" });
    if (issue === "unknownParameter") Object.assign(presets[0].parameters, { apiKey: "invalid" });
    if (issue === "credential") presets[0].promptFragment = "Bearer " + "a".repeat(32);
    expect(() => validateStylePresets(presets)).toThrow(/Invalid/);
  });

  it("rejects inconsistent legacy style lists and invalid defaults", () => {
    const config = structuredClone(repositoryConfig);
    config.imageGeneration.availableStyles.reverse();
    expect(() => validateAppConfig(config)).toThrow(/ordered style presets/);
    config.imageGeneration.availableStyles.reverse();
    config.imageGeneration.defaultQuality = "ultra";
    expect(() => validateAppConfig(config)).toThrow(/quality/);
  });

  it("bounds custom text and rejects control characters and common credential patterns", () => {
    expect(validateCustomStyle("  soft pastel  ", 20)).toBe("soft pastel");
    expect(() => validateCustomStyle("soft pastel", 5)).toThrow(/Invalid/);
    expect(() => validateCustomStyle("pastel\nprivate")).toThrow(/Invalid/);
    expect(() => validateCustomStyle("sk-" + "a".repeat(32))).toThrow(/Invalid/);
  });
});
