export type ApiKeyStatus = {
  configured: boolean;
  backend: string;
};

export type ImageGenerationPreferences = {
  model: string;
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

export type ImageGenerationIpcError = {
  message: string;
};
