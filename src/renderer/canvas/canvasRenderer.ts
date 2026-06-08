import { strokeWidthForPressure } from "../../shared/drawing/strokeModel";
import type { DrawingDocument, DrawingLayer } from "../../shared/document/documentTypes";
import type { DrawingStroke, StrokeRenderOptions } from "../../shared/drawing/strokeTypes";

type RenderCanvasOptions = StrokeRenderOptions & {
  backgroundColor: string;
};

export function renderCanvas(
  context: CanvasRenderingContext2D,
  document: DrawingDocument,
  options: RenderCanvasOptions
): void {
  const { canvas } = context;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = options.backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (const layer of document.layers) {
    renderLayer(context, layer, options);
  }
}

function renderLayer(
  context: CanvasRenderingContext2D,
  layer: DrawingLayer,
  options: StrokeRenderOptions
): void {
  if (!layer.visible || layer.opacity <= 0 || layer.strokes.length === 0) {
    return;
  }

  const layerCanvas = document.createElement("canvas");

  layerCanvas.width = context.canvas.width;
  layerCanvas.height = context.canvas.height;

  const layerContext = layerCanvas.getContext("2d");

  if (!layerContext) {
    return;
  }

  for (const stroke of layer.strokes) {
    renderStroke(layerContext, stroke, options);
  }

  context.save();
  context.globalAlpha = layer.opacity;
  context.drawImage(layerCanvas, 0, 0);
  context.restore();
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
  context.globalCompositeOperation = stroke.tool === "eraser" ? "destination-out" : "source-over";
  context.strokeStyle = stroke.tool === "eraser" ? "#000000" : stroke.color;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.shadowColor = stroke.tool === "eraser" ? "#000000" : stroke.color;
  context.shadowBlur = stroke.size * Math.max(0, 1 - stroke.hardness) * 0.8;

  if (stroke.points.length === 1) {
    const [point] = stroke.points;
    const radius = strokeWidthForPressure(stroke.size, point.pressure, options) / 2;

    context.fillStyle = stroke.tool === "eraser" ? "#000000" : stroke.color;
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

