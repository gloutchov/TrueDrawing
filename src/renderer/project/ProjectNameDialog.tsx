import type { EffectiveLocale } from "../app/uiPreferences";
import { t } from "../i18n/appI18n";
export function ProjectNameDialog({locale,value,onChange,onSubmit,onCancel}:{
  locale:EffectiveLocale;value:string;onChange:(value:string)=>void;onSubmit:()=>void;onCancel:()=>void;
}) {
  return <div className="modal-backdrop"><form className="modal" role="dialog" aria-modal="true" aria-label={t(locale,"projectName")} onSubmit={event=>{event.preventDefault();onSubmit();}}>
    <div className="modal-header">{t(locale,"projectName")}</div>
    <div className="modal-body"><label className="field"><span>{t(locale,"projectName")}</span><input autoFocus aria-label={t(locale,"projectName")} value={value} onChange={event=>onChange(event.target.value)}/></label></div>
    <div className="modal-actions"><button type="button" className="text-button" onClick={onCancel}>{t(locale,"cancel")}</button><button type="submit" className="text-button text-button--primary" disabled={!value.trim()}>{t(locale,"save")}</button></div>
  </form></div>;
}
