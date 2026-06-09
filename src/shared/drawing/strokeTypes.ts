import type { DrawingToolId, StrokeStyleId } from "./toolTypes";

export type DrawingPoint = {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
};

export type DrawingStroke = {
  id: string;
  tool: DrawingToolId;
  color: string;
  size: number;
  opacity: number;
  hardness: number;
  strokeStyle: StrokeStyleId;
  points: DrawingPoint[];
  imageDataUrl?: string;
};

export type StrokeInputOptions = {
  defaultPressure: number;
  minPointDistance: number;
  smoothing: number;
};

export type StrokeRenderOptions = {
  pressureMinSizeFactor: number;
  pressureMaxSizeFactor: number;
};

