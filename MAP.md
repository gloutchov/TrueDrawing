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
+-- electron-builder.yml
|   Configurazione packaging Windows/macOS e artifact release.
|
+-- src/
|   |
|   +-- main/
|   |   |
|   |   +-- appMain.ts
|   |   |   Avvio processo main Electron e ciclo vita app.
|   |   |
|   |   +-- windows/
|   |   |   Creazione e gestione finestre.
|   |   |
|   |   +-- ipc/
|   |   |   Canali sicuri fra renderer e main process.
|   |   |
|   |   +-- secrets/
|   |   |   Accesso a macOS Keychain e Windows Credential Manager.
|   |   |
|   |   +-- storage/
|   |       Salvataggio, autosave, recupero ed export.
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
|   |   |   Canvas, rendering tratti, input mouse/penna/touch.
|   |   |
|   |   +-- tools/
|   |   |   Matita, pennarello, pennello, gomma e preset tratto.
|   |   |
|   |   +-- layers/
|   |   |   UI e stato dei layer.
|   |   |
|   |   +-- history/
|   |   |   Undo/redo e stack azioni.
|   |   |
|   |   +-- inspector/
|   |   |   Preview immagine realistica e doppio click canvas/inspector.
|   |   |
|   |   +-- settings/
|   |       UI impostazioni per API key, provider e modello immagini.
|   |
|   +-- shared/
|   |   |
|   |   +-- document/
|   |   |   Tipi e serializzazione del documento True Drawing.
|   |   |
|   |   +-- image-generation/
|   |   |   Interfacce provider e adapter OpenAI.
|   |   |
|   |   +-- config/
|   |   |   Configurazione centrale, default e validazione.
|   |   |
|   |   +-- errors/
|   |       Errori applicativi sanitizzati.
|   |
|   +-- styles/
|       Stili globali e variabili UI.
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
|       CI, build, packaging e release.
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

- Versione: `0.0.1`.
- Milestone corrente: M0 - Bootstrap repository e governance.
- Struttura applicativa Electron/React non ancora implementata.
- Documentazione iniziale, configurazione iniziale e regole di sviluppo presenti.
