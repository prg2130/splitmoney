import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PayZelle = () => {
  const [params] = useSearchParams();
  const handle = params.get("handle") ?? "";
  const amount = params.get("amount") ?? "";
  const name = params.get("name") ?? "";
  const note = params.get("note") ?? "";
  const { toast } = useToast();

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied` });
  };

  const Row = ({ label, value }: { label: string; value: string }) =>
    value ? (
      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-foreground break-all">{value}</p>
          <Button size="sm" variant="outline" onClick={() => copy(value, label)} className="gap-1 shrink-0">
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
        </div>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto space-y-5">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Pay with Zelle</h1>
          <p className="text-sm text-muted-foreground">
            Open your bank's Zelle, send the amount below to the handle.
          </p>
        </div>
        <Row label="Amount" value={amount} />
        <Row label="Send to" value={handle} />
        <Row label="Recipient name" value={name} />
        <Row label="Note" value={note} />
      </div>
    </div>
  );
};

export default PayZelle;