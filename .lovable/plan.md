# Global Daily Scan Cap (200/day)

Add a third rate-limit layer to `supabase/functions/scan-bill/index.ts` that caps **total scans across all users and IPs combined** at **200 per rolling 24 hours**. Acts as a hard fuse on AI spend regardless of how attackers rotate accounts or IPs.

## Changes

**File: `supabase/functions/scan-bill/index.ts`**

Add a new check right after the existing per-IP rate-limit block, before reading the request body or calling the AI:

1. Define `GLOBAL_DAILY_LIMIT = 200`.
2. Query `scan_logs` for total rows where `created_at >= now() - 24h` (no user/IP filter).
3. If count ≥ 200, return `429` with message: *"Daily scan limit reached. Please try again tomorrow."*
4. Otherwise proceed as normal.

The check runs **before** the AI gateway call, so a tripped cap costs zero AI credits — only one cheap indexed count query.

## Why a rolling 24h window

Smoother than a midnight reset: an attacker can't burn 200 scans at 23:59 and another 200 at 00:01. The window slides continuously.

## What stays the same

- Per-user cap: 10/hr
- Per-IP cap: 5/hr
- 5MB / MIME validation
- Storage logging to `bill-uploads`

## Tradeoffs to accept

- If 200 legit scans happen in 24h, further users see the "try tomorrow" message until the window slides. Easy to raise later by editing one constant.
- No alerting — you'd notice via `scan_logs` row count or the user-facing message. Can add later if needed.

## Note

The backend doesn't yet have first-class rate-limiting primitives, so this is an ad-hoc DB-counted check (same pattern as your existing per-user/per-IP limits). Good enough for a cost fuse on a personal project.
