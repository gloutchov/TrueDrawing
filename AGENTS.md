# True Drawing - Direttive per lo sviluppo

Questo file definisce le regole operative da seguire durante lo sviluppo di True Drawing. Deve essere aggiornato alla conclusione di ogni milestone.

## Stato corrente

- Ultima milestone completata: M8 - Esperienza utente completa e rifinitura app.
- Patch corrente in sviluppo: preferenze interfaccia bilingue e tema chiaro/scuro.
- Versione corrente: `0.8.2`.
- Branch corrente: `feature/ui-language-theme-preferences`.
- Ultimo branch milestone: `milestone/08-ux-polish`, mergiato su `main` tramite PR #5.
- CI M8: PR #5 verde con GitHub Actions run `27269984715`; verifica locale `npm run lint`, `npm run test` e `npm run build` verde.
- Release GitHub M8: non prevista automaticamente; `v0.4.0` resta l'unica release pubblicata con artifact Windows/macOS.
- Firma release: non sono disponibili credenziali o certificati per firmare Windows o macOS; le release saranno distribuite non firmate via GitHub e la documentazione deve indicare gli avvisi di sicurezza attesi dei sistemi operativi.

## Regole generali

- Sviluppare sempre su un branch dedicato alla milestone: `milestone/<numero>-<slug>`.
- Non fare merge su `main` finche' implementazione, test, documentazione e CI non sono verificati.
- Non eliminare il branch milestone prima che la release GitHub sia stata generata e controllata, quando la release e' prevista.
- Per risparmiare credito GitHub Actions, non generare release GitHub automatiche per ogni milestone intermedia: produrre release Windows/macOS solo quando esplicitamente richiesto o quando il piano indica una versione beta/stabile quasi definitiva.
- Non configurare firma codice Windows, firma macOS o notarizzazione finche' non saranno disponibili credenziali esplicite; produrre artifact non firmati e documentare SmartScreen/Gatekeeper nelle istruzioni utente.
- Aggiornare la versione alla chiusura di ogni milestone secondo `PLAN.md`.
- Mantenere aggiornati `README.md`, `ISTRUZIONI.md`, `INSTRUCTION.md`, `SECURITY_MODEL.md`, `MAP.md`, `AGENTS.md` e `PLAN.md`.

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
- Modello immagini OpenAI predefinito: `gpt-image-1.5`.
- L'utente deve poter modificare il modello immagini dalle impostazioni.

## Sicurezza

- Non salvare API key in chiaro nel repository, nei log, nei file di progetto o nei crash report.
- Salvare la API key nel keychain del sistema operativo.
- Il modello immagini scelto dall'utente e' una preferenza non segreta; la API key resta un segreto.
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
- verificare CI;
- generare e controllare release Windows e macOS quando previsto.
