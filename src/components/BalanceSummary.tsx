import { Person, Balance } from "@/lib/splitbill";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface BalanceSummaryProps {
  balances: Balance[];
  people: Person[];
}

const BalanceSummary = ({ balances, people }: BalanceSummaryProps) => {
  const getName = (id: string) => people.find((p) => p.id === id)?.name ?? "Unknown";
  const getColor = (id: string) => people.find((p) => p.id === id)?.color ?? "hsl(0,0%,50%)";

  if (balances.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Settle Up</h3>
      {balances.map((b, i) => (
        <motion.div
          key={`${b.from}-${b.to}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3 rounded-lg bg-accent/50 px-4 py-3"
        >
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
            style={{ backgroundColor: getColor(b.from) }}
          >
            {getName(b.from).charAt(0)}
          </span>
          <span className="font-medium text-sm">{getName(b.from)}</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
            style={{ backgroundColor: getColor(b.to) }}
          >
            {getName(b.to).charAt(0)}
          </span>
          <span className="font-medium text-sm">{getName(b.to)}</span>
          <span className="ml-auto font-bold text-primary">${b.amount.toFixed(2)}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default BalanceSummary;
