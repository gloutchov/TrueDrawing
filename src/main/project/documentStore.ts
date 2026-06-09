import fs from "node:fs/promises";
import path from "node:path";
import { dialog } from "electron";
import type { BrowserWindow, OpenDialogOptions, SaveDialogOptions } from "electron";

import type { AppConfig } from "../../shared/config/appConfigSchema";
import {
  createProjectSidecarFileNames,
  ensureExtension,
  parseDrawingProjectJson,
  sanitizeFileBaseName,
  serializeDrawingProject
} from "../../shared/project/projectModel";
import type {
  DrawingProjectFile,
  ProjectAutosaveInfo,
  ProjectAutosaveRequest,
  ProjectAutosaveResult,
  ProjectExportFormat,
  ProjectExportRequest,
  ProjectExportResult,
  ProjectOpenResult,
  ProjectSaveRequest,
  ProjectSaveResult
} from "../../shared/project/projectTypes";

export type DocumentStore = {
  saveProject: (
    request: ProjectSaveRequest,
    options: { showSaveDialog: boolean; parentWindow?: BrowserWindow | null }
  ) => Promise<ProjectSaveResult>;
  openProject: (parentWindow?: BrowserWindow | null) => Promise<ProjectOpenResult>;
  autosaveProject: (request: ProjectAutosaveRequest) => Promise<ProjectAutosaveResult>;
  listAutosaves: () => Promise<ProjectAutosaveInfo[]>;
  loadAutosave: (id: string) => Promise<ProjectOpenResult>;
  clearAutosave: (id: string) => Promise<void>;
  exportImage: (
    request: ProjectExportRequest,
    parentWindow?: BrowserWindow | null
  ) => Promise<ProjectExportResult>;
};

export function createDocumentStore(
  userDataPath: string,
  getConfig: () => AppConfig
): DocumentStore {
  return {
    saveProject: (request, options) => saveProject(request, options, getConfig()),
    openProject: (parentWindow) => openProject(parentWindow, getConfig()),
    autosaveProject: (request) => autosaveProject(userDataPath, request, getConfig()),
    listAutosaves: () => listAutosaves(userDataPath, getConfig()),
    loadAutosave: (id) => loadAutosave(userDataPath, id, getConfig()),
    clearAutosave: (id) => clearAutosave(userDataPath, id, getConfig()),
    exportImage: (request, parentWindow) => exportImage(request, parentWindow, getConfig())
  };
}

async function saveProject(
  request: ProjectSaveRequest,
  options: { showSaveDialog: boolean; parentWindow?: BrowserWindow | null },
  config: AppConfig
): Promise<ProjectSaveResult> {
  const savedAt = new Date().toISOString();
  const project = { ...request.project, savedAt };
  const filePath = options.showSaveDialog || !request.filePath
    ? await chooseProjectSavePath(project.name, config, options.parentWindow)
    : request.filePath;

  if (!filePath) {
    return {
      canceled: true,
      filePath: null,
      name: project.name,
      savedAt: null
    };
  }

  const normalizedFilePath = ensureExtension(filePath, config.files.projectExtension);

  await writeProjectBundle(normalizedFilePath, project, request, config);

  return {
    canceled: false,
    filePath: normalizedFilePath,
    name: project.name,
    savedAt
  };
}

async function openProject(
  parentWindow: BrowserWindow | null | undefined,
  config: AppConfig
): Promise<ProjectOpenResult> {
  const dialogOptions: OpenDialogOptions = {
    title: "Open True Drawing project",
    properties: ["openFile"],
    filters: [
      { name: "True Drawing Project", extensions: [extensionWithoutDot(config.files.projectExtension)] }
    ]
  };
  const result = parentWindow
    ? await dialog.showOpenDialog(parentWindow, dialogOptions)
    : await dialog.showOpenDialog(dialogOptions);

  if (result.canceled || result.filePaths.length === 0) {
    return {
      canceled: true,
      filePath: null,
      project: null
    };
  }

  return loadProjectFromPath(result.filePaths[0]);
}

async function autosaveProject(
  userDataPath: string,
  request: ProjectAutosaveRequest,
  config: AppConfig
): Promise<ProjectAutosaveResult> {
  const savedAt = new Date().toISOString();
  const autosaveDirectory = getAutosaveDirectory(userDataPath, config);
  const fileName = `${safeAutosaveId(request.project.name, config)}${config.files.autosaveExtension}`;
  const filePath = path.join(autosaveDirectory, fileName);
  const project = { ...request.project, savedAt };

  await fs.mkdir(autosaveDirectory, { recursive: true });
  await writeProjectBundle(filePath, project, request, config);

  return { filePath, savedAt };
}

async function listAutosaves(
  userDataPath: string,
  config: AppConfig
): Promise<ProjectAutosaveInfo[]> {
  const autosaveDirectory = getAutosaveDirectory(userDataPath, config);

  try {
    const entries = await fs.readdir(autosaveDirectory, { withFileTypes: true });
    const autosaves = await Promise.all(entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(config.files.autosaveExtension))
      .map(async (entry) => {
        const filePath = path.join(autosaveDirectory, entry.name);
        const project = await readProjectFileSafely(filePath);

        if (!project) {
          return null;
        }

        return {
          id: entry.name,
          filePath,
          name: project.name,
          savedAt: project.savedAt
        };
      }));

    return autosaves
      .filter((autosave): autosave is ProjectAutosaveInfo => autosave !== null)
      .sort((left, right) => Date.parse(right.savedAt) - Date.parse(left.savedAt));
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return [];
    }

    throw error;
  }
}

async function loadAutosave(
  userDataPath: string,
  id: string,
  config: AppConfig
): Promise<ProjectOpenResult> {
  if (!isSafeAutosaveId(id) || !id.endsWith(config.files.autosaveExtension)) {
    throw new Error("Invalid autosave identifier.");
  }

  return loadProjectFromPath(path.join(getAutosaveDirectory(userDataPath, config), id));
}

async function clearAutosave(
  userDataPath: string,
  id: string,
  config: AppConfig
): Promise<void> {
  if (!isSafeAutosaveId(id) || !id.endsWith(config.files.autosaveExtension)) {
    throw new Error("Invalid autosave identifier.");
  }

  const filePath = path.join(getAutosaveDirectory(userDataPath, config), id);

  await fs.rm(filePath, { force: true });
}

async function exportImage(
  request: ProjectExportRequest,
  parentWindow: BrowserWindow | null | undefined,
  config: AppConfig
): Promise<ProjectExportResult> {
  const extension = extensionForExport(request, config);
  const suffix = request.target === "canvas" ? config.files.canvasSuffix : config.files.imageSuffix;
  const defaultName = sanitizeFileBaseName(request.name, config.files.defaultProjectName);
  const dialogOptions: SaveDialogOptions = {
    title: request.target === "canvas" ? "Export canvas" : "Export realistic image",
    defaultPath: `${defaultName}${suffix}${extension}`,
    filters: [
      { name: request.format.toUpperCase(), extensions: [extensionWithoutDot(extension)] }
    ]
  };
  const result = parentWindow
    ? await dialog.showSaveDialog(parentWindow, dialogOptions)
    : await dialog.showSaveDialog(dialogOptions);

  if (result.canceled || !result.filePath) {
    return {
      canceled: true,
      filePath: null
    };
  }

  const filePath = ensureExtension(result.filePath, extension);
  await writeDataUrl(filePath, request.dataUrl, request.format);

  return {
    canceled: false,
    filePath
  };
}

async function chooseProjectSavePath(
  projectName: string,
  config: AppConfig,
  parentWindow: BrowserWindow | null | undefined
): Promise<string | null> {
  const dialogOptions: SaveDialogOptions = {
    title: "Save True Drawing project",
    defaultPath: `${projectName}${config.files.projectExtension}`,
    filters: [
      { name: "True Drawing Project", extensions: [extensionWithoutDot(config.files.projectExtension)] }
    ]
  };
  const result = parentWindow
    ? await dialog.showSaveDialog(parentWindow, dialogOptions)
    : await dialog.showSaveDialog(dialogOptions);

  return result.canceled || !result.filePath ? null : result.filePath;
}

async function writeProjectBundle(
  filePath: string,
  project: DrawingProjectFile,
  request: Pick<ProjectSaveRequest, "canvasDataUrl" | "imageDataUrl">,
  config: AppConfig
): Promise<void> {
  const directory = path.dirname(filePath);
  const sidecars = createProjectSidecarFileNames(project.name, config);

  await fs.mkdir(directory, { recursive: true });
  await writeFileAtomically(filePath, Buffer.from(serializeDrawingProject(project), "utf8"));
  await writeDataUrl(path.join(directory, sidecars.canvasFileName), request.canvasDataUrl, "png");

  if (request.imageDataUrl) {
    await writeDataUrl(path.join(directory, sidecars.imageFileName), request.imageDataUrl, "png");
  }
}

async function loadProjectFromPath(filePath: string): Promise<ProjectOpenResult> {
  return {
    canceled: false,
    filePath,
    project: await readProjectFile(filePath)
  };
}

async function readProjectFile(filePath: string): Promise<DrawingProjectFile> {
  return parseDrawingProjectJson(await fs.readFile(filePath, "utf8"));
}

async function readProjectFileSafely(filePath: string): Promise<DrawingProjectFile | null> {
  try {
    return await readProjectFile(filePath);
  } catch {
    return null;
  }
}

async function writeDataUrl(
  filePath: string,
  dataUrl: string,
  expectedFormat: ProjectExportFormat
): Promise<void> {
  const match = /^data:image\/(png|webp|jpeg);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);

  if (!match) {
    throw new Error("Invalid image data URL.");
  }

  if (match[1] !== expectedFormat) {
    throw new Error("Image data URL format does not match export format.");
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await writeFileAtomically(filePath, Buffer.from(match[2], "base64"));
}

async function writeFileAtomically(filePath: string, data: Buffer): Promise<void> {
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;

  await fs.writeFile(temporaryPath, data);
  await fs.rename(temporaryPath, filePath);
}

function getAutosaveDirectory(userDataPath: string, config: AppConfig): string {
  return path.join(userDataPath, config.files.autosaveDirectoryName);
}

function safeAutosaveId(projectName: string, config: AppConfig): string {
  return sanitizeFileBaseName(projectName, config.files.defaultProjectName);
}

function isSafeAutosaveId(id: string): boolean {
  return !id.includes("/") && !id.includes("\\") && !id.includes("..");
}

function extensionForExport(request: ProjectExportRequest, config: AppConfig): string {
  if (request.format === "webp") {
    return config.files.webpExportExtension;
  }

  return request.target === "canvas"
    ? config.files.canvasExportExtension
    : config.files.imageExportExtension;
}

function extensionWithoutDot(extension: string): string {
  return extension.startsWith(".") ? extension.slice(1) : extension;
}

function isNotFoundError(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
