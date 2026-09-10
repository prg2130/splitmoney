import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, MessageCircle, Settings2, Check, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PersonTotal } from "@/lib/splitbill";
import {
  PayerHandles,
  PaymentRail,
  RAIL_LABEL,
  availableRails,
  loadPayerHandles,
  savePayerHandles,
} from "@/lib/payerHandles";
import {
  buildCopyText,
  buildRailDeepLink,
  buildReminderMessage,
  buildWhatsAppLink,
} from "@/lib/paymentLinks";

interface PaybackSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: PersonTotal[];
  currency: string;
}

type Step = "apps" | "details" | "share";

const ALL_RAILS: PaymentRail[] = ["venmo"];

const RAIL_META: Record<
  PaymentRail,
  { field: keyof PayerHandles; label: string; placeholder: string; hint: string }
> = {
  venmo: {
    field: "venmo",
    label: "Venmo username",
    placeholder: "@yourname",
    hint: "Opens Venmo with the amount filled in.",
  },
  cashapp: {
    field: "cashapp",
    label: "Cash App $cashtag",
    placeholder: "$yourname",
    hint: "Opens Cash App with the amount filled in.",
  },
  paypal: {
    field: "paypal",
    label: "PayPal.me username",
    placeholder: "yourname",
    hint: "Opens your PayPal.me page with the amount filled in.",
  },
  zelle: {
    field: "zelle",
    label: "Zelle email or phone",
    placeholder: "you@email.com",
    hint: "Zelle can't be opened from a link, so we show your details to copy into their bank app.",
  },
};

const PaybackSheet = ({ open, onOpenChange, results, currency }: PaybackSheetProps) => {
  const { toast } = useToast();
  const [handles, setHandles] = useState<PayerHandles>(() => loadPayerHandles());
  const [selected, setSelected] = useState<PaymentRail[]>([]);
  const [step, setStep] = useState<Step>("apps");
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;
    const h = loadPayerHandles();
    setHandles(h);
    const saved = availableRails(h);
    setSelected(saved.length > 0 ? saved : ["venmo"]);
    setStep(saved.length > 0 ? "share" : "details");
  }, [open]);

  const activeRails = useMemo(
    () => selected.filter((r) => handles[RAIL_META[r].field].trim() !== ""),
    [selected, handles]
  );

  const toggleRail = (rail: PaymentRail) =>
    setSelected((prev) => (prev.includes(rail) ? prev.filter((r) => r !== rail) : [...prev, rail]));

  const togglePaid = (id: string) =>
    setPaidIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const saveDetails = () => {
    const missing = selected.filter((r) => !handles[RAIL_META[r].field].trim());
    if (missing.length > 0) {
      toast({
        title: "Missing details",
        description: `Add your ${missing.map((r) => RAIL_LABEL[r]).join(", ")} info.`,
      });
      return;
    }
    // Clear handles for apps that are no longer selected
    const cleaned = { ...handles };
    ALL_RAILS.filter((r) => !selected.includes(r)).forEach((r) => {
      cleaned[RAIL_META[r].field] = "";
    });
    setHandles(cleaned);
    savePayerHandles(cleaned);
    setStep("share");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader className="text-left">
          <SheetTitle>Collect from group</SheetTitle>
          <SheetDescription>
            {step === "apps"
              ? "Pick the apps you can receive money on."
              : step === "details"
              ? "Enter the details people need to pay you."
              : "Share each person's link. Money goes straight to you."}
          </SheetDescription>
        </SheetHeader>

        {step === "apps" && (
          <div className="mt-5 space-y-3">
            {ALL_RAILS.map((rail) => {
              const on = selected.includes(rail);
              return (
                <button
                  key={rail}
                  type="button"
                  onClick={() => toggleRail(rail)}
                  aria-pressed={on}
                  className={`w-full text-left rounded-2xl border p-4 transition-colors ${
                    on ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox checked={on} className="pointer-events-none" />
                    <div>
                      <p className="font-semibold text-foreground">{RAIL_LABEL[rail]}</p>
                      <p className="text-xs text-muted-foreground">{RAIL_META[rail].hint}</p>
                    </div>
                  </div>
                </button>
              );
            })}
            <Button
              variant="gradient"
              className="w-full"
              disabled={selected.length === 0}
              onClick={() => setStep("details")}
            >
              Continue
            </Button>
          </div>
        )}

        {step === "details" && (
          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="payerName">Your name (optional)</Label>
              <Input
                id="payerName"
                placeholder="e.g. Alex"
                value={handles.payerName}
                onChange={(e) => setHandles({ ...handles, payerName: e.target.value })}
              />
            </div>
            {selected.map((rail) => {
              const meta = RAIL_META[rail];
              return (
                <div key={rail} className="space-y-1.5">
                  <Label htmlFor={rail}>{meta.label}</Label>
                  <Input
                    id={rail}
                    placeholder={meta.placeholder}
                    value={handles[meta.field]}
                    onChange={(e) => setHandles({ ...handles, [meta.field]: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">{meta.hint}</p>
                </div>
              );
            })}
            <p className="text-xs text-muted-foreground">
              Saved only on this device. Never sent to a server.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="gap-1.5" onClick={() => setStep("apps")}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button variant="gradient" onClick={saveDetails}>
                Save &amp; continue
              </Button>
            </div>
          </div>
        )}

        {step === "share" && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Accepting: {activeRails.map((r) => RAIL_LABEL[r]).join(" · ") || "nothing yet"}
              </p>
              <Button size="sm" variant="ghost" onClick={() => setStep("apps")} className="gap-1.5">
                <Settings2 className="h-3.5 w-3.5" />
                Change apps
              </Button>
            </div>

            <div className="space-y-4">
              {results.map((r) => {
                const note = `Bill split${handles.payerName ? ` for ${handles.payerName}` : ""}`;
                const link = buildRailDeepLink("venmo", handles, r.total, note);
                if (!link) return null;
                const message = buildReminderMessage(r.person.name, r.total, currency, link);
                const paid = paidIds.has(r.person.id);

                return (
                  <div
                    key={r.person.id}
                    className={`rounded-2xl border border-border bg-card p-4 space-y-3 ${paid ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0"
                          style={{ backgroundColor: r.person.color }}
                        >
                          {r.person.name.charAt(0)}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{r.person.name}</p>
                          <p className="text-lg font-extrabold gradient-text tabular">
                            {currency}
                            {r.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                        <Checkbox checked={paid} onCheckedChange={() => togglePaid(r.person.id)} />
                        Paid
                      </label>
                    </div>

                    {!paid && activeRails.length > 0 && (
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-lg shrink-0">
                          <QRCodeSVG value={link} size={112} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-xs text-muted-foreground">
                            Scan or send the link to open Venmo directly.
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full gap-1.5"
                            onClick={() => window.open(buildWhatsAppLink(message), "_blank")}
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            WhatsApp
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-full gap-1.5"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                buildCopyText(activeRails, handles, r.total, currency, link)
                              );
                              toast({ title: "Copied", description: "Payment link copied." });
                            }}
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copy link
                          </Button>
                        </div>
                      </div>
                    )}
                    {paid && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5" /> Marked as paid
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default PaybackSheet;
