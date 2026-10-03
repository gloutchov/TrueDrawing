# True Drawing - Security Model

## Italiano

Versione sorgente: `1.11.3` (release GitHub pubblicata: `v1.11.0`)

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

La Content Security Policy limita script, immagini, form, frame e connessioni remote. In produzione connect-src, frame-src e worker-src sono none; solo il main process esegue le richieste OpenAI tramite IPC controllato.

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

Source version: `1.11.3` (published GitHub release: `v1.11.0`)

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

The Content Security Policy limits scripts, images, forms, frames, and remote connections. In production connect-src, frame-src and worker-src are none; only the main process performs OpenAI requests through controlled IPC.

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

## C18 - Storia versioni del documento (`1.7.0`)

Snapshot persistenti manuali/automatici, consultazione, rinomina, ripristino e cancellazione; capsule senza ricorsione e limiti numero/byte da configurazione. Ripristino completo di canvas, layer, maschere, riferimenti e immagine AI; versioni conservate in tdraw e autosave, Undo ripristina lo stato precedente. / Persistent bounded document versions with complete restoration and non-recursive capsules.

C18: snapshot locali embedded, senza file aggiuntivi o invio provider. Capsule senza versioni annidate, metadati e contenuto validati alla riapertura; limiti conteggio, byte per versione e totali applicati a creazione e lettura. Ripristino/cancellazione chiedono conferma. / C18: local embedded snapshots, no extra files or provider transfers; non-recursive capsules, validated metadata/content and count/per-version/total byte limits at creation and load; restoration/deletion require confirmation.

## C19 - Preset di stile realistico (`1.8.0`)

Preset di stile bilingui con descrizioni, frammenti prompt e parametri OpenAI validati; preferito e stile personalizzato persistenti. Prompt privo di metadati progetto, guardia su credenziali accidentali e messaggi provider sanitizzati. / Configurable bilingual style presets, persistent favorite/custom styles and minimal generation payloads.

IT: ID univoci, nomi/descrizioni bilingui e frammenti prompt sono validati all'avvio. Solo quality/size supportati sono ammessi nei parametri; il main risolve il preset dalla propria configurazione e ignora parametri arbitrari del renderer. Il canale preferenze stile esistente salva stile e ID preferito insieme; nessun nuovo canale legge segreti. Preferenze legacy restano leggibili e un preferito rimosso dalla configurazione viene scartato.

Il prompt contiene esclusivamente istruzioni generali di composizione e stile; nessun conteggio o nome del documento. Il canvas inviato esclude immagini di riferimento e versioni e include gli effetti layer. La chiave e' usata solo nell'header di autenticazione del main. Un controllo euristico blocca comuni incolli di credenziali in preset, stile, modello e prompt; non e' una garanzia di rilevamento completo. Test verificano limiti testo, parametri non supportati, persistenza senza credenziali, richieste respinte prima della rete e omissione degli errori/revised_prompt remoti. Generazione reale a pagamento non verificata.

EN: Unique IDs, bilingual names/descriptions and prompt fragments are validated on startup. Presets support only allowed quality/size values; main resolves them from its trusted configuration and ignores arbitrary renderer parameters. The existing style preference channel saves style and favorite ID together; no new channel reads secrets. Legacy preferences remain readable; removed favorites are discarded.

Prompts contain only composition and style instructions, without document counts or names. Uploaded canvas excludes reference images and versions and includes layer effects. The key is used only in the main-process authentication header. A heuristic guard rejects common credential pastes in presets, style, model and prompts; it cannot detect every secret. Tests cover text limits, unsupported parameters, credential-free persistence, rejection before network calls and omission of remote error/revised_prompt details. Paid live generation remains untested.

## C20 - Aggiornamento toolchain di sviluppo (`1.9.0`)

Toolchain aggiornata con Electron 44.4.5, Vite 8, Vitest 5 ed ESLint 10. TypeScript 6.0.3 e trattenuto sotto 6.1 per il supporto dichiarato di typescript-eslint; proposta TypeScript 7 rinviata. Config Vite ESM esplicita, compilazione Electron Node16/CommonJS, appunti PNG/testo asincroni con limiti e sanitizzazione senza cause private. / Updated toolchain with Electron 44.4.5, Vite 8, Vitest 5 and ESLint 10. TypeScript 6.0.3 stays below 6.1 within typescript-eslint support; TypeScript 7 is deferred. Explicit ESM Vite config, Node16/CommonJS Electron compilation and bounded asynchronous PNG/text clipboard with sanitized public errors.

IT: i canali appunti esistenti usano ClipboardItem/Blob nel main e attendono il completamento nativo. PNG normalizzato e limite 16 MiB sia prima della scrittura sia prima di allocare i bytes letti; il renderer non riceve nuove capacita native. La sanitizzazione omette anche cause e stack remoti: la regola ESLint 10 non deve reintrodurre informazioni private. Sandbox, CSP e controllo mittente IPC restano verificati dai test. Audit runtime: zero vulnerabilita; generazione API reale non eseguita.

EN: existing clipboard channels use main-process ClipboardItem/Blob and await native completion. PNG normalization and the 16 MiB bound apply before writes and before allocating read bytes; renderer native capabilities do not expand. Sanitization also drops remote causes/stacks, so ESLint 10 does not reintroduce private details. Tests retain sandbox, CSP and IPC sender checks. Runtime audit: zero vulnerabilities; no paid live API generation was performed.

## C21 - Migrazione React e React DOM (`1.10.0`)

React e React DOM allineati a 19.3.0 con tipi compatibili; componenti migrati al namespace JSX di React. La toolchain C20 resta preservata durante la risoluzione dei conflitti del lockfile; interazioni canvas, dialoghi e persistenza verificate nel renderer di produzione. / React and React DOM aligned at 19.3.0 with matching types; components use React-scoped JSX types. C20 toolchain preserved while resolving lockfile conflicts; canvas interactions, dialogs and persistence verified in the production renderer.

C21: React 19 cambia il runtime UI e i tipi del renderer; CSP, sandbox, preload, canali IPC e storage segreti mantengono gli stessi controlli. / React 19 updates the UI runtime and renderer types; CSP, sandbox, preload, IPC channels and secret storage retain the same controls.

## C22 - Aggiornamento icone Lucide (`1.11.0`)

Lucide React aggiornato a 1.48.0 con React 19; export, toolbar, pannelli e icone SVG accessibili verificati nei temi chiaro/scuro. Migrazioni C20-C22 integrate preservando i commit Dependabot; release cumulativa Windows/macOS con pacchetti non firmati e verifica SHA-256 prevista nella chiusura. / Lucide React upgraded to 1.48.0 with React 19; exports, toolbars, panels and accessible SVG icons verified in light/dark themes. C20-C22 migrations preserve Dependabot commits; cumulative unsigned Windows/macOS release and SHA-256 verification complete the closing process.

C22: le icone restano componenti SVG locali, senza nuove richieste di rete o privilegi. Audit dipendenze runtime: zero vulnerabilita. Release non firmata; verificare i checksum prima di aprire i pacchetti. / Icons remain local SVG components with no new network requests or privileges. Runtime dependency audit: zero vulnerabilities. Unsigned release: verify checksums before opening packages.

## C25 - Rimozione dei comandi maschera (`1.11.3`)

Rimossi creazione, attivazione, modifica e rimozione maschere e il relativo instradamento dei tratti. Conservati clipping e compatibilita di rendering/persistenza delle maschere legacy, anche in snapshot; i normali tratti non modificano le maschere precedenti. / Mask creation, toggling, editing and removal commands and stroke routing are removed. Layer clipping and legacy mask rendering/persistence, including snapshots, remain compatible; normal drawing does not change legacy masks.

C25: i vecchi dati maschera continuano a essere validati con gli stessi limiti locali, anche dentro le versioni documento. Rimossi i percorsi UI di mutazione; nessun nuovo permesso, IPC o accesso rete/filesystem. / Legacy mask data keeps existing validation and limits, including document versions. UI mutation paths are removed without new permissions or IPC.
