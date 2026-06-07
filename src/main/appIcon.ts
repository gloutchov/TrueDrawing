import { app, nativeImage, type NativeImage } from "electron";
import { existsSync } from "node:fs";
import path from "node:path";

export function getAppIconPath(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "icon.png");
  }

  return path.join(app.getAppPath(), "build", "icon.png");
}

export function createAppIcon(): NativeImage {
  const iconPath = getAppIconPath();

  if (!existsSync(iconPath)) {
    return nativeImage.createEmpty();
  }

  return nativeImage.createFromPath(iconPath);
}
