# True Drawing - Istruzioni utente

Versione: `0.1.0`

True Drawing e' in fase iniziale. In questa versione e' disponibile lo skeleton desktop: l'app Electron mostra la finestra principale, carica la configurazione centrale e presenta la struttura UI iniziale con canvas, strumenti, inspector e layer.

## Uso previsto dell'app

Quando le milestone applicative successive saranno implementate, l'utente potra':

- creare un nuovo disegno e assegnargli un nome;
- disegnare sul canvas con mouse, tavoletta o input compatibili;
- scegliere strumento, colore, dimensione tratto e opacita';
- usare layer;
- annullare e ripristinare azioni;
- configurare API key, provider e modello immagini;
- generare un'immagine realistica nell'inspector;
- passare fra canvas e immagine realistica con doppio click sull'inspector;
- salvare automaticamente e manualmente canvas e immagine.

## File di salvataggio previsti

Per un disegno chiamato `nome`, l'app usera':

- `nome_canvas` per il disegno sorgente;
- `nome_image` per l'immagine realistica generata.

## Configurazione prevista

Il file `config/app.config.json` contiene parametri modificabili da utenti skilled, come autosave, dimensioni canvas, default strumenti, provider API e modello immagini.

La API key non deve essere inserita in quel file: sara' salvata nel keychain del sistema operativo tramite le impostazioni dell'app.

## Avvio in sviluppo

Per avviare la versione di sviluppo:

- installare Node.js 22;
- eseguire `npm ci --no-audit --no-fund`;
- eseguire `npm run dev`.

Per produrre una build locale:

- eseguire `npm run build`.
