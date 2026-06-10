import { useEffect, useState } from "react";
import { Languages, X } from "lucide-react";

import type { EffectiveLocale, UiLocaleMode, UiPreferences, UiThemeMode } from "../app/uiPreferences";
import {
  isUiLocaleMode,
  isUiThemeMode,
  resolveEffectiveLocale,
  resolveEffectiveTheme
} from "../app/uiPreferences";
import {
  formatLocaleMode,
  formatThemeMode,
  t
} from "../i18n/appI18n";
import type { AppConfig } from "../../shared/config/appConfigSchema";

type InterfacePreferencesDialogProps = {
  config: AppConfig;
  open: boolean;
  locale: EffectiveLocale;
  preferences: UiPreferences;
  onClose: () => void;
  onPreferencesChange: (preferences: UiPreferences) => void;
};

export function InterfacePreferencesDialog({
  config,
  open,
  locale,
  preferences,
  onClose,
  onPreferencesChange
}: InterfacePreferencesDialogProps): JSX.Element | null {
  const [localeMode, setLocaleMode] = useState<UiLocaleMode>(preferences.localeMode);
  const [themeMode, setThemeMode] = useState<UiThemeMode>(preferences.themeMode);

  useEffect(() => {
    if (open) {
      setLocaleMode(preferences.localeMode);
      setThemeMode(preferences.themeMode);
    }
  }, [
    open,
    preferences.localeMode,
    preferences.themeMode
  ]);

  if (!open) {
    return null;
  }

  const nextPreferences: UiPreferences = {
    ...preferences,
    localeMode,
    themeMode
  };
  const previewLocale = resolveEffectiveLocale(localeMode);
  const previewTheme = resolveEffectiveTheme(themeMode);

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={t(locale, "appSettings")}>
        <div className="modal-header">
          <span><Languages size={17} /> {t(locale, "appSettings")}</span>
          <button className="mini-button" title={t(locale, "close")} aria-label={t(locale, "close")} onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <label className="field">
            <span>{t(locale, "interfaceLanguage")}</span>
            <select
              value={localeMode}
              onChange={(event) => {
                if (isUiLocaleMode(event.currentTarget.value)) {
                  setLocaleMode(event.currentTarget.value);
                }
              }}
            >
              {config.ui.availableLocaleModes.map((mode) => (
                isUiLocaleMode(mode)
                  ? <option key={mode} value={mode}>{formatLocaleMode(locale, mode)}</option>
                  : null
              ))}
            </select>
          </label>
          <label className="field">
            <span>{t(locale, "interfaceTheme")}</span>
            <select
              value={themeMode}
              onChange={(event) => {
                if (isUiThemeMode(event.currentTarget.value)) {
                  setThemeMode(event.currentTarget.value);
                }
              }}
            >
              {config.ui.availableThemeModes.map((mode) => (
                isUiThemeMode(mode)
                  ? <option key={mode} value={mode}>{formatThemeMode(locale, mode)}</option>
                  : null
              ))}
            </select>
          </label>
          <div className="settings-readout">
            <span>{t(locale, "effectiveValue")}</span>
            <strong>{formatLocaleMode(previewLocale, previewLocale)} / {formatThemeMode(locale, previewTheme)}</strong>
          </div>
        </div>
        <div className="modal-actions">
          <button className="text-button" type="button" onClick={onClose}>
            {t(locale, "cancel")}
          </button>
          <button
            className="text-button text-button--primary"
            type="button"
            onClick={() => {
              onPreferencesChange(nextPreferences);
              onClose();
            }}
          >
            {t(locale, "save")}
          </button>
        </div>
      </section>
    </div>
  );
}
