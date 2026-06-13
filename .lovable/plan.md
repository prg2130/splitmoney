# Persist star ratings in the database

Create a small `feedback` table so every star tap is saved and can be queried later for investor-facing analytics. No new pages, no UI changes beyond what's already there.

## Database

New table `public.feedback`:

- `rating` — integer 1–5 (CHECK constraint)
- `bill_total` — numeric, nullable (copied from the current bill so you can show "avg rating per bill size")
- `currency` — text, nullable
- `people_count` — integer, nullable (how many people split the bill)
- `items_count` — integer, nullable
- standard `id`, `created_at`

RLS:
- `INSERT` allowed for `anon` and `authenticated` (the app has no sign-in)
- `SELECT` denied to `anon`/`authenticated`; only `service_role` reads it (you'll query via the migration/SQL tools when showing investors)

GRANTs: `INSERT` to `anon, authenticated`; `ALL` to `service_role`.

## Code change (one file)

`src/components/ResultsView.tsx`:

- In the existing star `onClick`, after `setRating(n)` and the toast, insert one row:

  ```ts
  await supabase.from("feedback").insert({
    rating: n,
    bill_total: billTotal,
    currency,
    people_count: people.length,
    items_count: items.length,
  });
  ```

- Disable the stars after a rating is submitted (the UI already shows the selected state) to prevent duplicate inserts.
- Fire-and-forget — never block the UI or surface an error toast on failure.

## How you'll read it later

Until you want a dashboard, query directly via the database tools:

```sql
SELECT rating, COUNT(*) FROM feedback GROUP BY rating ORDER BY rating;
SELECT AVG(rating)::numeric(3,2), COUNT(*) FROM feedback
  WHERE created_at >= now() - interval '30 days';
```

That's enough to tell investors "avg 4.6 stars across N submissions in the last 30 days". If/when you want a visual dashboard, we can add it to the existing Owner Analytics page later — no schema change needed.

## Out of scope

- No free-text comments (can be added later as a nullable `comment` column)
- No link back to a specific `scan_logs` row (kept anonymous on purpose, matching the app's no-auth design)
- No new analytics page
