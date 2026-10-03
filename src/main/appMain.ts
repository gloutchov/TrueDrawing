import { app, BrowserWindow } from "electron";

import { createAppIcon } from "./appIcon";
import { loadDesktopAppConfig } from "./config/desktopConfig";
import { registerIpc } from "./ipc/registerIpc";
import { installAppMenu } from "./menu/appMenu";
import { createImageGenerationPreferencesStore } from "./preferences/imageGenerationPreferencesStore";
import { createDocumentStore } from "./project/documentStore";
import { installContentSecurityPolicy } from "./security/contentSecurityPolicy";
import { createApiKeyStore } from "./secret-store/apiKeyStore";
import { createMainWindow } from "./windows/mainWindow";
import type { AppConfig } from "../shared/config/appConfigSchema";

let appConfig: AppConfig | null = null;
let uiLocale: "it" | "en" = "en";

app.whenReady().then(() => {
  appConfig = loadDesktopAppConfig();
  uiLocale = app.getLocale().toLowerCase().startsWith("it") ? "it" : "en";

  if (process.platform === "darwin" && app.dock) {
    app.dock.setIcon(createAppIcon());
  }

  installAppMenu(appConfig, uiLocale);
  installContentSecurityPolicy(appConfig, Boolean(process.env.VITE_DEV_SERVER_URL));
  registerIpc({
    getConfig: () => requireAppConfig(),
    getRuntimeInfo: () => ({
      appVersion: app.getVersion(),
      platform: process.platform
    }),
    onUiLocaleChange: (locale) => {
      uiLocale = locale;
      installAppMenu(requireAppConfig(), locale);
    },
    apiKeyStore: createApiKeyStore(),
    preferencesStore: createImageGenerationPreferencesStore(
      app.getPath("userData"),
      () => requireAppConfig()
    ),
    documentStore: createDocumentStore(app.getPath("userData"), () => requireAppConfig())
  });
  createMainWindow(appConfig, () => uiLocale);

  app.on("activate", () => {
    if (appConfig && BrowserWindow.getAllWindows().length === 0) {
      createMainWindow(appConfig, () => uiLocale);
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
