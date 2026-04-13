import { Expense, Person } from "@/lib/splitbill";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpenseListProps {
  expenses: Expense[];
  people: Person[];
  onDelete: (id: string) => void;
}

const ExpenseList = ({ expenses, people, onDelete }: ExpenseListProps) => {
  const getName = (id: string) => people.find((p) => p.id === id)?.name ?? "Unknown";

  if (expenses.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Expenses</h3>
      {expenses.map((expense, i) => (
        <motion.div
          key={expense.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{expense.description}</p>
            <p className="text-xs text-muted-foreground">
              Paid by {getName(expense.paidById)} · split {expense.splitAmong.length} ways
            </p>
          </div>
          <span className="font-bold text-sm">${expense.amount.toFixed(2)}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(expense.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default ExpenseList;
