# Make Venmo payment links open the app directly

## Problem

The current shared Venmo link goes to `https://venmo.com/u/<username>?txn=pay&amount=...&note=...`. On many phones this opens in a browser and asks the recipient to sign in, instead of opening inside the signed-in Venmo app where they only need to tap Pay.

## What we can and cannot guarantee

No third-party link can force Venmo to use an existing signed-in session. The Venmo app (or the OS) decides whether to launch the app and whether the user is already signed in. We can only hand the request to Venmo in the format most likely to open the payment screen pre-filled.

## Proposed change

1. **QR code**  
   Encode the native Venmo app link:  
   `venmo://paycharge?txn=pay&recipients=<username>&amount=<amount>&note=<note>`  
   This gives scanners the best chance of opening the Venmo app directly. Add a small note below the QR that some scanners may need the web fallback.

2. **Copied link and WhatsApp share**  
   Many messaging apps block or ignore `venmo://` links, so use a PayUrShare redirect page instead:  
   `https://www.payurshare.com/pay/venmo?to=<username>&amount=<amount>&note=<note>`  
   That page immediately tries to open the Venmo app on mobile, and shows:
   - a large "Open in Venmo" button,
   - a "Continue in browser" fallback that opens the web payment URL,
   - the recipient, amount, and note for verification.

3. **Native-app attempt logic**  
   Reuse and improve the existing `openPay` mobile-detection + timeout fallback, but move it onto the new `/pay/venmo` route so it works for copied links, not only the old multi-rail `/pay` page.

4. **Disclaimers**  
   Update the Collect flow warning and the Disclaimer page to explain that the link attempts to open Venmo directly, but if the recipient is not signed in or the OS routes to the browser they will see Venmo's own login/payment screen, and PayUrShare cannot control or refund that.

## Expected result

- Scanning the QR on a phone with Venmo installed opens the Venmo payment screen with amount and note filled.
- Tapping the copied/WhatsApp link on mobile attempts to open Venmo; if it cannot, the user sees a PayUrShare page with an explicit "Open in Venmo" button and a browser fallback.
- The recipient never has to re-type the amount, username, or note.
- If Venmo asks to sign in, that is Venmo's behavior and outside the app's control.

## Verification

- Inspect a generated QR: its value should start with `venmo://paycharge?` and contain `recipients=`, `amount=`, and `note=`.
- Inspect a copied link: it should point to `https://www.payurshare.com/pay/venmo?...`.
- Open `/pay/venmo?to=testuser&amount=12.34&note=Bill+split` on a desktop browser and confirm the fallback page renders with recipient, amount, and note.
- Open the same route on a mobile user-agent string and confirm it attempts `venmo://paycharge?...`.
- Confirm build succeeds and existing `/pay` page still works.
