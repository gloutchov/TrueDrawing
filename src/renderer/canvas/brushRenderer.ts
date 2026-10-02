import { brushDynamics, textureAlpha } from "../../shared/drawing/brushModel";
import type { DrawingStroke } from "../../shared/drawing/strokeTypes";

export function renderBrushStroke(context: CanvasRenderingContext2D, stroke: DrawingStroke): void {
  const brush = stroke.brush;
  if (!brush) return;
  const stamp = (point: DrawingStroke["points"][number], previous?: DrawingStroke["points"][number]) => {
    const dynamics = brushDynamics(brush, point, previous);
    const radius = stroke.size * dynamics.sizeFactor / 2;
    context.globalAlpha = stroke.opacity * dynamics.opacityFactor * textureAlpha(brush, point.x, point.y);
    context.beginPath(); context.arc(point.x, point.y, radius, 0, Math.PI * 2); context.fill();
  };
  if (stroke.points.length === 1) stamp(stroke.points[0]);
  let remaining = 0;
  for (let i = 1; i < stroke.points.length; i++) {
    const a = stroke.points[i - 1], b = stroke.points[i];
    const distance = Math.hypot(b.x - a.x, b.y - a.y);
    const step = Math.max(0.5, stroke.size * brush.spacing);
    for (let d = remaining; d <= distance; d += step) {
      const ratio = distance === 0 ? 1 : d / distance;
      stamp({x: a.x + (b.x - a.x) * ratio, y: a.y + (b.y - a.y) * ratio,
        pressure: a.pressure + (b.pressure - a.pressure) * ratio,
        timestamp: a.timestamp + (b.timestamp - a.timestamp) * ratio}, a);
    }
    remaining = (remaining - distance) % step;
    if (remaining < 0) remaining += step;
  }
}
