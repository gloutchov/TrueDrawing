import type { DrawingToolId, DrawingToolPreset } from "../drawing/toolTypes";
import { isDrawingToolId } from "../drawing/toolTypes";

export type AppConfig = {
  app: {
    name: string;
    defaultLocale: string;
    autosaveIntervalMs: number;
    historyLimit: number;
  };
  window: {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
  };
  layout: {
    topBarHeight: number;
    toolRailWidth: number;
    sidePanelWidth: number;
    workspacePadding: number;
  };
  canvas: {
    defaultWidth: number;
    defaultHeight: number;
    backgroundColor: string;
    maxZoom: number;
    minZoom: number;
    maxPixelRatio: number;
    minPointDistance: number;
    strokeSmoothing: number;
    defaultPointerPressure: number;
  };
  tools: {
    defaultTool: DrawingToolId;
    defaultColor: string;
    defaultSize: number;
    defaultOpacity: number;
    defaultBrushHardness: number;
    pressureMinSizeFactor: number;
    pressureMaxSizeFactor: number;
    sizeRange: NumberRange;
    opacityRange: NumberRange;
    hardnessRange: NumberRange;
    presets: DrawingToolPreset[];
  };
  layers: {
    defaultLayerName: string;
    newLayerNamePrefix: string;
    defaultOpacity: number;
    maxLayers: number;
    opacityRange: NumberRange;
  };
  imageGeneration: {
    defaultProvider: string;
    defaultModel: string;
    timeoutMs: number;
    defaultOutputFormat: string;
  };
  files: {
    canvasSuffix: string;
    imageSuffix: string;
    projectExtension: string;
    canvasExportExtension: string;
    imageExportExtension: string;
  };
};

type ObjectRecord = Record<string, unknown>;
type NumberRange = {
  min: number;
  max: number;
  step: number;
};

export function validateAppConfig(value: unknown): AppConfig {
  const config = expectObject(value, "config");
  const app = expectObject(config.app, "app");
  const windowConfig = expectObject(config.window, "window");
  const layout = expectObject(config.layout, "layout");
  const canvas = expectObject(config.canvas, "canvas");
  const tools = expectObject(config.tools, "tools");
  const layers = expectObject(config.layers, "layers");
  const imageGeneration = expectObject(config.imageGeneration, "imageGeneration");
  const files = expectObject(config.files, "files");

  return {
    app: {
      name: expectString(app.name, "app.name"),
      defaultLocale: expectString(app.defaultLocale, "app.defaultLocale"),
      autosaveIntervalMs: expectPositiveNumber(app.autosaveIntervalMs, "app.autosaveIntervalMs"),
      historyLimit: expectPositiveNumber(app.historyLimit, "app.historyLimit")
    },
    window: {
      width: expectPositiveNumber(windowConfig.width, "window.width"),
      height: expectPositiveNumber(windowConfig.height, "window.height"),
      minWidth: expectPositiveNumber(windowConfig.minWidth, "window.minWidth"),
      minHeight: expectPositiveNumber(windowConfig.minHeight, "window.minHeight")
    },
    layout: {
      topBarHeight: expectPositiveNumber(layout.topBarHeight, "layout.topBarHeight"),
      toolRailWidth: expectPositiveNumber(layout.toolRailWidth, "layout.toolRailWidth"),
      sidePanelWidth: expectPositiveNumber(layout.sidePanelWidth, "layout.sidePanelWidth"),
      workspacePadding: expectPositiveNumber(layout.workspacePadding, "layout.workspacePadding")
    },
    canvas: {
      defaultWidth: expectPositiveNumber(canvas.defaultWidth, "canvas.defaultWidth"),
      defaultHeight: expectPositiveNumber(canvas.defaultHeight, "canvas.defaultHeight"),
      backgroundColor: expectString(canvas.backgroundColor, "canvas.backgroundColor"),
      maxZoom: expectPositiveNumber(canvas.maxZoom, "canvas.maxZoom"),
      minZoom: expectPositiveNumber(canvas.minZoom, "canvas.minZoom"),
      maxPixelRatio: expectPositiveNumber(canvas.maxPixelRatio, "canvas.maxPixelRatio"),
      minPointDistance: expectPositiveNumber(canvas.minPointDistance, "canvas.minPointDistance"),
      strokeSmoothing: expectUnitNumber(canvas.strokeSmoothing, "canvas.strokeSmoothing"),
      defaultPointerPressure: expectUnitNumber(canvas.defaultPointerPressure, "canvas.defaultPointerPressure")
    },
    tools: {
      defaultTool: expectDrawingToolId(tools.defaultTool, "tools.defaultTool"),
      defaultColor: expectString(tools.defaultColor, "tools.defaultColor"),
      defaultSize: expectPositiveNumber(tools.defaultSize, "tools.defaultSize"),
      defaultOpacity: expectUnitNumber(tools.defaultOpacity, "tools.defaultOpacity"),
      defaultBrushHardness: expectUnitNumber(tools.defaultBrushHardness, "tools.defaultBrushHardness"),
      pressureMinSizeFactor: expectPositiveNumber(tools.pressureMinSizeFactor, "tools.pressureMinSizeFactor"),
      pressureMaxSizeFactor: expectPositiveNumber(tools.pressureMaxSizeFactor, "tools.pressureMaxSizeFactor"),
      sizeRange: expectNumberRange(tools.sizeRange, "tools.sizeRange", false),
      opacityRange: expectNumberRange(tools.opacityRange, "tools.opacityRange", true),
      hardnessRange: expectNumberRange(tools.hardnessRange, "tools.hardnessRange", true),
      presets: expectToolPresets(tools.presets, "tools.presets")
    },
    layers: {
      defaultLayerName: expectString(layers.defaultLayerName, "layers.defaultLayerName"),
      newLayerNamePrefix: expectString(layers.newLayerNamePrefix, "layers.newLayerNamePrefix"),
      defaultOpacity: expectUnitNumber(layers.defaultOpacity, "layers.defaultOpacity"),
      maxLayers: expectPositiveInteger(layers.maxLayers, "layers.maxLayers"),
      opacityRange: expectNumberRange(layers.opacityRange, "layers.opacityRange", true)
    },
    imageGeneration: {
      defaultProvider: expectString(imageGeneration.defaultProvider, "imageGeneration.defaultProvider"),
      defaultModel: expectString(imageGeneration.defaultModel, "imageGeneration.defaultModel"),
      timeoutMs: expectPositiveNumber(imageGeneration.timeoutMs, "imageGeneration.timeoutMs"),
      defaultOutputFormat: expectString(imageGeneration.defaultOutputFormat, "imageGeneration.defaultOutputFormat")
    },
    files: {
      canvasSuffix: expectString(files.canvasSuffix, "files.canvasSuffix"),
      imageSuffix: expectString(files.imageSuffix, "files.imageSuffix"),
      projectExtension: expectString(files.projectExtension, "files.projectExtension"),
      canvasExportExtension: expectString(files.canvasExportExtension, "files.canvasExportExtension"),
      imageExportExtension: expectString(files.imageExportExtension, "files.imageExportExtension")
    }
  };
}

function expectObject(value: unknown, label: string): ObjectRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Invalid app configuration: ${label} must be an object.`);
  }

  return value as ObjectRecord;
}

function expectString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid app configuration: ${label} must be a non-empty string.`);
  }

  return value;
}

function expectDrawingToolId(value: unknown, label: string): DrawingToolId {
  const tool = expectString(value, label);

  if (!isDrawingToolId(tool)) {
    throw new Error(`Invalid app configuration: ${label} must be a supported drawing tool.`);
  }

  return tool;
}

function expectPositiveNumber(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`Invalid app configuration: ${label} must be a positive number.`);
  }

  return value;
}

function expectPositiveInteger(value: unknown, label: string): number {
  const number = expectPositiveNumber(value, label);

  if (!Number.isInteger(number)) {
    throw new Error(`Invalid app configuration: ${label} must be an integer.`);
  }

  return number;
}

function expectUnitNumber(value: unknown, label: string): number {
  const number = expectPositiveNumber(value, label);

  if (number > 1) {
    throw new Error(`Invalid app configuration: ${label} must be between 0 and 1.`);
  }

  return number;
}

function expectNumberRange(value: unknown, label: string, unitRange: boolean): NumberRange {
  const range = expectObject(value, label);
  const min = unitRange
    ? expectUnitNumber(range.min, `${label}.min`)
    : expectPositiveNumber(range.min, `${label}.min`);
  const max = unitRange
    ? expectUnitNumber(range.max, `${label}.max`)
    : expectPositiveNumber(range.max, `${label}.max`);
  const step = expectPositiveNumber(range.step, `${label}.step`);

  if (max < min) {
    throw new Error(`Invalid app configuration: ${label}.max must be greater than or equal to ${label}.min.`);
  }

  return { min, max, step };
}

function expectToolPresets(value: unknown, label: string): DrawingToolPreset[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Invalid app configuration: ${label} must be a non-empty array.`);
  }

  return value.map((presetValue, index) => {
    const presetLabel = `${label}[${index}]`;
    const preset = expectObject(presetValue, presetLabel);

    return {
      id: expectDrawingToolId(preset.id, `${presetLabel}.id`),
      label: expectString(preset.label, `${presetLabel}.label`),
      size: expectPositiveNumber(preset.size, `${presetLabel}.size`),
      opacity: expectUnitNumber(preset.opacity, `${presetLabel}.opacity`),
      hardness: expectUnitNumber(preset.hardness, `${presetLabel}.hardness`)
    };
  });
}
