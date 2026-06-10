export type ApiKeyStatus = {
  configured: boolean;
  backend: string;
};

export type ImageGenerationPreferences = {
  model: string;
  style: string;
  autoRedrawEnabled: boolean;
  autoRedrawDelaySeconds: number;
};

export type RealisticImageRequest = {
  canvasDataUrl: string;
  model: string;
  prompt: string;
};

export type RealisticImageResult = {
  dataUrl: string;
  provider: string;
  model: string;
  generatedAt: string;
  revisedPrompt?: string;
};

export type StoredRealisticImage = RealisticImageResult;
