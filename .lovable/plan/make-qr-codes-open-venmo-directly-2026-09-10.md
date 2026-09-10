# Make QR codes open Venmo directly

## Change

- Generate each person’s QR code with a direct Venmo payment URL instead of the PayUrShare `/pay` page.
- Include the recipient’s Venmo username, that person’s exact amount, and the bill-split note in the Venmo URL.
- Make the copied and WhatsApp-shared link use the same direct Venmo destination.
- Remove wording that suggests the payer must choose a payment app, since collection is now Venmo-only.

## Expected result

Scanning the QR opens Venmo directly when the app is installed. If Venmo cannot open, the phone opens the recipient’s Venmo web page instead. The payer no longer lands on PayUrShare first.

## Verification

- Confirm the QR contains a `venmo.com/u/...` address, not `payurshare.com/pay`.
- Confirm the username, amount, and note are included correctly.
- Test QR scanning on a phone with Venmo installed and test the browser fallback without the app.
- Confirm the project still builds successfully.
