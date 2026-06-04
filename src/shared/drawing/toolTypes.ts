export const drawingToolIds = ["pencil", "marker", "brush", "eraser"] as const;

export type DrawingToolId = typeof drawingToolIds[number];

export type DrawingToolPreset = {
  id: DrawingToolId;
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
};

export function isDrawingToolId(value: string): value is DrawingToolId {
  return drawingToolIds.includes(value as DrawingToolId);
}
