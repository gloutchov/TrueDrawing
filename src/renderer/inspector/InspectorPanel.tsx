import { Image, KeyRound, Loader2, RefreshCw } from "lucide-react";

import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { DrawingDocument } from "../../shared/document/documentTypes";
import type { StoredRealisticImage } from "../../shared/image-generation/imageGenerationTypes";

type InspectorPanelProps = {
  config: AppConfig;
  document: DrawingDocument;
  apiKeyConfigured: boolean;
  apiKeyBackend: string;
  imageGenerationModel: string;
  isGenerating: boolean;
  errorMessage: string | null;
  onGenerateImage: () => void;
  onOpenApiKeySettings: () => void;
};

export function InspectorPanel({
  config,
  document,
  apiKeyConfigured,
  apiKeyBackend,
  imageGenerationModel,
  isGenerating,
  errorMessage,
  onGenerateImage,
  onOpenApiKeySettings
}: InspectorPanelProps): JSX.Element {
  const realisticImage = document.realisticImage;
  const canGenerate = apiKeyConfigured && !isGenerating;

  return (
    <section className="panel inspector-panel" aria-label="Realistic image inspector">
      <div className="panel-header">
        <span><Image size={16} /> Inspector</span>
        <div className="panel-actions">
          <button
            className="mini-button"
            title="Open API key settings"
            aria-label="Open API key settings"
            onClick={onOpenApiKeySettings}
          >
            <KeyRound size={15} />
          </button>
          <button
            className="mini-button"
            title="Generate image"
            aria-label="Generate image"
            disabled={!canGenerate}
            onClick={onGenerateImage}
          >
            {isGenerating ? <Loader2 className="spin-icon" size={15} /> : <RefreshCw size={15} />}
          </button>
        </div>
      </div>
      <div className="inspector-preview">
        <InspectorPreview realisticImage={realisticImage} isGenerating={isGenerating} />
      </div>
      {errorMessage && <p className="inspector-error">{errorMessage}</p>}
      <dl className="inspector-meta">
        <div>
          <dt>Provider</dt>
          <dd>{config.imageGeneration.defaultProvider}</dd>
        </div>
        <div>
          <dt>Model</dt>
          <dd>{realisticImage?.model ?? imageGenerationModel}</dd>
        </div>
        <div>
          <dt>API key</dt>
          <dd>{apiKeyConfigured ? "Configured" : "Missing"}</dd>
        </div>
        <div>
          <dt>Storage</dt>
          <dd>{formatBackend(apiKeyBackend)}</dd>
        </div>
        <div>
          <dt>Last image</dt>
          <dd>{formatGeneratedAt(realisticImage?.generatedAt)}</dd>
        </div>
      </dl>
    </section>
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
    return "Encrypted local";
  }

  return "Unknown";
}

type InspectorPreviewProps = {
  realisticImage: StoredRealisticImage | null;
  isGenerating: boolean;
};

function InspectorPreview({ realisticImage, isGenerating }: InspectorPreviewProps): JSX.Element {
  if (isGenerating) {
    return <Loader2 className="spin-icon" size={34} />;
  }

  if (realisticImage) {
    return <img src={realisticImage.dataUrl} alt="Generated realistic preview" />;
  }

  return <Image size={34} />;
}

function formatGeneratedAt(generatedAt: string | undefined): string {
  if (!generatedAt) {
    return "None";
  }

  return new Date(generatedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

