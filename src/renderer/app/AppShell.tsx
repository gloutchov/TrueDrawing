import { CanvasStage } from "../canvas/CanvasStage";
import { InspectorPanel } from "../inspector/InspectorPanel";
import { LayerPanel } from "../layers/LayerPanel";
import { SettingsSummary } from "../settings/SettingsSummary";
import { ToolPanel } from "../tools/ToolPanel";
import type { CSSProperties } from "react";
import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { RuntimeInfo } from "../../shared/runtime/runtimeInfo";

type AppShellProps = {
  config: AppConfig;
  runtime: RuntimeInfo;
};

export function AppShell({ config, runtime }: AppShellProps): JSX.Element {
  const shellStyle = {
    "--top-bar-height": `${config.layout.topBarHeight}px`,
    "--tool-rail-width": `${config.layout.toolRailWidth}px`,
    "--side-panel-width": `${config.layout.sidePanelWidth}px`,
    "--workspace-padding": `${config.layout.workspacePadding}px`
  } as CSSProperties;

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
        <ToolPanel config={config} />
      </aside>
      <main className="workspace">
        <CanvasStage config={config} />
      </main>
      <aside className="right-panel" aria-label="Document panels">
        <InspectorPanel config={config} />
        <LayerPanel config={config} />
      </aside>
    </div>
  );
}
