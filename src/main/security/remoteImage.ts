import { lookup } from "node:dns";
import { get } from "node:https";
import { isIP } from "node:net";

export function isPublicAddress(address: string): boolean {
  if (isIP(address) === 4) {
    const [a, b] = address.split(".").map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224
      || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254)
      || (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0))
      || (a === 198 && (b === 18 || b === 19)));
  }
  // Restrict IPv6 to global unicast; mapped IPv4, local, link-local and multicast are rejected.
  return isIP(address) === 6 && /^[23][0-9a-f]{3}:/i.test(address)
    && !/^2001:db8:/i.test(address);
}

export function validateRemoteImageUrl(value: string): URL {
  const url = new URL(value);
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443")
    || host === "localhost" || /\.(localhost|local|internal)$/i.test(host)
    || (isIP(host) && !isPublicAddress(host))) throw new Error("Remote image URL is not allowed.");
  return url;
}

export function downloadRemoteImage(value: string, timeoutMs: number, maxBytes: number): Promise<string> {
  const url = validateRemoteImageUrl(value);
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const request = get(url, {
      signal: controller.signal,
      // DNS is checked and pinned at connection time, preventing rebinding between validation and fetch.
      lookup(host, options, callback) {
        lookup(host, { ...options, all: true }, (error, addresses) => {
          if (error) { callback(error, "", 4); return; }
          if (!addresses.length || addresses.some(item => !isPublicAddress(item.address))) {
            callback(new Error("Remote image resolves to a blocked address."), "", 4); return;
          }
          if (options.all) callback(null, addresses);
          else callback(null, addresses[0].address, addresses[0].family);
        });
      }
    }, response => {
      if (response.statusCode !== 200 || Number(response.headers["content-length"] ?? 0) > maxBytes) {
        response.destroy(); reject(new Error("Remote image response is not allowed.")); return;
      }
      const chunks: Buffer[] = []; let size = 0;
      response.on("data", (chunk: Buffer) => {
        size += chunk.length;
        if (size > maxBytes) response.destroy(new Error("Remote image is too large."));
        else chunks.push(chunk);
      });
      response.on("error", reject);
      response.on("end", () => resolve(Buffer.concat(chunks).toString("base64")));
    });
    request.on("error", reject);
    request.on("close", () => clearTimeout(timer));
  });
}
