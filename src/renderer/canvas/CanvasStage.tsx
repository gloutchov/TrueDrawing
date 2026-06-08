import { useCallback, useEffect, useMemo, useRef, type PointerEvent } from "react";

import type { AppConfig } from "../../shared/config/appConfigSchema";
import { appendPointToStroke, createStroke } from "../../shared/drawing/strokeModel";
import type { DrawingDocument } from "../../shared/document/documentTypes";
import type { DrawingStroke } from "../../shared/drawing/strokeTypes";
import type { DrawingToolSettings } from "../../shared/drawing/toolTypes";
import { pointerEventToCanvasPoint } from "./canvasCoordinates";
import { renderCanvas } from "./canvasRenderer";

type CanvasStageProps = {
  config: AppConfig;
  document: DrawingDocument;
  toolSettings: DrawingToolSettings;
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
  onAppendStroke,
  onUpdateStroke
}: CanvasStageProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const activeStrokeIdRef = useRef<string | null>(null);

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
    const stroke = createStroke({
      id: crypto.randomUUID(),
      tool: toolSettings.tool,
      color: toolSettings.color,
      size: toolSettings.size,
      opacity: toolSettings.opacity,
      hardness: toolSettings.hardness,
      point
    });

    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    activePointerIdRef.current = event.pointerId;
    activeStrokeIdRef.current = stroke.id;
    onAppendStroke(stroke);
  }, [
    config.canvas.defaultPointerPressure,
    onAppendStroke,
    toolSettings.color,
    toolSettings.hardness,
    toolSettings.opacity,
    toolSettings.size,
    toolSettings.tool
  ]);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerId !== activePointerIdRef.current || !activeStrokeIdRef.current) {
      return;
    }

    const point = pointerEventToCanvasPoint(
      event,
      event.currentTarget,
      config.canvas.defaultPointerPressure
    );
    const activeStrokeId = activeStrokeIdRef.current;

    event.preventDefault();
    onUpdateStroke(activeStrokeId, (stroke) => appendPointToStroke(stroke, point, {
      defaultPressure: config.canvas.defaultPointerPressure,
      minPointDistance: config.canvas.minPointDistance,
      smoothing: config.canvas.strokeSmoothing
    }));
  }, [
    config.canvas.defaultPointerPressure,
    config.canvas.minPointDistance,
    config.canvas.strokeSmoothing,
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
  }, []);

  return (
    <section className="canvas-stage" aria-label="Drawing canvas">
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
        style={{
          backgroundColor: config.canvas.backgroundColor,
          aspectRatio: `${config.canvas.defaultWidth} / ${config.canvas.defaultHeight}`
        }}
      />
    </section>
  );
}

