import { useEffect, useState } from "react";
import { Palette, X } from "lucide-react";

import type { EffectiveLocale } from "../app/uiPreferences";
import { t } from "../i18n/appI18n";
import type { AppConfig } from "../../shared/config/appConfigSchema";

type ImageStyleDialogProps = {
  config: AppConfig;
  locale: EffectiveLocale;
  open: boolean;
  imageGenerationStyle: string;
  onClose: () => void;
  onStyleChange: (style: string) => void;
};

type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function ImageStyleDialog({
  config,
  locale,
  open,
  imageGenerationStyle,
  onClose,
  onStyleChange
}: ImageStyleDialogProps): JSX.Element | null {
  const [selectedStyle, setSelectedStyle] = useState(imageGenerationStyle);
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });

  useEffect(() => {
    if (open) {
      setSelectedStyle(imageGenerationStyle);
      setStyleMenuOpen(false);
      setSaveState({ status: "idle" });
    }
  }, [imageGenerationStyle, open]);

  if (!open) {
    return null;
  }

  const styleToSave = selectedStyle.trim();
  const saveStyle = async () => {
    setSaveState({ status: "saving" });

    try {
      const preferences = await window.trueDrawing.setImageGenerationStyle(styleToSave);

      onStyleChange(preferences.style);
      setSelectedStyle(preferences.style);
      setSaveState({ status: "success", message: "Image style saved." });
      onClose();
    } catch (error: unknown) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to save image style."
      });
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={t(locale, "imageStyle")}>
        <div className="modal-header">
          <span><Palette size={17} /> {t(locale, "imageStyle")}</span>
          <button className="mini-button" title={t(locale, "close")} aria-label={t(locale, "close")} onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <div className="field">
            <span>{t(locale, "imageStyle")}</span>
            <div className="style-picker">
              <button
                className="style-picker-trigger"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={styleMenuOpen}
                onClick={() => setStyleMenuOpen((currentOpen) => !currentOpen)}
              >
                {selectedStyle || config.imageGeneration.defaultStyle}
              </button>
              {styleMenuOpen && (
                <div className="style-picker-menu" role="listbox" aria-label={t(locale, "imageStyle")}>
                  {config.imageGeneration.availableStyles.map((style) => (
                    <button
                      key={style}
                      className={`style-picker-option${style === selectedStyle ? " is-active" : ""}`}
                      type="button"
                      role="option"
                      aria-selected={style === selectedStyle}
                      onClick={() => {
                        setSelectedStyle(style);
                        setStyleMenuOpen(false);
                      }}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <label className="field">
            <span>{t(locale, "imageStyle")}</span>
            <input
              autoFocus
              type="text"
              value={selectedStyle}
              placeholder={config.imageGeneration.defaultStyle}
              onChange={(event) => {
                setSelectedStyle(event.currentTarget.value);
                setStyleMenuOpen(false);
              }}
            />
          </label>
          <div className="style-chip-list" aria-label={t(locale, "imageStyle")}>
              {config.imageGeneration.availableStyles.map((style) => (
                <button
                  key={style}
                  className={`style-chip${style === selectedStyle ? " is-active" : ""}`}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                >
                  {style}
                </button>
              ))}
          </div>
          {saveState.status === "success" && (
            <p className="form-message form-message--success">{saveState.message}</p>
          )}
          {saveState.status === "error" && (
            <p className="form-message form-message--error">{saveState.message}</p>
          )}
        </div>
        <div className="modal-actions">
          <button className="text-button" type="button" onClick={onClose}>
            {t(locale, "cancel")}
          </button>
          <button
            className="text-button text-button--primary"
            type="button"
            disabled={styleToSave.length < 2 || saveState.status === "saving"}
            onClick={() => void saveStyle()}
          >
            {t(locale, "save")}
          </button>
        </div>
      </section>
    </div>
  );
}
