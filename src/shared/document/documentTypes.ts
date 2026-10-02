import type { DocumentSnapshot } from "./snapshotModel";
import type { ReferenceImage } from "./referenceModel";
import type { DrawingStroke } from "../drawing/strokeTypes";
import type { StoredRealisticImage } from "../image-generation/imageGenerationTypes";
import type { CanvasDimensions } from "./canvasDimensions";

export type DrawingLayer = {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  strokes: DrawingStroke[];
  mask?: {enabled:boolean;strokes:DrawingStroke[]};
  clipToLayerId?: string | null;
};

export type DrawingDocument = {
  snapshots?: DocumentSnapshot[];
  references?: ReferenceImage[];
  canvas: CanvasDimensions;
  layers: DrawingLayer[];
  activeLayerId: string;
  realisticImage: StoredRealisticImage | null;
};

export type LayerCreateOptions = {
  id: string;
  name: string;
  opacity: number;
};
