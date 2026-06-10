# True Drawing - Istruzioni utente

Versione: `0.8.0`

True Drawing e' in fase iniziale. In questa versione sono disponibili canvas interattivo, strumenti di tratto, layer, inspector realistico, generazione OpenAI, gestione sicura della API key, preferenze del modello/stile immagini, redraw automatico, salvataggio manuale, autosave, recupero, export e rifiniture UX per stato applicazione, conferme e accessibilita' base.

## Uso previsto dell'app

Quando le milestone applicative successive saranno implementate, l'utente potra':

- creare un nuovo disegno e assegnargli un nome;
- disegnare sul canvas con mouse, tavoletta o input compatibili;
- scegliere matita, pennarello, pennello o gomma;
- scegliere linea retta o linea curva;
- disegnare rettangolo, ellisse, triangolo o poligono;
- usare il riempimento per colorare un'area delimitata dai confini gia' disegnati nel layer;
- selezionare un'area rettangolare del canvas per usare cut, copy e paste;
- scegliere tratto continuo, tratteggiato o a puntini;
- cambiare colore, dimensione tratto, opacita' e hardness;
- usare `+`, `-`, reset o rotella del mouse per lo zoom del canvas;
- mantenere lo zoom canvas persistente fra riavvii dell'app;
- leggere nella status bar stato salvataggio, modifiche, tool, layer attivo, conteggio layer/tratti e zoom;
- uscire dal fullscreen con il pulsante visibile nella barra superiore;
- usare `Edit > Undo/Redo` per la history del disegno quando il focus non e' in un campo testo;
- usare `Edit > Copy/Cut/Paste` o `Ctrl/Cmd+X`, `Ctrl/Cmd+C`, `Ctrl/Cmd+V` sulla selezione canvas quando il focus non e' in un campo testo;
- spostare l'immagine appena incollata finche' resta selezionata;
- annullare e ripristinare tratti con i pulsanti toolbar o con `Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z` e `Ctrl/Cmd+Y`;
- creare, rinominare, selezionare, nascondere, riordinare e regolare l'opacita' dei layer;
- ricevere conferme prima di eliminare un layer, rimuovere la API key o scartare un autosave;
- inserire o rimuovere la API key OpenAI dal menu `File > API Key...`;
- scrivere il modello immagini OpenAI dalla stessa finestra impostazioni;
- scegliere lo stile immagine dal menu `File > Stile...`, usando gli stili predefiniti o un valore personalizzato;
- attivare il redraw automatico dell'inspector dal menu `File > Redraw automatico...`;
- generare un'immagine realistica nell'inspector dal canvas corrente;
- vedere stati inspector chiari quando manca la API key, l'immagine non e' ancora generata, la generazione e' in corso o si verifica un errore;
- passare fra canvas e immagine realistica con doppio click sull'inspector;
- salvare manualmente il progetto `.tdraw`;
- autosalvare il progetto, il canvas e l'immagine realistica;
- recuperare l'ultimo autosave disponibile;
- esportare canvas e immagine realistica in PNG o WebP.

## File di salvataggio

Per un disegno chiamato `nome`, l'app usera':

- `nome.tdraw` per il progetto True Drawing;
- `nome_canvas.png` per il canvas composito;
- `nome_image.png` per l'immagine realistica generata, quando presente.

## Installazione da GitHub

Le build Windows e macOS pubblicate su GitHub sono non firmate: non sono disponibili certificati o credenziali per firma codice Windows, firma macOS o notarizzazione Apple. Windows SmartScreen e macOS Gatekeeper possono mostrare avvisi di sicurezza quando l'app viene avviata per la prima volta.

## Configurazione prevista

Il file `config/app.config.json` contiene parametri modificabili da utenti skilled, come autosave, dimensioni canvas, default strumenti, provider API e modello immagini.

In questa versione sono configurabili anche parametri di input canvas come distanza minima fra punti, smoothing del tratto, pressione predefinita, fattori di dimensione legati alla pressione, range dei controlli, preset degli strumenti, default layer, prefisso nomi layer, limite layer, range opacita' layer, modelli immagini suggeriti, stili immagine suggeriti, default/range redraw automatico, margine di export inviato alla generazione, nome progetto predefinito, directory autosave, suffissi file ed estensioni export.

La API key non deve essere inserita in quel file: viene inserita dall'app tramite il menu `File > API Key...` e salvata dal processo main nel Windows Credential Manager su Windows, nel macOS Keychain su macOS o in fallback locale cifrato negli ambienti non supportati.

## Avvio in sviluppo

Per avviare la versione di sviluppo:

- installare Node.js 22;
- eseguire `npm ci --no-audit --no-fund`;
- eseguire `npm run dev`.

Per produrre una build locale:

- eseguire `npm run build`.
