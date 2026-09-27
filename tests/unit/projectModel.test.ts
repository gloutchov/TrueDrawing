import { describe, expect, it } from "vitest";

import type { AppConfig } from "../../src/shared/config/appConfigSchema";
import { createInitialDrawingDocument } from "../../src/shared/document/layerModel";
import {
  createDrawingProjectFile,
  createProjectSidecarFileNames,
  parseDrawingProjectJson,
  serializeDrawingProject
} from "../../src/shared/project/projectModel";

const config = {
  canvas: { defaultWidth: 2048, defaultHeight: 2048, dimensions: { minPixels: 64, maxPixels: 4096, maxAreaPixels: 12000000, defaultDpi: 300, minDpi: 72, maxDpi: 600 } },
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
} as AppConfig;

describe("project model", () => {
  it("serializes and parses a True Drawing project file", () => {
    const document = createInitialDrawingDocument({
      id: "layer-1",
      name: "Layer 1",
      opacity: 1
    }, { width: 2048, height: 2048, dpi: 300 });
    const project = createDrawingProjectFile(document, {
      appVersion: "0.7.0",
      name: "Sketch",
      fallbackName: "Untitled Drawing",
      savedAt: "2026-06-09T10:00:00.000Z"
    });

    expect(parseDrawingProjectJson(serializeDrawingProject(project), config)).toEqual(project);
  });

  it("opens legacy projects without dimensions at the configured default", () => {
    const document = createInitialDrawingDocument(
      { id: "layer-1", name: "Layer 1", opacity: 1 },
      { width: 800, height: 600, dpi: 240 }
    );
    const project = createDrawingProjectFile(document, {
      appVersion: "1.1.0",
      name: "Legacy",
      fallbackName: "Untitled Drawing"
    });
    const legacy = JSON.parse(serializeDrawingProject(project)) as Record<string, unknown>;
    delete (legacy.document as Record<string, unknown>).canvas;

    expect(parseDrawingProjectJson(JSON.stringify(legacy), config).document.canvas).toEqual({
      width: 2048, height: 2048, dpi: 300
    });
  });

  it("rejects invalid dimensions in a project", () => {
    const document = createInitialDrawingDocument(
      { id: "layer-1", name: "Layer 1", opacity: 1 },
      { width: 800, height: 600, dpi: 240 }
    );
    const project = createDrawingProjectFile(document, {
      appVersion: "1.2.0",
      name: "Invalid",
      fallbackName: "Untitled Drawing"
    });

    expect(() => parseDrawingProjectJson(JSON.stringify({
      ...project,
      document: { ...project.document, canvas: { width: 99999, height: 600, dpi: 240 } }
    }), config)).toThrow(/pixel limits/);
  });

  it("rejects malformed project files", () => {
    expect(() => parseDrawingProjectJson(JSON.stringify({
      format: "true-drawing-project",
      formatVersion: 1,
      appVersion: "0.7.0",
      name: "Sketch",
      savedAt: "2026-06-09T10:00:00.000Z",
      document: {
        layers: [],
        activeLayerId: "missing",
        realisticImage: null
      }
    }), config)).toThrow(/at least one layer/);
  });

  it("builds configured canvas and image sidecar names", () => {
    expect(createProjectSidecarFileNames("Bad:/ Name", config)).toEqual({
      canvasFileName: "Bad-- Name_canvas.png",
      imageFileName: "Bad-- Name_image.png"
    });
  });

  it("falls back for reserved or empty generated file names", () => {
    expect(createProjectSidecarFileNames("CON", config)).toEqual({
      canvasFileName: "Untitled Drawing_canvas.png",
      imageFileName: "Untitled Drawing_image.png"
    });
    expect(createProjectSidecarFileNames("... ", config)).toEqual({
      canvasFileName: "Untitled Drawing_canvas.png",
      imageFileName: "Untitled Drawing_image.png"
    });
  });
});
