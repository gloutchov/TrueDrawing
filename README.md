# True Drawing

## Italiano

True Drawing e' un'app desktop locale per macOS e Windows pensata per disegnare con mouse, tavoletta grafica tipo Wacom o input compatibili con Pointer Events. L'obiettivo e' permettere all'utente di creare un disegno su canvas e generare una versione realistica tramite API configurata dall'utente.

Il progetto e' in fase iniziale. La versione corrente e' `0.4.0` e contiene lo skeleton desktop Electron/Vite/React, struttura modulare, configurazione centrale validata, canvas interattivo con Pointer Events, strumenti matita/pennarello/pennello/gomma, controlli tratto, layer con visibilita'/opacita'/riordino e undo/redo, CI con lint/test/build e workflow release Windows/macOS.

Repository privato GitHub: `https://github.com/gloutchov/truedrawing`.

### Funzionalita' previste

- App desktop Electron avviabile con finestra principale True Drawing.
- Canvas pulito per disegno libero con input mouse, penna e touch compatibile.
- Strumenti per matita, pennarello, pennello e gomma.
- Controllo colore, dimensione tratto, opacita' e hardness.
- Layer con creazione, rinomina, cancellazione protetta, visibilita', opacita' e riordino.
- Undo e redo per tratti disegnati e operazioni layer.
- Inspector per generare e mostrare l'immagine realistica.
- Doppio click sull'inspector per passare fra immagine realistica e canvas.
- Autosave e salvataggio manuale di canvas e immagine.
- Gestione API key tramite keychain del sistema operativo.
- Modello immagini configurabile dall'utente, con default OpenAI `gpt-image-1.5`.

### Documenti principali

- `PLAN.md`: piano milestone, versioni e verifiche.
- `AGENTS.md`: direttive operative per lo sviluppo.
- `MAP.md`: mappa ASCII della struttura del programma.
- `ISTRUZIONI.md`: istruzioni utente in italiano.
- `INSTRUCTION.md`: istruzioni utente in inglese.
- `SECURITY_MODEL.md`: modello di sicurezza in italiano e inglese.
- `config/app.config.json`: parametri modificabili da utenti skilled e sviluppatori.

### Sviluppo locale

Requisiti:

- Node.js 22.
- npm.

Comandi:

- `npm ci --no-audit --no-fund`
- `npm run dev`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run dist:win`
- `npm run dist:mac`

## English

True Drawing is a local desktop app for macOS and Windows designed for drawing with a mouse, a graphics tablet such as Wacom, or input devices exposed through Pointer Events. The goal is to let users create a canvas drawing and generate a realistic image from it through a user-configured API.

The project is at its initial stage. Current version is `0.4.0` and includes the Electron/Vite/React desktop skeleton, modular structure, validated central configuration, interactive canvas with Pointer Events, pencil/marker/brush/eraser tools, stroke controls, layers with visibility/opacity/ordering and undo/redo, CI with lint/test/build, and Windows/macOS release workflow.

Private GitHub repository: `https://github.com/gloutchov/truedrawing`.

### Planned Features

- Runnable Electron desktop app with a True Drawing main window.
- Clean freehand drawing canvas with mouse, pen, and compatible touch input.
- Pencil, marker, brush, and eraser tools.
- Color, stroke size, opacity, and hardness controls.
- Layer creation, renaming, protected deletion, visibility, opacity, and ordering.
- Undo and redo for drawn strokes and layer operations.
- Inspector for realistic image generation and preview.
- Double click on the inspector to switch between realistic image and drawing canvas.
- Autosave and manual save for both canvas and generated image.
- API key management through the operating system keychain.
- User-configurable image model, defaulting to OpenAI `gpt-image-1.5`.

### Main Documents

- `PLAN.md`: milestone plan, versions, and verification rules.
- `AGENTS.md`: development operating instructions.
- `MAP.md`: ASCII map of the program structure.
- `ISTRUZIONI.md`: user instructions in Italian.
- `INSTRUCTION.md`: user instructions in English.
- `SECURITY_MODEL.md`: security model in Italian and English.
- `config/app.config.json`: parameters editable by skilled users and developers.

### Local Development

Requirements:

- Node.js 22.
- npm.

Commands:

- `npm ci --no-audit --no-fund`
- `npm run dev`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run dist:win`
- `npm run dist:mac`
