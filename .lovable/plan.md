# Add Tip / Gratuity Option

When a scanned receipt has no tip, service charge, or gratuity line, give the user a quick way to add one before splitting.

## Where it appears

In the **Assign** step, on the last item card (next to the existing "How to split taxes & charges?" toggle), but only when the bill currently has **no extras** of type tip/service. If extras already exist on the bill, we skip showing it (avoid double-tipping).

## UI

A small card titled **"Add a tip?"** with:

- Preset chips: **10%**, **15%**, **20%**, **25%**, **Custom**, **No tip** (default)
- Tip is calculated as a percentage of the food subtotal (sum of non-extra items × quantities)
- Selecting **Custom** reveals a small numeric input for a flat amount in the current currency
- Live preview line: `Tip: ₹XX.XX`

## Behavior

- Selecting a preset (or entering a custom amount) injects a synthetic extra item into the items list:
  - `name: "Tip"`, `isExtra: true`, `quantity: 1`, `price: <computed>`, `assignedTo: []`
  - Tagged with a stable id like `tip-synthetic` so re-selecting replaces the previous tip instead of stacking
- Selecting **No tip** removes the synthetic tip item
- The tip then flows through the existing `calculateSplit` logic and respects the user's **By order / Equally** choice for extras — so it's automatically split between people the same way taxes are
- The Results screen already shows `Extras share` per person, so the tip is included there with no extra work

## Total reconciliation

The existing scaling logic uses the receipt's grand total as the source of truth. Adding a tip should **not** be scaled away, so:

- When a synthetic tip is present, the effective "target total" used for scaling becomes `billTotal + tipAmount`
- This keeps the per-person totals honest and prevents the scaler from collapsing the tip back to zero

## Files to change

- `src/lib/splitbill.ts` — add a tiny helper `withTip(items, tipAmount)` that adds/removes the `tip-synthetic` extra item
- `src/components/AssignItems.tsx` — render the new "Add a tip?" card on the last item view; manage selected preset + custom amount as local state; call back up to `Index` to update items
- `src/pages/Index.tsx` — accept the updated items list (already does via `setItems`); pass an adjusted `billTotal` (base + tip) to `ResultsView` so scaling stays correct
- `src/components/ResultsView.tsx` — no logic change; just receives the adjusted total

## Out of scope

- No DB / edge-function changes
- No change to receipts that already include a tip / service charge — the card simply doesn't appear
