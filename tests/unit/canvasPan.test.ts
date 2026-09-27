import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { panFromPointerDrag } from "../../src/renderer/canvas/canvasPan";
import { ToolPanel } from "../../src/renderer/tools/ToolPanel";
import { createInitialToolSettings, settingsForSelectedTool } from "../../src/renderer/tools/toolState";
import { validateAppConfig } from "../../src/shared/config/appConfigSchema";

const config = validateAppConfig(JSON.parse(fs.readFileSync(
  path.join(process.cwd(), "config", "app.config.json"),
  "utf8"
)) as unknown);

describe("canvas hand tool", () => {
  it("places the hand before the selection tool and keeps drawing settings intact", () => {
    const initialSettings = createInitialToolSettings(config);
    const handSettings = settingsForSelectedTool(config, initialSettings, "hand");
    const markup = renderToStaticMarkup(createElement(ToolPanel, {
      config,
      locale: "en",
      settings: handSettings,
      canUndo: false,
      canRedo: false,
      onSelectTool: () => undefined,
      onChangeSettings: () => undefined,
      onUndo: () => undefined,
      onRedo: () => undefined
    }));

    expect(markup.indexOf('aria-label="Hand"')).toBeGreaterThan(-1);
    expect(markup.indexOf('aria-label="Hand"')).toBeLessThan(markup.indexOf('aria-label="Selection"'));
    expect(markup).toContain('aria-label="Hand" aria-pressed="true"');
    expect(handSettings).toEqual({ ...initialSettings, tool: "hand" });
  });

  it("uses screen pointer movement in both directions for pan", () => {
    expect(panFromPointerDrag(
      { x: 40, y: -20 },
      { x: 300, y: 200 },
      { x: 260, y: 270 }
    )).toEqual({ x: 0, y: 50 });
  });
});
