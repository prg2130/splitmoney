# Stylish Visual Refresh

Goal: make SplitBill look like a premium, modern product — keep the teal/sand palette and all existing functionality intact. No flow changes, just visual polish.

## What changes (user-facing)

1. **Background** — replace flat sand with a soft ambient gradient (warm sand → faint mint), plus two large blurred color "blobs" behind content for depth. Subtle, not loud.

2. **Header**
   - Logo tile gets a teal→emerald gradient with a soft glow shadow.
   - "SplitBill" wordmark uses a gradient text fill.
   - Tagline gets a small pill-style "Scan · Assign · Split" chip instead of plain text.

3. **Step indicator** — upgrade from dots to a connected progress track:
   - Completed steps: filled teal circle with check icon.
   - Current step: larger ring with pulsing glow.
   - Connector lines fill in as you progress.

4. **Cards & surfaces**
   - All cards get: rounded-2xl, subtle border, layered shadow, and a faint backdrop-blur (glass effect) over the gradient bg.
   - Hover lift on interactive cards.

5. **Upload screen**
   - Dashed upload zone becomes a larger, friendlier panel with an animated icon (gentle float) and a gradient hover state.
   - Upload/Camera buttons: primary gets gradient + soft shadow; outline gets refined hover.
   - Scanning overlay: replace plain spinner with a moving scan-line across the bill + a small pill ("Reading your bill…") — feels intentional, not generic.

6. **Buttons globally**
   - Primary: gradient (teal → emerald), soft elevation, slight scale on press.
   - Add a `gradient` variant to the Button component so it's reusable.

7. **Typography**
   - Tighten tracking on headings, increase weight to 700/800 for h1.
   - Numbers (totals, prices) use tabular-nums so they align cleanly.

8. **Micro-interactions**
   - Fade+slide-in on step transitions (already partly there, made consistent).
   - Items in the scanned-items list stagger in.
   - Success states (checkmarks, completed steps) get a quick scale-in pop.

## Technical details

- **`src/index.css`**: add gradient bg utility, glass card utility, scan-line keyframes, float keyframe, gradient-text utility. Keep all colors as HSL tokens — no hardcoded hex.
- **`tailwind.config.ts`**: register new keyframes (`scan-line`, `float`, `pulse-glow`) and animations.
- **`src/components/ui/button.tsx`**: add `gradient` variant using `bg-gradient-to-r from-primary to-success`.
- **`src/pages/Index.tsx`**: 
  - Wrap page in gradient bg + decorative blurred blobs (absolute, pointer-events-none).
  - Replace dot step indicator with new connected progress component (inline or small new file `src/components/StepProgress.tsx`).
  - Header logo → gradient tile, wordmark → gradient text, tagline → pill chip.
  - Scanned-items card → glass styling, stagger animation via framer-motion.
- **`src/components/BillUpload.tsx`**:
  - Larger upload dropzone with floating icon, gradient hover.
  - Gradient primary "Camera" button.
  - New scan overlay: scan-line animation + status pill.
- **`src/components/AddPeople.tsx`, `AssignItems.tsx`, `ResultsView.tsx`**: apply glass card styling, gradient primary buttons, tabular-nums on price numbers. No structural changes.

## Out of scope
- No changes to scanning logic, splitting math, edge function, or the 4-step flow.
- No new pages or features (Splitwise export, payment links, etc. — separate task).
- No dark mode work (current app is light-only).

## Risks
- Glass/backdrop-blur can dim text contrast — will verify all text stays AA contrast on the gradient bg.
- Keep animations short (≤300ms) so the app still feels snappy on mobile.
