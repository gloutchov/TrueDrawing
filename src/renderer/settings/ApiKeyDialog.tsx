import { useEffect, useState } from "react";
import { KeyRound, Trash2, X } from "lucide-react";

import type { AppConfig } from "../../shared/config/appConfigSchema";

type ApiKeyDialogProps = {
  config: AppConfig;
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
    } catch (error: unknown) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to save API key."
      });
    }
  };

  const clearApiKey = async () => {
    setSaveState({ status: "saving" });

    try {
      const status = await window.trueDrawing.clearOpenAiApiKey();

      setApiKey("");
      onStatusChange(status.configured, status.backend);
      setSaveState({ status: "success", message: "API key removed." });
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
    } catch (error: unknown) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to save image model."
      });
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label="OpenAI settings">
        <div className="modal-header">
          <span><KeyRound size={17} /> OpenAI Settings</span>
          <button className="mini-button" title="Close" aria-label="Close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <label className="field">
            <span>API key</span>
            <input
              autoFocus
              type="password"
              value={apiKey}
              placeholder="sk-..."
              onChange={(event) => setApiKey(event.currentTarget.value)}
            />
          </label>
          <label className="field">
            <span>Image model</span>
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
            <span>Secret storage</span>
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
            Remove
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
            Save model
          </button>
          <button className="text-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="text-button text-button--primary"
            disabled={apiKey.trim().length === 0 || saveState.status === "saving"}
            onClick={saveApiKey}
          >
            Save
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
