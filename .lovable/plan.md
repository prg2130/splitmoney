## Problem

On `payurshare.com`, the scan request is blocked by the browser:

> Access to fetch at `…/functions/v1/scan-bill` from origin `https://www.payurshare.com` has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

That's why the UI sits on "Scanning…" — the request never completes.

It works on `splitmoney.lovable.app` because that origin is already in the deployed function's allowlist.

## Root cause

`supabase/functions/scan-bill/index.ts` already lists `https://www.payurshare.com` and `https://payurshare.com` in `ALLOWED_ORIGINS`, but the live edge function on the server is an older build from before the custom domain was added, so it doesn't return CORS headers for those origins.

## Fix

Force a fresh deploy of the `scan-bill` edge function so the current allowlist (which includes payurshare.com) goes live. No code changes needed.

Steps:
1. Trigger a redeploy of `scan-bill` via the deploy tool.
2. On `payurshare.com`, hard-refresh (Cmd/Ctrl+Shift+R) and try scanning a bill again.
3. If anything still fails, check console — but the CORS error should be gone and the scan should complete normally.

## Notes

- No frontend changes.
- No DB / auth changes — anonymous sign-in from `payurshare.com` is already working (confirmed in auth logs).
- HEIC/HEIF iPhone photos may also show a "HEIC conversion failed, falling back to server-side decode" warning — that's a separate, non-blocking message and the server already accepts HEIC/HEIF.
