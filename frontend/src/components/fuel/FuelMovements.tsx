import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDot,
  Fuel as FuelIcon,
} from "lucide-react";

import type { FuelRecord } from "../../pages/Fuel";

type FuelMovementsProps = {
  records: FuelRecord[];
};

function FuelMovements({ records }: FuelMovementsProps) {
  const recentRecords = records.slice(0, 6);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-[#10251f]">
            Recent Fuel Movements
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Latest fuel transactions recorded in the operation
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10251f]/8 text-[#10251f]">
          <FuelIcon size={18} />
        </div>
      </div>

      <div className="mt-5 divide-y divide-slate-100">
        {recentRecords.map((record) => {
          const isDelivery = record.type === "Delivery";
          const isAdjustment = record.type === "Adjustment";

          return (
            <div
              key={record.id}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isDelivery
                      ? "bg-emerald-50 text-emerald-600"
                      : isAdjustment
                        ? "bg-amber-50 text-amber-600"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {isDelivery ? (
                    <ArrowDownLeft size={18} />
                  ) : isAdjustment ? (
                    <CircleDot size={18} />
                  ) : (
                    <ArrowUpRight size={18} />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#10251f]">
                    {record.equipment}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {record.date} · {record.time} · {record.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-8 sm:justify-end">
                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${
                      isDelivery
                        ? "text-emerald-600"
                        : "text-[#10251f]"
                    }`}
                  >
                    {isDelivery ? "+" : "-"}
                    {record.quantity.toLocaleString("en-ZA")} L
                  </p>

                  <p className="text-[11px] text-slate-400">
                    {record.fuelType}
                  </p>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="text-xs font-semibold text-slate-600">
                    {record.reference}
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {record.operator}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                    isDelivery
                      ? "bg-emerald-50 text-emerald-700"
                      : isAdjustment
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {record.type}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FuelMovements;