import { BrowserWindow, Menu, app, type MenuItemConstructorOptions } from "electron";

import { createAppIcon, getAppIconPath } from "../appIcon";
import type { AppConfig } from "../../shared/config/appConfigSchema";

let infoWindow: BrowserWindow | null = null;

type MenuLocale = "it" | "en";

const menuText = {
  it: {
    file: "File",
    new: "Nuovo",
    open: "Apri",
    save: "Salva",
    saveAs: "Salva con nome...",
    exportCanvasPng: "Esporta canvas PNG",
    exportCanvasWebp: "Esporta canvas WebP",
    exportImagePng: "Esporta immagine PNG",
    exportImageWebp: "Esporta immagine WebP",
    close: "Chiudi",
    settings: "Impostazioni",
    interface: "Interfaccia...",
    style: "Stile...",
    autoRedraw: "Redraw automatico...",
    exit: "Esci",
    edit: "Modifica",
    undo: "Annulla",
    redo: "Ripristina",
    cut: "Taglia",
    copy: "Copia",
    paste: "Incolla",
    crop: "Ritaglia",
    view: "Vista",
    resetZoom: "Reset zoom canvas",
    zoomIn: "Aumenta zoom canvas",
    zoomOut: "Riduci zoom canvas",
    fullscreen: "Schermo intero",
    help: "Aiuto",
    info: "Info"
  },
  en: {
    file: "File",
    new: "New",
    open: "Open",
    save: "Save",
    saveAs: "Save as...",
    exportCanvasPng: "Export canvas PNG",
    exportCanvasWebp: "Export canvas WebP",
    exportImagePng: "Export image PNG",
    exportImageWebp: "Export image WebP",
    close: "Close",
    settings: "Settings",
    interface: "Interface...",
    style: "Style...",
    autoRedraw: "Auto redraw...",
    exit: "Exit",
    edit: "Edit",
    undo: "Undo",
    redo: "Redo",
    cut: "Cut",
    copy: "Copy",
    paste: "Paste",
    crop: "Crop",
    view: "View",
    resetZoom: "Reset canvas zoom",
    zoomIn: "Zoom canvas in",
    zoomOut: "Zoom canvas out",
    fullscreen: "Toggle fullscreen",
    help: "Help",
    info: "Info"
  }
} as const;

export function installAppMenu(config: AppConfig, locale: MenuLocale = resolveSystemMenuLocale()): void {
  const labels = menuText[locale];
  const template: MenuItemConstructorOptions[] = [
    {
      label: labels.file,
      submenu: [
        {
          label: labels.new,
          accelerator: "CmdOrCtrl+N",
          click: () => sendFileCommand("new")
        },
        {
          label: labels.open,
          accelerator: "CmdOrCtrl+O",
          click: () => sendFileCommand("open")
        },
        {
          label: labels.save,
          accelerator: "CmdOrCtrl+S",
          click: () => sendFileCommand("save")
        },
        {
          label: labels.saveAs,
          accelerator: "CmdOrCtrl+Shift+S",
          click: () => sendFileCommand("save-as")
        },
        { type: "separator" },
        {
          label: labels.exportCanvasPng,
          click: () => sendFileCommand("export-canvas-png")
        },
        {
          label: labels.exportCanvasWebp,
          click: () => sendFileCommand("export-canvas-webp")
        },
        {
          label: labels.exportImagePng,
          click: () => sendFileCommand("export-image-png")
        },
        {
          label: labels.exportImageWebp,
          click: () => sendFileCommand("export-image-webp")
        },
        {
          label: labels.close,
          role: "close"
        },
        { type: "separator" },
        {
          label: labels.settings,
          submenu: [
            {
              label: labels.interface,
              click: () => sendSettingsCommand("interface")
            },
            {
              label: "API Key...",
              accelerator: "CmdOrCtrl+,",
              click: () => sendSettingsCommand("api-key")
            },
            {
              label: labels.style,
              click: () => sendSettingsCommand("image-style")
            },
            {
              label: labels.autoRedraw,
              click: () => sendSettingsCommand("auto-redraw")
            }
          ]
        },
        { type: "separator" },
        {
          label: labels.exit,
          role: "quit"
        }
      ]
    },
    {
      label: labels.edit,
      submenu: [
        {
          label: labels.undo,
          accelerator: "CmdOrCtrl+Z",
          click: () => sendEditCommand("undo")
        },
        {
          label: labels.redo,
          accelerator: "CmdOrCtrl+Shift+Z",
          click: () => sendEditCommand("redo")
        },
        { type: "separator" },
        {
          label: labels.cut,
          accelerator: "CmdOrCtrl+X",
          click: () => sendEditCommand("cut")
        },
        {
          label: labels.copy,
          accelerator: "CmdOrCtrl+C",
          click: () => sendEditCommand("copy")
        },
        {
          label: labels.paste,
          accelerator: "CmdOrCtrl+V",
          click: () => sendEditCommand("paste")
        },
        { type: "separator" },
        {
          label: labels.crop,
          accelerator: "CmdOrCtrl+Shift+X",
          click: () => sendEditCommand("crop")
        }
      ]
    },
    {
      label: labels.view,
      submenu: [
        {
          label: labels.resetZoom,
          accelerator: "CmdOrCtrl+0",
          click: () => sendViewCommand("canvas-zoom-reset")
        },
        {
          label: labels.zoomIn,
          accelerator: "CmdOrCtrl+=",
          click: () => sendViewCommand("canvas-zoom-in")
        },
        {
          label: labels.zoomOut,
          accelerator: "CmdOrCtrl+-",
          click: () => sendViewCommand("canvas-zoom-out")
        },
        { type: "separator" },
        {
          label: labels.fullscreen,
          accelerator: process.platform === "darwin" ? "Ctrl+Command+F" : "F11",
          click: () => toggleFocusedWindowFullscreen()
        }
      ]
    },
    {
      label: labels.help,
      submenu: [
        {
          label: labels.info,
          click: () => {
            showInfoWindow(config);
          }
        }
      ]
    }
  ];

  if (process.platform === "darwin") {
    app.setAboutPanelOptions({
      applicationName: config.app.name,
      applicationVersion: app.getVersion(),
      copyright: "Copyright © 2026 Gloutchov",
      iconPath: getAppIconPath()
    });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function sendFileCommand(command: string): void {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send("file:command", command);
  });
}

function sendEditCommand(command: string): void {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send("edit:command", command);
  });
}

function sendViewCommand(command: string): void {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send("view:command", command);
  });
}

function resolveSystemMenuLocale(): MenuLocale {
  return app.getLocale().toLowerCase().startsWith("it") ? "it" : "en";
}

function sendSettingsCommand(command: string): void {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send("settings:command", command);
  });
}

function toggleFocusedWindowFullscreen(): void {
  const window = BrowserWindow.getFocusedWindow();

  if (!window) {
    return;
  }

  window.setFullScreen(!window.isFullScreen());
}

function showInfoWindow(config: AppConfig): void {
  if (infoWindow) {
    infoWindow.focus();
    return;
  }

  const parent = BrowserWindow.getFocusedWindow() ?? undefined;

  infoWindow = new BrowserWindow({
    title: "Info",
    width: 360,
    height: 300,
    useContentSize: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    parent,
    modal: false,
    backgroundColor: "#fcf6ef",
    icon: getAppIconPath(),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  infoWindow.setMenu(null);
  infoWindow.setMenuBarVisibility(false);

  infoWindow.on("closed", () => {
    infoWindow = null;
  });

  infoWindow.loadURL(createInfoWindowUrl(config)).catch((error: unknown) => {
    console.error("Failed to open Info window.", error);
  });
}

function createInfoWindowUrl(config: AppConfig): string {
  const icon = createAppIcon().resize({ width: 96, height: 96 }).toDataURL();
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Info</title>
    <style>
      :root {
        color: #151515;
        background: #fcf6ef;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      body {
        box-sizing: border-box;
        display: grid;
        height: 100vh;
        min-height: 100vh;
        margin: 0;
        overflow: hidden;
        place-items: center;
      }

      main {
        display: grid;
        justify-items: center;
        gap: 10px;
        padding: 24px 28px;
        text-align: center;
      }

      img {
        width: 96px;
        height: 96px;
        border-radius: 18px;
      }

      h1 {
        margin: 8px 0 0;
        font-size: 24px;
        font-weight: 650;
        line-height: 1.2;
      }

      p {
        margin: 0;
        color: #3f3a35;
        font-size: 13px;
        line-height: 1.45;
      }
    </style>
  </head>
  <body>
    <main>
      <img src="${icon}" alt="" />
      <h1>${escapeHtml(config.app.name)}</h1>
      <p>Versione ${escapeHtml(app.getVersion())}</p>
      <p>Copyright © 2026 Gloutchov</p>
    </main>
  </body>
</html>`;

  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
