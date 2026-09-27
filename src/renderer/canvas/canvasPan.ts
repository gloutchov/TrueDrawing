export type CanvasPan = { x: number; y: number };

export function panFromPointerDrag(
  initialPan: CanvasPan,
  pointerStart: CanvasPan,
  pointerCurrent: CanvasPan
): CanvasPan {
  return {
    x: initialPan.x + pointerCurrent.x - pointerStart.x,
    y: initialPan.y + pointerCurrent.y - pointerStart.y
  };
}
