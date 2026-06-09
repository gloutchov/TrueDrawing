export type CanvasSelection = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function normalizeCanvasSelection(selection: CanvasSelection): CanvasSelection {
  const x = selection.width < 0 ? selection.x + selection.width : selection.x;
  const y = selection.height < 0 ? selection.y + selection.height : selection.y;

  return {
    x,
    y,
    width: Math.abs(selection.width),
    height: Math.abs(selection.height)
  };
}
