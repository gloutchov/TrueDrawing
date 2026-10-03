# True Drawing - Piano post release

## Stato attuale

True Drawing ha completato C26 alla versione `1.11.4`. La manutenzione C20-C22 delle PR #15-#17 aggiorna le dipendenze; la release cumulativa `v1.11.0` completa il processo con pacchetti Windows/macOS e checksum verificati.

- Versione corrente su `main`: `1.11.4`.
- Branch stabile: `main`.
- Ultima milestone completata: `C26 - Spaziatura Brush Avanzati`.
- Ultima patch completata: `v1.5.1 - Import WebP normalizzato via Chromium Canvas`.
- Patch corrente: nessuna.
- Release GitHub corrente: `v1.11.0`, pubblicata con artifact Windows/macOS non firmati, note release e checksum SHA-256.
- Milestone corrente in sviluppo: nessuna; M27 e' la prossima pianificata.

## Obiettivo della fase post release

La fase post release serve a far evolvere True Drawing da app stabile con flusso principale completo a strumento di disegno piu' maturo, estensibile e utile anche senza generazione AI.

Le priorita' sono:

- migliorare qualita' e flessibilita' degli strumenti di disegno;
- permettere l'uso di immagini di riferimento;
- aggiungere funzioni avanzate sui layer;
- conservare versioni del documento oltre ad autosave e undo/redo;
- rendere la generazione AI piu' configurabile.

## Regole operative

- Sviluppare ogni milestone su un branch dedicato: `milestone/<numero>-<slug>`.
- Non fare merge su `main` finche' implementazione, test, documentazione e CI non sono verificati.
- Aggiornare la versione alla chiusura di ogni milestone applicativa; le milestone solo documentali possono restare sulla versione corrente se non viene pubblicata una nuova release.
- Mantenere aggiornati `README.md`, `ISTRUZIONI.md`, `INSTRUCTIONS.md`, `SECURITY_MODEL.md`, `MAP.md`, `AGENTS.md` e `PLAN.md`.
- Aggiornare `SECURITY_MODEL.md` quando cambiano segreti, rete, IPC, salvataggi, logging o dati inviati ai provider AI.
- Aggiornare `MAP.md` quando vengono aggiunti, rimossi o spostati moduli rilevanti.
- Continuare a distribuire artifact non firmati finche' non sono disponibili credenziali di firma Windows/macOS e notarizzazione Apple.
- Usare `M<n>` per le milestone in programma, `C<n>` per quelle chiuse e `P<n>` per le idee fuori dal piano esecutivo. Eseguire le `M` in ordine numerico.
- Prima di ogni operazione Git/GitHub verificare autore `gloutchov <gloutchov@gmail.com>` e account GitHub `gloutchov`.
- Per questa esecuzione il progettista ha autorizzato commit, merge, tag, push e rimozione dei branch senza controllo preventivo. Dopo il merge creare e verificare sul remoto il tag annotato `milestone/C<n>`; senza tale checkpoint la milestone seguente non inizia.

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

### C11 - Roadmap post release e pulizia piano

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
- `SECURITY_MODEL.md` riflette lo stato corrente `1.0.1` e la milestone di hardening pianificata, ora M14.

Stato: completata nel 2026-06-11, prima dell'introduzione dei checkpoint `milestone/C<n>`; nessun tag di checkpoint retroattivo. Riepilogo: roadmap post release e documentazione riallineate alla release `1.0.1`.

### C12 - Manina e navigazione canvas

- Versione finale: `1.1.0` (sorgente, senza GitHub release).
- Branch: `milestone/12-canvas-hand-tool`.
- Tag di checkpoint: `milestone/C12`.
- Tipo incremento: `+0.1.0`.
- Stato: completata dopo avallo esplicito del progettista e verifica di CI e checkpoint remoto.
- Obiettivo: permettere di spostare la vista del canvas senza modificare il disegno.

Attivita':

- Inserire la manina come primo strumento nella barra a sinistra, con etichette italiane e inglesi.
- Consentire il trascinamento del canvas con puntatore o touch, anche dopo uno zoom; mantenere il pan come stato di vista non salvato nel progetto.
- Evitare che la navigazione generi stroke, selezioni o voci undo/redo; integrare il reset della vista con lo zoom.
- Aggiornare `README.md`, `ISTRUZIONI.md`, `INSTRUCTIONS.md`, `MAP.md`, `AGENTS.md` e `PLAN.md`; aggiornare `SECURITY_MODEL.md` solo se cambia una superficie di rischio.

Criteri di accettazione:

- La manina precede tutti gli altri strumenti e il trascinamento sposta la vista in entrambe le direzioni.
- Il disegno rimane immutato, anche dopo cambio strumento, undo/redo, salvataggio ed export.
- Zoom, temi chiaro/scuro e input puntatore/touch continuano a funzionare.

Test richiesti: test mirati della selezione strumento e del pan, `npm run lint`, `npm run test`, `npm run build` e smoke test manuale della UI.

Riepilogo e verifiche (2026-09-27): manina, pan locale, reset vista, test mirati, documenti e preferenze operative aggiornati; lint, 41 test, build, CI PR #12 (run `36323912210`) e CI `main` (run `36325069504`) verdi. Smoke test Electron: pan a zoom 132% senza tratti, reset e temi chiaro/scuro verificati. Limite residuo: penna e touch fisici non disponibili per lo smoke test. Il progettista ha approvato il merge; `main`, `milestone/C12` e `v1.1.0` verificati sul remoto prima di M13.

### C13 - Dimensioni canvas in pixel e centimetri

- Versione finale: `1.2.0`, con release GitHub `v1.2.0`.
- Branch: `milestone/13-canvas-dimensions`.
- Tag di checkpoint: `milestone/C13`.
- Tipo incremento: `+0.1.0`.
- Stato: completata dopo avallo esplicito del progettista, merge, CI, checkpoint e release verificati.
- Obiettivo: cambiare larghezza e altezza del canvas dal pannello a destra e dal menu Impostazioni.

Attivita':

- Aggiungere controlli condivisi per larghezza e altezza in pixel o centimetri, con risoluzione DPI esplicita e conversione coerente.
- Consentire il blocco delle proporzioni con lucchetto e la compressione indipendente dei riquadri del pannello destro, ordinati Inspector, Dimensioni canvas e Layer, con freccia all'estrema destra.
- Validare minimi, massimi e risoluzione tramite configurazione centrale; mantenere le dimensioni nel documento `.tdraw` e recuperare i progetti precedenti.
- Applicare il ridimensionamento senza scalare i tratti: origine in alto a sinistra, contenuto oltre i bordi temporaneamente non visibile e ripristinabile con undo/redo o ampliamento.
- Aggiornare rendering, selezione, crop, clipboard, inspector, generazione, salvataggio, autosave ed export per usare le dimensioni del documento.
- Aggiornare `README.md`, `ISTRUZIONI.md`, `INSTRUCTIONS.md`, `SECURITY_MODEL.md`, `MAP.md`, `AGENTS.md` e `PLAN.md`.

Criteri di accettazione:

- I due accessi modificano lo stesso canvas e mostrano la stessa misura effettiva.
- I valori in centimetri producono dimensioni pixel prevedibili alla risoluzione selezionata.
- Il lucchetto aggiorna il lato opposto secondo le proporzioni correnti; i riquadri destri si comprimono senza cambiare il documento.
- Dimensioni, tratti e layer si conservano dopo salvataggio e riapertura; undo/redo ripristina le dimensioni.
- Export e file laterali usano le dimensioni effettive, senza perdita di contenuto nel documento quando il canvas si restringe.

Test richiesti: conversione e limiti, compatibilita' file, history, rendering/export, `npm run lint`, `npm run test`, `npm run build` e smoke test manuale in entrambi i temi.

Riepilogo e verifiche (2026-09-27): dimensioni e DPI modificabili in px/cm dal pannello destro e dalle Impostazioni, lucchetto proporzioni, riquadri collassabili, persistenza nel progetto e undo/redo. L'Inspector precede Dimensioni canvas e la freccia di compressione chiude ogni intestazione. Lint, 49 test e build verdi; smoke test Electron in profilo temporaneo con px/cm, undo, riquadri e temi chiaro/scuro verificati. CI PR #13 verde (run `36333336031`); CI `main` e workflow release verificati in chiusura. Release `v1.2.0` con artifact Windows/macOS non firmati e checksum SHA-256. Limite residuo: penna e touch fisici non disponibili per lo smoke test.

### C14 - Security hardening post release

- Versione finale: `1.3.0`.
- Branch: `milestone/14-security-hardening`.
- Tag di checkpoint: `milestone/C14`.
- Tipo incremento: `+0.1.0`.
- Stato: completata; CI PR #14 e main, checkpoint remoto e tag versione verificati.
- Obiettivo: rafforzare le difese gia' documentate in `SECURITY_MODEL.md` prima di aggiungere nuove superfici come l'import di immagini di riferimento.

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

Test richiesti: test mirati di logica e flussi interessati, `npm run lint`, `npm run test`, `npm run build` e verifica manuale della UI quando pertinente.

Documentazione da aggiornare: `README.md`, `ISTRUZIONI.md`, `INSTRUCTIONS.md`, `PLAN.md`, `AGENTS.md`, oltre a `SECURITY_MODEL.md` e `MAP.md` secondo le superfici e i moduli modificati.

Riepilogo (2026-10-02): limiti immagini di 16 MiB, controllo DNS alla connessione HTTPS senza redirect, timeout e limite streaming; IPC limitato al renderer principale, errori controllati, CSP senza connessioni/frame/worker in produzione, avviso safeStorage e controlli segreti. Verifiche locali: lint, 74 test, build, smoke Electron nei due temi. Audit dipendenze runtime: zero vulnerabilita'. Dependabot mensile. Limiti: generazione AI reale e dispositivi penna/touch fisici non verificati. Versione `1.3.0`, checkpoint `milestone/C14`. Nessuna release intermedia per risparmiare Actions; release cumulativa prevista a M19.

### C15 - Brush avanzati e texture personalizzate

- Versione finale: `1.4.0`.
- Branch: `milestone/15-advanced-brushes`.
- Tag di checkpoint: `milestone/C15`.
- Tipo incremento: `+0.1.0`.
- Stato: completata; PR #18 CI `37043079381`, main CI `37043178946`, checkpoint e tag verificati sul remoto.
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

Test richiesti: test mirati di logica e flussi interessati, `npm run lint`, `npm run test`, `npm run build` e verifica manuale della UI quando pertinente.

Documentazione da aggiornare: `README.md`, `ISTRUZIONI.md`, `INSTRUCTIONS.md`, `PLAN.md`, `AGENTS.md`, oltre a `SECURITY_MODEL.md` e `MAP.md` secondo le superfici e i moduli modificati.

Riepilogo (2026-10-02): Preset brush bilingui da configurazione: grafite, morbido, marker, inchiostro e texture; controlli pressione, velocita, spaziatura e texture procedurali. Parametri immutabili nei tratti e persistenti nei file tdraw. / Configurable bilingual brush presets, pressure/speed/spacing and procedural texture controls; per-stroke parameters persist in tdraw. Verifiche: lint, 79 test, build e smoke Electron nei temi chiaro/scuro. Versione `1.4.0`, checkpoint `milestone/C15`. Limite residuo: input penna/touch fisico non verificato. Release cumulativa a M19.

### C16 - Import immagini di riferimento

- Versione finale: `1.5.0`.
- Branch: `milestone/16-reference-image-import`.
- Tag di checkpoint: `milestone/C16`.
- Tipo incremento: `+0.1.0`.
- Stato: completata; PR #19 CI `37044259748`, main CI `37044386123`, checkpoint e tag verificati sul remoto.
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

Test richiesti: test mirati di logica e flussi interessati, `npm run lint`, `npm run test`, `npm run build` e verifica manuale della UI quando pertinente.

Documentazione da aggiornare: `README.md`, `ISTRUZIONI.md`, `INSTRUCTIONS.md`, `PLAN.md`, `AGENTS.md`, oltre a `SECURITY_MODEL.md` e `MAP.md` secondo le superfici e i moduli modificati.

Riepilogo (2026-10-02): Import locale PNG/JPEG/WebP da dialogo nativo controllato, normalizzazione PNG e limiti bytes/pixel. Riferimenti embedded separati con visibilita, opacita, posizione e scala: esclusi da export e AI. Caricamento immagini prima del rendering dopo riapertura. / Local dialog-controlled imports; embedded references with visibility, opacity, position and scale, excluded from exports and AI. Verifiche: lint, 83 test, build e smoke Electron nei temi chiaro/scuro. Versione `1.5.0`, checkpoint `milestone/C16`. Limite residuo: input penna/touch fisico non verificato. Release cumulativa a M19.

### C17 - Maschere e clipping layer

- Versione finale: `1.6.0`.
- Branch: `milestone/17-masks-clipping-layers`.
- Tag di checkpoint: `milestone/C17`.
- Tipo incremento: `+0.1.0`.
- Stato: completata; PR #21 CI `37045572252`, main CI `37045931619`, checkpoint e tag verificati sul remoto.
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

Test richiesti: test mirati di logica e flussi interessati, `npm run lint`, `npm run test`, `npm run build` e verifica manuale della UI quando pertinente.

Documentazione da aggiornare: `README.md`, `ISTRUZIONI.md`, `INSTRUCTIONS.md`, `PLAN.md`, `AGENTS.md`, oltre a `SECURITY_MODEL.md` e `MAP.md` secondo le superfici e i moduli modificati.

Riepilogo (2026-10-02): Maschere non distruttive con editor, attivazione e rimozione; clipping con identita layer stabili, controllo cicli e pulizia relazioni alla cancellazione. Rendering condiviso per canvas/export/AI, undo/redo e persistenza tdraw. / Non-destructive editable masks, stable layer clipping with cycle validation, shared rendering, undo/redo and persistence. Verifiche: lint, 93 test, build e smoke Electron nei temi chiaro/scuro. Versione `1.6.0`, checkpoint `milestone/C17`. Limite residuo: input penna/touch fisico non verificato. Release cumulativa a M19.

### C18 - Storia versioni del documento

- Versione finale: `1.7.0`.
- Branch: `milestone/18-document-version-history`.
- Tag di checkpoint: `milestone/C18`.
- Tipo incremento: `+0.1.0`.
- Stato: completata; PR #22 CI `37047176018`, main CI `37047290899`, checkpoint e tag verificati sul remoto.
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

Test richiesti: test mirati di logica e flussi interessati, `npm run lint`, `npm run test`, `npm run build` e verifica manuale della UI quando pertinente.

Documentazione da aggiornare: `README.md`, `ISTRUZIONI.md`, `INSTRUCTIONS.md`, `PLAN.md`, `AGENTS.md`, oltre a `SECURITY_MODEL.md` e `MAP.md` secondo le superfici e i moduli modificati.

Riepilogo (2026-10-02): Snapshot persistenti manuali/automatici, consultazione, rinomina, ripristino e cancellazione; capsule senza ricorsione e limiti numero/byte da configurazione. Ripristino completo di canvas, layer, maschere, riferimenti e immagine AI; versioni conservate in tdraw e autosave, Undo ripristina lo stato precedente. / Persistent bounded document versions with complete restoration and non-recursive capsules. Verifiche: lint, 99 test, build e smoke Electron nei temi chiaro/scuro. Versione `1.7.0`, checkpoint `milestone/C18`. Limite residuo: input penna/touch fisico non verificato. Release cumulativa a M19.

### C19 - Preset di stile realistico

- Versione finale: `1.8.0`.
- Branch: `milestone/19-realistic-style-presets`.
- Tag di checkpoint: `milestone/C19`.
- Tipo incremento: `+0.1.0`.
- Stato: completata con verifiche locali; CI e checkpoint verificati in chiusura.
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

Test richiesti: test mirati di logica e flussi interessati, `npm run lint`, `npm run test`, `npm run build` e verifica manuale della UI quando pertinente.

Documentazione da aggiornare: `README.md`, `ISTRUZIONI.md`, `INSTRUCTIONS.md`, `PLAN.md`, `AGENTS.md`, oltre a `SECURITY_MODEL.md` e `MAP.md` secondo le superfici e i moduli modificati.

Riepilogo (2026-10-02): Preset di stile bilingui con descrizioni, frammenti prompt e parametri OpenAI validati; preferito e stile personalizzato persistenti. Prompt privo di metadati progetto, guardia su credenziali accidentali e messaggi provider sanitizzati. / Configurable bilingual style presets, persistent favorite/custom styles and minimal generation payloads. Verifiche: lint, 117 test, build e smoke Electron nei temi chiaro/scuro. Versione `1.8.0`, checkpoint `milestone/C19`. Limite residuo: input penna/touch fisico non verificato. Release cumulativa a M19.



### C20 - Aggiornamento toolchain di sviluppo

- PR di riferimento: [#15](https://github.com/gloutchov/TrueDrawing/pull/15).
- Versione finale: `1.9.0`.
- Branch: `milestone/20-development-toolchain`.
- Tag di checkpoint: `milestone/C20`.
- Tipo incremento: `+0.1.0` (migrazione dello stack e compatibilita runtime/UI).
- Stato: completata; verifiche locali, CI e checkpoint controllati nel processo di chiusura.
- Obiettivo: Integrare i 14 aggiornamenti di sviluppo mantenendo compilazione, test, avvio Electron e packaging compatibili.

Attivita': Aggiornare Electron, electron-builder, Vite/plugin React, TypeScript, ESLint/typescript-eslint, tipi Node e comandi di sviluppo. Adeguare configurazioni e codice solo quando richiesto dalla migrazione; verificare installazione congelata e regression test.

Criteri di accettazione:

- Dipendenze coerenti, lockfile riproducibile e nessuna deroga a peer dependency, TLS o checksum.
- `npm run lint`, `npm run test`, `npm run build` e smoke Electron chiaro/scuro superati.
- Aggiornamenti mirati a documentazione, mappa e modello di sicurezza; nessun segreto introdotto.
- PR esistente aggiornata da un branch milestone con push fast-forward; CI PR e main verdi.
- Checkpoint annotato e tag versione verificati sul commit finale remoto prima della milestone successiva.
- Branch milestone e Dependabot eliminati solo dopo merge/verifiche e, per M22, dopo la release cumulativa.

Test richiesti: installazione `npm ci`, test esistenti e prove dei flussi interessati; nuovi test solo per incompatibilita corrette o regressioni significative.

Documenti: `README.md`, `ISTRUZIONI.md`, `INSTRUCTIONS.md`, `PLAN.md`, `AGENTS.md`, `MAP.md`, `SECURITY_MODEL.md`; note release finali a M22.

Release: nessuna release intermedia; packaging cumulativo a M22.

Riepilogo (2026-10-02): Toolchain aggiornata con Electron 44.4.5, Vite 8, Vitest 5 ed ESLint 10. TypeScript 6.0.3 e trattenuto sotto 6.1 per il supporto dichiarato di typescript-eslint; proposta TypeScript 7 rinviata. Config Vite ESM esplicita, compilazione Electron Node16/CommonJS, appunti PNG/testo asincroni con limiti e sanitizzazione senza cause private. Verifiche: npm ci, lint, 121 test, build e smoke Electron chiaro/scuro. Versione `1.9.0`, checkpoint `milestone/C20`. Generazione AI a pagamento e dispositivi fisici non verificati.

### C21 - Migrazione React e React DOM

- PR di riferimento: [#16](https://github.com/gloutchov/TrueDrawing/pull/16).
- Versione finale: `1.10.0`.
- Branch: `milestone/21-react-runtime`.
- Tag di checkpoint: `milestone/C21`.
- Tipo incremento: `+0.1.0` (migrazione dello stack e compatibilita runtime/UI).
- Stato: completata; verifiche locali, CI e checkpoint controllati nel processo di chiusura.
- Obiettivo: Aggiornare React DOM e i tipi, allineando anche React e i suoi tipi per evitare runtime e peer dependency incompatibili.

Attivita': Integrare React DOM 19 con React della stessa versione e tipi 19 compatibili; migrare i tipi JSX e i ref quando necessario. Verificare rendering, stato/history, dialoghi, eventi canvas e persistenza.

Criteri di accettazione:

- Dipendenze coerenti, lockfile riproducibile e nessuna deroga a peer dependency, TLS o checksum.
- `npm run lint`, `npm run test`, `npm run build` e smoke Electron chiaro/scuro superati.
- Aggiornamenti mirati a documentazione, mappa e modello di sicurezza; nessun segreto introdotto.
- PR esistente aggiornata da un branch milestone con push fast-forward; CI PR e main verdi.
- Checkpoint annotato e tag versione verificati sul commit finale remoto prima della milestone successiva.
- Branch milestone e Dependabot eliminati solo dopo merge/verifiche e, per M22, dopo la release cumulativa.

Test richiesti: installazione `npm ci`, test esistenti e prove dei flussi interessati; nuovi test solo per incompatibilita corrette o regressioni significative.

Documenti: `README.md`, `ISTRUZIONI.md`, `INSTRUCTIONS.md`, `PLAN.md`, `AGENTS.md`, `MAP.md`, `SECURITY_MODEL.md`; note release finali a M22.

Release: nessuna release intermedia; packaging cumulativo a M22.

Riepilogo (2026-10-02): React e React DOM allineati a 19.3.0 con tipi compatibili; componenti migrati al namespace JSX di React. La toolchain C20 resta preservata durante la risoluzione dei conflitti del lockfile; interazioni canvas, dialoghi e persistenza verificate nel renderer di produzione. Verifiche: npm ci, lint, 121 test, build e smoke Electron chiaro/scuro. Versione `1.10.0`, checkpoint `milestone/C21`. Generazione AI a pagamento e dispositivi fisici non verificati.

### C22 - Aggiornamento icone Lucide

- PR di riferimento: [#17](https://github.com/gloutchov/TrueDrawing/pull/17).
- Versione finale: `1.11.0`.
- Branch: `milestone/22-lucide-icons`.
- Tag di checkpoint: `milestone/C22`.
- Tipo incremento: `+0.1.0` (migrazione dello stack e compatibilita runtime/UI).
- Stato: completata; verifiche locali, CI e checkpoint controllati nel processo di chiusura.
- Obiettivo: Aggiornare la libreria icone mantenendo toolbar, pannelli, dialoghi e accessibilita leggibili nei due temi.

Attivita': Integrare lucide-react 1.48, verificare export e resa delle icone e correggere incompatibilita effettive. Eseguire regressioni Electron, generare una sola release cumulativa Windows/macOS 1.11.0 e scaricare/verificare pacchetti e SHA-256.

Criteri di accettazione:

- Dipendenze coerenti, lockfile riproducibile e nessuna deroga a peer dependency, TLS o checksum.
- `npm run lint`, `npm run test`, `npm run build` e smoke Electron chiaro/scuro superati.
- Aggiornamenti mirati a documentazione, mappa e modello di sicurezza; nessun segreto introdotto.
- PR esistente aggiornata da un branch milestone con push fast-forward; CI PR e main verdi.
- Checkpoint annotato e tag versione verificati sul commit finale remoto prima della milestone successiva.
- Branch milestone e Dependabot eliminati solo dopo merge/verifiche e, per M22, dopo la release cumulativa.

Test richiesti: installazione `npm ci`, test esistenti e prove dei flussi interessati; nuovi test solo per incompatibilita corrette o regressioni significative.

Documenti: `README.md`, `ISTRUZIONI.md`, `INSTRUCTIONS.md`, `PLAN.md`, `AGENTS.md`, `MAP.md`, `SECURITY_MODEL.md`; note release finali a M22.

Release: release cumulativa v1.11.0, artifact Windows/macOS non firmati e checksum SHA-256 verificati.

Riepilogo (2026-10-02): Lucide React aggiornato a 1.48.0 con React 19; export, toolbar, pannelli e icone SVG accessibili verificati nei temi chiaro/scuro. Migrazioni C20-C22 integrate preservando i commit Dependabot; release cumulativa Windows/macOS con pacchetti non firmati e verifica SHA-256 prevista nella chiusura. Verifiche: npm ci, lint, 121 test, build e smoke Electron chiaro/scuro. Versione `1.11.0`, checkpoint `milestone/C22`. Generazione AI a pagamento e dispositivi fisici non verificati.

## Rifiniture interfaccia e PR residua (2026-10-03)

Sei milestone in ordine. Deroga al controllo preventivo su commit, merge, tag, push e rimozione branch confermata dalla prosecuzione della richiesta del progettista; identita, verifiche e checkpoint remoti restano obbligatori. Nessuna release intermedia; una release cumulativa minore `v1.12.0` a M28 per le rifiniture UI, la semplificazione dei layer e il runtime aggiornato.

### C23 - Spaziatura del pannello Riferimenti

- Versione finale: `1.11.1`.
- Branch: `milestone/23-reference-panel-spacing`.
- Tag di checkpoint: `milestone/C23`.
- Tipo incremento: `+0.0.1` per l’intervento mirato.
- Stato: completata; verifiche locali, CI e checkpoint controllati nel processo di chiusura.
- Obiettivo: Allineare Importa riferimento a destra e distanziarlo da bordi e testo come Applica.

Attivita': Contenitore con padding condiviso; azione allineata a destra; import e controlli riferimenti funzionanti.

Criteri di accettazione: flusso interessato funzionante; margini e allineamento verificati in Electron, italiano/inglese e chiaro/scuro; lint, test e build verdi; documenti/versioni sincronizzati; CI PR e main verde; tag annotati verificati prima della milestone successiva.

Test richiesti: suite esistente e smoke mirato al comportamento; verifiche di compatibilita legacy a M25; npm ci e regressioni complete a M28. Nessun test unitario che replichi semplici regole CSS.

Documenti: README.md, ISTRUZIONI.md, INSTRUCTIONS.md, PLAN.md, AGENTS.md; MAP.md quando cambia la struttura; SECURITY_MODEL.md per compatibilita dei progetti/runtime e riferimenti di versione.

Release: nessuna; cumulativa a M28.

Riepilogo (2026-10-03): Importa riferimento allineato a destra; contenuto del pannello con padding 10/12 px e gap 8 px condivisi con Dimensioni canvas. Controlli e testo separati dai bordi. Verifiche: lint, 121 test, build e smoke Electron chiaro/scuro. Versione `1.11.1`, checkpoint `milestone/C23`. Generazione AI a pagamento e dispositivi fisici non verificati.

### C24 - Spaziatura del pulsante Crea versione

- Versione finale: `1.11.2`.
- Branch: `milestone/24-snapshot-action-spacing`.
- Tag di checkpoint: `milestone/C24`.
- Tipo incremento: `+0.0.1` per l’intervento mirato.
- Stato: completata; verifiche locali, CI e checkpoint controllati nel processo di chiusura.
- Obiettivo: Allineare Crea versione a destra con margini coerenti con Applica.

Attivita': Pulsante distanziato dai campi e dai bordi; creazione snapshot invariata.

Criteri di accettazione: flusso interessato funzionante; margini e allineamento verificati in Electron, italiano/inglese e chiaro/scuro; lint, test e build verdi; documenti/versioni sincronizzati; CI PR e main verde; tag annotati verificati prima della milestone successiva.

Test richiesti: suite esistente e smoke mirato al comportamento; verifiche di compatibilita legacy a M25; npm ci e regressioni complete a M28. Nessun test unitario che replichi semplici regole CSS.

Documenti: README.md, ISTRUZIONI.md, INSTRUCTIONS.md, PLAN.md, AGENTS.md; MAP.md quando cambia la struttura; SECURITY_MODEL.md per compatibilita dei progetti/runtime e riferimenti di versione.

Release: nessuna; cumulativa a M28.

Riepilogo (2026-10-03): Crea versione allineato a destra come Applica, con margine superiore 8 px, inferiore 12 px e laterale 10 px. Verifiche: lint, 121 test, build e smoke Electron chiaro/scuro. Versione `1.11.2`, checkpoint `milestone/C24`. Generazione AI a pagamento e dispositivi fisici non verificati.

### C25 - Rimozione dei comandi maschera

- Versione finale: `1.11.3`.
- Branch: `milestone/25-remove-mask-editor`.
- Tag di checkpoint: `milestone/C25`.
- Tipo incremento: `+0.0.1` per l’intervento mirato.
- Stato: completata; verifiche locali, CI e checkpoint controllati nel processo di chiusura.
- Obiettivo: Eliminare creazione e modifica delle maschere dall’interfaccia e dai percorsi di editing.

Attivita': Conservare validazione e rendering delle maschere legacy per riaprire i vecchi progetti senza perdita visiva; pannello dedicato al clipping; disegno e Undo verificati.

Criteri di accettazione: flusso interessato funzionante; margini e allineamento verificati in Electron, italiano/inglese e chiaro/scuro; lint, test e build verdi; documenti/versioni sincronizzati; CI PR e main verde; tag annotati verificati prima della milestone successiva.

Test richiesti: suite esistente e smoke mirato al comportamento; verifiche di compatibilita legacy a M25; npm ci e regressioni complete a M28. Nessun test unitario che replichi semplici regole CSS.

Documenti: README.md, ISTRUZIONI.md, INSTRUCTIONS.md, PLAN.md, AGENTS.md; MAP.md quando cambia la struttura; SECURITY_MODEL.md per compatibilita dei progetti/runtime e riferimenti di versione.

Release: nessuna; cumulativa a M28.

Riepilogo (2026-10-03): Rimossi creazione, attivazione, modifica e rimozione maschere e il relativo instradamento dei tratti. Conservati clipping e compatibilita di rendering/persistenza delle maschere legacy, anche in snapshot; i normali tratti non modificano le maschere precedenti. Verifiche: lint, 123 test, build e smoke Electron chiaro/scuro. Versione `1.11.3`, checkpoint `milestone/C25`. Generazione AI a pagamento e dispositivi fisici non verificati.

### C26 - Spaziatura Brush Avanzati

- Versione finale: `1.11.4`.
- Branch: `milestone/26-brush-panel-spacing`.
- Tag di checkpoint: `milestone/C26`.
- Tipo incremento: `+0.0.1` per l’intervento mirato.
- Stato: completata; verifiche locali, CI e checkpoint controllati nel processo di chiusura.
- Obiettivo: Dare spazio coerente a preset, texture e slider nel pannello Brush Avanzati.

Attivita': Riutilizzare padding e gap del pannello Dimensioni canvas; nessun overflow; valori e selezioni funzionanti.

Criteri di accettazione: flusso interessato funzionante; margini e allineamento verificati in Electron, italiano/inglese e chiaro/scuro; lint, test e build verdi; documenti/versioni sincronizzati; CI PR e main verde; tag annotati verificati prima della milestone successiva.

Test richiesti: suite esistente e smoke mirato al comportamento; verifiche di compatibilita legacy a M25; npm ci e regressioni complete a M28. Nessun test unitario che replichi semplici regole CSS.

Documenti: README.md, ISTRUZIONI.md, INSTRUCTIONS.md, PLAN.md, AGENTS.md; MAP.md quando cambia la struttura; SECURITY_MODEL.md per compatibilita dei progetti/runtime e riferimenti di versione.

Release: nessuna; cumulativa a M28.

Riepilogo (2026-10-03): Preset, texture e slider di Brush avanzati con padding laterale 10 px, gap 8 px e spazio verticale condivisi con gli altri pannelli; slider entro i bordi senza overflow. Verifiche: lint, 123 test, build e smoke Electron chiaro/scuro. Versione `1.11.4`, checkpoint `milestone/C26`. Generazione AI a pagamento e dispositivi fisici non verificati.

### M27 - Spaziatura campi Versioni documento

- Versione finale prevista: `1.11.5`.
- Branch previsto: `milestone/27-snapshot-fields-spacing`.
- Tag di checkpoint previsto: `milestone/C27`.
- Tipo incremento: `+0.0.1` per l’intervento mirato.
- Stato: pianificata.
- Obiettivo: Dare margini coerenti alla casella nome versione e ai campi delle versioni salvate.

Attivita': Contenitore uniforme; nomi, rinomina, ripristino e pulsanti leggibili nei due temi.

Criteri di accettazione: flusso interessato funzionante; margini e allineamento verificati in Electron, italiano/inglese e chiaro/scuro; lint, test e build verdi; documenti/versioni sincronizzati; CI PR e main verde; tag annotati verificati prima della milestone successiva.

Test richiesti: suite esistente e smoke mirato al comportamento; verifiche di compatibilita legacy a M25; npm ci e regressioni complete a M28. Nessun test unitario che replichi semplici regole CSS.

Documenti: README.md, ISTRUZIONI.md, INSTRUCTIONS.md, PLAN.md, AGENTS.md; MAP.md quando cambia la struttura; SECURITY_MODEL.md per compatibilita dei progetti/runtime e riferimenti di versione.

Release: nessuna; cumulativa a M28.

### M28 - Aggiornamento Electron e chiusura PR residua

- Versione finale prevista: `1.12.0`.
- Branch previsto: `milestone/28-electron-update`.
- Tag di checkpoint previsto: `milestone/C28`.
- Tipo incremento: `+0.1.0` per la versione cumulativa funzionale finale.
- Stato: pianificata.
- Obiettivo: Integrare PR #24 (Electron 44.5.0), completare le regressioni e distribuire i miglioramenti UI cumulativi.

Attivita': Preservare cronologia Dependabot; installazione congelata, IPC/appunti, compatibilità progetti, layout e packaging; rimuovere branch dopo merge/checkpoint e verifica release.

Criteri di accettazione: flusso interessato funzionante; margini e allineamento verificati in Electron, italiano/inglese e chiaro/scuro; lint, test e build verdi; documenti/versioni sincronizzati; CI PR e main verde; tag annotati verificati prima della milestone successiva.

Test richiesti: suite esistente e smoke mirato al comportamento; verifiche di compatibilita legacy a M25; npm ci e regressioni complete a M28. Nessun test unitario che replichi semplici regole CSS.

Documenti: README.md, ISTRUZIONI.md, INSTRUCTIONS.md, PLAN.md, AGENTS.md; MAP.md quando cambia la struttura; SECURITY_MODEL.md per compatibilita dei progetti/runtime e riferimenti di versione.

Release: v1.12.0 Windows/macOS non firmata, pacchetti e SHA-256 verificati; branch finale conservato fino al controllo asset.

PR di riferimento: [#24](https://github.com/gloutchov/TrueDrawing/pull/24).

## Fuori roadmap attiva

### Aggiornamenti automatici firmati

Gli aggiornamenti automatici firmati non sono inclusi nella roadmap attiva.

Motivo: al momento non sono disponibili credenziali o certificati per firma codice Windows, firma macOS e notarizzazione Apple. Finche' questa condizione non cambia, le release restano distribuite come artifact GitHub non firmati con checksum SHA-256 e documentazione sugli avvisi SmartScreen/Gatekeeper.

## Registro avanzamento

| Data | Milestone | Versione | Branch | Stato | Note |
| --- | --- | --- | --- | --- | --- |
| 2026-06-11 | Baseline stabile | 1.0.1 | `main` | Completata | Release `v1.0.1` pubblicata con artifact Windows/macOS non firmati, note release e checksum SHA-256. |
| 2026-06-11 | C11 - Roadmap post release e pulizia piano | 1.0.1 | `milestone/11-post-release-roadmap` | Completata | Piano storico sostituito da roadmap post release basata sul backlog; nessuna nuova release per modifica solo documentale. |
| 2026-06-12 | Patch tema scuro impostazioni | 1.0.2 | `patch/1.0.2-dark-settings` | Completata | PR #10, tag `v1.0.2` e release workflow `27415761496` verdi; corretta leggibilita' dei preset stile e della checkbox redraw automatico in tema scuro, rimosso dropdown stile duplicato e sostituito spinner numerico nativo. |
| 2026-09-17 | Patch dominio e link landing page | 1.0.3 | `patch/1.0.3-canonical-site-links` | Completata | Dichiarato il dominio personalizzato come canonical, aggiunto il link accessibile al sito principale e introdotto un controllo contro riferimenti al dominio GitHub Pages predefinito; verifiche automatiche e manuali completate. |
| 2026-09-27 | C12 - Manina e navigazione canvas | 1.1.0 | `milestone/12-canvas-hand-tool` | Completata | PR #12, 41 test, lint/build, CI PR e `main` verdi; pan locale verificato in Electron; `milestone/C12` e `v1.1.0` verificati sul remoto. |
| 2026-09-27 | C13 - Dimensioni canvas in pixel e centimetri | 1.2.0 | `milestone/13-canvas-dimensions` | Completata | PR #13, 49 test, lint/build, smoke test chiaro/scuro, CI PR e `main` verdi; checkpoint `milestone/C13` e release `v1.2.0` verificati. |
| 2026-10-02 | C15 - Brush avanzati e texture personalizzate | 1.4.0 | `milestone/15-advanced-brushes` | Completata | Preset brush bilingui da configurazione: grafite, morbido, marker, inchiostro e texture; controlli pressione, velocita, spaziatura e texture procedurali. Parametri immutabili nei tratti e persistenti nei file tdraw. / Configurable bilingual brush presets, pressure/speed/spacing and procedural texture controls; per-stroke parameters persist in tdraw. 79 test, lint/build e smoke; CI/checkpoint verificati nel processo di chiusura. |
| 2026-10-02 | C16 - Import immagini di riferimento | 1.5.0 | `milestone/16-reference-image-import` | Completata | Import locale PNG/JPEG/WebP da dialogo nativo controllato, normalizzazione PNG e limiti bytes/pixel. Riferimenti embedded separati con visibilita, opacita, posizione e scala: esclusi da export e AI. Caricamento immagini prima del rendering dopo riapertura. / Local dialog-controlled imports; embedded references with visibility, opacity, position and scale, excluded from exports and AI. 83 test, lint/build e smoke; CI/checkpoint verificati nel processo di chiusura. |
| 2026-10-02 | C17 - Maschere e clipping layer | 1.6.0 | `milestone/17-masks-clipping-layers` | Completata | Maschere non distruttive con editor, attivazione e rimozione; clipping con identita layer stabili, controllo cicli e pulizia relazioni alla cancellazione. Rendering condiviso per canvas/export/AI, undo/redo e persistenza tdraw. / Non-destructive editable masks, stable layer clipping with cycle validation, shared rendering, undo/redo and persistence. 93 test, lint/build e smoke; CI/checkpoint verificati nel processo di chiusura. |
| 2026-10-02 | C18 - Storia versioni del documento | 1.7.0 | `milestone/18-document-version-history` | Completata | Snapshot persistenti manuali/automatici, consultazione, rinomina, ripristino e cancellazione; capsule senza ricorsione e limiti numero/byte da configurazione. Ripristino completo di canvas, layer, maschere, riferimenti e immagine AI; versioni conservate in tdraw e autosave, Undo ripristina lo stato precedente. / Persistent bounded document versions with complete restoration and non-recursive capsules. 99 test, lint/build e smoke; CI/checkpoint verificati nel processo di chiusura. |
| 2026-10-02 | C19 - Preset di stile realistico | 1.8.0 | `milestone/19-realistic-style-presets` | Completata | Preset di stile bilingui con descrizioni, frammenti prompt e parametri OpenAI validati; preferito e stile personalizzato persistenti. Prompt privo di metadati progetto, guardia su credenziali accidentali e messaggi provider sanitizzati. / Configurable bilingual style presets, persistent favorite/custom styles and minimal generation payloads. 117 test, lint/build e smoke; CI/checkpoint verificati nel processo di chiusura. |
| 2026-10-02 | C20 - Aggiornamento toolchain di sviluppo | 1.9.0 | `milestone/20-development-toolchain` | Completata | Toolchain aggiornata con Electron 44.4.5, Vite 8, Vitest 5 ed ESLint 10. TypeScript 6.0.3 e trattenuto sotto 6.1 per il supporto dichiarato di typescript-eslint; proposta TypeScript 7 rinviata. Config Vite ESM esplicita, compilazione Electron Node16/CommonJS, appunti PNG/testo asincroni con limiti e sanitizzazione senza cause private. npm ci, 121 test, lint/build e smoke; CI/checkpoint verificati nel processo di chiusura. |
| 2026-10-02 | C21 - Migrazione React e React DOM | 1.10.0 | `milestone/21-react-runtime` | Completata | React e React DOM allineati a 19.3.0 con tipi compatibili; componenti migrati al namespace JSX di React. La toolchain C20 resta preservata durante la risoluzione dei conflitti del lockfile; interazioni canvas, dialoghi e persistenza verificate nel renderer di produzione. npm ci, 121 test, lint/build e smoke; CI/checkpoint verificati nel processo di chiusura. |
| 2026-10-02 | C22 - Aggiornamento icone Lucide | 1.11.0 | `milestone/22-lucide-icons` | Completata | Lucide React aggiornato a 1.48.0 con React 19; export, toolbar, pannelli e icone SVG accessibili verificati nei temi chiaro/scuro. Migrazioni C20-C22 integrate preservando i commit Dependabot; release cumulativa Windows/macOS con pacchetti non firmati e verifica SHA-256 prevista nella chiusura. npm ci, 121 test, lint/build e smoke; CI/checkpoint verificati nel processo di chiusura. |
| 2026-10-03 | C23 - Spaziatura del pannello Riferimenti | 1.11.1 | `milestone/23-reference-panel-spacing` | Completata | Importa riferimento allineato a destra; contenuto del pannello con padding 10/12 px e gap 8 px condivisi con Dimensioni canvas. Controlli e testo separati dai bordi. 121 test, lint/build e smoke; CI/checkpoint verificati nel processo di chiusura. |
| 2026-10-03 | C24 - Spaziatura del pulsante Crea versione | 1.11.2 | `milestone/24-snapshot-action-spacing` | Completata | Crea versione allineato a destra come Applica, con margine superiore 8 px, inferiore 12 px e laterale 10 px. 121 test, lint/build e smoke; CI/checkpoint verificati nel processo di chiusura. |
| 2026-10-03 | C25 - Rimozione dei comandi maschera | 1.11.3 | `milestone/25-remove-mask-editor` | Completata | Rimossi creazione, attivazione, modifica e rimozione maschere e il relativo instradamento dei tratti. Conservati clipping e compatibilita di rendering/persistenza delle maschere legacy, anche in snapshot; i normali tratti non modificano le maschere precedenti. 123 test, lint/build e smoke; CI/checkpoint verificati nel processo di chiusura. |
| 2026-10-03 | C26 - Spaziatura Brush Avanzati | 1.11.4 | `milestone/26-brush-panel-spacing` | Completata | Preset, texture e slider di Brush avanzati con padding laterale 10 px, gap 8 px e spazio verticale condivisi con gli altri pannelli; slider entro i bordi senza overflow. 123 test, lint/build e smoke; CI/checkpoint verificati nel processo di chiusura. |

## Checklist di chiusura milestone

Modello da applicare a ogni nuova milestone; gli esiti delle milestone chiuse sono registrati sopra. L'avallo preventivo e' stato esentato per questa esecuzione.

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
- [ ] Avallo esplicito del progettista ottenuto prima del merge.
- [ ] Commit finale creato.
- [ ] Pull request aperta verso `main`.
- [ ] CI verde.
- [ ] Merge su `main` completato.
- [ ] Tag annotato `milestone/C<numero>` creato sul commit finale di `main`, pubblicato e verificato sul remoto.
- [ ] Tag versione creato.
- [ ] Push di `main` e del tag versione verificato sul remoto, quando previsto.
- [ ] Release GitHub pubblicata con artifact Windows e macOS, quando prevista.
- [ ] Artifact scaricati e verificati, quando la release e' prevista.
- [ ] Branch milestone eliminato dopo release o dopo merge verificato.

Nota C16: lo smoke end-to-end ha identificato window.prompt non supportato nel salvataggio nuovo progetto; sostituito da ProjectNameDialog React bilingue e verificato con salvataggio reale.

Patch `1.5.1`: WebP decodificato dal canvas Chromium dopo verifica RIFF/dimensioni nel main e normalizzato a PNG, perche nativeImage non supporta questo formato. / WebP is decoded by Chromium Canvas after RIFF/dimension checks in main and normalized to PNG, because nativeImage does not support this format. 87 test, lint/build e smoke import WebP chiaro/scuro.
