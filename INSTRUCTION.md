# True Drawing - User Instructions

Version: `0.2.0`

True Drawing is currently in an early stage. This version includes the desktop skeleton with an interactive canvas: the Electron app opens the main window, loads the central configuration, and lets users draw lines on the canvas with Pointer Events-compatible input.

## Intended App Usage

Once the next application milestones are implemented, users will be able to:

- create a new drawing and give it a name;
- draw on the canvas with a mouse, tablet, or compatible input device;
- choose tool, color, stroke size, and opacity;
- use layers;
- undo and redo actions;
- configure API key, provider, and image model;
- generate a realistic image in the inspector;
- switch between canvas and realistic image by double clicking the inspector;
- automatically and manually save both canvas and image.

## Planned Save Files

For a drawing named `name`, the app will use:

- `name_canvas` for the source drawing;
- `name_image` for the generated realistic image.

## Planned Configuration

The `config/app.config.json` file contains parameters editable by skilled users, such as autosave, canvas dimensions, tool defaults, API provider, and image model.

This version also exposes canvas input parameters such as minimum point distance, stroke smoothing, default pressure, and pressure-based size factors.

The API key must not be placed in that file: it will be stored in the operating system keychain through the app settings.

## Development Startup

To run the development version:

- install Node.js 22;
- run `npm ci --no-audit --no-fund`;
- run `npm run dev`.

To produce a local build:

- run `npm run build`.
