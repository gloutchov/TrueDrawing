# True Drawing - Direttive per lo sviluppo

Questo file definisce le regole operative da seguire durante lo sviluppo di True Drawing. Deve essere aggiornato alla conclusione di ogni milestone.

## Stato corrente

- Ultima milestone completata: C32 - Funzionalita' illustrate nella landing page.
- Ultima patch completata: `1.5.1` - import WebP normalizzato tramite Chromium Canvas.
- Versione corrente: `1.12.1`; release GitHub pubblicata: `v1.12.1`.
- Branch corrente: `main`.
- Milestone corrente: nessuna; C29-C32 completate.
- Patch corrente: nessuna.
- Ultimo branch milestone completato: `milestone/32-landing-features`.
- Ultimo branch patch completato: `patch/1.5.1-webp-reference-import`.
- CI ultima patch: PR #7 verde con GitHub Actions run `27283184712`; `main` verde con run `27283321985`; verifica locale `npm run lint`, `npm run test` e `npm run build` verde.
- CI M9: PR #8 verde con GitHub Actions run `27339171091`; `main` verde con run `27339232172`; release workflow `27340285563` verde.
- CI M10: PR #9 verde con GitHub Actions run `27345974695`; `main` verde con run `27346032900`; release workflow `27346106628` verde.
- CI patch `v1.0.1`: verifica locale `npm run lint`, `npm run test` e `npm run build` verde; workflow release `27353682972` verde.
- CI patch `v1.0.2`: verifica locale `npm run lint`, `npm run test` e `npm run build` verde; PR #10 verde con GitHub Actions run `27415112843` e `27415123564`; `main` verde con run `27415599523`; workflow release `27415761496` verde.
- Verifica patch `v1.0.3`: `npm run lint`, `npm run test` (39 test) e `npm run build` verdi; verifica manuale completata.
- Verifica C12: PR #12 con CI run `36323912210` e `main` con run `36325069504` verdi; `npm run lint`, `npm run test` (41 test), `npm run build` e smoke test Electron chiaro/scuro verdi. Checkpoint `milestone/C12` e tag `v1.1.0` verificati sul commit finale remoto di `main`.
- Verifica C13: PR #13 con CI run `36333336031` verde; `npm run lint`, `npm run test` (49 test), `npm run build` e smoke test Electron chiaro/scuro verdi. Checkpoint `milestone/C13`, tag `v1.2.0`, CI `main` e workflow release verificati in chiusura.
- Release GitHub corrente: `v1.12.1` pubblicata con artifact Windows/macOS non firmati, note release e checksum SHA-256.
- Firma release: non sono disponibili credenziali o certificati per firmare Windows o macOS; le release saranno distribuite non firmate via GitHub e la documentazione deve indicare gli avvisi di sicurezza attesi dei sistemi operativi.

## Regole generali

- Applicare anche `STARTUP_PREFERENCES.md`: `M<n>` indica una milestone eseguibile, `C<n>` una milestone chiusa e `P<n>` un'attivita' fuori dal piano corrente. Eseguire le `M` in ordine numerico.
- Prima di qualsiasi operazione Git o GitHub verificare autore `gloutchov <gloutchov@gmail.com>` e account GitHub autenticato `gloutchov`; fermarsi se l'identita' non e' verificabile.
- Sviluppare sempre su un branch dedicato alla milestone: `milestone/<numero>-<slug>`.
- Non fare merge su `main` finche' implementazione, test, documentazione e CI non sono verificati.
- Richiedere l'avallo esplicito del progettista prima del merge; dopo il merge creare un tag annotato univoco `milestone/C<numero>` sul commit finale di `main`, pubblicarlo e verificarlo sul remoto prima di iniziare la milestone successiva.
- Registrare in `PLAN.md` per ogni `C<n>` riepilogo, verifiche, limiti residui, versione e checkpoint. Creare il tag `vX.Y.Z` quando la milestone produce una versione rilasciabile.
- Non eliminare il branch milestone prima che la release GitHub sia stata generata e controllata, quando la release e' prevista.
- Per risparmiare credito GitHub Actions, non generare release GitHub automatiche per ogni milestone intermedia: produrre release Windows/macOS solo quando esplicitamente richiesto o quando il piano indica una versione beta/stabile quasi definitiva.
- Non configurare firma codice Windows, firma macOS o notarizzazione finche' non saranno disponibili credenziali esplicite; produrre artifact non firmati e documentare SmartScreen/Gatekeeper nelle istruzioni utente.
- Aggiornare la versione alla chiusura di ogni milestone secondo `PLAN.md`; le milestone solo documentali possono restare sulla versione corrente se il piano non prevede una nuova release.
- Mantenere aggiornati `README.md`, `ISTRUZIONI.md`, `INSTRUCTIONS.md`, `SECURITY_MODEL.md`, `MAP.md`, `AGENTS.md` e `PLAN.md`; aggiornare `AGENTS.md` quando cambiano le regole operative e gli altri documenti secondo il comportamento modificato.
- Preferire verifiche locali proporzionate; limitare push intermedi e avvii GitHub Actions non necessari.

## Ruolo dei documenti (richiesta del progettista, 2026-10-03)

- `ISTRUZIONI.md` e `INSTRUCTIONS.md` sono manuali utente IT/EN equivalenti: funzioni, procedure, esempi, troubleshooting e informazioni utili a chi usa il programma. Organizzarli per argomento, con le etichette dell'app corrente.
- `README.md` e' la presentazione bilingue del prodotto su GitHub: funzionalita', uso rapido, architettura sintetica, sviluppo e link ai documenti. Descrive il codice dello stesso commit senza numeri di release dell'app, badge di versione o cronologie di milestone. Questa richiesta specifica prevale sulle prescrizioni generiche di STARTUP_PREFERENCES che richiedono la versione nel README.
- Alla chiusura delle milestone aggiornare README e manuali per il comportamento effettivo; registrare avanzamento, riepiloghi M/C e verbali CI in `PLAN.md`, con dettagli delle release nelle note release. Non appendere piu' sezioni C<n> ai tre documenti utente; i vecchi helper di chiusura che lo fanno devono essere adattati prima di riusarli.
- `MAP.md` descrive la struttura; `SECURITY_MODEL.md` approfondisce la sicurezza; `AGENTS.md` mantiene le regole operative. Versione, branch, checkpoint e stato restano nei manifest e nei documenti operativi.
- C29-C32 completano ordine sidebar, manuali, README e landing, eseguiti uno alla volta su richiesta del progettista. Resta valida la deroga gia autorizzata sul controllo preventivo prima di commit, merge, tag, push e rimozione branch; restano obbligatorie identita', verifiche e checkpoint remoto.
- C29 porta il sorgente a 1.12.1; C30-C32 mantengono la versione dell'app. Il tag versione cumulativo v1.12.1 identifica il checkpoint finale C32 con tutti i documenti aggiornati. La fase si e' conclusa con il tag v1.12.1 e senza una nuova release binaria; la successiva richiesta del progettista autorizza ora la pubblicazione Windows/macOS dello stesso tag.

## Architettura

- Il programma non deve diventare monolitico.
- Ogni funzionalita' importante deve avere moduli e file dedicati.
- Separare chiaramente:
  - processo main Electron;
  - preload e canali IPC;
  - renderer React;
  - canvas;
  - strumenti di disegno;
  - layer;
  - undo/redo;
  - inspector realistico;
  - generazione immagini;
  - gestione segreti;
  - salvataggi;
  - export;
  - configurazione;
  - test.
- Le dipendenze fra moduli devono restare esplicite e direzionate. Evitare import circolari.
- Il renderer non deve accedere direttamente a filesystem, segreti o API native: usare canali IPC controllati.
- La logica canvas riutilizzabile, come stroke model, smoothing e pressione, deve restare in moduli testabili e non sepolta nei componenti React.
- La logica undo/redo deve restare in moduli testabili, separata dai componenti UI.

## Configurazione

- I parametri modificabili devono stare in un file di configurazione centrale.
- Evitare valori hardcoded per:
  - provider API;
  - base URL API;
  - modello immagini;
  - intervallo autosave;
  - dimensioni canvas;
  - qualita' export;
  - default strumenti;
  - preset strumenti;
  - range dei controlli strumenti;
  - default layer;
  - range opacita' layer;
  - limiti numero layer;
  - limiti history;
  - timeout API;
  - percorsi documenti;
  - nomi file generati.
- La configurazione deve essere validata all'avvio.
- I fallback nel codice sono ammessi solo per proteggere l'app da configurazioni mancanti o corrotte, e devono essere documentati.
- Provider immagini predefinito: OpenAI.
- Il prodotto resta centrato su OpenAI; il supporto a provider AI multipli e la modalita' offline completa non fanno parte della roadmap attiva.
- Modello immagini OpenAI predefinito: `gpt-image-1.5`.
- L'utente deve poter modificare il modello immagini dalle impostazioni.

## Sicurezza

- Non salvare API key in chiaro nel repository, nei log, nei file di progetto o nei crash report.
- Salvare la API key nel keychain del sistema operativo.
- Il modello immagini scelto dall'utente e' una preferenza non segreta; la API key resta un segreto.
- La manina modifica soltanto lo stato locale della vista; il pan non entra nei file `.tdraw`, nei log o nei payload API.
- Sanitizzare errori e log prima di mostrarli o salvarli.
- Limitare i dati inviati all'API al minimo necessario per generare l'immagine realistica.
- Aggiornare `SECURITY_MODEL.md` quando cambia il comportamento relativo a segreti, rete, IPC, salvataggi o logging.

## Documentazione della struttura

- `MAP.md` deve contenere una mappa ASCII aggiornata della struttura del programma.
- Ogni cartella o file rilevante deve avere una breve descrizione.
- Quando una milestone aggiunge, rimuove o sposta moduli, aggiornare `MAP.md` nella stessa milestone.

## Verifica

Prima di chiudere una milestone:

- eseguire test automatici;
- eseguire `npm run lint`, `npm run test` e `npm run build` quando il progetto contiene codice Node/Electron;
- fare verifica manuale delle funzionalita' implementate;
- controllare che la configurazione non abbia parametri duplicati o hardcoded;
- controllare che non ci siano segreti tracciati;
- aggiornare documentazione e piano;
- verificare CI quando prevista e necessaria;
- chiedere avallo prima del merge, quindi verificare sul remoto `main` e il tag `milestone/C<numero>`;
- generare e controllare release Windows e macOS quando previsto.

- Esecuzione roadmap 2026-10-02: il progettista autorizza commit, merge, tag, push e rimozione branch senza controllo preventivo; resta obbligatoria la verifica dell'identita', CI e checkpoint. Release cumulativa prevista a M19 per limitare Actions.
- C14: limiti immagini, download HTTPS con DNS controllato e senza redirect, sender IPC, errori sanitizzati, CSP e avviso safeStorage. Verifiche locali: 74 test, lint/build, smoke chiaro/scuro; audit runtime senza vulnerabilita'.

## C15 - Brush avanzati e texture personalizzate (`1.4.0`)

Preset brush bilingui da configurazione: grafite, morbido, marker, inchiostro e texture; controlli pressione, velocita, spaziatura e texture procedurali. Parametri immutabili nei tratti e persistenti nei file tdraw. / Configurable bilingual brush presets, pressure/speed/spacing and procedural texture controls; per-stroke parameters persist in tdraw.

## C16 - Import immagini di riferimento (`1.5.0`)

Import locale PNG/JPEG/WebP da dialogo nativo controllato, normalizzazione PNG e limiti bytes/pixel. Riferimenti embedded separati con visibilita, opacita, posizione e scala: esclusi da export e AI. Caricamento immagini prima del rendering dopo riapertura. / Local dialog-controlled imports; embedded references with visibility, opacity, position and scale, excluded from exports and AI.

Patch `1.5.1`: WebP decodificato dal canvas Chromium dopo verifica RIFF/dimensioni nel main e normalizzato a PNG, perche nativeImage non supporta questo formato. / WebP is decoded by Chromium Canvas after RIFF/dimension checks in main and normalized to PNG, because nativeImage does not support this format. 87 test, lint/build e smoke import WebP chiaro/scuro.

## C17 - Maschere e clipping layer (`1.6.0`)

Maschere non distruttive con editor, attivazione e rimozione; clipping con identita layer stabili, controllo cicli e pulizia relazioni alla cancellazione. Rendering condiviso per canvas/export/AI, undo/redo e persistenza tdraw. / Non-destructive editable masks, stable layer clipping with cycle validation, shared rendering, undo/redo and persistence.

## C18 - Storia versioni del documento (`1.7.0`)

Snapshot persistenti manuali/automatici, consultazione, rinomina, ripristino e cancellazione; capsule senza ricorsione e limiti numero/byte da configurazione. Ripristino completo di canvas, layer, maschere, riferimenti e immagine AI; versioni conservate in tdraw e autosave, Undo ripristina lo stato precedente. / Persistent bounded document versions with complete restoration and non-recursive capsules.

## C19 - Preset di stile realistico (`1.8.0`)

Preset di stile bilingui con descrizioni, frammenti prompt e parametri OpenAI validati; preferito e stile personalizzato persistenti. Prompt privo di metadati progetto, guardia su credenziali accidentali e messaggi provider sanitizzati. / Configurable bilingual style presets, persistent favorite/custom styles and minimal generation payloads.

- Verifica C18: PR #22 CI `37047176018`, main CI `37047290899`, checkpoint `milestone/C18` e versione `v1.7.0` verificati.
- C19: 117 test, lint/build e smoke Electron chiaro/scuro; preferito, stile custom, persistenza, IPC e regressioni documento verificati. Release cumulativa Windows/macOS tramite workflow manuale; branch conservato fino al controllo asset/checksum.

## Manutenzione dipendenze M20-M22

Il progettista autorizza l'esecuzione delle PR #15, #16 e #17 tramite milestone dedicate, senza controllo preventivo su commit, merge, tag, push o rimozione branch. Lavorare sul branch milestone e integrare il branch Dependabot preservandone la cronologia; aggiornare la PR esistente con push fast-forward. Restano obbligatorie verifica identita, CI e checkpoint remoto per ogni milestone. Una sola release cumulativa v1.11.0 a M22; conservare i branch finali fino alla verifica dei pacchetti/checksum.

## C20 - Aggiornamento toolchain di sviluppo (`1.9.0`)

Toolchain aggiornata con Electron 44.4.5, Vite 8, Vitest 5 ed ESLint 10. TypeScript 6.0.3 e trattenuto sotto 6.1 per il supporto dichiarato di typescript-eslint; proposta TypeScript 7 rinviata. Config Vite ESM esplicita, compilazione Electron Node16/CommonJS, appunti PNG/testo asincroni con limiti e sanitizzazione senza cause private. / Updated toolchain with Electron 44.4.5, Vite 8, Vitest 5 and ESLint 10. TypeScript 6.0.3 stays below 6.1 within typescript-eslint support; TypeScript 7 is deferred. Explicit ESM Vite config, Node16/CommonJS Electron compilation and bounded asynchronous PNG/text clipboard with sanitized public errors.

## C21 - Migrazione React e React DOM (`1.10.0`)

React e React DOM allineati a 19.3.0 con tipi compatibili; componenti migrati al namespace JSX di React. La toolchain C20 resta preservata durante la risoluzione dei conflitti del lockfile; interazioni canvas, dialoghi e persistenza verificate nel renderer di produzione. / React and React DOM aligned at 19.3.0 with matching types; components use React-scoped JSX types. C20 toolchain preserved while resolving lockfile conflicts; canvas interactions, dialogs and persistence verified in the production renderer.

- Verifica C20: PR #15 CI `37060839272`, main CI `37060915788`, checkpoint `milestone/C20` e versione `v1.9.0` verificati; branch milestone e Dependabot rimossi.

## C22 - Aggiornamento icone Lucide (`1.11.0`)

Lucide React aggiornato a 1.48.0 con React 19; export, toolbar, pannelli e icone SVG accessibili verificati nei temi chiaro/scuro. Migrazioni C20-C22 integrate preservando i commit Dependabot; release cumulativa Windows/macOS con pacchetti non firmati e verifica SHA-256 prevista nella chiusura. / Lucide React upgraded to 1.48.0 with React 19; exports, toolbars, panels and accessible SVG icons verified in light/dark themes. C20-C22 migrations preserve Dependabot commits; cumulative unsigned Windows/macOS release and SHA-256 verification complete the closing process.

- Verifica C21: PR #16 CI `37061482002`, main CI `37061575541`, checkpoint `milestone/C21` e versione `v1.10.0` verificati; branch milestone e Dependabot rimossi.

## Esecuzione M23-M28 (2026-10-03)

Il progettista richiede cinque rifiniture UI e la risoluzione/rimozione del branch della PR #24, proseguendo con la deroga gia autorizzata prima di commit, merge, tag, push e rimozione branch. Eseguire M23-M28 in ordine e verificare ogni checkpoint remoto. Una sola release cumulativa v1.12.0 a M28. Rimuovere i comandi delle maschere preservando il rendering e la validazione dei dati legacy; aggiornare la documentazione corrente.

## C23 - Spaziatura del pannello Riferimenti (`1.11.1`)

Importa riferimento allineato a destra; contenuto del pannello con padding 10/12 px e gap 8 px condivisi con Dimensioni canvas. Controlli e testo separati dai bordi. / Import reference aligned to the right; panel content uses the Canvas size padding (10/12 px) and 8 px gap. Controls and text have consistent space from panel edges.

## C24 - Spaziatura del pulsante Crea versione (`1.11.2`)

Crea versione allineato a destra come Applica, con margine superiore 8 px, inferiore 12 px e laterale 10 px. / Create version is aligned to the right like Apply, with 8 px above, 12 px below and 10 px beside the button.

## C25 - Rimozione dei comandi maschera (`1.11.3`)

Rimossi creazione, attivazione, modifica e rimozione maschere e il relativo instradamento dei tratti. Conservati clipping e compatibilita di rendering/persistenza delle maschere legacy, anche in snapshot; i normali tratti non modificano le maschere precedenti. / Mask creation, toggling, editing and removal commands and stroke routing are removed. Layer clipping and legacy mask rendering/persistence, including snapshots, remain compatible; normal drawing does not change legacy masks.

## C26 - Spaziatura Brush Avanzati (`1.11.4`)

Preset, texture e slider di Brush avanzati con padding laterale 10 px, gap 8 px e spazio verticale condivisi con gli altri pannelli; slider entro i bordi senza overflow. / Advanced brush preset, texture and sliders share 10 px horizontal padding, 8 px gaps and vertical spacing with other panels; sliders stay inside panel edges without overflow.

## C27 - Spaziatura campi Versioni documento (`1.11.5`)

Nome versione e rinomina delle versioni salvate con padding laterale 10 px e campi coerenti; contenuto e azioni separati da gap 8 px, Crea versione mantiene allineamento destro comune. / Version name and saved-version rename fields have 10 px horizontal padding and consistent field styling; content/actions are separated by 8 px gaps, and Create version keeps the shared right alignment.

## C28 - Aggiornamento Electron/Vitest e chiusura PR residua (`1.12.0`)

Integrate le cronologie delle PR Dependabot #24 e #30, che la sostituisce: Electron 44.5.1 e Vitest 5.0.3. Rifiniture M23-M27 e rimozione editor maschere distribuite in una release cumulativa Windows/macOS, con pacchetti e checksum verificati nel processo di chiusura. / Dependabot PR #24 and its replacement #30 histories integrated: Electron 44.5.1 and Vitest 5.0.3. M23-M27 panel refinements and mask editor removal ship in one cumulative Windows/macOS release, with package/checksum verification during closure.

## Landing page e catture

La pubblicazione esistente e' GitHub Pages `main:/docs` sul dominio canonico `https://truedrawing.glaucosilvestri.it/`. Conservare sorgente e CNAME; verificare lo stato Pages sul commit finale. I file `docs/assets/feature-*-it.png` e `feature-*-en.png` sono screenshot reali catturati con profili e disegni di prova senza API key; aggiornarli quando cambiano i controlli mostrati, insieme alle traduzioni e ai testi alternativi. Non ingrandire gli screenshot oltre la dimensione originale nel layout.

## Pubblicazione v1.12.1 (2026-10-03)

Il progettista autorizza esplicitamente la nuova release. Il tag v1.12.1 resta sul commit 8b87cf277f2b4d4cc16114ef6173c8acf4d2d281 (C32): non spostarlo per aggiungere metadati. Packaging Windows/macOS tramite workflow Release dal tag, note bilingui in docs/release-notes/v1.12.1.md applicate alla release dopo il packaging, 10 asset scaricati e 8 checksum verificati, renderer/main/preload identici alla build verificata. Workflow 37136552575 verde. Il branch release/1.12.1-publication aggiorna soltanto note, stato corrente e versione mostrata sul sito; chiuderlo con CI verde e verifica Pages. Restano valide le deroghe autorizzate su commit, merge, push e rimozione branch.
