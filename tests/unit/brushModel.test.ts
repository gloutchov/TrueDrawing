import { expect, it, vi } from "vitest";
import raw from "../../config/app.config.json";
import { validateAppConfig } from "../../src/shared/config/appConfigSchema";
import { brushDynamics, textureAlpha, validateBrush } from "../../src/shared/drawing/brushModel";
import { renderBrushStroke } from "../../src/renderer/canvas/brushRenderer";
import { createStroke } from "../../src/shared/drawing/strokeModel";
import { createDrawingProjectFile, parseDrawingProjectJson, serializeDrawingProject } from "../../src/shared/project/projectModel";
import { appendStrokeToActiveLayer, createInitialDrawingDocument } from "../../src/shared/document/layerModel";
const config = validateAppConfig(raw);
const brush = config.tools.brushPresets[0];
const point = {x:100,y:100,pressure:.5,timestamp:50};
const stroke = createStroke({id:"s",tool:"pencil",color:"#123456",size:10,opacity:.7,hardness:1,strokeStyle:"solid",point,brush});
it("validates all configured presets and rejects invalid texture/dynamics", () => {
  expect(config.tools.brushPresets).toHaveLength(5);
  expect(() => validateBrush({...brush, texture:"remote-image"})).toThrow();
  expect(() => validateBrush({...brush, velocitySize:NaN})).toThrow();
  expect(() => validateAppConfig({...raw, tools:{...raw.tools, brushPresets:[brush,brush]}})).toThrow();
});
it("uses pressure and speed for bounded size and opacity", () => {
  const low = brushDynamics(brush, {...point,pressure:.1});
  const high = brushDynamics(brush, {...point,pressure:1});
  expect(high.sizeFactor).toBeGreaterThan(low.sizeFactor);
  expect(high.opacityFactor).toBeGreaterThan(low.opacityFactor);
  expect(brushDynamics(brush, point, {...point,x:0,timestamp:49}).sizeFactor).toBeLessThan(high.sizeFactor);
});
it("procedural textures are deterministic and can be customized", () => {
  expect(textureAlpha(brush,30,20)).toBe(textureAlpha(brush,30,20));
  expect(textureAlpha({...brush,textureAmount:0},30,20)).toBe(1);
  expect(textureAlpha({...brush,texture:"dots"},30,20)).not.toBe(textureAlpha(brush,30,20));
});
it("keeps per-stroke brush parameters and round-trips them through tdraw", () => {
  const document = appendStrokeToActiveLayer(createInitialDrawingDocument({id:"l",name:"Layer",opacity:1},{width:2048,height:2048,dpi:300}),stroke);
  const project = createDrawingProjectFile(document,{appVersion:"1.4.0",name:"Brush",fallbackName:"Drawing"});
  expect(parseDrawingProjectJson(serializeDrawingProject(project),config).document.layers[0].strokes[0].brush).toEqual(validateBrush(brush));
  expect(stroke.brush).not.toBe(brush);
});
it("renders pressure-sensitive stamps rather than a constant-width path", () => {
  const arc=vi.fn(); const context={beginPath:vi.fn(),arc,fill:vi.fn(),globalAlpha:1} as unknown as CanvasRenderingContext2D;
  renderBrushStroke(context,{...stroke,points:[point,{...point,x:120,pressure:1,timestamp:70}]});
  expect(arc.mock.calls.length).toBeGreaterThan(2);
  expect(new Set(arc.mock.calls.map(call=>call[2])).size).toBeGreaterThan(1);
});
