Payment Expansion Plan

Goal: Give users two ways to settle a bill after it is split in PayUrShare:
1. Peer-to-peer (existing) — pay the person who already covered the bill.
2. Pay the restaurant directly — each diner pays their own share to the house.

Scope note on Apple Pay / Google Pay P2P
In the United States, Apple Cash and Google Pay P2P cannot be opened from a web app with a pre-filled amount and recipient. Those apps only work inside Messages/iMessage or through their own first-party flows. So the plan treats Apple Pay / Google Pay as checkout options for the restaurant path, not as direct P2P links. For P2P we will deepen Venmo, Cash App, PayPal, Zelle, and WhatsApp sharing.

Phase 1: Harden the existing peer-to-peer flow

1. Persist payment status
- Add a `payment_status` table (or extend `split_participants`) with:
  - session_id, participant_id/name, rail, amount, status (pending/paid/marked-paid), paid_at.
- When the payer taps "Paid" in the sheet, write the row to the database (not just local state).
- On sheet open, rehydrate paid checkboxes from the database.

2. Add one-tap "Request" sharing
- Generate a per-person short payment link/QR for each rail.
- Add native sharing (`navigator.share`) for the reminder message as a fallback when WhatsApp is not installed.
- Add a "Copy link" button next to the QR for each person.

3. Improve handle entry UX
- Show inline validation for Venmo/Cash App prefixes.
- Allow a default preferred rail saved with the handles.
- Add tooltips explaining which handle is used for each rail.

Phase 2: Direct restaurant payment

The simplest, no-auth-friendly path is to let the restaurant owner collect money through the app rather than integrate with arbitrary POS hardware.

1. Enable Lovable built-in Stripe payments
- Use the seamless Stripe integration (no Stripe account or API key needed).
- This supports credit/debit cards, Apple Pay, Google Pay, and other local payment methods.

2. Owner onboarding
- Add a new section behind the owner passcode (`/owner`) where the owner can:
  - Verify their Stripe account status.
  - Set a default payment descriptor (e.g., "PayUrShare — Restaurant Name").
  - View a payout/balance summary (if Stripe API exposes it through the integration).

3. Diner checkout flow
- On the summary screen, add a new "Pay my share to restaurant" button.
- This opens a checkout sheet that:
  - Shows the individual's exact owed amount.
  - Creates a Stripe Checkout session for that amount.
  - Supports Apple Pay / Google Pay via Stripe's Payment Request Button.
- After successful payment, record the payment status in the `payment_status` table.

4. Payment tracking
- Each successful checkout writes a row with:
  - session_id, participant_name, amount, currency, stripe_session_id, status, paid_at.
- The owner analytics page can show "collected via app" totals.

5. POS integration reality
- True direct-to-POS hardware integration (Toast, Square, Clover, etc.) requires a formal POS partner and usually certified hardware.
- We will not implement a direct POS tap in this phase. Instead, the owner can use a tablet/phone at the table with the Stripe checkout page, which functions like a soft POS and accepts Apple Pay / Google Pay / cards.
- If a specific POS integration is needed later, we will scope it as a separate Phase 3.

Phase 3 (optional/future): True POS or QR at the table

- Generate a static QR the restaurant prints and places on the table.
- Diners scan, enter their table number, and pay their share.
- Or connect a Stripe Terminal reader to accept in-person contactless/tap-to-pay.

Data model additions

1. `payment_status` table
- id uuid primary key
- session_id uuid -> split_sessions.id
- participant_name text
- amount numeric
- currency text
- rail text (venmo, cashapp, paypal, zelle, stripe_checkout)
- status text (pending, paid, marked_paid)
- stripe_session_id text (nullable)
- paid_at timestamp with time zone
- created_at timestamp with time zone default now()

2. `restaurant_payment_settings` table (owner-scoped)
- id uuid primary key
- descriptor text
- owner_id uuid (nullable until auth is added)
- created_at timestamp with time zone default now()

UI changes

- `ResultsView.tsx`: add "Pay my share to restaurant" button.
- `PaybackSheet.tsx`: persist paid status, add native share, copy link, preferred rail.
- New `RestaurantCheckout.tsx`: Stripe checkout sheet for direct-to-restaurant payments.
- `Owner.tsx`: add Stripe onboarding status, payout summary, and payment settings.

Backend changes

- New edge function `create-checkout-session` to create Stripe Checkout sessions and return a client secret/session URL.
- New edge function `checkout-webhook` to listen for Stripe checkout completion and update `payment_status`.
- Update `owner-analytics` to aggregate in-app payments with bill totals.

Sequence

1. Implement Phase 1 (P2P hardening).
2. Enable Stripe payments via Lovable's built-in integration.
3. Implement Phase 2 (direct restaurant payment).
4. Run end-to-end checkout tests in Stripe test mode.

Security/notes
- The app currently uses anonymous auth. Stripe checkout and webhook handling should run server-side (edge functions) to keep secrets safe.
- No card data touches the client; Stripe handles PCI compliance.
- `payment_status` should be writable by the edge function (service_role) and insertable by anon/authenticated clients for P2P marked-paid status.
