import type { DrawingDocument, DrawingLayer } from "./documentTypes";

export function validateLayerEffects(layers: DrawingLayer[]): void {
  const byId = new Map(layers.map(layer=>[layer.id,layer]));
  if (byId.size!==layers.length) throw new Error("Invalid duplicate layer identity.");
  for (const layer of layers) {
    const visited=new Set([layer.id]);let target=layer.clipToLayerId;
    while(target) {
      if (visited.has(target) || !byId.has(target)) throw new Error("Invalid clipping relationship.");
      visited.add(target);target=byId.get(target)?.clipToLayerId;
    }
  }
}

export function setLayerClip(document: DrawingDocument, layerId:string, targetId:string|null):DrawingDocument {
  const next={...document,layers:document.layers.map(layer=>layer.id===layerId ? {...layer,clipToLayerId:targetId} : layer)};
  validateLayerEffects(next.layers);return next;
}
