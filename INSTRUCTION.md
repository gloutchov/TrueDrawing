# True Drawing - User Instructions

Version: `0.8.0`

True Drawing is currently in an early stage. This version includes the interactive canvas, stroke tools, layers, realistic inspector, OpenAI generation, secure API key management, image model/style preferences, auto-redraw, manual save, autosave, recovery, export, and UX polish for app state, confirmations, and basic accessibility.

## Intended App Usage

Once the next application milestones are implemented, users will be able to:

- create a new drawing and give it a name;
- draw on the canvas with a mouse, tablet, or compatible input device;
- choose pencil, marker, brush, or eraser;
- choose straight or curved line;
- draw rectangle, ellipse, triangle, or polygon shapes;
- use fill to color an area bounded by already drawn layer edges;
- select a rectangular canvas area for cut, copy, and paste;
- choose solid, dashed, or dotted stroke style;
- change color, stroke size, opacity, and hardness;
- use `+`, `-`, reset, or mouse wheel to zoom the canvas;
- keep canvas zoom persistent across app restarts;
- read save state, dirty state, active tool, active layer, layer/stroke counts, and zoom in the status bar;
- leave fullscreen with the visible top-bar button;
- use `Edit > Undo/Redo` for drawing history when focus is not in a text field;
- use `Edit > Copy/Cut/Paste` or `Ctrl/Cmd+X`, `Ctrl/Cmd+C`, `Ctrl/Cmd+V` on the canvas selection when focus is not in a text field;
- move the pasted image while it remains selected;
- undo and redo strokes with toolbar buttons or `Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z`, and `Ctrl/Cmd+Y`;
- create, rename, select, hide, reorder, and adjust opacity for layers;
- get confirmations before deleting a layer, removing the API key, or discarding an autosave;
- enter or remove the OpenAI API key from `File > API Key...`;
- type the OpenAI image model from the same settings dialog;
- choose the image style from `File > Stile...`, using predefined styles or a custom value;
- enable inspector auto-redraw from `File > Redraw automatico...`;
- generate a realistic image in the inspector from the current canvas;
- see clear inspector states when the API key is missing, no image has been generated, generation is running, or an error occurs;
- switch between canvas and realistic image by double clicking the inspector;
- manually save the `.tdraw` project;
- autosave the project, canvas, and realistic image;
- recover the latest available autosave;
- export canvas and realistic image as PNG or WebP.

## Save Files

For a drawing named `name`, the app will use:

- `name.tdraw` for the True Drawing project;
- `name_canvas.png` for the composited canvas;
- `name_image.png` for the generated realistic image when present.

## Installing From GitHub

Windows and macOS builds published on GitHub are unsigned: no certificates or credentials are available for Windows code signing, macOS signing, or Apple notarization. Windows SmartScreen and macOS Gatekeeper may show security warnings when the app is opened for the first time.

## Planned Configuration

The `config/app.config.json` file contains parameters editable by skilled users, such as autosave, canvas dimensions, tool defaults, API provider, and image model.

This version also exposes canvas input parameters such as minimum point distance, stroke smoothing, default pressure, pressure-based size factors, control ranges, tool presets, default layer, layer name prefix, layer limit, layer opacity range, suggested image models, suggested image styles, auto-redraw defaults/ranges, export padding sent to generation, default project name, autosave directory, file suffixes, and export extensions.

The API key must not be placed in that file: it is entered from the app through `File > API Key...` and stored by the Electron main process in Windows Credential Manager on Windows, macOS Keychain on macOS, or encrypted local fallback storage on unsupported environments.

## Development Startup

To run the development version:

- install Node.js 22;
- run `npm ci --no-audit --no-fund`;
- run `npm run dev`.

To produce a local build:

- run `npm run build`.
