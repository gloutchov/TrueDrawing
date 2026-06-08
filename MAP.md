# True Drawing - Mappa struttura programma

Questo file descrive la struttura prevista del programma. Deve essere aggiornato alla conclusione di ogni milestone quando cambiano file, cartelle o responsabilita'.

## Mappa iniziale prevista

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
+-- vite.config.ts
|   Configurazione Vite per build renderer.
|
+-- eslint.config.mjs
|   Regole lint TypeScript.
|
+-- electron-builder.yml
|   Configurazione packaging Windows/macOS e artifact release.
|
+-- build/
|   |
|   +-- icon.ico
|   |   Icona Windows dell'app.
|   |
|   +-- icon.png
|       Icona macOS/Linux e sorgente immagine per packaging.
|
+-- index.html
|   Entry HTML del renderer Vite.
|
+-- src/
|   |
|   +-- main/
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
|   |   +-- secret-store/
|   |   |   Storage cifrato locale della API key OpenAI tramite main process.
|   |   |
|   |   +-- image-generation/
|   |   |   Adapter OpenAI Images API e sanitizzazione errori.
|   |   |
|   |   +-- storage/
|   |       Salvataggio, autosave, recupero ed export futuri.
|   |
|   +-- preload/
|   |   |
|   |   +-- index.ts
|   |       API minima esposta al renderer tramite context bridge.
|   |
|   +-- renderer/
|   |   |
|   |   +-- app/
|   |   |   Root React, layout e routing interno.
|   |   |
|   |   +-- canvas/
|   |   |   Canvas interattivo, coordinate Pointer Events e rendering tratti con strumenti selezionati.
|   |   |
|   |   +-- tools/
|   |   |   Toolbar, preset strumenti, controlli colore/size/opacita'/hardness e stato tool.
|   |   |
|   |   +-- layers/
|   |   |   Pannello layer con creazione, rinomina, visibilita', opacita', riordino e cancellazione protetta.
|   |   |
|   |   +-- history/
|   |   |   Hook renderer per undo/redo del documento di disegno.
|   |   |
|   |   +-- inspector/
|   |   |   Inspector realistico con preview immagine, stati generazione e metadati provider/modello.
|   |   |
|   |   +-- settings/
|   |   |   Riepilogo impostazioni provider/modello e dialog API key.
|   |   |
|   |   +-- styles/
|   |       Stili globali renderer.
|   |
|   +-- shared/
|   |   |
|   |   +-- drawing/
|   |   |   Tipi stroke, tipi strumenti, modello tratti, pressione, distanza minima e smoothing.
|   |   |
|   |   +-- history/
|   |   |   Modello condiviso e testabile per stack undo/redo.
|   |   |
|   |   +-- document/
|   |   |   Tipi e modello layer/documento True Drawing.
|   |   |
|   |   +-- image-generation/
|   |   |   Tipi generazione immagine e prompt tecnico realistico.
|   |   |
|   |   +-- config/
|   |   |   Tipi, schema, validazione e caricamento file configurazione.
|   |   |
|   |   +-- runtime/
|   |       Tipi per informazioni runtime esposte al renderer.
|
+-- config/
|   |
|   +-- app.config.json
|       Parametri modificabili da utenti skilled e sviluppatori. Non contiene segreti.
|
+-- tests/
|   |
|   +-- unit/
|   |   Test di modello, strumenti, layer, history, config e adapter.
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
|           Release manuale: build Windows/macOS e upload diretto degli asset sulla release GitHub quando richiesto.
|
+-- README.md
|   Descrizione progetto in italiano e inglese.
|
+-- ISTRUZIONI.md
|   Istruzioni utente in italiano.
|
+-- INSTRUCTION.md
|   Istruzioni utente in inglese.
|
+-- SECURITY_MODEL.md
|   Modello di sicurezza in italiano e inglese.
|
+-- AGENTS.md
|   Direttive operative per sviluppo e manutenzione.
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
- La API key non deve stare in `config/app.config.json`: viene salvata nel keychain del sistema operativo.

## Stato attuale

- Versione: `0.5.0`.
- Ultima milestone completata: M5 - Inspector realistico e generazione immagine.
- Stato milestone: M5 completata e mergiata su `main`; CI verde, release GitHub rinviata per risparmiare credito Actions.
- Skeleton Electron/Vite/React implementato.
- Configurazione centrale validata e caricata dal processo main.
- Canvas interattivo presente con Pointer Events, pressione normalizzata, smoothing e rendering locale.
- Strumenti matita, pennarello, pennello e gomma collegati al canvas.
- Controlli colore, dimensione, opacita' e hardness letti dalla configurazione.
- Layer con creazione, rinomina, cancellazione protetta, visibilita', opacita' e riordino.
- Undo/redo del documento presente con modello history testabile.
- Inspector realistico con generazione OpenAI dal canvas composito.
- Menu `File > API Key...` per inserire, sostituire e rimuovere la chiave OpenAI.
- Storage cifrato locale della API key e chiamate OpenAI gestite dal main process.
- UI modulare presente per canvas, strumenti, inspector, layer e settings.
- Workflow CI presente; workflow release Windows/macOS disponibile solo con avvio manuale.
