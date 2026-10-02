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

The published `v1.2.0` release includes `SHA256SUMS-windows.txt` and `SHA256SUMS-macos.txt`. Download the checksum file for your operating system together with the app package.

On Windows, from the folder containing the installer:

```powershell
Get-FileHash .\True-Drawing-1.2.0-Windows-x64.exe -Algorithm SHA256
```

Compare the `Hash` value with the matching line in `SHA256SUMS-windows.txt`.

On macOS, from the download folder:

```bash
shasum -a 256 True-Drawing-1.2.0-macOS-arm64.dmg
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

In source version `1.7.0`, the main tools on the left side of the screen appear from top to bottom as follows:

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

## C15 - Brush avanzati e texture personalizzate (`1.4.0`)

Preset brush bilingui da configurazione: grafite, morbido, marker, inchiostro e texture; controlli pressione, velocita, spaziatura e texture procedurali. Parametri immutabili nei tratti e persistenti nei file tdraw. / Configurable bilingual brush presets, pressure/speed/spacing and procedural texture controls; per-stroke parameters persist in tdraw.

## C16 - Import immagini di riferimento (`1.5.0`)

Import locale PNG/JPEG/WebP da dialogo nativo controllato, normalizzazione PNG e limiti bytes/pixel. Riferimenti embedded separati con visibilita, opacita, posizione e scala: esclusi da export e AI. Caricamento immagini prima del rendering dopo riapertura. / Local dialog-controlled imports; embedded references with visibility, opacity, position and scale, excluded from exports and AI.

In the References panel choose **Import reference** and a local PNG, JPEG or WebP file (up to 4 MiB and the configured pixel limits). X/Y move the image; width preserves its aspect ratio. Visibility and opacity do not change drawing tools. Up to four references are embedded in the project, so their original files are unnecessary when reopening. Undo/redo restores changes. References are excluded from exported canvas, sidecars and AI generation, including auto redraw. Removing a reference requires confirmation.

Patch `1.5.1`: WebP decodificato dal canvas Chromium dopo verifica RIFF/dimensioni nel main e normalizzato a PNG, perche nativeImage non supporta questo formato. / WebP is decoded by Chromium Canvas after RIFF/dimension checks in main and normalized to PNG, because nativeImage does not support this format. 87 test, lint/build e smoke import WebP chiaro/scuro.

## C17 - Maschere e clipping layer (`1.6.0`)

Maschere non distruttive con editor, attivazione e rimozione; clipping con identita layer stabili, controllo cicli e pulizia relazioni alla cancellazione. Rendering condiviso per canvas/export/AI, undo/redo e persistenza tdraw. / Non-destructive editable masks, stable layer clipping with cycle validation, shared rendering, undo/redo and persistence.

In Masks and clipping choose **Create mask**, then **Edit mask**. A new mask reveals everything: eraser hides; pencil/brush restore visibility. Turn off Edit mask to draw on the layer again. Mask enabled toggles the effect without losing strokes; removing a mask requires confirmation. **Clip to layer** uses another layer's alpha, including its mask, opacity and visibility. Targets remain linked after reordering; cyclic targets are disabled and deleting a target clears the relationship. Canvas, export and generation share rendering; effects persist and support undo/redo.

## C18 - Storia versioni del documento (`1.7.0`)

Snapshot persistenti manuali/automatici, consultazione, rinomina, ripristino e cancellazione; capsule senza ricorsione e limiti numero/byte da configurazione. Ripristino completo di canvas, layer, maschere, riferimenti e immagine AI; versioni conservate in tdraw e autosave, Undo ripristina lo stato precedente. / Persistent bounded document versions with complete restoration and non-recursive capsules.

**Document versions** creates named snapshots that can be renamed and restored. Each contains canvas, layers, masks, references and the realistic image; snapshots never contain other snapshots. Restoration and deletion require confirmation; Undo restores the state preceding a version restoration. Save the project to keep versions, which are also included in autosave/recovery. Undo/Redo remains in-memory operational history and is not reconstructed when reopening.

**Automatic versions** is a local preference disabled by default. When enabled it records changed content every five minutes, skipping content identical to the latest version. Configured `snapshots` limits: 20 versions, 8 MiB per content, 32 MiB total, 80-character names and the whole-project byte limit. Reaching a limit stops creation without evicting older versions; delete unneeded versions or adjust configuration. This is not an external backup: losing the tdraw file loses its versions.
