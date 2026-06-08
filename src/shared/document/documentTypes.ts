import type { DrawingStroke } from "../drawing/strokeTypes";
import type { StoredRealisticImage } from "../image-generation/imageGenerationTypes";

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
  realisticImage: StoredRealisticImage | null;
};

export type LayerCreateOptions = {
  id: string;
  name: string;
  opacity: number;
};
