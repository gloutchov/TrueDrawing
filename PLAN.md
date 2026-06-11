# True Drawing - Piano di lavoro

## Obiettivo

True Drawing e' un'app locale per macOS e Windows che permette di disegnare su un canvas pulito usando mouse, penna/tavoletta tipo Wacom e, dove supportato dal sistema operativo, input touch/trackpad. L'app deve trasformare il disegno dell'utente in un'immagine realistica tramite API con chiave configurata dall'utente, mantenendo separati e salvabili sia il disegno canvas sia l'immagine realistica.

## Principi di progetto

- L'app funziona in locale: i dati del disegno restano sul computer, salvo l'invio esplicito all'API per la generazione realistica.
- Il canvas deve essere immediato, pulito e adatto al disegno, senza schermate introduttive o elementi decorativi inutili.
- Ogni milestone vive su un branch dedicato e viene chiusa solo dopo verifica locale, aggiornamento documentazione, merge su `main` e verifica CI. Le release macOS/Windows vengono generate solo quando previste o richieste esplicitamente.
- La versione aumenta alla chiusura di ogni milestone:
  - `+0.0.1` per ritocchi piccoli, correzioni o documentazione minore.
  - `+0.1.0` per funzionalita' utili o miglioramenti funzionali circoscritti.
  - `+1.0.0` per cambiamenti importanti o release stabile.
- Tutti i documenti di progetto vengono aggiornati alla conclusione di ogni milestone: `README.md`, `ISTRUZIONI.md`, `INSTRUCTION.md`, `SECURITY_MODEL.md`, `AGENTS.md`, `MAP.md` e questo `PLAN.md`.

## Stack tecnico proposto

- App desktop cross-platform: Electron.
- Frontend: TypeScript, React, Vite.
- Canvas: HTML Canvas 2D con Pointer Events, pressione penna quando disponibile, smoothing e compositing.
- Stato del disegno: modello documentale serializzabile con layer, stroke, strumenti, metadati e versioni.
- Generazione realistica: provider API configurabile, con primo adapter per OpenAI Images API.
- Segreti: OS keychain tramite modulo dedicato, con fallback controllato a storage cifrato locale se necessario.
- Salvataggio locale: file di progetto piu' export PNG/WebP per canvas e immagine realistica.
- Packaging: electron-builder con build Windows e macOS.
- CI/CD: GitHub Actions su repository privato con test e build su branch/PR/main; release artifact Windows/macOS tramite workflow manuale per risparmiare credito Actions nelle milestone intermedie.
- Distribuzione: non sono disponibili credenziali per firma codice Windows, firma macOS o notarizzazione Apple; gli artifact GitHub saranno distribuiti non firmati e la documentazione deve indicare i possibili avvisi SmartScreen/Gatekeeper.

## Architettura e configurazione

- Il programma non deve essere monolitico: ogni funzionalita' rilevante deve avere file e moduli dedicati.
- Le responsabilita' principali devono restare separate:
  - shell desktop Electron;
  - UI React;
  - canvas e input;
  - strumenti di disegno;
  - layer;
  - history undo/redo;
  - inspector realistico;
  - adapter API;
  - gestione segreti;
  - salvataggio/autosave/export;
  - configurazione;
  - test.
- Deve esistere un file di configurazione centrale versionato, pensato per utenti skilled e sviluppatori, per raccogliere i parametri modificabili.
- Parametri, limiti, default, timeout, intervalli di autosave, dimensioni canvas, nomi file, qualita' export, provider API e modello immagine non devono essere hardcoded nel codice applicativo.
- Il codice puo' avere fallback interni solo quando servono a proteggere l'app da configurazioni mancanti o corrotte; questi fallback devono essere minimi e documentati.
- La configurazione dell'API deve permettere all'utente di inserire:
  - API key;
  - provider;
  - modello di generazione immagini.
- Provider predefinito: OpenAI.
- Modello immagine OpenAI predefinito: `gpt-image-1.5`, da mantenere aggiornato se la documentazione ufficiale OpenAI cambia.
- `MAP.md` deve mostrare in grafica ASCII la struttura del programma e descrivere brevemente file, cartelle e responsabilita'. Deve essere aggiornato alla fine di ogni milestone insieme agli altri documenti.

## Convenzioni operative

### Repository e branch

- Repository GitHub privato: `truedrawing`.
- Branch stabile: `main`.
- Branch di milestone: `milestone/<numero>-<slug>`, per esempio `milestone/01-foundation`.
- Branch temporanei per fix interni alla milestone: `fix/<slug>` solo se necessario.
- Stato release GitHub al 2026-06-09: solo `v0.4.0` risulta pubblicata con artifact Windows/macOS; le altre versioni intermedie restano tag/versioni di avanzamento o release rinviate.
- Stato firma release: nessuna credenziale disponibile per firma codice Windows, firma macOS o notarizzazione Apple; le release GitHub devono essere documentate come non firmate finche' questa condizione non cambia.
- Ogni milestone termina con:
  1. test e verifica manuale locale;
  2. aggiornamento versione;
  3. aggiornamento documentazione;
  4. commit finale sul branch di milestone;
  5. pull request verso `main`;
  6. CI verde;
  7. merge su `main`;
  8. tag versione `vX.Y.Z`;
  9. release GitHub con build Windows e macOS solo quando prevista;
  10. eliminazione branch milestone dopo release verificata, oppure dopo tag e CI verde quando la release e' rinviata.

### Verifica prima del merge

Ogni milestone deve documentare in `PLAN.md`:

- branch usato;
- versione iniziale e finale;
- test automatici eseguiti;
- verifiche manuali eseguite;
- stato CI;
- link o riferimento alla release, oppure nota esplicita di rinvio release;
- aggiornamento `MAP.md`;
- eventuali rischi residui.

### Gestione segreti

- Nessuna API key deve essere salvata in chiaro nel repository, nei log, nei crash report o nei file di progetto.
- L'utente inserisce la chiave API nella UI delle impostazioni.
- La chiave viene salvata nel keychain del sistema operativo:
  - macOS Keychain;
  - Windows Credential Manager.
- I file `.env`, `.env.local`, log locali e cache contenenti dati sensibili devono essere esclusi da Git.
- L'app deve permettere di cancellare la chiave salvata.
- Le chiamate API devono inviare solo i dati necessari alla generazione dell'immagine realistica.
- Il modello immagini scelto dall'utente e' una preferenza applicativa, non un segreto; la API key resta invece nel keychain.

### Salvataggi

- Ogni disegno ha un nome scelto dall'utente.
- Il salvataggio automatico conserva:
  - `<nome>_canvas` per il disegno sorgente;
  - `<nome>_image` per l'immagine realistica.
- Il salvataggio manuale deve essere sempre disponibile.
- Il salvataggio deve proteggere dal rischio di perdita dati con scrittura atomica o strategia equivalente.
- In caso di crash, l'app deve offrire il recupero dell'ultimo autosalvataggio disponibile.

## Milestone

### M0 - Bootstrap repository e governance

- Versione finale prevista: `0.0.1`.
- Branch: `milestone/00-bootstrap`.
- Tipo incremento: `+0.0.1`.
- Obiettivo: creare le basi operative del progetto prima dello sviluppo applicativo.

Attivita':

- Inizializzare repository Git locale.
- Creare repository GitHub privato.
- Configurare `main` come branch protetto.
- Aggiungere `.gitignore` per Node, Electron, build, log, cache e segreti.
- Aggiungere CI minima per verificare documentazione, versione e configurazione.
- Creare struttura documentale iniziale:
  - `README.md` in italiano e inglese;
  - `ISTRUZIONI.md`;
  - `INSTRUCTION.md`;
  - `SECURITY_MODEL.md` in italiano e inglese;
  - `AGENTS.md`;
  - `MAP.md`;
  - `PLAN.md`.
- Definire convenzioni di commit, branch, release e versioning.
- Definire la regola architetturale: moduli piccoli, responsabilita' separate e configurazione centralizzata.

Criteri di accettazione:

- Repository privato creato e sincronizzato.
- Documentazione iniziale presente.
- `MAP.md` presente con mappa ASCII iniziale della struttura pianificata.
- `AGENTS.md` presente con direttive per architettura modulare, configurazione e aggiornamento documenti.
- CI minima presente per controllare documenti richiesti, `VERSION` e `config/app.config.json`.
- Nessun segreto o file locale sensibile tracciato.
- Versione `0.0.1` taggata. La release GitHub documentale non e' attualmente pubblicata; le release intermedie vengono pubblicate solo quando previste o richieste esplicitamente.

Verifiche:

- `git status` pulito prima del tag.
- Controllo manuale dei file documentali.
- Validazione JSON di `config/app.config.json`.
- Esecuzione CI GitHub sul branch milestone e su `main`.
- Verifica che il repository GitHub sia privato.

Esito M0:

- Branch usato: `milestone/00-bootstrap`.
- Versione iniziale: n/a.
- Versione finale: `0.0.1`.
- Repository GitHub privato: `https://github.com/gloutchov/truedrawing`.
- Test automatici locali:
  - validazione JSON di `config/app.config.json`;
  - verifica presenza documenti obbligatori;
  - verifica `VERSION = 0.0.1`.
- Verifiche manuali:
  - controllo file documentali;
  - controllo repository privato GitHub;
  - controllo assenza segreti reali nei file tracciati.
- CI:
  - branch milestone: GitHub Actions run `26946718264`, successo;
  - `main`: GitHub Actions run `26946749270`, successo.
- Release:
  - non attualmente pubblicata su GitHub; milestone conservata come tag/versione documentale verificata.
- Rischi residui:
  - la release M0 e' documentale e non contiene build Windows/macOS perche' l'app desktop viene introdotta da M1;
  - branch protection avanzata da completare quando il repository avra' workflow e PR stabili.

Stato: completata.

### M1 - Skeleton app desktop

- Versione finale prevista: `0.1.0`.
- Branch: `milestone/01-desktop-skeleton`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: avere un'app desktop avviabile su macOS e Windows.

Attivita':

- Creare progetto Electron + Vite + React + TypeScript.
- Creare struttura iniziale non monolitica per `main`, `preload`, `renderer`, `shared`, `config` e `tests`.
- Aggiungere file di configurazione centrale con default applicativi modificabili da utenti skilled.
- Configurare lint, test unitari e build.
- Creare finestra principale con titolo `True Drawing`.
- Configurare menu base app, scorciatoie essenziali e gestione finestre.
- Preparare configurazione electron-builder per macOS e Windows.
- Aggiungere GitHub Actions per test e build.

Criteri di accettazione:

- L'app si avvia localmente.
- La finestra principale mostra il nome True Drawing.
- Build locale completata.
- Configurazione centrale caricata e validata all'avvio.
- Nessun parametro di base hardcoded fuori dai file di configurazione ammessi.
- CI esegue test e build.
- Release GitHub con artifact Windows e macOS solo se richiesta esplicitamente o prevista dal piano; per questa milestone la verifica di build e' sufficiente.

Verifiche:

- Avvio locale su almeno un sistema operativo disponibile.
- Build desktop.
- CI verde su GitHub Actions.

Esito M1:

- Branch usato: `milestone/01-desktop-skeleton`.
- Versione iniziale: `0.0.1`.
- Versione finale: `0.1.0`.
- Implementazione:
  - skeleton Electron + Vite + React + TypeScript;
  - struttura modulare `main`, `preload`, `renderer`, `shared`, `config`, `tests`;
  - configurazione centrale `config/app.config.json` caricata e validata;
  - finestra principale con titolo configurato `True Drawing`;
  - menu applicativo base;
  - UI iniziale modulare per canvas, strumenti, inspector, layer e riepilogo settings;
  - lint, test unitari, build e packaging config;
  - workflow CI e workflow release Windows/macOS.
- Test automatici:
  - GitHub Actions branch milestone run `26953015235`, successo con `npm ci`, lint, test e build;
  - GitHub Actions `main` run `26953078308`, successo con `npm ci`, lint, test e build;
  - GitHub Actions release run `26953164204`, eseguito storicamente con build Windows, build macOS e upload asset.
- Verifiche locali:
  - validazione JSON di `config/app.config.json`;
  - verifica `VERSION = 0.1.0`;
  - verifica struttura file e documenti;
  - installazione/esecuzione locale non completata per errore `EPERM` di npm su cache/node_modules nella macchina locale; la verifica equivalente e' passata su runner GitHub pulito.
- CI:
  - branch milestone: successo;
  - `main`: successo;
  - release workflow: eseguito storicamente; release GitHub non attualmente pubblicata.
- Release:
  - non attualmente pubblicata su GitHub; milestone conservata come tag/versione verificata.
- Rischi residui:
  - la build macOS viene verificata su GitHub Actions macOS, non sulla macchina locale Windows;
  - branch protection avanzata resta non disponibile sul repository privato senza GitHub Pro;
  - GitHub Actions segnala deprecazione futura delle action basate su Node.js 20; da rivalutare in una milestone successiva aggiornando action o runtime quando disponibile.

Stato: completata.

### M2 - Canvas di disegno e input

- Versione finale prevista: `0.2.0`.
- Branch: `milestone/02-canvas-input`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: implementare il canvas pulito con input mouse, penna e pointer events.

Attivita':

- Creare canvas full workspace con sfondo configurabile.
- Supportare mouse e penna/tavoletta tramite Pointer Events.
- Usare pressione, tilt o altri dati penna quando disponibili.
- Gestire trackpad/touch dove il sistema operativo espone eventi compatibili.
- Implementare smoothing base del tratto.
- Aggiungere pan/zoom se necessario senza interferire con il disegno.

Criteri di accettazione:

- L'utente puo' disegnare linee continue e stabili.
- Input mouse funzionante.
- Input penna Wacom o equivalente gestito tramite eventi standard quando disponibile.
- Il canvas non perde tratti durante ridimensionamento finestra o cambio focus.

Verifiche:

- Test manuale con mouse.
- Test manuale con penna/tavoletta quando disponibile.
- Test unitari sul modello dati dei tratti.
- Test di regressione su resize canvas.
- Verifica che parametri canvas e input siano letti dalla configurazione.

Esito M2:

- Branch usato: `milestone/02-canvas-input`.
- Versione iniziale: `0.1.0`.
- Versione finale: `0.2.0`.
- Implementazione:
  - canvas HTML reale al posto del placeholder;
  - input tramite Pointer Events con `setPointerCapture`;
  - supporto a mouse, penna/tavoletta e touch/trackpad quando esposti dal sistema operativo come pointer events;
  - normalizzazione pressione e dimensione tratto sensibile alla pressione;
  - distanza minima fra punti e smoothing configurabili;
  - rendering locale dei tratti con curve quadratiche;
  - modello stroke testabile in `src/shared/drawing`;
  - parametri canvas/input aggiunti a `config/app.config.json`.
- Test automatici:
  - GitHub Actions branch milestone run `26956753821`, successo con `npm ci`, verifica documenti, verifica versione, lint, test e build.
- Verifiche locali:
  - validazione JSON di `config/app.config.json`;
  - verifica `VERSION = 0.2.0` e `package.json = 0.2.0`;
  - test/lint/build locali bloccati da `node_modules` non installato correttamente su questa macchina per errori npm `EPERM`; verifica completa demandata a GitHub Actions.
- CI:
  - branch milestone: successo;
  - `main`: GitHub Actions run `26956959005`, successo;
  - release workflow: GitHub Actions run `26957023417`, eseguito storicamente con build Windows, build macOS e asset.
- Release:
  - non attualmente pubblicata su GitHub; milestone conservata come tag/versione verificata.
- Artifact generati/verificati storicamente dal workflow:
  - `True-Drawing-0.2.0-Windows-x64.exe`;
  - `True-Drawing-0.2.0-Windows-x64.exe.blockmap`;
  - `True-Drawing-0.2.0-macOS-arm64.dmg`;
  - `True-Drawing-0.2.0-macOS-arm64.dmg.blockmap`;
  - `True-Drawing-0.2.0-macOS-arm64.zip`;
  - `True-Drawing-0.2.0-macOS-arm64.zip.blockmap`;
  - `latest.yml`;
  - `latest-mac.yml`.
- Rischi residui:
  - test manuale con tavoletta Wacom fisica non eseguito in questa sessione;
  - pan/zoom rimandato per non interferire con il tracciamento base.

Stato: completata.

### M3 - Strumenti di tratto, colore, gomma, undo e redo

- Versione finale prevista: `0.3.0`.
- Branch: `milestone/03-tools-history`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: rendere il disegno realmente utilizzabile con strumenti artistici di base.

Attivita':

- Toolbar con strumenti:
  - matita;
  - pennarello;
  - pennello;
  - gomma.
- Controlli per:
  - dimensione tratto;
  - opacita';
  - colore;
  - forma del tratto;
  - hardness/softness dove applicabile.
- Undo e redo per azioni di disegno e cancellazione.
- Shortcut da tastiera per undo/redo.
- Preview del tratto selezionato.

Criteri di accettazione:

- Ogni strumento produce un tratto distinguibile.
- Colore, dimensione e trasparenza cambiano il risultato visivo.
- La gomma modifica il contenuto in modo prevedibile.
- Undo/redo funzionano senza corrompere il documento.

Verifiche:

- Test unitari su history stack.
- Test manuale su ogni strumento.
- Verifica UI responsive su dimensioni finestra ridotte.
- Verifica che default strumenti, dimensioni, opacita' e colori siano configurabili.

Esito M3:

- Branch usato: `milestone/03-tools-history`.
- Versione iniziale: `0.2.0`.
- Versione finale: `0.3.0`.
- Implementazione:
  - toolbar collegata allo stato reale degli strumenti;
  - preset configurabili per matita, pennarello, pennello e gomma;
  - controlli colore, dimensione, opacita' e hardness;
  - rendering con hardness/softness e gomma tramite compositing canvas;
  - modello undo/redo condiviso e testabile;
  - shortcut `Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z` e `Ctrl/Cmd+Y`;
  - parametri tool e range controlli aggiunti a `config/app.config.json`.
- Test automatici:
  - GitHub Actions branch milestone run `26958804881`, successo con `npm ci`, verifica documenti, verifica versione, lint, test e build.
- Verifiche locali:
  - validazione JSON di `config/app.config.json`;
  - verifica `VERSION = 0.3.0` e `package.json = 0.3.0`;
  - test/lint/build locali bloccati da `node_modules` non installato correttamente su questa macchina; verifica completa demandata a GitHub Actions.
- CI:
  - branch milestone: successo;
  - `main`: GitHub Actions run `26958948854`, successo;
  - release workflow: GitHub Actions run `26959021229`, eseguito storicamente con build Windows, build macOS e asset.
- Release:
  - non attualmente pubblicata su GitHub; milestone conservata come tag/versione verificata.
- Patch successiva:
  - versione `0.3.1`;
  - commit `2514090` su `main`;
  - release GitHub non attualmente pubblicata;
  - contenuto: aggiunta icona personalizzata dell'app, integrazione icona in finestra/menu e finestra informazioni; nessuna nuova funzionalita' di disegno rispetto a M3.
- Artifact generati/verificati storicamente dal workflow:
  - `True-Drawing-0.3.0-Windows-x64.exe`;
  - `True-Drawing-0.3.0-Windows-x64.exe.blockmap`;
  - `True-Drawing-0.3.0-macOS-arm64.dmg`;
  - `True-Drawing-0.3.0-macOS-arm64.dmg.blockmap`;
  - `True-Drawing-0.3.0-macOS-arm64.zip`;
  - `True-Drawing-0.3.0-macOS-arm64.zip.blockmap`;
  - `latest.yml`;
  - `latest-mac.yml`.
- Rischi residui:
  - test manuale con tavoletta Wacom fisica non eseguito in questa sessione;
  - gomma implementata come stroke di compositing su canvas singolo; l'integrazione profonda con layer arrivera' in M4.

Stato: completata.

### M4 - Layer

- Versione finale prevista: `0.4.0`.
- Branch: `milestone/04-layers`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: aggiungere gestione completa dei layer.

Attivita':

- Pannello layer.
- Creazione, rinomina, cancellazione layer.
- Accensione/spegnimento visibilita'.
- Selezione layer attivo.
- Riordinamento layer.
- Opacita' layer.
- Protezione contro cancellazione accidentale dell'ultimo layer.
- Integrazione layer con undo/redo.

Criteri di accettazione:

- L'utente puo' costruire un disegno su piu' layer.
- I layer invisibili non appaiono nel canvas composito.
- Le operazioni sui layer sono reversibili dove opportuno.
- Il salvataggio documentale conserva struttura e proprieta' dei layer.

Verifiche:

- Test unitari sul modello layer.
- Test manuale creazione/cancellazione/visibilita'/riordino.
- Test di compositing canvas.

Esito locale M4:

- Branch usato: `milestone/04-layers`.
- Versione iniziale: `0.3.1`.
- Versione finale prevista: `0.4.0`.
- Implementazione:
  - modello documento/layer condiviso e testabile in `src/shared/document`;
  - history renderer spostata dal solo array di stroke al documento di disegno;
  - canvas composito per layer con ordine bottom-to-top, visibilita' e opacita';
  - strumenti di disegno applicati al layer attivo;
  - pannello layer con creazione, rinomina, selezione, visibilita', opacita', riordino e cancellazione protetta dell'ultimo layer;
  - finestra info corretta per evitare scrollbar verticale e menu Windows inutile;
  - workflow release aggiornato per caricare gli asset direttamente sulla release GitHub evitando la quota GitHub Actions artifacts;
  - parametri layer aggiunti a `config/app.config.json` e validazione configurazione aggiornata.
- Test automatici locali:
  - `npm run test`, successo;
  - `npm run lint`, successo;
  - `npm run build`, successo.
- Verifiche manuali:
  - verifica manuale app Electron confermata dall'utente il 2026-06-08: layer funzionanti correttamente;
  - verifica finestra info confermata dopo correzione scrollbar/menu.
- CI:
  - PR `#1` verso `main`: GitHub Actions CI run `27129330422`, successo;
  - `main`: GitHub Actions CI run `27130334932`, successo;
  - release: GitHub Actions release run `27130598729`, successo con build Windows/macOS e upload diretto asset release.
- Release:
  - pubblicata: `https://github.com/gloutchov/truedrawing/releases/tag/v0.4.0`.
- Artifact release verificati:
  - `True-Drawing-0.4.0-Windows-x64.exe`;
  - `True-Drawing-0.4.0-Windows-x64.exe.blockmap`;
  - `True-Drawing-0.4.0-macOS-arm64.dmg`;
  - `True-Drawing-0.4.0-macOS-arm64.dmg.blockmap`;
  - `True-Drawing-0.4.0-macOS-arm64.zip`;
  - `True-Drawing-0.4.0-macOS-arm64.zip.blockmap`;
  - `latest.yml`;
  - `latest-mac.yml`.
- Rischi residui:
  - opacita' layer aggiornata da slider crea uno step history per ogni modifica, da rivalutare se l'esperienza risulta troppo granulare.
  - GitHub Actions segnala deprecazione futura delle action basate su Node.js 20, gia' presente nelle milestone precedenti.

Stato: completata.

### M5 - Inspector realistico e generazione immagine

- Versione finale prevista: `0.5.0`.
- Branch: `milestone/05-realistic-inspector`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: aggiungere la finestra inspector che genera e mostra l'immagine realistica derivata dal canvas.

Attivita':

- Pannello inspector laterale o flottante.
- Rendering preview dell'immagine realistica.
- Pulsante o comando per generare/rigenerare immagine.
- Adapter API per generazione immagine, con provider predefinito OpenAI.
- Modello immagine configurabile dall'utente; default OpenAI `gpt-image-1.5`.
- Prompt tecnico costruito dal canvas e dalle impostazioni utente.
- Stato di caricamento, errore, annullamento e retry.
- Doppio click sull'inspector per passare dall'immagine realistica al canvas di disegno e viceversa.
- Salvataggio dell'ultima immagine generata nel documento.

Criteri di accettazione:

- L'utente puo' generare un'immagine realistica dal disegno.
- L'utente puo' scegliere o modificare il modello immagini usato dalla generazione.
- L'inspector mostra lo stato corretto durante generazione, errore e successo.
- Il doppio click cambia vista in modo chiaro e reversibile.
- L'immagine generata resta associata al progetto.

Verifiche:

- Test unitari sull'adapter API con mock.
- Test manuale generazione con API key valida.
- Test manuale errore con API key assente o non valida.
- Verifica che non vengano loggati segreti.

Esito locale M5:

- Branch usato: `milestone/05-realistic-inspector`.
- Versione iniziale: `0.4.0`.
- Versione finale prevista: `0.5.0`.
- Implementazione:
  - menu `File > API Key...` per inserire, sostituire e rimuovere la chiave OpenAI;
  - menu applicativo ripulito con gruppo `File` essenziale: Nuovo, Apri, Chiudi, API Key ed Exit;
  - storage cifrato locale della chiave tramite Electron `safeStorage` nel processo main;
  - canali IPC validati per stato chiave, salvataggio/rimozione chiave e generazione immagine;
  - inspector realistico con preview, stato loading, errore, retry e metadati provider/modello;
  - export PNG del canvas composito con layer, visibilita' e opacita';
  - prompt tecnico costruito dal documento canvas;
  - adapter OpenAI Images API con mock testabile, timeout configurato, formato output PNG e sanitizzazione errori;
  - gestione robusta della risposta OpenAI sia con immagine `b64_json` sia con URL scaricabile;
  - immagine realistica associata al documento in memoria.
- Test automatici locali:
  - `npm run test`, successo;
  - `npm run lint`, successo;
  - `npm run build`, successo.
- Verifiche manuali:
  - generazione immagine con API key reale verificata dall'utente il 2026-06-08 dopo la correzione dell'adapter OpenAI.
- CI:
  - PR `#2` verso `main`: GitHub Actions CI run `27140031776`, successo;
  - `main`: GitHub Actions CI run `27140098764`, successo.
- Release:
  - rinviata su richiesta dell'utente per risparmiare credito GitHub Actions; il workflow release Windows/macOS e' manuale.
- Rischi residui:
  - storage chiave implementato con `safeStorage` cifrato locale; M6 deve consolidare keychain esplicito macOS/Windows;
  - la generazione reale e' stata verificata manualmente dall'utente, ma resta dipendente da quota, modello e disponibilita' del provider OpenAI;
  - opacita' layer continua a creare uno step history per ogni modifica slider.

Stato: completata; release GitHub rinviata.

### M6 - Sicurezza, API key e modello dei segreti

- Versione finale prevista: `0.6.0`.
- Branch: `milestone/06-security-secrets`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: rendere affidabile la gestione delle API key e documentare il modello di sicurezza.

Attivita':

- UI impostazioni per inserire, verificare e rimuovere API key.
- UI impostazioni per inserire e modificare il modello immagini, separandolo dalla API key.
- Salvataggio nel keychain del sistema operativo.
- Isolamento fra processo renderer e main process Electron.
- IPC con validazione input e canali minimi.
- Content Security Policy.
- Disabilitazione Node integration nel renderer dove possibile.
- Sanitizzazione log ed errori.
- Aggiornamento approfondito di `SECURITY_MODEL.md`.

Criteri di accettazione:

- La chiave API non appare in file, log, crash report o DevTools output.
- L'app funziona dopo riavvio recuperando la chiave dal keychain.
- Il modello immagini resta salvato come preferenza non segreta e puo' essere modificato dall'utente.
- La chiave puo' essere cancellata dall'utente.
- Il renderer non ha accesso diretto non necessario al filesystem o ai segreti.

Verifiche:

- Test unitari sui servizi segreti con mock.
- Test manuale inserimento/rimozione chiave.
- Revisione manuale log.
- Checklist sicurezza completata in `SECURITY_MODEL.md`.

Esito locale M6:

- Branch usato: `milestone/06-security-secrets`.
- Versione iniziale: `0.5.0`.
- Versione finale prevista: `0.6.0`.
- Implementazione:
  - API key salvata tramite backend dedicato: Windows Credential Manager su Windows, macOS Keychain su macOS, fallback locale cifrato con `safeStorage` per ambienti non supportati;
  - stato API key esteso con indicazione del backend senza esporre mai la chiave al renderer;
  - preferenza modello immagini persistente e non segreta in `userData/preferences`;
  - UI `File > API Key...` estesa per modificare sia API key sia modello immagini tramite campo testo con suggerimenti;
  - lista modelli immagini suggeriti aggiunta a `config/app.config.json` e validata all'avvio;
  - margine configurabile nell'export canvas inviato a OpenAI per ridurre il rischio di immagine tagliata sui bordi;
  - validazione IPC rafforzata per generazione immagine, modello e PNG data URL;
  - renderer sandbox attivo e Content Security Policy installata dalla sessione Electron;
  - test unitari per credential store, preferenze modello e CSP.
- Test automatici locali:
  - `npm run test`, successo;
  - `npm run lint`, successo;
  - `npm run build`, successo.
- Verifiche manuali:
  - verifica manuale app Electron confermata dall'utente il 2026-06-08: editor visibile, API key salvata correttamente, modello immagine modificabile da campo testo e generazione senza taglio evidente in basso.
- CI:
  - PR `#3` verso `main`: GitHub Actions CI run `27144444428`, successo;
  - `main`: GitHub Actions CI run `27144512776`, successo.
- Release:
  - rinviata secondo policy manuale per risparmiare credito GitHub Actions; il workflow release Windows/macOS resta disponibile solo con avvio manuale.
- Rischi residui:
  - backend macOS Keychain non verificato manualmente in questa sessione Windows;
  - fallback locale cifrato resta previsto solo per ambienti non supportati o di sviluppo;
  - il comando macOS `security` riceve la password come argomento del processo; da rivalutare prima di una release macOS firmata se emerge un'alternativa nativa senza dipendenze.

Stato: completata; release GitHub rinviata.

### M7 - Salvataggio automatico, manuale, recupero ed export

- Versione finale prevista: `0.7.0`.
- Branch: `milestone/07-save-export`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: proteggere il lavoro dell'utente e produrre file riutilizzabili.

Attivita':

- Nome disegno obbligatorio o richiesto al primo salvataggio.
- Autosave temporizzato del documento canvas.
- Autosave dell'immagine realistica generata.
- Salvataggio manuale.
- Nomi file:
  - `<nome>_canvas`;
  - `<nome>_image`.
- Recupero autosave dopo crash o chiusura inattesa.
- Export PNG/WebP per canvas e immagine realistica.
- Gestione conflitti nome file.

Criteri di accettazione:

- Il disegno non viene perso dopo chiusura inattesa simulata.
- Canvas e immagine realistica vengono salvati separatamente.
- Il salvataggio manuale produce file con nomi corretti.
- L'utente riceve feedback chiaro su salvataggio riuscito o fallito.

Verifiche:

- Test unitari serializzazione/deserializzazione.
- Test manuale autosave.
- Test manuale recupero.
- Test manuale export.

Esito locale M7:

- Branch usato: `milestone/07-save-export`.
- Versione iniziale: `0.6.0`.
- Versione finale prevista: `0.7.0`.
- Implementazione:
  - formato progetto `.tdraw` versionato con validazione e serializzazione in `src/shared/project`;
  - salvataggio manuale e `Salva con nome...` tramite dialog nativi Electron;
  - scrittura atomica del file progetto e sidecar configurati `<nome>_canvas.png` e `<nome>_image.png`;
  - apertura progetto `.tdraw` con validazione nel main process;
  - autosave temporizzato in `userData` con directory, estensione e nome default configurabili;
  - recupero dell'ultimo autosave disponibile all'avvio renderer;
  - export canvas e immagine realistica in PNG/WebP;
  - menu File abilitato per Nuovo, Apri, Salva, Salva con nome ed export;
  - inspector realistico proporzionale al canvas di disegno;
  - toolbar compatta con sottomenù tratto, linea, shape e tipo tratto;
  - strumenti linea retta/curva, rettangolo/ellisse/triangolo/poligono e riempimento flood fill delimitato dai confini del layer;
  - tratto continuo, tratteggiato e a puntini salvati nel modello stroke;
  - menu Edit collegato a undo/redo del documento e clipboard testo/immagine;
  - strumento selezione rettangolare per cut/copy/paste canvas;
  - cut della selezione come cancellazione rettangolare salvabile e paste come immagine raster nel layer attivo;
  - paste selezionato automaticamente e spostabile finche' resta selezionato;
  - shortcut `Ctrl/Cmd+X`, `Ctrl/Cmd+C` e `Ctrl/Cmd+V` instradati alla selezione canvas quando il focus non e' in un campo testo;
  - menu View collegato allo zoom canvas invece dello zoom Electron;
  - pulsanti canvas `+`/`-`/reset e zoom con rotella mouse;
  - pulsante visibile per uscire dal fullscreen;
  - canali IPC validati per salvataggio, apertura, autosave, recupero ed export;
  - renderer ancora senza accesso diretto al filesystem.
- Test automatici locali:
  - `npm run test`, successo;
  - `npm run lint`, successo;
  - `npm run build`, successo.
- Verifiche manuali:
  - feedback funzionale dell'utente completato sulle correzioni canvas/menu richieste;
  - resta utile provare in app Electron interattiva il flusso completo con dialog reali prima della prossima release pubblica.
- CI:
  - push branch `milestone/07-save-export`: GitHub Actions run `27214601475`, successo;
  - PR #4: GitHub Actions run `27215067905`, successo dopo rerun del job cancellato;
  - main dopo merge: GitHub Actions run `27216934994`, successo.
- GitHub:
  - branch `milestone/07-save-export` pushato;
  - tag `v0.7.0` pushato;
  - PR #4 mergiata su `main` con merge commit `a22d9e86571880aca98d7c6a0f9a40449f1de91e`.
- Release:
  - rinviata secondo policy manuale; `v0.4.0` resta l'unica release GitHub pubblicata con artifact Windows/macOS.
- Rischi residui:
  - il flusso salvataggio/apertura/export deve ancora essere provato manualmente con dialog reali;
  - il recupero autosave carica il progetto in memoria senza associarlo al percorso autosave, quindi l'utente deve salvarlo esplicitamente per conservarlo come progetto ordinario.

Stato: completata e mergiata su `main`; release GitHub rinviata.

### M8 - Esperienza utente completa e rifinitura app

- Versione finale prevista: `0.8.0`.
- Branch: `milestone/08-ux-polish`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: trasformare le funzionalita' in un flusso coerente e stabile.

Attivita':

- Layout definitivo canvas, toolbar, layer panel e inspector.
- Stati vuoti e stati errore.
- Conferme per azioni distruttive.
- Shortcut principali.
- Preferenze utente persistenti.
- Miglioramenti performance su disegni grandi.
- Accessibilita' base: focus, tooltip, contrasto, target cliccabili.
- Revisione testi UI in italiano e inglese se prevista localizzazione.

Criteri di accettazione:

- Le funzioni principali sono raggiungibili senza confusione.
- L'app resta fluida con un disegno realistico di test.
- Non ci sono sovrapposizioni o rotture layout a dimensioni finestra comuni.
- Gli stati errore guidano l'utente verso una soluzione.

Verifiche:

- Test manuale end-to-end: nuovo disegno, strumenti, layer, generazione, salvataggio, export.
- Screenshot QA su dimensioni finestra desktop comuni.
- Test performance con documento grande.

Esito locale M8:

- Branch usato: `milestone/08-ux-polish`.
- Versione iniziale: `0.7.0`.
- Versione finale prevista: `0.8.0`.
- Implementazione:
  - layout applicazione esteso con status bar configurabile;
  - status bar con stato salvataggio, modifiche, tool attivo, layer attivo, conteggio layer/tratti e zoom;
  - zoom canvas persistente come preferenza UI non segreta in `localStorage`;
  - conferma chiusura finestra con modifiche non salvate tramite `beforeunload`;
  - conferme per eliminazione layer, rimozione API key e scarto autosave;
  - inspector realistico con stati espliciti per API key mancante, immagine assente, generazione in corso ed errore;
  - menu `File > Stile...` con stili immagine predefiniti in ordine alfabetico e input personalizzato;
  - menu `File > Redraw automatico...` con attivazione e tempo di inattivita' configurabile;
  - redraw automatico inspector dopo modifiche canvas e pausa dell'utente, senza loop sulla sola immagine generata;
  - hardening IPC/filesystem con allowlist percorsi progetto selezionati dall'utente, limiti payload e sanitizzazione nomi file generati;
  - menu strumenti richiudibili con Escape o click esterno;
  - focus visibile uniforme, layout top/status bar piu' robusto e lista layer scrollabile;
  - nuovi parametri UI in `config/app.config.json` con validazione.
- Test automatici locali:
  - `npm run lint`, successo;
  - `npm run test`, successo con 10 file e 34 test;
  - `npm run build`, successo.
- Verifiche manuali:
  - feedback funzionale dell'utente completato sulle correzioni UX richieste durante M8;
  - resta utile una prova end-to-end su build release prima della prossima release pubblica.
- CI:
  - PR #5: GitHub Actions CI run `27269984715`, successo.
- GitHub:
  - branch `milestone/08-ux-polish` pushato;
  - PR #5 mergiata su `main` con merge commit `d55e18299144989e892f022dc20378dc5317aca7`;
  - tag `v0.8.0` pushato.
- Release:
  - non prevista automaticamente; da rinviare salvo richiesta esplicita secondo policy manuale;
  - policy distribuzione non firmata documentata in `AGENTS.md`, `README.md`, `ISTRUZIONI.md`, `INSTRUCTION.md`, `SECURITY_MODEL.md`, `MAP.md` e `PLAN.md`.
- Rischi residui:
  - lo zoom persistente e' una preferenza locale best-effort: se `localStorage` viene cancellato, torna al default;
  - la conferma `beforeunload` dipende dal comportamento della finestra Electron/piattaforma;
  - resta utile testare manualmente salvataggio/apertura/export con dialog reali insieme al nuovo stato UX.

Stato: completata e mergiata su `main`; release GitHub rinviata.

### Patch 0.8.2 - Preferenze lingua e tema interfaccia

- Versione finale prevista: `0.8.2`.
- Branch: `feature/ui-language-theme-preferences`.
- Tipo incremento: `+0.0.1`.
- Obiettivo: aggiungere preferenze UI per lingua e tema prima di procedere con packaging e beta.

Attivita':

- Aggiungere interfaccia bilingue italiano/inglese per menu e controlli principali.
- Consentire scelta lingua fra default di sistema, italiano e inglese.
- Consentire scelta tema fra default di sistema, chiaro e scuro.
- Inserire le opzioni nel menu `File > Impostazioni > Interfaccia...`.
- Salvare le preferenze UI non segrete in `localStorage`.
- Aggiornare documentazione, mappa e versione.

Criteri di accettazione:

- L'app applica lingua e tema scelti dall'utente senza salvare dati sensibili.
- Il default di sistema usa lingua e tema del sistema operativo/runtime.
- Il menu nativo Electron si riallinea alla lingua effettiva.
- Le opzioni restano persistenti al riavvio.

Verifiche:

- `npm run lint`, successo.
- `npm run test`, successo con 10 file e 34 test.
- `npm run build`, successo.
- `git diff --check`, successo.
- Verifica manuale del dialog interfaccia, cambio lingua/tema, menu nativo, rimozione voce duplicata `Chiudi` e comportamento `npm run dev`.

Esito patch 0.8.2:

- Branch usato: `feature/ui-language-theme-preferences`.
- Versione iniziale: `0.8.0`.
- Versione finale: `0.8.2`.
- Implementazione:
  - interfaccia bilingue italiano/inglese per controlli principali e menu nativo Electron;
  - preferenza lingua fra default di sistema, italiano e inglese;
  - preferenza tema fra default di sistema, chiaro e scuro;
  - dialog `File > Impostazioni > Interfaccia...`;
  - preferenze UI non segrete salvate in `localStorage`;
  - documentazione utente aggiornata in italiano e inglese;
  - rimozione della voce duplicata `Chiudi` dal menu File, mantenendo `Esci`;
  - `npm run dev` aggiornato per ricompilare il main Electron prima dell'avvio.
- CI:
  - PR #7: GitHub Actions CI run `27283184712`, successo;
  - `main`: GitHub Actions CI run `27283321985`, successo.
- GitHub:
  - PR #7 mergiata su `main` con merge commit `72c5dcbaba6d558f16436a7de20c8a67b0067c1d`;
  - tag `v0.8.2` pushato;
  - branch `feature/ui-language-theme-preferences` eliminato.
- Release:
  - rinviata secondo policy manuale; `v0.4.0` resta l'unica release GitHub pubblicata con artifact Windows/macOS.

Stato: completata e mergiata su `main`; release GitHub rinviata.

### M9 - Packaging, CI/CD e release cross-platform

- Versione finale prevista: `0.9.0`.
- Branch: `milestone/09-packaging-ci-release`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: rendere ripetibile la produzione delle release macOS e Windows e pubblicare `v0.9.0` come versione di rilascio.

Attivita':

- Consolidare GitHub Actions:
  - lint;
  - test;
  - build;
  - validazione tag/versione;
  - packaging Windows;
  - packaging macOS;
  - checksum SHA-256;
  - artifact upload;
  - release da tag.
- Mantenere disattivate firma codice Windows, firma macOS e notarizzazione Apple finche' non saranno disponibili credenziali dedicate.
- Documentare nelle release GitHub che gli artifact Windows/macOS sono non firmati e possono attivare SmartScreen/Gatekeeper.
- Generare changelog e note di release per `v0.9.0`.
- Verificare installazione pacchetti prodotti.

Criteri di accettazione:

- Il tag `v0.9.0` genera una release GitHub scaricabile tramite workflow manuale.
- Artifact Windows e macOS sono presenti nella release `v0.9.0`.
- I file checksum SHA-256 sono presenti nella release `v0.9.0`.
- Le note di release e la documentazione indicano chiaramente che gli artifact sono non firmati, salvo disponibilita' futura di credenziali.
- CI fallisce se test o build falliscono.
- La procedura e' documentata in `AGENTS.md` e `README.md`.
- `MAP.md` descrive la struttura finale dei moduli e dei workflow di build/release.

Verifiche:

- Esecuzione CI completa.
- Download e avvio artifact su almeno una piattaforma disponibile.
- Controllo manuale release GitHub.

Esito locale M9 in corso:

- Branch usato: `milestone/09-packaging-ci-release`.
- Versione iniziale: `0.8.2`.
- Versione finale prevista: `0.9.0`.
- Implementazione locale:
  - versione sorgente aggiornata a `0.9.0`;
  - workflow release manuale consolidato con job di validazione tag/versione, documenti obbligatori, lint, test e build;
  - creazione o aggiornamento release GitHub con note da `docs/release-notes/v0.9.0.md`;
  - upload diretto degli asset Windows/macOS non firmati sulla release GitHub;
  - generazione e upload checksum `SHA256SUMS-windows.txt` e `SHA256SUMS-macos.txt`;
  - documentazione aggiornata per procedura release, warning SmartScreen/Gatekeeper e verifica checksum.
- Verifiche locali:
  - `git diff --check`, successo;
  - `npm run lint`, successo;
  - `npm run test`, successo con 10 file e 34 test;
  - `npm run build`, successo;
  - `npm run dist:win`, build app completata ma packaging installer bloccato localmente dall'estrazione `winCodeSign` per privilegio Windows mancante sui symlink in `AppData`; riprovato fuori sandbox con stesso esito.
- CI:
  - push branch `milestone/09-packaging-ci-release`: GitHub Actions run `27338790680`, successo.
  - PR M9: da completare.
- Release:
  - da completare dopo merge/tag `v0.9.0` tramite workflow manuale `Release`.

Stato: in sviluppo.

### Validazione beta e stabilizzazione

Le attivita' originariamente previste come beta privata e release stabile sono considerate gia' completate manualmente prima di M9:

- l'utente ha eseguito diversi test reali dell'app il 2026-06-10;
- i problemi emersi durante i test sono stati corretti nelle patch gia' mergiate;
- la documentazione utente e tecnica e' stata aggiornata;
- non risultano bug critici aperti prima della preparazione della release `v0.9.0`.

Queste attivita' non restano come milestone future separate: M9 diventa la milestone di rilascio.

Stato: completata manualmente.

### M10 - Landing page del programma

- Versione finale prevista: `0.10.0`.
- Branch: `milestone/10-landing-page`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: creare una landing page pubblica per True Drawing con link al repository e al download della release.

Attivita':

- Usare le immagini e la GIF gia' preparate in `docs/assets`.
- Creare una landing page statica, pubblicabile dal repository.
- Mostrare screenshot dell'app in italiano e inglese, con interfaccia chiara e scura.
- Inserire link al repository GitHub.
- Inserire link alla release/download piu' recente.
- Rendere la landing page bilingue italiano/inglese.
- Selezionare automaticamente italiano quando il sistema/browser e' impostato in italiano.
- Usare inglese come lingua predefinita per tutte le altre lingue di sistema.
- Aggiungere un selettore manuale per passare fra italiano e inglese.
- Curare layout responsive, testi brevi, accessibilita' base e alt text per immagini/GIF.
- Documentare come visualizzare e pubblicare la landing page.

Criteri di accettazione:

- La landing page si apre localmente senza backend.
- La lingua iniziale segue il sistema/browser: italiano per `it`, inglese per tutto il resto.
- Il selettore lingua cambia i testi senza ricaricare la pagina.
- I link a repository e release/download sono visibili e funzionanti.
- Le immagini e la GIF in `docs/assets` vengono usate senza duplicazioni inutili.
- La pagina resta leggibile su desktop e mobile.

Verifiche:

- Test locale della pagina statica.
- Controllo manuale lingua italiana/inglese.
- Controllo manuale link repository e download.
- Verifica layout desktop/mobile.
- Verifica che gli asset siano tracciati e richiamati con percorsi relativi corretti.

Stato: pianificata.

## Backlog post release

- Supporto brush avanzati e texture personalizzate.
- Import immagini di riferimento.
- Maschere e clipping layer.
- Storia versioni del documento.
- Preset di stile realistico.
- Supporto provider AI multipli.
- Modalita' offline completa senza generazione AI.
- Aggiornamenti automatici firmati.

## Registro avanzamento

| Data | Milestone | Versione | Branch | Stato | Note |
| --- | --- | --- | --- | --- | --- |
| 2026-06-04 | Pianificazione iniziale | n/a | n/a | In corso | Creato piano iniziale in `PLAN.md`; la cartella non risulta ancora inizializzata come repository Git. |
| 2026-06-04 | M0 - Bootstrap repository e governance | 0.0.1 | `milestone/00-bootstrap` | Completata | Repository privato creato, documentazione iniziale aggiunta, CI minima verde su branch milestone e `main`; tag/versione documentale preparata, release GitHub non attualmente pubblicata. |
| 2026-06-04 | M1 - Skeleton app desktop | 0.1.0 | `milestone/01-desktop-skeleton` | Completata | Skeleton Electron/Vite/React modulare, config validata, lint/test/build in CI e workflow release Windows/macOS aggiunti. |
| 2026-06-04 | M2 - Canvas di disegno e input | 0.2.0 | `milestone/02-canvas-input` | Completata | Canvas interattivo con Pointer Events, pressione, smoothing, modello stroke e test unitari aggiunti; CI branch/main verde; release GitHub non attualmente pubblicata. |
| 2026-06-04 | M3 - Strumenti di tratto, colore, gomma, undo e redo | 0.3.0 | `milestone/03-tools-history` | Completata | Tool reali, controlli tratto, gomma, modello history e shortcut undo/redo implementati; CI branch/main verde; release GitHub non attualmente pubblicata. |
| 2026-06-07 | Patch icona app | 0.3.1 | `main` | Completata | Aggiunta icona personalizzata dell'app e integrazione in finestra/menu; release GitHub non attualmente pubblicata. |
| 2026-06-08 | M4 - Layer | 0.4.0 | `milestone/04-layers` | Completata | Layer completati con modello documento, compositing, pannello layer, correzione finestra info e workflow release diretto; CI main verde e release `v0.4.0` pubblicata con artifact Windows/macOS. |
| 2026-06-08 | M5 - Inspector realistico e generazione immagine | 0.5.0 | `milestone/05-realistic-inspector` | Completata | Inspector realistico, menu API key, storage cifrato locale, adapter OpenAI e test unitari verificati; generazione reale confermata dall'utente, PR #2 e CI main verdi. Release rinviata per risparmiare credito Actions. |
| 2026-06-08 | M6 - Sicurezza, API key e modello dei segreti | 0.6.0 | `milestone/06-security-secrets` | Completata | Keychain/Credential Manager, preferenza modello immagini libera, CSP, sandbox renderer, padding export e test sicurezza verificati localmente; verifica manuale confermata, PR #3 e CI main verdi. Release rinviata. |
| 2026-06-09 | M7 - Salvataggio automatico, manuale, recupero ed export | 0.7.0 | `milestone/07-save-export` | Completata | `.tdraw`, sidecar canvas/immagine, autosave, recupero, export PNG/WebP, inspector proporzionale, strumenti linea/shape/fill/tipo tratto/selezione, paste spostabile, menu Edit e shortcut corretti, zoom canvas e uscita fullscreen visibile implementati; lint/test/build locali verdi; PR #4 e CI main verdi; tag `v0.7.0` pushato; release rinviata. |
| 2026-06-10 | M8 - Esperienza utente completa e rifinitura app | 0.8.0 | `milestone/08-ux-polish` | Completata | Status bar, stati inspector, conferme distruttive, zoom persistente, menu strumenti richiudibili, stile immagine, redraw automatico, focus visibile, layout piu' stabile, configurazione UI validata e policy release non firmate documentata; lint/test/build locali verdi; PR #5 e CI verdi; tag `v0.8.0` pushato; release rinviata. |
| 2026-06-10 | Patch preferenze lingua/tema interfaccia | 0.8.2 | `feature/ui-language-theme-preferences` | Completata | Aggiunta interfaccia italiano/inglese e tema chiaro/scuro con default di sistema, sotto `File > Impostazioni > Interfaccia...`; rimossa voce duplicata `Chiudi`; `npm run dev` ricompila il main Electron prima dell'avvio; PR #7 e CI verdi; tag `v0.8.2` pushato; branch eliminato; release rinviata. |
| 2026-06-10 | Validazione beta e stabilizzazione | n/a | `main` | Completata | Test manuali reali eseguiti dall'utente; problemi emersi gia' corretti; documentazione aggiornata; le precedenti M10 beta privata e M11 release stabile sono assorbite prima della release `v0.9.0`. |
| 2026-06-11 | M9 - Packaging, CI/CD e release cross-platform | 0.9.0 | `milestone/09-packaging-ci-release` | In sviluppo | Versione aggiornata, workflow release manuale consolidato con validazione tag/versione, note release `v0.9.0`, checksum SHA-256 e documentazione release/checksum aggiornata; verifiche locali, PR/CI e pubblicazione release ancora da completare. |

## Checklist di chiusura milestone

Da completare per ogni milestone prima della chiusura:

- [ ] Branch milestone creato.
- [ ] Implementazione completata.
- [ ] Test automatici eseguiti.
- [ ] Verifica manuale eseguita.
- [ ] Versione aggiornata.
- [ ] `README.md` aggiornato in italiano e inglese.
- [ ] `ISTRUZIONI.md` aggiornato.
- [ ] `INSTRUCTION.md` aggiornato.
- [ ] `SECURITY_MODEL.md` aggiornato in italiano e inglese.
- [ ] `AGENTS.md` aggiornato.
- [ ] `MAP.md` aggiornato.
- [ ] `PLAN.md` aggiornato.
- [ ] Commit finale creato.
- [ ] Pull request aperta verso `main`.
- [ ] CI verde.
- [ ] Merge su `main` completato.
- [ ] Tag versione creato.
- [ ] Release GitHub pubblicata con artifact Windows e macOS, quando prevista.
- [ ] Artifact scaricati e verificati, quando la release e' prevista.
- [ ] Branch milestone eliminato.
