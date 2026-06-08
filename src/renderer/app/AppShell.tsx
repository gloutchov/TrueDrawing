import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { exportDocumentCanvasToPngDataUrl } from "../canvas/canvasExport";
import { CanvasStage } from "../canvas/CanvasStage";
import { useDrawingDocumentHistory } from "../history/useDrawingDocumentHistory";
import { InspectorPanel } from "../inspector/InspectorPanel";
import { LayerPanel } from "../layers/LayerPanel";
import { ApiKeyDialog } from "../settings/ApiKeyDialog";
import { SettingsSummary } from "../settings/SettingsSummary";
import { ToolPanel } from "../tools/ToolPanel";
import { createInitialToolSettings, settingsForSelectedTool } from "../tools/toolState";
import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { DrawingToolId, DrawingToolSettings } from "../../shared/drawing/toolTypes";
import { buildRealisticImagePrompt } from "../../shared/image-generation/realisticPrompt";
import type { RuntimeInfo } from "../../shared/runtime/runtimeInfo";

type AppShellProps = {
  config: AppConfig;
  runtime: RuntimeInfo;
};

export function AppShell({ config, runtime }: AppShellProps): JSX.Element {
  const {
    document,
    canUndo,
    canRedo,
    appendStroke,
    updateStroke,
    addLayer,
    renameLayer,
    deleteLayer,
    selectLayer,
    setLayerVisibility,
    setLayerOpacity,
    moveLayer,
    setRealisticImage,
    undo,
    redo
  } = useDrawingDocumentHistory(config);
  const [toolSettings, setToolSettings] = useState<DrawingToolSettings>(() => (
    createInitialToolSettings(config)
  ));
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [apiKeyBackend, setApiKeyBackend] = useState("unknown");
  const [imageGenerationModel, setImageGenerationModel] = useState(config.imageGeneration.defaultModel);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationErrorMessage, setGenerationErrorMessage] = useState<string | null>(null);
  const shellStyle = {
    "--top-bar-height": `${config.layout.topBarHeight}px`,
    "--tool-rail-width": `${config.layout.toolRailWidth}px`,
    "--side-panel-width": `${config.layout.sidePanelWidth}px`,
    "--workspace-padding": `${config.layout.workspacePadding}px`
  } as CSSProperties;
  const selectTool = useCallback((tool: DrawingToolId) => {
    setToolSettings((currentSettings) => settingsForSelectedTool(config, currentSettings, tool));
  }, [config]);
  const changeToolSettings = useCallback((settings: Partial<DrawingToolSettings>) => {
    setToolSettings((currentSettings) => ({
      ...currentSettings,
      ...settings
    }));
  }, []);
  const openApiKeyDialog = useCallback(() => {
    setApiKeyDialogOpen(true);
  }, []);
  const generateRealisticImage = useCallback(async () => {
    setIsGenerating(true);
    setGenerationErrorMessage(null);

    try {
      const canvasDataUrl = exportDocumentCanvasToPngDataUrl(document, config);
      const result = await window.trueDrawing.generateRealisticImage({
        canvasDataUrl,
        model: imageGenerationModel,
        prompt: buildRealisticImagePrompt(document)
      });

      setRealisticImage(result);
    } catch (error: unknown) {
      setGenerationErrorMessage(
        error instanceof Error ? error.message : "Unable to generate image."
      );
    } finally {
      setIsGenerating(false);
    }
  }, [
    config,
    document,
    imageGenerationModel,
    setRealisticImage
  ]);

  useEffect(() => {
    let isMounted = true;

    window.trueDrawing.getOpenAiApiKeyStatus().then((status) => {
      if (isMounted) {
        setApiKeyConfigured(status.configured);
        setApiKeyBackend(status.backend);
      }
    }).catch(() => {
      if (isMounted) {
        setApiKeyConfigured(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    window.trueDrawing.getImageGenerationPreferences().then((preferences) => {
      if (isMounted) {
        setImageGenerationModel(preferences.model);
      }
    }).catch(() => {
      if (isMounted) {
        setImageGenerationModel(config.imageGeneration.defaultModel);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [config.imageGeneration.defaultModel]);

  const updateApiKeyStatus = useCallback((configured: boolean, backend: string) => {
    setApiKeyConfigured(configured);
    setApiKeyBackend(backend);
  }, []);

  useEffect(() => window.trueDrawing.onOpenApiKeySettings(openApiKeyDialog), [openApiKeyDialog]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const usesCommandModifier = event.ctrlKey || event.metaKey;

      if (!usesCommandModifier) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "z" && event.shiftKey) {
        event.preventDefault();
        redo();
        return;
      }

      if (key === "z") {
        event.preventDefault();
        undo();
        return;
      }

      if (key === "y") {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [redo, undo]);

  return (
    <div className="app-shell" style={shellStyle}>
      <header className="top-bar">
        <div className="brand-lockup">
          <strong>{config.app.name}</strong>
          <span>{runtime.appVersion}</span>
        </div>
        <SettingsSummary config={config} imageGenerationModel={imageGenerationModel} />
      </header>
      <aside className="tool-rail" aria-label="Drawing tools">
        <ToolPanel
          config={config}
          settings={toolSettings}
          canUndo={canUndo}
          canRedo={canRedo}
          onSelectTool={selectTool}
          onChangeSettings={changeToolSettings}
          onUndo={undo}
          onRedo={redo}
        />
      </aside>
      <main className="workspace">
        <CanvasStage
          config={config}
          document={document}
          toolSettings={toolSettings}
          onAppendStroke={appendStroke}
          onUpdateStroke={updateStroke}
        />
      </main>
      <aside className="right-panel" aria-label="Document panels">
        <InspectorPanel
          config={config}
          document={document}
          apiKeyConfigured={apiKeyConfigured}
          apiKeyBackend={apiKeyBackend}
          imageGenerationModel={imageGenerationModel}
          isGenerating={isGenerating}
          errorMessage={generationErrorMessage}
          onGenerateImage={generateRealisticImage}
          onOpenApiKeySettings={openApiKeyDialog}
        />
        <LayerPanel
          config={config}
          document={document}
          onAddLayer={addLayer}
          onRenameLayer={renameLayer}
          onDeleteLayer={deleteLayer}
          onSelectLayer={selectLayer}
          onSetLayerVisibility={setLayerVisibility}
          onSetLayerOpacity={setLayerOpacity}
          onMoveLayer={moveLayer}
        />
      </aside>
      <ApiKeyDialog
        config={config}
        open={apiKeyDialogOpen}
        imageGenerationModel={imageGenerationModel}
        apiKeyBackend={apiKeyBackend}
        onClose={() => setApiKeyDialogOpen(false)}
        onStatusChange={updateApiKeyStatus}
        onModelChange={setImageGenerationModel}
      />
    </div>
  );
}
