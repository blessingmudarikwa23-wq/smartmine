import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Fuel as FuelIcon,
} from "lucide-react";

import type { FuelRecord } from "../../pages/Fuel";

type FuelConsumptionTableProps = {
  records: FuelRecord[];
};

function FuelConsumptionTable({
  records,
}: FuelConsumptionTableProps) {
  const [search, setSearch] = useState("");
  const [fuelFilter, setFuelFilter] = useState<
    "All" | "Diesel" | "Petrol"
  >("All");

  const consumptionRecords = useMemo(() => {
    return records.filter((record) => {
      const isConsumption = record.type === "Consumption";

      const matchesSearch =
        record.equipment
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        record.operator
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        record.reference
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFuel =
        fuelFilter === "All" || record.fuelType === fuelFilter;

      return isConsumption && matchesSearch && matchesFuel;
    });
  }, [records, search, fuelFilter]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10251f]/8 text-[#10251f]">
                  <FuelIcon size={18} />
                </div>

                <div>
                  <h2 className="font-bold text-[#10251f]">
                    Fuel Consumption
                  </h2>

                  <p className="text-xs text-slate-400">
                    Equipment fuel usage records
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#d8a83e] hover:text-[#10251f] sm:flex"
            >
              <SlidersHorizontal size={14} />
              Filter
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search equipment, operator or reference..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#d8a83e] focus:bg-white"
              />
            </div>

            <select
              value={fuelFilter}
              onChange={(event) =>
                setFuelFilter(
                  event.target.value as "All" | "Diesel" | "Petrol",
                )
              }
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600 outline-none focus:border-[#d8a83e]"
            >
              <option value="All">All Fuel</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Equipment
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Fuel
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quantity
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Meter
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Cost
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Operator
              </th>
            </tr>
          </thead>

          <tbody>
            {consumptionRecords.map((record) => (
              <tr
                key={record.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-[#10251f]">
                      {record.equipment}
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {record.location} · {record.time}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-[#10251f]/8 px-2.5 py-1 text-[10px] font-bold text-[#10251f]">
                    {record.fuelType}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  <span className="text-sm font-bold text-[#10251f]">
                    {record.quantity.toLocaleString("en-ZA")} L
                  </span>
                </td>

                <td className="px-5 py-4 text-right text-sm text-slate-500">
                  {record.meterReading.toLocaleString("en-ZA")}
                </td>

                <td className="px-5 py-4 text-right">
                  <span className="text-sm font-semibold text-slate-700">
                    R
                    {record.cost.toLocaleString("en-ZA", {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="text-sm text-slate-600">
                    {record.operator}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {consumptionRecords.length === 0 && (
          <div className="px-6 py-12 text-center">
            <FuelIcon
              size={28}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-semibold text-slate-600">
              No consumption records found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or fuel filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FuelConsumptionTable;