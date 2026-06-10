# True Drawing - Security Model

## Italiano

Versione: `0.8.0`

Questo documento descrive il modello di sicurezza previsto per True Drawing. Nella versione corrente Electron usa `contextIsolation`, `nodeIntegration` disattivata nel renderer, preload dedicato per esporre solo API minime, sandbox renderer attiva, Content Security Policy, generazione immagine e salvataggi eseguiti dal main process senza accesso diretto del renderer a filesystem o storage segreti.

### Principi

- L'app funziona localmente su macOS e Windows.
- I dati del disegno restano sul computer dell'utente, salvo invio esplicito dei dati necessari alla generazione realistica.
- Le release Windows e macOS pubblicate su GitHub sono distribuite non firmate finche' non saranno disponibili credenziali di firma o notarizzazione; questo puo' generare avvisi SmartScreen/Gatekeeper.
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

Il modello immagini, lo stile immagine e le impostazioni di redraw automatico scelti dall'utente vengono salvati come preferenze non segrete in `userData/preferences`. La preferenza modello viene validata come nome modello non vuoto con caratteri sicuri, ma non viene limitata alla lista dei modelli suggeriti, cosi' l'utente puo' inserire modelli OpenAI futuri. Lo stile puo' essere scelto dai preset configurati o scritto come testo personalizzato non segreto.

Le preferenze UI non segrete, come lo zoom canvas persistente, vengono salvate dal renderer in `localStorage` usando una chiave configurata in `config/app.config.json`. Queste preferenze non contengono API key, percorsi progetto o contenuto del disegno.

### IPC e hardening Electron

I canali IPC disponibili sono limitati a configurazione, runtime, stato/scrittura/rimozione API key, preferenze immagine, generazione realistica, salvataggio/apertura progetto, autosave, recupero autosave, export immagini, clipboard controllata per testo/immagini e fullscreen finestra. Gli input IPC vengono validati nel main process. Il renderer non ha `nodeIntegration`, non accede direttamente a filesystem o API native e riceve solo le API esposte dal preload.

I payload IPC per immagini, prompt e testo clipboard hanno limiti di dimensione espliciti. Il salvataggio rapido puo' riusare solo percorsi progetto gia' scelti dall'utente nella sessione tramite dialog nativi o apertura progetto; un percorso arbitrario inviato dal renderer viene rifiutato dal main process. I file progetto aperti vengono controllati con un limite massimo di dimensione prima della lettura completa.

La Content Security Policy limita script, immagini, form, frame e connessioni remote. In produzione le connessioni remote ammesse dal renderer sono ristrette al base URL configurato per OpenAI; la chiamata effettiva all'API resta comunque nel main process.

### Rete

Le chiamate di rete devono essere limitate alla generazione dell'immagine realistica e devono inviare solo i dati necessari. Errori e log devono essere sanitizzati prima di essere mostrati o salvati.

### Distribuzione

Il progetto non dispone attualmente di certificati o credenziali per firma codice Windows, firma macOS o notarizzazione Apple. Gli artifact pubblicati via GitHub devono quindi essere considerati non firmati e la documentazione utente deve indicare che i sistemi operativi possono mostrare avvisi di sicurezza. Questa scelta non modifica la gestione dei segreti nell'app, ma resta un rischio di distribuzione da rivalutare se in futuro saranno disponibili credenziali ufficiali.

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
- Preferenze modello immagini, stile e redraw automatico separate dalla API key: completate.
- CSP e sandbox renderer: completati.
- Salvataggio `.tdraw`, sidecar canvas/immagine, autosave, recupero ed export tramite main process: completati.
- Allowlist dei percorsi progetto scelti dall'utente e limiti payload IPC/file progetto: completati.
- Sanitizzazione nomi file generati con protezione da caratteri non validi, nomi riservati Windows e finali problematici: completata.
- Clipboard testo/immagine e fullscreen finestra tramite IPC controllati: completati.
- Preferenze UI non segrete tramite `localStorage` configurato: completate.
- Test sicurezza su credential store, preferenze e CSP: completati.

## English

Version: `0.8.0`

This document describes the planned security model for True Drawing. The current version uses Electron with `contextIsolation`, disabled renderer `nodeIntegration`, a dedicated preload exposing only minimal APIs, renderer sandboxing, Content Security Policy, and image generation and saves handled by the main process with no direct renderer access to filesystem or secret storage.

### Principles

- The app runs locally on macOS and Windows.
- Drawing data stays on the user's computer unless the user explicitly sends the required data for realistic image generation.
- Windows and macOS releases published on GitHub are distributed unsigned until signing or notarization credentials become available; this may trigger SmartScreen/Gatekeeper warnings.
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

The user-selected image model, image style, and auto-redraw settings are stored as non-secret preferences under `userData/preferences`. The model preference is validated as a non-empty model name with safe characters, but it is not limited to the suggested model list, so users can enter future OpenAI models. The style may be selected from configured presets or entered as custom non-secret text.

Non-secret UI preferences, such as persistent canvas zoom, are stored by the renderer in `localStorage` using a key configured in `config/app.config.json`. These preferences do not contain API keys, project paths, or drawing content.

### IPC and Electron Hardening

Available IPC channels are limited to configuration, runtime, API key status/write/removal, image preferences, realistic generation, project save/open, autosave, autosave recovery, image export, controlled text/image clipboard, and window fullscreen. IPC inputs are validated in the main process. The renderer has no `nodeIntegration`, does not directly access filesystem or native APIs, and receives only preload-exposed APIs.

IPC payloads for images, prompts, and clipboard text have explicit size limits. Quick save can only reuse project paths already selected by the user in the current session through native dialogs or project open; arbitrary paths sent by the renderer are rejected by the main process. Opened project files are checked against a maximum size before full read.

The Content Security Policy limits scripts, images, forms, frames, and remote connections. In production, renderer remote connection sources are restricted to the configured OpenAI base URL; the actual API call still happens in the main process.

### Network

Network calls must be limited to realistic image generation and must send only the required data. Errors and logs must be sanitized before display or storage.

### Distribution

The project currently has no certificates or credentials for Windows code signing, macOS signing, or Apple notarization. Artifacts published through GitHub must therefore be treated as unsigned, and user documentation must state that operating systems may show security warnings. This does not change in-app secret handling, but it remains a distribution risk to reassess if official credentials become available.

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
- Image model, style, and auto-redraw preferences separated from API key: complete.
- CSP and renderer sandbox: complete.
- `.tdraw` save, canvas/image sidecars, autosave, recovery, and export through the main process: complete.
- User-selected project path allowlist and IPC/project-file payload limits: complete.
- Generated filename sanitization covering invalid characters, Windows reserved names, and problematic trailing characters: complete.
- Text/image clipboard and window fullscreen through controlled IPC: complete.
- Non-secret UI preferences through configured `localStorage`: complete.
- Security tests for credential store, preferences, and CSP: complete.
