import { describe, expect, it } from "vitest";

import { buildContentSecurityPolicy } from "../../src/shared/security/contentSecurityPolicy";
import type { AppConfig } from "../../src/shared/config/appConfigSchema";

const config = {
  imageGeneration: {
    baseUrl: "https://api.openai.com/v1"
  }
} as AppConfig;

describe("content security policy", () => {
  it("denies production renderer network, frames and workers", () => {
    const policy = buildContentSecurityPolicy(config, false);

    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("connect-src 'none'");
    expect(policy).toContain("frame-src 'none'");
    expect(policy).toContain("worker-src 'none'");
    expect(policy).not.toContain("unsafe-eval");
  });

  it("allows Vite dev server connections only in development mode", () => {
    const policy = buildContentSecurityPolicy(config, true);

    expect(policy).toContain("http://127.0.0.1:5173");
    expect(policy).toContain("ws://127.0.0.1:5173");
    expect(policy).toContain("'unsafe-eval'");
    expect(policy).toContain("'unsafe-inline'");
  });
});
