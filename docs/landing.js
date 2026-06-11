const translations = {
  en: {
    navGallery: "Gallery",
    navDownload: "Download",
    navRepo: "Repository",
    releaseKicker: "Version 1.0.0 for Windows and macOS",
    heroCopy: "Draw a rough idea locally, then turn it into a polished image with your own OpenAI API key.",
    downloadCta: "Download v1.0.0",
    repoCta: "View source",
    highlightLocal: "Local sketch files, autosave, recovery, and export stay on your computer.",
    highlightTools: "Brushes, layers, fill, selection, undo/redo, and canvas zoom are ready to use.",
    highlightRelease: "Unsigned GitHub builds include SHA-256 checksums for verification.",
    galleryEyebrow: "Interface",
    galleryTitle: "A focused drawing workspace",
    galleryCopy:
      "The landing page uses the real application screenshots prepared for Italian and English, light and dark themes.",
    captionItDark: "Italian interface, dark theme",
    captionEnLight: "English interface, light theme",
    captionDrawingLight: "Drawing and generated image, light theme",
    captionDrawingDark: "Drawing and generated image, dark theme",
    downloadEyebrow: "Release",
    downloadTitle: "Download True Drawing v1.0.0",
    downloadCopy:
      "Builds are distributed through GitHub for Windows and macOS. They are not signed or notarized, so SmartScreen or Gatekeeper may warn on first launch.",
    releaseCta: "Open release",
    checksumWindowsCta: "Windows checksums",
    checksumMacCta: "macOS checksums",
    footerRepo: "GitHub repository",
    heroAlt: "True Drawing interface with a sketch and generated image preview",
    gifAlt: "Animated preview of True Drawing transforming a sketch into an image",
    itDarkAlt: "True Drawing Italian interface in dark theme",
    enLightAlt: "True Drawing English interface in light theme",
    drawingLightAlt: "True Drawing Italian drawing view in light theme",
    drawingDarkAlt: "True Drawing English drawing view in dark theme"
  },
  it: {
    navGallery: "Galleria",
    navDownload: "Download",
    navRepo: "Repository",
    releaseKicker: "Versione 1.0.0 per Windows e macOS",
    heroCopy:
      "Disegna un'idea grezza in locale, poi trasformala in un'immagine rifinita con la tua API key OpenAI.",
    downloadCta: "Scarica v1.0.0",
    repoCta: "Vedi sorgente",
    highlightLocal: "File disegno, autosave, recupero ed export restano sul tuo computer.",
    highlightTools: "Pennelli, layer, riempimento, selezione, undo/redo e zoom canvas sono pronti all'uso.",
    highlightRelease: "Le build GitHub non firmate includono checksum SHA-256 per la verifica.",
    galleryEyebrow: "Interfaccia",
    galleryTitle: "Uno spazio di disegno concentrato",
    galleryCopy:
      "La landing page usa gli screenshot reali dell'app preparati in italiano e inglese, tema chiaro e scuro.",
    captionItDark: "Interfaccia italiana, tema scuro",
    captionEnLight: "Interfaccia inglese, tema chiaro",
    captionDrawingLight: "Disegno e immagine generata, tema chiaro",
    captionDrawingDark: "Disegno e immagine generata, tema scuro",
    downloadEyebrow: "Release",
    downloadTitle: "Scarica True Drawing v1.0.0",
    downloadCopy:
      "Le build sono distribuite tramite GitHub per Windows e macOS. Non sono firmate o notarizzate, quindi SmartScreen o Gatekeeper possono mostrare un avviso al primo avvio.",
    releaseCta: "Apri release",
    checksumWindowsCta: "Checksum Windows",
    checksumMacCta: "Checksum macOS",
    footerRepo: "Repository GitHub",
    heroAlt: "Interfaccia di True Drawing con schizzo e anteprima immagine generata",
    gifAlt: "Anteprima animata di True Drawing che trasforma uno schizzo in immagine",
    itDarkAlt: "Interfaccia italiana di True Drawing in tema scuro",
    enLightAlt: "Interfaccia inglese di True Drawing in tema chiaro",
    drawingLightAlt: "Vista disegno italiana di True Drawing in tema chiaro",
    drawingDarkAlt: "Vista disegno inglese di True Drawing in tema scuro"
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
  const heroSource = document.querySelector(".hero source");
  heroImage?.setAttribute("src", language === "it" ? "./assets/disegno_it_black.png" : "./assets/disegno_en_black.png");
  heroImage?.setAttribute("alt", copy.heroAlt);
  heroSource?.setAttribute(
    "srcset",
    language === "it" ? "./assets/interfaccia_it_black.png" : "./assets/interfaccia_en_black.png"
  );
  document.querySelector(".media-feature img")?.setAttribute("alt", copy.gifAlt);
  document.querySelector('img[src="./assets/interfaccia_it_black.png"]')?.setAttribute("alt", copy.itDarkAlt);
  document.querySelector('img[src="./assets/interfaccia_en_white.png"]')?.setAttribute("alt", copy.enLightAlt);
  document.querySelector('img[src="./assets/disegno_it_white.png"]')?.setAttribute("alt", copy.drawingLightAlt);
  document.querySelector('img[src="./assets/disegno_en_black.png"]')?.setAttribute("alt", copy.drawingDarkAlt);

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
