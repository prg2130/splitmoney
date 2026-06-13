## Goal

Persist the full split session (people, item assignments, per-person totals) to the database so you can later show investor metrics like average party size, average bill, splits per day, and most common items.

## Database changes

Three new tables, all insert-only from the client (no auth, no reads from browser):

**1. `split_sessions`** — one row per completed split
- `bill_total` (numeric), `currency` (text)
- `subtotal`, `tax_total`, `tip_total`, `service_total` (numeric, nullable)
- `people_count` (int), `items_count` (int)
- `split_mode` (text — e.g. "proportional" / "equal" for extras)
- `scan_log_id` (uuid, nullable — links to `scan_logs` row if available)

**2. `split_participants`** — one row per person in a session
- `session_id` (uuid → split_sessions)
- `name` (text)
- `amount_owed` (numeric)
- `items_assigned_count` (int)

**3. `split_items`** — one row per receipt line item
- `session_id` (uuid → split_sessions)
- `name` (text), `price` (numeric), `quantity` (int)
- `assigned_to` (text[] — names of people sharing it)
- `assignee_count` (int)

### Access rules (RLS)
- `anon` + `authenticated` can INSERT only
- No SELECT/UPDATE/DELETE from the client
- `service_role` has full access (so you can query for investor analytics)

## Code changes

- In `ResultsView.tsx`, replace the current single `feedback` insert with one combined write on the summary screen:
  1. Insert one `split_sessions` row → get `session_id`
  2. Bulk insert all `split_participants` for that session
  3. Bulk insert all `split_items` with their assignees
- Keep the existing `feedback` table for star ratings (unchanged), but also add `session_id` to feedback so a rating can be linked back to its session.
- Writes are fire-and-forget (`void` + console.warn on error) so they never block the UI.

## What you'll be able to query later

```sql
-- Average party size, average bill, splits per day
SELECT date_trunc('day', created_at) AS day,
       COUNT(*) AS splits,
       AVG(people_count) AS avg_party,
       AVG(bill_total) AS avg_bill
FROM split_sessions GROUP BY 1 ORDER BY 1 DESC;

-- Most common items
SELECT lower(name) AS item, COUNT(*) AS times
FROM split_items GROUP BY 1 ORDER BY times DESC LIMIT 20;

-- Rating tied to bill size
SELECT f.rating, AVG(s.bill_total)
FROM feedback f JOIN split_sessions s ON s.id = f.session_id
GROUP BY f.rating;
```

## Out of scope

- No analytics page in the app (per your earlier instruction)
- No auth, no editing/deleting sessions from the client
- No image storage changes
