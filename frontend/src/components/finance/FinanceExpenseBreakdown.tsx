import {
  Boxes,
  Droplets,
  Factory,
  HardHat,
  Package,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

import type {
  ExpenseCategory,
  FinanceTransaction,
} from "../../pages/Finance";

type FinanceExpenseBreakdownProps = {
  transactions: FinanceTransaction[];
};

const categoryIcons = {
  Fuel: Droplets,
  Equipment: Truck,
  Processing: Factory,
  Workforce: Users,
  Inventory: Boxes,
  Safety: ShieldCheck,
  Transport: Truck,
  Utilities: Wrench,
  Other: Package,
};

function formatCurrency(value: number) {
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function FinanceExpenseBreakdown({
  transactions,
}: FinanceExpenseBreakdownProps) {
  const categories: ExpenseCategory[] = [
    "Fuel",
    "Equipment",
    "Processing",
    "Workforce",
    "Inventory",
    "Safety",
    "Transport",
    "Utilities",
    "Other",
  ];

  const expenses = transactions.filter(
    (transaction) => transaction.type === "Expense",
  );

  const categoryData = categories
    .map((category) => ({
      category,
      amount: expenses
        .filter((transaction) => transaction.category === category)
        .reduce((sum, transaction) => sum + transaction.amount, 0),
    }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const total = categoryData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HardHat size={20} className="text-[#d8a83e]" />
            <h2 className="text-lg font-bold text-[#10251f]">
              Expense Breakdown
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-400">
            Where the mine is spending operational funds.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
          {formatCurrency(total)}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {categoryData.map((item) => {
          const Icon = categoryIcons[item.category];

          const percentage =
            total > 0 ? (item.amount / total) * 100 : 0;

          return (
            <div key={item.category}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#10251f]">
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-700">
                      {item.category}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {percentage.toFixed(1)}% of expenses
                    </p>
                  </div>
                </div>

                <p className="shrink-0 text-sm font-bold text-[#10251f]">
                  {formatCurrency(item.amount)}
                </p>
              </div>

              <div className="ml-12 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#d8a83e] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        {categoryData.length === 0 && (
          <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-400">
            No expense data available.
          </div>
        )}
      </div>
    </section>
  );
}

export default FinanceExpenseBreakdown;