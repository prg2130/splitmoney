import { useState } from "react";
import { BillItem, Person, ExtraSplitMethod } from "@/lib/splitbill";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, Users, Percent, Equal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AssignItemsProps {
  items: BillItem[];
  people: Person[];
  onItemsChange: (items: BillItem[]) => void;
  onContinue: () => void;
  onBack: () => void;
  currency: string;
  extraSplitMethod: ExtraSplitMethod;
  onExtraSplitMethodChange: (method: ExtraSplitMethod) => void;
}

const AssignItems = ({ items, people, onItemsChange, onContinue, onBack, currency, extraSplitMethod, onExtraSplitMethodChange }: AssignItemsProps) => {
  const foodItems = items.filter((i) => !i.isExtra);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = foodItems[currentIndex];

  const togglePerson = (personId: string) => {
    const updated = items.map((item) => {
      if (item.id === currentItem.id) {
        const assigned = item.assignedTo.includes(personId)
          ? item.assignedTo.filter((id) => id !== personId)
          : [...item.assignedTo, personId];
        return { ...item, assignedTo: assigned };
      }
      return item;
    });
    onItemsChange(updated);
  };

  const selectAll = () => {
    const updated = items.map((item) => {
      if (item.id === currentItem.id) {
        return { ...item, assignedTo: people.map((p) => p.id) };
      }
      return item;
    });
    onItemsChange(updated);
  };

  const allAssigned = foodItems.every((item) => item.assignedTo.length > 0);
  const currentAssigned = currentItem?.assignedTo || [];

  if (!currentItem) return null;

  const progress = ((currentIndex + 1) / foodItems.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground">Who had this?</h2>
        <p className="text-xs text-muted-foreground">
          Item {currentIndex + 1} of {foodItems.length}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Current item card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="rounded-xl border-2 border-primary/20 bg-card p-5 text-center"
        >
          <p className="text-lg font-bold text-foreground">{currentItem.name}</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {currency}{(currentItem.price * currentItem.quantity).toFixed(2)}
          </p>
          {currentItem.quantity > 1 && (
            <p className="text-xs text-muted-foreground mt-1">
              {currentItem.quantity} × {currency}{currentItem.price.toFixed(2)}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* People selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Select who shared this item</span>
          <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={selectAll}>
            <Users className="h-3 w-3" />
            Everyone
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {people.map((person) => {
            const isSelected = currentAssigned.includes(person.id);
            return (
              <button
                key={person.id}
                onClick={() => togglePerson(person.id)}
                className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2.5 transition-all text-sm font-medium ${
                  isSelected
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/30"
                }`}
              >
                <span
                  className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0"
                  style={{ backgroundColor: person.color }}
                >
                  {person.name.charAt(0)}
                </span>
                <span className="truncate">{person.name}</span>
                <Checkbox checked={isSelected} className="ml-auto pointer-events-none" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            if (currentIndex === 0) onBack();
            else setCurrentIndex(currentIndex - 1);
          }}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={() => {
            if (currentIndex < foodItems.length - 1) {
              setCurrentIndex(currentIndex + 1);
            } else {
              onContinue();
            }
          }}
          disabled={currentAssigned.length === 0}
          className="flex-1 gap-1"
        >
          {currentIndex < foodItems.length - 1 ? "Next Item" : "See Results"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick overview dots */}
      <div className="flex justify-center gap-1 flex-wrap">
        {foodItems.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              i === currentIndex
                ? "bg-primary scale-125"
                : item.assignedTo.length > 0
                ? "bg-success"
                : "bg-muted-foreground/30"
            }`}
            title={item.name}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default AssignItems;
