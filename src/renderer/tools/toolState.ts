import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { DrawingToolId, DrawingToolPreset, DrawingToolSettings } from "../../shared/drawing/toolTypes";

export function createInitialToolSettings(config: AppConfig): DrawingToolSettings {
  const preset = findToolPreset(config, config.tools.defaultTool);

  return {
    tool: preset.id,
    color: config.tools.defaultColor,
    size: config.tools.defaultSize,
    opacity: config.tools.defaultOpacity,
    hardness: config.tools.defaultBrushHardness
  };
}

export function settingsForSelectedTool(
  config: AppConfig,
  currentSettings: DrawingToolSettings,
  tool: DrawingToolId
): DrawingToolSettings {
  const preset = findToolPreset(config, tool);

  return {
    ...currentSettings,
    tool,
    size: preset.size,
    opacity: preset.opacity,
    hardness: preset.hardness
  };
}

function findToolPreset(config: AppConfig, tool: DrawingToolId): DrawingToolPreset {
  const fallbackPreset = config.tools.presets[0];

  if (!fallbackPreset) {
    throw new Error("True Drawing requires at least one configured drawing tool preset.");
  }

  return config.tools.presets.find((preset) => preset.id === tool) ?? fallbackPreset;
}
