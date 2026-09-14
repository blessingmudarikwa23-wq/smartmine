import {
  CircleDollarSign,
  Fuel,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";

import type { FinanceTransaction } from "../../pages/Finance";

type FinanceBudgetStatusProps = {
  transactions: FinanceTransaction[];
};

const budgets = [
  {
    category: "Fuel",
    budget: 50000,
    icon: Fuel,
  },
  {
    category: "Equipment",
    budget: 45000,
    icon: Settings2,
  },
  {
    category: "Workforce",
    budget: 60000,
    icon: Users,
  },
  {
    category: "Safety",
    budget: 15000,
    icon: ShieldCheck,
  },
];

function formatCurrency(value: number) {
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function FinanceBudgetStatus({
  transactions,
}: FinanceBudgetStatusProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f] text-[#d8a83e]">
          <CircleDollarSign size={19} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#10251f]">
            Budget Control
          </h2>
          <p className="text-sm text-slate-400">
            Current spend against operational budgets.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {budgets.map((budget) => {
          const Icon = budget.icon;

          const spent = transactions
            .filter(
              (transaction) =>
                transaction.type === "Expense" &&
                transaction.category === budget.category,
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0);

          const percentage = Math.min(
            (spent / budget.budget) * 100,
            100,
          );

          const remaining = Math.max(budget.budget - spent, 0);

          const isHigh = percentage >= 80;

          return (
            <div key={budget.category}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-[#10251f]">
                    <Icon size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {budget.category}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      {formatCurrency(spent)} of{" "}
                      {formatCurrency(budget.budget)}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold ${
                    isHigh ? "text-amber-600" : "text-emerald-600"
                  }`}
                >
                  {percentage.toFixed(0)}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isHigh ? "bg-amber-500" : "bg-[#10251f]"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[11px]">
                <span className="text-slate-400">
                  Remaining
                </span>
                <span className="font-semibold text-slate-500">
                  {formatCurrency(remaining)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FinanceBudgetStatus;