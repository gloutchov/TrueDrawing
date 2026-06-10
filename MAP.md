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
|   |   |   Canvas interattivo, coordinate Pointer Events e rendering tratti con strumenti selezionati.
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
|   |   |   Riepilogo impostazioni provider/modello/stile, dialog API key, stile immagine, redraw automatico e interfaccia.
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
|   |   |   Tipi e modello layer/documento True Drawing.
|   |   |
|   |   +-- image-generation/
|   |   |   Tipi generazione immagine e prompt tecnico realistico.
|   |   |
|   |   +-- project/
|   |   |   Formato progetto versionato, validazione, serializzazione e naming file.
|   |   |
|   |   +-- config/
|   |   |   Tipi, schema, validazione e caricamento file configurazione.
|   |   |
|   |   +-- security/
|   |   |   Builder CSP condiviso e testabile.
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
|   |   Test di modello, strumenti, layer, history, config, adapter, segreti, preferenze, CSP e formato progetto.
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
|           Release manuale: build Windows/macOS e upload diretto degli asset non firmati sulla release GitHub quando richiesto.
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
- I modelli immagini in configurazione sono suggerimenti UI: l'utente puo' scrivere un nome modello futuro nelle impostazioni.
- La API key non deve stare in `config/app.config.json`: viene salvata nel keychain del sistema operativo.

## Stato attuale

- Versione: `0.8.2`.
- Ultima milestone completata: M8 - Esperienza utente completa e rifinitura app.
- Stato milestone: mergiata su `main` tramite PR #5 con CI PR verde; tag `v0.8.0` pushato; release GitHub rinviata secondo policy manuale.
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
- Salvataggio manuale `.tdraw` con sidecar `<nome>_canvas.png` e `<nome>_image.png`.
- Salvataggio rapido vincolato ai percorsi progetto selezionati dall'utente nella sessione main.
- Limiti payload IPC per immagini/prompt/clipboard e limite dimensione file progetto in apertura.
- Autosave temporizzato in `userData`, recupero ultimo autosave disponibile ed export PNG/WebP.
- CSP e sandbox renderer configurati.
- UI modulare presente per canvas, strumenti, inspector, layer e settings.
- Workflow CI presente; workflow release Windows/macOS disponibile solo con avvio manuale.
