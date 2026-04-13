import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Person, Expense, calculateBalances, getColor } from "@/lib/splitbill";
import AddPerson from "@/components/AddPerson";
import AddExpense from "@/components/AddExpense";
import ExpenseList from "@/components/ExpenseList";
import BalanceSummary from "@/components/BalanceSummary";
import { X, Receipt } from "lucide-react";

const Index = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const balances = useMemo(() => calculateBalances(people, expenses), [people, expenses]);
  const total = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  const addPerson = (name: string) => {
    setPeople((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, color: getColor(prev.length) },
    ]);
  };

  const removePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
    setExpenses((prev) => prev.filter((e) => e.paidById !== id && !e.splitAmong.includes(id)));
  };

  const addExpense = (description: string, amount: number, paidById: string, splitAmong: string[]) => {
    setExpenses((prev) => [
      ...prev,
      { id: crypto.randomUUID(), description, amount, paidById, splitAmong, date: new Date().toISOString() },
    ]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Receipt className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">SplitBill</h1>
          <p className="mt-1 text-sm text-muted-foreground">Split expenses, not friendships</p>
        </motion.div>

        <div className="space-y-6">
          {/* People */}
          <section className="space-y-3">
            <AddPerson onAdd={addPerson} />
            {people.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {people.map((person) => (
                  <motion.span
                    key={person.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-primary-foreground"
                    style={{ backgroundColor: person.color }}
                  >
                    {person.name}
                    <button onClick={() => removePerson(person.id)} className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10">
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </section>

          {/* Add Expense */}
          <AddExpense people={people} onAdd={addExpense} />

          {/* Total */}
          {total > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-primary px-5 py-4 text-primary-foreground"
            >
              <p className="text-sm opacity-80">Total expenses</p>
              <p className="text-3xl font-bold">${total.toFixed(2)}</p>
            </motion.div>
          )}

          {/* Balances */}
          <BalanceSummary balances={balances} people={people} />

          {/* Expense List */}
          <ExpenseList expenses={expenses} people={people} onDelete={deleteExpense} />
        </div>
      </div>
    </div>
  );
};

export default Index;
