# True Drawing - Security Model

## Italiano

Versione sorgente: `1.6.0` (release GitHub pubblicata: `v1.2.0`)

Questo documento descrive il modello di sicurezza previsto per True Drawing. Nella versione corrente Electron usa `contextIsolation`, `nodeIntegration` disattivata nel renderer, preload dedicato per esporre solo API IPC controllate, sandbox renderer attiva, Content Security Policy, generazione immagine e salvataggi eseguiti dal main process senza accesso diretto del renderer a filesystem o storage segreti.

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

La API key viene inserita dall'utente dal menu `File > Impostazioni > API Key...`.
Nella versione corrente la chiave viene salvata dal processo main nel backend piu' sicuro disponibile:

- Windows Credential Manager su Windows;
- macOS Keychain su macOS;
- fallback locale cifrato con Electron `safeStorage` solo per ambienti non supportati o di sviluppo.

Il renderer puo' interrogare solo lo stato della chiave e il nome del backend, non puo' leggere la chiave. Il file `config/app.config.json` non deve contenere segreti. Puo' contenere parametri non sensibili, inclusi provider, modelli immagini suggeriti e default.

### Preferenze

Il modello immagini, lo stile immagine e le impostazioni di redraw automatico scelti dall'utente vengono salvati come preferenze non segrete in `userData/preferences`. La preferenza modello viene validata come nome modello non vuoto con caratteri sicuri, ma non viene limitata alla lista dei modelli suggeriti, cosi' l'utente puo' inserire modelli OpenAI futuri. Lo stile puo' essere scelto dai preset configurati o scritto come testo personalizzato non segreto.

Le preferenze UI non segrete, come zoom canvas persistente, lingua interfaccia e tema chiaro/scuro, vengono salvate dal renderer in `localStorage` usando una chiave configurata in `config/app.config.json`. Il pan della manina resta nella memoria della vista e non viene salvato. Queste preferenze non contengono API key, percorsi progetto o contenuto del disegno.

### IPC e hardening Electron

I canali IPC disponibili sono limitati a configurazione, runtime, stato/scrittura/rimozione API key, preferenze immagine, generazione realistica, salvataggio/apertura progetto, autosave, recupero autosave, export immagini, clipboard controllata per testo/immagini e fullscreen finestra. Gli input IPC vengono validati nel main process. Il renderer non ha `nodeIntegration`, non accede direttamente a filesystem o API native e riceve solo le API esposte dal preload.

I payload IPC per immagini, prompt e testo clipboard hanno limiti di dimensione espliciti. Il salvataggio rapido puo' riusare solo percorsi progetto gia' scelti dall'utente nella sessione tramite dialog nativi o apertura progetto; un percorso arbitrario inviato dal renderer viene rifiutato dal main process. I file progetto aperti vengono controllati con un limite massimo di dimensione prima della lettura completa.

Le dimensioni canvas e i DPI sono salvati nel progetto e validati nel main process sia all'apertura sia nelle richieste di salvataggio/autosave. I limiti centrali evitano dimensioni canvas eccessive. Il ridimensionamento non invia dati in rete; solo una richiesta di generazione OpenAI invia il PNG del canvas, con il padding configurato. Il sidecar e gli export non includono quel padding.

La Content Security Policy limita script, immagini, form, frame e connessioni remote. In produzione le connessioni remote ammesse dal renderer sono ristrette al base URL configurato per OpenAI; la chiamata effettiva all'API resta comunque nel main process.

### Rete

Le chiamate di rete devono essere limitate alla generazione dell'immagine realistica e devono inviare solo i dati necessari. Errori e log devono essere sanitizzati prima di essere mostrati o salvati.

### Distribuzione

Il progetto non dispone attualmente di certificati o credenziali per firma codice Windows, firma macOS o notarizzazione Apple. Gli artifact pubblicati via GitHub devono quindi essere considerati non firmati e la documentazione utente deve indicare che i sistemi operativi possono mostrare avvisi di sicurezza. Il workflow release manuale crea note di release dedicate e file checksum SHA-256 per gli artifact Windows/macOS. Questa scelta non modifica la gestione dei segreti nell'app, ma resta un rischio di distribuzione da rivalutare se in futuro saranno disponibili credenziali ufficiali.

### Stato attuale

- Documentazione sicurezza iniziale: completata.
- Skeleton Electron con renderer isolato: completato.
- Preload con API IPC controllate per configurazione, runtime, preferenze, segreti, generazione, salvataggi, export, clipboard e finestra: completato.
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
- Preferenze UI non segrete tramite `localStorage` configurato, incluse zoom, lingua e tema: completate.
- Workflow release manuale con validazione versione, note release e checksum SHA-256: completato.
- Landing page statica in `docs/` senza gestione segreti, senza backend e con soli link pubblici a repository/release: completata.
- Patch `v1.0.1` per caricamento asset renderer nei pacchetti installati: completata.
- Patch `v1.0.2` per leggibilita' dei dialog impostazioni in tema scuro: completata, senza modifiche a segreti, rete o IPC.
- Patch `v1.0.3` per dominio e collegamenti della landing page: completata, senza modifiche a segreti, rete o IPC dell'app desktop.
- C12: la manina modifica solo la vista nel renderer; nessun nuovo canale IPC, permesso, invio di rete o campo nel file progetto.
- C13: dimensioni canvas e DPI sono validati nel renderer e nel main, persistono nel progetto e non aggiungono segreti, permessi o canali IPC; il PNG inviato su richiesta all'API rispecchia le dimensioni del documento.
- Test sicurezza su credential store, preferenze e CSP: completati.

### C14 - Correttivi implementati

Il limite comune per immagini IPC e immagini embedded nei progetti e' 16 MiB; `imageGeneration.maxImageBytes` configura il limite aggiuntivo per input/output AI. Il valore predefinito protegge anche chiamate di test con configurazione precedente. Le risposte provider hanno un limite streaming prima del parsing JSON.

I download accettano HTTPS senza credenziali o porte alternative, rifiutano host locali e indirizzi privati/loopback/link-local/mapped IPv4, controllano tutti i risultati DNS e collegano direttamente l'indirizzo verificato. Nessun redirect e' seguito. Timeout totale e limiti byte si applicano anche senza Content-Length. Base64 ha precedenza sugli URL.

Tutti i canali IPC verificano il frame principale e l'URL della UI prevista. Errori provider e filesystem sono sostituiti da messaggi controllati; revised_prompt remoto non viene esposto. La CSP di produzione imposta connect-src, frame-src e worker-src a none; il renderer usa IPC per la rete. Popup, navigazioni e webview sono bloccati.

La UI esplicita l'uso del fallback safeStorage. In Linux la protezione dipende dal servizio segreti disponibile; lo sviluppo cloud richiede --no-sandbox per il limite del container e non verifica la protezione della sandbox di produzione. Test automatici controllano limiti, DNS, redirect, timeout, mittenti ed errori; la scansione credenziali di configurazione e fixture e' euristica, non una garanzia assoluta. Dependabot mensile propone aggiornamenti; audit runtime eseguito senza vulnerabilita'.

## English

Source version: `1.6.0` (published GitHub release: `v1.2.0`)

This document describes the planned security model for True Drawing. The current version uses Electron with `contextIsolation`, disabled renderer `nodeIntegration`, a dedicated preload exposing only controlled IPC APIs, renderer sandboxing, Content Security Policy, and image generation and saves handled by the main process with no direct renderer access to filesystem or secret storage.

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

The API key is entered by the user through `File > Settings > API Key...`.
In the current version, the key is stored by the main process in the safest available backend:

- Windows Credential Manager on Windows;
- macOS Keychain on macOS;
- encrypted local fallback through Electron `safeStorage` only for unsupported or development environments.

The renderer can query only key status and backend name; it cannot read the key. The `config/app.config.json` file must not contain secrets. It may contain non-sensitive parameters, including provider, suggested image models, and defaults.

### Preferences

The user-selected image model, image style, and auto-redraw settings are stored as non-secret preferences under `userData/preferences`. The model preference is validated as a non-empty model name with safe characters, but it is not limited to the suggested model list, so users can enter future OpenAI models. The style may be selected from configured presets or entered as custom non-secret text.

Non-secret UI preferences, such as persistent canvas zoom, interface language, and light/dark theme, are stored by the renderer in `localStorage` using a key configured in `config/app.config.json`. Hand-tool pan remains in view memory and is not saved. These preferences do not contain API keys, project paths, or drawing content.

### IPC and Electron Hardening

Available IPC channels are limited to configuration, runtime, API key status/write/removal, image preferences, realistic generation, project save/open, autosave, autosave recovery, image export, controlled text/image clipboard, and window fullscreen. IPC inputs are validated in the main process. The renderer has no `nodeIntegration`, does not directly access filesystem or native APIs, and receives only preload-exposed APIs.

IPC payloads for images, prompts, and clipboard text have explicit size limits. Quick save can only reuse project paths already selected by the user in the current session through native dialogs or project open; arbitrary paths sent by the renderer are rejected by the main process. Opened project files are checked against a maximum size before full read.

Canvas dimensions and DPI are stored in the project and validated in the main process on both open and save/autosave requests. Central limits prevent excessive canvas sizes. Resizing sends no data over the network; only an OpenAI generation request sends a canvas PNG with configured padding. Sidecars and exports do not include that padding.

The Content Security Policy limits scripts, images, forms, frames, and remote connections. In production, renderer remote connection sources are restricted to the configured OpenAI base URL; the actual API call still happens in the main process.

### Network

Network calls must be limited to realistic image generation and must send only the required data. Errors and logs must be sanitized before display or storage.

### Distribution

The project currently has no certificates or credentials for Windows code signing, macOS signing, or Apple notarization. Artifacts published through GitHub must therefore be treated as unsigned, and user documentation must state that operating systems may show security warnings. The manual release workflow creates dedicated release notes and SHA-256 checksum files for Windows/macOS artifacts. This does not change in-app secret handling, but it remains a distribution risk to reassess if official credentials become available.

### Current Status

- Initial security documentation: complete.
- Electron skeleton with isolated renderer: complete.
- Preload with controlled IPC APIs for configuration, runtime, preferences, secrets, generation, saves, export, clipboard, and window state: complete.
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
- Non-secret UI preferences through configured `localStorage`, including zoom, language, and theme: complete.
- Manual release workflow with version validation, release notes, and SHA-256 checksums: complete.
- Static landing page under `docs/` with no secret handling, no backend, and only public repository/release links: complete.
- `v1.0.1` patch for renderer asset loading in installed packages: complete.
- `v1.0.2` patch for settings dialog readability in dark theme: complete, with no changes to secrets, network, or IPC.
- `v1.0.3` landing-page domain and links patch: complete, with no changes to desktop-app secrets, network behavior, or IPC.
- C12: the hand tool changes only the renderer view; it adds no IPC channel, permission, network transfer, or project-file field.
- C13: canvas dimensions and DPI are validated in the renderer and main process, persist in project files, and add no secrets, permissions, or IPC channels; the PNG sent to the API on request reflects the document dimensions.
- Security tests for credential store, preferences, and CSP: complete.

### C14 - Implemented hardening

All IPC and project embedded images are bounded to 16 MiB. The validated imageGeneration.maxImageBytes setting adds an AI input/output bound; the default protects older test configurations. Provider JSON is bounded while streaming before parsing.

Downloads accept HTTPS without credentials or alternative ports, reject local/private/loopback/link-local/mapped addresses, check every DNS result and pin the checked address during connection. Redirects are rejected. Overall timeout and byte limits apply without Content-Length. Base64 takes precedence over URLs.

Every IPC channel checks the main frame and expected UI URL. Raw provider/filesystem errors are replaced by controlled messages; remote revised_prompt is omitted. Production CSP denies renderer connections, frames and workers. Network operations use main-process IPC. Popups, navigation and webviews are blocked.

The UI explicitly warns when using safeStorage fallback. Linux protection depends on the available secret service. Cloud development needs --no-sandbox due to container limitations and does not validate production sandbox protection. Tests cover image limits, DNS, redirects, timeouts, senders and errors. Credential scanning of config/fixtures is heuristic, not an absolute guarantee. Monthly Dependabot updates are limited; the runtime dependency audit reported no vulnerabilities.

## C15 - Brush avanzati e texture personalizzate (`1.4.0`)

Preset brush bilingui da configurazione: grafite, morbido, marker, inchiostro e texture; controlli pressione, velocita, spaziatura e texture procedurali. Parametri immutabili nei tratti e persistenti nei file tdraw. / Configurable bilingual brush presets, pressure/speed/spacing and procedural texture controls; per-stroke parameters persist in tdraw.

## C16 - Import immagini di riferimento (`1.5.0`)

Import locale PNG/JPEG/WebP da dialogo nativo controllato, normalizzazione PNG e limiti bytes/pixel. Riferimenti embedded separati con visibilita, opacita, posizione e scala: esclusi da export e AI. Caricamento immagini prima del rendering dopo riapertura. / Local dialog-controlled imports; embedded references with visibility, opacity, position and scale, excluded from exports and AI.

C16: il renderer non sceglie percorsi arbitrari per l'import; il main legge solo il file scelto nel dialogo, verifica dimensione e signature, decodifica con nativeImage e normalizza a PNG. Limite riferimento 4 MiB, quattro immagini, limiti pixel/trasformazione validati anche alla riapertura. Il percorso sorgente non viene restituito o salvato. Il progetto completo e' limitato a 64 MiB prima di scrittura e lettura. / C16: renderer import accepts no arbitrary path; the main reads only the dialog-selected file, validates signature/size, decodes through nativeImage and normalizes to PNG. Four references up to 4 MiB each, validated pixel/transform limits, no returned/stored source path. Whole project size is checked before writing and reading (64 MiB).

Patch `1.5.1`: WebP decodificato dal canvas Chromium dopo verifica RIFF/dimensioni nel main e normalizzato a PNG, perche nativeImage non supporta questo formato. / WebP is decoded by Chromium Canvas after RIFF/dimension checks in main and normalized to PNG, because nativeImage does not support this format. 87 test, lint/build e smoke import WebP chiaro/scuro.

## C17 - Maschere e clipping layer (`1.6.0`)

Maschere non distruttive con editor, attivazione e rimozione; clipping con identita layer stabili, controllo cicli e pulizia relazioni alla cancellazione. Rendering condiviso per canvas/export/AI, undo/redo e persistenza tdraw. / Non-destructive editable masks, stable layer clipping with cycle validation, shared rendering, undo/redo and persistence.

C17: maschere e relazioni clipping sono dati locali validati nel progetto; le immagini embedded nelle maschere hanno gli stessi limiti. Identita layer univoche, target esistenti e assenza cicli verificati prima del rendering. Nessun nuovo accesso filesystem/rete/IPC. / Masks and clipping are validated local project data, with the same limits for embedded mask images. Unique layer identities, existing targets and acyclic relationships are checked before rendering. No new filesystem/network/IPC access.
