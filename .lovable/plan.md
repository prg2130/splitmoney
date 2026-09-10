# Test the Venmo collect-from-group flow

## What to verify

Make sure the "Collect from group" feature works for your friends (not just inside the Lovable editor).

## Steps

### 1. Run a split inside the preview
- Add a bill and at least one participant.
- Tap **"Collect from group"** on the results screen.
- If you have not saved a Venmo username yet, enter one and continue.

### 2. Inspect the generated QR / link
- Right-click the QR code and copy the link address (or long-press and share the image URL).
- Confirm the URL starts with `https://www.payurshare.com/pay?...` NOT `https://id-preview--...lovable.app`.
- Paste the copied link into a browser tab. It should open the `/pay` page without asking for a Lovable login.

### 3. Check the /pay page contents
- The page shows the correct amount and your name as recipient.
- It shows one option: **Venmo** with the username you entered.
- The **Open Venmo** button links to `https://venmo.com/u/<username>?txn=pay&amount=...&note=...`.

### 4. Test on a real phone
- Use your phone's camera to scan the QR code from your computer screen, or send the copied link to yourself (text, WhatsApp, etc.).
- Open it on the phone.
  - If the Venmo app is installed, it should open the app with the amount and note pre-filled.
  - If Venmo is not installed, it should open the Venmo website and still show the pay screen.

### 5. Test desktop fallback
- Open the link on a desktop browser.
- Click **Open Venmo**.
- It should open `venmo.com/u/<username>` in a new tab with amount and note in the URL.

### 6. Expected passing criteria
- No Lovable login gate appears.
- Amount matches the person's share.
- Username matches what you entered.
- Venmo opens (app on mobile, web on desktop).
- No JavaScript console errors on `/pay`.

## If something fails

- Share the exact URL that opened (or a screenshot).
- Share what device/browser you used.
- Note whether it failed at the QR/link step, the `/pay` page, or opening Venmo itself.
