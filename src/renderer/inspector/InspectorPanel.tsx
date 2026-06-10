import { Image, KeyRound, Loader2, RefreshCw } from "lucide-react";

import type { EffectiveLocale } from "../app/uiPreferences";
import { t } from "../i18n/appI18n";
import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { DrawingDocument } from "../../shared/document/documentTypes";
import type { StoredRealisticImage } from "../../shared/image-generation/imageGenerationTypes";

type InspectorPanelProps = {
  config: AppConfig;
  locale: EffectiveLocale;
  document: DrawingDocument;
  apiKeyConfigured: boolean;
  apiKeyBackend: string;
  imageGenerationModel: string;
  imageGenerationStyle: string;
  autoRedrawEnabled: boolean;
  autoRedrawDelaySeconds: number;
  isGenerating: boolean;
  errorMessage: string | null;
  onGenerateImage: () => void;
  onOpenApiKeySettings: () => void;
};

export function InspectorPanel({
  config,
  locale,
  document,
  apiKeyConfigured,
  apiKeyBackend,
  imageGenerationModel,
  imageGenerationStyle,
  autoRedrawEnabled,
  autoRedrawDelaySeconds,
  isGenerating,
  errorMessage,
  onGenerateImage,
  onOpenApiKeySettings
}: InspectorPanelProps): JSX.Element {
  const realisticImage = document.realisticImage;
  const canGenerate = apiKeyConfigured && !isGenerating;

  return (
    <section className="panel inspector-panel" aria-label={t(locale, "inspector")}>
      <div className="panel-header">
        <span><Image size={16} /> {t(locale, "inspector")}</span>
        <div className="panel-actions">
          <button
            className="mini-button"
            title={t(locale, "openApiKeySettings")}
            aria-label={t(locale, "openApiKeySettings")}
            onClick={onOpenApiKeySettings}
          >
            <KeyRound size={15} />
          </button>
          <button
            className="mini-button"
            title={t(locale, "generateImage")}
            aria-label={t(locale, "generateImage")}
            disabled={!canGenerate}
            onClick={onGenerateImage}
          >
            {isGenerating ? <Loader2 className="spin-icon" size={15} /> : <RefreshCw size={15} />}
          </button>
        </div>
      </div>
      <div
        className="inspector-preview"
        style={{
          aspectRatio: `${config.canvas.defaultWidth} / ${config.canvas.defaultHeight}`
        }}
      >
        <InspectorPreview
          locale={locale}
          realisticImage={realisticImage}
          isGenerating={isGenerating}
          apiKeyConfigured={apiKeyConfigured}
        />
      </div>
      {errorMessage && <p className="inspector-error">{errorMessage}</p>}
      <dl className="inspector-meta">
        <div>
          <dt>{t(locale, "provider")}</dt>
          <dd>{config.imageGeneration.defaultProvider}</dd>
        </div>
        <div>
          <dt>{t(locale, "model")}</dt>
          <dd>{realisticImage?.model ?? imageGenerationModel}</dd>
        </div>
        <div>
          <dt>{t(locale, "style")}</dt>
          <dd>{imageGenerationStyle}</dd>
        </div>
        <div>
          <dt>{t(locale, "autoRedraw")}</dt>
          <dd>{autoRedrawEnabled ? `${autoRedrawDelaySeconds}s` : "Off"}</dd>
        </div>
        <div>
          <dt>{t(locale, "apiKey")}</dt>
          <dd>{apiKeyConfigured ? t(locale, "apiKeyConfigured") : t(locale, "apiKeyMissing")}</dd>
        </div>
        <div>
          <dt>{t(locale, "storage")}</dt>
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
  locale: EffectiveLocale;
  realisticImage: StoredRealisticImage | null;
  isGenerating: boolean;
  apiKeyConfigured: boolean;
};

function InspectorPreview({
  locale,
  realisticImage,
  isGenerating,
  apiKeyConfigured
}: InspectorPreviewProps): JSX.Element {
  if (isGenerating) {
    return (
      <div className="inspector-empty">
        <Loader2 className="spin-icon" size={34} />
        <span>{t(locale, "generating")}</span>
      </div>
    );
  }

  if (realisticImage) {
    return <img src={realisticImage.dataUrl} alt="Generated realistic preview" />;
  }

  if (!apiKeyConfigured) {
    return (
      <div className="inspector-empty">
        <KeyRound size={34} />
        <span>{t(locale, "apiKeyMissing")}</span>
      </div>
    );
  }

  return (
    <div className="inspector-empty">
      <Image size={34} />
      <span>{t(locale, "noImageYet")}</span>
    </div>
  );
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

