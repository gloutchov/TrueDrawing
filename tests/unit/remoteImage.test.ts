import { EventEmitter } from "node:events";
import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({get: vi.fn(), lookup: vi.fn()}));
vi.mock("node:https", () => ({get: mocks.get}));
vi.mock("node:dns", () => ({lookup: mocks.lookup}));
import { downloadRemoteImage } from "../../src/main/security/remoteImage";

beforeEach(() => { vi.clearAllMocks(); vi.useRealTimers(); });
function response(statusCode: number, headers = {}) {
  const stream = Object.assign(new EventEmitter(), {statusCode, headers, destroy: vi.fn(function (error?: Error) {
    if (error) queueMicrotask(() => stream.emit("error", error));
  })});
  return stream;
}
it("rejects redirects instead of following them to a private host", async () => {
  const stream = response(302, {location: "https://127.0.0.1/x"});
  mocks.get.mockImplementation((_url, _options, callback) => {
    queueMicrotask(() => callback(stream)); return new EventEmitter();
  });
  await expect(downloadRemoteImage("https://example.com/x", 10, 100)).rejects.toThrow();
  expect(mocks.get).toHaveBeenCalledTimes(1);
});
it("aborts streamed images that exceed the byte limit without content-length", async () => {
  const stream = response(200);
  mocks.get.mockImplementation((_url, _options, callback) => {
    queueMicrotask(() => { callback(stream); stream.emit("data", Buffer.alloc(101)); });
    return new EventEmitter();
  });
  await expect(downloadRemoteImage("https://example.com/x", 10, 100)).rejects.toThrow("too large");
});
it("checks every DNS result at connection time and rejects mixed private/public results", async () => {
  mocks.lookup.mockImplementation((_host, _options, callback) => callback(null, [
    {address: "8.8.8.8", family: 4}, {address: "10.0.0.1", family: 4}
  ]));
  mocks.get.mockImplementation((_url, options) => {
    const request = new EventEmitter();
    queueMicrotask(() => options.lookup("example.com", {}, (error: Error) => request.emit("error", error)));
    return request;
  });
  await expect(downloadRemoteImage("https://example.com/x", 10, 100)).rejects.toThrow("blocked");
});
it("aborts a stalled response on the overall deadline", async () => {
  vi.useFakeTimers();
  mocks.get.mockImplementation((_url, options) => {
    const request = new EventEmitter();
    options.signal.addEventListener("abort", () => { request.emit("error", new Error("Timeout")); request.emit("close"); });
    return request;
  });
  const result = expect(downloadRemoteImage("https://example.com/x", 50, 100)).rejects.toThrow("Timeout");
  await vi.advanceTimersByTimeAsync(50); await result;
});
