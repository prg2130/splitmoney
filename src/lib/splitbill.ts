export type ExtraSplitMethod = "proportional" | "equal";

export interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isExtra: boolean; // tax, tip, service charge
  assignedTo: string[]; // person IDs who share this item
}

export interface Person {
  id: string;
  name: string;
  color: string;
}

export interface PersonTotal {
  person: Person;
  items: { name: string; share: number }[];
  subtotal: number;
  extrasShare: number;
  total: number;
}

const COLORS = [
  "hsl(168, 64%, 40%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 55%, 55%)",
  "hsl(350, 65%, 55%)",
  "hsl(200, 70%, 50%)",
  "hsl(100, 50%, 45%)",
  "hsl(20, 80%, 55%)",
  "hsl(310, 60%, 50%)",
];

export function getColor(index: number): string {
  return COLORS[index % COLORS.length];
}

export function calculateSplit(
  items: BillItem[],
  people: Person[],
  extraSplitMethod: ExtraSplitMethod = "proportional"
): PersonTotal[] {
  const foodItems = items.filter((i) => !i.isExtra);
  const extraItems = items.filter((i) => i.isExtra);
  const totalExtras = extraItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalFood = foodItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const result: PersonTotal[] = people.map((person) => {
    const personItems: { name: string; share: number }[] = [];
    let subtotal = 0;

    foodItems.forEach((item) => {
      if (item.assignedTo.includes(person.id)) {
        const share = (item.price * item.quantity) / item.assignedTo.length;
        personItems.push({ name: item.name, share });
        subtotal += share;
      }
    });

    // Share of extras based on chosen method
    let extrasShare: number;
    if (extraSplitMethod === "equal") {
      extrasShare = totalExtras / people.length;
    } else {
      extrasShare = totalFood > 0 ? (subtotal / totalFood) * totalExtras : 0;
    }

    return {
      person,
      items: personItems,
      subtotal: Math.round(subtotal * 100) / 100,
      extrasShare: Math.round(extrasShare * 100) / 100,
      total: Math.round((subtotal + extrasShare) * 100) / 100,
    };
  });

  return result;
}
