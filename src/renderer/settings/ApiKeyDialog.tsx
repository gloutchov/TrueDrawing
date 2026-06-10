import { useEffect, useState } from "react";
import { KeyRound, Trash2, X } from "lucide-react";

import type { EffectiveLocale } from "../app/uiPreferences";
import { t } from "../i18n/appI18n";
import type { AppConfig } from "../../shared/config/appConfigSchema";

type ApiKeyDialogProps = {
  config: AppConfig;
  locale: EffectiveLocale;
  open: boolean;
  imageGenerationModel: string;
  apiKeyBackend: string;
  onClose: () => void;
  onStatusChange: (configured: boolean, backend: string) => void;
  onModelChange: (model: string) => void;
};

type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function ApiKeyDialog({
  config,
  locale,
  open,
  imageGenerationModel,
  apiKeyBackend,
  onClose,
  onStatusChange,
  onModelChange
}: ApiKeyDialogProps): JSX.Element | null {
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState(imageGenerationModel);
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });

  useEffect(() => {
    if (open) {
      setApiKey("");
      setSelectedModel(imageGenerationModel);
      setSaveState({ status: "idle" });
    }
  }, [imageGenerationModel, open]);

  if (!open) {
    return null;
  }

  const saveApiKey = async () => {
    setSaveState({ status: "saving" });

    try {
      const status = await window.trueDrawing.setOpenAiApiKey(apiKey);

      setApiKey("");
      onStatusChange(status.configured, status.backend);
      setSaveState({ status: "success", message: "API key saved." });
      onClose();
    } catch (error: unknown) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to save API key."
      });
    }
  };

  const clearApiKey = async () => {
    if (!window.confirm("Remove the saved API key?")) {
      return;
    }

    setSaveState({ status: "saving" });

    try {
      const status = await window.trueDrawing.clearOpenAiApiKey();

      setApiKey("");
      onStatusChange(status.configured, status.backend);
      setSaveState({ status: "success", message: "API key removed." });
      onClose();
    } catch (error: unknown) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to remove API key."
      });
    }
  };

  const saveModel = async () => {
    setSaveState({ status: "saving" });

    try {
      const preferences = await window.trueDrawing.setImageGenerationModel(selectedModel);

      onModelChange(preferences.model);
      setSaveState({ status: "success", message: "Image model saved." });
      onClose();
    } catch (error: unknown) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to save image model."
      });
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={t(locale, "apiKeySettings")}>
        <div className="modal-header">
          <span><KeyRound size={17} /> {t(locale, "apiKeySettings")}</span>
          <button className="mini-button" title={t(locale, "close")} aria-label={t(locale, "close")} onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <label className="field">
            <span>{t(locale, "apiKey")}</span>
            <input
              autoFocus
              type="password"
              value={apiKey}
              placeholder="sk-..."
              onChange={(event) => setApiKey(event.currentTarget.value)}
            />
          </label>
          <label className="field">
            <span>{t(locale, "imageModel")}</span>
            <input
              type="text"
              value={selectedModel}
              placeholder={config.imageGeneration.defaultModel}
              list="openai-image-model-suggestions"
              onChange={(event) => setSelectedModel(event.currentTarget.value)}
            />
            <datalist id="openai-image-model-suggestions">
              {config.imageGeneration.availableModels.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </datalist>
          </label>
          <div className="settings-readout">
            <span>{t(locale, "apiKeyStorage")}</span>
            <strong>{formatBackend(apiKeyBackend)}</strong>
          </div>
          {saveState.status === "success" && (
            <p className="form-message form-message--success">{saveState.message}</p>
          )}
          {saveState.status === "error" && (
            <p className="form-message form-message--error">{saveState.message}</p>
          )}
        </div>
        <div className="modal-actions">
          <button
            className="text-button text-button--danger"
            disabled={saveState.status === "saving"}
            onClick={clearApiKey}
          >
            <Trash2 size={15} />
            {t(locale, "remove")}
          </button>
          <button
            className="text-button"
            disabled={
              selectedModel.trim().length === 0 ||
              selectedModel.trim() === imageGenerationModel ||
              saveState.status === "saving"
            }
            onClick={saveModel}
          >
            {t(locale, "saveModel")}
          </button>
          <button className="text-button" onClick={onClose}>
            {t(locale, "cancel")}
          </button>
          <button
            className="text-button text-button--primary"
            disabled={apiKey.trim().length === 0 || saveState.status === "saving"}
            onClick={saveApiKey}
          >
            {t(locale, "save")}
          </button>
        </div>
      </section>
    </div>
  );
}

function formatBackend(backend: string): string {
  if (backend === "windows-credential-manager") {
    return "Windows Credential Manager";
  }

  if (backend === "macos-keychain") {
    return "macOS Keychain";
  }

  if (backend === "encrypted-local-storage") {
    return "Encrypted local storage";
  }

  return "Unknown";
}
