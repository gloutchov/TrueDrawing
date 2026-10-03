# True Drawing — User manual

True Drawing began as a game: make a quick sketch and let someone interpret it. Here you can draw on your computer and ask OpenAI to turn the sketch into an image. Your drawing does not have to be perfect: even a few lines can make a good starting point.

[Manuale italiano](ISTRUZIONI.md) · [Project introduction](README.md) · [Official website](https://truedrawing.glaucosilvestri.it/)

## Contents

- [Installation and first launch](#installation-and-first-launch)
- [Your first drawing](#your-first-drawing)
- [Interface and preferences](#interface-and-preferences)
- [Standard tools](#standard-tools)
- [Selection, clipboard and cropping](#selection-clipboard-and-cropping)
- [Zoom and hand tool](#zoom-and-hand-tool)
- [Advanced brushes and textures](#advanced-brushes-and-textures)
- [References](#references)
- [Canvas size](#canvas-size)
- [Layers](#layers)
- [Clip to layer](#clip-to-layer)
- [Document versions](#document-versions)
- [Inspector and AI generation](#inspector-and-ai-generation)
- [Saving, opening and exporting](#saving-opening-and-exporting)
- [Autosave and recovery](#autosave-and-recovery)
- [Shortcuts](#shortcuts)
- [Troubleshooting](#troubleshooting)
- [Privacy and limitations](#privacy-and-limitations)

## Installation and first launch

Download the package for your computer from [GitHub Releases](https://github.com/gloutchov/TrueDrawing/releases/latest). Check the operating system and architecture in the notes and asset names: packages are available for Windows x64 and Apple Silicon macOS (arm64).

On Windows, run the `.exe` installer and follow its installation steps. On macOS, open the `.dmg` and copy True Drawing to Applications, or extract the `.zip` package. Launch the app from its icon. Drawing requires a mouse, trackpad or compatible pen; image generation requires Internet access, an OpenAI API key and access to an image model.

### Signing and download verification

Distributed packages are unsigned and not notarized: Windows may display SmartScreen or an “unknown publisher” warning; macOS may display a Gatekeeper warning. Check the source and checksum before deciding to open the package. If the system still prevents it from opening, follow the operating system's official guidance for apps from unidentified developers.

Also download `SHA256SUMS-windows.txt` or `SHA256SUMS-macos.txt` from the same release. In your download folder, calculate the file hash, replacing the example name with the actual filename:

```powershell
# Windows
Get-FileHash .\package-name.exe -Algorithm SHA256
```

```bash
# macOS
shasum -a 256 package-name.dmg
```

Compare the result with that file's line in the checksum document. If it does not match, do not use that download. A checksum verifies integrity against the published assets; it does not replace publisher signing.

To update, save your projects and a backup, close the app, then install the new package from GitHub Releases. There is no signed automatic updater. To uninstall, use Windows app settings or remove the app from Applications on macOS; keep your `.tdraw` files separately, in the folders you chose.

## Your first drawing

1. Launch True Drawing. You do not need to configure OpenAI to draw, save or export the canvas.
2. Enter a name in the field above the canvas, such as “Landscape”.
3. In the left toolbar, choose Pencil from the stroke tools group. Set the colour and size, then drag on the white sheet.
4. Use **Undo** in the toolbar or **Edit > Undo** to correct the last step.
5. Choose **File > Save**. Choose a folder in the system dialog; if the project still has its default name, the app first asks you to give it a name.
6. To create an image to share, choose **File > Export canvas PNG**.

To reinterpret the sketch with AI, follow [Inspector and AI generation](#inspector-and-ai-generation). You can add detail to the sketch and generate again; preserve an important result by saving the project or exporting the image.

## Interface and preferences

The canvas occupies the centre, with tools and stroke controls on the left. The project name is at the top; document information and operation messages appear at the bottom.

The right column contains, from top to bottom:

| Panel | Purpose |
| --- | --- |
| Inspector | AI image preview, generation and settings status. |
| References | Guide images to use while drawing. |
| Canvas size | Sheet width, height, units and DPI. |
| Document versions | Save and recover drawing states. |
| Advanced brushes | Presets, textures and brush response. |
| Layers | Organise strokes on separate layers. |
| Clip to layer | Limit a layer's visibility to the shape of another. |

The arrow on the right of each title collapses or expands its panel without changing the drawing. Scroll the column to reach the lower panels. Buttons and fields can be reached with Tab; buttons can also be activated with Enter or Space.

In **File > Settings > Interface...**, choose the language and theme. System mode uses Italian on Italian systems and English otherwise, and follows the computer's light/dark theme. You can override this with Italian, English, light or dark; preferences are retained. Names you enter are not translated. Some tooltips and the recovery dialog still use English labels in the Italian interface.

## Standard tools

Click a group in the left toolbar to open its list and choose a tool. The group icon shows the last selected tool; tooltips help identify the options.

| Tool | How to use it |
| --- | --- |
| Pencil, Marker, Brush | Hold and drag to draw freehand. |
| Eraser | Drag to erase on the active layer. |
| Straight line, Curved line | Drag from the start to the end point. The curve uses a predefined bend. |
| Rectangle, Ellipse, Triangle, Polygon | Drag to define the shape; Polygon is a regular pentagon. Shapes draw outlines. |
| Fill | Choose a colour and click the area to fill. |

Below the tools are the colour control and three sliders: **S** for size/width, **O** for opacity and **H** for edge hardness. The readout shows pixels and opacity percentage. The stroke style group offers solid, dashed and dotted strokes; some effects depend on the selected tool. Eraser does not use the colour control.

Drawing always goes onto the active layer. New settings affect subsequent strokes, not existing ones. A pen can provide pressure input; the mouse uses a default value.

## Selection, clipboard and cropping

Choose Selection and drag a rectangle on the canvas. Then use **Edit**:

- **Copy** copies the composite image of the selected area, without references.
- **Cut** copies that same area and erases it on the active layer. Other layers remain in the composite, so the area may still show content.
- **Paste** inserts the clipboard image onto the active layer. With a selection, the image is fitted to that rectangle; otherwise it is centred. Immediately afterwards, you can drag the selection to move the pasted image. Selection is not a general object editor for existing strokes.
- **Crop**, after confirmation, clears everything outside the selection on all layers. It keeps the canvas dimensions; use Canvas size to change those. You can undo cropping.

When the cursor is in a text field, Cut/Copy/Paste work on text. To paste onto the drawing, focus the canvas first. A string or file path in the clipboard is not an image.

## Zoom and hand tool

Use the view's zoom controls or **View > Zoom canvas in / Zoom canvas out**. Zoom changes the view, not the project's pixels.

Select the **Hand** tool and drag to move the view of an enlarged canvas. Panning does not change strokes and is not saved in the project. **View > Reset canvas zoom** restores the zoom and centres the view. **View > Toggle fullscreen** gives you more drawing space.

## Advanced brushes and textures

1. Expand **Advanced brushes** and choose a **Brush preset**: Graphite pencil, Soft brush, Marker, Ink or Texture.
2. Choose a texture: None, Grain, Dots or Hatch.
3. Try a stroke and adjust the sliders. Choose the classic preset to return to standard drawing.

| Control | Effect on new strokes |
| --- | --- |
| Spacing | Distance between the stamps that make up a stroke. |
| Pressure size | How much pen pressure changes stroke width. |
| Pressure opacity | How much pressure changes transparency. |
| Velocity size | How much faster movement makes the stroke thinner. |
| Texture amount | Strength of the grain or pattern. |
| Texture scale | Size of the texture pattern. |

Texture and sliders appear when an advanced preset is selected. You can still adjust colour and S/O/H in the left toolbar. The preset also applies its tool and initial values; strokes retain the parameters they were created with, including after saving and reopening.

## References

**Import reference** opens a dialog to choose a local PNG, JPEG or WebP image. The image appears on the canvas as a guide, separate from drawing layers.

For each reference you can change visibility, opacity, **X/Y** position and **Width**, or delete it. Width preserves the aspect ratio; X and Y are canvas pixel coordinates. Lower the opacity to make tracing easier. Hiding it does not delete it.

Default settings allow up to four references, each up to 4 MiB, with additional image dimension checks. They are not links to the original files: they are embedded in the `.tdraw` and remain available when you reopen the project. They do not appear in exports, saved canvas PNGs or the image sent to AI.

## Canvas size

Use the **Canvas size** panel or **File > Settings > Canvas size...**. Choose **px** or **cm**, set width, height and DPI, then press **Apply**. The lock maintains the ratio between the sides; with it unlocked, you can change them independently.

The initial sheet is 2048 × 2048 px at 300 DPI. Default limits are 64–4096 px per side, 12 megapixels in total and 72–600 DPI. The panel reports invalid values.

In pixels, changing DPI keeps the pixel dimensions and changes physical size. In centimetres, it keeps the entered measurements and recalculates pixels, rounding to the actual dimensions. Conversion uses 2.54 cm per inch.

Resizing does not scale or remove strokes: the origin remains at the top left, and content beyond the edge may reappear when you enlarge the sheet. **Undo/Redo** also recover earlier dimensions. Exports use the canvas pixels; DPI supports project conversions and does not add DPI metadata to exported PNG/WebP files.

## Layers

Layers are stacked transparent sheets. Separate the background, outlines and colour, for example, to work on one part without erasing the others.

In **Layers**, use the add button, then click the row of the layer you want to draw on. Edit its name in the field, use the eye to show/hide it and the slider for opacity. The arrows change stacking order: layers at the top of the list cover those below. The delete button removes a layer; at least one always remains.

Eraser affects the active layer. A hidden or very transparent layer can make it seem as though you are not drawing. Order, visibility and opacity affect the canvas, exports and the drawing used for AI. These operations can be undone.

## Clip to layer

Clipping uses another layer's content as a stencil: strokes on the active layer remain visible only where the selected layer has visible pixels. It does not delete the outside parts, so you can change the target or disable clipping later.

### Example: colouring inside a circle

1. Rename a layer **Base**. Draw a circle outline with Ellipse and fill its interior with Fill, giving it a solid shape.
2. Add another layer, call it **Colour**, and select it.
3. Draw coloured strokes, including beyond the circle's edge.
4. In **Clip to layer**, select **Base** from the Colour layer's menu. Its strokes now appear only inside Base's solid shape.
5. Select **None** to show all of Colour's strokes again.

An outline alone restricts colour to the outline, not its whole interior: fill Base if you want to colour inside it. An empty or hidden target makes clipped content invisible; the target's opacity and transparency affect the result. Options that would create a cycle are disabled. Renaming or reordering Base keeps the link; deleting it removes the link.

## Document versions

Versions are copies of the document state stored in the project. Use them before experimenting with a variation.

1. In **Document versions**, enter a **Version name**, such as “Before colour”.
2. Press **Create version**. Leaving the field blank gives the version an automatic name.
3. Continue working. Versions are shown with date and type, newest first.
4. To rename one, edit its field and move focus out of the field.
5. Press **Restore version** and confirm to recover it. This restores the canvas, layers, references and AI image from that moment while keeping the version list. You can use Undo to recover the state before restoration.
6. **Delete version**, after confirmation, removes that copy. Save the project to keep these changes on disk.

**Automatic versions** is optional: with default settings it checks every five minutes and creates a copy only when content differs from the latest one. The list holds up to 20 versions and is also subject to storage limits. If creation is disabled or rejected, remove unwanted copies or reduce the document size.

**Undo/Redo** concerns the operation history within the session. Document versions are explicit return points retained in `.tdraw` files; recovery autosave protects against interruptions. These are three different functions.

## Inspector and AI generation

### Configure OpenAI

Open **File > Settings > API Key...**, or the key button in Inspector. Enter your OpenAI API key and choose an image model available to your account, then save. The default model is `gpt-image-1.5`.

The key is retained by the computer's secret storage system. Inspector shows whether it is configured and the storage backend. Encrypted local storage may be used as a fallback, with a warning if the system does not offer adequate protection. Do not put the key in a project name or style text.

### Choose a style and generate

In **File > Settings > Style...**, select a preset and read its description, or select Custom style and enter a short visual direction. You can mark a preset as your favourite and recall it from the same dialog. Save your choice.

Press **Generate image**, the circular arrows button in Inspector. An indicator appears while you wait; the preview displays the result when complete. The next generation replaces the current image: save it, export it or create a version before replacing a result you want to keep.

The composite canvas and generation instructions are sent to OpenAI. References, stored versions and the project name are not part of the generation content. Requests may incur charges on your OpenAI account and require Internet access; availability depends on the model and provider.

### Auto redraw

**File > Settings > Auto redraw...** lets you enable generation after a drawing pause and choose the delay. It is off by default. If you enable it with a configured key, canvas changes may start new paid requests. Disable it to choose each generation with Generate image.

## Saving, opening and exporting

**File > Save** stores the editable project; **Save as...** lets you choose another name/path. **File > Open** loads a `.tdraw`. New and Open ask for confirmation if the current project has unsaved changes.

For a project called `name`, saving produces:

| File | Content |
| --- | --- |
| `name.tdraw` | Canvas, layers and strokes, clipping effects, references, versions and any AI image. |
| `name_canvas.png` | Composite drawing without references. |
| `name_image.png` | AI image, when present. |

Keep the `.tdraw` to continue editing: a PNG does not preserve editable layers or versions. Filenames follow the path chosen in the save dialog.

**Export canvas PNG/WebP** creates an image of the drawing. **Export image PNG/WebP** exports the AI result instead, and requires an existing result. Exporting does not replace saving the project. PNG preserves quality without loss; WebP is useful for more compact sharing.

Older projects without explicit dimensions use the initial sheet size. Masks contained in old projects still affect their appearance and are preserved, but there are no commands to create or edit them. For new drawings, use layers and clipping.

## Autosave and recovery

With default settings, the app keeps a local autosave of changes every 30 seconds. This does not replace **File > Save**, is not a copy in a folder you selected and is not an external backup.

If an autosave is available on restart, **Autosave recovery** appears with its name and time. **Restore** recovers it; **Ignore**, after confirmation, deletes that recovery copy. The recovered document is not associated with its previous path: use Save and choose where to keep it. If you have several copies, check the name, time and content before overwriting a project.

## Shortcuts

Use Ctrl on Windows and ⌘ on macOS for combinations shown as Ctrl/⌘.

| Operation | Shortcut |
| --- | --- |
| New / Open / Save | Ctrl/⌘ + N / O / S |
| Save as | Ctrl/⌘ + Shift + S |
| Undo / Redo | Ctrl/⌘ + Z / Ctrl/⌘ + Shift + Z |
| Cut / Copy / Paste | Ctrl/⌘ + X / C / V |
| Crop | Ctrl/⌘ + Shift + X |
| API key settings | Ctrl/⌘ + , |
| Zoom in / out | Ctrl/⌘ + = / − |
| Reset zoom and view | Ctrl/⌘ + 0 |
| Fullscreen | F11 on Windows; Ctrl + ⌘ + F on macOS |

## Troubleshooting

| Problem | What to check |
| --- | --- |
| New strokes are invisible | Active layer, its visibility/opacity, colour and clipping. Try None for clipping. |
| Clipping hides everything | The target must contain visible pixels; fill the shape, show the target and check its opacity. |
| Advanced texture and sliders are missing | Select an advanced preset instead of Classic. |
| Paste does not add an image | Check that the clipboard contains an image and that focus is not in a text field. |
| Reference import fails | Check format, dimensions, the 4 MiB limit and reference count; try a smaller image. |
| I cannot create a version | Check the 20-copy limit and the document's storage requirements. |
| Generate image is disabled | Configure the API key or wait for the current request to finish. |
| AI request fails | Check the network, key validity, model/access and account availability or credit. Read the message in Inspector. |
| Canvas looks cut off | Reset zoom and view; also check the sheet dimensions. |
| Download will not open | Check architecture, source, checksum and system warnings for unsigned packages. |

## Privacy and limitations

Drawings, references, versions and autosaves are stored locally. AI generation sends the canvas and necessary instructions to OpenAI under the provider's terms. Consider their use before sending confidential content. Projects do not contain the API key, but do contain the references and images you inserted: account for these when sharing a `.tdraw`.

Local drawing does not require AI; image reinterpretation depends on OpenAI. Pressure response depends on the pen and drivers. Some labels remain English in the Italian interface. Packages are unsigned and there is no signed automatic updater.

For details on protection controls and limitations, see the [security model](SECURITY_MODEL.md). Code and documentation are distributed under the [Apache 2.0 licence](LICENSE).
