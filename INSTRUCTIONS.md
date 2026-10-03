# Foreword

I am not an expert at writing code. At least that is how I see myself. But I am also not someone who discovered that ChatGPT can make apps and immediately had the ambition to have it build the must-have application everyone has wanted forever.
True Drawing comes from a game I used to play as a child:
The challenger makes a drawing, a rough sketch, quickly, in a few minutes, and the other players have to say what it is (I know, we used to have fun with very little!).

True Drawing does exactly this. The user makes a sketch, and the app asks AI to reinterpret the drawing and create an image that is "nice to look at".

The application was built entirely with AI assistance. The interface is simple, with a few drawing tools, layer management, undo and redo, and a few other features. It works with a mouse, graphics tablets, and any kind of pointing system. The more imprecise it is, the more fun the result becomes.


Is it perfect?
Let's say it works, and I do not see any obvious bugs. At the moment the project is maintained with builds verified locally on macOS and Windows, so the declared support and the support actually verified stay aligned.
A professional developer might find many flaws in it, and perhaps some vulnerability that escaped me. I leave to them the burden and honor of fixing what my inexperienced eyes did not uncover.
In any case, it remains, always, an app built through vibe-coding.

# True Drawing - User Manual (EN)

> This app was built through vibecoding with Codex CLI. It should currently be considered a working alpha. It may need optimization, cleanup of orphaned code, security work, and much more...

## Table of Contents

- Introduction
- Getting started
- The interface
- License

## Introduction

True Drawing is an experimental project based on an old game, with no particular ambition.
The project is currently maintained and distributed with packages verified locally on macOS and Windows.

### Interface language

The True Drawing interface is bilingual, Italian/English. The language is chosen automatically based on the system settings (if the computer is set to a language other than Italian, English is selected automatically). The setting can be changed manually from the settings window.

## Getting started

The official True Drawing website is `https://truedrawing.glaucosilvestri.it/`.

### Download, signing, and checksums

True Drawing was born as a personal program and was later published as an open source project under the Apache 2.0 license. The published builds are not signed with Apple or Windows certificates.

This means that:

- on macOS, a Gatekeeper warning may appear on first launch;
- on Windows, a SmartScreen or "unknown publisher" warning may appear;
- the source code remains inspectable in the repository, but the downloaded packages do not have a commercial operating-system signature.

It is therefore possible that, at launch, the operating system will ask you for permission to proceed with opening the app.

_Note:_ If you have doubts, the repository contains the program checksums. In the Tech area of this document you will find instructions for verifying that the files have not been compromised.

### Verifying SHA-256 checksums

The published `v1.11.0` release includes `SHA256SUMS-windows.txt` and `SHA256SUMS-macos.txt`. Download the checksum file for your operating system together with the app package.

On Windows, from the folder containing the installer:

```powershell
Get-FileHash .\True-Drawing-1.11.0-Windows-x64.exe -Algorithm SHA256
```

Compare the `Hash` value with the matching line in `SHA256SUMS-windows.txt`.

On macOS, from the download folder:

```bash
shasum -a 256 True-Drawing-1.11.0-macOS-arm64.dmg
```

Compare the value with the matching line in `SHA256SUMS-macos.txt`.

### Starting True Drawing

On both macOS and Windows, simply double-click the program icon.

### Entering AI credentials

Click the File menu.
Select API Key.
A window opens where you must enter the API key for the AI model (OpenAI API keys are accepted) and the image generation model you want.
Save the API keys.

### Naming the Drawing

Above the drawing canvas there is a field where you can enter the drawing name. Write a meaningful name before you start. That name will be used for all automatic safety saves and for saving the final drawing.

### Creating a Drawing

In source version `1.11.4`, the main tools on the left side of the screen appear from top to bottom as follows:

- Hand tool to move the canvas view;
- Selection tool;
- Stroke drawing tools (pencil, marker, brush, eraser);
- Shape drawing tools (square/rectangle, circle/ellipse, triangle);
- Fill tool (bucket)
- Stroke type (solid, dashed, dotted).

Each of these tools offers some settings that let you further customize the stroke. These settings differ from tool to tool, and appear below the tool buttons themselves. The most common are:

- Fill color;
- Stroke thickness;
- Stroke opacity;
- Stroke size.

Drawing is very simple. Just select the desired tool and draw whatever you want on the white canvas.

To move around a zoomed canvas, select the hand and drag the visible area with a mouse, pen, or touch. Dragging does not change the drawing and is not saved in the project. Resetting zoom also recenters the view.

To change the canvas size, use **Canvas size** in the right panel or `File > Settings > Canvas size...`. Select `px` or `cm`, enter width, height, and resolution in DPI, then press **Apply**. Conversion uses 2.54 cm per inch and rounds to the nearest pixel; the panel always shows the effective size in pixels and centimeters. In `px`, changing DPI preserves the pixel count and changes the physical size; in `cm`, it preserves the entered centimeters and recalculates pixels. Configured limits are 64-4096 pixels per side, 12 megapixels total, and 72-600 DPI. The origin stays at the top left: shrinking the canvas does not scale or delete strokes, which can reappear when enlarged. Undo/redo also restores dimensions.

The lock between width and height starts open. Click it to keep the current proportions: changing either side updates the other in pixels or centimeters. Click it again to edit the sides separately. The right panel contains **Inspector**, **Canvas size**, and **Layers**, in that order. Use the arrow at the far right of each heading to collapse or expand its section; collapsing a section does not change the drawing.

The Edit menu offers some useful additional features:

- Undo/Redo;
- Cut/Copy/Paste;
- Crop.

Once the sketch is drawn, simply click the small button with the circling arrows to activate image generation by the AI.

To save the drawing and the image generated by the AI, simply go to the File menu and click Save.

### Save files

For a drawing called `name`, the app will use:

- `name.tdraw` for the True Drawing project;
- `name_canvas.png` for the composited canvas;
- `name_image.png` for the generated realistic image, when present.

The `.tdraw` project stores pixels and DPI; older projects open at the 2048 × 2048 px, 300 DPI default. The canvas sidecar and PNG/WebP exports use the exact current pixel dimensions. DPI is project data used for conversions in the interface; it does not add DPI metadata to exported images.

## The interface

### Main menu

The main menu offers four submenus:

- File;
- Edit;
- View;
- Help.

#### File Menu

The File menu has the following options:

- New;
- Open;
- Save;
- Save As;
- Export Canvas (png, webp);
- Export image (png, webp);
- Settings;
- Exit.

The Settings menu lets you change canvas dimensions, the program language and appearance, enter the AI API key, choose the output image style (realistic, cartoon, etc.), and set automatic AI image generation during pauses in drawing.

#### Edit Menu

The Edit menu offers the features already described above, namely:

- Undo/Redo;
- Cut/Copy/Paste;
- Crop.

#### View Menu

The View menu lets you change the zoom factor on the canvas (also adjustable through the buttons on the canvas itself, or with the mouse wheel), and switch to fullscreen mode.

#### Help Menu

The Help menu only contains the option to view the application's basic information.

### Drawing Menu

On the left side of the screen there is the menu containing all drawing tools. This menu has also already been described in the previous chapter.

### Inspector

The inspector window shows a preview of the image generated by the AI. Below that image, all AI configuration parameters are shown.

### Layers

The Layers window lets you build the image on multiple levels, hide or show each individual layer, change its position, and change its opacity.

## License

This project is distributed under the Apache 2.0 license. See [LICENSE](./LICENSE).

Security 1.3.0: IPC/project images are limited to 16 MiB; AI downloads reject local addresses and redirects. API key settings warn when encrypted local safeStorage fallback is used; its protection depends on the operating system.

## C15 - Advanced brushes and procedural textures (`1.4.0`)

Configurable bilingual brush presets, pressure/speed/spacing and procedural texture controls; per-stroke parameters persist in tdraw.

In **Advanced brushes**, select graphite, soft, marker, ink or texture. Pressure size/opacity, speed, spacing and grain/dots/hatching affect new strokes; existing strokes retain their parameters. Select a classic tool to return to its earlier behavior. Undo/Redo restores strokes; their applied settings remain in the project. Pressure behavior depends on the Pointer Events device.

## C16 - Import reference images (`1.5.0`)

Local dialog-controlled imports; embedded references with visibility, opacity, position and scale, excluded from exports and AI.

In the References panel choose **Import reference** and a local PNG, JPEG or WebP file (up to 4 MiB and the configured pixel limits). X/Y move the image; width preserves its aspect ratio. Visibility and opacity do not change drawing tools. Up to four references are embedded in the project, so their original files are unnecessary when reopening. Undo/redo restores changes. References are excluded from exported canvas, sidecars and AI generation, including auto redraw. Removing a reference requires confirmation.

WebP is decoded by Chromium Canvas after RIFF/dimension checks in main and normalized to PNG, because nativeImage does not support this format. 87 tests, lint/build and WebP smoke checks in light/dark themes.

## C17 - Layer masks and clipping (`1.6.0`)

Non-destructive editable masks, stable layer clipping with cycle validation, shared rendering, undo/redo and persistence.

Mask commands were removed in version 1.11.3. Earlier projects retain mask appearance and data when saved or restored from document versions, without a mask editor. In **Clip to layer**, choose another layer as the target: clipping uses its alpha, opacity and visibility. Targets remain linked after reordering; cyclic targets are disabled and deleting a target clears the relationship. Canvas, export and generation share rendering; clipping and restoration support Undo/Redo.

## C18 - Document version history (`1.7.0`)

Persistent bounded document versions with complete restoration and non-recursive capsules.

**Document versions** creates named snapshots that can be renamed and restored. Each contains canvas, layers, masks, references and the realistic image; snapshots never contain other snapshots. Restoration and deletion require confirmation; Undo restores the state preceding a version restoration. Save the project to keep versions, which are also included in autosave/recovery. Undo/Redo remains in-memory operational history and is not reconstructed when reopening.

**Automatic versions** is a local preference disabled by default. When enabled it records changed content every five minutes, skipping content identical to the latest version. Configured `snapshots` limits: 20 versions, 8 MiB per content, 32 MiB total, 80-character names and the whole-project byte limit. Reaching a limit stops creation without evicting older versions; delete unneeded versions or adjust configuration. This is not an external backup: losing the tdraw file loses its versions.

## C19 - Realistic style presets (`1.8.0`)

Configurable bilingual style presets, persistent favorite/custom styles and minimal generation payloads.

In **File > Settings > Image style**, select a preset and read its description. **Favorite preset** stores one preset; **Use favorite** recalls it while using a custom style too. A star marks the favorite. **Save** applies style and favorite together; **Cancel** retains previous preferences. To clear the favorite, select it, uncheck the box and save.

**Custom style** accepts a short non-secret visual description (80 characters by default). Never paste API keys or credentials: common formats are rejected, but the guard cannot detect every secret. Text matching a preset ID selects that preset. Style and favorite persist in local app data, separate from the project and API key.

The six presets follow `imageGeneration.stylePresets` order in `config/app.config.json`. Each has an ID, Italian/English names and descriptions, a `promptFragment` and `parameters`. Only `quality` (`auto`, `low`, `medium`, `high`) and `size` (`auto`, `1024x1024`, `1536x1024`, `1024x1536`) are supported; omitted values use central defaults. `availableStyles` must list the same IDs in the same order. Invalid configuration is rejected on startup; restart after editing.

Generation sends OpenAI the composited canvas PNG (masks/clipping applied, configured padding), composition/style prompt, model and parameters. It excludes references, saved versions, layer/project names, paths, stroke counts and favorite metadata. Enabled auto redraw uses the same flow. Authentication uses the main-process secret backend; displayed errors omit remote messages and `revised_prompt`. Actual image quality and cost depend on the model and provider.

## C20 - Development toolchain upgrade (`1.9.0`)

Updated toolchain with Electron 44.4.5, Vite 8, Vitest 5 and ESLint 10. TypeScript 6.0.3 stays below 6.1 within typescript-eslint support; TypeScript 7 is deferred. Explicit ESM Vite config, Node16/CommonJS Electron compilation and bounded asynchronous PNG/text clipboard with sanitized public errors.

## C21 - React and React DOM migration (`1.10.0`)

React and React DOM aligned at 19.3.0 with matching types; components use React-scoped JSX types. C20 toolchain preserved while resolving lockfile conflicts; canvas interactions, dialogs and persistence verified in the production renderer.

## C22 - Lucide icon update (`1.11.0`)

Lucide React upgraded to 1.48.0 with React 19; exports, toolbars, panels and accessible SVG icons verified in light/dark themes. C20-C22 migrations preserve Dependabot commits; cumulative unsigned Windows/macOS release and SHA-256 verification complete the closing process.

## C23 - Reference panel spacing (`1.11.1`)

Import reference aligned to the right; panel content uses the Canvas size padding (10/12 px) and 8 px gap. Controls and text have consistent space from panel edges.

## C24 - Create version button spacing (`1.11.2`)

Create version is aligned to the right like Apply, with 8 px above, 12 px below and 10 px beside the button.

## C25 - Mask editor removal (`1.11.3`)

Mask creation, toggling, editing and removal commands and stroke routing are removed. Layer clipping and legacy mask rendering/persistence, including snapshots, remain compatible; normal drawing does not change legacy masks.

## C26 - Advanced brush spacing (`1.11.4`)

Advanced brush preset, texture and sliders share 10 px horizontal padding, 8 px gaps and vertical spacing with other panels; sliders stay inside panel edges without overflow.
