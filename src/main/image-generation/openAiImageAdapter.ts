import { defaultMaxImageBytes, validateImageDataUrl } from "../../shared/security/imagePayload";
import { downloadRemoteImage } from "../security/remoteImage";
import { findStylePreset } from "../../shared/image-generation/stylePresets";
import { containsCredentialText } from "../../shared/security/credentialText";
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
  fetchImpl: FetchLike = fetch,
  downloadImage: typeof downloadRemoteImage = downloadRemoteImage
): Promise<RealisticImageResult> {
  if (!apiKey) {
    throw new Error("OpenAI API key is not configured.");
  }
  if (containsCredentialText(request.prompt) || containsCredentialText(request.model)) {
    throw new Error("Invalid image generation request.");
  }
  const preset = request.stylePresetId === undefined ? undefined
    : findStylePreset(config.imageGeneration.stylePresets ?? [], request.stylePresetId);
  if (request.stylePresetId !== undefined && !preset) throw new Error("Invalid image style preset.");

  const maxBytes = config.imageGeneration.maxImageBytes ?? defaultMaxImageBytes;
  validateImageDataUrl(request.canvasDataUrl, maxBytes);
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
    formData.append("size", preset?.parameters.size ?? config.imageGeneration.defaultSize);
    formData.append("quality", preset?.parameters.quality ?? config.imageGeneration.defaultQuality);
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
    const parsedResponse = await parseOpenAiImageResponse(response, Math.ceil(maxBytes / 3) * 4 + 65536);

    if (!response.ok) {
      throw new Error(sanitizeOpenAiError(parsedResponse, response.status));
    }

    const image = parsedResponse.data?.[0];
    const imageBase64 = image?.b64_json ?? (
      image?.url ? await downloadImage(image.url, config.imageGeneration.timeoutMs, maxBytes) : null
    );

    if (!imageBase64) {
      throw new Error("OpenAI did not return an image.");
    }

    validateImageDataUrl(`data:image/png;base64,${imageBase64}`, maxBytes);
    return {
      dataUrl: `data:image/png;base64,${imageBase64}`,
      provider: config.imageGeneration.defaultProvider,
      model: request.model,
      generatedAt: new Date().toISOString(),
      revisedPrompt: undefined
    };
  } catch (error: unknown) {
    throw createGenerationFailure(error);
  } finally {
    clearTimeout(timeout);
  }
}

function createGenerationFailure(error: unknown): Error {
  // Provider causes/stacks may hold secret headers; never preserve those chains.
  const message = error instanceof Error && /^OpenAI image generation failed with status \d+\.$/.test(error.message)
    ? error.message
    : error instanceof Error && error.name === "AbortError"
      ? "Image generation timed out." : "Image generation failed.";
  return new Error(message);
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const match = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);

  if (!match) {
    throw new Error("Canvas image data is invalid.");
  }

  return Uint8Array.from(Buffer.from(match[1], "base64"));
}

async function parseOpenAiImageResponse(response: Response, maxBytes: number): Promise<OpenAiImageResponse> {
  if (Number(response.headers.get("content-length") ?? 0) > maxBytes) throw new Error("Image response is too large.");
  const reader = response.body?.getReader();
  if (!reader) return {};
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const {value, done} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) { await reader.cancel(); throw new Error("Image response is too large."); }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as OpenAiImageResponse;
  } catch {
    return {};
  }
}

function sanitizeOpenAiError(_response: OpenAiImageResponse, status: number): string {
  return `OpenAI image generation failed with status ${status}.`;
}
