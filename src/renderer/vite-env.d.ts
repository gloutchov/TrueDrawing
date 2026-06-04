/// <reference types="vite/client" />

import type { AppConfig } from "../shared/config/appConfigSchema";
import type { RuntimeInfo } from "../shared/runtime/runtimeInfo";

declare global {
  interface Window {
    trueDrawing: {
      getAppConfig: () => Promise<AppConfig>;
      getRuntimeInfo: () => Promise<RuntimeInfo>;
    };
  }
}
