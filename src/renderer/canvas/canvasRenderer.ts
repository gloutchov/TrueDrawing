import { strokeWidthForPressure } from "../../shared/drawing/strokeModel";
import type { DrawingDocument, DrawingLayer } from "../../shared/document/documentTypes";
import type { DrawingPoint } from "../../shared/drawing/strokeTypes";
import type { DrawingStroke, StrokeRenderOptions } from "../../shared/drawing/strokeTypes";

type RenderCanvasOptions = StrokeRenderOptions & {
  backgroundColor: string;
};

const imageCache = new Map<string, HTMLImageElement>();

export async function preloadCanvasImage(dataUrl: string): Promise<{
  width: number;
  height: number;
}> {
  const cachedImage = imageCache.get(dataUrl);

  if (cachedImage) {
    return {
      width: cachedImage.naturalWidth,
      height: cachedImage.naturalHeight
    };
  }

  const image = new Image();

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Unable to load clipboard image."));
    image.src = dataUrl;
  });

  imageCache.set(dataUrl, image);

  return {
    width: image.naturalWidth,
    height: image.naturalHeight
  };
}

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
  context.fillStyle = stroke.tool === "eraser" ? "#000000" : stroke.color;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.shadowColor = stroke.tool === "eraser" ? "#000000" : stroke.color;
  context.shadowBlur = stroke.size * Math.max(0, 1 - stroke.hardness) * 0.8;
  applyStrokeStyle(context, stroke);

  if (stroke.tool === "fill") {
    floodFill(context, stroke);
    context.restore();
    return;
  }

  if (stroke.tool === "clear-rect") {
    clearRectangle(context, stroke);
    context.restore();
    return;
  }

  if (stroke.tool === "image") {
    renderImageStroke(context, stroke);
    context.restore();
    return;
  }

  if (isGeometryTool(stroke.tool)) {
    renderGeometryStroke(context, stroke, options);
    context.restore();
    return;
  }

  if (stroke.points.length === 1) {
    const [point] = stroke.points;
    const radius = strokeWidthForPressure(stroke.size, point.pressure, options) / 2;

    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
    return;
  }

  for (let index = 1; index < stroke.points.length; index += 1) {
    const previousPoint = stroke.points[index - 1];
    const point = stroke.points[index];
    const segmentStart = index === 1
      ? previousPoint
      : midpointBetween(stroke.points[index - 2], previousPoint);
    const midpointX = (previousPoint.x + point.x) / 2;
    const midpointY = (previousPoint.y + point.y) / 2;

    context.lineWidth = strokeWidthForPressure(stroke.size, point.pressure, options);
    context.beginPath();
    context.moveTo(segmentStart.x, segmentStart.y);
    context.quadraticCurveTo(previousPoint.x, previousPoint.y, midpointX, midpointY);
    context.stroke();
  }

  context.restore();
}

function renderGeometryStroke(
  context: CanvasRenderingContext2D,
  stroke: DrawingStroke,
  options: StrokeRenderOptions
): void {
  const startPoint = stroke.points[0];
  const endPoint = stroke.points.at(-1);

  if (!startPoint || !endPoint) {
    return;
  }

  context.lineWidth = strokeWidthForPressure(stroke.size, endPoint.pressure, options);
  context.beginPath();

  if (stroke.tool === "straight-line") {
    context.moveTo(startPoint.x, startPoint.y);
    context.lineTo(endPoint.x, endPoint.y);
    context.stroke();
    return;
  }

  if (stroke.tool === "curved-line") {
    const controlPoint = curveControlPoint(startPoint, endPoint);

    context.moveTo(startPoint.x, startPoint.y);
    context.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
    context.stroke();
    return;
  }

  if (stroke.tool === "rectangle") {
    context.strokeRect(
      startPoint.x,
      startPoint.y,
      endPoint.x - startPoint.x,
      endPoint.y - startPoint.y
    );
    return;
  }

  if (stroke.tool === "ellipse") {
    const bounds = boundsFromPoints(startPoint, endPoint);

    context.ellipse(
      bounds.centerX,
      bounds.centerY,
      Math.max(1, bounds.width / 2),
      Math.max(1, bounds.height / 2),
      0,
      0,
      Math.PI * 2
    );
    context.stroke();
    return;
  }

  const polygonPoints = stroke.tool === "triangle"
    ? trianglePoints(startPoint, endPoint)
    : regularPolygonPoints(startPoint, endPoint, 5);

  drawClosedShape(context, polygonPoints);
}

function clearRectangle(context: CanvasRenderingContext2D, stroke: DrawingStroke): void {
  const startPoint = stroke.points[0];
  const endPoint = stroke.points.at(-1);

  if (!startPoint || !endPoint) {
    return;
  }

  const x = Math.min(startPoint.x, endPoint.x);
  const y = Math.min(startPoint.y, endPoint.y);
  const width = Math.abs(endPoint.x - startPoint.x);
  const height = Math.abs(endPoint.y - startPoint.y);

  context.save();
  context.globalCompositeOperation = "destination-out";
  context.fillRect(x, y, width, height);
  context.restore();
}

function renderImageStroke(context: CanvasRenderingContext2D, stroke: DrawingStroke): void {
  if (!stroke.imageDataUrl) {
    return;
  }

  const image = imageCache.get(stroke.imageDataUrl);

  if (!image) {
    void preloadCanvasImage(stroke.imageDataUrl);
    return;
  }

  const startPoint = stroke.points[0];
  const endPoint = stroke.points.at(-1);

  if (!startPoint || !endPoint) {
    return;
  }

  const x = Math.min(startPoint.x, endPoint.x);
  const y = Math.min(startPoint.y, endPoint.y);
  const width = Math.abs(endPoint.x - startPoint.x);
  const height = Math.abs(endPoint.y - startPoint.y);

  context.drawImage(image, x, y, width, height);
}

function applyStrokeStyle(context: CanvasRenderingContext2D, stroke: DrawingStroke): void {
  if (stroke.strokeStyle === "dashed") {
    context.setLineDash([stroke.size * 2.2, stroke.size * 2]);
    return;
  }

  if (stroke.strokeStyle === "dotted") {
    context.setLineDash([1, Math.max(4, stroke.size * 2.4)]);
    return;
  }

  context.setLineDash([]);
}

function midpointBetween(firstPoint: DrawingPoint, secondPoint: DrawingPoint): DrawingPoint {
  return {
    x: (firstPoint.x + secondPoint.x) / 2,
    y: (firstPoint.y + secondPoint.y) / 2,
    pressure: secondPoint.pressure,
    timestamp: secondPoint.timestamp
  };
}

function isGeometryTool(tool: DrawingStroke["tool"]): boolean {
  return tool === "straight-line"
    || tool === "curved-line"
    || tool === "rectangle"
    || tool === "ellipse"
    || tool === "triangle"
    || tool === "polygon";
}

function curveControlPoint(startPoint: DrawingPoint, endPoint: DrawingPoint): DrawingPoint {
  const midpointX = (startPoint.x + endPoint.x) / 2;
  const midpointY = (startPoint.y + endPoint.y) / 2;
  const deltaX = endPoint.x - startPoint.x;
  const deltaY = endPoint.y - startPoint.y;

  return {
    x: midpointX - deltaY * 0.25,
    y: midpointY + deltaX * 0.25,
    pressure: endPoint.pressure,
    timestamp: endPoint.timestamp
  };
}

function boundsFromPoints(startPoint: DrawingPoint, endPoint: DrawingPoint): {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
} {
  const width = Math.abs(endPoint.x - startPoint.x);
  const height = Math.abs(endPoint.y - startPoint.y);

  return {
    centerX: Math.min(startPoint.x, endPoint.x) + width / 2,
    centerY: Math.min(startPoint.y, endPoint.y) + height / 2,
    width,
    height
  };
}

function trianglePoints(startPoint: DrawingPoint, endPoint: DrawingPoint): DrawingPoint[] {
  const left = Math.min(startPoint.x, endPoint.x);
  const right = Math.max(startPoint.x, endPoint.x);
  const top = Math.min(startPoint.y, endPoint.y);
  const bottom = Math.max(startPoint.y, endPoint.y);

  return [
    { ...startPoint, x: (left + right) / 2, y: top },
    { ...startPoint, x: right, y: bottom },
    { ...startPoint, x: left, y: bottom }
  ];
}

function regularPolygonPoints(
  startPoint: DrawingPoint,
  endPoint: DrawingPoint,
  sides: number
): DrawingPoint[] {
  const bounds = boundsFromPoints(startPoint, endPoint);
  const radiusX = Math.max(1, bounds.width / 2);
  const radiusY = Math.max(1, bounds.height / 2);

  return Array.from({ length: sides }, (_value, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / sides;

    return {
      ...startPoint,
      x: bounds.centerX + Math.cos(angle) * radiusX,
      y: bounds.centerY + Math.sin(angle) * radiusY
    };
  });
}

function drawClosedShape(context: CanvasRenderingContext2D, points: DrawingPoint[]): void {
  const firstPoint = points[0];

  if (!firstPoint) {
    return;
  }

  context.moveTo(firstPoint.x, firstPoint.y);
  points.slice(1).forEach((point) => {
    context.lineTo(point.x, point.y);
  });
  context.closePath();
  context.stroke();
}

function floodFill(context: CanvasRenderingContext2D, stroke: DrawingStroke): void {
  const startPoint = stroke.points[0];

  if (!startPoint) {
    return;
  }

  const width = context.canvas.width;
  const height = context.canvas.height;
  const startX = Math.floor(startPoint.x);
  const startY = Math.floor(startPoint.y);

  if (startX < 0 || startY < 0 || startX >= width || startY >= height) {
    return;
  }

  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;
  const startIndex = pixelIndex(startX, startY, width);
  const targetColor = readPixel(data, startIndex);
  const fillColor = hexToRgba(stroke.color, stroke.opacity);

  if (colorsAreClose(targetColor, fillColor, 0)) {
    return;
  }

  const visited = new Uint8Array(width * height);
  const stack: number[] = [startY * width + startX];
  const tolerance = 18;

  while (stack.length > 0) {
    const pointIndex = stack.pop();

    if (pointIndex === undefined) {
      continue;
    }

    const x = pointIndex % width;
    const y = Math.floor(pointIndex / width);

    if (x < 0 || y < 0 || x >= width || y >= height) {
      continue;
    }

    const visitedIndex = y * width + x;

    if (visited[visitedIndex]) {
      continue;
    }

    visited[visitedIndex] = 1;

    const index = pixelIndex(x, y, width);

    if (!colorsAreClose(readPixel(data, index), targetColor, tolerance)) {
      continue;
    }

    writePixel(data, index, fillColor);

    if (x + 1 < width) {
      stack.push(visitedIndex + 1);
    }

    if (x > 0) {
      stack.push(visitedIndex - 1);
    }

    if (y + 1 < height) {
      stack.push(visitedIndex + width);
    }

    if (y > 0) {
      stack.push(visitedIndex - width);
    }
  }

  context.putImageData(imageData, 0, 0);
}

type RgbaColor = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

function pixelIndex(x: number, y: number, width: number): number {
  return (y * width + x) * 4;
}

function readPixel(data: Uint8ClampedArray, index: number): RgbaColor {
  return {
    red: data[index],
    green: data[index + 1],
    blue: data[index + 2],
    alpha: data[index + 3]
  };
}

function writePixel(data: Uint8ClampedArray, index: number, color: RgbaColor): void {
  data[index] = color.red;
  data[index + 1] = color.green;
  data[index + 2] = color.blue;
  data[index + 3] = color.alpha;
}

function colorsAreClose(left: RgbaColor, right: RgbaColor, tolerance: number): boolean {
  return Math.abs(left.red - right.red) <= tolerance
    && Math.abs(left.green - right.green) <= tolerance
    && Math.abs(left.blue - right.blue) <= tolerance
    && Math.abs(left.alpha - right.alpha) <= tolerance;
}

function hexToRgba(hexColor: string, opacity: number): RgbaColor {
  const normalizedColor = hexColor.trim().replace("#", "");
  const red = Number.parseInt(normalizedColor.slice(0, 2), 16);
  const green = Number.parseInt(normalizedColor.slice(2, 4), 16);
  const blue = Number.parseInt(normalizedColor.slice(4, 6), 16);

  return {
    red: Number.isFinite(red) ? red : 0,
    green: Number.isFinite(green) ? green : 0,
    blue: Number.isFinite(blue) ? blue : 0,
    alpha: Math.round(Math.min(1, Math.max(0, strokeOpacity(opacity))) * 255)
  };
}

function strokeOpacity(opacity: number): number {
  return Number.isFinite(opacity) ? opacity : 1;
}

