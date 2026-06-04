import { contextBridge, ipcRenderer } from "electron";

import type { AppConfig } from "../shared/config/appConfigSchema";
import type { RuntimeInfo } from "../shared/runtime/runtimeInfo";

const api = {
  getAppConfig: (): Promise<AppConfig> => ipcRenderer.invoke("config:get") as Promise<AppConfig>,
  getRuntimeInfo: (): Promise<RuntimeInfo> => ipcRenderer.invoke("runtime:get") as Promise<RuntimeInfo>
};

contextBridge.exposeInMainWorld("trueDrawing", api);

export type TrueDrawingApi = typeof api;

