# True Drawing — Manuale utente

True Drawing nasce da un gioco: fare uno schizzo veloce e lasciare che qualcuno lo interpreti. Qui puoi disegnare sul tuo computer e chiedere a OpenAI di trasformare lo schizzo in un'immagine. Non serve un disegno perfetto: anche poche linee possono essere un buon punto di partenza.

[English manual](INSTRUCTIONS.md) · [Presentazione del progetto](README.md) · [Sito ufficiale](https://truedrawing.glaucosilvestri.it/)

## Sommario

- [Installazione e primo avvio](#installazione-e-primo-avvio)
- [Il primo disegno](#il-primo-disegno)
- [Interfaccia e preferenze](#interfaccia-e-preferenze)
- [Strumenti standard](#strumenti-standard)
- [Selezione, appunti e ritaglio](#selezione-appunti-e-ritaglio)
- [Zoom e manina](#zoom-e-manina)
- [Brush avanzati e texture](#brush-avanzati-e-texture)
- [Riferimenti](#riferimenti)
- [Dimensioni canvas](#dimensioni-canvas)
- [Layer](#layer)
- [Clipping su layer](#clipping-su-layer)
- [Versioni documento](#versioni-documento)
- [Inspector e generazione AI](#inspector-e-generazione-ai)
- [Salvare, aprire ed esportare](#salvare-aprire-ed-esportare)
- [Salvataggio automatico e recupero](#salvataggio-automatico-e-recupero)
- [Scorciatoie](#scorciatoie)
- [Risoluzione dei problemi](#risoluzione-dei-problemi)
- [Privacy e limiti](#privacy-e-limiti)

## Installazione e primo avvio

Scarica il pacchetto adatto al tuo computer dalla pagina [GitHub Releases](https://github.com/gloutchov/TrueDrawing/releases/latest). Controlla sistema operativo e architettura nelle note e nei nomi degli asset: sono disponibili pacchetti Windows x64 e macOS Apple Silicon (arm64).

Su Windows avvia l'installer `.exe` e segui la procedura di installazione. Su macOS apri il `.dmg` e copia True Drawing in Applicazioni, oppure estrai il pacchetto `.zip`. Avvia l'app dalla sua icona. Per disegnare basta un mouse, un trackpad o una penna compatibile; per generare immagini servono connessione Internet, una API key OpenAI e accesso a un modello immagini.

### Firma e verifica del download

I pacchetti distribuiti non sono firmati o notarizzati: Windows può mostrare SmartScreen o «autore sconosciuto», macOS un avviso Gatekeeper. Verifica provenienza e checksum prima di decidere se aprire il pacchetto. Se il sistema continua a impedirne l'apertura, usa le indicazioni ufficiali del sistema operativo per le app provenienti da sviluppatori non identificati.

Scarica anche `SHA256SUMS-windows.txt` o `SHA256SUMS-macos.txt` dalla stessa release. Nella cartella del download, calcola l'hash del file sostituendo il nome di esempio con quello effettivo:

```powershell
# Windows
Get-FileHash .\nome-del-pacchetto.exe -Algorithm SHA256
```

```bash
# macOS
shasum -a 256 nome-del-pacchetto.dmg
```

Confronta il risultato con la riga di quel file nel documento checksum. Se non coincide, non usare quel download. Il checksum verifica l'integrità rispetto agli asset pubblicati; non sostituisce la firma del produttore.

Per aggiornare, salva i progetti e una copia di sicurezza, chiudi l'app e installa il nuovo pacchetto da GitHub Releases. Non è presente un aggiornamento automatico firmato. Per disinstallare usa le impostazioni delle app di Windows o rimuovi l'app da Applicazioni su macOS; conserva separatamente i tuoi `.tdraw`, che restano nelle cartelle scelte da te.

## Il primo disegno

1. Avvia True Drawing. Non occorre configurare OpenAI per disegnare, salvare o esportare il canvas.
2. Scrivi un nome nel campo sopra il canvas, per esempio «Paesaggio».
3. Nella barra sinistra scegli la matita dal gruppo degli strumenti di tratto. Imposta colore e dimensione, poi trascina sul foglio bianco.
4. Usa **Undo** nella barra sinistra, oppure **Modifica > Annulla**, se vuoi correggere l'ultimo passaggio.
5. Scegli **File > Salva**. Scegli la cartella nel dialogo del sistema; se il progetto ha ancora il nome predefinito, l'app ti chiede prima di assegnargli un nome.
6. Per ottenere un'immagine da condividere scegli **File > Esporta canvas PNG**.

Se vuoi reinterpretare lo schizzo con AI, segui [Inspector e generazione AI](#inspector-e-generazione-ai). Puoi aggiungere dettagli sullo schizzo e generare di nuovo; conserva un risultato importante salvando il progetto o esportando l'immagine.

## Interfaccia e preferenze

Al centro c'è il canvas; a sinistra gli strumenti e i controlli del tratto. In alto trovi il nome del progetto; in basso informazioni sul documento e messaggi delle operazioni.

La colonna destra contiene, dall'alto verso il basso:

| Pannello | A cosa serve |
| --- | --- |
| Inspector | Anteprima dell'immagine AI, generazione e stato delle impostazioni. |
| Riferimenti | Immagini guida da usare mentre disegni. |
| Dimensioni canvas | Larghezza, altezza, unità e DPI del foglio. |
| Versioni documento | Salvare e recuperare stati del disegno. |
| Brush avanzati | Preset, texture e risposta del pennello. |
| Layer | Organizzare i tratti su livelli separati. |
| Clipping su layer | Limitare la visibilità di un livello alla forma di un altro. |

La freccia a destra del titolo comprime o espande ogni pannello senza alterare il disegno. Scorri la colonna per raggiungere quelli più in basso. I pulsanti e i campi sono raggiungibili con Tab; i pulsanti si attivano anche con Invio o Spazio.

In **File > Impostazioni > Interfaccia...** scegli lingua e tema. La modalità di sistema usa l'italiano su sistemi italiani, altrimenti l'inglese, e segue il tema chiaro/scuro del computer. Puoi forzare italiano, inglese, chiaro o scuro; le preferenze vengono conservate. I nomi scritti da te non vengono tradotti. Alcuni tooltip degli strumenti e il dialogo di recupero usano ancora etichette inglesi.

## Strumenti standard

Fai clic sui gruppi della barra sinistra per aprire l'elenco e scegliere uno strumento. L'icona del gruppo mostra l'ultimo strumento scelto; i tooltip aiutano a riconoscere le opzioni.

| Strumento | Uso |
| --- | --- |
| Matita (`Pencil`), pennarello, pennello | Tieni premuto e trascina per disegnare a mano libera. |
| Gomma (`Eraser`) | Trascina per cancellare sul layer attivo. |
| Linea retta, linea curva | Trascina dal punto iniziale a quello finale. La curva usa una curvatura predefinita. |
| Rettangolo, ellisse, triangolo, poligono | Trascina per definire la forma; il poligono è un pentagono regolare. Le forme disegnano il contorno. |
| Riempimento | Scegli un colore e fai clic nell'area da riempire. |

Sotto gli strumenti trovi il colore e tre slider: **S** per dimensione/spessore, **O** per opacità, **H** per durezza del bordo. Il riepilogo mostra pixel e percentuale di opacità. Il gruppo del tipo di tratto offre continuo, tratteggiato e puntinato; alcuni effetti dipendono dallo strumento scelto. La gomma non usa il selettore colore.

Il disegno va sempre sul layer attivo. Le nuove regolazioni si applicano ai tratti successivi: non modificano quelli già disegnati. Una penna può trasmettere pressione; con il mouse viene usato un valore predefinito.

## Selezione, appunti e ritaglio

Scegli lo strumento di selezione e trascina un rettangolo sul canvas. Poi usa **Modifica**:

- **Copia** copia l'immagine composita dell'area selezionata, senza i riferimenti.
- **Taglia** copia la stessa area e la cancella sul layer attivo. Gli altri layer restano nel composito: un'area può quindi continuare a mostrare contenuto.
- **Incolla** inserisce l'immagine degli appunti sul layer attivo. Se c'è una selezione, l'immagine viene adattata a quel rettangolo; altrimenti viene centrata. Subito dopo puoi trascinare la selezione per spostare l'immagine incollata. La selezione non è un editor generale degli oggetti già disegnati.
- **Ritaglia**, dopo conferma, pulisce l'esterno della selezione su tutti i layer. Mantiene le dimensioni del canvas; per cambiarle usa Dimensioni canvas. Puoi annullare l'operazione.

Quando il cursore è in un campo di testo, Taglia/Copia/Incolla lavorano sul testo. Per incollare sul disegno porta prima il focus sul canvas. Una stringa o un percorso di file negli appunti non equivale a un'immagine.

## Zoom e manina

Usa i controlli di zoom della vista o **Vista > Aumenta zoom canvas / Riduci zoom canvas**. Lo zoom modifica solo la visualizzazione, non i pixel del progetto.

Scegli la **manina** e trascina per spostare la vista di un canvas ingrandito. Il movimento non cambia i tratti e non viene salvato nel progetto. **Vista > Reset zoom canvas** ripristina lo zoom e centra di nuovo la vista. **Vista > Schermo intero** lascia più spazio al disegno.

## Brush avanzati e texture

1. Espandi **Brush avanzati** e scegli un **Preset brush**: Matita grafite, Pennello morbido, Marker, Inchiostro o Texture.
2. Scegli la texture: Nessuna, Grana, Punti o Tratteggio.
3. Prova un tratto e regola gli slider. Per tornare al disegno standard scegli il preset classico.

| Controllo | Effetto sui nuovi tratti |
| --- | --- |
| Spaziatura | Distanza tra le impronte che compongono il tratto. |
| Pressione dimensione | Quanto la pressione della penna cambia lo spessore. |
| Pressione opacità | Quanto la pressione cambia la trasparenza. |
| Velocità dimensione | Quanto un movimento rapido assottiglia il tratto. |
| Intensità texture | Evidenza della grana o del motivo. |
| Scala texture | Dimensione del motivo della texture. |

Texture e slider compaiono quando è selezionato un preset avanzato. Puoi continuare a regolare colore, S/O/H nella barra sinistra. Il preset applica anche lo strumento e i suoi valori iniziali; i tratti conservano i parametri con cui sono stati creati, anche dopo salvataggio e riapertura.

## Riferimenti

**Importa riferimento** apre un dialogo per scegliere un'immagine locale PNG, JPEG o WebP. L'immagine viene mostrata sul canvas come guida, separata dai layer del disegno.

Per ogni riferimento puoi cambiare visibilità, opacità, posizione **X/Y** e **Larghezza**, oppure eliminarlo. La larghezza mantiene le proporzioni; X e Y sono coordinate in pixel del canvas. Riduci l'opacità per ricalcare più comodamente. Nasconderlo non lo elimina.

Con le impostazioni predefinite puoi usare fino a quattro riferimenti, ciascuno fino a 4 MiB, soggetti anche a controlli sulle dimensioni dell'immagine. Non sono collegamenti al file originale: vengono incorporati nel `.tdraw`, quindi restano disponibili quando riapri il progetto. Non compaiono negli export, nei PNG di salvataggio o nell'immagine inviata all'AI.

## Dimensioni canvas

Usa il pannello **Dimensioni canvas** oppure **File > Impostazioni > Dimensioni canvas...**. Scegli **px** o **cm**, imposta larghezza, altezza e DPI, poi premi **Applica**. Il lucchetto permette di mantenere il rapporto fra i lati; quando è aperto puoi modificarli separatamente.

Il foglio iniziale misura 2048 × 2048 px a 300 DPI. I limiti predefiniti sono 64–4096 px per lato, 12 megapixel complessivi e 72–600 DPI. Il pannello segnala valori non validi.

In pixel, cambiare DPI mantiene i pixel e cambia la misura fisica. In centimetri, mantiene le misure inserite e ricalcola i pixel, arrotondando alla dimensione effettiva. La conversione usa 2,54 cm per pollice.

Ridimensionare il canvas non scala né elimina i tratti: l'origine rimane in alto a sinistra e il contenuto oltre il bordo può riapparire ampliando il foglio. **Annulla/Ripristina** recuperano anche le dimensioni precedenti. Gli export usano i pixel del canvas; il DPI serve alle conversioni nel progetto e non aggiunge metadati DPI ai PNG/WebP esportati.

## Layer

I layer sono fogli trasparenti sovrapposti. Separa, per esempio, sfondo, contorni e colore per lavorare su una parte senza cancellare le altre.

Nel pannello **Layer**, usa il pulsante di aggiunta, poi fai clic sulla riga del livello su cui vuoi disegnare. Modifica il nome nel suo campo, usa l'occhio per mostrarlo/nasconderlo e lo slider per l'opacità. Le frecce cambiano l'ordine di sovrapposizione: i livelli in alto nella lista coprono quelli sotto. Il pulsante di eliminazione rimuove il livello; resta sempre almeno un layer.

La gomma agisce sul layer attivo. Un layer nascosto o molto trasparente può far sembrare che non stai disegnando. Riordino, visibilità e opacità si riflettono nel canvas, negli export e nel disegno usato per l'AI. Queste operazioni possono essere annullate.

## Clipping su layer

Il clipping usa il contenuto di un layer come uno stencil: i tratti del layer attivo restano visibili solo dove il layer scelto contiene pixel visibili. Non cancella le parti esterne, quindi puoi cambiarne il riferimento o disattivarlo in seguito.

### Esempio: colorare dentro un cerchio

1. Rinomina un layer **Base**. Disegna il contorno di un cerchio con l'ellisse e riempine l'interno con il secchiello, così che contenga una forma piena.
2. Aggiungi un altro layer, chiamalo **Colore** e selezionalo.
3. Disegna tratti colorati anche oltre il bordo del cerchio.
4. Nel pannello **Clipping su layer** scegli **Base** dal menu del layer Colore. Ora i tratti compaiono solo all'interno della forma piena di Base.
5. Scegli **Nessuna** per mostrare di nuovo tutti i tratti di Colore.

Un semplice contorno limita il colore al contorno, non all'intera area interna: riempi Base se vuoi colorare l'interno. Un riferimento vuoto o nascosto rende invisibile il contenuto ritagliato; opacità e trasparenza del riferimento influenzano il risultato. Le opzioni che creerebbero un ciclo sono disabilitate. Rinominare o riordinare Base mantiene il collegamento; eliminarla lo rimuove.

## Versioni documento

Le versioni sono copie dello stato del documento conservate nel progetto. Usale prima di sperimentare una variante.

1. In **Versioni documento**, inserisci un **Nome versione**, per esempio «Prima del colore».
2. Premi **Crea versione**. Se lasci il campo vuoto viene proposto un nome automatico.
3. Continua a lavorare. Le versioni compaiono con data e tipo, dalla più recente.
4. Per rinominarne una, cambia il suo campo e sposta il focus fuori dal campo.
5. Premi **Ripristina versione** e conferma per recuperarla. Ripristina canvas, layer, riferimenti e immagine AI di quel momento, mantenendo l'elenco delle versioni. Puoi usare Annulla per recuperare lo stato precedente al ripristino.
6. **Elimina versione**, dopo conferma, rimuove quella copia. Salva il progetto per conservare tutte queste modifiche su disco.

**Versioni automatiche** è facoltativo: con le impostazioni predefinite controlla ogni cinque minuti e crea una copia solo quando il contenuto differisce dall'ultima. L'elenco contiene al massimo 20 versioni ed è soggetto anche a limiti di spazio; se la creazione è disabilitata o viene rifiutata, elimina copie non più utili o alleggerisci il documento.

**Annulla/Ripristina** riguarda la cronologia delle operazioni nella sessione. Le versioni documento sono punti di ritorno espliciti, conservati nei `.tdraw`; il salvataggio automatico di recupero protegge invece dalle interruzioni. Non sono tre nomi per la stessa funzione.

## Inspector e generazione AI

### Configurare OpenAI

Apri **File > Impostazioni > API Key...**, oppure il pulsante con la chiave in Inspector. Inserisci la tua API key OpenAI e scegli un modello immagini disponibile per il tuo account, poi salva. Il modello predefinito è `gpt-image-1.5`.

La chiave viene conservata dal sistema di gestione dei segreti del computer. Inspector mostra se è configurata e il backend di storage; può essere usato un archivio locale cifrato come fallback, con un avviso se il sistema non offre protezione adeguata. Non inserire la chiave nel nome del progetto o nel testo dello stile.

### Scegliere lo stile e generare

In **File > Impostazioni > Stile...** scegli un preset e leggi la sua descrizione, oppure scegli lo stile personalizzato e scrivi una breve indicazione visiva. Puoi contrassegnare un preset come preferito e richiamarlo dalla stessa finestra. Salva la scelta.

Premi **Genera immagine**, il pulsante con le frecce circolari in Inspector. Durante l'attesa viene mostrato un indicatore; al termine l'anteprima contiene il risultato. La generazione successiva sostituisce l'immagine corrente: salvala, esportala o crea una versione prima di sostituire un risultato da conservare.

Vengono inviati a OpenAI il canvas composito e le indicazioni di generazione. I riferimenti, le versioni archiviate e il nome del progetto non fanno parte del contenuto di generazione. Le richieste possono avere un costo sul tuo account OpenAI e richiedono Internet; la disponibilità dipende dal modello e dal provider.

### Redraw automatico

**File > Impostazioni > Redraw automatico...** permette di attivare la generazione dopo una pausa dal disegno e di scegliere l'attesa. È disattivato per impostazione predefinita. Se lo abiliti con una chiave configurata, le modifiche al canvas possono avviare nuove richieste a pagamento. Disattivalo se vuoi decidere ogni volta con Genera immagine.

## Salvare, aprire ed esportare

**File > Salva** conserva il progetto modificabile; **Salva con nome...** permette di scegliere un altro nome/percorso. **File > Apri** carica un `.tdraw`. Nuovo e Apri chiedono conferma se il progetto corrente ha modifiche non salvate.

Per un progetto chiamato `nome`, il salvataggio produce:

| File | Contenuto |
| --- | --- |
| `nome.tdraw` | Canvas, layer e tratti, effetti di clipping, riferimenti, versioni e immagine AI presente. |
| `nome_canvas.png` | Disegno composito senza riferimenti. |
| `nome_image.png` | Immagine AI, quando presente. |

Tieni il `.tdraw` per continuare a lavorare: un PNG non conserva layer o versioni modificabili. I nomi dei file seguono il percorso scelto nel dialogo di salvataggio.

**Esporta canvas PNG/WebP** crea un'immagine del disegno. **Esporta immagine PNG/WebP** esporta invece il risultato AI e richiede che sia già presente. Esportare non sostituisce il salvataggio del progetto. PNG mantiene qualità senza perdita; WebP è utile per una condivisione più compatta.

I progetti precedenti privi di dimensioni esplicite usano il foglio iniziale. Le maschere contenute nei vecchi progetti continuano a influenzare l'aspetto e vengono conservate, ma non sono disponibili comandi per crearle o modificarle. Per i nuovi disegni usa i layer e il clipping.

## Salvataggio automatico e recupero

Con le impostazioni predefinite l'app conserva un autosave locale delle modifiche ogni 30 secondi. Questo non sostituisce **File > Salva**, non è una copia in una cartella scelta da te e non è un backup esterno.

Se al riavvio è disponibile un autosave, compare **Autosave recovery** con nome e orario. **Restore** lo recupera; **Ignore**, dopo conferma, elimina quella copia di recupero. Il documento recuperato non è associato al precedente percorso: usa Salva e scegli dove conservarlo. Se hai più copie, verifica nome, orario e contenuto prima di sovrascrivere un progetto.

## Scorciatoie

Usa Ctrl su Windows e ⌘ su macOS per le combinazioni indicate come Ctrl/⌘.

| Operazione | Scorciatoia |
| --- | --- |
| Nuovo / Apri / Salva | Ctrl/⌘ + N / O / S |
| Salva con nome | Ctrl/⌘ + Shift + S |
| Annulla / Ripristina | Ctrl/⌘ + Z / Ctrl/⌘ + Shift + Z |
| Taglia / Copia / Incolla | Ctrl/⌘ + X / C / V |
| Ritaglia | Ctrl/⌘ + Shift + X |
| Impostazioni API key | Ctrl/⌘ + , |
| Aumenta / Riduci zoom | Ctrl/⌘ + = / − |
| Reset zoom e vista | Ctrl/⌘ + 0 |
| Schermo intero | F11 su Windows; Ctrl + ⌘ + F su macOS |

## Risoluzione dei problemi

| Problema | Cosa controllare |
| --- | --- |
| Non vedo i nuovi tratti | Layer attivo, sua visibilità/opacità, colore e clipping. Prova Nessuna nel clipping. |
| Il clipping nasconde tutto | Il riferimento deve contenere pixel visibili; riempi la forma, mostra il riferimento e controllane l'opacità. |
| Non vedo texture e slider avanzati | Seleziona un preset avanzato al posto del classico. |
| Incolla non aggiunge un'immagine | Verifica che gli appunti contengano un'immagine e che il focus non sia in un campo di testo. |
| Importa riferimento fallisce | Controlla formato, dimensioni, limite di 4 MiB e numero di riferimenti; prova un'immagine più piccola. |
| Non posso creare una versione | Controlla il limite di 20 copie e lo spazio richiesto dal documento. |
| Genera immagine è disabilitato | Configura la API key oppure attendi la fine della richiesta corrente. |
| La richiesta AI fallisce | Controlla rete, validità della chiave, modello/accesso e disponibilità o credito dell'account. Consulta il messaggio in Inspector. |
| Il canvas sembra tagliato | Resetta zoom e vista; controlla anche le dimensioni del foglio. |
| Il download non si apre | Verifica architettura, provenienza, checksum e avvisi del sistema per pacchetti non firmati. |

## Privacy e limiti

Disegni, riferimenti, versioni e autosave vengono conservati localmente. La generazione AI trasmette il canvas e le indicazioni necessarie a OpenAI, secondo le condizioni del provider. Non inviare contenuti riservati senza valutarne l'uso. I progetti non contengono la API key, ma contengono i riferimenti e le immagini che hai inserito: considera questi dati quando condividi un `.tdraw`.

Le funzioni di disegno locale non richiedono AI; la reinterpretazione dell'immagine dipende da OpenAI. La risposta alla pressione dipende dalla penna e dai driver. Alcune etichette rimangono inglesi anche nell'interfaccia italiana. I pacchetti sono non firmati e non è previsto un auto-update firmato.

Per i dettagli sui controlli e sui limiti di protezione consulta il [modello di sicurezza](SECURITY_MODEL.md). Codice e documentazione sono distribuiti con [licenza Apache 2.0](LICENSE).
