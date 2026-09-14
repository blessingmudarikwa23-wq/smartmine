import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
} from "lucide-react";

type FinanceOverviewProps = {
  income: number;
  expenses: number;
};

function formatCurrency(value: number) {
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function FinanceOverview({
  income,
  expenses,
}: FinanceOverviewProps) {
  const net = income - expenses;
  const total = income + expenses;

  const incomeWidth =
    total > 0 ? Math.max((income / total) * 100, 5) : 50;

  const expenseWidth =
    total > 0 ? Math.max((expenses / total) * 100, 5) : 50;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CircleDollarSign size={20} className="text-[#d8a83e]" />
            <h2 className="text-lg font-bold text-[#10251f]">
              Financial Overview
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-400">
            Revenue and operating expenditure performance for the current
            reporting period.
          </p>
        </div>

        <div className="rounded-xl bg-[#10251f] px-4 py-3 text-right text-white">
          <p className="text-[10px] uppercase tracking-wider text-white/45">
            Net Position
          </p>
          <p className="mt-1 text-lg font-bold">
            {formatCurrency(net)}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ArrowDownLeft size={19} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Revenue
                </p>
                <p className="font-bold text-[#10251f]">
                  {formatCurrency(income)}
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-600">
              Income
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${incomeWidth}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <ArrowUpRight size={19} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Expenses
                </p>
                <p className="font-bold text-[#10251f]">
                  {formatCurrency(expenses)}
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-amber-600">
              Operating
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-[#d8a83e] transition-all duration-500"
              style={{ width: `${expenseWidth}%` }}
            />
          </div>
        </div>
      </div>

      {/* Operational finance flow */}
      <div className="mt-7 overflow-x-auto">
        <div className="flex min-w-[620px] items-center justify-between gap-3">
          <div className="rounded-xl border border-slate-200 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">
              Revenue
            </p>
            <p className="mt-1 font-bold text-emerald-600">
              {formatCurrency(income)}
            </p>
          </div>

          <div className="h-px flex-1 bg-slate-200" />

          <div className="rounded-xl border border-slate-200 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">
              Operating Costs
            </p>
            <p className="mt-1 font-bold text-amber-600">
              {formatCurrency(expenses)}
            </p>
          </div>

          <div className="h-px flex-1 bg-slate-200" />

          <div className="rounded-xl bg-[#10251f] px-4 py-3 text-white">
            <p className="text-[10px] uppercase tracking-wider text-white/45">
              Net Position
            </p>
            <p className="mt-1 font-bold">
              {formatCurrency(net)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinanceOverview;