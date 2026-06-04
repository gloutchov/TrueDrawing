# True Drawing

## Italiano

True Drawing e' un'app desktop locale per macOS e Windows pensata per disegnare con mouse, tavoletta grafica tipo Wacom o input compatibili con Pointer Events. L'obiettivo e' permettere all'utente di creare un disegno su canvas e generare una versione realistica tramite API configurata dall'utente.

Il progetto e' in fase iniziale. La versione corrente e' `0.0.1` e contiene il bootstrap documentale, il piano milestone, le direttive di sviluppo, il modello di sicurezza iniziale, la mappa della struttura prevista e la configurazione applicativa iniziale.

Repository privato GitHub: `https://github.com/gloutchov/truedrawing`.

### Funzionalita' previste

- Canvas pulito per disegno libero.
- Strumenti per matita, pennarello, pennello e gomma.
- Controllo colore, dimensione tratto, opacita' e forma.
- Layer con creazione, modifica, cancellazione, visibilita' e riordino.
- Undo e redo.
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

## English

True Drawing is a local desktop app for macOS and Windows designed for drawing with a mouse, a graphics tablet such as Wacom, or input devices exposed through Pointer Events. The goal is to let users create a canvas drawing and generate a realistic image from it through a user-configured API.

The project is at its initial stage. Current version is `0.0.1` and includes documentation bootstrap, milestone plan, development directives, initial security model, planned architecture map, and initial app configuration.

Private GitHub repository: `https://github.com/gloutchov/truedrawing`.

### Planned Features

- Clean freehand drawing canvas.
- Pencil, marker, brush, and eraser tools.
- Color, stroke size, opacity, and shape controls.
- Layer creation, editing, deletion, visibility, and ordering.
- Undo and redo.
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
