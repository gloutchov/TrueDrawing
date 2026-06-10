import { BrowserWindow, Menu, app, type MenuItemConstructorOptions } from "electron";

import { createAppIcon, getAppIconPath } from "../appIcon";
import type { AppConfig } from "../../shared/config/appConfigSchema";

let infoWindow: BrowserWindow | null = null;

export function installAppMenu(config: AppConfig): void {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [
        {
          label: "Nuovo",
          accelerator: "CmdOrCtrl+N",
          click: () => sendFileCommand("new")
        },
        {
          label: "Apri",
          accelerator: "CmdOrCtrl+O",
          click: () => sendFileCommand("open")
        },
        {
          label: "Salva",
          accelerator: "CmdOrCtrl+S",
          click: () => sendFileCommand("save")
        },
        {
          label: "Salva con nome...",
          accelerator: "CmdOrCtrl+Shift+S",
          click: () => sendFileCommand("save-as")
        },
        { type: "separator" },
        {
          label: "Esporta canvas PNG",
          click: () => sendFileCommand("export-canvas-png")
        },
        {
          label: "Esporta canvas WebP",
          click: () => sendFileCommand("export-canvas-webp")
        },
        {
          label: "Esporta immagine PNG",
          click: () => sendFileCommand("export-image-png")
        },
        {
          label: "Esporta immagine WebP",
          click: () => sendFileCommand("export-image-webp")
        },
        {
          label: "Chiudi",
          role: "close"
        },
        { type: "separator" },
        {
          label: "API Key...",
          accelerator: "CmdOrCtrl+,",
          click: () => {
            BrowserWindow.getAllWindows().forEach((window) => {
              window.webContents.send("settings:open-api-key");
            });
          }
        },
        {
          label: "Stile...",
          click: () => {
            BrowserWindow.getAllWindows().forEach((window) => {
              window.webContents.send("settings:open-image-style");
            });
          }
        },
        {
          label: "Redraw automatico...",
          click: () => {
            BrowserWindow.getAllWindows().forEach((window) => {
              window.webContents.send("settings:open-auto-redraw");
            });
          }
        },
        { type: "separator" },
        {
          label: "Exit",
          role: "quit"
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          click: () => sendEditCommand("undo")
        },
        {
          label: "Redo",
          accelerator: "CmdOrCtrl+Shift+Z",
          click: () => sendEditCommand("redo")
        },
        { type: "separator" },
        {
          label: "Cut",
          accelerator: "CmdOrCtrl+X",
          click: () => sendEditCommand("cut")
        },
        {
          label: "Copy",
          accelerator: "CmdOrCtrl+C",
          click: () => sendEditCommand("copy")
        },
        {
          label: "Paste",
          accelerator: "CmdOrCtrl+V",
          click: () => sendEditCommand("paste")
        },
        { type: "separator" },
        {
          label: "Crop",
          accelerator: "CmdOrCtrl+Shift+X",
          click: () => sendEditCommand("crop")
        }
      ]
    },
    {
      label: "View",
      submenu: [
        {
          label: "Reset canvas zoom",
          accelerator: "CmdOrCtrl+0",
          click: () => sendViewCommand("canvas-zoom-reset")
        },
        {
          label: "Zoom canvas in",
          accelerator: "CmdOrCtrl+=",
          click: () => sendViewCommand("canvas-zoom-in")
        },
        {
          label: "Zoom canvas out",
          accelerator: "CmdOrCtrl+-",
          click: () => sendViewCommand("canvas-zoom-out")
        },
        { type: "separator" },
        {
          label: "Toggle fullscreen",
          accelerator: process.platform === "darwin" ? "Ctrl+Command+F" : "F11",
          click: () => toggleFocusedWindowFullscreen()
        }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Info",
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
