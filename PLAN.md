# True Drawing - Piano post release

## Stato attuale

True Drawing e' arrivato alla release stabile `1.0.2`.

- Versione corrente: `1.0.2`.
- Branch stabile: `main`.
- Ultima milestone completata: `M11 - Roadmap post release e pulizia piano`.
- Ultima patch completata: `v1.0.2 - Fix leggibilita' dialog impostazioni in tema scuro`.
- Release GitHub corrente pubblicata: `v1.0.1`; release `v1.0.2` da pubblicare con artifact Windows/macOS non firmati, note release e checksum SHA-256.
- Milestone corrente in sviluppo: nessuna.

## Obiettivo della fase post release

La fase post release serve a far evolvere True Drawing da app stabile con flusso principale completo a strumento di disegno piu' maturo, estensibile e utile anche senza generazione AI.

Le priorita' sono:

- migliorare qualita' e flessibilita' degli strumenti di disegno;
- permettere l'uso di immagini di riferimento;
- aggiungere funzioni avanzate sui layer;
- conservare versioni del documento oltre ad autosave e undo/redo;
- rendere la generazione AI piu' configurabile;
- aprire l'architettura a provider AI multipli;
- garantire un'esperienza completa anche offline.

## Regole operative

- Sviluppare ogni milestone su un branch dedicato: `milestone/<numero>-<slug>`.
- Non fare merge su `main` finche' implementazione, test, documentazione e CI non sono verificati.
- Aggiornare la versione alla chiusura di ogni milestone applicativa; le milestone solo documentali possono restare sulla versione corrente se non viene pubblicata una nuova release.
- Mantenere aggiornati `README.md`, `ISTRUZIONI.md`, `INSTRUCTIONS.md`, `SECURITY_MODEL.md`, `MAP.md`, `AGENTS.md` e `PLAN.md`.
- Aggiornare `SECURITY_MODEL.md` quando cambiano segreti, rete, IPC, salvataggi, logging o dati inviati ai provider AI.
- Aggiornare `MAP.md` quando vengono aggiunti, rimossi o spostati moduli rilevanti.
- Continuare a distribuire artifact non firmati finche' non sono disponibili credenziali di firma Windows/macOS e notarizzazione Apple.

## Verifica minima per ogni milestone

Prima della chiusura di una milestone:

- eseguire `npm run lint`;
- eseguire `npm run test`;
- eseguire `npm run build`;
- eseguire verifica manuale delle funzionalita' implementate;
- controllare che non siano stati introdotti segreti tracciati;
- controllare che la configurazione non abbia duplicazioni o hardcoded non necessari;
- aggiornare documentazione e mappa;
- verificare CI su PR e `main`;
- generare release GitHub solo quando prevista o richiesta esplicitamente.

## Roadmap

### M11 - Roadmap post release e pulizia piano

- Versione finale: `1.0.1` senza nuova release, perche' la milestone modifica solo documentazione e roadmap.
- Branch: `milestone/11-post-release-roadmap`.
- Tipo incremento: nessuno.
- Obiettivo: sostituire il vecchio piano storico con una roadmap post release pulita.

Attivita':

- Rimuovere dal piano la cronologia estesa delle milestone gia' chiuse.
- Conservare lo stato corrente della release stabile.
- Trasformare il backlog post release in milestone future.
- Escludere gli aggiornamenti automatici firmati dalla roadmap attiva, per mancanza di credenziali.
- Aggiornare i riferimenti documentali al manuale inglese `INSTRUCTIONS.md`.
- Aggiornare subito `SECURITY_MODEL.md` a `1.0.1` e documentare i correttivi previsti da `M12`.

Criteri di accettazione:

- `PLAN.md` contiene solo stato corrente, regole operative, verifiche e roadmap futura.
- La roadmap non include l'auto-update firmato.
- I riferimenti documentali usano il manuale inglese `INSTRUCTIONS.md`.
- `SECURITY_MODEL.md` riflette lo stato corrente `1.0.1` e la milestone di hardening pianificata.

### M12 - Security hardening post release

- Versione finale prevista: `1.1.0`.
- Branch previsto: `milestone/12-security-hardening`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: rafforzare le difese gia' documentate in `SECURITY_MODEL.md` prima di aggiungere nuove superfici come import immagini, provider multipli e modalita' offline.

Attivita':

- Aggiornare `SECURITY_MODEL.md` con l'esito tecnico dei correttivi implementati.
- Applicare un limite esplicito anche al PNG inviato a `image-generation:generate-realistic`.
- Rafforzare il download dell'immagine restituita dal provider:
  - accettare solo URL `https`;
  - bloccare host locali, loopback e indirizzi privati;
  - applicare timeout;
  - applicare limite massimo byte;
  - preferire risposta base64 quando disponibile.
- Aggiungere validazione comune dell'origine/sender IPC per i canali esposti al renderer.
- Restringere la CSP di produzione dove possibile, in particolare `connect-src`, `frame-src` e `worker-src`.
- Centralizzare la sanitizzazione degli errori IPC mostrati al renderer.
- Rendere esplicito in UI e documentazione quando l'app usa il fallback cifrato `safeStorage` invece di Keychain/Credential Manager.
- Aggiungere controlli automatici per evitare API key in configurazione, file progetto, preferenze e fixture di test.
- Valutare Dependabot e audit dipendenze come controlli CI leggeri senza bloccare lo sviluppo su falsi positivi non verificati.

Criteri di accettazione:

- Nessun canale IPC accetta payload immagine senza limite dimensionale esplicito.
- Il fetch di URL immagine remoti non puo' raggiungere host locali o reti private.
- La CSP di produzione consente solo cio' che serve realmente al renderer.
- Gli errori esposti al renderer non contengono API key, token bearer, percorsi sensibili non necessari o risposte provider grezze.
- I test coprono hardening IPC, CSP, sanitizzazione errori, limiti payload e assenza segreti tracciati.
- `SECURITY_MODEL.md`, `README.md`, `ISTRUZIONI.md`, `INSTRUCTIONS.md`, `MAP.md` e `AGENTS.md` sono aggiornati se il comportamento cambia.

### M13 - Brush avanzati e texture personalizzate

- Versione finale prevista: `1.2.0`.
- Branch previsto: `milestone/13-advanced-brushes`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: rendere il motore di disegno piu' espressivo con brush avanzati e texture configurabili.

Attivita':

- Progettare un modello brush estensibile e serializzabile.
- Aggiungere preset per matita, pennello morbido, marker, inchiostro e texture.
- Supportare dinamiche basate su pressione, velocita' e opacita'.
- Aggiungere controlli UI coerenti per brush e texture.
- Salvare i parametri brush nei file progetto.
- Aggiornare test unitari per stroke model, rendering e configurazione.

Criteri di accettazione:

- I brush avanzati funzionano su canvas e layer.
- I preset sono configurabili senza hardcoded sparsi.
- I file `.tdraw` conservano correttamente le impostazioni brush.
- Le prestazioni restano fluide su canvas di dimensione predefinita.

### M14 - Import immagini di riferimento

- Versione finale prevista: `1.3.0`.
- Branch previsto: `milestone/14-reference-image-import`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: permettere all'utente di importare immagini locali come riferimento o base di lavoro.

Attivita':

- Aggiungere flusso IPC controllato per aprire immagini locali.
- Supportare formati immagine comuni compatibili con Electron/Canvas.
- Decidere se l'immagine importata vive come reference separata, layer raster o entrambi.
- Aggiungere controlli per visibilita', opacita', posizione e scala dell'immagine.
- Salvare riferimenti o copie embedded nel progetto in modo documentato.
- Aggiornare `SECURITY_MODEL.md` per il comportamento su file locali.

Criteri di accettazione:

- L'utente puo' importare un'immagine senza accesso diretto del renderer al filesystem.
- Le immagini importate si riaprono correttamente dal progetto salvato.
- Errori di formato o permessi sono sanitizzati e comprensibili.
- La funzione non invia immagini ai provider AI senza azione esplicita dell'utente.

### M15 - Maschere e clipping layer

- Versione finale prevista: `1.4.0`.
- Branch previsto: `milestone/15-masks-clipping-layers`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: aggiungere controllo avanzato della composizione tramite maschere e clipping.

Attivita':

- Estendere il modello layer con maschere e relazioni di clipping.
- Aggiungere rendering canvas coerente con visibilita', opacita' e ordine layer.
- Aggiungere UI per creare, attivare, disattivare e rimuovere maschere.
- Integrare maschere con undo/redo e salvataggio.
- Aggiornare test su modello documento, rendering e history.

Criteri di accettazione:

- Le maschere limitano correttamente il disegno e la visualizzazione.
- Il clipping resta stabile dopo riordino, salvataggio e riapertura.
- Le operazioni sono reversibili con undo/redo.
- La UI impedisce stati layer incoerenti.

### M16 - Storia versioni del documento

- Versione finale prevista: `1.5.0`.
- Branch previsto: `milestone/16-document-version-history`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: permettere all'utente di tornare a snapshot precedenti del progetto.

Attivita':

- Definire un modello di snapshot leggero e compatibile con `.tdraw`.
- Distinguere history operativa undo/redo da versioni persistenti del documento.
- Aggiungere salvataggio manuale di snapshot e snapshot automatici controllati.
- Aggiungere UI per consultare, rinominare, ripristinare o eliminare versioni.
- Limitare dimensioni e numero snapshot tramite configurazione centrale.
- Aggiornare test e documentazione di recupero dati.

Criteri di accettazione:

- L'utente puo' creare e ripristinare versioni del documento.
- Il ripristino non corrompe canvas, layer, immagine realistica o metadati.
- I limiti configurati impediscono crescita incontrollata dei file.
- Autosave, recovery e snapshot hanno responsabilita' chiare e documentate.

### M17 - Preset di stile realistico

- Versione finale prevista: `1.6.0`.
- Branch previsto: `milestone/17-realistic-style-presets`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: rendere piu' potente e prevedibile la generazione realistica tramite preset di stile.

Attivita':

- Progettare preset di stile con nome, descrizione, prompt fragment e parametri supportati.
- Spostare i preset in configurazione centrale validata.
- Aggiungere gestione UI per selezione, preferito e stile personalizzato.
- Migliorare la costruzione prompt mantenendo minimo l'invio di dati.
- Aggiungere test per validazione preset e prompt realistico.

Criteri di accettazione:

- I preset sono ordinati, validati e modificabili da configurazione.
- Lo stile selezionato e' salvato come preferenza non segreta.
- Il prompt generato resta documentato e testabile.
- Gli errori del provider non espongono segreti o dati non necessari.

### M18 - Supporto provider AI multipli

- Versione finale prevista: `1.7.0`.
- Branch previsto: `milestone/18-multiple-ai-providers`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: rendere la generazione immagini indipendente dal solo provider OpenAI.

Attivita':

- Definire interfaccia provider per generazione immagini.
- Separare configurazione provider, modello, credenziali e capacita' supportate.
- Conservare OpenAI come provider predefinito.
- Aggiungere gestione credenziali per provider multipli senza salvare segreti in chiaro.
- Aggiornare IPC, UI impostazioni e documentazione sicurezza.
- Aggiungere test per routing provider, validazione config e sanitizzazione errori.

Criteri di accettazione:

- L'utente puo' scegliere provider e modello dalle impostazioni.
- OpenAI resta funzionante e retrocompatibile.
- Ogni provider usa solo i segreti necessari e li salva nel keychain/fallback sicuro.
- La UI indica chiaramente provider non configurati o non disponibili.

### M19 - Modalita' offline completa

- Versione finale prevista: `1.8.0`.
- Branch previsto: `milestone/19-offline-mode`.
- Tipo incremento: `+0.1.0`.
- Obiettivo: permettere a True Drawing di funzionare pienamente come app di disegno locale anche senza rete o API key.

Attivita':

- Definire stato offline esplicito dell'app.
- Disattivare o nascondere in modo coerente le azioni di generazione AI non disponibili.
- Garantire apertura, disegno, layer, salvataggio, recupero ed export senza provider configurati.
- Aggiungere messaggi UI non invasivi per spiegare la disponibilita' della generazione.
- Aggiungere test per avvio senza API key, assenza rete e provider non configurato.
- Aggiornare manuali e modello di sicurezza.

Criteri di accettazione:

- L'app e' usabile come editor locale senza API key.
- Nessuna chiamata di rete parte in modalita' offline.
- I flussi di salvataggio/export funzionano senza generazione AI.
- Il passaggio da offline a provider configurato non richiede riavvio, salvo limiti tecnici documentati.

## Fuori roadmap attiva

### Aggiornamenti automatici firmati

Gli aggiornamenti automatici firmati non sono inclusi nella roadmap attiva.

Motivo: al momento non sono disponibili credenziali o certificati per firma codice Windows, firma macOS e notarizzazione Apple. Finche' questa condizione non cambia, le release restano distribuite come artifact GitHub non firmati con checksum SHA-256 e documentazione sugli avvisi SmartScreen/Gatekeeper.

## Registro avanzamento

| Data | Milestone | Versione | Branch | Stato | Note |
| --- | --- | --- | --- | --- | --- |
| 2026-06-11 | Baseline stabile | 1.0.1 | `main` | Completata | Release `v1.0.1` pubblicata con artifact Windows/macOS non firmati, note release e checksum SHA-256. |
| 2026-06-11 | M11 - Roadmap post release e pulizia piano | 1.0.1 | `milestone/11-post-release-roadmap` | Completata | Piano storico sostituito da roadmap post release basata sul backlog; nessuna nuova release per modifica solo documentale. |
| 2026-06-12 | Patch tema scuro impostazioni | 1.0.2 | `patch/1.0.2-dark-settings` | Completata | Corretta leggibilita' dei preset stile e della checkbox redraw automatico in tema scuro; rimosso dropdown stile duplicato. |

## Checklist di chiusura milestone

- [ ] Branch milestone creato.
- [ ] Implementazione completata.
- [ ] Test automatici eseguiti.
- [ ] Verifica manuale eseguita.
- [ ] Versione aggiornata.
- [ ] `README.md` aggiornato in italiano e inglese.
- [ ] `ISTRUZIONI.md` aggiornato.
- [ ] `INSTRUCTIONS.md` aggiornato.
- [ ] `SECURITY_MODEL.md` aggiornato in italiano e inglese, se necessario.
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
- [ ] Branch milestone eliminato dopo release o dopo merge verificato.
