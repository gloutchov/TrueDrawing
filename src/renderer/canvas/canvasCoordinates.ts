import type { DrawingPoint } from "../../shared/drawing/strokeTypes";
import { normalizePressure } from "../../shared/drawing/strokeModel";

type CanvasPointInput = {
  clientX: number;
  clientY: number;
  pressure: number;
  timestamp: number;
};

export function pointerEventToCanvasPoint(
  event: CanvasPointInput,
  canvas: HTMLCanvasElement,
  defaultPressure: number
): DrawingPoint {
  const bounds = canvas.getBoundingClientRect();
  const scaleX = canvas.width / bounds.width;
  const scaleY = canvas.height / bounds.height;

  return {
    x: (event.clientX - bounds.left) * scaleX,
    y: (event.clientY - bounds.top) * scaleY,
    pressure: normalizePressure(event.pressure, defaultPressure),
    timestamp: event.timestamp
  };
}
