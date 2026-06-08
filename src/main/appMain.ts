import { app, BrowserWindow } from "electron";

import { createAppIcon } from "./appIcon";
import { loadDesktopAppConfig } from "./config/desktopConfig";
import { registerIpc } from "./ipc/registerIpc";
import { installAppMenu } from "./menu/appMenu";
import { createApiKeyStore } from "./secret-store/apiKeyStore";
import { createMainWindow } from "./windows/mainWindow";
import type { AppConfig } from "../shared/config/appConfigSchema";

let appConfig: AppConfig | null = null;

app.whenReady().then(() => {
  appConfig = loadDesktopAppConfig();

  if (process.platform === "darwin" && app.dock) {
    app.dock.setIcon(createAppIcon());
  }

  installAppMenu(appConfig);
  registerIpc({
    getConfig: () => requireAppConfig(),
    getRuntimeInfo: () => ({
      appVersion: app.getVersion(),
      platform: process.platform
    }),
    apiKeyStore: createApiKeyStore()
  });
  createMainWindow(appConfig);

  app.on("activate", () => {
    if (appConfig && BrowserWindow.getAllWindows().length === 0) {
      createMainWindow(appConfig);
    }
  });
}).catch((error: unknown) => {
  console.error("Failed to start True Drawing.", error);
  app.quit();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function requireAppConfig(): AppConfig {
  if (!appConfig) {
    throw new Error("App configuration is not loaded.");
  }

  return appConfig;
}
