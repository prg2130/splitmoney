# Track total money split through SplitBill

Right now the `scan_logs` table only records that a scan happened (user, IP, image path, size). It does **not** store the bill total, so we can't currently calculate how much money has been split.

To answer "how much money has been split", we need to start saving the bill total (and currency) for each successful scan, then surface that number to you as the owner.

## What we'll build

### 1. Store the bill total on every scan
- Add two columns to `scan_logs`:
  - `bill_total` (numeric) — the grand total the AI extracted
  - `currency` (text) — the currency symbol (₹, $, etc.)
- Update the `scan-bill` edge function to write these values when it logs a scan.

### 2. Owner analytics view
Add a small "Money split" panel inside the existing More → Analytics area showing:
- **Total value scanned** (all-time)
- **Last 7 days / Last 30 days**
- **Scan count** alongside each total
- Broken down by currency (since the app supports ₹, $, etc.)

Access stays restricted to you (no public exposure). We'll read it via a secure database function so only the owner role can see aggregated totals.

## Caveats worth knowing

- We can only count scans going **forward** — the 46 existing scans in the database don't have totals recorded, so they'll show as "unknown" or be excluded.
- "Money split" = the grand total of bills scanned. It assumes each scanned bill was actually paid/split; the app has no way to confirm that.
- Mixed currencies won't be summed into one number (₹ and $ stay separate) unless you want us to apply a fixed conversion rate.

## Technical details

- Migration: `ALTER TABLE scan_logs ADD COLUMN bill_total numeric, ADD COLUMN currency text;`
- Edge function `scan-bill`: include `bill_total: parsed.billTotal` and `currency: parsed.currency` in the existing `scan_logs` insert.
- Aggregation: a `SECURITY DEFINER` SQL function `get_split_totals()` returning rows grouped by currency and time window, callable only by an `owner` role (using the standard `has_role` pattern).
- Frontend: extend the Analytics view in the More panel with a card that calls the function and renders totals.

## Open question

Do you want owner access gated by:
1. A login (you sign in, role = owner), or
2. A simple shared passcode on a hidden `/owner` page?

Either works — pick whichever you prefer and I'll wire it up in build mode.
