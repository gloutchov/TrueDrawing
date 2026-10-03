import { EventEmitter } from "node:events";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BrowserWindow } from "electron";

const { showMessageBoxSync } = vi.hoisted(() => ({ showMessageBoxSync: vi.fn() }));
vi.mock("electron", () => ({ dialog: { showMessageBoxSync } }));

import { installCloseConfirmation } from "../../src/main/windows/closeConfirmation";

function createWindow() {
  const webContents = new EventEmitter();
  const window = {
    webContents,
    isMinimized: vi.fn(() => false),
    restore: vi.fn(),
    show: vi.fn(),
    focus: vi.fn()
  };
  return { window, nativeWindow: window as unknown as BrowserWindow };
}

describe("unsaved document close confirmation", () => {
  beforeEach(() => showMessageBoxSync.mockReset());

  it.each([0, -1, 2])("keeps the document open unless discard is explicit (response %s)", (choice) => {
    const { window, nativeWindow } = createWindow();
    installCloseConfirmation(nativeWindow, () => "en");
    showMessageBoxSync.mockReturnValue(choice);
    const event = { preventDefault: vi.fn() };

    window.webContents.emit("will-prevent-unload", event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(showMessageBoxSync).toHaveBeenCalledWith(nativeWindow, expect.objectContaining({
      buttons: ["Cancel", "Close without saving"], defaultId: 0, cancelId: 0
    }));
  });

  it("allows only the current request after explicit discard, and asks again on later requests", () => {
    const { window, nativeWindow } = createWindow();
    installCloseConfirmation(nativeWindow, () => "en");
    showMessageBoxSync.mockReturnValueOnce(0).mockReturnValueOnce(1).mockReturnValueOnce(0);
    const attempts = Array.from({ length: 3 }, () => ({ preventDefault: vi.fn() }));
    for (const event of attempts) window.webContents.emit("will-prevent-unload", event);

    expect(attempts[0].preventDefault).not.toHaveBeenCalled();
    expect(attempts[1].preventDefault).toHaveBeenCalledOnce();
    expect(attempts[2].preventDefault).not.toHaveBeenCalled();
    expect(showMessageBoxSync).toHaveBeenCalledTimes(3);
  });

  it("uses the current UI language and brings a minimized window forward", () => {
    const { window, nativeWindow } = createWindow();
    let locale: "it" | "en" = "en";
    installCloseConfirmation(nativeWindow, () => locale);
    showMessageBoxSync.mockReturnValue(0);
    window.webContents.emit("will-prevent-unload", { preventDefault: vi.fn() });
    locale = "it";
    window.isMinimized.mockReturnValue(true);
    window.webContents.emit("will-prevent-unload", { preventDefault: vi.fn() });

    expect(showMessageBoxSync).toHaveBeenLastCalledWith(nativeWindow, expect.objectContaining({
      buttons: ["Annulla", "Chiudi senza salvare"], message: "Il documento contiene modifiche non salvate."
    }));
    expect(window.restore).toHaveBeenCalledOnce();
    expect(window.show).toHaveBeenCalledTimes(2);
    expect(window.focus).toHaveBeenCalledTimes(2);
  });

  it("avoids duplicate confirmations during a pending native dialog", () => {
    const { window, nativeWindow } = createWindow();
    installCloseConfirmation(nativeWindow, () => "en");
    const nested = { preventDefault: vi.fn() };
    showMessageBoxSync.mockImplementation(() => {
      window.webContents.emit("will-prevent-unload", nested);
      return 0;
    });
    window.webContents.emit("will-prevent-unload", { preventDefault: vi.fn() });

    expect(showMessageBoxSync).toHaveBeenCalledOnce();
    expect(nested.preventDefault).not.toHaveBeenCalled();
  });

  it("does not ask when the renderer permits unloading", () => {
    const { window, nativeWindow } = createWindow();
    installCloseConfirmation(nativeWindow, () => "en");
    window.webContents.emit("close", { preventDefault: vi.fn() });
    expect(showMessageBoxSync).not.toHaveBeenCalled();
  });
});
