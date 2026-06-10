import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  Brush,
  Circle,
  Eraser,
  Highlighter,
  Minus,
  PaintBucket,
  Pencil,
  Pentagon,
  Redo2,
  Slash,
  Spline,
  Square,
  SquareDashedMousePointer,
  Triangle,
  Undo2,
  type LucideProps
} from "lucide-react";

import type { EffectiveLocale } from "../app/uiPreferences";
import { t } from "../i18n/appI18n";
import type { AppConfig } from "../../shared/config/appConfigSchema";
import type {
  DrawingToolId,
  DrawingToolSettings,
  StrokeStyleId,
  StrokeToolId
} from "../../shared/drawing/toolTypes";

type ToolPanelProps = {
  config: AppConfig;
  locale: EffectiveLocale;
  settings: DrawingToolSettings;
  canUndo: boolean;
  canRedo: boolean;
  onSelectTool: (tool: DrawingToolId) => void;
  onChangeSettings: (settings: Partial<DrawingToolSettings>) => void;
  onUndo: () => void;
  onRedo: () => void;
};

type IconComponent = ComponentType<LucideProps>;
type MenuOption<T extends string> = {
  id: T;
  label: string;
  Icon: IconComponent;
};

const iconSize = 18;
function DashedStrokeIcon({ size = iconSize }: LucideProps): JSX.Element {
  return (
    <span
      className="stroke-style-icon stroke-style-icon--dashed"
      aria-hidden="true"
      style={{ width: size, height: size }}
    >
      <span />
      <span />
      <span />
    </span>
  );
}

function DottedStrokeIcon({ size = iconSize }: LucideProps): JSX.Element {
  return (
    <span
      className="stroke-style-icon stroke-style-icon--dotted"
      aria-hidden="true"
      style={{ width: size, height: size }}
    >
      <span />
      <span />
      <span />
    </span>
  );
}

export function ToolPanel({
  config,
  locale,
  settings,
  canUndo,
  canRedo,
  onSelectTool,
  onChangeSettings,
  onUndo,
  onRedo
}: ToolPanelProps): JSX.Element {
  const strokeToolOptions: MenuOption<StrokeToolId>[] = [
    { id: "pencil", label: "Pencil", Icon: Pencil },
    { id: "marker", label: t(locale, "marker"), Icon: Highlighter },
    { id: "brush", label: t(locale, "brush"), Icon: Brush },
    { id: "eraser", label: "Eraser", Icon: Eraser }
  ];
  const lineToolOptions: MenuOption<DrawingToolId>[] = [
    { id: "straight-line", label: t(locale, "straightLine"), Icon: Slash },
    { id: "curved-line", label: t(locale, "curvedLine"), Icon: Spline }
  ];
  const shapeToolOptions: MenuOption<DrawingToolId>[] = [
    { id: "rectangle", label: "Rectangle", Icon: Square },
    { id: "ellipse", label: "Ellipse", Icon: Circle },
    { id: "triangle", label: "Triangle", Icon: Triangle },
    { id: "polygon", label: "Polygon", Icon: Pentagon }
  ];
  const strokeStyleOptions: MenuOption<StrokeStyleId>[] = [
    { id: "solid", label: "Solid stroke", Icon: Minus },
    { id: "dashed", label: "Dashed stroke", Icon: DashedStrokeIcon },
    { id: "dotted", label: "Dotted stroke", Icon: DottedStrokeIcon }
  ];
  const [lastStrokeTool, setLastStrokeTool] = useState<StrokeToolId>("pencil");
  const [lastLineTool, setLastLineTool] = useState<DrawingToolId>("straight-line");
  const [lastShapeTool, setLastShapeTool] = useState<DrawingToolId>("rectangle");
  const selectedStrokeTool = selectedOption(
    strokeToolOptions,
    strokeToolOptions.some((option) => option.id === settings.tool) ? settings.tool : lastStrokeTool,
    strokeToolOptions[0]
  );
  const selectedLineTool = selectedOption(
    lineToolOptions,
    lineToolOptions.some((option) => option.id === settings.tool) ? settings.tool : lastLineTool,
    lineToolOptions[0]
  );
  const selectedShapeTool = selectedOption(
    shapeToolOptions,
    shapeToolOptions.some((option) => option.id === settings.tool) ? settings.tool : lastShapeTool,
    shapeToolOptions[0]
  );
  const selectedStrokeStyle = selectedOption(strokeStyleOptions, settings.strokeStyle, strokeStyleOptions[0]);

  return (
    <div className="tool-panel">
      <button
        className={`icon-button${settings.tool === "selection" ? " is-active" : ""}`}
        title={t(locale, "selection")}
        aria-label={t(locale, "selection")}
        aria-pressed={settings.tool === "selection"}
        onClick={() => onSelectTool("selection")}
      >
        <SquareDashedMousePointer size={iconSize} />
      </button>
      <ToolMenu
        label={t(locale, "strokeTools")}
        active={strokeToolOptions.some((option) => option.id === settings.tool)}
        selected={selectedStrokeTool}
        options={strokeToolOptions}
        onSelect={(tool) => {
          setLastStrokeTool(tool);
          onSelectTool(tool);
        }}
      />
      <ToolMenu
        label={t(locale, "lineTools")}
        active={lineToolOptions.some((option) => option.id === settings.tool)}
        selected={selectedLineTool}
        options={lineToolOptions}
        onSelect={(tool) => {
          setLastLineTool(tool);
          onSelectTool(tool);
        }}
      />
      <ToolMenu
        label={t(locale, "shapeTools")}
        active={shapeToolOptions.some((option) => option.id === settings.tool)}
        selected={selectedShapeTool}
        options={shapeToolOptions}
        onSelect={(tool) => {
          setLastShapeTool(tool);
          onSelectTool(tool);
        }}
      />
      <button
        className={`icon-button${settings.tool === "fill" ? " is-active" : ""}`}
        title={t(locale, "fill")}
        aria-label={t(locale, "fill")}
        aria-pressed={settings.tool === "fill"}
        onClick={() => onSelectTool("fill")}
      >
        <PaintBucket size={iconSize} />
      </button>
      <ToolMenu
        label={t(locale, "strokeStyle")}
        active={false}
        selected={selectedStrokeStyle}
        options={strokeStyleOptions}
        onSelect={(strokeStyle) => onChangeSettings({ strokeStyle })}
      />
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
      <div className="tool-separator" />
      <label className="color-control" title={t(locale, "strokeColor")} aria-label={t(locale, "strokeColor")}>
        <input
          type="color"
          value={settings.color}
          disabled={settings.tool === "eraser"}
          onChange={(event) => onChangeSettings({ color: event.currentTarget.value })}
        />
      </label>
      <label className="tool-slider" title={t(locale, "strokeSize")}>
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
      <label className="tool-slider" title={t(locale, "opacity")}>
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
      <div className="tool-readout" aria-label={t(locale, "toolDefaults")}>
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

type ToolMenuProps<T extends string> = {
  label: string;
  active: boolean;
  selected: MenuOption<T>;
  options: MenuOption<T>[];
  onSelect: (id: T) => void;
};

function ToolMenu<T extends string>({
  label,
  active,
  selected,
  options,
  onSelect
}: ToolMenuProps<T>): JSX.Element {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const SelectedIcon = selected.Icon;

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (menuRef.current?.contains(event.target as Node)) {
        return;
      }

      setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", closeOnOutsidePointer);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("pointerdown", closeOnOutsidePointer);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="tool-menu" ref={menuRef}>
      <button
        className={`icon-button tool-menu-trigger${active ? " is-active" : ""}`}
        title={label}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
      >
        <SelectedIcon size={iconSize} />
      </button>
      {open && (
        <div className="tool-popover" role="menu" aria-label={label}>
          {options.map((option) => {
            const OptionIcon = option.Icon;

            return (
              <button
                key={option.id}
                className={`mini-button${option.id === selected.id ? " is-active" : ""}`}
                title={option.label}
                aria-label={option.label}
                role="menuitem"
                onClick={() => {
                  onSelect(option.id);
                  setOpen(false);
                }}
              >
                <OptionIcon size={15} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function selectedOption<T extends string>(
  options: MenuOption<T>[],
  selectedId: string,
  fallback: MenuOption<T>
): MenuOption<T> {
  return options.find((option) => option.id === selectedId) ?? fallback;
}
