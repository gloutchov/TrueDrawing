import { useEffect, useState } from "react";
import { TimerReset, X } from "lucide-react";

import type { AppConfig } from "../../shared/config/appConfigSchema";

type AutoRedrawDialogProps = {
  config: AppConfig;
  open: boolean;
  enabled: boolean;
  delaySeconds: number;
  onClose: () => void;
  onPreferencesChange: (enabled: boolean, delaySeconds: number) => void;
};

type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function AutoRedrawDialog({
  config,
  open,
  enabled,
  delaySeconds,
  onClose,
  onPreferencesChange
}: AutoRedrawDialogProps): JSX.Element | null {
  const [selectedEnabled, setSelectedEnabled] = useState(enabled);
  const [selectedDelaySeconds, setSelectedDelaySeconds] = useState(String(delaySeconds));
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });

  useEffect(() => {
    if (open) {
      setSelectedEnabled(enabled);
      setSelectedDelaySeconds(String(delaySeconds));
      setSaveState({ status: "idle" });
    }
  }, [
    delaySeconds,
    enabled,
    open
  ]);

  if (!open) {
    return null;
  }

  const delayRange = config.imageGeneration.autoRedrawDelayRange;
  const parsedDelaySeconds = Number(selectedDelaySeconds);
  const clampedDelaySeconds = Math.min(
    delayRange.max,
    Math.max(delayRange.min, parsedDelaySeconds)
  );
  const delayIsValid = Number.isFinite(parsedDelaySeconds);
  const savePreferences = async () => {
    if (!delayIsValid) {
      setSaveState({
        status: "error",
        message: "Delay must be a number."
      });
      return;
    }

    setSaveState({ status: "saving" });

    try {
      const preferences = await window.trueDrawing.setImageGenerationAutoRedraw(
        selectedEnabled,
        clampedDelaySeconds
      );

      onPreferencesChange(preferences.autoRedrawEnabled, preferences.autoRedrawDelaySeconds);
      setSaveState({ status: "success", message: "Auto redraw saved." });
      onClose();
    } catch (error: unknown) {
      setSaveState({
        status: "error",
        message: formatIpcError(error, "Unable to save auto redraw.")
      });
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label="Auto redraw settings">
        <div className="modal-header">
          <span><TimerReset size={17} /> Redraw automatico</span>
          <button className="mini-button" title="Close" aria-label="Close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={selectedEnabled}
              onChange={(event) => setSelectedEnabled(event.currentTarget.checked)}
            />
            <span>Ridisegna automaticamente l'inspector quando il canvas resta fermo</span>
          </label>
          <label className="field">
            <span>Attesa prima del redraw, in secondi</span>
            <input
              type="number"
              min={delayRange.min}
              max={delayRange.max}
              step={delayRange.step}
              value={selectedDelaySeconds}
              onChange={(event) => setSelectedDelaySeconds(event.currentTarget.value)}
            />
          </label>
          {saveState.status === "success" && (
            <p className="form-message form-message--success">{saveState.message}</p>
          )}
          {saveState.status === "error" && (
            <textarea
              className="form-message form-message--error form-message-textarea"
              readOnly
              value={saveState.message}
            />
          )}
        </div>
        <div className="modal-actions">
          <button className="text-button" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="text-button text-button--primary"
            type="button"
            disabled={!delayIsValid || saveState.status === "saving"}
            onClick={() => void savePreferences()}
          >
            Save
          </button>
        </div>
      </section>
    </div>
  );
}

function formatIpcError(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) {
    return fallback;
  }

  return error.message
    .replace(/^Error invoking remote method '[^']+':\s*/u, "")
    .replace(/^Error:\s*/u, "")
    .trim() || fallback;
}
