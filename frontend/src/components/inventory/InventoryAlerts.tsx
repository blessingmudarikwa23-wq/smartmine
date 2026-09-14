import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  ShoppingCart,
} from "lucide-react";

import type { InventoryItem } from "../../pages/Inventory";

type InventoryAlertsProps = {
  items: InventoryItem[];
};

function InventoryAlerts({
  items,
}: InventoryAlertsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#10251f]">
            Stock Alerts
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Items approaching or below minimum levels.
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
          <AlertTriangle size={19} />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-xl bg-emerald-50 p-5 text-center">
          <p className="text-sm font-bold text-emerald-700">
            All stock levels are healthy.
          </p>

          <p className="mt-1 text-xs text-emerald-600">
            No immediate inventory action is required.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 ${
                item.status === "Critical"
                  ? "border-red-100 bg-red-50/60"
                  : "border-amber-100 bg-amber-50/60"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    item.status === "Critical"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <Boxes size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {item.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {item.code} • {item.location}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${
                        item.status === "Critical"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400">
                        Current stock
                      </p>

                      <p className="text-sm font-bold text-slate-700">
                        {item.quantity.toLocaleString()}{" "}
                        {item.unit}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">
                        Reorder at
                      </p>

                      <p className="text-sm font-bold text-slate-700">
                        {item.reorderLevel.toLocaleString()}{" "}
                        {item.unit}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#10251f] transition hover:text-[#d8a83e]"
                  >
                    <ShoppingCart size={13} />
                    Review replenishment
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default InventoryAlerts;