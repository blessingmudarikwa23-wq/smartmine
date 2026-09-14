import {
  ArrowUpRight,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";

import type { ReportPeriod } from "../../pages/Reports";

type ReportsFinancialProps = {
  period: ReportPeriod;
  revenue: number;
  expenses: number;
  profit: number;
  formatCurrency: (value: number) => string;
};

function ReportsFinancial({
  period,
  revenue,
  expenses,
  profit,
  formatCurrency,
}: ReportsFinancialProps) {
  const margin = Math.round((profit / revenue) * 100);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CircleDollarSign
              size={20}
              className="text-[#d8a83e]"
            />

            <h2 className="text-lg font-bold text-[#10251f]">
              Financial Report
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-400">
            Financial performance for the{" "}
            {period.toLowerCase()} period.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
          <ArrowUpRight size={13} />
          +9.8%
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-[#10251f] p-5 text-white">
        <p className="text-xs uppercase tracking-wider text-white/45">
          Net Operating Result
        </p>

        <p className="mt-2 text-3xl font-bold">
          {formatCurrency(profit)}
        </p>

        <div className="mt-4 flex items-center gap-2 text-xs text-white/55">
          <TrendingUp size={14} className="text-[#d8a83e]" />
          {margin}% operating margin
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Revenue
            </span>

            <span className="text-sm font-bold text-[#10251f]">
              {formatCurrency(revenue)}
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#d8a83e]"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Operating Expenses
            </span>

            <span className="text-sm font-bold text-[#10251f]">
              {formatCurrency(expenses)}
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#10251f]"
              style={{
                width: `${Math.round(
                  (expenses / revenue) * 100,
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
          <span className="text-xs font-semibold text-slate-500">
            Net Result
          </span>

          <span className="text-sm font-bold text-emerald-700">
            {formatCurrency(profit)}
          </span>
        </div>
      </div>
    </section>
  );
}

export default ReportsFinancial;