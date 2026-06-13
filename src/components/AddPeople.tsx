import { useState } from "react";
import { Person, getColor } from "@/lib/splitbill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, X, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface AddPeopleProps {
  people: Person[];
  onPeopleChange: (people: Person[]) => void;
  onContinue: () => void;
}

const AddPeople = ({ people, onPeopleChange, onContinue }: AddPeopleProps) => {
  const [name, setName] = useState("");

  const addPerson = () => {
    if (name.trim()) {
      onPeopleChange([
        ...people,
        { id: crypto.randomUUID(), name: name.trim(), color: getColor(people.length) },
      ]);
      setName("");
    }
  };

  const removePerson = (id: string) => {
    onPeopleChange(people.filter((p) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPerson();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground">Who's Splitting?</h2>
        <p className="text-sm text-muted-foreground">Add everyone at the table</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Enter name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
          aria-label="Enter person name"
        />
        <Button type="submit" size="icon" disabled={!name.trim()} aria-label="Add person">
          <UserPlus className="h-4 w-4" />
        </Button>
      </form>

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
              <button onClick={() => removePerson(person.id)} className="rounded-full p-0.5 hover:bg-foreground/10" aria-label={`Remove ${person.name}`}>
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
        </div>
      )}

      <Button
        variant="gradient"
        onClick={onContinue}
        disabled={people.length < 2}
        className="w-full gap-2"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </Button>

      {people.length < 2 && people.length > 0 && (
        <p className="text-xs text-center text-muted-foreground">Add at least 2 people to continue</p>
      )}
    </motion.div>
  );
};

export default AddPeople;
