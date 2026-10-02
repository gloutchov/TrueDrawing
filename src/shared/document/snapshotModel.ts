import type { AppConfig } from "../config/appConfigSchema";
import type { DrawingDocument } from "./documentTypes";
export type DocumentContent = Pick<DrawingDocument,"canvas"|"layers"|"activeLayerId"|"realisticImage"|"references">;
export type DocumentSnapshot = {id:string;name:string;createdAt:string;source:"manual"|"automatic";document:DocumentContent};

export function snapshotContent(document:DrawingDocument):DocumentContent {
  const {canvas,layers,activeLayerId,realisticImage,references}=document;
  return structuredClone({canvas,layers,activeLayerId,realisticImage,references});
}

const byteSize=(value:unknown)=>new TextEncoder().encode(JSON.stringify(value)).byteLength;

export function validateSnapshotBudget(snapshots:DocumentSnapshot[],config:AppConfig):void {
  if (snapshots.length>config.snapshots.maxCount || new Set(snapshots.map(item=>item.id)).size!==snapshots.length
    || snapshots.some(item=>byteSize(item.document)>config.snapshots.maxSnapshotBytes)
    || byteSize(snapshots)>config.snapshots.maxTotalBytes) throw new Error("Invalid snapshot budget: version limits reached.");
}

export function createDocumentSnapshot(document:DrawingDocument,config:AppConfig,options:{id:string;name:string;createdAt:string;source:"manual"|"automatic"}):DrawingDocument {
  const name=options.name.trim();
  if(!name || name.length>config.snapshots.maxNameLength || !options.id || Number.isNaN(Date.parse(options.createdAt))) throw new Error("Invalid snapshot metadata.");
  const content=snapshotContent(document);
  const previous=document.snapshots ?? [];
  if(options.source==="automatic" && JSON.stringify(previous.at(-1)?.document)===JSON.stringify(content)) return document;
  const snapshots=[...previous,{...options,name,document:content}];
  validateSnapshotBudget(snapshots,config);
  const result={...document,snapshots};
  if(byteSize(result)>config.files.maxProjectBytes-8192) throw new Error("Invalid snapshot budget: project size limit reached.");
  return result;
}

export function restoreDocumentSnapshot(document:DrawingDocument,id:string):DrawingDocument {
  const snapshot=document.snapshots?.find(item=>item.id===id);
  if(!snapshot) throw new Error("Invalid snapshot identity.");
  return {...structuredClone(snapshot.document),snapshots:document.snapshots};
}

export function renameDocumentSnapshot(document:DrawingDocument,id:string,name:string,config:AppConfig):DrawingDocument {
  if(!name.trim() || name.trim().length>config.snapshots.maxNameLength) throw new Error("Invalid snapshot name.");
  return {...document,snapshots:document.snapshots?.map(item=>item.id===id ? {...item,name:name.trim()} : item)};
}

export function deleteDocumentSnapshot(document:DrawingDocument,id:string):DrawingDocument {
  return {...document,snapshots:document.snapshots?.filter(item=>item.id!==id)};
}
