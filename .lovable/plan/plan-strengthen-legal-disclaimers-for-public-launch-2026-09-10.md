# Plan: Strengthen legal disclaimers for public launch

## Goal
Update the existing Terms of Service and Payment Collection Disclaimer so a general audience (US and international) sees clear, prominent language that:
- The app is provided "as is" with no warranties.
- PayUrShare does not process, guarantee, or refund any payments.
- Users assume the risk of receipt-scan errors, incorrect amounts, wrong recipients, and payment disputes.
- The operator is not liable for damages, and liability is capped where allowed by law.
- Users agree to indemnify the operator for misuse or violations.
- Laws vary by country; users are responsible for compliance in their own jurisdiction.

## Changes

### 1. Terms of Service (`src/pages/Terms.tsx`)
Add or strengthen the following sections while keeping the existing layout and SEO metadata:
- **No warranties / As-is use**: app output (receipt scans, splits, links) may be inaccurate; users must verify before sending money.
- **Payment links are only convenience tools**: PayUrShare never touches funds; all transactions are solely between users and third-party apps.
- **Assumption of risk**: user is solely responsible for confirming recipients, amounts, and notes before sharing or paying.
- **Limitation of liability**: cap operator liability to the greater of (a) amount paid by user in last 12 months or (b) $0, to the fullest extent permitted by law; exclude indirect/consequential damages.
- **Indemnification**: user agrees to defend and hold harmless the operator from claims arising from misuse, inaccurate data, or third-party disputes.
- **Governing law / jurisdiction**: add a placeholder clause referencing the operator’s jurisdiction (to be filled when entity is formed), with a note that mandatory consumer protections in the user’s country may override it.
- **International use**: users outside the US access the app at their own risk and are responsible for complying with local laws.

### 2. Payment Collection Disclaimer (`src/pages/CollectDisclaimer.tsx`)
- Move the "We Do Not Process Payments" language higher and make it more prominent.
- Add explicit bullets: no guarantee a Venmo link opens the app, no guarantee the recipient receives funds, no ability to reverse or refund payments, user must verify the username/amount/note before sharing.
- Add a "You assume the risk" callout near the end, cross-linking to the full Terms.

### 3. In-app notice in the Collect flow (`src/components/PaybackSheet.tsx`)
- Add a short inline warning above the share/QR section: "Double-check the Venmo username and amount. PayUrShare cannot refund or reverse payments."
- Link to `/collect-disclaimer` and `/terms`.

### 4. Privacy Policy (`src/pages/Privacy.tsx`)
- Add a brief "International users" note stating data may be processed in the US and that users are responsible for any local privacy requirements.
- Reiterate that payment handles never leave the device.

## Verification
- Run `bunx tsx scripts/generate-sitemap.ts` and `bunx tsc --noEmit`.
- Check that Terms, Privacy, and Collect Disclaimer pages still render and canonical/og tags remain intact.
- Confirm the new in-app notice appears inside the Collect sheet without breaking the Venmo-only flow.

## Out of scope
- Forming a Delaware C-Corp/LLC.
- Adding insurance, registered agent, or DMCA agent.
- Country-specific cookie/GDPR consent banners (can be added later if requested).
