import { describe, expect, it } from "vitest";

import { buildRealisticImagePrompt } from "../../src/shared/image-generation/realisticPrompt";
import type { DrawingDocument } from "../../src/shared/document/documentTypes";

describe("realistic image prompt", () => {
  it("summarizes visible layers and strokes without adding UI instructions", () => {
    const document: DrawingDocument = {
      activeLayerId: "layer-1",
      realisticImage: null,
      layers: [
        {
          id: "layer-1",
          name: "Sketch",
          visible: true,
          opacity: 1,
          strokes: [
            {
              id: "stroke-1",
              tool: "pencil",
              color: "#111111",
              size: 4,
              opacity: 1,
              hardness: 1,
              strokeStyle: "solid",
              points: [{ x: 1, y: 2, pressure: 0.5, timestamp: 1 }]
            }
          ]
        },
        {
          id: "layer-2",
          name: "Hidden",
          visible: false,
          opacity: 1,
          strokes: []
        }
      ]
    };

    expect(buildRealisticImagePrompt(document)).toContain("Visible layers: 1. Total strokes: 1.");
    expect(buildRealisticImagePrompt(document)).toContain("Do not add text");
    expect(buildRealisticImagePrompt(document, { imageStyle: "cartoon" })).toContain(
      "Use this visual style: cartoon."
    );
  });
});
