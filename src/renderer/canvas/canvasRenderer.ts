import { strokeWidthForPressure } from "../../shared/drawing/strokeModel";
import type { DrawingStroke, StrokeRenderOptions } from "../../shared/drawing/strokeTypes";

type RenderCanvasOptions = StrokeRenderOptions & {
  backgroundColor: string;
};

export function renderCanvas(
  context: CanvasRenderingContext2D,
  strokes: DrawingStroke[],
  options: RenderCanvasOptions
): void {
  const { canvas } = context;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = options.backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (const stroke of strokes) {
    renderStroke(context, stroke, options);
  }
}

function renderStroke(
  context: CanvasRenderingContext2D,
  stroke: DrawingStroke,
  options: StrokeRenderOptions
): void {
  if (stroke.points.length === 0) {
    return;
  }

  context.save();
  context.globalAlpha = stroke.opacity;
  context.strokeStyle = stroke.color;
  context.lineCap = "round";
  context.lineJoin = "round";

  if (stroke.points.length === 1) {
    const [point] = stroke.points;
    const radius = strokeWidthForPressure(stroke.size, point.pressure, options) / 2;

    context.fillStyle = stroke.color;
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
    return;
  }

  for (let index = 1; index < stroke.points.length; index += 1) {
    const previousPoint = stroke.points[index - 1];
    const point = stroke.points[index];
    const midpointX = (previousPoint.x + point.x) / 2;
    const midpointY = (previousPoint.y + point.y) / 2;

    context.lineWidth = strokeWidthForPressure(stroke.size, point.pressure, options);
    context.beginPath();
    context.moveTo(previousPoint.x, previousPoint.y);
    context.quadraticCurveTo(previousPoint.x, previousPoint.y, midpointX, midpointY);
    context.stroke();
  }

  context.restore();
}

