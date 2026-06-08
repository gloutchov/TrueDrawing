import type { DrawingStroke } from "../drawing/strokeTypes";
import type { DrawingDocument, DrawingLayer, LayerCreateOptions } from "./documentTypes";
import type { StoredRealisticImage } from "../image-generation/imageGenerationTypes";

export function createDrawingLayer(options: LayerCreateOptions): DrawingLayer {
  return {
    id: options.id,
    name: options.name,
    visible: true,
    opacity: clampUnit(options.opacity),
    strokes: []
  };
}

export function createInitialDrawingDocument(options: LayerCreateOptions): DrawingDocument {
  const layer = createDrawingLayer(options);

  return {
    layers: [layer],
    activeLayerId: layer.id,
    realisticImage: null
  };
}

export function getActiveLayer(document: DrawingDocument): DrawingLayer | undefined {
  return document.layers.find((layer) => layer.id === document.activeLayerId);
}

export function appendStrokeToActiveLayer(
  document: DrawingDocument,
  stroke: DrawingStroke
): DrawingDocument {
  return updateLayer(document, document.activeLayerId, (layer) => ({
    ...layer,
    strokes: [...layer.strokes, stroke]
  }));
}

export function updateStrokeInDocument(
  document: DrawingDocument,
  strokeId: string,
  updater: (stroke: DrawingStroke) => DrawingStroke
): DrawingDocument {
  return {
    ...document,
    layers: document.layers.map((layer) => ({
      ...layer,
      strokes: layer.strokes.map((stroke) => (
        stroke.id === strokeId ? updater(stroke) : stroke
      ))
    }))
  };
}

export function addLayer(
  document: DrawingDocument,
  options: LayerCreateOptions,
  maxLayers: number
): DrawingDocument {
  if (document.layers.length >= maxLayers) {
    return document;
  }

  const layer = createDrawingLayer(options);

  return {
    layers: [...document.layers, layer],
    activeLayerId: layer.id,
    realisticImage: document.realisticImage
  };
}

export function renameLayer(
  document: DrawingDocument,
  layerId: string,
  name: string
): DrawingDocument {
  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return document;
  }

  return updateLayer(document, layerId, (layer) => ({
    ...layer,
    name: trimmedName
  }));
}

export function deleteLayer(document: DrawingDocument, layerId: string): DrawingDocument {
  if (document.layers.length <= 1) {
    return document;
  }

  const layerIndex = document.layers.findIndex((layer) => layer.id === layerId);

  if (layerIndex === -1) {
    return document;
  }

  const layers = document.layers.filter((layer) => layer.id !== layerId);
  const activeLayerId = document.activeLayerId === layerId
    ? layers[Math.max(0, layerIndex - 1)]?.id ?? layers[0].id
    : document.activeLayerId;

  return {
    layers,
    activeLayerId,
    realisticImage: document.realisticImage
  };
}

export function selectLayer(document: DrawingDocument, layerId: string): DrawingDocument {
  if (!document.layers.some((layer) => layer.id === layerId)) {
    return document;
  }

  return {
    ...document,
    activeLayerId: layerId
  };
}

export function setLayerVisibility(
  document: DrawingDocument,
  layerId: string,
  visible: boolean
): DrawingDocument {
  return updateLayer(document, layerId, (layer) => ({
    ...layer,
    visible
  }));
}

export function setLayerOpacity(
  document: DrawingDocument,
  layerId: string,
  opacity: number
): DrawingDocument {
  return updateLayer(document, layerId, (layer) => ({
    ...layer,
    opacity: clampUnit(opacity)
  }));
}

export function moveLayer(
  document: DrawingDocument,
  layerId: string,
  direction: "up" | "down"
): DrawingDocument {
  const layerIndex = document.layers.findIndex((layer) => layer.id === layerId);

  if (layerIndex === -1) {
    return document;
  }

  const targetIndex = direction === "up" ? layerIndex + 1 : layerIndex - 1;

  if (targetIndex < 0 || targetIndex >= document.layers.length) {
    return document;
  }

  const layers = [...document.layers];
  const [layer] = layers.splice(layerIndex, 1);

  layers.splice(targetIndex, 0, layer);

  return {
    ...document,
    layers
  };
}

export function setRealisticImage(
  document: DrawingDocument,
  realisticImage: StoredRealisticImage
): DrawingDocument {
  return {
    ...document,
    realisticImage
  };
}

function updateLayer(
  document: DrawingDocument,
  layerId: string,
  updater: (layer: DrawingLayer) => DrawingLayer
): DrawingDocument {
  return {
    ...document,
    layers: document.layers.map((layer) => (
      layer.id === layerId ? updater(layer) : layer
    ))
  };
}

function clampUnit(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.min(1, Math.max(0, value));
}
