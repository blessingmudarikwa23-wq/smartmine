import {
  Award,
  Building2,
  CircleDollarSign,
  Users,
} from "lucide-react";

import type { SalesTransaction } from "../../pages/Sales";

type SalesBuyerPerformanceProps = {
  sales: SalesTransaction[];
};

function formatCurrency(value: number) {
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function SalesBuyerPerformance({
  sales,
}: SalesBuyerPerformanceProps) {
  const buyers = Array.from(
    new Set(sales.map((sale) => sale.buyer)),
  )
    .map((buyer) => {
      const buyerSales = sales.filter(
        (sale) =>
          sale.buyer === buyer &&
          sale.status === "Completed",
      );

      return {
        buyer,
        transactions: buyerSales.length,
        revenue: buyerSales.reduce(
          (sum, sale) => sum + sale.amount,
          0,
        ),
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const maxRevenue = Math.max(
    ...buyers.map((buyer) => buyer.revenue),
    1,
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f] text-[#d8a83e]">
          <Users size={19} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#10251f]">
            Buyer Performance
          </h2>

          <p className="text-sm text-slate-400">
            Revenue contribution from active mineral buyers.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {buyers.map((buyer, index) => {
          const percentage =
            (buyer.revenue / maxRevenue) * 100;

          return (
            <div key={buyer.buyer}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#10251f]">
                  {index === 0 ? (
                    <Award size={18} />
                  ) : (
                    <Building2 size={18} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-bold text-slate-700">
                      {buyer.buyer}
                    </p>

                    <span className="shrink-0 text-sm font-bold text-[#10251f]">
                      {formatCurrency(buyer.revenue)}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-[11px] text-slate-400">
                      {buyer.transactions} completed{" "}
                      {buyer.transactions === 1
                        ? "sale"
                        : "sales"}
                    </p>

                    <span className="text-[10px] font-semibold text-slate-400">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#10251f] transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
        <CircleDollarSign
          size={18}
          className="text-[#d8a83e]"
        />

        <p className="text-xs leading-5 text-slate-500">
          Buyer performance is calculated from completed
          settlements recorded in the current sales register.
        </p>
      </div>
    </section>
  );
}

export default SalesBuyerPerformance;