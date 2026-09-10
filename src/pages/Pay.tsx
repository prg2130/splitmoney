import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaymentRail, RAIL_LABEL } from "@/lib/payerHandles";

const Pay = () => {
  const [params] = useSearchParams();
  const { toast } = useToast();

  const amount = params.get("a") ?? "";
  const payer = params.get("to") ?? "";
  const note = params.get("note") ?? "Bill split";
  const venmo = params.get("v") ?? "";
  const cashapp = params.get("c") ?? "";
  const paypal = params.get("p") ?? "";
  const zelle = params.get("z") ?? "";

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied` });
  };

  const options: { rail: PaymentRail; handle: string; link: string | null }[] = [];
  if (venmo)
    options.push({
      rail: "venmo",
      handle: `@${venmo}`,
      link: `https://venmo.com/${encodeURIComponent(venmo)}?txn=pay&amount=${amount}&note=${encodeURIComponent(note)}`,
    });
  if (cashapp)
    options.push({
      rail: "cashapp",
      handle: `$${cashapp}`,
      link: `https://cash.app/$${encodeURIComponent(cashapp)}/${amount}`,
    });
  if (paypal)
    options.push({
      rail: "paypal",
      handle: `paypal.me/${paypal}`,
      link: `https://paypal.me/${encodeURIComponent(paypal)}/${amount}`,
    });
  if (zelle) options.push({ rail: "zelle", handle: zelle, link: null });

  return (
    <>
      <Helmet>
        <title>Pay your share | PayUrShare</title>
        <meta name="description" content="Pay your share of the bill with Venmo, Cash App, PayPal or Zelle." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-md mx-auto space-y-5">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Pay your share</h1>
            {payer && <p className="text-sm text-muted-foreground">to {payer}</p>}
          </div>

          {amount && (
            <div className="rounded-2xl gradient-primary px-5 py-6 text-primary-foreground text-center shadow-glow">
              <p className="text-xs uppercase tracking-[0.2em] opacity-80">You owe</p>
              <p className="text-4xl font-extrabold tabular mt-1">{amount}</p>
            </div>
          )}

          {options.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              This link is missing payment details. Ask for a new link.
            </p>
          )}

          <div className="space-y-3">
            {options.map((o) => (
              <div key={o.rail} className="rounded-2xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{RAIL_LABEL[o.rail]}</p>
                    <p className="text-sm text-muted-foreground break-all">{o.handle}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => copy(o.handle, RAIL_LABEL[o.rail])} className="gap-1.5 shrink-0">
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </Button>
                </div>
                {o.link ? (
                  <Button variant="gradient" className="w-full gap-2" onClick={() => window.open(o.link!, "_blank")}>
                    <ExternalLink className="h-4 w-4" />
                    Open {RAIL_LABEL[o.rail]}
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Zelle lives inside your bank app. Open your bank's Zelle, send {amount} to the
                    contact above{payer ? ` (${payer})` : ""}.
                  </p>
                )}
              </div>
            ))}
          </div>

          {note && <p className="text-xs text-muted-foreground text-center">Note: {note}</p>}
        </div>
      </div>
    </>
  );
};

export default Pay;
