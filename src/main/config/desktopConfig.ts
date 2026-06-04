import { app } from "electron";
import path from "node:path";

import { loadAppConfigFromFile } from "../../shared/config/fileConfig";
import type { AppConfig } from "../../shared/config/appConfigSchema";

export function loadDesktopAppConfig(): AppConfig {
  return loadAppConfigFromFile(path.join(app.getAppPath(), "config", "app.config.json"));
}

