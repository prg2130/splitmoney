import { PersonTotal } from "@/lib/splitbill";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResultsViewProps {
  results: PersonTotal[];
  currency: string;
  billTotal: number | null;
  onReset: () => void;
}

const ResultsView = ({ results, currency, billTotal, onReset }: ResultsViewProps) => {
  const { toast } = useToast();
  const splitTotal = results.reduce((s, r) => s + r.total, 0);
  const grandTotal = billTotal ?? splitTotal;

  const handleShare = () => {
    const text = results
      .map((r) => `${r.person.name}: ${currency}${r.total.toFixed(2)}`)
      .join("\n");
    const full = `🧾 Bill Split\n\n${text}\n\nTotal: ${currency}${grandTotal.toFixed(2)}`;

    if (navigator.share) {
      navigator.share({ text: full });
    } else {
      navigator.clipboard.writeText(full);
      toast({ title: "Copied to clipboard!", description: "Share it with your friends" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground">Each Person Owes</h2>
        <p className="text-sm text-muted-foreground">Including proportional tax & charges</p>
      </div>

      <div className="space-y-3">
        {results.map((r, i) => (
          <motion.div
            key={r.person.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border bg-card overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span
                  className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground"
                  style={{ backgroundColor: r.person.color }}
                >
                  {r.person.name.charAt(0)}
                </span>
                <span className="font-semibold text-foreground">{r.person.name}</span>
              </div>
              <span className="text-xl font-bold text-primary">
                {currency}{r.total.toFixed(2)}
              </span>
            </div>

            {/* Breakdown */}
            <div className="px-4 pb-3 space-y-1">
              {r.items.map((item, j) => (
                <div key={j} className="flex justify-between text-xs text-muted-foreground">
                  <span>{item.name}</span>
                  <span>{currency}{item.share.toFixed(2)}</span>
                </div>
              ))}
              {r.extrasShare > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground italic border-t border-border pt-1 mt-1">
                  <span>Tax & charges</span>
                  <span>{currency}{r.extrasShare.toFixed(2)}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grand total */}
      <div className="rounded-xl bg-primary px-5 py-4 text-primary-foreground text-center">
        <p className="text-sm opacity-80">Grand Total</p>
        <p className="text-3xl font-bold">{currency}{grandTotal.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          New Bill
        </Button>
        <Button onClick={handleShare} className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </motion.div>
  );
};

export default ResultsView;
