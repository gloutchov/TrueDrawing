import type { AppConfig } from "../../shared/config/appConfigSchema";
import type {
  RealisticImageRequest,
  RealisticImageResult
} from "../../shared/image-generation/imageGenerationTypes";

type OpenAiImageResponse = {
  data?: Array<{
    b64_json?: string;
    revised_prompt?: string;
    url?: string;
  }>;
  error?: {
    message?: string;
  };
};

type FetchLike = typeof fetch;

export async function generateOpenAiRealisticImage(
  request: RealisticImageRequest,
  apiKey: string,
  config: AppConfig,
  fetchImpl: FetchLike = fetch
): Promise<RealisticImageResult> {
  if (!apiKey) {
    throw new Error("OpenAI API key is not configured.");
  }

  const imageBytes = dataUrlToBytes(request.canvasDataUrl);
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), config.imageGeneration.timeoutMs);

  try {
    const imageBuffer = imageBytes.buffer.slice(
      imageBytes.byteOffset,
      imageBytes.byteOffset + imageBytes.byteLength
    ) as ArrayBuffer;
    const formData = new FormData();

    formData.append("model", request.model);
    formData.append("prompt", request.prompt);
    formData.append("size", config.imageGeneration.defaultSize);
    formData.append("quality", config.imageGeneration.defaultQuality);
    formData.append("output_format", config.imageGeneration.defaultOutputFormat);
    formData.append("image", new Blob([imageBuffer], { type: "image/png" }), "canvas.png");

    const response = await fetchImpl(`${config.imageGeneration.baseUrl}/images/edits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: formData,
      signal: abortController.signal
    });
    const parsedResponse = await parseOpenAiImageResponse(response);

    if (!response.ok) {
      throw new Error(sanitizeOpenAiError(parsedResponse, response.status));
    }

    const image = parsedResponse.data?.[0];
    const imageBase64 = image?.b64_json ?? (
      image?.url ? await fetchImageUrlAsBase64(image.url, fetchImpl) : null
    );

    if (!imageBase64) {
      throw new Error("OpenAI did not return an image.");
    }

    return {
      dataUrl: `data:image/png;base64,${imageBase64}`,
      provider: config.imageGeneration.defaultProvider,
      model: request.model,
      generatedAt: new Date().toISOString(),
      revisedPrompt: image?.revised_prompt
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(sanitizeErrorMessage(error.message));
    }

    throw new Error("Image generation failed.");
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchImageUrlAsBase64(imageUrl: string, fetchImpl: FetchLike): Promise<string | null> {
  const response = await fetchImpl(imageUrl);

  if (!response.ok) {
    return null;
  }

  const arrayBuffer = await response.arrayBuffer();

  return Buffer.from(arrayBuffer).toString("base64");
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const match = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);

  if (!match) {
    throw new Error("Canvas image data is invalid.");
  }

  return Uint8Array.from(Buffer.from(match[1], "base64"));
}

async function parseOpenAiImageResponse(response: Response): Promise<OpenAiImageResponse> {
  try {
    return await response.json() as OpenAiImageResponse;
  } catch {
    return {};
  }
}

function sanitizeOpenAiError(response: OpenAiImageResponse, status: number): string {
  const message = sanitizeErrorMessage(response.error?.message ?? "");

  if (message.length > 0) {
    return message;
  }

  return `OpenAI image generation failed with status ${status}.`;
}

function sanitizeErrorMessage(message: string): string {
  const withoutBearer = message.replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [redacted]");
  const withoutKeys = withoutBearer.replace(/sk-(proj-)?[A-Za-z0-9_-]+/g, "[redacted]");

  return withoutKeys || "Image generation failed.";
}
