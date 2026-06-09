export const strokeToolIds = ["pencil", "marker", "brush", "eraser"] as const;
export const lineToolIds = ["straight-line", "curved-line"] as const;
export const shapeToolIds = ["rectangle", "ellipse", "triangle", "polygon"] as const;
export const fillToolIds = ["fill"] as const;
export const utilityToolIds = ["selection", "clear-rect", "image"] as const;
export const drawingToolIds = [
  ...strokeToolIds,
  ...lineToolIds,
  ...shapeToolIds,
  ...fillToolIds,
  ...utilityToolIds
] as const;
export const strokeStyleIds = ["solid", "dashed", "dotted"] as const;

export type DrawingToolId = typeof drawingToolIds[number];
export type StrokeToolId = typeof strokeToolIds[number];
export type LineToolId = typeof lineToolIds[number];
export type ShapeToolId = typeof shapeToolIds[number];
export type FillToolId = typeof fillToolIds[number];
export type UtilityToolId = typeof utilityToolIds[number];
export type StrokeStyleId = typeof strokeStyleIds[number];

export type DrawingToolPreset = {
  id: StrokeToolId;
  label: string;
  size: number;
  opacity: number;
  hardness: number;
};

export type DrawingToolSettings = {
  tool: DrawingToolId;
  color: string;
  size: number;
  opacity: number;
  hardness: number;
  strokeStyle: StrokeStyleId;
};

export function isDrawingToolId(value: string): value is DrawingToolId {
  return drawingToolIds.includes(value as DrawingToolId);
}

export function isStrokeToolId(value: string): value is StrokeToolId {
  return strokeToolIds.includes(value as StrokeToolId);
}

export function isStrokeStyleId(value: string): value is StrokeStyleId {
  return strokeStyleIds.includes(value as StrokeStyleId);
}
