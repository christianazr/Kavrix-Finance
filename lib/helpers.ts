export type BudgetItemType = "income" | "fixed" | "variable";

export type BudgetItem = {
  id: string;
  budget_id: string;
  name: string;
  amount: number;
  type: BudgetItemType;
};

export type MonthlyBudget = {
  id: string;
  month: string;
  year: number;
  created_at?: string;
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function calculateBudgetTotals(items: BudgetItem[]) {
  const income = items
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const fixed = items
    .filter((item) => item.type === "fixed")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const variable = items
    .filter((item) => item.type === "variable")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = income - fixed - variable;

  return { income, fixed, variable, balance };
}
