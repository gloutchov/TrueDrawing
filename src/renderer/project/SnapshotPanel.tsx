import { History } from "lucide-react";
import { useState } from "react";
import type { DocumentSnapshot } from "../../shared/document/snapshotModel";
import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { EffectiveLocale } from "../app/uiPreferences";
import { t } from "../i18n/appI18n";
import { CollapsiblePanel } from "../ui/CollapsiblePanel";

export function SnapshotPanel({config,locale,snapshots,automatic,onAutomatic,onCreate,onRename,onRestore,onDelete}:{
  config:AppConfig;locale:EffectiveLocale;snapshots:DocumentSnapshot[];automatic:boolean;
  onAutomatic:(value:boolean)=>void;onCreate:(name:string)=>void;onRename:(id:string,name:string)=>void;
  onRestore:(id:string)=>void;onDelete:(id:string)=>void;
}) {
  const [name,setName]=useState("");
  return <CollapsiblePanel title={t(locale,"documentVersions")} locale={locale} icon={<History size={16}/>}>
    <label className="field"><span>{t(locale,"versionName")}</span><input aria-label={t(locale,"versionName")} maxLength={config.snapshots.maxNameLength} value={name} onChange={event=>setName(event.target.value)}/></label>
    <button className="text-button snapshot-create-button" disabled={snapshots.length>=config.snapshots.maxCount} onClick={()=>onCreate(name || `${t(locale,"versionName")} ${snapshots.length+1}`)}>{t(locale,"createVersion")}</button>
    <label className="field"><span>{t(locale,"automaticVersions")}</span><input aria-label={t(locale,"automaticVersions")} type="checkbox" checked={automatic} onChange={event=>onAutomatic(event.target.checked)}/></label>
    <p className="form-message">{t(locale,"versionInstructions")} {snapshots.length}/{config.snapshots.maxCount}</p>
    {[...snapshots].reverse().map(snapshot=><div key={`${snapshot.id}:${snapshot.name}`}>
      <input aria-label={`${t(locale,"renameVersion")}: ${snapshot.name}`} maxLength={config.snapshots.maxNameLength} defaultValue={snapshot.name} onBlur={event=>onRename(snapshot.id,event.target.value)}/>
      <small>{new Date(snapshot.createdAt).toLocaleString(locale)} · {t(locale,snapshot.source)}</small>
      <button className="text-button" onClick={()=>{if(window.confirm(t(locale,"restoreVersionConfirm")))onRestore(snapshot.id);}}>{t(locale,"restoreVersion")}</button>
      <button className="text-button" onClick={()=>{if(window.confirm(t(locale,"deleteVersionConfirm")))onDelete(snapshot.id);}}>{t(locale,"deleteVersion")}</button>
    </div>)}
  </CollapsiblePanel>;
}
