import { describe, expect, it, vi } from "vitest";
import { validateImageDataUrl } from "../../src/shared/security/imagePayload";
import { isPublicAddress, validateRemoteImageUrl } from "../../src/main/security/remoteImage";
import { createSanitizedIpcError, isTrustedRendererUrl, sanitizeIpcError, validateIpcSender } from "../../src/main/security/ipcSecurity";
import type { IpcMainInvokeEvent } from "electron";
import { generateOpenAiRealisticImage } from "../../src/main/image-generation/openAiImageAdapter";
import { validateAppConfig } from "../../src/shared/config/appConfigSchema";
import rawConfig from "../../config/app.config.json";

describe("security boundaries", () => {
  it("rejects oversized and malformed image payloads before network work", async () => {
    expect(() => validateImageDataUrl("data:image/png;base64,AQID", 2)).toThrow();
    expect(() => validateImageDataUrl("data:image/png;base64,A===")).toThrow();
    const fetchMock = vi.fn(); const config = validateAppConfig(rawConfig);
    config.imageGeneration.maxImageBytes = 2;
    await expect(generateOpenAiRealisticImage({ canvasDataUrl: "data:image/png;base64,AQID", model: "test", prompt: "test" }, "dummy", config, fetchMock)).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each(["http://example.com/x", "https://localhost/x", "https://127.1/x", "https://[::1]/x", "https://10.0.0.1/x", "https://192.168.1.1/x", "https://user:pass@example.com/x", "https://example.com:8443/x"])("blocks remote URL %s", url => {
    expect(() => validateRemoteImageUrl(url)).toThrow();
  });
  it.each(["127.0.0.1", "172.16.0.1", "169.254.169.254", "100.64.0.1", "0.0.0.0", "::ffff:127.0.0.1", "fd00::1", "fe80::1"])("blocks resolved address %s", address => {
    expect(isPublicAddress(address)).toBe(false);
  });
  it("allows only global addresses and approved top-level IPC origins", () => {
    expect(isPublicAddress("8.8.8.8")).toBe(true);
    expect(isPublicAddress("2606:4700:4700::1111")).toBe(true);
    expect(isTrustedRendererUrl("http://127.0.0.1:5173/", "http://127.0.0.1:5173")).toBe(true);
    expect(isTrustedRendererUrl("http://127.0.0.1:5173/evil", "http://127.0.0.1:5173")).toBe(false);
    expect(isTrustedRendererUrl("https://evil.test/")).toBe(false);
    expect(() => validateIpcSender({senderFrame: {}, sender: {mainFrame: {}}} as IpcMainInvokeEvent)).toThrow();
  });
  it("never exposes arbitrary provider messages, paths or secrets through IPC", () => {
    for (const message of ["Bearer private-token", "/home/user/private/file", "Provider returned a private prompt", "Invalid /workspace/private"]) {
      expect(sanitizeIpcError(new Error(message))).not.toContain(message);
      const rawError = new Error(message, {cause: new Error("private nested cause")});
      rawError.stack = `Private provider stack: ${message}`;
      const publicError = createSanitizedIpcError(rawError);
      expect(publicError.message).not.toContain(message);
      expect(publicError).not.toHaveProperty("cause");
      expect(publicError.stack).not.toContain(rawError.stack);
    }
    expect(sanitizeIpcError(new Error("Invalid clipboard text."))).toBe("Invalid clipboard text.");
  });
  it("prefers base64 and never downloads a supplied URL when base64 is present", async () => {
    const download = vi.fn();
    await generateOpenAiRealisticImage({ canvasDataUrl: "data:image/png;base64,AQID", model: "test", prompt: "test" }, "dummy", validateAppConfig(rawConfig),
      async () => new Response(JSON.stringify({data: [{b64_json: "AQID", url: "https://127.0.0.1/x"}]})), download);
    expect(download).not.toHaveBeenCalled();
  });
});
