import {
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  PackageCheck,
} from "lucide-react";

type InventoryOverviewProps = {
  totalItems: number;
  lowStockItems: number;
  criticalItems: number;
  stockHealth: number;
  inventoryValue: number;
};

function InventoryOverview({
  totalItems,
  lowStockItems,
  criticalItems,
  stockHealth,
  inventoryValue,
}: InventoryOverviewProps) {
  const healthyItems =
    totalItems - lowStockItems - criticalItems;

  const healthWidth = Math.min(
    100,
    Math.max(0, stockHealth),
  );

  return (
    <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="flex items-center gap-2">
              <Boxes
                size={19}
                className="text-[#10251f]"
              />

              <h2 className="text-lg font-bold text-[#10251f]">
                Stock Health
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-400">
              Overall availability of inventory across the mine.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-3xl font-bold text-[#10251f]">
              {stockHealth}%
            </p>

            <p className="text-xs text-slate-400">
              healthy stock
            </p>
          </div>
        </div>

        <div className="mt-7">
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#d8a83e] transition-all"
              style={{ width: `${healthWidth}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <PackageCheck
                size={16}
                className="text-emerald-600"
              />

              <span className="text-xs font-semibold text-slate-500">
                Healthy
              </span>
            </div>

            <p className="mt-2 text-xl font-bold text-slate-800">
              {healthyItems}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle
                size={16}
                className="text-amber-600"
              />

              <span className="text-xs font-semibold text-slate-500">
                Low Stock
              </span>
            </div>

            <p className="mt-2 text-xl font-bold text-slate-800">
              {lowStockItems}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle
                size={16}
                className="text-red-600"
              />

              <span className="text-xs font-semibold text-slate-500">
                Critical
              </span>
            </div>

            <p className="mt-2 text-xl font-bold text-slate-800">
              {criticalItems}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <CircleDollarSign
            size={19}
            className="text-[#10251f]"
          />

          <h2 className="text-lg font-bold text-[#10251f]">
            Inventory Value
          </h2>
        </div>

        <p className="mt-1 text-sm text-slate-400">
          Estimated value of stock currently held.
        </p>

        <div className="mt-7 rounded-2xl bg-[#10251f] p-5 text-white">
          <p className="text-xs font-medium text-white/45">
            Current Stock Valuation
          </p>

          <p className="mt-2 text-3xl font-bold">
            R{" "}
            {inventoryValue.toLocaleString("en-ZA", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-xs text-white/45">
              Operational stock
            </span>

            <span className="text-sm font-semibold text-[#d8a83e]">
              Active
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InventoryOverview;