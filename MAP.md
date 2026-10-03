# True Drawing - Mappa struttura programma

Questo file descrive la struttura prevista del programma. Deve essere aggiornato alla conclusione di ogni milestone quando cambiano file, cartelle o responsabilita'.

## Mappa repository

```text
truedrawing/
|
+-- VERSION
|   Versione corrente del progetto.
|
+-- package.json
|   Dichiara script, versione, dipendenze e metadati dell'app.
|
+-- tsconfig.json
|   Configurazione TypeScript con riferimenti ai target Electron e renderer.
|
+-- tsconfig.electron.json
|   Compilazione TypeScript per main, preload e moduli condivisi.
|
+-- tsconfig.renderer.json
|   Type-check TypeScript/React del renderer.
|
+-- vite.config.mts
|   Configurazione Vite per build renderer, con asset relativi per pacchetti Electron caricati da file.
|
+-- eslint.config.mjs
|   Regole lint TypeScript.
|
+-- electron-builder.yml
|   Configurazione packaging Windows/macOS e artifact release.
|
+-- LICENSE
|   Testo licenza Apache License 2.0 riconosciuto da GitHub e metadata repository.
|
+-- build/
|   |
|   +-- icon.ico
|   |   Icona Windows dell'app.
|   |
|   +-- icon.png
|       Icona macOS/Linux e sorgente immagine per packaging.
|
+-- docs/
|   |
|   +-- assets/
|   |   Screenshot e GIF usati dalla documentazione e dalla landing page pianificata.
|   |
|   +-- index.html
|   |   Landing page statica bilingue del programma.
|   |
|   +-- landing.css
|   |   Stili responsive della landing page.
|   |
|   +-- landing.js
|   |   Selezione lingua automatica/manuale della landing page.
|   |
|   +-- release-notes/
|       Note release versionate usate dal workflow GitHub manuale.
|
+-- index.html
|   Entry HTML del renderer Vite.
|
+-- src/
|   |
|   +-- main/
|   |   |
|   |   +-- clipboard/
|   |   |   `clipboardImages.ts`: appunti Electron 44 asincroni, ClipboardItem PNG e limiti prima dell'allocazione.
|   |   |
|   |   +-- appIcon.ts
|   |   |   Risoluzione dell'icona app per finestre e menu.
|   |   |
|   |   +-- appMain.ts
|   |   |   Avvio processo main Electron e ciclo vita app.
|   |   |
|   |   +-- config/
|   |   |   Caricamento configurazione centrale per il processo desktop.
|   |   |
|   |   +-- windows/
|   |   |   Creazione e gestione finestre.
|   |   |
|   |   +-- ipc/
|   |   |   Canali sicuri fra renderer e main process per config, runtime, segreti e generazione immagine.
|   |   |
|   |   +-- menu/
|   |   |   Menu applicativo, finestra info e apertura impostazioni API key.
|   |   |
|   |   +-- preferences/
|   |   |   Preferenze non segrete dell'utente, incluso modello immagini selezionato.
|   |   |
|   |   +-- security/
|   |   |   Installazione Content Security Policy per la sessione Electron.
|   |   |
|   |   +-- secret-store/
|   |   |   API key OpenAI in Windows Credential Manager, macOS Keychain o fallback cifrato.
|   |   |
|   |   +-- image-generation/
|   |   |   Adapter OpenAI Images API e sanitizzazione errori.
|   |   |
|   |   +-- project/
|   |       Salvataggio `.tdraw`, sidecar canvas/immagine, autosave, recupero, export tramite dialog nativi e allowlist percorsi scelti dall'utente.
|   |
|   +-- preload/
|   |   |
|   |   +-- index.ts
|   |       API minima esposta al renderer tramite context bridge.
|   |
|   +-- renderer/
|   |   |
|   |   +-- app/
|   |   |   Root React, layout, preferenze UI non segrete, status bar, recovery dialog e routing interno.
|   |   |
|   |   +-- canvas/
|   |   |   Canvas interattivo, coordinate Pointer Events, rendering tratti e spostamento della vista con manina.
|   |   |
|   |   |   +-- canvasPan.ts
|   |   |       Calcolo testabile dello spostamento della vista dai movimenti del puntatore.
|   |   |
|   |   +-- tools/
|   |   |   Toolbar, menu strumenti, preset, controlli colore/size/opacita'/hardness e stato tool.
|   |   |
|   |   +-- layers/
|   |   |   Pannello layer con creazione, rinomina, visibilita', opacita', riordino e cancellazione protetta.
|   |   |
|   |   +-- history/
|   |   |   Hook renderer per undo/redo del documento di disegno.
|   |   |
|   |   +-- inspector/
|   |   |   Inspector realistico con preview immagine, stati vuoti/errore/generazione e metadati provider/modello.
|   |   |
|   |   +-- settings/
|   |   |   Riepilogo impostazioni provider/modello/stile, editor condiviso dimensioni canvas, dialog API key, stile immagine, redraw automatico e interfaccia.
|   |   |   `CanvasDimensionsEditor.tsx` serve sia il pannello destro sia il dialog del menu Impostazioni.
|   |   |
|   |   +-- ui/
|   |   |   `CollapsiblePanel.tsx` fornisce intestazione e stato di apertura ai tre riquadri del pannello destro.
|   |   |
|   |   +-- i18n/
|   |   |   Dizionario italiano/inglese per menu e controlli principali del renderer.
|   |   |
|   |   +-- styles/
|   |       Stili globali renderer, focus visibile e layout responsive desktop.
|   |
|   +-- shared/
|   |   |
|   |   +-- drawing/
|   |   |   Tipi stroke, strumenti tratto/linea/shape/fill, tipo tratto, pressione, distanza minima e smoothing.
|   |   |
|   |   +-- history/
|   |   |   Modello condiviso e testabile per stack undo/redo.
|   |   |
|   |   +-- document/
|   |   |   Tipi e modello layer/documento True Drawing; conversione cm/pixel, DPI e limiti canvas in `canvasDimensions.ts`.
|   |   |
|   |   +-- image-generation/
|   |   |   Tipi generazione immagine e prompt tecnico realistico.
|   |   |   +-- stylePresets.ts
|   |   |   |   Preset bilingui, parametri OpenAI e validazione testo/ID.
|   |   |   +-- realisticPrompt.ts
|   |   |       Prompt composizione/stile senza metadati del documento.
|   |   |
|   |   +-- project/
|   |   |   Formato progetto versionato, validazione, serializzazione e naming file.
|   |   |
|   |   +-- config/
|   |   |   Tipi, schema, validazione e caricamento file configurazione.
|   |   |
|   |   +-- security/
|   |   |   Builder CSP condiviso e testabile.
|   |   |   +-- credentialText.ts
|   |   |       Guardia euristica su incolli accidentali di credenziali.
|   |   |
|   |   +-- runtime/
|   |       Tipi per informazioni runtime esposte al renderer.
|
+-- config/
|   |
|   +-- app.config.json
|       Parametri modificabili da utenti skilled e sviluppatori, inclusi default UI non segreti. Non contiene segreti.
|
+-- tests/
|   |
|   +-- unit/
|   |   Test di modello, strumenti, pan e dimensioni canvas, layer, history, config, adapter, segreti, preferenze, CSP, formato progetto e configurazione Vite.
|   |
|   +-- e2e/
|       Test end-to-end su flussi principali.
|
+-- .github/
|   |
|   +-- workflows/
|       |
|       +-- ci.yml
|       |   CI: installazione dipendenze, documenti obbligatori, lint, test e build.
|       |
|       +-- release.yml
|           Release manuale: validazione tag/versione, lint, test, build, creazione note release, package Windows/macOS, checksum SHA-256 e upload diretto degli asset non firmati sulla release GitHub.
|
+-- README.md
|   Descrizione progetto in italiano e inglese.
|
+-- ISTRUZIONI.md
|   Istruzioni utente in italiano.
|
+-- INSTRUCTIONS.md
|   Istruzioni utente in inglese.
|
+-- SECURITY_MODEL.md
|   Modello di sicurezza in italiano e inglese.
|
+-- AGENTS.md
|   Direttive operative per sviluppo e manutenzione.
|
+-- STARTUP_PREFERENCES.md
|   Preferenze operative generali per milestone, Git, CI, documentazione e sicurezza.
|
+-- PLAN.md
|   Piano milestone, versioni, verifiche e stato avanzamento.
|
+-- MAP.md
    Mappa ASCII della struttura del programma.
```

## Note di configurazione

- `config/app.config.json` raccoglie i parametri modificabili.
- Il provider immagini predefinito e' OpenAI.
- Il modello immagini OpenAI predefinito e' `gpt-image-1.5`.
- I modelli immagini in configurazione sono suggerimenti UI: l'utente puo' scrivere un nome modello futuro nelle impostazioni.
- La API key non deve stare in `config/app.config.json`: viene salvata nel keychain del sistema operativo.

## Stato attuale

- Versione corrente su `main`: `1.11.2`; release GitHub pubblicata: `v1.11.0`.
- Ultima milestone completata: C24 - Spaziatura del pulsante Crea versione.
- Milestone corrente: nessuna; M25 e' la prossima pianificata.
- Stato milestone: C24 completata con checkpoint `milestone/C24`.
- Release Windows/macOS: distribuzione via GitHub senza firma codice o notarizzazione finche' non saranno disponibili credenziali dedicate; la documentazione utente segnala gli avvisi SmartScreen/Gatekeeper attesi.
- Skeleton Electron/Vite/React implementato.
- Configurazione centrale validata e caricata dal processo main.
- Canvas interattivo presente con Pointer Events, pressione normalizzata, smoothing e rendering locale.
- Strumenti matita, pennarello, pennello e gomma collegati al canvas.
- Sottomenù tool per tratto, linea, shape, tipo tratto e strumento riempimento con flood fill delimitato.
- Strumento selezione rettangolare per cut/copy/paste canvas, paste spostabile finche' selezionato e shortcut `Ctrl/Cmd+X/C/V`.
- Menu Edit collegato alla history del disegno, alla selezione canvas e alla clipboard testo/immagine tramite IPC controllati.
- Zoom canvas con pulsanti, rotella e comandi View dedicati.
- Zoom canvas persistente come preferenza UI non segreta in `localStorage`.
- Pan canvas con la manina mantenuto nella sola memoria del renderer, senza modificare documento o export.
- Dimensioni canvas e DPI nel documento, modificabili dal pannello destro e dal menu Impostazioni; conversione cm/pixel, lucchetto proporzioni e undo/redo.
- Riquadri Inspector, Dimensioni canvas e Layer, in quest'ordine, collassabili in modo indipendente tramite la freccia all'estrema destra dell'intestazione.
- Status bar con stato salvataggio, modifiche, tool, layer attivo, conteggio layer/tratti e zoom.
- Inspector realistico proporzionale al canvas di disegno.
- Controlli colore, dimensione, opacita' e hardness letti dalla configurazione.
- Layer con creazione, rinomina, cancellazione protetta, visibilita', opacita' e riordino.
- Conferme per eliminazione layer, rimozione API key, scarto autosave e chiusura con modifiche non salvate.
- Undo/redo del documento presente con modello history testabile.
- Inspector realistico con generazione OpenAI dal canvas composito e stati chiari per API key mancante, immagine assente, generazione ed errore.
- Menu `File > Impostazioni > API Key...` per inserire, sostituire e rimuovere la chiave OpenAI.
- Storage API key tramite Windows Credential Manager, macOS Keychain o fallback cifrato, con chiamate OpenAI gestite dal main process.
- Preferenze modello immagini, stile immagine e redraw automatico persistenti e separate dalla API key.
- Preferenze lingua interfaccia e tema chiaro/scuro persistenti in `localStorage`, con default di sistema.
- Menu `File > Impostazioni > Stile...`, `File > Impostazioni > Redraw automatico...` e `File > Impostazioni > Interfaccia...` per controllare prompt, rigenerazione inspector, lingua e tema.
- Il dialog Stile usa campo testo libero e pulsanti preset; il dropdown duplicato e' stato rimosso.
- Salvataggio manuale `.tdraw` con sidecar `<nome>_canvas.png` e `<nome>_image.png`.
- Salvataggio rapido vincolato ai percorsi progetto selezionati dall'utente nella sessione main.
- Limiti payload IPC per immagini/prompt/clipboard e limite dimensione file progetto in apertura.
- Autosave temporizzato in `userData`, recupero ultimo autosave disponibile ed export PNG/WebP.
- CSP e sandbox renderer configurati.
- UI modulare presente per canvas, strumenti, inspector, layer e settings.
- Workflow CI presente; workflow release Windows/macOS manuale consolidato con validazione tag/versione, note release, checksum e upload diretto asset.
- Landing page statica in `docs/` completata con asset reali, lingua IT/EN, layout responsive, dominio canonico `https://truedrawing.glaucosilvestri.it/` e link al sito principale.
- Build renderer configurata con asset relativi, cosi' i pacchetti Electron installati caricano correttamente JavaScript e CSS da `file://`.
- Tema scuro corretto nei dialog Stile e Redraw automatico per mantenere leggibili preset e checkbox.

## C14 - Sicurezza (`1.3.0`)

- `src/shared/security/imagePayload.ts`: limiti comuni per data URL, anche nei progetti.
- `src/main/security/ipcSecurity.ts`: sender principale, origine e messaggi IPC controllati.
- `src/main/security/remoteImage.ts`: HTTPS, DNS pubblico alla connessione, timeout, nessun redirect e limite streaming.
- `tests/unit/securityHardening.test.ts`, `remoteImage.test.ts`, `secretHygiene.test.ts`: controlli negativi e assenza di credenziali nelle fixture.
- `.github/dependabot.yml`: proposte aggiornamenti mensili limitate.

## C15 - Brush avanzati e texture personalizzate (`1.4.0`)

Preset brush bilingui da configurazione: grafite, morbido, marker, inchiostro e texture; controlli pressione, velocita, spaziatura e texture procedurali. Parametri immutabili nei tratti e persistenti nei file tdraw. / Configurable bilingual brush presets, pressure/speed/spacing and procedural texture controls; per-stroke parameters persist in tdraw.

## C16 - Import immagini di riferimento (`1.5.0`)

Import locale PNG/JPEG/WebP da dialogo nativo controllato, normalizzazione PNG e limiti bytes/pixel. Riferimenti embedded separati con visibilita, opacita, posizione e scala: esclusi da export e AI. Caricamento immagini prima del rendering dopo riapertura. / Local dialog-controlled imports; embedded references with visibility, opacity, position and scale, excluded from exports and AI.

- `src/shared/document/referenceModel.ts`: metadati, trasformazione e validazione riferimenti embedded.
- `src/main/project/referenceImport.ts`: scelta locale, limiti, decodifica e normalizzazione PNG nel main.
- `src/renderer/references/ReferencePanel.tsx`: visibilita, opacita, posizione e scala proporzionale.
- `tests/unit/referenceImport.test.ts`: formato, limiti, privacy del percorso e persistenza.
- `src/renderer/project/ProjectNameDialog.tsx`: nome progetto prima del salvataggio, senza window.prompt non supportato in Electron.

Patch `1.5.1`: WebP decodificato dal canvas Chromium dopo verifica RIFF/dimensioni nel main e normalizzato a PNG, perche nativeImage non supporta questo formato. / WebP is decoded by Chromium Canvas after RIFF/dimension checks in main and normalized to PNG, because nativeImage does not support this format. 87 test, lint/build e smoke import WebP chiaro/scuro.

## C17 - Maschere e clipping layer (`1.6.0`)

Maschere non distruttive con editor, attivazione e rimozione; clipping con identita layer stabili, controllo cicli e pulizia relazioni alla cancellazione. Rendering condiviso per canvas/export/AI, undo/redo e persistenza tdraw. / Non-destructive editable masks, stable layer clipping with cycle validation, shared rendering, undo/redo and persistence.

- `src/shared/document/layerEffects.ts`: maschere, clipping per identita, validazione cicli.
- `src/renderer/layers/LayerEffectsPanel.tsx`: editor maschera e target clipping per layer attivo.
- `tests/unit/layerEffects.test.ts`: persistenza, cancellazione, riordino e undo/redo.

## C18 - Storia versioni del documento (`1.7.0`)

Snapshot persistenti manuali/automatici, consultazione, rinomina, ripristino e cancellazione; capsule senza ricorsione e limiti numero/byte da configurazione. Ripristino completo di canvas, layer, maschere, riferimenti e immagine AI; versioni conservate in tdraw e autosave, Undo ripristina lo stato precedente. / Persistent bounded document versions with complete restoration and non-recursive capsules.

- `src/shared/document/snapshotModel.ts`: capsule persistenti senza ricorsione, budget e ripristino.
- `src/renderer/project/SnapshotPanel.tsx`: creazione, rinomina, ripristino, cancellazione e snapshot automatici.
- `tests/unit/snapshotModel.test.ts`: compatibilita tdraw, limiti e integrita dello stato ripristinato.

## C19 - Preset di stile realistico (`1.8.0`)

Preset di stile bilingui con descrizioni, frammenti prompt e parametri OpenAI validati; preferito e stile personalizzato persistenti. Prompt privo di metadati progetto, guardia su credenziali accidentali e messaggi provider sanitizzati. / Configurable bilingual style presets, persistent favorite/custom styles and minimal generation payloads.

- `src/renderer/settings/ImageStyleDialog.tsx`: selezione preset con descrizione, preferito e testo custom; stile/preferito salvati in un unico aggiornamento.
- `src/main/preferences/imageGenerationPreferencesStore.ts`: persistenza non segreta e compatibilita' legacy.
- `tests/unit/stylePresets.test.ts`, `realisticPrompt.test.ts`, `imageGenerationPreferencesStore.test.ts`, `openAiImageAdapter.test.ts`: configurazione, prompt minimo, preferenze e parametri/errori provider.
- `docs/release-notes/v1.8.0.md`: note bilingui della release cumulativa C14-C19 e patch WebP.

## C20 - Aggiornamento toolchain di sviluppo (`1.9.0`)

Toolchain aggiornata con Electron 44.4.5, Vite 8, Vitest 5 ed ESLint 10. TypeScript 6.0.3 e trattenuto sotto 6.1 per il supporto dichiarato di typescript-eslint; proposta TypeScript 7 rinviata. Config Vite ESM esplicita, compilazione Electron Node16/CommonJS, appunti PNG/testo asincroni con limiti e sanitizzazione senza cause private. / Updated toolchain with Electron 44.4.5, Vite 8, Vitest 5 and ESLint 10. TypeScript 6.0.3 stays below 6.1 within typescript-eslint support; TypeScript 7 is deferred. Explicit ESM Vite config, Node16/CommonJS Electron compilation and bounded asynchronous PNG/text clipboard with sanitized public errors.

- `tests/unit/clipboardImages.test.ts`: scritture asincrone, errori nativi, decodifica PNG e limite Blob prima di arrayBuffer.
- `src/main/security/ipcSecurity.ts`: costruzione errori pubblici senza cause/stack remoti, compatibile con ESLint 10.
- `.github/dependabot.yml`: TypeScript >=6.1 escluso finche typescript-eslint non dichiara supporto; rivalutare alla sua migrazione.

## C21 - Migrazione React e React DOM (`1.10.0`)

React e React DOM allineati a 19.3.0 con tipi compatibili; componenti migrati al namespace JSX di React. La toolchain C20 resta preservata durante la risoluzione dei conflitti del lockfile; interazioni canvas, dialoghi e persistenza verificate nel renderer di produzione. / React and React DOM aligned at 19.3.0 with matching types; components use React-scoped JSX types. C20 toolchain preserved while resolving lockfile conflicts; canvas interactions, dialogs and persistence verified in the production renderer.

## C22 - Aggiornamento icone Lucide (`1.11.0`)

Lucide React aggiornato a 1.48.0 con React 19; export, toolbar, pannelli e icone SVG accessibili verificati nei temi chiaro/scuro. Migrazioni C20-C22 integrate preservando i commit Dependabot; release cumulativa Windows/macOS con pacchetti non firmati e verifica SHA-256 prevista nella chiusura. / Lucide React upgraded to 1.48.0 with React 19; exports, toolbars, panels and accessible SVG icons verified in light/dark themes. C20-C22 migrations preserve Dependabot commits; cumulative unsigned Windows/macOS release and SHA-256 verification complete the closing process.

- `docs/release-notes/v1.11.0.md`: note bilingui della release cumulativa C20-C22, migrazioni runtime/toolchain e limiti di compatibilita.

## C23 - Spaziatura del pannello Riferimenti (`1.11.1`)

Importa riferimento allineato a destra; contenuto del pannello con padding 10/12 px e gap 8 px condivisi con Dimensioni canvas. Controlli e testo separati dai bordi. / Import reference aligned to the right; panel content uses the Canvas size padding (10/12 px) and 8 px gap. Controls and text have consistent space from panel edges.

## C24 - Spaziatura del pulsante Crea versione (`1.11.2`)

Crea versione allineato a destra come Applica, con margine superiore 8 px, inferiore 12 px e laterale 10 px. / Create version is aligned to the right like Apply, with 8 px above, 12 px below and 10 px beside the button.
