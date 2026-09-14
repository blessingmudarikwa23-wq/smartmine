import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  MoreHorizontal,
  Package,
  Pencil,
  Trash2,
  Wrench,
} from "lucide-react";

import type { InventoryItem } from "../../pages/Inventory";

type InventoryTableProps = {
  items: InventoryItem[];
  onStockIn: (id: number, quantity: number) => void;
  onStockOut: (id: number, quantity: number) => void;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (id: number) => void;
};

function InventoryTable({
  items,
  onStockIn,
  onStockOut,
  onEdit,
  onDelete,
}: InventoryTableProps) {
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const getStockPercentage = (item: InventoryItem) =>
    Math.min(
      100,
      Math.round(
        (item.quantity / Math.max(item.reorderLevel * 2, 1)) * 100
      )
    );

  const statusClasses = {
    "In Stock": "bg-emerald-50 text-emerald-700",
    "Low Stock": "bg-amber-50 text-amber-700",
    Critical: "bg-red-50 text-red-700",
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-[#10251f]">
            Inventory Directory
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Current stock position across mine storage locations.
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
          {items.length} item{items.length === 1 ? "" : "s"} displayed
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Boxes size={25} />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-700">
            No inventory found
          </h3>
          <p className="mt-1 max-w-md text-sm text-slate-400">
            Try changing your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Item
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Category
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Location
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Quantity
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Stock Level
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Status
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Updated
                </th>
                <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const Icon = item.icon || Package;
                const percentage = getStockPercentage(item);

                return (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10251f]/6 text-[#10251f]">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-xs font-medium text-slate-400">
                            {item.code}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-600">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-500">
                        {item.location}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <span className="text-sm font-bold text-slate-800">
                          {item.quantity.toLocaleString()}
                        </span>
                        <span className="ml-1 text-xs text-slate-400">
                          {item.unit}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="w-28">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            Min {item.minimumLevel}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {percentage}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              item.status === "Critical"
                                ? "bg-red-500"
                                : item.status === "Low Stock"
                                  ? "bg-amber-500"
                                  : "bg-[#d8a83e]"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          statusClasses[item.status]
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs text-slate-400">
                        {item.lastUpdated}
                      </span>
                    </td>

                    <td className="relative px-5 py-4 text-right">
                      <button
                        type="button"
                        aria-label={`Actions for ${item.name}`}
                        onClick={() =>
                          setOpenMenu(openMenu === item.id ? null : item.id)
                        }
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openMenu === item.id && (
                        <div className="absolute right-5 top-12 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl">
                          <button
                            type="button"
                            onClick={() => {
                              onStockIn(item.id, 1);
                              setOpenMenu(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                          >
                            <ArrowDownToLine size={15} />
                            Receive 1 {item.unit}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onStockOut(
                                item.id,
                                Math.min(1, item.quantity)
                              );
                              setOpenMenu(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                          >
                            <ArrowUpFromLine size={15} />
                            Issue 1 {item.unit}
                          </button>

                          <div className="my-1 border-t border-slate-100" />

                          {onEdit && (
                            <button
                              type="button"
                              onClick={() => {
                                onEdit(item);
                                setOpenMenu(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                            >
                              <Pencil size={15} />
                              Edit item
                            </button>
                          )}

                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => {
                                onDelete(item.id);
                                setOpenMenu(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 size={15} />
                              Delete item
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-400">
        <Wrench size={14} />
        Inventory levels update as stock is received or issued.
      </div>
    </section>
  );
}

export default InventoryTable;