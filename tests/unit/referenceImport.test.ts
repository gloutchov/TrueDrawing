import { expect, it, vi } from "vitest";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
vi.mock("electron",()=>({dialog:{},nativeImage:{createFromBuffer:vi.fn()}}));
import { isSupportedImage, readReferenceImage } from "../../src/main/project/referenceImport";
import { validateReference } from "../../src/shared/document/referenceModel";
import { validateAppConfig } from "../../src/shared/config/appConfigSchema";
import { createInitialDrawingDocument } from "../../src/shared/document/layerModel";
import { createDrawingProjectFile, parseDrawingProjectJson, serializeDrawingProject } from "../../src/shared/project/projectModel";
import raw from "../../config/app.config.json";
const config=validateAppConfig(raw);
const bytes=Buffer.from([137,80,78,71,13,10,26,10,0]);
const reference={id:"r",name:"image.png",dataUrl:"data:image/png;base64,AQID",visible:true,opacity:.5,x:0,y:0,width:100,height:100};
it("accepts PNG/JPEG/WebP signatures and rejects SVG or arbitrary data",()=>{
  expect(isSupportedImage(bytes)).toBe(true);
  expect(isSupportedImage(Buffer.from([255,216,255]))).toBe(true);
  expect(isSupportedImage(Buffer.from("RIFF0000WEBP"))).toBe(true);
  expect(isSupportedImage(Buffer.from("<svg/>"))).toBe(false);
});
it("reads only a chosen local file, normalizes it and returns no source path",async()=>{
  const directory=await mkdtemp(path.join(tmpdir(),"tdraw-reference-"));
  try {
    const file=path.join(directory,"image.png");await writeFile(file,bytes);
    const decoder=vi.fn(()=>({getSize:()=>({width:100,height:50}),isEmpty:()=>false,toPNG:()=>Buffer.from([1,2,3])}));
    const result=await readReferenceImage(file,config,decoder as never);
    expect(result).toEqual({name:"image.png",width:100,height:50,dataUrl:"data:image/png;base64,AQID"});
    await expect(readReferenceImage(file,{...config,references:{...config.references,maxImageBytes:2}},decoder as never)).rejects.toThrow();
    expect(decoder).toHaveBeenCalledTimes(1);
  }finally{await rm(directory,{recursive:true,force:true});}
});
it("round-trips local reference controls and embedded data",()=>{
  const document={...createInitialDrawingDocument({id:"l",name:"layer",opacity:1},{width:2048,height:2048,dpi:300}),references:[reference]};
  const project=createDrawingProjectFile(document,{appVersion:"1.5.0",name:"Reference",fallbackName:"Drawing"});
  expect(parseDrawingProjectJson(serializeDrawingProject(project),config).document.references).toEqual([reference]);
});
it("rejects invalid positions, oversized scale and repeated reference identities",()=>{
  expect(()=>validateReference({...reference,x:Infinity},config)).toThrow();
  expect(()=>validateReference({...reference,width:100000},config)).toThrow();
  const document={...createInitialDrawingDocument({id:"l",name:"layer",opacity:1},{width:2048,height:2048,dpi:300}),references:[reference,reference]};
  const project=createDrawingProjectFile(document,{appVersion:"1.5.0",name:"Reference",fallbackName:"Drawing"});
  expect(()=>parseDrawingProjectJson(serializeDrawingProject(project),config)).toThrow();
});
