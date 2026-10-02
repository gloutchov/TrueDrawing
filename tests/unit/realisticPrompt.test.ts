import { describe, expect, it } from "vitest";
import repositoryConfig from "../../config/app.config.json";
import { validateStylePresets } from "../../src/shared/image-generation/stylePresets";
import { buildRealisticImagePrompt } from "../../src/shared/image-generation/realisticPrompt";

const presets = validateStylePresets(repositoryConfig.imageGeneration.stylePresets);

describe("realistic image prompt", () => {
  it("uses each configured fragment while preserving composition and avoiding document metadata", () => {
    for (const preset of presets) {
      const prompt = buildRealisticImagePrompt({ imageStyle: preset.id, presets });
      expect(prompt).toContain(preset.promptFragment);
      expect(prompt).toContain("Preserve the composition");
      expect(prompt).toContain("Do not add text");
      expect(prompt).not.toMatch(/Visible layers|Total strokes|references|snapshots|layer name|file path/i);
    }
  });

  it("supports bounded custom styles and a realistic default", () => {
    expect(buildRealisticImagePrompt({imageStyle: "soft pastel", presets})).toContain("Use this visual style: soft pastel.");
    expect(buildRealisticImagePrompt()).toContain("natural lighting");
    expect(() => buildRealisticImagePrompt({imageStyle: "too long", maxCustomStyleLength: 5})).toThrow(/Invalid image style/);
  });

  it("rejects credential-like text before constructing a prompt", () => {
    const secret = "sk-" + "x".repeat(32);
    expect(() => buildRealisticImagePrompt({ imageStyle: secret, presets })).toThrow("Invalid image style.");
  });
});
