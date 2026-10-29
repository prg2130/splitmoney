# Add a Back button on the results page

## What changes
- On the "Each Person Owes" page (grand total, Share, Collect from group), add a **Back** button.
- Tapping it returns to the Assign step with everything kept: people, item assignments, the chosen tip, and the tax split choice (equally / by order cost).
- From there the user can change the tip or tax split and tap Continue again to see updated totals.

## Layout
- Button row becomes: **Back** | **Share**, with **New Bill** moved to a smaller secondary button below "Collect from group" so it isn't tapped by mistake.

## Technical details
- `ResultsView.tsx`: add `onBack` prop and a Back button (ArrowLeft icon).
- `Index.tsx`: pass `onBack={() => setStep("assign")}`. State already persists, so no data is lost.
- Results logging runs once per visit to the results page; returning after edits will log a new split session (acceptable, reflects the final split).
