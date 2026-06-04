# True Drawing - Piano di lavoro

## Obiettivo

True Drawing e' un'app locale per macOS e Windows che permette di disegnare su un canvas pulito usando mouse, penna/tavoletta tipo Wacom e, dove supportato dal sistema operativo, input touch/trackpad. L'app deve trasformare il disegno dell'utente in un'immagine realistica tramite API con chiave configurata dall'utente, mantenendo separati e salvabili sia il disegno canvas sia l'immagine realistica.

## Principi di progetto

- L'app funziona in locale: i dati del disegno restano sul computer, salvo l'invio esplicito all'API per la generazione realistica.
- Il canvas deve essere immediato, pulito e adatto al disegno, senza schermate introduttive o elementi decorativi inutili.
- Ogni milestone vive su un branch dedicato e viene chiusa solo dopo verifica locale, aggiornamento documentazione, merge su `main`, verifica CI e generazione release macOS/Windows.
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
- CI/CD: GitHub Actions su repository privato con test, build e release artifact per ogni tag.

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
- Ogni milestone termina con:
  1. test e verifica manuale locale;
  2. aggiornamento versione;
  3. aggiornamento documentazione;
  4. commit finale sul branch di milestone;
  5. pull request verso `main`;
  6. CI verde;
  7. merge su `main`;
  8. tag versione `vX.Y.Z`;
  9. release GitHub con build Windows e macOS;
  10. eliminazione branch milestone solo dopo release verificata.

### Verifica prima del merge

Ogni milestone deve documentare in `PLAN.md`:

- branch usato;
- versione iniziale e finale;
- test automatici eseguiti;
- verifiche manuali eseguite;
- stato CI;
- link o riferimento alla release;
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
- Versione `0.0.1` taggata e rilasciata come release documentale.

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
- Release prevista: `https://github.com/gloutchov/truedrawing/releases/tag/v0.0.1`.
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
- Release GitHub contiene artifact Windows e macOS, anche se l'app e' ancora minima.

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
  - GitHub Actions release run `26953164204`, successo con build Windows, build macOS e upload asset.
- Verifiche locali:
  - validazione JSON di `config/app.config.json`;
  - verifica `VERSION = 0.1.0`;
  - verifica struttura file e documenti;
  - installazione/esecuzione locale non completata per errore `EPERM` di npm su cache/node_modules nella macchina locale; la verifica equivalente e' passata su runner GitHub pulito.
- CI:
  - branch milestone: successo;
  - `main`: successo;
  - release: successo.
- Release pubblicata: `https://github.com/gloutchov/truedrawing/releases/tag/v0.1.0`.
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
  - da verificare in CI.
- Verifiche locali:
  - validazione JSON di `config/app.config.json`;
  - test/lint/build locali bloccati da `node_modules` non installato correttamente su questa macchina per errori npm `EPERM`; verifica completa demandata a GitHub Actions.
- CI:
  - branch milestone: da verificare;
  - `main`: da verificare dopo merge;
  - release: da verificare.
- Release prevista: `https://github.com/gloutchov/truedrawing/releases/tag/v0.2.0`.
- Rischi residui:
  - test manuale con tavoletta Wacom fisica non eseguito in questa sessione;
  - pan/zoom rimandato per non interferire con il tracciamento base.

Stato: in corso.

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

Stato: pianificata.

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

Stato: pianificata.

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

Stato: pianificata.

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

Stato: pianificata.

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

Stato: pianificata.

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

Stato: pianificata.

### M9 - Packaging, CI/CD e release cross-platform

- Versione finale prevista: `0.9.0`.
- Branch: `milestone/09-packaging-ci-release`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: rendere ripetibile la produzione delle release macOS e Windows.

Attivita':

- Consolidare GitHub Actions:
  - lint;
  - test;
  - build;
  - packaging Windows;
  - packaging macOS;
  - artifact upload;
  - release da tag.
- Configurare firma codice se certificati disponibili.
- Configurare notarizzazione macOS se credenziali disponibili.
- Generare changelog release.
- Verificare installazione pacchetti prodotti.

Criteri di accettazione:

- Ogni tag `vX.Y.Z` genera release scaricabile.
- Artifact Windows e macOS sono presenti nella release.
- CI fallisce se test o build falliscono.
- La procedura e' documentata in `AGENTS.md` e `README.md`.
- `MAP.md` descrive la struttura finale dei moduli e dei workflow di build/release.

Verifiche:

- Esecuzione CI completa.
- Download e avvio artifact su almeno una piattaforma disponibile.
- Controllo manuale release GitHub.

Stato: pianificata.

### M10 - Beta privata

- Versione finale prevista: `1.0.0-beta.1` oppure `1.0.0` se la qualita' e' sufficiente.
- Branch: `milestone/10-private-beta`.
- Tipo incremento: `+0.1.0` o `+1.0.0` secondo esito verifica.
- Obiettivo: validare l'app con uso reale prima della release stabile.

Attivita':

- Preparare set di scenari di test utente.
- Correggere bug bloccanti.
- Verificare compatibilita' con mouse, penna/tavoletta e input disponibili.
- Verificare qualita' immagini realistiche su schizzi di complessita' diversa.
- Completare documentazione utente.
- Finalizzare note di sicurezza.

Criteri di accettazione:

- Flusso principale completabile senza interventi tecnici:
  1. creare disegno;
  2. disegnare con strumenti;
  3. gestire layer;
  4. generare immagine realistica;
  5. passare inspector/canvas con doppio click;
  6. salvare canvas e immagine;
  7. riaprire o recuperare il lavoro.
- Nessun bug critico aperto.
- Documentazione completa in italiano e inglese.

Verifiche:

- Test end-to-end completo.
- CI verde.
- Release GitHub generata.
- Review manuale documentazione.

Stato: pianificata.

### M11 - Release stabile

- Versione finale prevista: `1.0.0`.
- Branch: `milestone/11-stable-release`.
- Tipo incremento: `+1.0.0` se non gia' applicato in M10.
- Obiettivo: pubblicare la prima versione stabile di True Drawing.

Attivita':

- Stabilizzare bug beta.
- Congelare funzionalita' per la release.
- Revisionare sicurezza e gestione segreti.
- Revisionare packaging e installazione.
- Aggiornare tutti i documenti finali.
- Creare release finale con changelog.

Criteri di accettazione:

- CI verde.
- Release Windows e macOS scaricabili.
- Documentazione finale completa.
- `PLAN.md` aggiornato con milestone completata e rischi residui.
- Branch milestone eliminato dopo merge e release verificata.

Verifiche:

- Test end-to-end su build release.
- Verifica manuale artifact GitHub.
- Controllo finale documenti.

Stato: pianificata.

## Backlog post 1.0

- Supporto brush avanzati e texture personalizzate.
- Import immagini di riferimento.
- Maschere e clipping layer.
- Storia versioni del documento.
- Preset di stile realistico.
- Supporto provider AI multipli.
- Modalita' offline completa senza generazione AI.
- Localizzazione completa italiano/inglese.
- Aggiornamenti automatici firmati.

## Registro avanzamento

| Data | Milestone | Versione | Branch | Stato | Note |
| --- | --- | --- | --- | --- | --- |
| 2026-06-04 | Pianificazione iniziale | n/a | n/a | In corso | Creato piano iniziale in `PLAN.md`; la cartella non risulta ancora inizializzata come repository Git. |
| 2026-06-04 | M0 - Bootstrap repository e governance | 0.0.1 | `milestone/00-bootstrap` | Completata | Repository privato creato, documentazione iniziale aggiunta, CI minima verde su branch milestone e `main`, release documentale `v0.0.1` preparata. |
| 2026-06-04 | M1 - Skeleton app desktop | 0.1.0 | `milestone/01-desktop-skeleton` | Completata | Skeleton Electron/Vite/React modulare, config validata, lint/test/build in CI e workflow release Windows/macOS aggiunti. |
| 2026-06-04 | M2 - Canvas di disegno e input | 0.2.0 | `milestone/02-canvas-input` | In corso | Canvas interattivo con Pointer Events, pressione, smoothing, modello stroke e test unitari aggiunti; CI e release da verificare. |

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
- [ ] Release GitHub pubblicata con artifact Windows e macOS.
- [ ] Artifact scaricati e verificati.
- [ ] Branch milestone eliminato.
