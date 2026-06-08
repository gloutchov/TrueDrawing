import type { AppConfig } from "../config/appConfigSchema";

export function buildContentSecurityPolicy(config: AppConfig, developmentMode: boolean): string {
  const connectSources = ["'self'", config.imageGeneration.baseUrl];

  if (developmentMode) {
    connectSources.push("http://127.0.0.1:5173", "ws://127.0.0.1:5173");
  }

  const scriptSources = developmentMode
    ? ["'self'", "'unsafe-eval'", "'unsafe-inline'"]
    : ["'self'"];

  return [
    "default-src 'self'",
    `script-src ${scriptSources.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    `connect-src ${connectSources.join(" ")}`,
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'"
  ].join("; ");
}
