import { app, safeStorage } from "electron";
import fs from "node:fs";
import path from "node:path";

type StoredSecret = {
  version: 1;
  encryptedApiKey: string;
};

const secretDirectoryName = "secrets";
const openAiSecretFileName = "openai-api-key.json";

export type ApiKeyStore = {
  hasOpenAiApiKey: () => boolean;
  getOpenAiApiKey: () => string | null;
  setOpenAiApiKey: (apiKey: string) => void;
  clearOpenAiApiKey: () => void;
};

export function createApiKeyStore(): ApiKeyStore {
  return {
    hasOpenAiApiKey,
    getOpenAiApiKey,
    setOpenAiApiKey,
    clearOpenAiApiKey
  };
}

function hasOpenAiApiKey(): boolean {
  return getOpenAiApiKey() !== null;
}

function getOpenAiApiKey(): string | null {
  const secretPath = getOpenAiSecretPath();

  if (!fs.existsSync(secretPath) || !safeStorage.isEncryptionAvailable()) {
    return null;
  }

  try {
    const storedSecret = JSON.parse(fs.readFileSync(secretPath, "utf8")) as Partial<StoredSecret>;

    if (storedSecret.version !== 1 || typeof storedSecret.encryptedApiKey !== "string") {
      return null;
    }

    return safeStorage.decryptString(Buffer.from(storedSecret.encryptedApiKey, "base64"));
  } catch {
    return null;
  }
}

function setOpenAiApiKey(apiKey: string): void {
  const trimmedApiKey = apiKey.trim();

  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error("Secure secret storage is not available on this system.");
  }

  if (!isLikelyOpenAiApiKey(trimmedApiKey)) {
    throw new Error("The OpenAI API key format is not valid.");
  }

  const secretDirectory = getSecretDirectory();
  const secretPath = getOpenAiSecretPath();
  const encryptedApiKey = safeStorage.encryptString(trimmedApiKey).toString("base64");
  const storedSecret: StoredSecret = {
    version: 1,
    encryptedApiKey
  };

  fs.mkdirSync(secretDirectory, { recursive: true });
  fs.writeFileSync(secretPath, JSON.stringify(storedSecret), { encoding: "utf8", mode: 0o600 });
}

function clearOpenAiApiKey(): void {
  const secretPath = getOpenAiSecretPath();

  if (fs.existsSync(secretPath)) {
    fs.rmSync(secretPath, { force: true });
  }
}

function getSecretDirectory(): string {
  return path.join(app.getPath("userData"), secretDirectoryName);
}

function getOpenAiSecretPath(): string {
  return path.join(getSecretDirectory(), openAiSecretFileName);
}

function isLikelyOpenAiApiKey(apiKey: string): boolean {
  return /^(sk-|sk-proj-)[A-Za-z0-9_-]{20,}$/.test(apiKey);
}
