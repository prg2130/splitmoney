export type PaymentRail = "venmo" | "cashapp" | "zelle" | "paypal";

export interface PayerHandles {
  payerName: string;
  venmo: string;
  cashapp: string;
  zelle: string;
  paypal: string;
}

const STORAGE_KEY = "splitbill.payerHandles.v1";

const empty: PayerHandles = {
  payerName: "",
  venmo: "",
  cashapp: "",
  zelle: "",
  paypal: "",
};

export function loadPayerHandles(): PayerHandles {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...empty };
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return { ...empty };
  }
}

export function savePayerHandles(handles: PayerHandles) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(handles));
  } catch {
    /* ignore */
  }
}

export function hasAnyHandle(h: PayerHandles): boolean {
  return !!(h.venmo || h.cashapp || h.zelle || h.paypal);
}

export function availableRails(h: PayerHandles): PaymentRail[] {
  const rails: PaymentRail[] = [];
  if (h.venmo) rails.push("venmo");
  if (h.cashapp) rails.push("cashapp");
  if (h.zelle) rails.push("zelle");
  if (h.paypal) rails.push("paypal");
  return rails;
}

export const RAIL_LABEL: Record<PaymentRail, string> = {
  venmo: "Venmo",
  cashapp: "Cash App",
  zelle: "Zelle",
  paypal: "PayPal",
};