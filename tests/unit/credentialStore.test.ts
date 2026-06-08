import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  createCredentialStore,
  type CommandRunner
} from "../../src/main/secret-store/credentialStore";

describe("credential store", () => {
  it("writes Windows credentials through stdin instead of command arguments", () => {
    const secret = ["sk", "proj", "credential-store-test-secret-value"].join("-");
    const calls: Array<{ command: string; args: string[]; input?: string }> = [];
    const runCommand: CommandRunner = (command, args, input) => {
      calls.push({ command, args, input });

      return { status: 0, stdout: "", stderr: "" };
    };
    const store = createCredentialStore({
      platform: "win32",
      userDataPath: "unused",
      runCommand
    });

    store.setPassword("True Drawing", "openai", secret);

    expect(calls).toHaveLength(1);
    expect(calls[0].command).toBe("powershell.exe");
    expect(calls[0].args).not.toContain(secret);
    expect(calls[0].args).toContain("-EncodedCommand");
    expect(calls[0].input).toBe(secret);

    const encodedCommandIndex = calls[0].args.indexOf("-EncodedCommand") + 1;
    const decodedCommand = Buffer.from(calls[0].args[encodedCommandIndex], "base64").toString("utf16le");

    expect(decodedCommand).toContain('$Action = "set"');
    expect(decodedCommand).not.toContain(secret);
  });

  it("reads Windows credentials without exposing missing entries as errors", () => {
    const runCommand: CommandRunner = () => ({ status: 0, stdout: "", stderr: "" });
    const store = createCredentialStore({
      platform: "win32",
      userDataPath: "unused",
      runCommand
    });

    expect(store.getPassword("True Drawing", "openai")).toBeNull();
  });

  it("stores fallback credentials encrypted in local storage", () => {
    const secret = ["sk", "proj", "fallback-store-test-secret-value"].join("-");
    const userDataPath = fs.mkdtempSync(path.join(os.tmpdir(), "truedrawing-"));
    const store = createCredentialStore({
      platform: "linux",
      userDataPath,
      safeStorage: {
        isEncryptionAvailable: () => true,
        encryptString: (plainText) => Buffer.from([...plainText].reverse().join(""), "utf8"),
        decryptString: (encrypted) => [...encrypted.toString("utf8")].reverse().join("")
      }
    });

    store.setPassword("True Drawing", "openai", secret);

    const storedFiles = fs.readdirSync(path.join(userDataPath, "encrypted-secret-store"));
    const storedContent = fs.readFileSync(
      path.join(userDataPath, "encrypted-secret-store", storedFiles[0]),
      "utf8"
    );

    expect(storedContent).not.toContain(secret);
    expect(store.getPassword("True Drawing", "openai")).toBe(secret);
  });
});
