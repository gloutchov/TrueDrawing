import { ImagePlus } from "lucide-react";
import type { ReferenceImage } from "../../shared/document/referenceModel";
import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { EffectiveLocale } from "../app/uiPreferences";
import { t } from "../i18n/appI18n";
import { CollapsiblePanel } from "../ui/CollapsiblePanel";

export function ReferencePanel({config,locale,images,onImport,onUpdate,onRemove}:{
  config:AppConfig;locale:EffectiveLocale;images:ReferenceImage[];onImport:()=>void;
  onUpdate:(id:string,patch:Partial<ReferenceImage>)=>void;onRemove:(id:string)=>void;
}) {
  return <CollapsiblePanel title={t(locale,"references")} locale={locale} icon={<ImagePlus size={16}/>}>
    <div className="panel-content reference-panel-body">
    <button className="text-button panel-action" disabled={images.length >= config.references.maxImages} onClick={onImport}>{t(locale,"importReference")}</button>
    <p className="form-message">{t(locale,"referenceLocalOnly")}</p>
    {images.map(image=><div key={image.id}>
      <strong>{image.name}</strong>
      <label className="field"><span>{t(locale,"referenceVisible")}</span><input aria-label={t(locale,"referenceVisible")} type="checkbox" checked={image.visible} onChange={event=>onUpdate(image.id,{visible:event.target.checked})}/></label>
      <label className="field"><span>{t(locale,"opacity")}</span><input aria-label={t(locale,"referenceOpacity")} type="range" min="0" max="1" step="0.05" value={image.opacity} onChange={event=>onUpdate(image.id,{opacity:event.target.valueAsNumber})}/></label>
      {(["x","y","width"] as const).map(key=><label className="field" key={key}><span>{t(locale,key === "width" ? "canvasWidth" : key)}</span>
        <input aria-label={`${t(locale,"referencePosition")} ${key}`} type="number" value={Math.round(image[key])} min={key==="width" ? 1 : -config.canvas.dimensions.maxPixels * config.references.maxScale} max={config.canvas.dimensions.maxPixels * config.references.maxScale} onChange={event=>{
          const value=event.target.valueAsNumber;if (!Number.isFinite(value)) return;
          if (key==="width") onUpdate(image.id,{width:value,height:image.height * value / image.width});
          else onUpdate(image.id,{[key]:value});
        }}/></label>)}
      <button className="text-button" onClick={()=>onRemove(image.id)}>{t(locale,"removeReference")}</button>
    </div>)}
    </div>
  </CollapsiblePanel>;
}
