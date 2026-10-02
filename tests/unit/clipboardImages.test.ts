import { describe, expect, it, vi, beforeEach } from "vitest";
import { defaultMaxImageBytes } from "../../src/shared/security/imagePayload";

const mocks = vi.hoisted(() => ({ read: vi.fn(), write: vi.fn(), decodeUrl: vi.fn(), decodeBuffer: vi.fn() }));
vi.mock("electron", () => ({
  clipboard: { read: mocks.read, write: mocks.write },
  nativeImage: { createFromDataURL: mocks.decodeUrl, createFromBuffer: mocks.decodeBuffer },
  ClipboardItem: class {
    types: string[];
    constructor(readonly items: Record<string, Blob>) { this.types = Object.keys(items); }
    getType(type: string) { return Promise.resolve(this.items[type]); }
  }
}));
import { readClipboardPng, writeClipboardPng } from "../../src/main/clipboard/clipboardImages";

const pngUrl = "data:image/png;base64,AQID";
beforeEach(() => vi.resetAllMocks());

describe("Electron 44 image clipboard", () => {
  it("writes normalized PNG through ClipboardItem and propagates asynchronous failures", async () => {
    mocks.decodeUrl.mockReturnValue({ isEmpty: () => false, toPNG: () => Buffer.from([1, 2, 3]) });
    mocks.write.mockResolvedValue(undefined);
    await writeClipboardPng(pngUrl);
    const item = mocks.write.mock.calls[0][0][0];
    expect(item.types).toEqual(["image/png"]);
    expect(Array.from(new Uint8Array(await item.items["image/png"].arrayBuffer()))).toEqual([1, 2, 3]);
    mocks.write.mockRejectedValue(new Error("native clipboard failure"));
    await expect(writeClipboardPng(pngUrl)).rejects.toThrow("native clipboard failure");
  });

  it("rejects malformed, undecodable and oversized images before clipboard writes", async () => {
    await expect(writeClipboardPng("invalid")).rejects.toThrow();
    mocks.decodeUrl.mockReturnValue({ isEmpty: () => true });
    await expect(writeClipboardPng(pngUrl)).rejects.toThrow("Invalid clipboard image.");
    mocks.decodeUrl.mockReturnValue({ isEmpty: () => false, toPNG: () => ({ byteLength: defaultMaxImageBytes + 1 }) });
    await expect(writeClipboardPng(pngUrl)).rejects.toThrow("Clipboard image is too large.");
    expect(mocks.write).not.toHaveBeenCalled();
  });

  it("reads only PNG items and decodes their bounded bytes", async () => {
    mocks.read.mockResolvedValue([{ types: ["text/plain"] }]);
    expect(await readClipboardPng()).toBeNull();
    const blob = new Blob([new Uint8Array([1, 2, 3])], { type: "image/png" });
    mocks.read.mockResolvedValue([{ types: ["image/png"], getType: () => Promise.resolve(blob) }]);
    mocks.decodeBuffer.mockReturnValue({ isEmpty: () => false, toDataURL: () => pngUrl });
    expect(await readClipboardPng()).toBe(pngUrl);
    expect(mocks.decodeBuffer).toHaveBeenCalledWith(Buffer.from([1, 2, 3]));
  });

  it("checks Blob size before allocating image bytes", async () => {
    const blob = new Blob(["x"], { type: "image/png" });
    Object.defineProperty(blob, "size", {value: defaultMaxImageBytes + 1});
    const arrayBuffer = vi.spyOn(blob, "arrayBuffer");
    mocks.read.mockResolvedValue([{ types: ["image/png"], getType: () => Promise.resolve(blob) }]);
    await expect(readClipboardPng()).rejects.toThrow("Clipboard image is too large.");
    expect(arrayBuffer).not.toHaveBeenCalled();
    expect(mocks.decodeBuffer).not.toHaveBeenCalled();
  });
});
