import {
  ArrowDownLeft,
  Clock3,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";

import type {
  SaleStatus,
  SalesTransaction,
} from "../../pages/Sales";

type SalesTransactionsProps = {
  sales: SalesTransaction[];
  searchTerm: string;
  statusFilter: "All" | SaleStatus;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "All" | SaleStatus) => void;
  onEdit: (sale: SalesTransaction) => void;
  onDelete: (sale: SalesTransaction) => void;
};

function formatCurrency(value: number) {
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function getStatusStyle(status: SaleStatus) {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700";

    case "Pending":
      return "bg-amber-50 text-amber-700";

    case "Overdue":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function SalesTransactions({
  sales,
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onEdit,
  onDelete,
}: SalesTransactionsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#10251f]">
              Sales Register
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Track mineral sales, quantities, buyers and
              settlement status.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={searchTerm}
                onChange={(event) =>
                  onSearchChange(event.target.value)
                }
                placeholder="Search sales..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/10 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                onStatusChange(
                  event.target.value as
                    | "All"
                    | SaleStatus,
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 outline-none focus:border-[#d8a83e]"
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Overdue">
                Overdue
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Reference
              </th>

              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Buyer
              </th>

              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Product
              </th>

              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quantity
              </th>

              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Purity
              </th>

              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Date
              </th>

              <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Amount
              </th>

              <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Status
              </th>

              <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr
                key={sale.id}
                className="border-b border-slate-100 transition hover:bg-slate-50/70"
              >
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-[#10251f]">
                    {sale.reference}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <p className="max-w-[190px] truncate text-sm font-semibold text-slate-700">
                    {sale.buyer}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {sale.product}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                  {sale.quantity} {sale.unit}
                </td>

                <td className="px-6 py-4 text-sm text-slate-500">
                  {sale.purity}
                </td>

                <td className="px-6 py-4 text-sm text-slate-500">
                  {sale.date}
                </td>

                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-bold text-[#10251f]">
                    {formatCurrency(sale.amount)}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${getStatusStyle(
                      sale.status,
                    )}`}
                  >
                    {sale.status === "Pending" ||
                    sale.status === "Overdue" ? (
                      <Clock3 size={11} />
                    ) : (
                      <ArrowDownLeft size={11} />
                    )}

                    {sale.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(sale)}
                      title="Edit sale"
                      aria-label={`Edit ${sale.reference}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#d8a83e] hover:bg-[#d8a83e]/10 hover:text-[#10251f]"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(sale)}
                      title="Delete sale"
                      aria-label={`Delete ${sale.reference}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sales.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-slate-500">
              No sales found.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or settlement
              filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default SalesTransactions;