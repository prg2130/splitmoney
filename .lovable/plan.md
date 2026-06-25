# Peer-to-Peer Payback on Results Screen

Add a way for the person who paid the bill to collect money back from the other diners, using their existing payment apps (Venmo, Cash App, Zelle, PayPal). No money flows through SplitBill — we just generate payment links and QR codes.

## User flow

1. On the results screen, the payer taps **"Collect from group"**.
2. First time only: a sheet opens asking the payer to enter their handles (Venmo username, Cash App $cashtag, Zelle email/phone, PayPal.me username). Saved to the browser for next time.
3. For each other diner, a card shows:
   - Their name and amount owed
   - A **QR code** containing a pre-filled payment link
   - Chips to switch payment rail (Venmo / Cash App / Zelle / PayPal)
   - A **"Send WhatsApp reminder"** button (opens WhatsApp with a pre-filled message)
   - A **"Copy amount"** fallback button

The other diner scans the QR with their phone camera → their payment app opens with the amount and note pre-filled → they confirm and pay.

## Payment link formats

- **Venmo**: `https://venmo.com/{username}?txn=pay&amount={amt}&note={note}`
- **Cash App**: `https://cash.app/${cashtag}/{amt}`
- **PayPal**: `https://paypal.me/{username}/{amt}`
- **Zelle**: no universal deep link exists → QR points to an info page (`/pay/zelle`) showing the payer's Zelle handle + amount with copy buttons
- **Copy fallback**: plain text "Pay {payer} {amt} via {rail}: {handle}"

## WhatsApp share

Opens `https://wa.me/?text={encoded}` with a message like:
> Hey {name}, you owe {amt} for {restaurant}. Pay me via Venmo: {link}

User picks the contact inside WhatsApp.

## Constraints

- No money moves through SplitBill.
- No backend changes, no restaurant onboarding.
- Payer's handles are stored in `localStorage` only — never sent anywhere.
- No tracking of who actually paid back (open question below).

## Technical details

- **New files**:
  - `src/components/PaybackSheet.tsx` — the "Collect from group" sheet UI
  - `src/lib/paymentLinks.ts` — builds the rail-specific URLs
  - `src/lib/payerHandles.ts` — load/save handles from localStorage
  - `src/pages/PayZelle.tsx` — Zelle info fallback page
- **Edited files**:
  - `src/components/ResultsView.tsx` — adds the "Collect from group" button
  - `src/App.tsx` — registers the `/pay/zelle` route
- **Dependency**: `qrcode.react` for QR rendering

## Open question

Should the payer see a **"Mark as paid"** checkbox next to each person (local-only, no backend), so they can track who has settled up? Or keep it strictly link-generation with no state?
