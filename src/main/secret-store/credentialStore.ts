import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export type CredentialBackend =
  | "windows-credential-manager"
  | "macos-keychain"
  | "encrypted-local-storage";

export type CredentialStore = {
  backend: CredentialBackend;
  getPassword: (service: string, account: string) => string | null;
  setPassword: (service: string, account: string, password: string) => void;
  deletePassword: (service: string, account: string) => void;
};

type CommandResult = {
  status: number | null;
  stdout: string;
  stderr: string;
  error?: Error;
};

export type CommandRunner = (command: string, args: string[], input?: string) => CommandResult;

type CreateCredentialStoreOptions = {
  platform: NodeJS.Platform;
  userDataPath: string;
  runCommand?: CommandRunner;
  safeStorage?: SafeStorageAdapter;
};

type SafeStorageAdapter = {
  isEncryptionAvailable: () => boolean;
  encryptString: (plainText: string) => Buffer;
  decryptString: (encrypted: Buffer) => string;
};

type StoredSecret = {
  version: 1;
  encryptedPassword: string;
};

const fallbackDirectoryName = "encrypted-secret-store";

export function createCredentialStore({
  platform,
  userDataPath,
  runCommand = runCredentialCommand,
  safeStorage
}: CreateCredentialStoreOptions): CredentialStore {
  if (platform === "win32") {
    return createWindowsCredentialStore(runCommand);
  }

  if (platform === "darwin") {
    return createMacOsCredentialStore(runCommand);
  }

  if (!safeStorage) {
    throw new Error("Encrypted local credential storage requires safeStorage.");
  }

  return createEncryptedLocalCredentialStore(userDataPath, safeStorage);
}

function createWindowsCredentialStore(runCommand: CommandRunner): CredentialStore {
  return {
    backend: "windows-credential-manager",
    getPassword: (service, account) => {
      const result = runPowerShellCredentialCommand(runCommand, "get", service, account);

      assertCommandSucceeded(result, "Unable to read Windows Credential Manager.");

      return result.stdout.length > 0 ? result.stdout : null;
    },
    setPassword: (service, account, password) => {
      assertCommandSucceeded(
        runPowerShellCredentialCommand(runCommand, "set", service, account, password),
        "Unable to write Windows Credential Manager."
      );
    },
    deletePassword: (service, account) => {
      assertCommandSucceeded(
        runPowerShellCredentialCommand(runCommand, "delete", service, account),
        "Unable to delete Windows Credential Manager entry."
      );
    }
  };
}

function createMacOsCredentialStore(runCommand: CommandRunner): CredentialStore {
  return {
    backend: "macos-keychain",
    getPassword: (service, account) => {
      const result = runCommand("security", [
        "find-generic-password",
        "-a",
        account,
        "-s",
        service,
        "-w"
      ]);

      if (result.status === 44) {
        return null;
      }

      assertCommandSucceeded(result, "Unable to read macOS Keychain.");

      return result.stdout.replace(/\r?\n$/, "");
    },
    setPassword: (service, account, password) => {
      assertCommandSucceeded(
        runCommand("security", [
          "add-generic-password",
          "-U",
          "-a",
          account,
          "-s",
          service,
          "-w",
          password
        ]),
        "Unable to write macOS Keychain."
      );
    },
    deletePassword: (service, account) => {
      const result = runCommand("security", [
        "delete-generic-password",
        "-a",
        account,
        "-s",
        service
      ]);

      if (result.status !== 44) {
        assertCommandSucceeded(result, "Unable to delete macOS Keychain entry.");
      }
    }
  };
}

function createEncryptedLocalCredentialStore(
  userDataPath: string,
  safeStorage: SafeStorageAdapter
): CredentialStore {
  return {
    backend: "encrypted-local-storage",
    getPassword: (service, account) => {
      const credentialPath = getFallbackCredentialPath(userDataPath, service, account);

      if (!fs.existsSync(credentialPath) || !safeStorage.isEncryptionAvailable()) {
        return null;
      }

      try {
        const storedSecret = JSON.parse(fs.readFileSync(credentialPath, "utf8")) as Partial<StoredSecret>;

        if (storedSecret.version !== 1 || typeof storedSecret.encryptedPassword !== "string") {
          return null;
        }

        return safeStorage.decryptString(Buffer.from(storedSecret.encryptedPassword, "base64"));
      } catch {
        return null;
      }
    },
    setPassword: (service, account, password) => {
      if (!safeStorage.isEncryptionAvailable()) {
        throw new Error("Secure secret storage is not available on this system.");
      }

      const credentialPath = getFallbackCredentialPath(userDataPath, service, account);
      const encryptedPassword = safeStorage.encryptString(password).toString("base64");
      const storedSecret: StoredSecret = {
        version: 1,
        encryptedPassword
      };

      fs.mkdirSync(path.dirname(credentialPath), { recursive: true });
      fs.writeFileSync(credentialPath, JSON.stringify(storedSecret), { encoding: "utf8", mode: 0o600 });
    },
    deletePassword: (service, account) => {
      const credentialPath = getFallbackCredentialPath(userDataPath, service, account);

      if (fs.existsSync(credentialPath)) {
        fs.rmSync(credentialPath, { force: true });
      }
    }
  };
}

function getFallbackCredentialPath(userDataPath: string, service: string, account: string): string {
  const fileName = Buffer.from(`${service}:${account}`).toString("base64url");

  return path.join(userDataPath, fallbackDirectoryName, `${fileName}.json`);
}

function runPowerShellCredentialCommand(
  runCommand: CommandRunner,
  action: "get" | "set" | "delete",
  service: string,
  account: string,
  password = ""
): CommandResult {
  const script = createWindowsCredentialScript(action, service, account);
  const encodedScript = Buffer.from(script, "utf16le").toString("base64");

  return runCommand("powershell.exe", [
    "-NoProfile",
    "-NonInteractive",
    "-ExecutionPolicy",
    "Bypass",
    "-EncodedCommand",
    encodedScript
  ], password);
}

function runCredentialCommand(command: string, args: string[], input?: string): CommandResult {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    input,
    maxBuffer: 1024 * 1024,
    windowsHide: true
  });

  return {
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    error: result.error
  };
}

function assertCommandSucceeded(result: CommandResult, fallbackMessage: string): void {
  if (result.status === 0 && !result.error) {
    return;
  }

  throw new Error(sanitizeCredentialError(result.stderr || result.error?.message || fallbackMessage));
}

function sanitizeCredentialError(message: string): string {
  return message.replace(/sk-(proj-)?[A-Za-z0-9_-]+/g, "[redacted]").trim() || "Credential operation failed.";
}

function createWindowsCredentialScript(
  action: "get" | "set" | "delete",
  service: string,
  account: string
): string {
  return `
$ErrorActionPreference = "Stop"
$Action = ${JSON.stringify(action)}
$TargetName = ${JSON.stringify(service)}
$UserName = ${JSON.stringify(account)}

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

public static class TrueDrawingCredentials {
  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
  public struct CREDENTIAL {
    public UInt32 Flags;
    public UInt32 Type;
    public string TargetName;
    public string Comment;
    public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
    public UInt32 CredentialBlobSize;
    public IntPtr CredentialBlob;
    public UInt32 Persist;
    public UInt32 AttributeCount;
    public IntPtr Attributes;
    public string TargetAlias;
    public string UserName;
  }

  [DllImport("Advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
  public static extern bool CredWrite(ref CREDENTIAL Credential, UInt32 Flags);

  [DllImport("Advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
  public static extern bool CredRead(string Target, UInt32 Type, UInt32 Flags, out IntPtr CredentialPtr);

  [DllImport("Advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
  public static extern bool CredDelete(string Target, UInt32 Type, UInt32 Flags);

  [DllImport("Advapi32.dll", SetLastError = true)]
  public static extern void CredFree(IntPtr Buffer);
}
"@

$CRED_TYPE_GENERIC = 1
$CRED_PERSIST_LOCAL_MACHINE = 2
$ERROR_NOT_FOUND = 1168

if ($Action -eq "set") {
  $Secret = [Console]::In.ReadToEnd()
  $SecretBytes = [Text.Encoding]::Unicode.GetBytes($Secret)
  $SecretPointer = [Runtime.InteropServices.Marshal]::AllocHGlobal($SecretBytes.Length)

  try {
    [Runtime.InteropServices.Marshal]::Copy($SecretBytes, 0, $SecretPointer, $SecretBytes.Length)
    $Credential = New-Object TrueDrawingCredentials+CREDENTIAL
    $Credential.Type = $CRED_TYPE_GENERIC
    $Credential.TargetName = $TargetName
    $Credential.UserName = $UserName
    $Credential.CredentialBlob = $SecretPointer
    $Credential.CredentialBlobSize = $SecretBytes.Length
    $Credential.Persist = $CRED_PERSIST_LOCAL_MACHINE

    if (-not [TrueDrawingCredentials]::CredWrite([ref]$Credential, 0)) {
      throw "CredWrite failed: $([Runtime.InteropServices.Marshal]::GetLastWin32Error())"
    }
  } finally {
    [Runtime.InteropServices.Marshal]::FreeHGlobal($SecretPointer)
  }

  exit 0
}

if ($Action -eq "get") {
  $CredentialPointer = [IntPtr]::Zero

  if (-not [TrueDrawingCredentials]::CredRead($TargetName, $CRED_TYPE_GENERIC, 0, [ref]$CredentialPointer)) {
    $ErrorCode = [Runtime.InteropServices.Marshal]::GetLastWin32Error()
    if ($ErrorCode -eq $ERROR_NOT_FOUND) {
      exit 0
    }
    throw "CredRead failed: $ErrorCode"
  }

  try {
    $Credential = [Runtime.InteropServices.Marshal]::PtrToStructure($CredentialPointer, [type][TrueDrawingCredentials+CREDENTIAL])
    $SecretBytes = New-Object byte[] $Credential.CredentialBlobSize
    [Runtime.InteropServices.Marshal]::Copy($Credential.CredentialBlob, $SecretBytes, 0, $Credential.CredentialBlobSize)
    [Console]::Out.Write([Text.Encoding]::Unicode.GetString($SecretBytes))
  } finally {
    [TrueDrawingCredentials]::CredFree($CredentialPointer)
  }

  exit 0
}

if ($Action -eq "delete") {
  if (-not [TrueDrawingCredentials]::CredDelete($TargetName, $CRED_TYPE_GENERIC, 0)) {
    $ErrorCode = [Runtime.InteropServices.Marshal]::GetLastWin32Error()
    if ($ErrorCode -ne $ERROR_NOT_FOUND) {
      throw "CredDelete failed: $ErrorCode"
    }
  }

  exit 0
}

throw "Unsupported credential action."
`;
}
