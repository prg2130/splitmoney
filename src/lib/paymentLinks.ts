import { PayerHandles, PaymentRail, RAIL_LABEL } from "./payerHandles";
import { publicUrl } from "./publicUrl";

function clean(handle: string, stripPrefix?: string): string {
  let h = handle.trim();
  if (stripPrefix && h.startsWith(stripPrefix)) h = h.slice(stripPrefix.length);
  return h.replace(/^@/, "");
}

/** Deep link that opens the payment app with the amount pre-filled. Zelle has no
 *  universal deep link, so it returns null and needs manual instructions. */
export function buildRailDeepLink(
  rail: PaymentRail,
  handles: PayerHandles,
  amount: number,
  note: string
): string | null {
  const amt = amount.toFixed(2);
  switch (rail) {
    case "venmo": {
      const u = clean(handles.venmo);
      return `https://venmo.com/u/${encodeURIComponent(u)}?txn=pay&amount=${amt}&note=${encodeURIComponent(note)}`;
    }
    case "cashapp": {
      const u = clean(handles.cashapp, "$");
      return `https://cash.app/$${encodeURIComponent(u)}/${amt}`;
    }
    case "paypal": {
      const u = clean(handles.paypal);
      return `https://paypal.me/${encodeURIComponent(u)}/${amt}`;
    }
    case "zelle":
      return null;
  }
}

export function railHandleDisplay(rail: PaymentRail, handles: PayerHandles): string {
  switch (rail) {
    case "venmo":
      return `@${clean(handles.venmo)}`;

    case "cashapp":
      return `$${clean(handles.cashapp, "$")}`;
    case "paypal":
      return `paypal.me/${clean(handles.paypal)}`;
    case "zelle":
      return handles.zelle.trim();
  }
}

/** Shareable page that lets the payer choose any of the accepted apps. */
export function buildPayPageLink(
  rails: PaymentRail[],
  handles: PayerHandles,
  amount: number,
  note: string
): string {
  const params = new URLSearchParams();
  params.set("a", amount.toFixed(2));
  if (handles.payerName.trim()) params.set("to", handles.payerName.trim());
  if (note) params.set("note", note);
  if (rails.includes("venmo")) params.set("v", clean(handles.venmo));
  if (rails.includes("cashapp")) params.set("c", clean(handles.cashapp, "$"));
  if (rails.includes("paypal")) params.set("p", clean(handles.paypal));
  if (rails.includes("zelle")) params.set("z", handles.zelle.trim());
  return publicUrl(`/pay?${params.toString()}`);
}

/** Legacy single-rail link (kept for the Zelle instruction page). */
export function buildPaymentLink(
  rail: PaymentRail,
  handles: PayerHandles,
  amount: number,
  note: string
): string {
  const deep = buildRailDeepLink(rail, handles, amount, note);
  if (deep) return deep;
  const params = new URLSearchParams({
    handle: handles.zelle,
    amount: amount.toFixed(2),
    name: handles.payerName,
    note,
  });
  return publicUrl(`/pay/zelle?${params.toString()}`);
}

export function buildCopyText(
  rails: PaymentRail[],
  handles: PayerHandles,
  amount: number,
  currency: string,
  link: string
): string {
  const payer = handles.payerName || "me";
  const lines = rails.map((r) => `${RAIL_LABEL[r]}: ${railHandleDisplay(r, handles)}`);
  return `Pay ${payer} ${currency}${amount.toFixed(2)}\n${lines.join("\n")}\n${link}`;
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function buildReminderMessage(
  name: string,
  amount: number,
  currency: string,
  link: string
): string {
  return `Hey ${name}, your share of the bill is ${currency}${amount.toFixed(2)}. Pay me on Venmo: ${link}`;
}
