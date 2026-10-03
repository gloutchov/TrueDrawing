import { Layers } from "lucide-react";
import type { DrawingLayer } from "../../shared/document/documentTypes";
import { validateLayerEffects } from "../../shared/document/layerEffects";
import type { EffectiveLocale } from "../app/uiPreferences";
import { t } from "../i18n/appI18n";
import { CollapsiblePanel } from "../ui/CollapsiblePanel";

export function LayerClippingPanel({locale,layer,layers,onClip}:{
  locale:EffectiveLocale;layer?:DrawingLayer;layers:DrawingLayer[];
  onClip:(id:string|null)=>void;
}) {
  if (!layer) return null;
  const canClip=(id:string)=>{try{validateLayerEffects(layers.map(item=>item.id===layer.id ? {...item,clipToLayerId:id} : item));return true;}catch{return false;}};
  return <CollapsiblePanel title={t(locale,"clipLayer")} locale={locale} icon={<Layers size={16}/>}>
    <div className="panel-content">
    <strong>{layer.name}</strong>
    <label className="field"><span>{t(locale,"clipLayer")}</span>
      <select aria-label={t(locale,"clipLayer")} value={layer.clipToLayerId ?? ""} onChange={event=>onClip(event.target.value || null)}>
        <option value="">{t(locale,"none")}</option>
        {layers.filter(item=>item.id!==layer.id).map(item=><option key={item.id} value={item.id} disabled={!canClip(item.id)}>{item.name}</option>)}
      </select></label>
    </div>
  </CollapsiblePanel>;
}
