import { useCallback, useEffect, useMemo, useRef, type PointerEvent } from "react";

import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { CanvasSelection } from "../../shared/document/selectionTypes";
import { normalizeCanvasSelection } from "../../shared/document/selectionTypes";
import {
  appendPointToStroke,
  createStroke,
  replaceStrokeLastPoint
} from "../../shared/drawing/strokeModel";
import type { DrawingDocument } from "../../shared/document/documentTypes";
import type { DrawingStroke } from "../../shared/drawing/strokeTypes";
import type { DrawingToolSettings } from "../../shared/drawing/toolTypes";
import { pointerEventToCanvasPoint } from "./canvasCoordinates";
import { renderCanvas } from "./canvasRenderer";

type CanvasStageProps = {
  config: AppConfig;
  document: DrawingDocument;
  toolSettings: DrawingToolSettings;
  selection: CanvasSelection | null;
  movableSelection: boolean;
  onSelectionChange: (selection: CanvasSelection | null) => void;
  onBeginNewSelection: () => void;
  onMoveSelectedObject: (selection: CanvasSelection) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onWheelZoom: (delta: number) => void;
  onAppendStroke: (stroke: DrawingStroke) => void;
  onUpdateStroke: (
    strokeId: string,
    updater: (stroke: DrawingStroke) => DrawingStroke
  ) => void;
};

export function CanvasStage({
  config,
  document,
  toolSettings,
  selection,
  movableSelection,
  onSelectionChange,
  onBeginNewSelection,
  onMoveSelectedObject,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onWheelZoom,
  onAppendStroke,
  onUpdateStroke
}: CanvasStageProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const activeStrokeIdRef = useRef<string | null>(null);
  const activeSelectionStartRef = useRef<{ x: number; y: number } | null>(null);
  const activeSelectionMoveRef = useRef<{
    pointerStart: { x: number; y: number };
    selectionStart: CanvasSelection;
  } | null>(null);

  const renderOptions = useMemo(() => ({
    backgroundColor: config.canvas.backgroundColor,
    pressureMinSizeFactor: config.tools.pressureMinSizeFactor,
    pressureMaxSizeFactor: config.tools.pressureMaxSizeFactor
  }), [
    config.canvas.backgroundColor,
    config.tools.pressureMaxSizeFactor,
    config.tools.pressureMinSizeFactor
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    if (canvas.width !== config.canvas.defaultWidth) {
      canvas.width = config.canvas.defaultWidth;
    }

    if (canvas.height !== config.canvas.defaultHeight) {
      canvas.height = config.canvas.defaultHeight;
    }

    const context = canvas.getContext("2d");

    if (context) {
      renderCanvas(context, document, renderOptions);
    }
  }, [
    config.canvas.defaultHeight,
    config.canvas.defaultWidth,
    document,
    renderOptions,
  ]);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const point = pointerEventToCanvasPoint(
      event,
      canvas,
      config.canvas.defaultPointerPressure
    );

    if (toolSettings.tool === "selection") {
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      activePointerIdRef.current = event.pointerId;
      activeStrokeIdRef.current = null;

      const normalizedSelection = selection ? normalizeCanvasSelection(selection) : null;

      if (movableSelection && normalizedSelection && isPointInsideSelection(point, normalizedSelection)) {
        activeSelectionStartRef.current = null;
        activeSelectionMoveRef.current = {
          pointerStart: { x: point.x, y: point.y },
          selectionStart: normalizedSelection
        };
        return;
      }

      onBeginNewSelection();
      activeSelectionMoveRef.current = null;
      activeSelectionStartRef.current = { x: point.x, y: point.y };
      onSelectionChange({
        x: point.x,
        y: point.y,
        width: 0,
        height: 0
      });
      return;
    }

    const isDragTool = isGeometryDrawingTool(toolSettings.tool);
    const baseStroke = createStroke({
      id: crypto.randomUUID(),
      tool: toolSettings.tool,
      color: toolSettings.color,
      size: toolSettings.size,
      opacity: toolSettings.opacity,
      hardness: toolSettings.hardness,
      strokeStyle: toolSettings.strokeStyle,
      point
    });
    const stroke = isDragTool ? { ...baseStroke, points: [point, point] } : baseStroke;

    event.preventDefault();
    onAppendStroke(stroke);

    if (toolSettings.tool === "fill") {
      activePointerIdRef.current = null;
      activeStrokeIdRef.current = null;
      return;
    }

    canvas.setPointerCapture(event.pointerId);
    activePointerIdRef.current = event.pointerId;
    activeStrokeIdRef.current = stroke.id;
  }, [
    config.canvas.defaultPointerPressure,
    onAppendStroke,
    onBeginNewSelection,
    onSelectionChange,
    onMoveSelectedObject,
    toolSettings.color,
    toolSettings.hardness,
    toolSettings.opacity,
    toolSettings.size,
    toolSettings.strokeStyle,
    toolSettings.tool,
    movableSelection,
    selection
  ]);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerId !== activePointerIdRef.current) {
      return;
    }

    const point = pointerEventToCanvasPoint(
      event,
      event.currentTarget,
      config.canvas.defaultPointerPressure
    );
    event.preventDefault();

    if (activeSelectionStartRef.current) {
      onSelectionChange(normalizeCanvasSelection({
        x: activeSelectionStartRef.current.x,
        y: activeSelectionStartRef.current.y,
        width: point.x - activeSelectionStartRef.current.x,
        height: point.y - activeSelectionStartRef.current.y
      }));
      return;
    }

    if (activeSelectionMoveRef.current) {
      const nextSelection = clampSelectionToCanvas({
        ...activeSelectionMoveRef.current.selectionStart,
        x: activeSelectionMoveRef.current.selectionStart.x + point.x - activeSelectionMoveRef.current.pointerStart.x,
        y: activeSelectionMoveRef.current.selectionStart.y + point.y - activeSelectionMoveRef.current.pointerStart.y
      }, config.canvas.defaultWidth, config.canvas.defaultHeight);

      onSelectionChange(nextSelection);
      onMoveSelectedObject(nextSelection);
      return;
    }

    if (!activeStrokeIdRef.current) {
      return;
    }

    const activeStrokeId = activeStrokeIdRef.current;

    onUpdateStroke(activeStrokeId, (stroke) => (
      isGeometryDrawingTool(stroke.tool)
        ? replaceStrokeLastPoint(stroke, point)
        : appendPointToStroke(stroke, point, {
          defaultPressure: config.canvas.defaultPointerPressure,
          minPointDistance: config.canvas.minPointDistance,
          smoothing: config.canvas.strokeSmoothing
        })
    ));
  }, [
    config.canvas.defaultPointerPressure,
    config.canvas.defaultHeight,
    config.canvas.defaultWidth,
    config.canvas.minPointDistance,
    config.canvas.strokeSmoothing,
    onSelectionChange,
    onMoveSelectedObject,
    onUpdateStroke
  ]);

  const endPointerStroke = useCallback((event: PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerId !== activePointerIdRef.current) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    activePointerIdRef.current = null;
    activeStrokeIdRef.current = null;
    activeSelectionStartRef.current = null;
    activeSelectionMoveRef.current = null;
  }, []);

  const normalizedSelection = selection ? normalizeCanvasSelection(selection) : null;

  return (
    <section className="canvas-stage" aria-label="Drawing canvas">
      <div className="canvas-viewport">
        <div
          className="canvas-transform"
          style={{
            aspectRatio: `${config.canvas.defaultWidth} / ${config.canvas.defaultHeight}`,
            transform: `scale(${zoom})`
          }}
        >
          <canvas
            ref={canvasRef}
            className="canvas-surface"
            width={config.canvas.defaultWidth}
            height={config.canvas.defaultHeight}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endPointerStroke}
            onPointerCancel={endPointerStroke}
            onLostPointerCapture={endPointerStroke}
            onWheel={(event) => {
              event.preventDefault();
              onWheelZoom(event.deltaY < 0 ? 1.1 : 1 / 1.1);
            }}
            style={{
              backgroundColor: config.canvas.backgroundColor,
              aspectRatio: `${config.canvas.defaultWidth} / ${config.canvas.defaultHeight}`
            }}
          />
          {normalizedSelection && normalizedSelection.width > 0 && normalizedSelection.height > 0 && (
            <div
              className="canvas-selection"
              style={{
                left: `${(normalizedSelection.x / config.canvas.defaultWidth) * 100}%`,
                top: `${(normalizedSelection.y / config.canvas.defaultHeight) * 100}%`,
                width: `${(normalizedSelection.width / config.canvas.defaultWidth) * 100}%`,
                height: `${(normalizedSelection.height / config.canvas.defaultHeight) * 100}%`
              }}
            />
          )}
        </div>
      </div>
      <div className="canvas-zoom-controls" aria-label="Canvas zoom controls">
        <button className="mini-button" type="button" title="Zoom out" aria-label="Zoom out" onClick={onZoomOut}>
          -
        </button>
        <button className="mini-button canvas-zoom-readout" type="button" title="Reset zoom" onClick={onZoomReset}>
          {Math.round(zoom * 100)}%
        </button>
        <button className="mini-button" type="button" title="Zoom in" aria-label="Zoom in" onClick={onZoomIn}>
          +
        </button>
      </div>
    </section>
  );
}

function isGeometryDrawingTool(tool: DrawingToolSettings["tool"]): boolean {
  return tool === "straight-line"
    || tool === "curved-line"
    || tool === "rectangle"
    || tool === "ellipse"
    || tool === "triangle"
    || tool === "polygon";
}

function isPointInsideSelection(point: { x: number; y: number }, selection: CanvasSelection): boolean {
  return point.x >= selection.x
    && point.x <= selection.x + selection.width
    && point.y >= selection.y
    && point.y <= selection.y + selection.height;
}

function clampSelectionToCanvas(
  selection: CanvasSelection,
  canvasWidth: number,
  canvasHeight: number
): CanvasSelection {
  const width = Math.min(selection.width, canvasWidth);
  const height = Math.min(selection.height, canvasHeight);

  return {
    x: Math.min(canvasWidth - width, Math.max(0, selection.x)),
    y: Math.min(canvasHeight - height, Math.max(0, selection.y)),
    width,
    height
  };
}

