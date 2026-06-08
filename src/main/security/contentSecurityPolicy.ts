import { session } from "electron";

import type { AppConfig } from "../../shared/config/appConfigSchema";
import { buildContentSecurityPolicy } from "../../shared/security/contentSecurityPolicy";

export function installContentSecurityPolicy(config: AppConfig, developmentMode: boolean): void {
  const policy = buildContentSecurityPolicy(config, developmentMode);

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [policy]
      }
    });
  });
}
