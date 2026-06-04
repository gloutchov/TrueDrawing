# True Drawing - User Instructions

Version: `0.0.1`

True Drawing is currently in bootstrap stage. This version does not yet include a runnable app: it provides the development plan, initial documentation, planned architecture map, and initial configuration.

## Intended App Usage

Once the application milestones are implemented, users will be able to:

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

The API key must not be placed in that file: it will be stored in the operating system keychain through the app settings.

