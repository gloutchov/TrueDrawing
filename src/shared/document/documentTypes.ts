import type { DrawingStroke } from "../drawing/strokeTypes";

export type DrawingLayer = {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  strokes: DrawingStroke[];
};

export type DrawingDocument = {
  layers: DrawingLayer[];
  activeLayerId: string;
};

export type LayerCreateOptions = {
  id: string;
  name: string;
  opacity: number;
};
