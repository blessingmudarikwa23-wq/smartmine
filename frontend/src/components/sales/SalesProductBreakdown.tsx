import {
  CircleDollarSign,
  Gem,
  Mountain,
  Package,
} from "lucide-react";

import type {
  SaleProduct,
  SalesTransaction,
} from "../../pages/Sales";

type SalesProductBreakdownProps = {
  sales: SalesTransaction[];
};

const productIcons = {
  Gold: Gem,
  "Gold Concentrate": CircleDollarSign,
  Copper: Mountain,
  Chrome: Mountain,
  Other: Package,
};

function formatCurrency(value: number) {
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function SalesProductBreakdown({
  sales,
}: SalesProductBreakdownProps) {
  const products: SaleProduct[] = [
    "Gold",
    "Gold Concentrate",
    "Copper",
    "Chrome",
    "Other",
  ];

  const completedSales = sales.filter(
    (sale) => sale.status === "Completed",
  );

  const data = products
    .map((product) => ({
      product,
      amount: completedSales
        .filter((sale) => sale.product === product)
        .reduce((sum, sale) => sum + sale.amount, 0),
    }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const total = data.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gem size={20} className="text-[#d8a83e]" />

            <h2 className="text-lg font-bold text-[#10251f]">
              Sales by Mineral
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-400">
            Revenue contribution from each saleable product.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
          {formatCurrency(total)}
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {data.map((item) => {
          const Icon = productIcons[item.product];

          const percentage =
            total > 0 ? (item.amount / total) * 100 : 0;

          return (
            <div key={item.product}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#10251f]">
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-700">
                      {item.product}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      {percentage.toFixed(1)}% of revenue
                    </p>
                  </div>
                </div>

                <span className="shrink-0 text-sm font-bold text-[#10251f]">
                  {formatCurrency(item.amount)}
                </span>
              </div>

              <div className="ml-13 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#d8a83e] transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-400">
            No completed sales available.
          </div>
        )}
      </div>
    </section>
  );
}

export default SalesProductBreakdown;