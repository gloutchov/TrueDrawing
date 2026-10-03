<p align="center">
  <img src="build/icon.png" alt="True Drawing" width="112" />
</p>

<h1 align="center">True Drawing</h1>

<p align="center">
  <strong>Disegna un'idea. Lascia che l'AI la interpreti.</strong><br />
  <strong>Sketch an idea. Let AI interpret it.</strong>
</p>

<p align="center">
  <a href="https://truedrawing.glaucosilvestri.it/">Sito / Website</a> ·
  <a href="https://github.com/gloutchov/TrueDrawing/releases/latest">Download</a> ·
  <a href="ISTRUZIONI.md">Manuale IT</a> ·
  <a href="INSTRUCTIONS.md">English manual</a>
</p>

[Italiano](#italiano) · [English](#english) · [Documentazione / Documentation](#documentazione--documentation)

## Italiano

True Drawing è un'app desktop open source per **Windows e macOS**. Nasce dal gioco di fare uno schizzo veloce e farlo interpretare a qualcun altro: disegna sul tuo computer, poi usa la tua API key OpenAI per trasformare l'idea in un'immagine.

Puoi disegnare, salvare ed esportare il canvas senza configurare l'AI. La generazione richiede Internet e può avere un costo sul tuo account OpenAI.

### Cosa puoi fare

- **Disegnare:** matita, pennarello, pennello, gomma, linee, forme e riempimento, con colore, spessore, opacità e tipo di tratto.
- **Personalizzare il tratto:** preset di grafite, pennelli morbidi, marker, inchiostro e texture, con risposta a pressione e velocità.
- **Organizzare il lavoro:** layer separati, ordine, visibilità e opacità; clipping per colorare entro il contenuto di un altro layer.
- **Usare un foglio su misura:** dimensioni in pixel o centimetri, DPI, proporzioni bloccabili, zoom e manina; immagini locali di riferimento per guidare il disegno.
- **Sperimentare e conservare:** Undo/Redo, selezione e appunti, versioni documento manuali o automatiche, progetti `.tdraw`, autosave e recupero, export PNG/WebP.
- **Reinterpretare lo schizzo:** Inspector con anteprima AI, modello configurabile, preset di stile, preferito e stile personalizzato; generazione manuale o dopo una pausa dal disegno.

Interfaccia italiana/inglese e tema chiaro/scuro seguono il sistema o una tua preferenza. I pannelli destri sono comprimibili e scorrono nell'ordine Inspector, Riferimenti, Dimensioni canvas, Versioni documento, Brush avanzati, Layer e Clipping su layer. Mouse, trackpad e penne compatibili usano lo stesso canvas; la pressione dipende dal dispositivo.

### Scaricare e iniziare

Scarica il pacchetto per il tuo sistema da [GitHub Releases](https://github.com/gloutchov/TrueDrawing/releases/latest): installer **Windows x64**, oppure **DMG/ZIP macOS Apple Silicon**. Controlla note e architettura prima dell'installazione. I pacchetti sono **non firmati e non notarizzati**: SmartScreen o Gatekeeper possono mostrare un avviso. Le release includono checksum SHA-256; il [manuale italiano](ISTRUZIONI.md#installazione-e-primo-avvio) spiega installazione e verifica.

1. Apri l'app, dai un nome al disegno e scegli uno strumento nella barra sinistra.
2. Disegna sul canvas; aggiungi layer per separare contorni e colore.
3. Usa **File > Salva** per conservare il progetto modificabile, oppure **Esporta canvas PNG** per condividerlo come immagine.
4. Per usare l'AI, configura **File > Impostazioni > API Key...** e scegli uno stile in **Stile...**.
5. Premi **Genera immagine** in Inspector. Salva il progetto o esporta il risultato prima di generarne un altro da conservare.

Il `.tdraw` conserva tratti, layer, clipping, riferimenti, versioni e immagine AI presente. Il salvataggio crea anche il PNG del canvas e, quando disponibile, dell'immagine generata. Le immagini di riferimento restano nel progetto ma sono escluse da export e generazione.

### Come è fatta

- **Electron main** gestisce finestra, menu nativi, file, appunti, segreti e richieste OpenAI. Il **preload** espone al renderer operazioni IPC controllate.
- **React e TypeScript** compongono l'interfaccia; **Canvas 2D e Pointer Events** gestiscono il disegno. Moduli condivisi modellano tratti, layer, clipping, dimensioni, versioni e file progetto.
- **Vite** costruisce il renderer; **electron-builder** prepara i pacchetti. [config/app.config.json](config/app.config.json) centralizza parametri e limiti validati all'avvio. La [mappa del repository](MAP.md) descrive cartelle e responsabilità.

### Privacy e sicurezza

Progetti, riferimenti e autosave sono locali. Quando generi, il canvas composito e le indicazioni di stile vengono inviati a OpenAI; il nome del progetto, i riferimenti e le versioni archiviate sono esclusi dal contenuto di generazione. La chiave usa Windows Credential Manager, macOS Keychain o un fallback locale cifrato, con avvisi quando la protezione è limitata.

Il renderer è isolato dalle API Node e usa un preload ristretto; file, payload e comunicazioni hanno controlli di validazione. I limiti residui sono descritti nel [modello di sicurezza](SECURITY_MODEL.md). L'autosave aiuta il recupero ma non sostituisce un backup dei tuoi progetti.

### Sviluppo e distribuzione

Servono **Node.js 22, almeno 22.13**, npm e un ambiente grafico compatibile con Electron. Dalla cartella del repository:

```bash
npm ci --no-audit --no-fund
npm run dev
```

Verifica il progetto con:

```bash
npm run lint
npm run test
npm run build
```

Per creare pacchetti locali usa `npm run dist:win` su Windows o `npm run dist:mac` su macOS. L'output va in `release/`; questi comandi non pubblicano su GitHub. La CI verifica documenti, versione canonica, lint, test e build; il workflow di release viene avviato manualmente e genera asset e checksum per i due sistemi. Firma e notarizzazione richiedono credenziali dedicate.

## English

True Drawing is an open source desktop app for **Windows and macOS**. It began as a game of making a quick sketch and letting someone else interpret it: draw on your computer, then use your own OpenAI API key to turn the idea into an image.

You can draw, save and export the canvas without configuring AI. Generation requires Internet access and may incur charges on your OpenAI account.

### What you can do

- **Draw:** pencil, marker, brush, eraser, lines, shapes and fill, with colour, width, opacity and stroke style.
- **Shape your strokes:** graphite, soft brush, marker, ink and texture presets, with pressure and speed response.
- **Organise your work:** separate layers, stacking order, visibility and opacity; clipping to colour within another layer's content.
- **Choose your sheet:** pixel or centimetre dimensions, DPI, optional aspect lock, zoom and hand tool; local reference images to guide drawing.
- **Experiment and preserve:** Undo/Redo, selection and clipboard, manual or automatic document versions, `.tdraw` projects, autosave and recovery, PNG/WebP export.
- **Reinterpret the sketch:** Inspector with AI preview, configurable model, style presets, favourite and custom style; manual generation or generation after a drawing pause.

Italian/English interface and light/dark theme follow the system or your preference. Collapsible right panels scroll in this order: Inspector, References, Canvas size, Document versions, Advanced brushes, Layers and Clip to layer. Mouse, trackpad and compatible pens share the canvas; pressure depends on the device.

### Download and get started

Download the package for your system from [GitHub Releases](https://github.com/gloutchov/TrueDrawing/releases/latest): **Windows x64 installer**, or **DMG/ZIP for Apple Silicon macOS**. Check notes and architecture before installation. Packages are **unsigned and not notarized**: SmartScreen or Gatekeeper may show a warning. Releases include SHA-256 checksums; the [English manual](INSTRUCTIONS.md#installation-and-first-launch) explains installation and verification.

1. Open the app, name your drawing and choose a tool in the left toolbar.
2. Draw on the canvas; add layers to separate outlines and colour.
3. Use **File > Save** to keep the editable project, or **Export canvas PNG** to share it as an image.
4. For AI, configure **File > Settings > API Key...** and choose a style in **Style...**.
5. Press **Generate image** in Inspector. Save the project or export a result you want to keep before generating another.

The `.tdraw` retains strokes, layers, clipping, references, versions and any AI image. Saving also creates a canvas PNG and, when available, a PNG of the generated image. Reference images remain in the project but are excluded from export and generation.

### How it is built

- **Electron main** handles the window, native menus, files, clipboard, secrets and OpenAI requests. The **preload** exposes controlled IPC operations to the renderer.
- **React and TypeScript** compose the interface; **Canvas 2D and Pointer Events** handle drawing. Shared modules model strokes, layers, clipping, dimensions, versions and project files.
- **Vite** builds the renderer; **electron-builder** prepares packages. [config/app.config.json](config/app.config.json) centralises settings and limits validated at startup. The [repository map](MAP.md) describes folders and responsibilities.

### Privacy and security

Projects, references and autosaves are local. When you generate, the composite canvas and style instructions are sent to OpenAI; project names, references and stored versions are excluded from generation content. The key uses Windows Credential Manager, macOS Keychain or an encrypted local fallback, with warnings when protection is limited.

The renderer is isolated from Node APIs and uses a restricted preload; files, payloads and communications undergo validation. The [security model](SECURITY_MODEL.md) describes remaining limitations. Autosave helps recovery but does not replace project backups.

### Development and distribution

You need **Node.js 22, at least 22.13**, npm and a graphical environment compatible with Electron. From the repository folder:

```bash
npm ci --no-audit --no-fund
npm run dev
```

Check the project with:

```bash
npm run lint
npm run test
npm run build
```

To create local packages, run `npm run dist:win` on Windows or `npm run dist:mac` on macOS. Output goes into `release/`; these commands do not publish to GitHub. CI checks documents, the canonical version, lint, tests and build; the release workflow is started manually and generates assets and checksums for both systems. Signing and notarization require dedicated credentials.

## Documentazione / Documentation

| Documento / Document | Contenuto / Contents |
| --- | --- |
| [ISTRUZIONI.md](ISTRUZIONI.md) | Manuale utente italiano, procedure ed esempi. |
| [INSTRUCTIONS.md](INSTRUCTIONS.md) | English user manual, procedures and examples. |
| [SECURITY_MODEL.md](SECURITY_MODEL.md) | Sicurezza, privacy e limiti / Security, privacy and limitations. |
| [MAP.md](MAP.md) | Struttura e responsabilità / Structure and responsibilities. |
| [PLAN.md](PLAN.md) | Piano di sviluppo e avanzamento / Development plan and progress. |
| [AGENTS.md](AGENTS.md) · [STARTUP_PREFERENCES.md](STARTUP_PREFERENCES.md) | Regole di manutenzione / Maintenance conventions. |
| [Sito / Website](https://truedrawing.glaucosilvestri.it/) | Presentazione e interfaccia / Introduction and interface. |
| [Releases](https://github.com/gloutchov/TrueDrawing/releases) | Download, note e checksum / Downloads, notes and checksums. |
| [LICENSE](LICENSE) | Apache License 2.0. |

True Drawing è sviluppato con assistenza AI. Codice e documentazione sono disponibili con licenza Apache 2.0. / True Drawing is developed with AI assistance. Code and documentation are available under the Apache 2.0 licence.
