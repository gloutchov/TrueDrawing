import type { AppConfig } from "../config/appConfigSchema";
import type { DrawingDocument, DrawingLayer } from "../document/documentTypes";
import { isDrawingToolId } from "../drawing/toolTypes";
import type { DrawingPoint, DrawingStroke } from "../drawing/strokeTypes";
import { isStrokeStyleId } from "../drawing/toolTypes";
import type { StoredRealisticImage } from "../image-generation/imageGenerationTypes";
import {
  drawingProjectFormat,
  drawingProjectFormatVersion,
  type DrawingProjectFile
} from "./projectTypes";

export function createDrawingProjectFile(
  document: DrawingDocument,
  options: {
    appVersion: string;
    name: string;
    fallbackName: string;
    savedAt?: string;
  }
): DrawingProjectFile {
  return {
    format: drawingProjectFormat,
    formatVersion: drawingProjectFormatVersion,
    appVersion: options.appVersion,
    name: normalizeProjectName(options.name, options.fallbackName),
    savedAt: options.savedAt ?? new Date().toISOString(),
    document
  };
}

export function serializeDrawingProject(project: DrawingProjectFile): string {
  return `${JSON.stringify(project, null, 2)}\n`;
}

export function parseDrawingProjectFile(value: unknown): DrawingProjectFile {
  const project = expectObject(value, "project");

  if (project.format !== drawingProjectFormat) {
    throw new Error("Invalid True Drawing project format.");
  }

  if (project.formatVersion !== drawingProjectFormatVersion) {
    throw new Error("Unsupported True Drawing project version.");
  }

  return {
    format: drawingProjectFormat,
    formatVersion: drawingProjectFormatVersion,
    appVersion: expectString(project.appVersion, "project.appVersion"),
    name: expectString(project.name, "project.name").trim(),
    savedAt: expectIsoDate(project.savedAt, "project.savedAt"),
    document: parseDrawingDocument(project.document)
  };
}

export function parseDrawingProjectJson(json: string): DrawingProjectFile {
  return parseDrawingProjectFile(JSON.parse(json) as unknown);
}

export function normalizeProjectName(value: string, fallbackName: string): string {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : fallbackName;
}

export function sanitizeFileBaseName(value: string, fallbackName: string): string {
  const sanitized = normalizeProjectName(value, fallbackName)
    .split("")
    .map((character) => (isUnsafeFileNameCharacter(character) ? "-" : character))
    .join("")
    .replace(/\s+/g, " ")
    .replace(/[. ]+$/u, "")
    .trim();

  if (sanitized.length === 0 || isReservedWindowsFileName(sanitized)) {
    return fallbackName;
  }

  return sanitized;
}

function isUnsafeFileNameCharacter(character: string): boolean {
  return character.charCodeAt(0) < 32 || '<>:"/\\|?*'.includes(character);
}

function isReservedWindowsFileName(fileName: string): boolean {
  return /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/iu.test(fileName);
}

export function ensureExtension(filePath: string, extension: string): string {
  return filePath.toLowerCase().endsWith(extension.toLowerCase())
    ? filePath
    : `${filePath}${extension}`;
}

export function createProjectSidecarFileNames(
  projectName: string,
  config: AppConfig
): {
  canvasFileName: string;
  imageFileName: string;
} {
  const baseName = sanitizeFileBaseName(projectName, config.files.defaultProjectName);

  return {
    canvasFileName: `${baseName}${config.files.canvasSuffix}${config.files.canvasExportExtension}`,
    imageFileName: `${baseName}${config.files.imageSuffix}${config.files.imageExportExtension}`
  };
}

function parseDrawingDocument(value: unknown): DrawingDocument {
  const document = expectObject(value, "document");
  const layers = expectArray(document.layers, "document.layers").map(parseDrawingLayer);
  const activeLayerId = expectString(document.activeLayerId, "document.activeLayerId");

  if (layers.length === 0) {
    throw new Error("Invalid True Drawing project: document must contain at least one layer.");
  }

  if (!layers.some((layer) => layer.id === activeLayerId)) {
    throw new Error("Invalid True Drawing project: active layer is missing.");
  }

  return {
    layers,
    activeLayerId,
    realisticImage: document.realisticImage === null
      ? null
      : parseRealisticImage(document.realisticImage)
  };
}

function parseDrawingLayer(value: unknown): DrawingLayer {
  const layer = expectObject(value, "layer");

  return {
    id: expectString(layer.id, "layer.id"),
    name: expectString(layer.name, "layer.name"),
    visible: expectBoolean(layer.visible, "layer.visible"),
    opacity: expectUnitNumber(layer.opacity, "layer.opacity"),
    strokes: expectArray(layer.strokes, "layer.strokes").map(parseDrawingStroke)
  };
}

function parseDrawingStroke(value: unknown): DrawingStroke {
  const stroke = expectObject(value, "stroke");
  const tool = expectString(stroke.tool, "stroke.tool");

  if (!isDrawingToolId(tool)) {
    throw new Error("Invalid True Drawing project: unsupported drawing tool.");
  }

  const parsedStroke: DrawingStroke = {
    id: expectString(stroke.id, "stroke.id"),
    tool,
    color: expectString(stroke.color, "stroke.color"),
    size: expectPositiveNumber(stroke.size, "stroke.size"),
    opacity: expectUnitNumber(stroke.opacity, "stroke.opacity"),
    hardness: expectUnitNumber(stroke.hardness, "stroke.hardness"),
    strokeStyle: parseStrokeStyle(stroke.strokeStyle),
    points: expectArray(stroke.points, "stroke.points").map(parseDrawingPoint)
  };

  if (typeof stroke.imageDataUrl === "string") {
    parsedStroke.imageDataUrl = expectImageDataUrl(stroke.imageDataUrl, "stroke.imageDataUrl");
  }

  return parsedStroke;
}

function parseStrokeStyle(value: unknown): DrawingStroke["strokeStyle"] {
  if (value === undefined) {
    return "solid";
  }

  const strokeStyle = expectString(value, "stroke.strokeStyle");

  if (!isStrokeStyleId(strokeStyle)) {
    throw new Error("Invalid True Drawing project: unsupported stroke style.");
  }

  return strokeStyle;
}

function parseDrawingPoint(value: unknown): DrawingPoint {
  const point = expectObject(value, "point");

  return {
    x: expectFiniteNumber(point.x, "point.x"),
    y: expectFiniteNumber(point.y, "point.y"),
    pressure: expectUnitNumber(point.pressure, "point.pressure"),
    timestamp: expectFiniteNumber(point.timestamp, "point.timestamp")
  };
}

function parseRealisticImage(value: unknown): StoredRealisticImage {
  const image = expectObject(value, "realisticImage");
  const realisticImage: StoredRealisticImage = {
    dataUrl: expectImageDataUrl(image.dataUrl, "realisticImage.dataUrl"),
    provider: expectString(image.provider, "realisticImage.provider"),
    model: expectString(image.model, "realisticImage.model"),
    generatedAt: expectIsoDate(image.generatedAt, "realisticImage.generatedAt")
  };

  if (typeof image.revisedPrompt === "string" && image.revisedPrompt.trim().length > 0) {
    realisticImage.revisedPrompt = image.revisedPrompt;
  }

  return realisticImage;
}

function expectObject(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Invalid True Drawing project: ${label} must be an object.`);
  }

  return value as Record<string, unknown>;
}

function expectArray(value: unknown, label: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid True Drawing project: ${label} must be an array.`);
  }

  return value;
}

function expectString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid True Drawing project: ${label} must be a non-empty string.`);
  }

  return value;
}

function expectBoolean(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`Invalid True Drawing project: ${label} must be a boolean.`);
  }

  return value;
}

function expectFiniteNumber(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid True Drawing project: ${label} must be a finite number.`);
  }

  return value;
}

function expectPositiveNumber(value: unknown, label: string): number {
  const number = expectFiniteNumber(value, label);

  if (number <= 0) {
    throw new Error(`Invalid True Drawing project: ${label} must be positive.`);
  }

  return number;
}

function expectUnitNumber(value: unknown, label: string): number {
  const number = expectFiniteNumber(value, label);

  if (number < 0 || number > 1) {
    throw new Error(`Invalid True Drawing project: ${label} must be between 0 and 1.`);
  }

  return number;
}

function expectIsoDate(value: unknown, label: string): string {
  const date = expectString(value, label);

  if (Number.isNaN(Date.parse(date))) {
    throw new Error(`Invalid True Drawing project: ${label} must be a valid date.`);
  }

  return date;
}

function expectImageDataUrl(value: unknown, label: string): string {
  const dataUrl = expectString(value, label);

  if (!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(dataUrl)) {
    throw new Error(`Invalid True Drawing project: ${label} must be an image data URL.`);
  }

  return dataUrl;
}
