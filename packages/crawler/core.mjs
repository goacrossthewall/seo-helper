import { isIP } from "node:net";

export const TRACKING_PARAMETERS = new Set([
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid",
]);

/** Normalize a crawl target while preserving parameters that can change content. */
export function normalizeUrl(input, base) {
  const url = new URL(input, base);
  url.hash = "";
  url.hostname = url.hostname.toLowerCase();
  url.protocol = url.protocol.toLowerCase();
  for (const key of [...url.searchParams.keys()]) {
    if (TRACKING_PARAMETERS.has(key.toLowerCase())) url.searchParams.delete(key);
  }
  url.searchParams.sort();
  if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/, "");
  if ((url.protocol === "https:" && url.port === "443") || (url.protocol === "http:" && url.port === "80")) url.port = "";
  return url.toString();
}

export function isSameDomain(candidate, root) {
  return new URL(candidate).hostname === new URL(root).hostname;
}

function isPrivateIpv4(hostname) {
  const parts = hostname.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  return parts[0] === 10 || parts[0] === 127 || (parts[0] === 169 && parts[1] === 254) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168);
}

/** Reject obvious local/private targets before DNS resolution. Resolved addresses must be checked again by the fetch worker. */
export function assertSafeCrawlUrl(input) {
  const url = new URL(input);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only HTTP and HTTPS URLs are supported");
  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "::1" || hostname.startsWith("fc") || hostname.startsWith("fd")) {
    throw new Error("Local and private crawl targets are not allowed");
  }
  if (isIP(hostname) === 4 && isPrivateIpv4(hostname)) throw new Error("Local and private crawl targets are not allowed");
  return url;
}
