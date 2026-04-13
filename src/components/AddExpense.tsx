import { useState } from "react";
import { Person } from "@/lib/splitbill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Receipt } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddExpenseProps {
  people: Person[];
  onAdd: (description: string, amount: number, paidById: string, splitAmong: string[]) => void;
}

const AddExpense = ({ people, onAdd }: AddExpenseProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitAmong, setSplitAmong] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const toggleSplit = (id: string) => {
    setSplitAmong((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSplitAmong(people.map((p) => p.id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (description.trim() && numAmount > 0 && paidBy && splitAmong.length > 0) {
      onAdd(description.trim(), numAmount, paidBy, splitAmong);
      setDescription("");
      setAmount("");
      setPaidBy("");
      setSplitAmong([]);
      setOpen(false);
    }
  };

  if (people.length < 2) return null;

  return (
    <div>
      <AnimatePresence>
        {!open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Button onClick={() => { setOpen(true); selectAll(); }} className="w-full gap-2">
              <Receipt className="h-4 w-4" />
              Add Expense
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="space-y-4 rounded-lg border bg-card p-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="What's the expense?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                placeholder="Amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger>
                <SelectValue placeholder="Who paid?" />
              </SelectTrigger>
              <SelectContent>
                {people.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <Label className="mb-2 block text-sm text-muted-foreground">Split among</Label>
              <div className="flex flex-wrap gap-3">
                {people.map((p) => (
                  <label key={p.id} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <Checkbox
                      checked={splitAmong.includes(p.id)}
                      onCheckedChange={() => toggleSplit(p.id)}
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={!description.trim() || !amount || !paidBy || splitAmong.length === 0}>
                Add
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddExpense;
