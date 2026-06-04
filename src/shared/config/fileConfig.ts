import fs from "node:fs";

import { validateAppConfig, type AppConfig } from "./appConfigSchema";

export function loadAppConfigFromFile(configPath: string): AppConfig {
  const rawConfig = fs.readFileSync(configPath, "utf8");
  const parsedConfig: unknown = JSON.parse(rawConfig);

  return validateAppConfig(parsedConfig);
}

