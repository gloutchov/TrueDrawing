import { expect, it } from "vitest";
import { addLayer, appendStrokeToActiveLayer, createInitialDrawingDocument, deleteLayer, moveLayer, updateStrokeInDocument } from "../../src/shared/document/layerModel";
import { appendStrokeToActiveMask, setLayerClip, setLayerMask, validateLayerEffects } from "../../src/shared/document/layerEffects";
import { createDrawingProjectFile, parseDrawingProjectJson, serializeDrawingProject } from "../../src/shared/project/projectModel";
import { commitHistory, createHistory, undoHistory, redoHistory } from "../../src/shared/history/historyModel";
import { validateAppConfig } from "../../src/shared/config/appConfigSchema";
import type { DrawingStroke } from "../../src/shared/drawing/strokeTypes";
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
it("edits mask strokes without changing layer drawing",()=>{
  const masked=setLayerMask(appendStrokeToActiveLayer(document,{...stroke,tool:"pencil"}),"b",true);
  const painted=appendStrokeToActiveMask(masked,stroke);
  expect(painted.layers[1].strokes[0].tool).toBe("pencil");
  expect(painted.layers[1].mask?.strokes).toEqual([stroke]);
  const updated=updateStrokeInDocument(painted,"s",s=>({...s,opacity:.3}));
  expect(updated.layers[1].mask?.strokes[0].opacity).toBe(.3);
});
it("persists masks, strokes and clipping in tdraw",()=>{
  const masked=appendStrokeToActiveMask(setLayerMask(setLayerClip(document,"b","a"),"b",true),stroke);
  const project=createDrawingProjectFile(masked,{appVersion:"1.6.0",name:"Layers",fallbackName:"Drawing"});
  const reopened=parseDrawingProjectJson(serializeDrawingProject(project),config);
  expect(reopened.document.layers[1].mask).toEqual(masked.layers[1].mask);
  expect(reopened.document.layers[1].clipToLayerId).toBe("a");
});
it("supports undo and redo for mask creation, paint and clipping",()=>{
  const history=createHistory(document,10);
  const updated=setLayerClip(setLayerMask(document,"b",true),"b","a");
  const committed=commitHistory(history,updated);
  expect(undoHistory(committed).present).toBe(document);
  expect(redoHistory(undoHistory(committed)).present).toBe(updated);
});
it("rejects duplicate layer identities from project files",()=>{
  expect(()=>validateLayerEffects([base.layers[0],base.layers[0]])).toThrow();
});
