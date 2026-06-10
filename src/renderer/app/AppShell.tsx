import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import {
  convertImageDataUrl,
  exportDocumentCanvasToDataUrl,
  exportDocumentCanvasToPngDataUrl,
  exportDocumentSelectionToPngDataUrl
} from "../canvas/canvasExport";
import { CanvasStage } from "../canvas/CanvasStage";
import { preloadCanvasImage } from "../canvas/canvasRenderer";
import { useDrawingDocumentHistory } from "../history/useDrawingDocumentHistory";
import { InspectorPanel } from "../inspector/InspectorPanel";
import { LayerPanel } from "../layers/LayerPanel";
import { ApiKeyDialog } from "../settings/ApiKeyDialog";
import { AutoRedrawDialog } from "../settings/AutoRedrawDialog";
import { ImageStyleDialog } from "../settings/ImageStyleDialog";
import { SettingsSummary } from "../settings/SettingsSummary";
import { ToolPanel } from "../tools/ToolPanel";
import { createInitialToolSettings, settingsForSelectedTool } from "../tools/toolState";
import type { AppConfig } from "../../shared/config/appConfigSchema";
import { createInitialDrawingDocument } from "../../shared/document/layerModel";
import type { CanvasSelection } from "../../shared/document/selectionTypes";
import { normalizeCanvasSelection } from "../../shared/document/selectionTypes";
import type { DrawingStroke } from "../../shared/drawing/strokeTypes";
import type { DrawingToolId, DrawingToolSettings } from "../../shared/drawing/toolTypes";
import { buildRealisticImagePrompt } from "../../shared/image-generation/realisticPrompt";
import {
  createDrawingProjectFile,
  normalizeProjectName
} from "../../shared/project/projectModel";
import type {
  DrawingProjectFile,
  ProjectAutosaveInfo,
  ProjectExportFormat,
  ProjectExportTarget,
  ProjectSaveRequest
} from "../../shared/project/projectTypes";
import type { RuntimeInfo } from "../../shared/runtime/runtimeInfo";

type AppShellProps = {
  config: AppConfig;
  runtime: RuntimeInfo;
};

export function AppShell({ config, runtime }: AppShellProps): JSX.Element {
  const {
    document,
    activeLayer,
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
    commitDocumentUpdate,
    replaceDocument,
    undo,
    redo
  } = useDrawingDocumentHistory(config);
  const [toolSettings, setToolSettings] = useState<DrawingToolSettings>(() => (
    createInitialToolSettings(config)
  ));
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [apiKeyBackend, setApiKeyBackend] = useState("unknown");
  const [imageGenerationModel, setImageGenerationModel] = useState(config.imageGeneration.defaultModel);
  const [imageGenerationStyle, setImageGenerationStyle] = useState(config.imageGeneration.defaultStyle);
  const [autoRedrawEnabled, setAutoRedrawEnabled] = useState(config.imageGeneration.autoRedrawDefaultEnabled);
  const [autoRedrawDelaySeconds, setAutoRedrawDelaySeconds] = useState(
    config.imageGeneration.autoRedrawDefaultDelaySeconds
  );
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [imageStyleDialogOpen, setImageStyleDialogOpen] = useState(false);
  const [autoRedrawDialogOpen, setAutoRedrawDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationErrorMessage, setGenerationErrorMessage] = useState<string | null>(null);
  const [projectName, setProjectName] = useState(config.files.defaultProjectName);
  const [projectFilePath, setProjectFilePath] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [fileStatusMessage, setFileStatusMessage] = useState("Not saved");
  const [recoveryAutosave, setRecoveryAutosave] = useState<ProjectAutosaveInfo | null>(null);
  const [canvasZoom, setCanvasZoom] = useState(() => readCanvasZoomPreference(config));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canvasSelection, setCanvasSelection] = useState<CanvasSelection | null>(null);
  const [movablePastedStrokeId, setMovablePastedStrokeId] = useState<string | null>(null);
  const initialDocumentSignatureRef = useRef<string | null>(null);
  const lastSavedDocumentSignatureRef = useRef<string | null>(null);
  const lastAutosavedDocumentSignatureRef = useRef<string | null>(null);
  const lastAutoRedrawCanvasSignatureRef = useRef<string | null>(null);
  const shellStyle = {
    "--top-bar-height": `${config.layout.topBarHeight}px`,
    "--status-bar-height": `${config.layout.statusBarHeight}px`,
    "--tool-rail-width": `${config.layout.toolRailWidth}px`,
    "--side-panel-width": `${config.layout.sidePanelWidth}px`,
    "--workspace-padding": `${config.layout.workspacePadding}px`
  } as CSSProperties;
  const selectTool = useCallback((tool: DrawingToolId) => {
    if (tool !== "selection") {
      setMovablePastedStrokeId(null);
    }

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
  const openImageStyleDialog = useCallback(() => {
    setImageStyleDialogOpen(true);
  }, []);
  const openAutoRedrawDialog = useCallback(() => {
    setAutoRedrawDialogOpen(true);
  }, []);
  const generateRealisticImage = useCallback(async () => {
    setIsGenerating(true);
    setGenerationErrorMessage(null);

    try {
      const canvasDataUrl = exportDocumentCanvasToPngDataUrl(document, config);
      const result = await window.trueDrawing.generateRealisticImage({
        canvasDataUrl,
        model: imageGenerationModel,
        prompt: buildRealisticImagePrompt(document, {
          imageStyle: imageGenerationStyle
        })
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
    imageGenerationStyle,
    setRealisticImage
  ]);

  const createProject = useCallback((savedAt?: string, nameOverride?: string): DrawingProjectFile => (
    createDrawingProjectFile(document, {
      appVersion: runtime.appVersion,
      name: nameOverride ?? projectName,
      fallbackName: config.files.defaultProjectName,
      savedAt
    })
  ), [
    config.files.defaultProjectName,
    document,
    projectName,
    runtime.appVersion
  ]);

  const createSaveRequest = useCallback((
    filePath: string | null,
    nameOverride?: string
  ): ProjectSaveRequest => ({
    project: createProject(undefined, nameOverride),
    filePath,
    canvasDataUrl: exportDocumentCanvasToPngDataUrl(document, config),
    imageDataUrl: document.realisticImage?.dataUrl ?? null
  }), [config, createProject, document]);

  const ensureNamedProject = useCallback((): string | null => {
    const normalizedName = normalizeProjectName(projectName, config.files.defaultProjectName);

    if (projectFilePath || normalizedName !== config.files.defaultProjectName) {
      setProjectName(normalizedName);
      return normalizedName;
    }

    const enteredName = window.prompt("Nome disegno", normalizedName);

    if (enteredName === null) {
      return null;
    }

    const nextName = normalizeProjectName(enteredName, config.files.defaultProjectName);

    setProjectName(nextName);
    return nextName;
  }, [
    config.files.defaultProjectName,
    projectFilePath,
    projectName
  ]);

  const saveProject = useCallback(async (forceSaveAs: boolean) => {
    const nextName = ensureNamedProject();

    if (!nextName) {
      return;
    }

    try {
      setFileStatusMessage("Saving...");
      const request = createSaveRequest(forceSaveAs ? null : projectFilePath, nextName);
      const result = forceSaveAs
        ? await window.trueDrawing.saveProjectAs(request)
        : await window.trueDrawing.saveProject(request);

      if (result.canceled) {
        setFileStatusMessage("Save canceled");
        return;
      }

      setProjectName(result.name);
      setProjectFilePath(result.filePath);
      setLastSavedAt(result.savedAt);
      lastSavedDocumentSignatureRef.current = JSON.stringify(document);
      lastAutosavedDocumentSignatureRef.current = JSON.stringify(document);
      setIsDirty(false);
      setFileStatusMessage(`Saved ${formatTime(result.savedAt)}`);
    } catch (error: unknown) {
      setFileStatusMessage(error instanceof Error ? error.message : "Save failed");
    }
  }, [
    createSaveRequest,
    document,
    ensureNamedProject,
    projectFilePath
  ]);

  const openProject = useCallback(async () => {
    if (isDirty && !window.confirm("Il disegno corrente contiene modifiche non salvate. Aprire un altro progetto?")) {
      return;
    }

    try {
      setFileStatusMessage("Opening...");
      const result = await window.trueDrawing.openProject();

      if (result.canceled || !result.project) {
        setFileStatusMessage("Open canceled");
        return;
      }

      replaceLoadedProject(result.project, result.filePath);
      setFileStatusMessage(`Opened ${result.project.name}`);
    } catch (error: unknown) {
      setFileStatusMessage(error instanceof Error ? error.message : "Open failed");
    }
  }, [isDirty]);

  const createNewProject = useCallback(() => {
    if (isDirty && !window.confirm("Il disegno corrente contiene modifiche non salvate. Creare un nuovo progetto?")) {
      return;
    }

    const nextDocument = createInitialDrawingDocument({
      id: crypto.randomUUID(),
      name: config.layers.defaultLayerName,
      opacity: config.layers.defaultOpacity
    });
    const signature = JSON.stringify(nextDocument);

    replaceDocument(nextDocument);
    setCanvasSelection(null);
    setMovablePastedStrokeId(null);
    setProjectName(config.files.defaultProjectName);
    setProjectFilePath(null);
    setLastSavedAt(null);
    setIsDirty(false);
    setFileStatusMessage("New project");
    initialDocumentSignatureRef.current = signature;
    lastSavedDocumentSignatureRef.current = signature;
    lastAutosavedDocumentSignatureRef.current = signature;
    lastAutoRedrawCanvasSignatureRef.current = null;
  }, [
    config.files.defaultProjectName,
    config.layers.defaultLayerName,
    config.layers.defaultOpacity,
    isDirty,
    replaceDocument
  ]);

  const confirmDeleteLayer = useCallback((layerId: string) => {
    const layer = document.layers.find((documentLayer) => documentLayer.id === layerId);

    if (!layer) {
      return;
    }

    if (!window.confirm(`Delete layer "${layer.name}"?`)) {
      setFileStatusMessage("Layer delete canceled");
      return;
    }

    deleteLayer(layerId);
    setFileStatusMessage(`Deleted ${layer.name}`);
  }, [
    deleteLayer,
    document.layers
  ]);

  const exportProjectTarget = useCallback(async (
    target: ProjectExportTarget,
    format: ProjectExportFormat
  ) => {
    try {
      const dataUrl = target === "canvas"
        ? exportDocumentCanvasToDataUrl(
          document,
          config,
          format === "webp" ? "image/webp" : "image/png"
        )
        : await exportRealisticImage(document.realisticImage?.dataUrl ?? null, format);

      if (!dataUrl) {
        setFileStatusMessage("No realistic image to export");
        return;
      }

      const result = await window.trueDrawing.exportProjectImage({
        name: normalizeProjectName(projectName, config.files.defaultProjectName),
        target,
        format,
        dataUrl
      });

      setFileStatusMessage(result.canceled ? "Export canceled" : "Export completed");
    } catch (error: unknown) {
      setFileStatusMessage(error instanceof Error ? error.message : "Export failed");
    }
  }, [
    config,
    document,
    projectName
  ]);

  const handleFileCommand = useCallback((command: string) => {
    if (command === "new") {
      createNewProject();
      return;
    }

    if (command === "open") {
      void openProject();
      return;
    }

    if (command === "save") {
      void saveProject(false);
      return;
    }

    if (command === "save-as") {
      void saveProject(true);
      return;
    }

    if (command === "export-canvas-png") {
      void exportProjectTarget("canvas", "png");
      return;
    }

    if (command === "export-canvas-webp") {
      void exportProjectTarget("canvas", "webp");
      return;
    }

    if (command === "export-image-png") {
      void exportProjectTarget("image", "png");
      return;
    }

    if (command === "export-image-webp") {
      void exportProjectTarget("image", "webp");
    }
  }, [
    createNewProject,
    exportProjectTarget,
    openProject,
    saveProject
  ]);

  const changeCanvasZoom = useCallback((direction: "in" | "out" | "reset") => {
    setCanvasZoom((currentZoom) => {
      if (direction === "reset") {
        return 1;
      }

      const factor = direction === "in" ? 1.15 : 1 / 1.15;

      return clampCanvasZoom(currentZoom * factor, config.canvas.minZoom, config.canvas.maxZoom);
    });
  }, [
    config.canvas.maxZoom,
    config.canvas.minZoom
  ]);

  const beginNewCanvasSelection = useCallback(() => {
    setMovablePastedStrokeId(null);
  }, []);

  const moveSelectedCanvasObject = useCallback((selection: CanvasSelection) => {
    if (!movablePastedStrokeId) {
      return;
    }

    updateStroke(movablePastedStrokeId, (stroke) => (
      stroke.tool === "image" ? updateStrokeBounds(stroke, selection) : stroke
    ));
  }, [
    movablePastedStrokeId,
    updateStroke
  ]);

  const handleEditCommand = useCallback((command: string) => {
    void handleEditableCommand(command).then((handled) => {
      if (handled) {
        return;
      }

      if (command === "undo") {
        setMovablePastedStrokeId(null);
        undo();
        return;
      }

      if (command === "redo") {
        setMovablePastedStrokeId(null);
        redo();
        return;
      }

      if (command === "copy" || command === "cut") {
        void copyCanvasSelectionToClipboard(
          document,
          config,
          canvasSelection,
          setFileStatusMessage
        ).then((copied) => {
          if (copied && command === "cut" && canvasSelection) {
            setMovablePastedStrokeId(null);
            appendStroke(createClearRectStroke(canvasSelection, toolSettings));
            setCanvasSelection(null);
          }
        });
        return;
      }

      if (command === "paste") {
        void pasteClipboardImageToCanvas(
          canvasSelection,
          config,
          toolSettings,
          appendStroke,
          setCanvasSelection,
          setFileStatusMessage
        ).then((pastedImage) => {
          if (!pastedImage) {
            return;
          }

          setMovablePastedStrokeId(pastedImage.strokeId);
          selectTool("selection");
        });
        return;
      }

      if (command === "crop") {
        cropCanvasToSelection(
          canvasSelection,
          config,
          toolSettings,
          commitDocumentUpdate,
          setCanvasSelection,
          setMovablePastedStrokeId,
          setFileStatusMessage
        );
      }
    });
  }, [
    appendStroke,
    canvasSelection,
    commitDocumentUpdate,
    config,
    document,
    redo,
    selectTool,
    toolSettings,
    undo
  ]);

  const handleViewCommand = useCallback((command: string) => {
    if (command === "canvas-zoom-in") {
      changeCanvasZoom("in");
      return;
    }

    if (command === "canvas-zoom-out") {
      changeCanvasZoom("out");
      return;
    }

    if (command === "canvas-zoom-reset") {
      changeCanvasZoom("reset");
    }
  }, [changeCanvasZoom]);

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
        setImageGenerationStyle(preferences.style);
        setAutoRedrawEnabled(preferences.autoRedrawEnabled);
        setAutoRedrawDelaySeconds(preferences.autoRedrawDelaySeconds);
      }
    }).catch(() => {
      if (isMounted) {
        setImageGenerationModel(config.imageGeneration.defaultModel);
        setImageGenerationStyle(config.imageGeneration.defaultStyle);
        setAutoRedrawEnabled(config.imageGeneration.autoRedrawDefaultEnabled);
        setAutoRedrawDelaySeconds(config.imageGeneration.autoRedrawDefaultDelaySeconds);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [
    config.imageGeneration.autoRedrawDefaultDelaySeconds,
    config.imageGeneration.autoRedrawDefaultEnabled,
    config.imageGeneration.defaultModel,
    config.imageGeneration.defaultStyle
  ]);

  const updateApiKeyStatus = useCallback((configured: boolean, backend: string) => {
    setApiKeyConfigured(configured);
    setApiKeyBackend(backend);
  }, []);

  useEffect(() => window.trueDrawing.onOpenApiKeySettings(openApiKeyDialog), [openApiKeyDialog]);

  useEffect(() => (
    window.trueDrawing.onOpenImageStyleSettings(openImageStyleDialog)
  ), [openImageStyleDialog]);

  useEffect(() => (
    window.trueDrawing.onOpenAutoRedrawSettings(openAutoRedrawDialog)
  ), [openAutoRedrawDialog]);

  useEffect(() => window.trueDrawing.onFileCommand(handleFileCommand), [handleFileCommand]);

  useEffect(() => window.trueDrawing.onEditCommand(handleEditCommand), [handleEditCommand]);

  useEffect(() => window.trueDrawing.onViewCommand(handleViewCommand), [handleViewCommand]);

  useEffect(() => {
    const syncFullscreenState = () => {
      window.trueDrawing.isWindowFullscreen().then(setIsFullscreen).catch(() => {
        setIsFullscreen(false);
      });
    };

    syncFullscreenState();
    window.addEventListener("resize", syncFullscreenState);

    return () => {
      window.removeEventListener("resize", syncFullscreenState);
    };
  }, []);

  useEffect(() => {
    window.trueDrawing.listAutosaves().then((autosaves) => {
      if (autosaves.length > 0) {
        setRecoveryAutosave(autosaves[0]);
      }
    }).catch(() => {
      setRecoveryAutosave(null);
    });
  }, []);

  useEffect(() => {
    writeCanvasZoomPreference(config, canvasZoom);
  }, [
    canvasZoom,
    config
  ]);

  useEffect(() => {
    if (!isTransientStatusMessage(fileStatusMessage)) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setFileStatusMessage(isDirty ? "Unsaved changes" : formatDocumentStatus("Not saved", lastSavedAt));
    }, config.ui.statusMessageDurationMs);

    return () => window.clearTimeout(timeoutId);
  }, [
    config.ui.statusMessageDurationMs,
    fileStatusMessage,
    isDirty,
    lastSavedAt
  ]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  useEffect(() => {
    const signature = JSON.stringify(document);

    if (initialDocumentSignatureRef.current === null) {
      initialDocumentSignatureRef.current = signature;
      lastSavedDocumentSignatureRef.current = signature;
      lastAutosavedDocumentSignatureRef.current = signature;
      return;
    }

    setIsDirty(signature !== lastSavedDocumentSignatureRef.current);
  }, [document]);

  useEffect(() => {
    if (config.app.autosaveIntervalMs <= 0) {
      return undefined;
    }

    const autosave = async () => {
      const signature = JSON.stringify(document);

      if (signature === lastAutosavedDocumentSignatureRef.current) {
        return;
      }

      try {
        const result = await window.trueDrawing.autosaveProject({
          project: createProject(),
          canvasDataUrl: exportDocumentCanvasToPngDataUrl(document, config),
          imageDataUrl: document.realisticImage?.dataUrl ?? null
        });

        lastAutosavedDocumentSignatureRef.current = signature;
        setFileStatusMessage(`Autosaved ${formatTime(result.savedAt)}`);
      } catch {
        setFileStatusMessage("Autosave failed");
      }
    };

    const intervalId = window.setInterval(() => {
      void autosave();
    }, config.app.autosaveIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [
    config,
    createProject,
    document
  ]);

  useEffect(() => {
    if (!autoRedrawEnabled || !apiKeyConfigured || isGenerating) {
      return undefined;
    }

    const canvasSignature = createCanvasGenerationSignature(document);

    if (canvasSignature === lastAutoRedrawCanvasSignatureRef.current) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      lastAutoRedrawCanvasSignatureRef.current = canvasSignature;
      setFileStatusMessage("Auto redraw started");
      void generateRealisticImage();
    }, autoRedrawDelaySeconds * 1000);

    return () => window.clearTimeout(timeoutId);
  }, [
    apiKeyConfigured,
    autoRedrawDelaySeconds,
    autoRedrawEnabled,
    document,
    generateRealisticImage,
    isGenerating
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableElement(window.document.activeElement)) {
        return;
      }

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
        return;
      }

      if (key === "x" && event.shiftKey) {
        event.preventDefault();
        handleEditCommand("crop");
        return;
      }

      if (key === "x") {
        event.preventDefault();
        handleEditCommand("cut");
        return;
      }

      if (key === "c") {
        event.preventDefault();
        handleEditCommand("copy");
        return;
      }

      if (key === "v") {
        event.preventDefault();
        handleEditCommand("paste");
        return;
      }

      if (key === "=" || key === "+") {
        event.preventDefault();
        changeCanvasZoom("in");
        return;
      }

      if (key === "-") {
        event.preventDefault();
        changeCanvasZoom("out");
        return;
      }

      if (key === "0") {
        event.preventDefault();
        changeCanvasZoom("reset");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    changeCanvasZoom,
    handleEditCommand,
    redo,
    undo
  ]);

  const totalStrokeCount = countDocumentStrokes(document);
  const visibleLayerCount = document.layers.filter((layer) => layer.visible).length;
  const activeToolLabel = formatToolLabel(toolSettings.tool);
  const activeLayerName = activeLayer?.name ?? "No active layer";

  return (
    <div className="app-shell" style={shellStyle}>
      <header className="top-bar">
        <div className="brand-lockup">
          <strong>{config.app.name}</strong>
          <span>{runtime.appVersion}</span>
        </div>
        <div className="document-meta">
          <input
            aria-label="Project name"
            className="project-name-input"
            value={projectName}
            onChange={(event) => {
              setProjectName(event.target.value);
              setIsDirty(true);
            }}
          />
          <span>{isDirty ? "Unsaved changes" : formatDocumentStatus(fileStatusMessage, lastSavedAt)}</span>
        </div>
        {isFullscreen && (
          <button
            className="fullscreen-exit-button"
            type="button"
            onClick={() => {
              void window.trueDrawing.setWindowFullscreen(false).then(() => {
                setIsFullscreen(false);
              });
            }}
          >
            Exit fullscreen
          </button>
        )}
        <SettingsSummary
          config={config}
          imageGenerationModel={imageGenerationModel}
          imageGenerationStyle={imageGenerationStyle}
        />
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
          selection={canvasSelection}
          movableSelection={movablePastedStrokeId !== null}
          onSelectionChange={setCanvasSelection}
          onBeginNewSelection={beginNewCanvasSelection}
          onMoveSelectedObject={moveSelectedCanvasObject}
          zoom={canvasZoom}
          onZoomIn={() => changeCanvasZoom("in")}
          onZoomOut={() => changeCanvasZoom("out")}
          onZoomReset={() => changeCanvasZoom("reset")}
          onWheelZoom={(delta) => {
            setCanvasZoom((currentZoom) => (
              clampCanvasZoom(currentZoom * delta, config.canvas.minZoom, config.canvas.maxZoom)
            ));
          }}
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
          imageGenerationStyle={imageGenerationStyle}
          autoRedrawEnabled={autoRedrawEnabled}
          autoRedrawDelaySeconds={autoRedrawDelaySeconds}
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
          onDeleteLayer={confirmDeleteLayer}
          onSelectLayer={selectLayer}
          onSetLayerVisibility={setLayerVisibility}
          onSetLayerOpacity={setLayerOpacity}
          onMoveLayer={moveLayer}
        />
      </aside>
      <footer className="status-bar" aria-live="polite">
        <span>{formatWorkspaceStatus(fileStatusMessage, isDirty, lastSavedAt)}</span>
        <span>{isDirty ? "Modified" : "Saved state clean"}</span>
        <span>{activeToolLabel}</span>
        <span>{activeLayerName}</span>
        <span>{visibleLayerCount}/{document.layers.length} layers visible</span>
        <span>{totalStrokeCount} strokes</span>
        <span>{Math.round(canvasZoom * 100)}%</span>
      </footer>
      <ApiKeyDialog
        config={config}
        open={apiKeyDialogOpen}
        imageGenerationModel={imageGenerationModel}
        apiKeyBackend={apiKeyBackend}
        onClose={() => setApiKeyDialogOpen(false)}
        onStatusChange={updateApiKeyStatus}
        onModelChange={setImageGenerationModel}
      />
      <ImageStyleDialog
        config={config}
        open={imageStyleDialogOpen}
        imageGenerationStyle={imageGenerationStyle}
        onClose={() => setImageStyleDialogOpen(false)}
        onStyleChange={setImageGenerationStyle}
      />
      <AutoRedrawDialog
        config={config}
        open={autoRedrawDialogOpen}
        enabled={autoRedrawEnabled}
        delaySeconds={autoRedrawDelaySeconds}
        onClose={() => setAutoRedrawDialogOpen(false)}
        onPreferencesChange={(enabled, delaySeconds) => {
          setAutoRedrawEnabled(enabled);
          setAutoRedrawDelaySeconds(delaySeconds);
          lastAutoRedrawCanvasSignatureRef.current = null;
        }}
      />
      {recoveryAutosave && (
        <RecoveryDialog
          autosave={recoveryAutosave}
          onRestore={async () => {
            try {
              const result = await window.trueDrawing.loadAutosave(recoveryAutosave.id);

              if (result.project) {
                replaceLoadedProject(result.project, null);
                setFileStatusMessage(`Recovered ${result.project.name}`);
              }
            } catch (error: unknown) {
              setFileStatusMessage(error instanceof Error ? error.message : "Recovery failed");
            } finally {
              setRecoveryAutosave(null);
            }
          }}
          onDiscard={async () => {
            if (!window.confirm("Discard this autosave?")) {
              return;
            }

            try {
              await window.trueDrawing.clearAutosave(recoveryAutosave.id);
            } catch {
              setFileStatusMessage("Unable to clear autosave");
            } finally {
              setRecoveryAutosave(null);
            }
          }}
        />
      )}
    </div>
  );

  function replaceLoadedProject(project: DrawingProjectFile, filePath: string | null): void {
    const signature = JSON.stringify(project.document);

    replaceDocument(project.document);
    setCanvasSelection(null);
    setMovablePastedStrokeId(null);
    setProjectName(project.name);
    setProjectFilePath(filePath);
    setLastSavedAt(project.savedAt);
    setIsDirty(false);
    initialDocumentSignatureRef.current = signature;
    lastSavedDocumentSignatureRef.current = signature;
    lastAutosavedDocumentSignatureRef.current = signature;
    lastAutoRedrawCanvasSignatureRef.current = null;
  }
}

type RecoveryDialogProps = {
  autosave: ProjectAutosaveInfo;
  onRestore: () => Promise<void>;
  onDiscard: () => Promise<void>;
};

function RecoveryDialog({ autosave, onRestore, onDiscard }: RecoveryDialogProps): JSX.Element {
  return (
    <div className="modal-backdrop">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="recovery-title">
        <div className="modal-header">
          <span id="recovery-title">Autosave recovery</span>
        </div>
        <div className="modal-body">
          <p className="form-message">
            {autosave.name} - {formatTime(autosave.savedAt)}
          </p>
        </div>
        <div className="modal-actions">
          <button className="text-button" type="button" onClick={() => void onDiscard()}>
            Ignore
          </button>
          <button className="text-button text-button--primary" type="button" onClick={() => void onRestore()}>
            Restore
          </button>
        </div>
      </section>
    </div>
  );
}

async function exportRealisticImage(
  dataUrl: string | null,
  format: ProjectExportFormat
): Promise<string | null> {
  if (!dataUrl) {
    return null;
  }

  return format === "webp"
    ? convertImageDataUrl(dataUrl, "image/webp")
    : convertImageDataUrl(dataUrl, "image/png");
}

function formatTime(value: string | null): string {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDocumentStatus(message: string, lastSavedAt: string | null): string {
  if (lastSavedAt && message === "Not saved") {
    return `Saved ${formatTime(lastSavedAt)}`;
  }

  return message;
}

function formatWorkspaceStatus(message: string, isDirty: boolean, lastSavedAt: string | null): string {
  if (isDirty && (message === "Not saved" || message.startsWith("Saved "))) {
    return "Unsaved changes";
  }

  return formatDocumentStatus(message, lastSavedAt);
}

function isTransientStatusMessage(message: string): boolean {
  return message === "Save canceled"
    || message === "Open canceled"
    || message === "Export canceled"
    || message === "Export completed"
    || message === "Selection copied"
    || message === "Image pasted"
    || message === "Layer delete canceled"
    || message === "Crop canceled"
    || message === "Canvas cropped"
    || message === "Selection already fills canvas"
    || message === "Auto redraw started"
    || message.startsWith("Deleted ");
}

function clampCanvasZoom(value: number, minZoom: number, maxZoom: number): number {
  return Math.min(maxZoom, Math.max(minZoom, value));
}

function countDocumentStrokes(document: DrawingProjectFile["document"]): number {
  return document.layers.reduce((count, layer) => count + layer.strokes.length, 0);
}

function createCanvasGenerationSignature(document: DrawingProjectFile["document"]): string {
  return JSON.stringify({
    activeLayerId: document.activeLayerId,
    layers: document.layers
  });
}

function formatToolLabel(tool: DrawingToolId): string {
  if (tool === "straight-line") {
    return "Straight line";
  }

  if (tool === "curved-line") {
    return "Curved line";
  }

  if (tool === "clear-rect") {
    return "Clear selection";
  }

  return tool.split("-").map((part) => (
    `${part.charAt(0).toUpperCase()}${part.slice(1)}`
  )).join(" ");
}

type UiPreferences = {
  canvasZoom?: number;
};

function readCanvasZoomPreference(config: AppConfig): number {
  try {
    const storedPreferences = JSON.parse(
      window.localStorage.getItem(config.ui.preferencesStorageKey) ?? "{}"
    ) as UiPreferences;

    if (typeof storedPreferences.canvasZoom !== "number") {
      return 1;
    }

    return clampCanvasZoom(storedPreferences.canvasZoom, config.canvas.minZoom, config.canvas.maxZoom);
  } catch {
    return 1;
  }
}

function writeCanvasZoomPreference(config: AppConfig, canvasZoom: number): void {
  try {
    const storedPreferences = JSON.parse(
      window.localStorage.getItem(config.ui.preferencesStorageKey) ?? "{}"
    ) as UiPreferences;
    const nextPreferences: UiPreferences = {
      ...storedPreferences,
      canvasZoom: clampCanvasZoom(canvasZoom, config.canvas.minZoom, config.canvas.maxZoom)
    };

    window.localStorage.setItem(config.ui.preferencesStorageKey, JSON.stringify(nextPreferences));
  } catch {
    // UI preferences are intentionally best-effort.
  }
}

async function handleEditableCommand(command: string): Promise<boolean> {
  const activeElement = window.document.activeElement;

  if (!isEditableElement(activeElement)) {
    return false;
  }

  if (command === "undo" || command === "redo") {
    window.document.execCommand(command);
    return true;
  }

  if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
    await handleTextInputClipboardCommand(activeElement, command);
    return true;
  }

  if (command === "cut" || command === "copy" || command === "paste") {
    window.document.execCommand(command);
    return true;
  }

  return false;
}

function isEditableElement(element: Element | null): element is HTMLElement {
  return element instanceof HTMLInputElement
    || element instanceof HTMLTextAreaElement
    || element instanceof HTMLSelectElement
    || (element instanceof HTMLElement && element.isContentEditable);
}

async function handleTextInputClipboardCommand(
  element: HTMLInputElement | HTMLTextAreaElement,
  command: string
): Promise<void> {
  const selectionStart = element.selectionStart ?? 0;
  const selectionEnd = element.selectionEnd ?? selectionStart;
  const selectedText = element.value.slice(selectionStart, selectionEnd);

  if (command === "copy") {
    await window.trueDrawing.writeClipboardText(selectedText);
    return;
  }

  if (command === "cut") {
    await window.trueDrawing.writeClipboardText(selectedText);
    replaceInputSelection(element, "");
    return;
  }

  if (command === "paste") {
    replaceInputSelection(element, await window.trueDrawing.readClipboardText());
  }
}

function replaceInputSelection(
  element: HTMLInputElement | HTMLTextAreaElement,
  replacement: string
): void {
  const selectionStart = element.selectionStart ?? element.value.length;
  const selectionEnd = element.selectionEnd ?? selectionStart;
  const nextValue = `${element.value.slice(0, selectionStart)}${replacement}${element.value.slice(selectionEnd)}`;
  const nextCursorPosition = selectionStart + replacement.length;
  const valueSetter = Object.getOwnPropertyDescriptor(element.constructor.prototype, "value")?.set;

  if (valueSetter) {
    valueSetter.call(element, nextValue);
  } else {
    element.value = nextValue;
  }
  element.setSelectionRange(nextCursorPosition, nextCursorPosition);
  element.dispatchEvent(new Event("input", { bubbles: true }));
}

async function copyCanvasSelectionToClipboard(
  document: DrawingProjectFile["document"],
  config: AppConfig,
  selection: CanvasSelection | null,
  setStatus: (message: string) => void
): Promise<boolean> {
  if (!selection || selection.width <= 0 || selection.height <= 0) {
    setStatus("No canvas selection");
    return false;
  }

  try {
    await window.trueDrawing.writeClipboardImage(
      exportDocumentSelectionToPngDataUrl(document, config, selection)
    );
    setStatus("Selection copied");
    return true;
  } catch (error: unknown) {
    setStatus(error instanceof Error ? error.message : "Copy failed");
    return false;
  }
}

async function pasteClipboardImageToCanvas(
  selection: CanvasSelection | null,
  config: AppConfig,
  toolSettings: DrawingToolSettings,
  appendStroke: (stroke: DrawingStroke) => void,
  setSelection: (selection: CanvasSelection | null) => void,
  setStatus: (message: string) => void
): Promise<PastedCanvasImage | null> {
  try {
    const dataUrl = await window.trueDrawing.readClipboardImage();

    if (!dataUrl) {
      setStatus("Clipboard has no image");
      return null;
    }

    const imageSize = await preloadCanvasImage(dataUrl);
    const bounds = selection && selection.width > 0 && selection.height > 0
      ? normalizeCanvasSelection(selection)
      : centeredImageBounds(imageSize, config);
    const stroke = createImageStroke(bounds, dataUrl, toolSettings);

    appendStroke(stroke);
    setSelection(bounds);
    setStatus("Image pasted");
    return {
      bounds,
      strokeId: stroke.id
    };
  } catch (error: unknown) {
    setStatus(error instanceof Error ? error.message : "Paste failed");
    return null;
  }
}

function cropCanvasToSelection(
  selection: CanvasSelection | null,
  config: AppConfig,
  toolSettings: DrawingToolSettings,
  commitDocumentUpdate: (
    updater: (document: DrawingProjectFile["document"]) => DrawingProjectFile["document"]
  ) => void,
  setSelection: (selection: CanvasSelection | null) => void,
  setMovablePastedStrokeId: (strokeId: string | null) => void,
  setStatus: (message: string) => void
): void {
  const cropBounds = selection
    ? clampSelectionToCanvasBounds(selection, config.canvas.defaultWidth, config.canvas.defaultHeight)
    : null;

  if (!cropBounds) {
    setStatus("No canvas selection");
    return;
  }

  if (!window.confirm("Crop canvas to the current selection?")) {
    setStatus("Crop canceled");
    return;
  }

  const cropRectangles = createCropClearRectangles(
    cropBounds,
    config.canvas.defaultWidth,
    config.canvas.defaultHeight
  );

  if (cropRectangles.length === 0) {
    setStatus("Selection already fills canvas");
    return;
  }

  commitDocumentUpdate((currentDocument) => ({
    ...currentDocument,
    layers: currentDocument.layers.map((layer) => ({
      ...layer,
      strokes: [
        ...layer.strokes,
        ...cropRectangles.map((rectangle) => createClearRectStroke(rectangle, toolSettings))
      ]
    }))
  }));
  setSelection(null);
  setMovablePastedStrokeId(null);
  setStatus("Canvas cropped");
}

function clampSelectionToCanvasBounds(
  selection: CanvasSelection,
  canvasWidth: number,
  canvasHeight: number
): CanvasSelection | null {
  const normalizedSelection = normalizeCanvasSelection(selection);
  const left = Math.min(canvasWidth, Math.max(0, normalizedSelection.x));
  const top = Math.min(canvasHeight, Math.max(0, normalizedSelection.y));
  const right = Math.min(canvasWidth, Math.max(left, normalizedSelection.x + normalizedSelection.width));
  const bottom = Math.min(canvasHeight, Math.max(top, normalizedSelection.y + normalizedSelection.height));
  const width = right - left;
  const height = bottom - top;

  if (width <= 0 || height <= 0) {
    return null;
  }

  return {
    x: left,
    y: top,
    width,
    height
  };
}

function createCropClearRectangles(
  cropBounds: CanvasSelection,
  canvasWidth: number,
  canvasHeight: number
): CanvasSelection[] {
  const right = cropBounds.x + cropBounds.width;
  const bottom = cropBounds.y + cropBounds.height;

  return [
    { x: 0, y: 0, width: canvasWidth, height: cropBounds.y },
    { x: 0, y: bottom, width: canvasWidth, height: canvasHeight - bottom },
    { x: 0, y: cropBounds.y, width: cropBounds.x, height: cropBounds.height },
    { x: right, y: cropBounds.y, width: canvasWidth - right, height: cropBounds.height }
  ].filter((rectangle) => rectangle.width > 0 && rectangle.height > 0);
}

type PastedCanvasImage = {
  bounds: CanvasSelection;
  strokeId: string;
};

function createClearRectStroke(
  selection: CanvasSelection,
  toolSettings: DrawingToolSettings
): DrawingStroke {
  const bounds = normalizeCanvasSelection(selection);
  const timestamp = Date.now();

  return {
    id: crypto.randomUUID(),
    tool: "clear-rect",
    color: toolSettings.color,
    size: toolSettings.size,
    opacity: 1,
    hardness: toolSettings.hardness,
    strokeStyle: toolSettings.strokeStyle,
    points: [
      { x: bounds.x, y: bounds.y, pressure: 1, timestamp },
      { x: bounds.x + bounds.width, y: bounds.y + bounds.height, pressure: 1, timestamp }
    ]
  };
}

function createImageStroke(
  selection: CanvasSelection,
  imageDataUrl: string,
  toolSettings: DrawingToolSettings
): DrawingStroke {
  const bounds = normalizeCanvasSelection(selection);
  const timestamp = Date.now();

  return {
    id: crypto.randomUUID(),
    tool: "image",
    color: toolSettings.color,
    size: toolSettings.size,
    opacity: 1,
    hardness: toolSettings.hardness,
    strokeStyle: toolSettings.strokeStyle,
    points: [
      { x: bounds.x, y: bounds.y, pressure: 1, timestamp },
      { x: bounds.x + bounds.width, y: bounds.y + bounds.height, pressure: 1, timestamp }
    ],
    imageDataUrl
  };
}

function updateStrokeBounds(stroke: DrawingStroke, selection: CanvasSelection): DrawingStroke {
  const bounds = normalizeCanvasSelection(selection);
  const firstPoint = stroke.points[0];
  const lastPoint = stroke.points.at(-1);
  const timestamp = Date.now();

  return {
    ...stroke,
    points: [
      {
        x: bounds.x,
        y: bounds.y,
        pressure: firstPoint?.pressure ?? 1,
        timestamp: firstPoint?.timestamp ?? timestamp
      },
      {
        x: bounds.x + bounds.width,
        y: bounds.y + bounds.height,
        pressure: lastPoint?.pressure ?? 1,
        timestamp
      }
    ]
  };
}

function centeredImageBounds(
  imageSize: { width: number; height: number },
  config: AppConfig
): CanvasSelection {
  const maxWidth = config.canvas.defaultWidth * 0.5;
  const maxHeight = config.canvas.defaultHeight * 0.5;
  const scale = Math.min(1, maxWidth / imageSize.width, maxHeight / imageSize.height);
  const width = Math.max(1, imageSize.width * scale);
  const height = Math.max(1, imageSize.height * scale);

  return {
    x: (config.canvas.defaultWidth - width) / 2,
    y: (config.canvas.defaultHeight - height) / 2,
    width,
    height
  };
}
