import type { DrawingDocument, DrawingLayer } from "./documentTypes";
import type { DrawingStroke } from "../drawing/strokeTypes";

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

export function setLayerMask(document:DrawingDocument,layerId:string,enabled:boolean|null):DrawingDocument {
  return {...document,layers:document.layers.map(layer=>layer.id===layerId ? {...layer,mask:enabled===null ? undefined : {enabled,strokes:layer.mask?.strokes ?? []}} : layer)};
}

export function appendStrokeToActiveMask(document:DrawingDocument,stroke:DrawingStroke):DrawingDocument {
  return {...document,layers:document.layers.map(layer=>layer.id===document.activeLayerId && layer.mask?.enabled
    ? {...layer,mask:{...layer.mask,strokes:[...layer.mask.strokes,stroke]}} : layer)};
}
