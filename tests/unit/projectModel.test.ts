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
    });
    const project = createDrawingProjectFile(document, {
      appVersion: "0.7.0",
      name: "Sketch",
      fallbackName: "Untitled Drawing",
      savedAt: "2026-06-09T10:00:00.000Z"
    });

    expect(parseDrawingProjectJson(serializeDrawingProject(project))).toEqual(project);
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
    }))).toThrow(/at least one layer/);
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
