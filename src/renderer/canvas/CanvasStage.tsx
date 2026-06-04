import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";

import type { AppConfig } from "../../shared/config/appConfigSchema";
import { appendPointToStroke, createStroke } from "../../shared/drawing/strokeModel";
import type { DrawingStroke } from "../../shared/drawing/strokeTypes";
import { pointerEventToCanvasPoint } from "./canvasCoordinates";
import { renderCanvas } from "./canvasRenderer";

type CanvasStageProps = {
  config: AppConfig;
};

export function CanvasStage({ config }: CanvasStageProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const activeStrokeIdRef = useRef<string | null>(null);
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);

  const renderOptions = {
    backgroundColor: config.canvas.backgroundColor,
    pressureMinSizeFactor: config.tools.pressureMinSizeFactor,
    pressureMaxSizeFactor: config.tools.pressureMaxSizeFactor
  };

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
      renderCanvas(context, strokes, renderOptions);
    }
  }, [
    config.canvas.defaultHeight,
    config.canvas.defaultWidth,
    renderOptions,
    strokes
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
      tool: config.tools.defaultTool,
      color: config.tools.defaultColor,
      size: config.tools.defaultSize,
      opacity: config.tools.defaultOpacity,
      point
    });

    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    activePointerIdRef.current = event.pointerId;
    activeStrokeIdRef.current = stroke.id;
    setStrokes((currentStrokes) => [...currentStrokes, stroke]);
  }, [
    config.canvas.defaultPointerPressure,
    config.tools.defaultColor,
    config.tools.defaultOpacity,
    config.tools.defaultSize,
    config.tools.defaultTool
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
    setStrokes((currentStrokes) => currentStrokes.map((stroke) => {
      if (stroke.id !== activeStrokeId) {
        return stroke;
      }

      return appendPointToStroke(stroke, point, {
        defaultPressure: config.canvas.defaultPointerPressure,
        minPointDistance: config.canvas.minPointDistance,
        smoothing: config.canvas.strokeSmoothing
      });
    }));
  }, [
    config.canvas.defaultPointerPressure,
    config.canvas.minPointDistance,
    config.canvas.strokeSmoothing
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

