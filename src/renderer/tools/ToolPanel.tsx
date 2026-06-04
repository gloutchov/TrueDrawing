import {
  Brush,
  Eraser,
  Highlighter,
  Pencil,
  Redo2,
  Save,
  Undo2,
  type LucideIcon
} from "lucide-react";

import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { DrawingToolId, DrawingToolSettings } from "../../shared/drawing/toolTypes";

type ToolPanelProps = {
  config: AppConfig;
  settings: DrawingToolSettings;
  canUndo: boolean;
  canRedo: boolean;
  onSelectTool: (tool: DrawingToolId) => void;
  onChangeSettings: (settings: Partial<DrawingToolSettings>) => void;
  onUndo: () => void;
  onRedo: () => void;
};

const iconSize = 18;
const toolIcons: Record<DrawingToolId, LucideIcon> = {
  pencil: Pencil,
  marker: Highlighter,
  brush: Brush,
  eraser: Eraser
};

export function ToolPanel({
  config,
  settings,
  canUndo,
  canRedo,
  onSelectTool,
  onChangeSettings,
  onUndo,
  onRedo
}: ToolPanelProps): JSX.Element {
  return (
    <div className="tool-panel">
      {config.tools.presets.map((preset) => {
        const Icon = toolIcons[preset.id];

        return (
          <button
            key={preset.id}
            className={`icon-button${settings.tool === preset.id ? " is-active" : ""}`}
            title={preset.label}
            aria-label={preset.label}
            aria-pressed={settings.tool === preset.id}
            onClick={() => onSelectTool(preset.id)}
          >
            <Icon size={iconSize} />
          </button>
        );
      })}
      <div className="tool-separator" />
      <button
        className="icon-button"
        title="Undo"
        aria-label="Undo"
        disabled={!canUndo}
        onClick={onUndo}
      >
        <Undo2 size={iconSize} />
      </button>
      <button
        className="icon-button"
        title="Redo"
        aria-label="Redo"
        disabled={!canRedo}
        onClick={onRedo}
      >
        <Redo2 size={iconSize} />
      </button>
      <button className="icon-button" title="Save planned for M7" aria-label="Save planned" disabled>
        <Save size={iconSize} />
      </button>
      <div className="tool-separator" />
      <label className="color-control" title="Stroke color" aria-label="Stroke color">
        <input
          type="color"
          value={settings.color}
          disabled={settings.tool === "eraser"}
          onChange={(event) => onChangeSettings({ color: event.currentTarget.value })}
        />
      </label>
      <label className="tool-slider" title="Stroke size">
        <span>S</span>
        <input
          type="range"
          min={config.tools.sizeRange.min}
          max={config.tools.sizeRange.max}
          step={config.tools.sizeRange.step}
          value={settings.size}
          onChange={(event) => onChangeSettings({ size: event.currentTarget.valueAsNumber })}
        />
      </label>
      <label className="tool-slider" title="Opacity">
        <span>O</span>
        <input
          type="range"
          min={config.tools.opacityRange.min}
          max={config.tools.opacityRange.max}
          step={config.tools.opacityRange.step}
          value={settings.opacity}
          onChange={(event) => onChangeSettings({ opacity: event.currentTarget.valueAsNumber })}
        />
      </label>
      <label className="tool-slider" title="Hardness">
        <span>H</span>
        <input
          type="range"
          min={config.tools.hardnessRange.min}
          max={config.tools.hardnessRange.max}
          step={config.tools.hardnessRange.step}
          value={settings.hardness}
          onChange={(event) => onChangeSettings({ hardness: event.currentTarget.valueAsNumber })}
        />
      </label>
      <div className="tool-readout" aria-label="Tool defaults">
        <span
          className="tool-preview"
          style={{
            backgroundColor: settings.tool === "eraser" ? "#ffffff" : settings.color,
            borderWidth: `${Math.max(1, Math.round(settings.size / 16))}px`,
            opacity: settings.opacity
          }}
        />
        <strong>{Math.round(settings.size)}px</strong>
        <small>{Math.round(settings.opacity * 100)}%</small>
      </div>
    </div>
  );
}

