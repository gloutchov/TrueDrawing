const translations = {
  en: {
    navGallery: "Gallery",
    navDownload: "Download",
    releaseKicker: "Open Source Desktop App",
    heroCopy: "Draw a rough idea locally, then turn it into a polished image with AI.",
    downloadCta: "Download",
    repoCta: "GitHub Repository",
    factVersionLabel: "Version",
    factPlatformsLabel: "Platforms",
    factLicenseLabel: "License",
    highlightLocal: "Your drawing and the generated image are always safe thanks to autosave. Your files always stay on your computer.",
    highlightTools: "All essential drawing tools are available: brushes, geometric shapes, stroke types, fill, thickness and opacity controls... and much more!",
    highlightRelease: "You choose when AI generates the image: immediately, automatically while you draw, or with one click, manually, when you decide.",
    galleryEyebrow: "Interface",
    galleryTitle: "A simple and immediate drawing workspace",
    galleryCopy:
      "Drawing is as simple as using a pencil on paper. Use a mouse, trackpad, or even a graphics pen. You do not need to be an artist. You do not need to be a designer. You do not need any experience. The less you know, the more fun you have!",
    downloadEyebrow: "Download and Code",
    downloadTitle: "Download the build or explore the repository.",
    downloadCopy:
      "Public builds are available in GitHub Releases. The source code, user documentation, and security model are in the repository.",
    releaseCta: "Releases",
    sourceCta: "Source Code",
    manualCta: "Manual",
    footerRepo: "GitHub repository",
    heroAlt: "True Drawing interface with a sketch and generated image preview",
    gifAlt: "Animated preview of True Drawing transforming a sketch into an image",
    interfaceDarkAlt: "True Drawing English interface in dark theme",
    interfaceLightAlt: "True Drawing English interface in light theme",
    drawingDarkAlt: "True Drawing English drawing view in dark theme",
    drawingLightAlt: "True Drawing English drawing view in light theme"
  },
  it: {
    navGallery: "Galleria",
    navDownload: "Download",
    releaseKicker: "Desktop APP Open Source",
    heroCopy:
      "Disegna un'idea grezza in locale, poi trasformala in un'immagine rifinita con la AI.",
    downloadCta: "Download",
    repoCta: "Repository Github",
    factVersionLabel: "Versione",
    factPlatformsLabel: "Piattaforme",
    factLicenseLabel: "Licenza",
    highlightLocal: "Il tuo disegno, e l'immagine generata, sono sempre al sicuro grazie al salvataggio automatico. I tuoi files sono sempre sul tuo computer.",
    highlightTools: "Tutti i tool fondamentali per il disegno sono a tua disposizione: Pennelli, Figure Geometriche, Tipi di tratto, Riempimento, regolazioni di spessore, di opacità... e tanto altro!",
    highlightRelease: "Scegli tu quando la AI andrà a generare l'immagine: subito, in automatico, mentre disegni; oppure con un click, manualmente, quando decidi tu.",
    galleryEyebrow: "Interfaccia",
    galleryTitle: "Uno spazio di disegno semplice e immediato",
    galleryCopy:
      "Disegnare è semplice come con una matita su un foglio. Usa il mouse, il trackpad, o anche una penna grafica. Non serve essere artisti. Non serve essere disegnatori. Non serve avere alcuna esperienza. Meno sai, più ti diverti!",
    downloadEyebrow: "Download e Codice",
    downloadTitle: "Scarica la build o esplora il repository.",
    downloadCopy:
      "Le build pubbliche sono disponibili nelle GitHub Releases. Il codice sorgente, la documentazione utente e il modello di sicurezza sono nel repository.",
    releaseCta: "Releases",
    sourceCta: "Codice Sorgente",
    manualCta: "Manuale",
    footerRepo: "Repository GitHub",
    heroAlt: "Interfaccia di True Drawing con schizzo e anteprima immagine generata",
    gifAlt: "Anteprima animata di True Drawing che trasforma uno schizzo in immagine",
    interfaceDarkAlt: "Interfaccia italiana di True Drawing in tema scuro",
    interfaceLightAlt: "Interfaccia italiana di True Drawing in tema chiaro",
    drawingDarkAlt: "Vista disegno italiana di True Drawing in tema scuro",
    drawingLightAlt: "Vista disegno italiana di True Drawing in tema chiaro"
  }
};

const elements = Array.from(document.querySelectorAll("[data-i18n]"));
const buttons = Array.from(document.querySelectorAll("[data-lang]"));

function initialLanguage() {
  const stored = window.localStorage.getItem("truedrawing-landing-language");
  if (stored === "it" || stored === "en") {
    return stored;
  }

  return window.navigator.language.toLowerCase().startsWith("it") ? "it" : "en";
}

function setLanguage(language) {
  const copy = translations[language] || translations.en;
  document.documentElement.lang = language;

  for (const element of elements) {
    const key = element.dataset.i18n;
    if (key && copy[key]) {
      element.textContent = copy[key];
    }
  }

  const heroImage = document.querySelector(".hero-image");
  heroImage?.setAttribute("src", language === "it" ? "./assets/disegno_it_black.png" : "./assets/disegno_en_black.png");
  heroImage?.setAttribute("alt", copy.heroAlt);
  document.querySelector(".media-feature img")?.setAttribute("alt", copy.gifAlt);

  const languageSuffix = language === "it" ? "it" : "en";
  const interfaceThumb = document.querySelector('[data-shot="interface"]');
  const drawingThumb = document.querySelector('[data-shot="drawing"]');
  interfaceThumb?.querySelector(".thumb-dark")?.setAttribute("src", `./assets/interfaccia_${languageSuffix}_black.png`);
  interfaceThumb?.querySelector(".thumb-dark")?.setAttribute("alt", copy.interfaceDarkAlt);
  interfaceThumb?.querySelector(".thumb-light")?.setAttribute("src", `./assets/interfaccia_${languageSuffix}_white.png`);
  drawingThumb?.querySelector(".thumb-dark")?.setAttribute("src", `./assets/disegno_${languageSuffix}_black.png`);
  drawingThumb?.querySelector(".thumb-dark")?.setAttribute("alt", copy.drawingDarkAlt);
  drawingThumb?.querySelector(".thumb-light")?.setAttribute("src", `./assets/disegno_${languageSuffix}_white.png`);

  const manualLink = document.querySelector("[data-manual-link]");
  manualLink?.setAttribute(
    "href",
    language === "it"
      ? "https://github.com/gloutchov/truedrawing/blob/main/ISTRUZIONI.md"
      : "https://github.com/gloutchov/truedrawing/blob/main/INSTRUCTIONS.md"
  );

  for (const button of buttons) {
    button.setAttribute("aria-pressed", button.dataset.lang === language ? "true" : "false");
  }

  window.localStorage.setItem("truedrawing-landing-language", language);
}

for (const button of buttons) {
  button.addEventListener("click", () => {
    const language = button.dataset.lang === "it" ? "it" : "en";
    setLanguage(language);
  });
}

setLanguage(initialLanguage());
