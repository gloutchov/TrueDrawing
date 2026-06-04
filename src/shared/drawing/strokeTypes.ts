export type DrawingPoint = {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
};

export type DrawingStroke = {
  id: string;
  tool: string;
  color: string;
  size: number;
  opacity: number;
  points: DrawingPoint[];
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

