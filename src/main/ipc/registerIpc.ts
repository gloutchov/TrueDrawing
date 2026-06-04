import { ipcMain } from "electron";

import type { AppConfig } from "../../shared/config/appConfigSchema";
import type { RuntimeInfo } from "../../shared/runtime/runtimeInfo";

type RegisterIpcOptions = {
  getConfig: () => AppConfig;
  getRuntimeInfo: () => RuntimeInfo;
};

export function registerIpc({ getConfig, getRuntimeInfo }: RegisterIpcOptions): void {
  ipcMain.handle("config:get", () => getConfig());
  ipcMain.handle("runtime:get", () => getRuntimeInfo());
}

