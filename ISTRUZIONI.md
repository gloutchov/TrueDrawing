# True Drawing - Istruzioni utente

Versione: `0.5.0`

True Drawing e' in fase iniziale. In questa versione e' disponibile lo skeleton desktop con canvas interattivo, strumenti di tratto, layer, inspector realistico e undo/redo: l'app Electron mostra la finestra principale, carica la configurazione centrale e permette di disegnare sul canvas con input compatibili con Pointer Events.

## Uso previsto dell'app

Quando le milestone applicative successive saranno implementate, l'utente potra':

- creare un nuovo disegno e assegnargli un nome;
- disegnare sul canvas con mouse, tavoletta o input compatibili;
- scegliere matita, pennarello, pennello o gomma;
- cambiare colore, dimensione tratto, opacita' e hardness;
- annullare e ripristinare tratti con i pulsanti toolbar o con `Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z` e `Ctrl/Cmd+Y`;
- creare, rinominare, selezionare, nascondere, riordinare e regolare l'opacita' dei layer;
- inserire o rimuovere la API key OpenAI dal menu `File > API Key...`;
- generare un'immagine realistica nell'inspector dal canvas corrente;
- passare fra canvas e immagine realistica con doppio click sull'inspector;
- salvare automaticamente e manualmente canvas e immagine.

## File di salvataggio previsti

Per un disegno chiamato `nome`, l'app usera':

- `nome_canvas` per il disegno sorgente;
- `nome_image` per l'immagine realistica generata.

## Configurazione prevista

Il file `config/app.config.json` contiene parametri modificabili da utenti skilled, come autosave, dimensioni canvas, default strumenti, provider API e modello immagini.

In questa versione sono configurabili anche parametri di input canvas come distanza minima fra punti, smoothing del tratto, pressione predefinita, fattori di dimensione legati alla pressione, range dei controlli, preset degli strumenti, default layer, prefisso nomi layer, limite layer e range opacita' layer.

La API key non deve essere inserita in quel file: viene inserita dall'app tramite il menu `File > API Key...` e salvata in storage cifrato locale tramite il processo main Electron.

## Avvio in sviluppo

Per avviare la versione di sviluppo:

- installare Node.js 22;
- eseguire `npm ci --no-audit --no-fund`;
- eseguire `npm run dev`.

Per produrre una build locale:

- eseguire `npm run build`.
