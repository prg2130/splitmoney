import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, MessageCircle, Settings2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PersonTotal } from "@/lib/splitbill";
import {
  PayerHandles,
  PaymentRail,
  RAIL_LABEL,
  availableRails,
  hasAnyHandle,
  loadPayerHandles,
  savePayerHandles,
} from "@/lib/payerHandles";
import {
  buildCopyText,
  buildPaymentLink,
  buildReminderMessage,
  buildWhatsAppLink,
} from "@/lib/paymentLinks";

interface PaybackSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: PersonTotal[];
  currency: string;
}

const PaybackSheet = ({ open, onOpenChange, results, currency }: PaybackSheetProps) => {
  const { toast } = useToast();
  const [handles, setHandles] = useState<PayerHandles>(() => loadPayerHandles());
  const [editing, setEditing] = useState(false);
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());
  const [railByPerson, setRailByPerson] = useState<Record<string, PaymentRail>>({});

  useEffect(() => {
    if (open) {
      const h = loadPayerHandles();
      setHandles(h);
      setEditing(!hasAnyHandle(h));
    }
  }, [open]);

  const rails = useMemo(() => availableRails(handles), [handles]);

  const togglePaid = (id: string) => {
    setPaidIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    if (!hasAnyHandle(handles)) {
      toast({ title: "Add at least one handle", description: "Enter your Venmo, Cash App, Zelle, or PayPal." });
      return;
    }
    savePayerHandles(handles);
    setEditing(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader className="text-left">
          <SheetTitle>Collect from group</SheetTitle>
          <SheetDescription>
            Each person scans their QR to pay you directly. No money goes through this app.
          </SheetDescription>
        </SheetHeader>

        {editing ? (
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
            <div className="space-y-1.5">
              <Label htmlFor="venmo">Venmo username</Label>
              <Input
                id="venmo"
                placeholder="@yourname"
                value={handles.venmo}
                onChange={(e) => setHandles({ ...handles, venmo: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cashapp">Cash App $cashtag</Label>
              <Input
                id="cashapp"
                placeholder="$yourname"
                value={handles.cashapp}
                onChange={(e) => setHandles({ ...handles, cashapp: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="zelle">Zelle email or phone</Label>
              <Input
                id="zelle"
                placeholder="you@email.com"
                value={handles.zelle}
                onChange={(e) => setHandles({ ...handles, zelle: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="paypal">PayPal.me username</Label>
              <Input
                id="paypal"
                placeholder="yourname"
                value={handles.paypal}
                onChange={(e) => setHandles({ ...handles, paypal: e.target.value })}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Saved only on this device. Never sent to a server.
            </p>
            <Button variant="gradient" className="w-full" onClick={handleSave}>
              Save & continue
            </Button>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Using: {rails.map((r) => RAIL_LABEL[r]).join(" · ")}
              </p>
              <Button size="sm" variant="ghost" onClick={() => setEditing(true)} className="gap-1.5">
                <Settings2 className="h-3.5 w-3.5" />
                Edit handles
              </Button>
            </div>

            <div className="space-y-4">
              {results.map((r) => {
                const currentRail = railByPerson[r.person.id] ?? rails[0];
                const note = `Bill split${handles.payerName ? ` for ${handles.payerName}` : ""}`;
                const link = buildPaymentLink(currentRail, handles, r.total, note);
                const message = buildReminderMessage(r.person.name, r.total, currency, currentRail, link);
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
                            {currency}{r.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                        <Checkbox checked={paid} onCheckedChange={() => togglePaid(r.person.id)} />
                        Paid
                      </label>
                    </div>

                    {!paid && (
                      <>
                        <div className="flex flex-wrap gap-1.5">
                          {rails.map((rail) => (
                            <button
                              key={rail}
                              onClick={() =>
                                setRailByPerson((prev) => ({ ...prev, [r.person.id]: rail }))
                              }
                              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                                currentRail === rail
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-background text-muted-foreground border-border hover:border-primary/40"
                              }`}
                            >
                              {RAIL_LABEL[rail]}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="bg-white p-2 rounded-lg shrink-0">
                            <QRCodeSVG value={link} size={112} />
                          </div>
                          <div className="flex-1 space-y-2">
                            <p className="text-xs text-muted-foreground">
                              Scan to open {RAIL_LABEL[currentRail]} with amount pre-filled.
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
                                  buildCopyText(currentRail, handles, r.total, currency)
                                );
                                toast({ title: "Copied", description: "Payment details copied." });
                              }}
                            >
                              <Copy className="h-3.5 w-3.5" />
                              Copy details
                            </Button>
                          </div>
                        </div>
                      </>
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