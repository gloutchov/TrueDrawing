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

### Download, signing, and checksums

True Drawing was born as a personal program and was later published as an open source project under the Apache 2.0 license. The published builds are not signed with Apple or Windows certificates.

This means that:

- on macOS, a Gatekeeper warning may appear on first launch;
- on Windows, a SmartScreen or "unknown publisher" warning may appear;
- the source code remains inspectable in the repository, but the downloaded packages do not have a commercial operating-system signature.

It is therefore possible that, at launch, the operating system will ask you for permission to proceed with opening the app.

_Note:_ If you have doubts, the repository contains the program checksums. In the Tech area of this document you will find instructions for verifying that the files have not been compromised.

### Verifying SHA-256 checksums

Release `v1.0.1` includes `SHA256SUMS-windows.txt` and `SHA256SUMS-macos.txt`. Download the checksum file for your operating system together with the app package.

On Windows, from the folder containing the installer:

```powershell
Get-FileHash .\True-Drawing-1.0.1-Windows-x64.exe -Algorithm SHA256
```

Compare the `Hash` value with the matching line in `SHA256SUMS-windows.txt`.

On macOS, from the download folder:

```bash
shasum -a 256 True-Drawing-1.0.1-macOS-arm64.dmg
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

On the left side of the screen are the main drawing tools. That is, from top to bottom:

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

The Settings menu lets you change the program language, its appearance, enter the AI API key, choose the type of output image (realistic, cartoon, etc.), and set automatic AI image generation during pauses in drawing.

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
