import { describe, expect, it } from "vitest";

import {
  addLayer,
  appendStrokeToActiveLayer,
  createInitialDrawingDocument,
  deleteLayer,
  moveLayer,
  renameLayer,
  setLayerOpacity,
  setLayerVisibility
} from "../../src/shared/document/layerModel";
import type { DrawingStroke } from "../../src/shared/drawing/strokeTypes";
import { commitHistory, createHistory, undoHistory } from "../../src/shared/history/historyModel";

const stroke: DrawingStroke = {
  id: "stroke-1",
  tool: "pencil",
  color: "#111111",
  size: 8,
  opacity: 1,
  hardness: 0.9,
  strokeStyle: "solid",
  points: [{ x: 1, y: 1, pressure: 0.5, timestamp: 1 }]
};

describe("layer model", () => {
  it("creates an initial document with one active layer", () => {
    const document = createInitialDrawingDocument({
      id: "layer-1",
      name: "Layer 1",
      opacity: 1
    });

    expect(document.activeLayerId).toBe("layer-1");
    expect(document.layers).toHaveLength(1);
  });

  it("appends strokes to the active layer", () => {
    const document = createInitialDrawingDocument({
      id: "layer-1",
      name: "Layer 1",
      opacity: 1
    });
    const updatedDocument = appendStrokeToActiveLayer(document, stroke);

    expect(updatedDocument.layers[0].strokes).toEqual([stroke]);
  });

  it("adds, renames, hides and changes opacity for layers", () => {
    const document = createInitialDrawingDocument({
      id: "layer-1",
      name: "Layer 1",
      opacity: 1
    });
    const withLayer = addLayer(document, { id: "layer-2", name: "Layer 2", opacity: 0.8 }, 4);
    const renamed = renameLayer(withLayer, "layer-2", "Ink");
    const hidden = setLayerVisibility(renamed, "layer-2", false);
    const transparent = setLayerOpacity(hidden, "layer-2", 0.35);

    expect(transparent.activeLayerId).toBe("layer-2");
    expect(transparent.layers[1]).toMatchObject({
      name: "Ink",
      visible: false,
      opacity: 0.35
    });
  });

  it("does not delete the final layer", () => {
    const document = createInitialDrawingDocument({
      id: "layer-1",
      name: "Layer 1",
      opacity: 1
    });

    expect(deleteLayer(document, "layer-1")).toBe(document);
  });

  it("moves layers in bottom-to-top order", () => {
    const document = createInitialDrawingDocument({
      id: "layer-1",
      name: "Layer 1",
      opacity: 1
    });
    const withLayer = addLayer(document, { id: "layer-2", name: "Layer 2", opacity: 1 }, 4);
    const movedDown = moveLayer(withLayer, "layer-2", "down");

    expect(movedDown.layers.map((layer) => layer.id)).toEqual(["layer-2", "layer-1"]);
  });

  it("supports undo for layer operations through the shared history model", () => {
    const document = createInitialDrawingDocument({
      id: "layer-1",
      name: "Layer 1",
      opacity: 1
    });
    const history = createHistory(document, 10);
    const committed = commitHistory(
      history,
      addLayer(document, { id: "layer-2", name: "Layer 2", opacity: 1 }, 4)
    );

    expect(committed.present.layers).toHaveLength(2);
    expect(undoHistory(committed).present.layers).toHaveLength(1);
  });
});
