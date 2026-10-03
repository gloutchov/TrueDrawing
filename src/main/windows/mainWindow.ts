import { BrowserWindow } from "electron";
import path from "node:path";

import { getAppIconPath } from "../appIcon";
import { installCloseConfirmation } from "./closeConfirmation";
import type { AppConfig } from "../../shared/config/appConfigSchema";

export function createMainWindow(config: AppConfig, getLocale: () => "it" | "en"): BrowserWindow {
  const appRoot = path.join(__dirname, "..", "..", "..");
  const window = new BrowserWindow({
    title: config.app.name,
    icon: getAppIconPath(),
    width: config.window.width,
    height: config.window.height,
    minWidth: config.window.minWidth,
    minHeight: config.window.minHeight,
    backgroundColor: config.canvas.backgroundColor,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(appRoot, "dist-electron", "preload", "index.js"),
      sandbox: true
    }
  });

  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", event => event.preventDefault());
  window.webContents.on("will-attach-webview", event => event.preventDefault());
  installCloseConfirmation(window, getLocale);

  if (process.env.VITE_DEV_SERVER_URL) {
    void window.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    void window.loadFile(path.join(appRoot, "dist", "renderer", "index.html"));
  }

  return window;
}
