## Goal
Persist every uploaded receipt image to the existing `bill-uploads` storage bucket so they're retained instead of discarded after scanning.

## Changes

1. **Storage bucket policy** (`bill-uploads` already exists, private)
   - Add RLS policy on `storage.objects` allowing anonymous/authenticated users to INSERT into the `bill-uploads` bucket.
   - Keep reads restricted (private bucket); we can generate signed URLs later if needed.

2. **Upload flow** (`src/components/BillUpload.tsx` / `src/pages/Index.tsx`)
   - After the user picks/processes an image, upload the processed Blob to `bill-uploads/<timestamp>-<random>.jpg` via `supabase.storage.from('bill-uploads').upload(...)`.
   - Run the upload in parallel with the `scan-bill` edge function call so scan latency isn't affected.
   - Store the returned storage path in component state (and optionally pass to the bill summary), so future features can reference it.

3. **No DB table yet** — just the file in storage. If you later want a `bills` table linking image → extracted data → participants, that's a follow-up.

## Open questions
- **Retention**: keep images forever, or auto-delete after X days? (Affects storage cost.)
- **Privacy**: receipts can contain card last-4 / names. Confirm you want them stored at all.
- **Access**: should images be viewable later in the app (e.g. a "past bills" view), or stored purely as a backup/audit log?

Let me know on those three and I'll switch to build.
