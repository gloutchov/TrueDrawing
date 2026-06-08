# True Drawing - Security Model

## Italiano

Versione: `0.5.0`

Questo documento descrive il modello di sicurezza previsto per True Drawing. Nella versione corrente e' presente lo skeleton desktop Electron con `contextIsolation` attivo, `nodeIntegration` disattivata nel renderer, preload dedicato per esporre solo API minime, canvas renderer locale con strumenti/layer/undo-redo e generazione immagine eseguita dal main process senza accesso diretto del renderer a filesystem o storage segreti.

### Principi

- L'app funziona localmente su macOS e Windows.
- I dati del disegno restano sul computer dell'utente, salvo invio esplicito dei dati necessari alla generazione realistica.
- Le API key non devono essere salvate nel repository, nei file di progetto, nei log o nei crash report.
- Le API key devono essere salvate nel keychain del sistema operativo.
- Il modello immagini scelto dall'utente non e' considerato segreto ed e' una preferenza applicativa.
- Il renderer non deve accedere direttamente a filesystem, segreti o API native.
- I canali IPC devono essere minimi, validati e documentati.

### Segreti

La API key viene inserita dall'utente dal menu `File > API Key...`.
Nella versione corrente la chiave viene cifrata con `safeStorage` di Electron e salvata in `userData` dal processo main.
Il completamento M6 dovra' consolidare il salvataggio nel keychain esplicito del sistema operativo:

- macOS Keychain su macOS;
- Windows Credential Manager su Windows.

Il file `config/app.config.json` non deve contenere segreti. Puo' contenere parametri non sensibili, inclusi provider e modello immagini.

### Rete

Le chiamate di rete devono essere limitate alla generazione dell'immagine realistica e devono inviare solo i dati necessari. Errori e log devono essere sanitizzati prima di essere mostrati o salvati.

### Stato attuale

- Documentazione sicurezza iniziale: completata.
- Skeleton Electron con renderer isolato: completato.
- Preload con API minima `getAppConfig` e `getRuntimeInfo`: completato.
- Caricamento configurazione centrale validata: completato.
- Canvas interattivo locale tramite Pointer Events: completato.
- Strumenti tratto, layer e history undo/redo locali nel renderer: completato.
- Menu API key, storage cifrato locale e adapter OpenAI nel main process: completato.
- Inspector realistico con generazione immagine e preview: completato.
- Implementazione keychain: pianificata per milestone futura.
- Hardening Electron completo: pianificato per milestone futura.
- Test sicurezza: pianificati per milestone futura.

## English

Version: `0.5.0`

This document describes the planned security model for True Drawing. The current version includes the Electron desktop skeleton with `contextIsolation` enabled, `nodeIntegration` disabled in the renderer, a dedicated preload exposing only minimal APIs, local canvas tools/layers/undo-redo, and image generation handled by the main process with no direct renderer access to filesystem or secret storage.

### Principles

- The app runs locally on macOS and Windows.
- Drawing data stays on the user's computer unless the user explicitly sends the required data for realistic image generation.
- API keys must not be stored in the repository, project files, logs, or crash reports.
- API keys must be stored in the operating system keychain.
- The user-selected image model is not a secret and is treated as an application preference.
- The renderer must not directly access the filesystem, secrets, or native APIs.
- IPC channels must be minimal, validated, and documented.

### Secrets

The API key is entered by the user through `File > API Key...`.
In the current version, the key is encrypted with Electron `safeStorage` and saved under `userData` by the main process.
M6 must consolidate storage in the explicit operating system keychain:

- macOS Keychain on macOS;
- Windows Credential Manager on Windows.

The `config/app.config.json` file must not contain secrets. It may contain non-sensitive parameters, including provider and image model.

### Network

Network calls must be limited to realistic image generation and must send only the required data. Errors and logs must be sanitized before display or storage.

### Current Status

- Initial security documentation: complete.
- Electron skeleton with isolated renderer: complete.
- Preload with minimal `getAppConfig` and `getRuntimeInfo` APIs: complete.
- Validated central configuration loading: complete.
- Local interactive canvas through Pointer Events: complete.
- Local stroke tools, layers, and undo/redo history in the renderer: complete.
- API key menu, encrypted local storage, and OpenAI adapter in the main process: complete.
- Realistic inspector with image generation and preview: complete.
- Keychain implementation: planned for a future milestone.
- Full Electron hardening: planned for a future milestone.
- Security tests: planned for a future milestone.
