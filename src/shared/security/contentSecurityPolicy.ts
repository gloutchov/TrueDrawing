import type { AppConfig } from "../config/appConfigSchema";

export function buildContentSecurityPolicy(_config: AppConfig, developmentMode: boolean): string {
  const connectSources = [] as string[];

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
    `connect-src ${connectSources.length ? connectSources.join(" ") : "'none'"}`,
    "font-src 'self' data:",
    "object-src 'none'",
    "frame-src 'none'",
    "worker-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'"
  ].join("; ");
}
