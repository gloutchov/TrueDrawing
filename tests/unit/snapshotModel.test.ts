import { expect, it } from "vitest";
import { validateAppConfig } from "../../src/shared/config/appConfigSchema";
import { createInitialDrawingDocument } from "../../src/shared/document/layerModel";
import { createDocumentSnapshot, restoreDocumentSnapshot, renameDocumentSnapshot, deleteDocumentSnapshot } from "../../src/shared/document/snapshotModel";
import { createDrawingProjectFile, parseDrawingProjectJson, serializeDrawingProject } from "../../src/shared/project/projectModel";
import raw from "../../config/app.config.json";
const config=validateAppConfig(raw);
const document=createInitialDrawingDocument({id:"l",name:"Layer",opacity:1},{width:2048,height:2048,dpi:300});
const options={id:"version",name:"First",source:"manual" as const,createdAt:"2026-10-02T18:00:00Z"};
it("creates detached content without recursive versions",()=>{
  const first=createDocumentSnapshot(document,config,options);
  const second=createDocumentSnapshot(first,config,{...options,id:"second"});
  expect(second.snapshots?.[1].document).not.toHaveProperty("snapshots");
  expect(first.snapshots?.[0].document.layers).not.toBe(document.layers);
});
it("restores dimensions, layers, masks and generated image while preserving all versions",()=>{
  const source={...document,layers:[{...document.layers[0],mask:{enabled:true,strokes:[]}}],realisticImage:{dataUrl:"data:image/png;base64,AQID",provider:"openai",model:"test",generatedAt:options.createdAt}};
  const versioned=createDocumentSnapshot(source,config,options);
  const changed={...versioned,canvas:{width:128,height:128,dpi:72},realisticImage:null};
  const restored=restoreDocumentSnapshot(changed,"version");
  expect(restored.canvas).toEqual(source.canvas);
  expect(restored.realisticImage).toEqual(source.realisticImage);
  expect(restored.layers[0].mask).toEqual(source.layers[0].mask);
  expect(restored.snapshots).toBe(changed.snapshots);
});
it("persists versions, renames and deletions in tdraw",()=>{
  const first=createDocumentSnapshot(document,config,options);
  const renamed=renameDocumentSnapshot(first,"version","Checkpoint",config);
  const project=createDrawingProjectFile(renamed,{appVersion:"1.7.0",name:"Versions",fallbackName:"Drawing"});
  expect(parseDrawingProjectJson(serializeDrawingProject(project),config).document.snapshots?.[0].name).toBe("Checkpoint");
  expect(deleteDocumentSnapshot(renamed,"version").snapshots).toEqual([]);
});
it("does not create duplicate automatic versions of unchanged content",()=>{
  const first=createDocumentSnapshot(document,config,options);
  expect(createDocumentSnapshot(first,config,{...options,id:"auto",source:"automatic"})).toBe(first);
});
it("enforces count, per-version and total byte budgets without evicting previous content",()=>{
  const first=createDocumentSnapshot(document,config,options);
  const limited={...config,snapshots:{...config.snapshots,maxCount:1}};
  expect(()=>createDocumentSnapshot(first,limited,{...options,id:"second"})).toThrow(/budget/);
  expect(()=>createDocumentSnapshot(document,{...config,snapshots:{...config.snapshots,maxSnapshotBytes:10}},options)).toThrow(/budget/);
  expect(()=>createDocumentSnapshot(document,{...config,snapshots:{...config.snapshots,maxTotalBytes:10}},options)).toThrow(/budget/);
  expect(first.snapshots).toHaveLength(1);
});
it("rejects nested snapshots and corrupted capsule data when opening",()=>{
  const first=createDocumentSnapshot(document,config,options);
  const project=createDrawingProjectFile(first,{appVersion:"1.7.0",name:"Versions",fallbackName:"Drawing"});
  const json=JSON.parse(serializeDrawingProject(project));json.document.snapshots[0].document.snapshots=[];
  expect(()=>parseDrawingProjectJson(JSON.stringify(json),config)).toThrow(/nested/);
  delete json.document.snapshots[0].document.snapshots;json.document.snapshots[0].document.activeLayerId="missing";
  expect(()=>parseDrawingProjectJson(JSON.stringify(json),config)).toThrow(/active layer/);
});
