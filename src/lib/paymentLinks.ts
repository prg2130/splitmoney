import { PayerHandles, PaymentRail, RAIL_LABEL } from "./payerHandles";

function clean(handle: string, stripPrefix?: string): string {
  let h = handle.trim();
  if (stripPrefix && h.startsWith(stripPrefix)) h = h.slice(stripPrefix.length);
  return h.replace(/^@/, "");
}

export function buildPaymentLink(
  rail: PaymentRail,
  handles: PayerHandles,
  amount: number,
  note: string
): string {
  const amt = amount.toFixed(2);
  switch (rail) {
    case "venmo": {
      const u = clean(handles.venmo);
      return `https://venmo.com/${encodeURIComponent(u)}?txn=pay&amount=${amt}&note=${encodeURIComponent(note)}`;
    }
    case "cashapp": {
      const u = clean(handles.cashapp, "$");
      return `https://cash.app/$${encodeURIComponent(u)}/${amt}`;
    }
    case "paypal": {
      const u = clean(handles.paypal);
      return `https://paypal.me/${encodeURIComponent(u)}/${amt}`;
    }
    case "zelle": {
      const params = new URLSearchParams({
        handle: handles.zelle,
        amount: amt,
        name: handles.payerName,
        note,
      });
      return `${window.location.origin}/pay/zelle?${params.toString()}`;
    }
  }
}

export function buildCopyText(
  rail: PaymentRail,
  handles: PayerHandles,
  amount: number,
  currency: string
): string {
  const handle =
    rail === "venmo"
      ? `@${clean(handles.venmo)}`
      : rail === "cashapp"
      ? `$${clean(handles.cashapp, "$")}`
      : rail === "paypal"
      ? `paypal.me/${clean(handles.paypal)}`
      : handles.zelle;
  const payer = handles.payerName || "me";
  return `Pay ${payer} ${currency}${amount.toFixed(2)} via ${RAIL_LABEL[rail]}: ${handle}`;
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function buildReminderMessage(
  name: string,
  amount: number,
  currency: string,
  rail: PaymentRail,
  link: string
): string {
  return `Hey ${name}, you owe ${currency}${amount.toFixed(2)} for the bill. Pay me via ${RAIL_LABEL[rail]}: ${link}`;
}