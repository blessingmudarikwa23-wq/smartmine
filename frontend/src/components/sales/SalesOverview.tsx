import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
} from "lucide-react";

import type { SalesTransaction } from "../../pages/Sales";

type SalesOverviewProps = {
  sales: SalesTransaction[];
};

function formatCurrency(value: number) {
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function SalesOverview({ sales }: SalesOverviewProps) {
  const completed = sales.filter(
    (sale) => sale.status === "Completed",
  );

  const revenue = completed.reduce(
    (sum, sale) => sum + sale.amount,
    0,
  );

  const pending = sales
    .filter((sale) => sale.status === "Pending")
    .reduce((sum, sale) => sum + sale.amount, 0);

  const overdue = sales
    .filter((sale) => sale.status === "Overdue")
    .reduce((sum, sale) => sum + sale.amount, 0);

  const maxAmount = Math.max(
    ...sales.map((sale) => sale.amount),
    1,
  );

  const recentSales = [...sales]
    .filter((sale) => sale.status === "Completed")
    .slice(0, 7)
    .reverse();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CircleDollarSign
              size={20}
              className="text-[#d8a83e]"
            />

            <h2 className="text-lg font-bold text-[#10251f]">
              Sales Performance
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-400">
            Revenue generated from completed mineral sales.
          </p>
        </div>

        <div className="rounded-xl bg-[#10251f] px-4 py-3 text-right text-white">
          <p className="text-[10px] uppercase tracking-wider text-white/45">
            Completed Revenue
          </p>

          <p className="mt-1 text-lg font-bold">
            {formatCurrency(revenue)}
          </p>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownLeft size={19} />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Completed
              </p>

              <p className="font-bold text-[#10251f]">
                {formatCurrency(revenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <CircleDollarSign size={19} />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Pending
              </p>

              <p className="font-bold text-[#10251f]">
                {formatCurrency(pending)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <ArrowUpRight size={19} />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Overdue
              </p>

              <p className="font-bold text-[#10251f]">
                {formatCurrency(overdue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales chart */}
      <div className="mt-8 rounded-2xl border border-slate-100 p-5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#10251f]">
              Recent Revenue Movement
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Completed sales by transaction.
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-400">
            {recentSales.length} recent sales
          </span>
        </div>

        <div className="relative h-52">
          <div className="absolute inset-0 flex flex-col justify-between">
            <span className="border-t border-dashed border-slate-100" />
            <span className="border-t border-dashed border-slate-100" />
            <span className="border-t border-dashed border-slate-100" />
            <span className="border-t border-dashed border-slate-100" />
          </div>

          <div className="absolute inset-x-0 bottom-0 top-2 flex items-end justify-between gap-3 px-2">
            {recentSales.map((sale) => {
              const height = Math.max(
                (sale.amount / maxAmount) * 100,
                8,
              );

              return (
                <div
                  key={sale.id}
                  className="group flex h-full flex-1 flex-col items-center justify-end"
                >
                  <div className="mb-2 rounded-lg bg-[#10251f] px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-sm transition group-hover:opacity-100">
                    {formatCurrency(sale.amount)}
                  </div>

                  <div
                    className="w-full max-w-[54px] rounded-t-xl bg-[#d8a83e] transition-all duration-500 group-hover:bg-[#c4962f]"
                    style={{
                      height: `${height}%`,
                    }}
                  />

                  <span className="mt-2 text-[9px] font-semibold text-slate-400">
                    {sale.reference.slice(-3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SalesOverview;