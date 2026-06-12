
## Goal

You want the `bill-uploads` storage bucket to be accessible **only to you / the backend**, not to any signed-in user or customer. Today there is one SELECT policy that lets any authenticated user read files inside a folder matching their own user id. Since this app signs everyone in anonymously, "authenticated" effectively means "any visitor" — that's too open.

## Approach

The `scan-bill` edge function writes to the bucket using the service role key, which bypasses RLS entirely. So clients never need any direct access. We can simply remove all client-facing policies and rely on default-deny.

### Migration

1. Drop the existing SELECT policy `Users can view own bill uploads` on `storage.objects`.
2. Do not add any INSERT / UPDATE / DELETE / SELECT policies for `anon` or `authenticated`.

Result:
- `anon` and `authenticated` roles → fully blocked from the bucket (RLS denies everything without a policy).
- `service_role` (used by `scan-bill`) → continues to work, bypasses RLS.
- Bucket is already private, so no public URL access either.

### Security scanner

The `bill_uploads_missing_insert_delete_policies` finding will be marked as **ignored** with the explanation that this bucket is intentionally backend-only: clients have zero access by design, and all writes happen through the edge function using the service role.

## What stays the same

- `scan-bill` edge function upload behavior — unchanged.
- `scan_logs` table — unchanged.
- App user flow — unchanged (users never needed to see the raw images anyway).
