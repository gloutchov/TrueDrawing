import type { DrawingDocument } from "../document/documentTypes";

export const drawingProjectFormat = "true-drawing-project";
export const drawingProjectFormatVersion = 1;

export type DrawingProjectFile = {
  format: typeof drawingProjectFormat;
  formatVersion: typeof drawingProjectFormatVersion;
  appVersion: string;
  name: string;
  savedAt: string;
  document: DrawingDocument;
};

export type ProjectSaveRequest = {
  project: DrawingProjectFile;
  filePath: string | null;
  canvasDataUrl: string;
  imageDataUrl: string | null;
};

export type ProjectSaveResult = {
  canceled: boolean;
  filePath: string | null;
  name: string;
  savedAt: string | null;
};

export type ProjectOpenResult = {
  canceled: boolean;
  filePath: string | null;
  project: DrawingProjectFile | null;
};

export type ProjectAutosaveRequest = {
  project: DrawingProjectFile;
  canvasDataUrl: string;
  imageDataUrl: string | null;
};

export type ProjectAutosaveInfo = {
  id: string;
  filePath: string;
  name: string;
  savedAt: string;
};

export type ProjectAutosaveResult = {
  filePath: string;
  savedAt: string;
};

export type ProjectExportFormat = "png" | "webp";

export type ProjectExportTarget = "canvas" | "image";

export type ProjectExportRequest = {
  name: string;
  target: ProjectExportTarget;
  format: ProjectExportFormat;
  dataUrl: string;
};

export type ProjectExportResult = {
  canceled: boolean;
  filePath: string | null;
};
