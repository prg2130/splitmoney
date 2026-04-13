import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface AddPersonProps {
  onAdd: (name: string) => void;
}

const AddPerson = ({ onAdd }: AddPersonProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Add a person..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={!name.trim()}>
        <UserPlus className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default AddPerson;
