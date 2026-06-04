import { Brush, Eraser, Highlighter, Pencil, Redo2, Save, Undo2 } from "lucide-react";

import type { AppConfig } from "../../shared/config/appConfigSchema";

type ToolPanelProps = {
  config: AppConfig;
};

const iconSize = 18;

export function ToolPanel({ config }: ToolPanelProps): JSX.Element {
  return (
    <div className="tool-panel">
      <button className="icon-button is-active" title="Pencil" aria-label="Pencil">
        <Pencil size={iconSize} />
      </button>
      <button className="icon-button" title="Marker" aria-label="Marker">
        <Highlighter size={iconSize} />
      </button>
      <button className="icon-button" title="Brush" aria-label="Brush">
        <Brush size={iconSize} />
      </button>
      <button className="icon-button" title="Eraser" aria-label="Eraser">
        <Eraser size={iconSize} />
      </button>
      <div className="tool-separator" />
      <button className="icon-button" title="Undo" aria-label="Undo">
        <Undo2 size={iconSize} />
      </button>
      <button className="icon-button" title="Redo" aria-label="Redo">
        <Redo2 size={iconSize} />
      </button>
      <button className="icon-button" title="Save" aria-label="Save">
        <Save size={iconSize} />
      </button>
      <div className="tool-readout" aria-label="Tool defaults">
        <span style={{ backgroundColor: config.tools.defaultColor }} />
        <strong>{config.tools.defaultSize}px</strong>
      </div>
    </div>
  );
}

