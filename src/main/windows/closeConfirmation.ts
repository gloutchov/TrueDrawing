import { dialog, type BrowserWindow } from "electron";

type CloseLocale = "it" | "en";

const closeText = {
  it: {
    title: "Chiudi True Drawing",
    message: "Il documento contiene modifiche non salvate.",
    detail: "Per conservarle, premi Annulla e usa File > Salva prima di chiudere. Chiudi senza salvare perde le modifiche successive all'ultimo salvataggio.",
    cancel: "Annulla",
    discard: "Chiudi senza salvare"
  },
  en: {
    title: "Close True Drawing",
    message: "The document has unsaved changes.",
    detail: "To keep them, press Cancel and use File > Save before closing. Close without saving loses changes since the last save.",
    cancel: "Cancel",
    discard: "Close without saving"
  }
} as const;

export function installCloseConfirmation(window: BrowserWindow, getLocale: () => CloseLocale): void {
  let confirmationOpen = false;

  window.webContents.on("will-prevent-unload", (event) => {
    if (confirmationOpen) {
      return;
    }

    confirmationOpen = true;
    try {
      const labels = closeText[getLocale()];
      if (window.isMinimized()) {
        window.restore();
      }
      window.show();
      window.focus();

      // Electron requires this decision before the event handler returns.
      const choice = dialog.showMessageBoxSync(window, {
        type: "warning",
        title: labels.title,
        message: labels.message,
        detail: labels.detail,
        buttons: [labels.cancel, labels.discard],
        defaultId: 0,
        cancelId: 0,
        noLink: true
      });

      if (choice === 1) {
        // For will-prevent-unload, preventDefault authorizes the requested close.
        event.preventDefault();
      }
    } finally {
      confirmationOpen = false;
    }
  });
}
