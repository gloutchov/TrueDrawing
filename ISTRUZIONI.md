# Premessa

Non sono un esperto nella scrittura di codice. Per lo meno così mi vedo. Ma non sono neppure una persona che ha scoperto che chatGPT può fdare APP e subito ha avuto l'ambizione di fargli fare l'applicazione must have che tutti desiderano da una vita.
True Drawing nasce da un gioco che facevo da piccolo:
Lo sfidante fa un disegno, uno schizzo impreciso, al volo, in pochi minuti, e gli sfidati devono dire di che si tratta (Lo so, una volta ci divertivamo con poco!).

True Drawing fa proprio questo. L'utente fa uno schizzo, e l'app chiede alla AI di reinterpretare il disegno e creare una immagine 'bella da vedere'.

L'applicazione è stata interamente realizzata con assistenza AI. L'interfaccia è semplice, ha pochi tool di disegno, la gestione dei layer, undo e redo, e poche altre features. Funziona con mouse, tavolette grafiche, ogni tipo di sistema di puntamento. Più è impreciso, più è divertente il risultato.


E' perfetta?
Diciamo che funziona, e non mi pare abbia bug evidenti. Al momento il progetto viene mantenuto con build verificate localmente su macOS e Windows, così da allineare supporto dichiarato e supporto realmente verificato.
Un Dev professionista potrebbe trovarci molti difetti, e qualche vulnerabilità che mi è scappata. Lascio a loro l'onere e l'onore di sistemare ciò che i miei occhi imberbi non hanno scovato.
Rimane comunque, e sempre, una app realizzata in vibe-coding.

# True Drawing - Manuale Utente (IT)

> Questa app è stata realizzata in vibecoding con codex CLI. Attualmente è da intendersi come alpha funzionante. Potrebbe necessitare di ottimizzazione, pulizia di codice orfano, interventi di sicurezza, e molto altro ancora...

## Sommario

- Introduzione
- Come iniziare
- L'interfaccia
- Licenza

## Introduzione

True Drawing è un progetto sperimentale basato su un vecchio gioco, senza alcuna ambizione particolare.
Attualmente il progetto viene mantenuto e distribuito con pacchetti verificati localmente su macOS e su Windows.

### Lingua interfaccia

L'interfaccia di True Drawing è bilingue italiano/inglese. La lingua viene scelta automaticamente in base alle impostazioni di sistema (nel caso il computer sia impostato su una lingua differente dall'italiano, viene scelta automaticamente la lingua inglese). L'impostazione può essere svolta manualmente dalla finestra impostazioni.

## Come iniziare

Il sito ufficiale di True Drawing e' `https://truedrawing.glaucosilvestri.it/`.

### Download, firma e checksum

True Drawing è nato come programma personale ed e poi stato pubblicato come progetto open source con licenza Apache 2.0. Le build pubblicate non sono firmate con certificati Apple o Windows.

Questo significa che:

- su macOS puo comparire un avviso di Gatekeeper al primo avvio;
- su Windows puo comparire un avviso SmartScreen o "autore sconosciuto";
- il codice sorgente resta ispezionabile nel repository, ma i pacchetti scaricati non hanno una firma commerciale del sistema operativo.

E' quindi possibile che all'avvio il Sistema Operativo vi chieda il permesso a procedere nell'apertura dell'app.

_Nota:_ In caso abbiate dubbi, nel repository trovate i checksum dei programmi. Nell'area Tech di questo documento trovate le istruzioni per verificare che i files non siano stati compromessi.

### Verifica checksum SHA-256

La release pubblicata `v1.2.0` include i file `SHA256SUMS-windows.txt` e `SHA256SUMS-macos.txt`. Scaricare il file checksum corrispondente al proprio sistema operativo insieme al pacchetto dell'app.

Su Windows, dalla cartella dove si trova l'installer:

```powershell
Get-FileHash .\True-Drawing-1.2.0-Windows-x64.exe -Algorithm SHA256
```

Confrontare il valore `Hash` con la riga corrispondente in `SHA256SUMS-windows.txt`.

Su macOS, dalla cartella dove si trova il download:

```bash
shasum -a 256 True-Drawing-1.2.0-macOS-arm64.dmg
```

Confrontare il valore prodotto con la riga corrispondente in `SHA256SUMS-macos.txt`.

### Avvio di True Drawing

Sia su macOS. sia su Windows, è sufficiente fare doppioclick sull'icona del programma.

### Inserimento credenziali AI

Cliccare sul menù File.
Selezionare API Key.
Si apre una finestra in cui va inserita la API Key del modello AI (sono accettare API Key di OpenAI) e il modello di generazione di immagini che desiderate.
Salvate le API Key.

### Dare un nome al Disegno

Sopra al Canvas di disegno, è presente un campo dove inserire il nome del disegno. Scrivere un nome indicativo prima di iniziare. Quel nome sarà utilizzato per tutti i salvataggi automatici di sicurezza, e per il salvataggio del disegno definitivo.

### Creazione di un Disegno

Nella versione sorgente `1.7.0`, sul lato sinistro dello schermo sono presenti i tool principali. Dall'alto verso il basso:

- Manina per spostare la vista del canvas;
- Tool di selezione;
- Tool di disegno al tratto (matita, pennarello, pennello, gomma);
- Tool di disegno figure (quadrato/rettangolo, cerchio/ellisse, triangolo);
- Tool di riempimento (secchiello)
- Tipo di tratto (continuo, tratteggio, puntini).

Ognuno di questi tool offre alcuni setup che permettono di personalizzare ulteriormente il tratto. Questi setup sono differenti da tool a tool, e appaiono sotto ai pulsanti dei tool stessi. I più comuni sono:

- Colore di riempimento;
- Spessore tratto;
- Opacità tratto;
- Dimensione tratto.

L'attività di disegno è molto semplice. E' sufficiente selezionare il tool desiderato, e tracciare ciò che si vuole sul canvas bianco.

Per spostarsi su un canvas ingrandito, selezionare la manina e trascinare la parte visibile con mouse, penna o touch. Il trascinamento non cambia il disegno e non viene salvato nel progetto. Il reset dello zoom riporta anche la vista al centro.

Per cambiare le dimensioni del canvas, usare **Dimensioni canvas** nel pannello destro oppure `File > Impostazioni > Dimensioni canvas...`. Scegliere `px` o `cm`, indicare larghezza, altezza e risoluzione in DPI, poi premere **Applica**. La conversione usa 2,54 cm per pollice e arrotonda al pixel piu' vicino; il pannello mostra sempre la misura effettiva in pixel e centimetri. In `px`, cambiare DPI conserva i pixel e modifica la misura fisica; in `cm`, conserva i centimetri inseriti e ricalcola i pixel. I limiti configurati sono 64-4096 pixel per lato, 12 megapixel complessivi e 72-600 DPI. L'origine resta in alto a sinistra: i tratti non vengono scalati o cancellati quando il canvas si restringe, e possono riapparire ampliandolo. Undo/redo ripristina anche le dimensioni.

Il lucchetto tra larghezza e altezza e' inizialmente aperto. Cliccarlo per mantenere le proporzioni correnti: cambiando un lato si aggiorna l'altro, in pixel o in centimetri. Cliccarlo di nuovo per modificare i due lati separatamente. A destra si trovano, nell'ordine, **Inspector**, **Dimensioni canvas** e **Layer**. Ogni riquadro si comprime o si espande con la freccia all'estrema destra della sua intestazione; comprimere un riquadro non modifica il disegno.

Il Menù Edit offre alcune funzionalità aggiuntive utili:

- Annulla/Ripeti;
- Taglia/Copia/Incolla;
- Ritaglia.

Una volta disegnato lo schizzo, è sufficiente cliccare sul tastino con le frecce che si rincorrono per attivare la generazione dell'immagine da parte della AI.

Per salvare il disegno, e l'immagine generata dalla AI, è sufficiente andare sul menù File e cliccare su Salva.

### File di salvataggio

Per un disegno chiamato `nome`, l'app usera':

- `nome.tdraw` per il progetto True Drawing;
- `nome_canvas.png` per il canvas composito;
- `nome_image.png` per l'immagine realistica generata, quando presente.

Il progetto `.tdraw` conserva pixel e DPI; i progetti precedenti si aprono con il default 2048 × 2048 px a 300 DPI. Il sidecar canvas e l'export PNG/WebP usano esattamente i pixel correnti del canvas. La risoluzione DPI e' un dato del progetto per le conversioni nell'interfaccia; non aggiunge metadati DPI ai file immagine esportati.

## L'interfaccia

### Menù principale

Il menù principale offre quattro sottomenù:

- File;
- Modifica;
- Vista;
- Aiuto.

#### Menù File

Il menù File ha le seguenti opzioni

- Nuovo;
- Apri;
- Salva;
- Salva con Nome;
- Export Canvas (png, webp);
- Export immagine (png, webp);
- Impostazioni;
- Esci.

Il menù Impostazioni permette di modificare le dimensioni del canvas, la lingua del programma e il suo aspetto, di inserire la chiave API della AI, di scegliere la tipologia di immagine in uscita (realistica, cartoon, etc) e di impostare l'autogenerazione dell'immagine AI durante le pause dal disegno.

#### Menù Modifica

Il menù Modifica offre le funzionalità già descritte in precedenza, ovvero:

- Annulla/Ripeti;
- Taglia/Copia/Incolla;
- Ritaglia.

#### Menù Vista

Il menù vista permette di cambiare il fattore di zoom sul canvas (modificabile anche tramite pulsanti sul canvas stesso, o con la rotella del mouse), e di passare alla modalità a schermo intero.

#### Menù Aiuto

Il Menù aiuto contiene solamente l'opzione di visualizzare i dati fondamentali dell'applicazione.

### Menù di Disegno

Sul lato sinistro dello schermo è presente il menù contenente tutti i tool di disegno. Anche questo menù è già stato descritto nel capitolo precedente.

### Inspector

La finestra di inspector mostra un anteprima dell'immagine generata dalla AI. Al di sotto di quella immagine sono indicati tutti i parametri di configurazione della AI.

### Layer

La finestra Layer permette di costruire l'immagine su più livelli, di nascondere o mostrare ogni singolo livello, di cambiarlo di posizione, e di cambiarne l'opacità.

## Licenza

Questo progetto e distribuito sotto licenza Apache 2.0. Vedi [LICENSE](./LICENSE).

Sicurezza 1.3.0: immagini IPC/progetto limitate a 16 MiB; il download AI rifiuta indirizzi locali e redirect. Nelle impostazioni API key un avviso indica il fallback locale cifrato safeStorage, la cui protezione dipende dal sistema operativo.

## C15 - Brush avanzati e texture personalizzate (`1.4.0`)

Preset brush bilingui da configurazione: grafite, morbido, marker, inchiostro e texture; controlli pressione, velocita, spaziatura e texture procedurali. Parametri immutabili nei tratti e persistenti nei file tdraw. / Configurable bilingual brush presets, pressure/speed/spacing and procedural texture controls; per-stroke parameters persist in tdraw.

## C16 - Import immagini di riferimento (`1.5.0`)

Import locale PNG/JPEG/WebP da dialogo nativo controllato, normalizzazione PNG e limiti bytes/pixel. Riferimenti embedded separati con visibilita, opacita, posizione e scala: esclusi da export e AI. Caricamento immagini prima del rendering dopo riapertura. / Local dialog-controlled imports; embedded references with visibility, opacity, position and scale, excluded from exports and AI.

Dal pannello Riferimenti scegliere **Importa riferimento** e un file PNG, JPEG o WebP locale (massimo 4 MiB e limiti pixel della configurazione). I controlli X/Y spostano l'immagine; la larghezza conserva le proporzioni. Visibilita e opacita non cambiano gli strumenti di disegno. Si possono conservare fino a quattro riferimenti embedded nel progetto: il file originale non serve per riaprirli. Undo/redo ripristina le modifiche. I riferimenti restano esclusi da canvas esportato, sidecar e generazione AI, anche con redraw automatico. Rimuovi riferimento richiede conferma.

Patch `1.5.1`: WebP decodificato dal canvas Chromium dopo verifica RIFF/dimensioni nel main e normalizzato a PNG, perche nativeImage non supporta questo formato. / WebP is decoded by Chromium Canvas after RIFF/dimension checks in main and normalized to PNG, because nativeImage does not support this format. 87 test, lint/build e smoke import WebP chiaro/scuro.

## C17 - Maschere e clipping layer (`1.6.0`)

Maschere non distruttive con editor, attivazione e rimozione; clipping con identita layer stabili, controllo cicli e pulizia relazioni alla cancellazione. Rendering condiviso per canvas/export/AI, undo/redo e persistenza tdraw. / Non-destructive editable masks, stable layer clipping with cycle validation, shared rendering, undo/redo and persistence.

Nel pannello Maschere e clipping selezionare **Crea maschera**, quindi **Modifica maschera**. La maschera iniziale rivela tutto: la gomma nasconde, matita/pennello ripristinano la visibilita. Disattivare Modifica maschera per tornare ai tratti del layer. La checkbox Maschera attiva applica/disattiva l'effetto senza perdere i tratti; Rimuovi maschera richiede conferma. **Clipping su layer** usa l'alpha di un altro layer, includendone maschera, opacita e visibilita. I target restano associati dopo riordino; target ciclici sono disabilitati e cancellare il target rimuove la relazione. Effetti, export e generazione condividono lo stesso rendering; tutto persiste e si ripristina con undo/redo.

## C18 - Storia versioni del documento (`1.7.0`)

Snapshot persistenti manuali/automatici, consultazione, rinomina, ripristino e cancellazione; capsule senza ricorsione e limiti numero/byte da configurazione. Ripristino completo di canvas, layer, maschere, riferimenti e immagine AI; versioni conservate in tdraw e autosave, Undo ripristina lo stato precedente. / Persistent bounded document versions with complete restoration and non-recursive capsules.

Il pannello **Versioni documento** crea snapshot con un nome, rinominabili e ripristinabili. Uno snapshot contiene canvas, layer, maschere, riferimenti e immagine realistica; le versioni non contengono altre versioni. Ripristino e cancellazione richiedono conferma; dopo ripristino Undo recupera lo stato precedente. Salvare il progetto per conservare le versioni, che sono incluse anche in autosave/recovery. Undo/Redo resta una cronologia operativa in memoria e non viene ricostruita alla riapertura.

**Versioni automatiche** e' una preferenza locale disattivata per default. Se attiva, registra ogni cinque minuti solo contenuto cambiato rispetto all'ultima versione. Limiti `snapshots` da configurazione: 20 versioni, 8 MiB per contenuto, 32 MiB complessivi e nome di 80 caratteri; vale anche il limite totale progetto. Al raggiungimento dei limiti la creazione si arresta senza eliminare versioni precedenti: rimuovere versioni inutili o modificare la configurazione. Non e' un backup esterno: perdere il file tdraw significa perdere le sue versioni.
