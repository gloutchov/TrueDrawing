import { Menu, app, type MenuItemConstructorOptions } from "electron";

import type { AppConfig } from "../../shared/config/appConfigSchema";

export function installAppMenu(config: AppConfig): void {
  const template: MenuItemConstructorOptions[] = [
    {
      label: config.app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "quit" }
      ]
    },
    {
      label: "File",
      submenu: [
        { role: "close" }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    }
  ];

  if (process.platform === "darwin") {
    app.setAboutPanelOptions({ applicationName: config.app.name });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
