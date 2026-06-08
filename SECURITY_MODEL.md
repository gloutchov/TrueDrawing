# True Drawing - Security Model

## Italiano

Versione: `0.6.0`

Questo documento descrive il modello di sicurezza previsto per True Drawing. Nella versione corrente Electron usa `contextIsolation`, `nodeIntegration` disattivata nel renderer, preload dedicato per esporre solo API minime, sandbox renderer attiva, Content Security Policy e generazione immagine eseguita dal main process senza accesso diretto del renderer a filesystem o storage segreti.

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
Nella versione corrente la chiave viene salvata dal processo main nel backend piu' sicuro disponibile:

- Windows Credential Manager su Windows;
- macOS Keychain su macOS;
- fallback locale cifrato con Electron `safeStorage` solo per ambienti non supportati o di sviluppo.

Il renderer puo' interrogare solo lo stato della chiave e il nome del backend, non puo' leggere la chiave. Il file `config/app.config.json` non deve contenere segreti. Puo' contenere parametri non sensibili, inclusi provider, modelli immagini suggeriti e default.

### Preferenze

Il modello immagini scelto dall'utente viene salvato come preferenza non segreta in `userData/preferences`. La preferenza viene validata come nome modello non vuoto con caratteri sicuri, ma non viene limitata alla lista dei modelli suggeriti, cosi' l'utente puo' inserire modelli OpenAI futuri.

### IPC e hardening Electron

I canali IPC disponibili sono limitati a configurazione, runtime, stato/scrittura/rimozione API key, preferenze immagine e generazione realistica. Gli input IPC vengono validati nel main process. Il renderer non ha `nodeIntegration`, non accede direttamente a filesystem o API native e riceve solo le API esposte dal preload.

La Content Security Policy limita script, immagini, form, frame e connessioni remote. In produzione le connessioni remote ammesse dal renderer sono ristrette al base URL configurato per OpenAI; la chiamata effettiva all'API resta comunque nel main process.

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
- Implementazione keychain/Credential Manager: completata.
- Preferenza modello immagini separata dalla API key: completata.
- CSP e sandbox renderer: completati.
- Test sicurezza su credential store, preferenze e CSP: completati.

## English

Version: `0.6.0`

This document describes the planned security model for True Drawing. The current version uses Electron with `contextIsolation`, disabled renderer `nodeIntegration`, a dedicated preload exposing only minimal APIs, renderer sandboxing, Content Security Policy, and image generation handled by the main process with no direct renderer access to filesystem or secret storage.

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
In the current version, the key is stored by the main process in the safest available backend:

- Windows Credential Manager on Windows;
- macOS Keychain on macOS;
- encrypted local fallback through Electron `safeStorage` only for unsupported or development environments.

The renderer can query only key status and backend name; it cannot read the key. The `config/app.config.json` file must not contain secrets. It may contain non-sensitive parameters, including provider, suggested image models, and defaults.

### Preferences

The user-selected image model is stored as a non-secret preference under `userData/preferences`. The preference is validated as a non-empty model name with safe characters, but it is not limited to the suggested model list, so users can enter future OpenAI models.

### IPC and Electron Hardening

Available IPC channels are limited to configuration, runtime, API key status/write/removal, image preferences, and realistic generation. IPC inputs are validated in the main process. The renderer has no `nodeIntegration`, does not directly access filesystem or native APIs, and receives only preload-exposed APIs.

The Content Security Policy limits scripts, images, forms, frames, and remote connections. In production, renderer remote connection sources are restricted to the configured OpenAI base URL; the actual API call still happens in the main process.

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
- Keychain/Credential Manager implementation: complete.
- Image model preference separated from API key: complete.
- CSP and renderer sandbox: complete.
- Security tests for credential store, preferences, and CSP: complete.
