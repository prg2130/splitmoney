## Goal
Identify which restaurants the two most recent receipts ($65.72 on Jun 29 and $178.58 on Jun 25) came from.

## Steps
1. Query `scan_logs` to get the `image_path` for the two receipts.
2. Generate short-lived signed URLs for each image in the `bill-uploads` bucket.
3. Download the images to the sandbox and view them to read the restaurant name/address off each receipt.
4. Reply in chat with the restaurant name (and location if visible) for both receipts.

No code changes to the app — this is a one-off lookup.