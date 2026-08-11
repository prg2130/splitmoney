# Fix: QR code asks for a Lovable login

## What's happening

The Venmo, Cash App, and PayPal QR codes point straight at those providers' own domains, so they open fine. The **Zelle** QR is different — Zelle has no public payment link format, so the app generates a link back to its own instruction page at `/pay/zelle`.

That link is built from `window.location.origin`, which is whatever URL you happen to be on when you generate the QR. When you generate it inside the Lovable editor preview, the origin is the private preview domain (`id-preview--....lovable.app`). Anyone scanning that QR — including you on your phone — hits Lovable's preview access gate and is asked to sign in.

## The fix

Build shareable links from the app's **public** domain instead of the current browser origin.

1. Add a single public base URL helper that resolves to:
   - `https://www.payurshare.com` when the current origin is a Lovable preview/editor domain
   - the current origin otherwise (so the live site, and any future domain, keep working without a hardcoded mismatch)
2. Use that helper for the Zelle link instead of `window.location.origin`.
3. Apply the same helper to any other link that gets shared or encoded into a QR, so nothing shareable ever carries a preview URL.

## Result

- QR codes generated from the preview will point at `payurshare.com/pay/zelle?...` — no login prompt.
- QR codes generated from the live site behave exactly as they do now.
- Venmo / Cash App / PayPal QRs are unaffected.

## Technical detail

- New helper in `src/lib/paymentLinks.ts` (or a small `src/lib/publicUrl.ts`): detect preview hosts by matching `lovableproject.com`, `lovable.app` preview subdomains, and `lovable.dev`, and fall back to the canonical production origin.
- Replace the `window.location.origin` usage on line 36 of `src/lib/paymentLinks.ts`.
- No backend, database, or edge function changes needed.
