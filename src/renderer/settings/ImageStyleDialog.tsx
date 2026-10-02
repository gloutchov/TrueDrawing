import { useEffect, useState, type JSX } from "react";
import { Palette, X } from "lucide-react";

import type { EffectiveLocale } from "../app/uiPreferences";
import { t } from "../i18n/appI18n";
import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { ImageGenerationPreferences } from "../../shared/image-generation/imageGenerationTypes";
import { findStylePreset, validateCustomStyle } from "../../shared/image-generation/stylePresets";

type ImageStyleDialogProps = {
  config: AppConfig;
  locale: EffectiveLocale;
  open: boolean;
  imageGenerationStyle: string;
  favoriteStyleId: string | null;
  onClose: () => void;
  onStyleChange: (preferences: ImageGenerationPreferences) => void;
};

export function ImageStyleDialog({
  config, locale, open, imageGenerationStyle, favoriteStyleId, onClose, onStyleChange
}: ImageStyleDialogProps): JSX.Element | null {
  const presets = config.imageGeneration.stylePresets;
  const [selectedId, setSelectedId] = useState("custom");
  const [customStyle, setCustomStyle] = useState("");
  const [favorite, setFavorite] = useState<string | null>(favoriteStyleId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (open) {
      const preset = findStylePreset(presets, imageGenerationStyle);
      setSelectedId(preset?.id ?? "custom");
      setCustomStyle(preset ? "" : imageGenerationStyle);
      setFavorite(favoriteStyleId);
      setError(false);
    }
  }, [imageGenerationStyle, favoriteStyleId, presets, open]);

  if (!open) return null;
  const preset = findStylePreset(presets, selectedId);
  const favoritePreset = favorite ? findStylePreset(presets, favorite) : undefined;
  let styleToSave = preset?.id ?? "";
  if (!preset) {
    try { styleToSave = validateCustomStyle(customStyle, config.imageGeneration.maxCustomStyleLength); }
    catch { /* Disable Save until the custom style is valid. */ }
  }
  const saveStyle = async () => {
    setSaving(true);
    setError(false);
    try {
      const preferences = await window.trueDrawing.setImageGenerationStyle(styleToSave, favorite);
      onStyleChange(preferences);
      onClose();
    } catch { setError(true); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={t(locale, "imageStyle")}>
        <div className="modal-header">
          <span><Palette size={17} /> {t(locale, "imageStyle")}</span>
          <button className="mini-button" title={t(locale, "close")} aria-label={t(locale, "close")} disabled={saving} onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <label className="field">
            <span>{t(locale, "stylePreset")}</span>
            <select autoFocus value={selectedId} disabled={saving} onChange={event => setSelectedId(event.currentTarget.value)}>
              {presets.map(item => <option key={item.id} value={item.id}>{item.name[locale]}{item.id === favorite ? " ★" : ""}</option>)}
              <option value="custom">{t(locale, "customStyle")}</option>
            </select>
          </label>
          {preset ? (
            <p>{preset.description[locale]}</p>
          ) : (
            <label className="field">
              <span>{t(locale, "customStyle")}</span>
              <input type="text" value={customStyle} maxLength={config.imageGeneration.maxCustomStyleLength} disabled={saving}
                onChange={event => setCustomStyle(event.currentTarget.value)} />
            </label>
          )}
          <label className="checkbox-field">
            <input type="checkbox" checked={!!preset && favorite === preset.id} disabled={!preset || saving}
              onChange={event => setFavorite(event.currentTarget.checked ? preset?.id ?? null : null)} />
            <span>{t(locale, "favoriteStyle")}</span>
          </label>
          {favoritePreset && (
            <button className="text-button" type="button" disabled={saving} onClick={() => setSelectedId(favoritePreset.id)}>
              {t(locale, "useFavoriteStyle")}: {favoritePreset.name[locale]}
            </button>
          )}
          <p className="form-message">{t(locale, "stylePrivacy")}</p>
          {error && <p className="form-message form-message--error" role="alert">{t(locale, "styleSaveFailed")}</p>}
        </div>
        <div className="modal-actions">
          <button className="text-button" type="button" disabled={saving} onClick={onClose}>{t(locale, "cancel")}</button>
          <button className="text-button text-button--primary" type="button" disabled={!styleToSave || saving} onClick={() => void saveStyle()}>
            {t(locale, "save")}
          </button>
        </div>
      </section>
    </div>
  );
}
