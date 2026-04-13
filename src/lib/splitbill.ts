export interface Person {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidById: string;
  splitAmong: string[]; // person IDs
  date: string;
}

export interface Balance {
  from: string;
  to: string;
  amount: number;
}

const COLORS = [
  "hsl(168, 64%, 40%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 55%, 55%)",
  "hsl(350, 65%, 55%)",
  "hsl(200, 70%, 50%)",
  "hsl(100, 50%, 45%)",
];

export function getColor(index: number): string {
  return COLORS[index % COLORS.length];
}

export function calculateBalances(people: Person[], expenses: Expense[]): Balance[] {
  const netBalances: Record<string, number> = {};
  people.forEach((p) => (netBalances[p.id] = 0));

  expenses.forEach((expense) => {
    const splitCount = expense.splitAmong.length;
    if (splitCount === 0) return;
    const share = expense.amount / splitCount;
    netBalances[expense.paidById] += expense.amount;
    expense.splitAmong.forEach((id) => {
      netBalances[id] -= share;
    });
  });

  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  Object.entries(netBalances).forEach(([id, amount]) => {
    if (amount < -0.01) debtors.push({ id, amount: -amount });
    else if (amount > 0.01) creditors.push({ id, amount });
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const result: Balance[] = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const transfer = Math.min(debtors[i].amount, creditors[j].amount);
    if (transfer > 0.01) {
      result.push({ from: debtors[i].id, to: creditors[j].id, amount: Math.round(transfer * 100) / 100 });
    }
    debtors[i].amount -= transfer;
    creditors[j].amount -= transfer;
    if (debtors[i].amount < 0.01) i++;
    if (creditors[j].amount < 0.01) j++;
  }

  return result;
}
