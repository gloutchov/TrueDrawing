import type { AppConfig } from "../../shared/config/appConfigSchema";

export type UiLocaleMode = "system" | "it" | "en";
export type UiThemeMode = "system" | "light" | "dark";
export type EffectiveLocale = "it" | "en";
export type EffectiveTheme = "light" | "dark";

export type UiPreferences = {
  canvasZoom?: number;
  localeMode: UiLocaleMode;
  themeMode: UiThemeMode;
};

export function readUiPreferences(config: AppConfig): UiPreferences {
  try {
    const storedPreferences = JSON.parse(
      window.localStorage.getItem(config.ui.preferencesStorageKey) ?? "{}"
    ) as Partial<UiPreferences>;

    return normalizeUiPreferences(storedPreferences, config);
  } catch {
    return getDefaultUiPreferences(config);
  }
}

export function writeUiPreferences(config: AppConfig, preferences: UiPreferences): void {
  try {
    window.localStorage.setItem(
      config.ui.preferencesStorageKey,
      JSON.stringify(normalizeUiPreferences(preferences, config))
    );
  } catch {
    // UI preferences are intentionally best-effort.
  }
}

export function resolveEffectiveLocale(mode: UiLocaleMode): EffectiveLocale {
  if (mode === "it" || mode === "en") {
    return mode;
  }

  return window.navigator.language.toLowerCase().startsWith("it") ? "it" : "en";
}

export function resolveEffectiveTheme(mode: UiThemeMode): EffectiveTheme {
  if (mode === "light" || mode === "dark") {
    return mode;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function isUiLocaleMode(value: string): value is UiLocaleMode {
  return value === "system" || value === "it" || value === "en";
}

export function isUiThemeMode(value: string): value is UiThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

function getDefaultUiPreferences(config: AppConfig): UiPreferences {
  return {
    localeMode: isUiLocaleMode(config.ui.defaultLocaleMode) ? config.ui.defaultLocaleMode : "system",
    themeMode: isUiThemeMode(config.ui.defaultThemeMode) ? config.ui.defaultThemeMode : "system"
  };
}

function normalizeUiPreferences(
  preferences: Partial<UiPreferences>,
  config: AppConfig
): UiPreferences {
  const defaults = getDefaultUiPreferences(config);
  const localeMode = typeof preferences.localeMode === "string" && isUiLocaleMode(preferences.localeMode)
    ? preferences.localeMode
    : defaults.localeMode;
  const themeMode = typeof preferences.themeMode === "string" && isUiThemeMode(preferences.themeMode)
    ? preferences.themeMode
    : defaults.themeMode;

  return {
    ...preferences,
    localeMode,
    themeMode
  };
}
