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

### Download, firma e checksum

True Drawing è nato come programma personale ed e poi stato pubblicato come progetto open source con licenza Apache 2.0. Le build pubblicate non sono firmate con certificati Apple o Windows.

Questo significa che:

- su macOS puo comparire un avviso di Gatekeeper al primo avvio;
- su Windows puo comparire un avviso SmartScreen o "autore sconosciuto";
- il codice sorgente resta ispezionabile nel repository, ma i pacchetti scaricati non hanno una firma commerciale del sistema operativo.

E' quindi possibile che all'avvio il Sistema Operativo vi chieda il permesso a procedere nell'apertura dell'app.

_Nota:_ In caso abbiate dubbi, nel repository trovate i checksum dei programmi. Nell'area Tech di questo documento trovate le istruzioni per verificare che i files non siano stati compromessi.

### Verifica checksum SHA-256

La release `v1.0.2` include i file `SHA256SUMS-windows.txt` e `SHA256SUMS-macos.txt`. Scaricare il file checksum corrispondente al proprio sistema operativo insieme al pacchetto dell'app.

Su Windows, dalla cartella dove si trova l'installer:

```powershell
Get-FileHash .\True-Drawing-1.0.2-Windows-x64.exe -Algorithm SHA256
```

Confrontare il valore `Hash` con la riga corrispondente in `SHA256SUMS-windows.txt`.

Su macOS, dalla cartella dove si trova il download:

```bash
shasum -a 256 True-Drawing-1.0.2-macOS-arm64.dmg
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

Sul lato sinistro dello schermo sono presenti i tool principali di disegno. Ovvero (dall'alto verso il basso):

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

Il menù Impostazioni permette di modificare la lingua del programma, il suo aspetto, di inserire la chiave API della AI, di scegliere la tipologia di immagine in uscita (realistica, cartoon, etc), di impostare l'autogenerazione dell'immagine AI durante le pause dal disegno.

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
