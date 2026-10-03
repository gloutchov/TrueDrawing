# True Drawing - Piano post release

## Stato attuale

True Drawing ha completato C33 alla versione `1.12.2`: chiusura con conferma nativa per modifiche non salvate e stato corretto quando il disegno cambia durante un salvataggio. C29-C32 hanno riordinato sidebar, manuali, README e landing; la release `v1.12.2` distribuisce le correzioni con pacchetti Windows/macOS e checksum verificati.

- Versione corrente su `main`: `1.12.2`.
- Branch stabile: `main`.
- Ultima milestone completata: `C33 - Conferma di chiusura con modifiche non salvate`.
- Ultima patch completata: `v1.5.1 - Import WebP normalizzato via Chromium Canvas`.
- Patch corrente: nessuna.
- Release GitHub corrente: `v1.12.2`, pubblicata con artifact Windows/macOS non firmati, note release e checksum SHA-256.
- Milestone corrente in sviluppo: nessuna; C33 completata.

## Obiettivo della fase post release

La fase post release serve a far evolvere True Drawing da app stabile con flusso principale completo a strumento di disegno piu' maturo, estensibile e utile anche senza generazione AI.

Le priorita' sono:

- disporre i pannelli laterali secondo il flusso di lavoro richiesto;
- fornire manuali utente pratici e una presentazione GitHub orientata al prodotto;
- mostrare sul sito le funzioni di disegno con testi brevi e screenshot;
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

### C27 - Spaziatura campi Versioni documento

- Versione finale: `1.11.5`.
- Branch: `milestone/27-snapshot-fields-spacing`.
- Tag di checkpoint: `milestone/C27`.
- Tipo incremento: `+0.0.1` per l’intervento mirato.
- Stato: completata; verifiche locali, CI e checkpoint controllati nel processo di chiusura.
- Obiettivo: Dare margini coerenti alla casella nome versione e ai campi delle versioni salvate.

Attivita': Contenitore uniforme; nomi, rinomina, ripristino e pulsanti leggibili nei due temi.

Criteri di accettazione: flusso interessato funzionante; margini e allineamento verificati in Electron, italiano/inglese e chiaro/scuro; lint, test e build verdi; documenti/versioni sincronizzati; CI PR e main verde; tag annotati verificati prima della milestone successiva.

Test richiesti: suite esistente e smoke mirato al comportamento; verifiche di compatibilita legacy a M25; npm ci e regressioni complete a M28. Nessun test unitario che replichi semplici regole CSS.

Documenti: README.md, ISTRUZIONI.md, INSTRUCTIONS.md, PLAN.md, AGENTS.md; MAP.md quando cambia la struttura; SECURITY_MODEL.md per compatibilita dei progetti/runtime e riferimenti di versione.

Release: nessuna; cumulativa a M28.

Riepilogo (2026-10-03): Nome versione e rinomina delle versioni salvate con padding laterale 10 px e campi coerenti; contenuto e azioni separati da gap 8 px, Crea versione mantiene allineamento destro comune. Verifiche: lint, 123 test, build e smoke Electron chiaro/scuro. Versione `1.11.5`, checkpoint `milestone/C27`. Generazione AI a pagamento e dispositivi fisici non verificati.

### C28 - Aggiornamento Electron/Vitest e chiusura PR residua

- Versione finale: `1.12.0`.
- Branch: `milestone/28-electron-update`.
- Tag di checkpoint: `milestone/C28`.
- Tipo incremento: `+0.1.0` per la versione cumulativa funzionale finale.
- Stato: completata; verifiche locali, CI e checkpoint controllati nel processo di chiusura.
- Obiettivo: Integrare la PR corrente #30 (Electron 44.5.1 e Vitest 5.0.3), che sostituisce la PR #24 chiusa da Dependabot, preservare entrambe le cronologie, completare le regressioni e distribuire i miglioramenti UI cumulativi.

Attivita': Preservare cronologia Dependabot; installazione congelata, IPC/appunti, compatibilità progetti, layout e packaging; rimuovere branch dopo merge/checkpoint e verifica release.

Criteri di accettazione: flusso interessato funzionante; margini e allineamento verificati in Electron, italiano/inglese e chiaro/scuro; lint, test e build verdi; documenti/versioni sincronizzati; CI PR e main verde; tag annotati verificati prima della milestone successiva.

Test richiesti: suite esistente e smoke mirato al comportamento; verifiche di compatibilita legacy a M25; npm ci e regressioni complete a M28. Nessun test unitario che replichi semplici regole CSS.

Documenti: README.md, ISTRUZIONI.md, INSTRUCTIONS.md, PLAN.md, AGENTS.md; MAP.md quando cambia la struttura; SECURITY_MODEL.md per compatibilita dei progetti/runtime e riferimenti di versione.

Release: v1.12.0 Windows/macOS non firmata, pacchetti e SHA-256 verificati; branch finale conservato fino al controllo asset.

PR di riferimento: [#30](https://github.com/gloutchov/TrueDrawing/pull/30); sostituisce [#24](https://github.com/gloutchov/TrueDrawing/pull/24), chiusa da Dependabot durante M23-M27.

Riepilogo (2026-10-03): Integrate le cronologie delle PR Dependabot #24 e #30, che la sostituisce: Electron 44.5.1 e Vitest 5.0.3. Rifiniture M23-M27 e rimozione editor maschere distribuite in una release cumulativa Windows/macOS, con pacchetti e checksum verificati nel processo di chiusura. Verifiche: lint, 123 test, build e smoke Electron chiaro/scuro. Versione `1.12.0`, checkpoint `milestone/C28`. Generazione AI a pagamento e dispositivi fisici non verificati.

## Riordino interfaccia e documentazione prodotto (C29-C32)

Richiesta del progettista del 2026-10-03: preparare le milestone per riordinare la sidebar, trasformare i due manuali in guide d'uso, rendere il README una presentazione dell'app e arricchire la landing page. Esecuzione sequenziale completata su autorizzazione del progettista, con implementazione, verifiche e checkpoint remoto per ogni voce.

Ordine di esecuzione: M29, M30, M31, M32. Le guide descriveranno l'interfaccia dopo M29; README e landing useranno le spiegazioni verificate nei manuali. Restano valide la deroga gia concessa sul controllo preventivo prima di commit, merge, tag, push e rimozione branch e le verifiche di identita', CI e checkpoint remoto.

Convenzioni da applicare anche alle manutenzioni successive:

- `ISTRUZIONI.md` e `INSTRUCTIONS.md` sono manuali utente equivalenti IT/EN, organizzati per funzioni e operazioni, con esempi pratici.
- `README.md` presenta il prodotto e la sua architettura, con uso rapido e collegamenti ai documenti; descrive il comportamento del codice nello stesso commit senza riportare numeri di release dell'app o cronologie di milestone.
- Milestone, avanzamento e verifiche restano in `PLAN.md`; dettagli di ciascuna release nelle note release. Non aggiungere riepiloghi `C<n>` a README o manuali alla chiusura delle nuove milestone.
- La richiesta specifica sul README prevale sulle indicazioni generali di `STARTUP_PREFERENCES.md` che vi richiedono una versione. Le versioni canoniche restano in `VERSION`, manifest, lockfile e documenti operativi.

Versionamento della fase: C29 porta il sorgente a `1.12.1` (`+0.0.1`); C30-C32 mantengono quella versione perche' riguardano documentazione e sito. Ogni milestone ha il proprio checkpoint `milestone/C<n>`; il solo tag versione `v1.12.1` identifica il checkpoint finale C32, comprendendo manuali e README aggiornati. La richiesta iniziale si e' conclusa senza nuova release binaria, con `v1.12.0` ancora distribuita. Il progettista ha poi autorizzato esplicitamente la pubblicazione della release `v1.12.1`; l'esito e' registrato nella sezione dedicata. Le pubblicazioni del sito seguono la configurazione esistente.

### C29 - Ordine dei pannelli nella sidebar destra

- Versione finale: `1.12.1`.
- Branch: `milestone/29-sidebar-panel-order`.
- Tag di checkpoint: `milestone/C29`.
- Tipo incremento: `+0.0.1` per il riordino dell'interfaccia.
- Stato: completata; CI e checkpoint remoto verificati nel processo di chiusura.
- Obiettivo: mostrare i sette pannelli nell'ordine richiesto dal progettista.

Attivita':

1. Inspector.
2. Riferimenti.
3. Dimensioni Canvas.
4. Versioni Documento.
5. Brush Avanzati.
6. Layer.
7. Clipping su layer.

Riordinare i componenti della sidebar in `src/renderer/app/AppShell.tsx`, conservando le traduzioni dei titoli, i margini, i controlli e il comportamento dei singoli pannelli. Adeguare le descrizioni correnti dell'ordine nei manuali; la loro riorganizzazione completa segue in M30.

Criteri di accettazione: ordine visivo e DOM corrispondenti alla lista; navigazione da tastiera coerente; pannelli comprimibili e raggiungibili tramite scroll; riferimenti, dimensioni, versioni, brush, layer e clipping funzionanti, in italiano/inglese e nei temi chiaro/scuro.

Test richiesti: lint, suite esistente e build; smoke Electron dell'ordine dei sette pannelli, compressione/espansione, scroll e azioni principali. Non introdurre test unitari che replichino soltanto l'ordine del JSX.

Documenti: `PLAN.md`, `AGENTS.md`, `MAP.md`, passaggi d'uso pertinenti nei due manuali; README aggiornato solo se contiene una descrizione interessata, senza nuovi riepiloghi milestone. Sincronizzare i file canonici della versione e i riferimenti operativi; aggiornare `SECURITY_MODEL.md` solo per riferimenti correnti o cambi effettivi.

Release: nessuna; checkpoint C29, tag versione cumulativo alla chiusura di M32.

Riepilogo (2026-10-03): Sidebar nell’ordine Inspector, Riferimenti, Dimensioni canvas, Versioni documento, Brush avanzati, Layer e Clipping su layer; verificate tastiera, compressione/espansione, scroll, margini e regressioni documento in IT/EN e chiaro/scuro. Verifiche: lint, 123 test, build e controlli mirati descritti sopra. Versione `1.12.1`, checkpoint `milestone/C29`.

### C30 - Manuali utente italiano e inglese

- Versione finale: `1.12.1`, invariata rispetto a M29.
- Branch: `milestone/30-user-manuals`.
- Tag di checkpoint: `milestone/C30`.
- Tipo incremento: nessuno, documentazione senza modifiche al comportamento dell'app.
- Stato: completata; CI e checkpoint remoto verificati nel processo di chiusura.
- Obiettivo: consentire a un nuovo utente di imparare il programma attraverso `ISTRUZIONI.md` e `INSTRUCTIONS.md`.

Attivita':

- Riscrivere sommario e capitoli per requisiti, installazione, primo avvio, interfaccia, operazioni quotidiane e risoluzione dei problemi; verificare le istruzioni contro l'app corrente.
- Descrivere strumenti standard, selezione/appunti, zoom/manina, brush avanzati e texture, riferimenti, dimensioni/DPI, layer, clipping, versioni documento, Inspector e preferenze AI, lingua/tema.
- Spiegare salvataggio/apertura `.tdraw`, export, autosave/recupero e la differenza tra Undo/Redo e versioni persistenti del documento.
- Aggiungere esempi brevi passo per passo, compreso il clipping: disegnare una forma su Base, colorare su un altro layer, scegliere Base come riferimento e usare Nessuna per mostrare tutti i tratti. Spiegare anche il caso del riferimento vuoto o nascosto.
- Integrare nei capitoli le informazioni d'uso oggi disperse nelle sezioni storiche. La cronologia resta in PLAN e nelle note release; toolchain, migrazioni e verbali CI non diventano capitoli del manuale.
- Descrivere le funzioni presenti, con etichette e percorsi menu reali. Trattare la compatibilita' dei vecchi progetti nella sezione pertinente, senza presentare i comandi maschera rimossi come disponibili.
- Mantenere privacy, uso della API key, costi delle chiamate AI, avvisi di firma/checksum e limiti noti in termini utili all'utente. Usare link alle release senza fissare la guida a una release dell'app.

Criteri di accettazione: manuali equivalenti nelle due lingue, indice navigabile, capitoli per tutte le funzioni attive e procedura iniziale completa; esempio clipping comprensibile; ordine sidebar coerente con M29; nessuna sezione o nota di avanzamento basata su M/C o PR; collegamenti e immagini presenti.

Test richiesti: revisione incrociata IT/EN; controllo di link relativi, ancore, etichette e copertura delle funzioni; esecuzione dei passaggi rappresentativi nell'app con profili/disegni di prova, senza chiamate AI a pagamento. Lint, test e build secondo la checklist del repository, senza nuovi test applicativi per soli cambi di prosa.

Documenti: `ISTRUZIONI.md`, `INSTRUCTIONS.md`, `PLAN.md`, `AGENTS.md`, `MAP.md`; correggere gli eventuali link interessati in README e landing. Rimandi a `SECURITY_MODEL.md` per i dettagli tecnici di sicurezza.

Release: nessuna; solo checkpoint C30.

Riepilogo (2026-10-03): Manuali IT/EN riscritti per funzioni con indice navigabile, avvio e file, strumenti, riferimenti, layer, esempio cerchio/clipping, versioni, AI, recupero e troubleshooting. Verificate parita, link e procedure reali in entrambe le lingue e nei due temi; rimossa la cronologia di sviluppo dalle guide. Verifiche: lint, 123 test, build e controlli mirati descritti sopra. Versione `1.12.1`, checkpoint `milestone/C30`.

### C31 - README di presentazione del progetto

- Versione finale: `1.12.1`, invariata.
- Branch: `milestone/31-product-readme`.
- Tag di checkpoint: `milestone/C31`.
- Tipo incremento: nessuno, documentazione.
- Stato: completata; CI e checkpoint remoto verificati nel processo di chiusura.
- Obiettivo: presentare True Drawing su GitHub e orientare utenti e sviluppatori ai documenti appropriati.

Attivita':

- Riscrivere il README bilingue con descrizione dell'app, piattaforme, funzionalita', download/installazione, esempio di uso rapido, sicurezza/privacy essenziali e licenza.
- Spiegare in breve come e' fatta l'app: Electron main/preload, renderer React, canvas, moduli di documento/persistenza e configurazione centrale; rimandare a MAP per l'approfondimento.
- Conservare istruzioni essenziali per sviluppo locale, verifiche e packaging, coerenti con i manifest e i workflow reali.
- Inserire collegamenti navigabili ai manuali IT/EN, `SECURITY_MODEL.md`, `MAP.md`, `PLAN.md`, licenza, sito e pagina release; usare URL generali delle release.
- Rimuovere badge e numeri di versione dell'app, cronologie di milestone, verbali di migrazione/CI e riferimenti a una release specifica. Conservare i requisiti tecnici necessari per installare o sviluppare il programma.
- Descrivere cio' che e' implementato nello stesso snapshot del codice: ogni futura release eredita il README adeguato senza un aggiornamento cosmetico del numero versione.

Criteri di accettazione: presentazione leggibile su GitHub, sezioni IT/EN equivalenti e uso rapido chiaro; architettura corretta; collegamenti funzionanti; nessun numero di release dell'app, titolo M/C o riepilogo milestone. Roadmap e storia sono consultabili attraverso il link a PLAN.

Test richiesti: revisione del rendering Markdown e dei link/immagini; confronto delle affermazioni con codice, configurazione e manuali; verifica dei comandi documentati pertinenti, lint/test/build previsti dalla checklist. Nessun test applicativo aggiuntivo per soli cambi di prosa.

Documenti: `README.md`, `PLAN.md`, `AGENTS.md`, `MAP.md`; manuali solo per collegamenti incrociati o incongruenze emerse.

Release: nessuna; solo checkpoint C31.

Riepilogo (2026-10-03): README bilingue riscritto come presentazione del prodotto, con funzionalita, uso rapido, download generali, architettura, privacy, comandi e documenti collegati; rimossi badge/versioni app e cronologie. Verificati rendering GFM GitHub e browser, link/immagini e comandi; allineata nei manuali la disponibilita del solo installer Windows. Verifiche: lint, 123 test, build e controlli mirati descritti sopra. Versione `1.12.1`, checkpoint `milestone/C31`.

### C32 - Funzionalita' illustrate nella landing page

- Versione finale: `1.12.1`, invariata perche' cambia il sito di presentazione.
- Branch: `milestone/32-landing-features`.
- Tag di checkpoint: `milestone/C32`.
- Tipo incremento: nessuno per l'app; completamento del sito e della documentazione.
- Stato: completata; CI e checkpoint remoto verificati nel processo di chiusura.
- Obiettivo: far capire le possibilita' di disegno con una sezione breve e visiva dopo Interfaccia.

Attivita':

- Aggiungere tra Interfaccia e Download una sezione dedicata a brush standard, brush avanzati, layer e clipping.
- Per ogni funzione usare un titolo e una o due frasi semplici, nelle due lingue, coerenti con i manuali. Mostrare gli strumenti standard, preset/texture, organizzazione dei layer e colorazione entro una forma tramite clipping.
- Corredare le descrizioni con piccoli screenshot reali dei controlli o di un disegno dimostrativo nell'app aggiornata; catturare esempi privi di dati personali e API key. Rendere le immagini leggibili, ottimizzate e dotate di testi alternativi IT/EN.
- Riprendere tipografia, colori, spazi e ritmo della pagina esistente; adattare la sezione a desktop e mobile, con traduzioni integrate in `docs/landing.js` e asset locali in `docs/assets/`.
- Conservare il dominio canonico e i collegamenti esistenti a download, repository, manuali e sito principale. Usare la configurazione di pubblicazione gia presente.

Criteri di accettazione: sezione dopo Interfaccia e prima di Download; quattro funzioni riconoscibili senza termini tecnici superflui; screenshot corrispondenti all'app corrente; IT/EN completi; layout senza overflow o immagini deformate su mobile/tablet/desktop; navigazione da tastiera, contrasto e testi alternativi verificati.

Test richiesti: lint/test/build esistenti; controllo di parita' dei dizionari, asset/link e dominio canonico; verifica browser in entrambe le lingue a larghezze rappresentative, incluso mobile, con screenshot e controllo della leggibilita'. Verificare il sito pubblico quando la pubblicazione esistente ha applicato le modifiche; non aggiungere dipendenze o workflow per questa sola sezione.

Documenti: `docs/index.html`, `docs/landing.css`, `docs/landing.js`, screenshot in `docs/assets/`, `PLAN.md`, `AGENTS.md`, `MAP.md`; aggiornare i collegamenti o le descrizioni pertinenti in README/manuali senza aggiungere cronologia di milestone.

Release: nessuna nuova release binaria; checkpoint C32 e tag versione cumulativo `v1.12.1` sul commit finale verificato, comprensivo dei manuali e del README riscritti.

Riepilogo (2026-10-03): Landing bilingue arricchita dopo Interfaccia con brush standard, brush avanzati, layer e clipping: testi brevi, otto screenshot reali (circa 290 KB), immagini apribili a dimensione originale e link ai manuali. Verificate otto combinazioni browser IT/EN da 360 a 1440 px, proporzioni senza ingrandimenti, contrasto, tastiera, persistenza lingua, link/asset e assenza di overflow/errori. Pubblicazione verificata tramite GitHub Pages sul commit finale; la verifica HTTP diretta del dominio resta impedita dalla policy di rete cloud (403 del proxy). Verifiche: lint, 123 test, build e controlli mirati descritti sopra. Versione `1.12.1`, checkpoint `milestone/C32`.

## Pubblicazione release v1.12.1 (2026-10-03)

Stato: completata; workflow Release verde, asset/checksum verificati, documentazione e Pages verificati in chiusura. [Release pubblicata](https://github.com/gloutchov/TrueDrawing/releases/tag/v1.12.1).

Richiesta successiva del progettista: pubblicare i pacchetti della versione gia taggata e verificata. Nessun nuovo incremento dell'app o spostamento dei tag: `v1.12.1` e `milestone/C32` restano sul commit `8b87cf277f2b4d4cc16114ef6173c8acf4d2d281`.

- Branch documentale: `release/1.12.1-publication`, creato da main dopo C32.
- Workflow Release: run `37136552575`, eseguito sul tag v1.12.1; lint, 123 test e build prima del packaging.
- Distribuzione: installer Windows x64 e pacchetti DMG/ZIP macOS arm64, non firmati e non notarizzati.
- Verifica: download di tutti gli asset, confronto SHA-256 dei file elencati nei due manifest, ispezione di versione e contenuti dell'app macOS. Esito: 10 asset scaricati, 8 file coperti dai manifest SHA-256 verificati; Electron 44.5.1 e dipendenze React 19.3.0/Lucide 1.48.0 confermati. Renderer JS/CSS, main e preload corrispondono byte per byte alla build di produzione verificata. Versione/identificatore app macOS e contenitore DMG validi.
- Note bilingui: `docs/release-notes/v1.12.1.md`, applicate alla release dopo il packaging dal tag gia pubblicato.
- Documentazione: stato corrente aggiornato in PLAN/AGENTS/MAP/SECURITY; versione distribuita aggiornata nella landing, con CI e GitHub Pages verificati in chiusura. README e manuali mantengono il ruolo di presentazione e guide d'uso, senza cronologie.
- App e tag sorgente invariati; nessuna nuova milestone funzionale. Il branch di pubblicazione viene rimosso dopo verifiche e merge.

## Fuori roadmap attiva

### Aggiornamenti automatici firmati

Gli aggiornamenti automatici firmati non sono inclusi nella roadmap attiva.

Motivo: al momento non sono disponibili credenziali o certificati per firma codice Windows, firma macOS e notarizzazione Apple. Finche' questa condizione non cambia, le release restano distribuite come artifact GitHub non firmati con checksum SHA-256 e documentazione sugli avvisi SmartScreen/Gatekeeper.

## Correzione della chiusura dell'app

Il progettista segnala la chiusura bloccata da menu, pulsante finestra e icona e autorizza correzione, commit, merge, tag, push, release e rimozione del branch senza controllo preventivo. Non spostare i tag esistenti.

### C33 - Conferma di chiusura con modifiche non salvate

- Obiettivo: chiusura e uscita affidabili, con una scelta esplicita prima di perdere modifiche non salvate.
- Branch: `milestone/33-close-confirmation`.
- Tag di checkpoint: `milestone/C33`.
- Incremento versione: `+0.0.1`, da `1.12.1` a `1.12.2`.
- Release: `v1.12.2`, Windows x64 e macOS arm64, artifact non firmati e checksum SHA-256.
- Stato: completata; CI, checkpoint remoto, release e checksum verificati.

Attivita: riprodurre il veto `beforeunload` senza conferma, gestirlo nel processo main con un dialogo nativo IT/EN e annullamento predefinito; preservare il salvataggio e l'autosave. Verificare tutti i percorsi di chiusura, tentativi ripetuti, documento pulito, annullamento, rinuncia esplicita alle modifiche, salvataggio riuscito/cancellato/fallito e cambio lingua.

Criteri di accettazione:

- [x] Riproduzione del blocco sulla versione precedente documentata.
- [x] Nessun veto silenzioso quando il documento ha modifiche non salvate.
- [x] Annulla, Escape e chiusura del dialogo mantengono aperto il documento; solo la rinuncia esplicita consente l'uscita.
- [x] Documento salvato o iniziale chiuso senza conferma; autosave non considerato un salvataggio manuale.
- [x] Menu e chiusura finestra verificati con Electron reale; limiti del test Linux per Dock/pulsante rosso macOS dichiarati.
- [x] Test di regressione, lint, build e smoke IT/EN chiaro/scuro superati.
- [x] README, manuali, SECURITY_MODEL, MAP, AGENTS, PLAN e note release aggiornati secondo il loro ruolo.
- [x] CI su PR/main, checkpoint e tag versione remoto verificati; release e checksum controllati prima di eliminare il branch.

Riepilogo locale (2026-10-03): veto silenzioso riprodotto sulla precedente build per finestra, menu e app.quit. Aggiunta conferma nativa sincrona IT/EN; conservato il veto per annullamento/default, evitati dialoghi duplicati e autorizzazione persistente, finestra mostrata/ripristinata. Corretto lo stato pulito dopo un salvataggio concorrente a nuove modifiche. Lint, 130 test e build superati; 36 combinazioni Electron IT/EN chiaro/scuro con documento pulito/salvato/modificato e tentativi ripetuti; quattro scenari salvataggio annullato/fallito/concorrente e autosave reale; dialogo nativo con Escape e pulsante predefinito nelle due lingue. Dock/pulsante rosso e installazione/avvio nativi richiedono verifica su Mac/Windows. Versione 1.12.2, checkpoint milestone/C33 e release v1.12.2 verificati in chiusura.

Chiusura remota: PR #36 CI `37139643531` e main CI `37139735583` verdi. Tag annotati `milestone/C33` e `v1.12.2` sul commit `b2db4875e343eceab3f020c1a3b221fd8b768cef`, pubblicati e verificati senza spostare tag precedenti. Workflow Release `37139813245` dal tag verde; 10 asset scaricati e 8 file coperti dai manifest SHA-256 verificati. Il pacchetto macOS contiene main, gestore di chiusura, preload e renderer identici byte per byte alla build testata; versione/identificatore app, Electron 44.5.1 e contenitore DMG verificati. Note pubblicate identiche al documento versionato. Il branch documentale `release/1.12.2-publication` registra la chiusura e aggiorna la versione mostrata sul sito, con CI e Pages verificati sul commit finale; tag e codice della release restano invariati. I branch sono eliminati dopo la verifica di release, checksum e merge.

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
| 2026-10-03 | C27 - Spaziatura campi Versioni documento | 1.11.5 | `milestone/27-snapshot-fields-spacing` | Completata | Nome versione e rinomina delle versioni salvate con padding laterale 10 px e campi coerenti; contenuto e azioni separati da gap 8 px, Crea versione mantiene allineamento destro comune. 123 test, lint/build e smoke; CI/checkpoint verificati nel processo di chiusura. |
| 2026-10-03 | C28 - Aggiornamento Electron/Vitest e chiusura PR residua | 1.12.0 | `milestone/28-electron-update` | Completata | Integrate le cronologie delle PR Dependabot #24 e #30, che la sostituisce: Electron 44.5.1 e Vitest 5.0.3. Rifiniture M23-M27 e rimozione editor maschere distribuite in una release cumulativa Windows/macOS, con pacchetti e checksum verificati nel processo di chiusura. 123 test, lint/build e smoke; CI/checkpoint verificati nel processo di chiusura. |
| 2026-10-03 | C29 - Ordine dei pannelli nella sidebar destra | 1.12.1 | `milestone/29-sidebar-panel-order` | Completata | Sidebar nell’ordine Inspector, Riferimenti, Dimensioni canvas, Versioni documento, Brush avanzati, Layer e Clipping su layer; verificate tastiera, compressione/espansione, scroll, margini e regressioni documento in IT/EN e chiaro/scuro. Lint, 123 test, build e verifiche mirate; CI/checkpoint verificati in chiusura. |
| 2026-10-03 | C30 - Manuali utente italiano e inglese | 1.12.1 | `milestone/30-user-manuals` | Completata | Manuali IT/EN riscritti per funzioni con indice navigabile, avvio e file, strumenti, riferimenti, layer, esempio cerchio/clipping, versioni, AI, recupero e troubleshooting. Verificate parita, link e procedure reali in entrambe le lingue e nei due temi; rimossa la cronologia di sviluppo dalle guide. Lint, 123 test, build e verifiche mirate; CI/checkpoint verificati in chiusura. |
| 2026-10-03 | C31 - README di presentazione del progetto | 1.12.1 | `milestone/31-product-readme` | Completata | README bilingue riscritto come presentazione del prodotto, con funzionalita, uso rapido, download generali, architettura, privacy, comandi e documenti collegati; rimossi badge/versioni app e cronologie. Verificati rendering GFM GitHub e browser, link/immagini e comandi; allineata nei manuali la disponibilita del solo installer Windows. Lint, 123 test, build e verifiche mirate; CI/checkpoint verificati in chiusura. |
| 2026-10-03 | C32 - Funzionalita' illustrate nella landing page | 1.12.1 | `milestone/32-landing-features` | Completata | Landing bilingue arricchita dopo Interfaccia con brush standard, brush avanzati, layer e clipping: testi brevi, otto screenshot reali (circa 290 KB), immagini apribili a dimensione originale e link ai manuali. Verificate otto combinazioni browser IT/EN da 360 a 1440 px, proporzioni senza ingrandimenti, contrasto, tastiera, persistenza lingua, link/asset e assenza di overflow/errori. Pubblicazione verificata tramite GitHub Pages sul commit finale; la verifica HTTP diretta del dominio resta impedita dalla policy di rete cloud (403 del proxy). Lint, 123 test, build e verifiche mirate; CI/checkpoint verificati in chiusura. |
| 2026-10-03 | Pubblicazione v1.12.1 | 1.12.1 | `release/1.12.1-publication` | Completata | Release dal tag C32 invariato, workflow 37136552575 verde; 10 asset scaricati e 8 checksum verificati; note bilingui e stato/sito allineati. |
| 2026-10-03 | C33 - Conferma di chiusura con modifiche non salvate | 1.12.2 | `milestone/33-close-confirmation` | Completata | Veto silenzioso risolto con dialogo nativo IT/EN; nuove modifiche durante un salvataggio restano protette. Lint, 130 test, build, 36 scenari Electron e dialogo nativo; CI/checkpoint e release Windows/macOS con checksum verificati. |

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
