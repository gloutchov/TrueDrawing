import { useEffect, useState } from "react";
import { KeyRound, Trash2, X } from "lucide-react";

type ApiKeyDialogProps = {
  open: boolean;
  onClose: () => void;
  onStatusChange: (configured: boolean) => void;
};

type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function ApiKeyDialog({
  open,
  onClose,
  onStatusChange
}: ApiKeyDialogProps): JSX.Element | null {
  const [apiKey, setApiKey] = useState("");
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });

  useEffect(() => {
    if (open) {
      setApiKey("");
      setSaveState({ status: "idle" });
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const saveApiKey = async () => {
    setSaveState({ status: "saving" });

    try {
      const status = await window.trueDrawing.setOpenAiApiKey(apiKey);

      setApiKey("");
      onStatusChange(status.configured);
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
      onStatusChange(status.configured);
      setSaveState({ status: "success", message: "API key removed." });
    } catch (error: unknown) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to remove API key."
      });
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label="OpenAI API key">
        <div className="modal-header">
          <span><KeyRound size={17} /> OpenAI API Key</span>
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
