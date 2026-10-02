import { Layers } from "lucide-react";
import type { DrawingLayer } from "../../shared/document/documentTypes";
import { validateLayerEffects } from "../../shared/document/layerEffects";
import type { EffectiveLocale } from "../app/uiPreferences";
import { t } from "../i18n/appI18n";
import { CollapsiblePanel } from "../ui/CollapsiblePanel";

export function LayerEffectsPanel({locale,layer,layers,editing,onEditing,onMask,onClip}:{
  locale:EffectiveLocale;layer?:DrawingLayer;layers:DrawingLayer[];editing:boolean;
  onEditing:(value:boolean)=>void;onMask:(enabled:boolean|null)=>void;onClip:(id:string|null)=>void;
}) {
  if (!layer) return null;
  const canClip=(id:string)=>{try{validateLayerEffects(layers.map(item=>item.id===layer.id ? {...item,clipToLayerId:id} : item));return true;}catch{return false;}};
  return <CollapsiblePanel title={t(locale,"layerEffects")} locale={locale} icon={<Layers size={16}/>}>
    <strong>{layer.name}</strong>
    {!layer.mask ? <button className="text-button" onClick={()=>onMask(true)}>{t(locale,"createMask")}</button> : <>
      <label className="field"><span>{t(locale,"maskEnabled")}</span><input aria-label={t(locale,"maskEnabled")} type="checkbox" checked={layer.mask.enabled} onChange={event=>onMask(event.target.checked)}/></label>
      <label className="field"><span>{t(locale,"editMask")}</span><input aria-label={t(locale,"editMask")} type="checkbox" disabled={!layer.mask.enabled} checked={editing && layer.mask.enabled} onChange={event=>onEditing(event.target.checked)}/></label>
      <p className="form-message">{t(locale,"maskInstructions")}</p>
      <button className="text-button" onClick={()=>{if(window.confirm(t(locale,"removeMaskConfirm")))onMask(null);}}>{t(locale,"removeMask")}</button>
    </>}
    <label className="field"><span>{t(locale,"clipLayer")}</span>
      <select aria-label={t(locale,"clipLayer")} value={layer.clipToLayerId ?? ""} onChange={event=>onClip(event.target.value || null)}>
        <option value="">{t(locale,"none")}</option>
        {layers.filter(item=>item.id!==layer.id).map(item=><option key={item.id} value={item.id} disabled={!canClip(item.id)}>{item.name}</option>)}
      </select></label>
  </CollapsiblePanel>;
}
