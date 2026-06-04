import type {
  DrawingPoint,
  DrawingStroke,
  StrokeInputOptions,
  StrokeRenderOptions
} from "./strokeTypes";
import type { DrawingToolId } from "./toolTypes";

type CreateStrokeInput = {
  id: string;
  tool: DrawingToolId;
  color: string;
  size: number;
  opacity: number;
  hardness: number;
  point: DrawingPoint;
};

export function createStroke(input: CreateStrokeInput): DrawingStroke {
  return {
    id: input.id,
    tool: input.tool,
    color: input.color,
    size: input.size,
    opacity: input.opacity,
    hardness: input.hardness,
    points: [input.point]
  };
}

export function appendPointToStroke(
  stroke: DrawingStroke,
  point: DrawingPoint,
  options: StrokeInputOptions
): DrawingStroke {
  const previousPoint = stroke.points.at(-1);

  if (!previousPoint) {
    return { ...stroke, points: [point] };
  }

  if (distanceBetween(previousPoint, point) < options.minPointDistance) {
    return stroke;
  }

  return {
    ...stroke,
    points: [
      ...stroke.points,
      smoothPoint(previousPoint, point, options.smoothing)
    ]
  };
}

export function normalizePressure(rawPressure: number, defaultPressure: number): number {
  if (!Number.isFinite(rawPressure) || rawPressure <= 0) {
    return defaultPressure;
  }

  if (rawPressure > 1) {
    return 1;
  }

  return rawPressure;
}

export function strokeWidthForPressure(
  baseSize: number,
  pressure: number,
  options: StrokeRenderOptions
): number {
  const sizeRange = options.pressureMaxSizeFactor - options.pressureMinSizeFactor;
  const multiplier = options.pressureMinSizeFactor + sizeRange * pressure;

  return baseSize * multiplier;
}

export function distanceBetween(first: DrawingPoint, second: DrawingPoint): number {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function smoothPoint(previousPoint: DrawingPoint, point: DrawingPoint, smoothing: number): DrawingPoint {
  return {
    x: previousPoint.x + (point.x - previousPoint.x) * smoothing,
    y: previousPoint.y + (point.y - previousPoint.y) * smoothing,
    pressure: previousPoint.pressure + (point.pressure - previousPoint.pressure) * smoothing,
    timestamp: point.timestamp
  };
}

