const PRODUCTION_ORIGIN = "https://www.payurshare.com";

const PREVIEW_HOST_PATTERNS = [
  /\.lovableproject\.com$/i,
  /\.lovable\.dev$/i,
  /^id-preview--/i,
  /^preview--/i,
];

/**
 * Origin to use for links that get shared or encoded into a QR code.
 * Lovable preview/editor domains sit behind an access gate, so a QR built from
 * them would prompt the scanner to sign in. Fall back to the public domain.
 */
export function publicOrigin(): string {
  if (typeof window === "undefined") return PRODUCTION_ORIGIN;
  const { hostname, origin } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1") return PRODUCTION_ORIGIN;
  if (PREVIEW_HOST_PATTERNS.some((re) => re.test(hostname))) return PRODUCTION_ORIGIN;
  return origin;
}

export function publicUrl(path: string): string {
  return `${publicOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
}