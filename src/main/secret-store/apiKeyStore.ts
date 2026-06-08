import { app, safeStorage } from "electron";

import {
  createCredentialStore,
  type CredentialBackend,
  type CredentialStore
} from "./credentialStore";

const openAiCredentialService = "True Drawing OpenAI API Key";
const openAiCredentialAccount = "openai";

export type ApiKeyStore = {
  hasOpenAiApiKey: () => boolean;
  getOpenAiApiKey: () => string | null;
  setOpenAiApiKey: (apiKey: string) => void;
  clearOpenAiApiKey: () => void;
  getStorageBackend: () => CredentialBackend;
};

export function createApiKeyStore(credentialStore = createCredentialStore({
  platform: process.platform,
  userDataPath: app.getPath("userData"),
  safeStorage
})): ApiKeyStore {
  return {
    hasOpenAiApiKey: () => hasOpenAiApiKey(credentialStore),
    getOpenAiApiKey: () => getOpenAiApiKey(credentialStore),
    setOpenAiApiKey: (apiKey) => setOpenAiApiKey(credentialStore, apiKey),
    clearOpenAiApiKey: () => clearOpenAiApiKey(credentialStore),
    getStorageBackend: () => credentialStore.backend
  };
}

function hasOpenAiApiKey(credentialStore: CredentialStore): boolean {
  return getOpenAiApiKey(credentialStore) !== null;
}

function getOpenAiApiKey(credentialStore: CredentialStore): string | null {
  return credentialStore.getPassword(openAiCredentialService, openAiCredentialAccount);
}

function setOpenAiApiKey(credentialStore: CredentialStore, apiKey: string): void {
  const trimmedApiKey = apiKey.trim();

  if (!isLikelyOpenAiApiKey(trimmedApiKey)) {
    throw new Error("The OpenAI API key format is not valid.");
  }

  credentialStore.setPassword(openAiCredentialService, openAiCredentialAccount, trimmedApiKey);
}

function clearOpenAiApiKey(credentialStore: CredentialStore): void {
  credentialStore.deletePassword(openAiCredentialService, openAiCredentialAccount);
}

function isLikelyOpenAiApiKey(apiKey: string): boolean {
  return /^(sk-|sk-proj-)[A-Za-z0-9_-]{20,}$/.test(apiKey);
}
