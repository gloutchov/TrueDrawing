import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { CanvasStage } from "../canvas/CanvasStage";
import { useStrokeHistory } from "../history/useStrokeHistory";
import { InspectorPanel } from "../inspector/InspectorPanel";
import { LayerPanel } from "../layers/LayerPanel";
import { SettingsSummary } from "../settings/SettingsSummary";
import { ToolPanel } from "../tools/ToolPanel";
import { createInitialToolSettings, settingsForSelectedTool } from "../tools/toolState";
import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { DrawingToolId, DrawingToolSettings } from "../../shared/drawing/toolTypes";
import type { RuntimeInfo } from "../../shared/runtime/runtimeInfo";

type AppShellProps = {
  config: AppConfig;
  runtime: RuntimeInfo;
};

export function AppShell({ config, runtime }: AppShellProps): JSX.Element {
  const {
    strokes,
    canUndo,
    canRedo,
    appendStroke,
    updateStroke,
    undo,
    redo
  } = useStrokeHistory(config.app.historyLimit);
  const [toolSettings, setToolSettings] = useState<DrawingToolSettings>(() => (
    createInitialToolSettings(config)
  ));
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
        <SettingsSummary config={config} />
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
          strokes={strokes}
          toolSettings={toolSettings}
          onAppendStroke={appendStroke}
          onUpdateStroke={updateStroke}
        />
      </main>
      <aside className="right-panel" aria-label="Document panels">
        <InspectorPanel config={config} />
        <LayerPanel config={config} />
      </aside>
    </div>
  );
}
