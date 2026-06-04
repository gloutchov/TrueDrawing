import { describe, expect, it } from "vitest";

import {
  appendPointToStroke,
  createStroke,
  normalizePressure,
  strokeWidthForPressure
} from "../../src/shared/drawing/strokeModel";
import type { DrawingPoint } from "../../src/shared/drawing/strokeTypes";

const firstPoint: DrawingPoint = {
  x: 10,
  y: 10,
  pressure: 0.5,
  timestamp: 1
};

describe("stroke model", () => {
  it("creates strokes with a first point", () => {
    const stroke = createStroke({
      id: "stroke-1",
      tool: "pencil",
      color: "#111111",
      size: 8,
      opacity: 1,
      hardness: 0.9,
      point: firstPoint
    });

    expect(stroke.points).toEqual([firstPoint]);
    expect(stroke.tool).toBe("pencil");
  });

  it("filters points below configured minimum distance", () => {
    const stroke = createStroke({
      id: "stroke-1",
      tool: "pencil",
      color: "#111111",
      size: 8,
      opacity: 1,
      hardness: 0.9,
      point: firstPoint
    });

    const updatedStroke = appendPointToStroke(
      stroke,
      { x: 10.5, y: 10.5, pressure: 0.5, timestamp: 2 },
      { defaultPressure: 0.5, minPointDistance: 2, smoothing: 0.5 }
    );

    expect(updatedStroke.points).toHaveLength(1);
  });

  it("smooths accepted points using the configured smoothing factor", () => {
    const stroke = createStroke({
      id: "stroke-1",
      tool: "pencil",
      color: "#111111",
      size: 8,
      opacity: 1,
      hardness: 0.9,
      point: firstPoint
    });

    const updatedStroke = appendPointToStroke(
      stroke,
      { x: 20, y: 30, pressure: 1, timestamp: 2 },
      { defaultPressure: 0.5, minPointDistance: 1, smoothing: 0.5 }
    );

    expect(updatedStroke.points).toHaveLength(2);
    expect(updatedStroke.points[1]).toEqual({
      x: 15,
      y: 20,
      pressure: 0.75,
      timestamp: 2
    });
  });

  it("normalizes unavailable pressure to the configured default", () => {
    expect(normalizePressure(0, 0.5)).toBe(0.5);
    expect(normalizePressure(Number.NaN, 0.4)).toBe(0.4);
    expect(normalizePressure(1.4, 0.5)).toBe(1);
  });

  it("computes pressure-sensitive stroke width from configured factors", () => {
    expect(strokeWidthForPressure(10, 0.5, {
      pressureMinSizeFactor: 0.5,
      pressureMaxSizeFactor: 1.5
    })).toBe(10);
  });
});

