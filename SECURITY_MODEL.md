# True Drawing - Security Model

## Italiano

Versione: `0.1.0`

Questo documento descrive il modello di sicurezza previsto per True Drawing. Nella versione corrente e' presente lo skeleton desktop Electron con `contextIsolation` attivo, `nodeIntegration` disattivata nel renderer e preload dedicato per esporre solo API minime.

### Principi

- L'app funziona localmente su macOS e Windows.
- I dati del disegno restano sul computer dell'utente, salvo invio esplicito dei dati necessari alla generazione realistica.
- Le API key non devono essere salvate nel repository, nei file di progetto, nei log o nei crash report.
- Le API key devono essere salvate nel keychain del sistema operativo.
- Il modello immagini scelto dall'utente non e' considerato segreto ed e' una preferenza applicativa.
- Il renderer non deve accedere direttamente a filesystem, segreti o API native.
- I canali IPC devono essere minimi, validati e documentati.

### Segreti

La API key sara' inserita dall'utente nelle impostazioni dell'app e salvata tramite:

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
- Implementazione keychain: pianificata per milestone futura.
- Hardening Electron completo: pianificato per milestone futura.
- Test sicurezza: pianificati per milestone futura.

## English

Version: `0.1.0`

This document describes the planned security model for True Drawing. The current version includes the Electron desktop skeleton with `contextIsolation` enabled, `nodeIntegration` disabled in the renderer, and a dedicated preload exposing only minimal APIs.

### Principles

- The app runs locally on macOS and Windows.
- Drawing data stays on the user's computer unless the user explicitly sends the required data for realistic image generation.
- API keys must not be stored in the repository, project files, logs, or crash reports.
- API keys must be stored in the operating system keychain.
- The user-selected image model is not a secret and is treated as an application preference.
- The renderer must not directly access the filesystem, secrets, or native APIs.
- IPC channels must be minimal, validated, and documented.

### Secrets

The API key will be entered by the user in the app settings and stored through:

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
- Keychain implementation: planned for a future milestone.
- Full Electron hardening: planned for a future milestone.
- Security tests: planned for a future milestone.
