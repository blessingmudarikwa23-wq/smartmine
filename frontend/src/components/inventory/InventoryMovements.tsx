import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock3,
  Package,
} from "lucide-react";

import type { InventoryMovement } from "../../pages/Inventory";

type InventoryMovementsProps = {
  movements: InventoryMovement[];
};

function InventoryMovements({
  movements,
}: InventoryMovementsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#10251f]">
            Recent Stock Movements
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Latest inventory receipts and issues.
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[#10251f]">
          <Package size={19} />
        </div>
      </div>

      <div className="mt-6 divide-y divide-slate-100">
        {movements.map((movement) => {
          const isStockIn = movement.type === "Stock In";

          return (
            <div
              key={movement.id}
              className="flex gap-3 py-4 first:pt-0 last:pb-0"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isStockIn
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {isStockIn ? (
                  <ArrowDownLeft size={18} />
                ) : (
                  <ArrowUpRight size={18} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col justify-between gap-1 sm:flex-row">
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {movement.item}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {movement.code} • {movement.reference}
                    </p>
                  </div>

                  <span
                    className={`text-sm font-bold ${
                      isStockIn
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }`}
                  >
                    {isStockIn ? "+" : "-"}
                    {movement.quantity.toLocaleString()}{" "}
                    {movement.unit}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                  <span>{movement.user}</span>

                  <span className="flex items-center gap-1">
                    <Clock3 size={12} />
                    {movement.date} • {movement.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default InventoryMovements;