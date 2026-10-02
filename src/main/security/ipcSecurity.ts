import type { IpcMainInvokeEvent } from "electron";
import { pathToFileURL } from "node:url";
import path from "node:path";

export function isTrustedRendererUrl(url: string, developmentUrl?: string): boolean {
  try {
    const candidate = new URL(url);
    const production = pathToFileURL(path.join(__dirname, "../../../dist/renderer/index.html"));
    const expected = developmentUrl ? new URL(developmentUrl) : production;
    return candidate.protocol === expected.protocol && candidate.host === expected.host
      && candidate.pathname === expected.pathname && !candidate.username && !candidate.password;
  } catch { return false; }
}

export function validateIpcSender(event: IpcMainInvokeEvent): void {
  if (!event.senderFrame || event.senderFrame !== event.sender.mainFrame
    || !isTrustedRendererUrl(event.senderFrame.url, process.env.VITE_DEV_SERVER_URL)) {
    throw new Error("Untrusted IPC sender.");
  }
}

export function sanitizeIpcError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  // Only controlled validation/status messages cross the privilege boundary.
  if (/^(Invalid |Image payload |Untrusted IPC |OpenAI API key is not configured\.|OpenAI image generation failed with status \d+\.|Image generation timed out\.|Remote image |Clipboard image is too large\.)/.test(message)
    && !/(sk-|Bearer|[A-Z]:[\\/]|\/home\/|\/Users\/|\/workspace\/|https?:)/i.test(message)
    && message.length < 200) return message;
  return "The operation could not be completed. Check your settings and try again.";
}
