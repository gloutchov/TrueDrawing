import { Paintbrush } from "lucide-react";
import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { DrawingToolSettings } from "../../shared/drawing/toolTypes";
import { textureKinds } from "../../shared/drawing/brushModel";
import type { EffectiveLocale } from "../app/uiPreferences";
import { t } from "../i18n/appI18n";
import { CollapsiblePanel } from "../ui/CollapsiblePanel";

export function BrushPanel({config, locale, settings, onChange}: {
  config: AppConfig; locale: EffectiveLocale; settings: DrawingToolSettings;
  onChange: (value: Partial<DrawingToolSettings>) => void;
}) {
  const brush = settings.brush;
  return <CollapsiblePanel title={t(locale, "advancedBrush")} icon={<Paintbrush size={16}/>} locale={locale}>
    <label className="field"><span>{t(locale, "brushPreset")}</span>
      <select aria-label={t(locale, "brushPreset")} value={brush?.presetId ?? ""} onChange={event => {
        const preset = config.tools.brushPresets.find(item => item.presetId === event.target.value);
        if (preset) onChange({tool: preset.tool, size: preset.size, opacity: preset.opacity, hardness: preset.hardness, brush: preset});
        else onChange({brush: undefined});
      }}><option value="">{t(locale, "classicBrush")}</option>
        {config.tools.brushPresets.map(preset => <option key={preset.presetId} value={preset.presetId}>{preset.label[locale]}</option>)}
      </select></label>
    {brush && <>
      <label className="field"><span>{t(locale, "brushTexture")}</span>
        <select aria-label={t(locale, "brushTexture")} value={brush.texture} onChange={event => onChange({brush: {...brush, texture: event.target.value as typeof brush.texture}})}>
          {textureKinds.map(kind => <option value={kind} key={kind}>{t(locale, kind)}</option>)}
        </select></label>
      {(["spacing", "pressureSize", "pressureOpacity", "velocitySize", "textureAmount", "textureScale"] as const).map(key =>
        <label className="field" key={key}><span>{t(locale, key)}: {brush[key]}</span>
          <input aria-label={t(locale, key)} type="range" min={key === "spacing" ? 0.05 : key === "textureScale" ? 1 : 0}
            max={key === "textureScale" ? 64 : 1} step={key === "textureScale" ? 1 : 0.05} value={brush[key]}
            onChange={event => onChange({brush: {...brush, [key]: event.currentTarget.valueAsNumber}})}/></label>)}
    </>}
  </CollapsiblePanel>;
}
