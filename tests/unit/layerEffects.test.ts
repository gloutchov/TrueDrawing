import { expect, it } from "vitest";
import { addLayer, appendStrokeToActiveLayer, createInitialDrawingDocument, deleteLayer, moveLayer, updateStrokeInDocument } from "../../src/shared/document/layerModel";
import { setLayerClip, validateLayerEffects } from "../../src/shared/document/layerEffects";
import { createDrawingProjectFile, parseDrawingProjectJson, serializeDrawingProject } from "../../src/shared/project/projectModel";
import { commitHistory, createHistory, undoHistory, redoHistory } from "../../src/shared/history/historyModel";
import { validateAppConfig } from "../../src/shared/config/appConfigSchema";
import type { DrawingStroke } from "../../src/shared/drawing/strokeTypes";
import { createDocumentSnapshot, restoreDocumentSnapshot } from "../../src/shared/document/snapshotModel";
import raw from "../../config/app.config.json";
const config=validateAppConfig(raw);
const base=createInitialDrawingDocument({id:"a",name:"Base",opacity:1},{width:2048,height:2048,dpi:300});
const document=addLayer(base,{id:"b",name:"Top",opacity:1},32);
const stroke:DrawingStroke={id:"s",tool:"eraser",color:"#000000",size:20,opacity:1,hardness:1,strokeStyle:"solid",points:[{x:10,y:10,pressure:1,timestamp:1}]};
it("rejects missing clipping targets and cycles",()=>{
  const clipped=setLayerClip(document,"b","a");
  expect(()=>setLayerClip(clipped,"a","b")).toThrow();
  expect(()=>setLayerClip(document,"a","a")).toThrow();
  expect(()=>setLayerClip(document,"b","missing")).toThrow();
});
it("retains stable target identities when reordering and clears deleted targets",()=>{
  const clipped=setLayerClip(document,"b","a");
  const reordered=moveLayer(clipped,"b","down");
  expect(reordered.layers[0].clipToLayerId).toBe("a");
  expect(deleteLayer(clipped,"a").layers[0].clipToLayerId).toBeNull();
});
const legacyDocument={...document,layers:document.layers.map(layer=>layer.id==="b" ? {...layer,strokes:[{...stroke,tool:"pencil" as const}],mask:{enabled:true,strokes:[stroke]}} : layer)};
it("keeps legacy masks unchanged when drawing or moving a stroke with the same identity",()=>{
  const painted=appendStrokeToActiveLayer(legacyDocument,{...stroke,id:"new"});
  const updated=updateStrokeInDocument(painted,"s",s=>({...s,opacity:.3}));
  expect(updated.layers[1].strokes[0].opacity).toBe(.3);
  expect(updated.layers[1].strokes).toHaveLength(2);
  expect(updated.layers[1].mask).toBe(legacyDocument.layers[1].mask);
  expect(updated.layers[1].mask?.strokes).toEqual([stroke]);
});
it.each([true,false])("preserves legacy mask state (%s), strokes and clipping across save/reopen",enabled=>{
  const masked=setLayerClip({...legacyDocument,layers:legacyDocument.layers.map(layer=>layer.mask ? {...layer,mask:{...layer.mask,enabled}} : layer)},"b","a");
  const project=createDrawingProjectFile(masked,{appVersion:"1.6.0",name:"Layers",fallbackName:"Drawing"});
  const reopened=parseDrawingProjectJson(serializeDrawingProject(project),config);
  expect(reopened.document.layers[1].mask).toEqual(masked.layers[1].mask);
  expect(reopened.document.layers[1].clipToLayerId).toBe("a");
});
it("retains legacy mask strokes through snapshot persistence and restoration",()=>{
  const versioned=createDocumentSnapshot(legacyDocument,config,{id:"legacy",name:"Legacy",createdAt:"2026-10-03T11:00:00Z",source:"manual"});
  const changed=appendStrokeToActiveLayer(versioned,{...stroke,id:"new"});
  const project=createDrawingProjectFile(changed,{appVersion:"1.11.3",name:"Legacy",fallbackName:"Drawing"});
  const reopened=parseDrawingProjectJson(serializeDrawingProject(project),config);
  const restored=restoreDocumentSnapshot(reopened.document,"legacy");
  expect(restored.layers[1].mask).toEqual(legacyDocument.layers[1].mask);
  expect(restored.layers[1].strokes).toEqual(legacyDocument.layers[1].strokes);
});
it("supports undo and redo for clipping without changing legacy masks",()=>{
  const history=createHistory(legacyDocument,10);
  const updated=setLayerClip(legacyDocument,"b","a");
  const committed=commitHistory(history,updated);
  expect(undoHistory(committed).present).toBe(legacyDocument);
  expect(redoHistory(undoHistory(committed)).present).toBe(updated);
  expect(updated.layers[1].mask).toBe(legacyDocument.layers[1].mask);
});
it("rejects duplicate layer identities from project files",()=>{
  expect(()=>validateLayerEffects([base.layers[0],base.layers[0]])).toThrow();
});
