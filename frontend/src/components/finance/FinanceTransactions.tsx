import {
  ArrowDownLeft,
  ArrowUpRight,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";

import type {
  FinanceTransaction,
  TransactionStatus,
} from "../../pages/Finance";


type FinanceTransactionsProps = {
  transactions: FinanceTransaction[];
  searchTerm: string;
  statusFilter:
    | "All"
    | TransactionStatus;
  onSearchChange: (
    value: string,
  ) => void;
  onStatusChange: (
    value:
      | "All"
      | TransactionStatus,
  ) => void;
  onEdit: (
    transaction: FinanceTransaction,
  ) => void;
  onDelete: (
    id: number,
  ) => void | Promise<void>;
  loading?: boolean;
};


function formatCurrency(value: number) {
  return `R ${value.toLocaleString(
    "en-ZA",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  )}`;
}


function getStatusStyle(
  status: TransactionStatus,
) {
  switch (status) {
    case "Paid":
      return "bg-emerald-50 text-emerald-700";

    case "Pending":
      return "bg-amber-50 text-amber-700";

    case "Overdue":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}


function FinanceTransactions({
  transactions,
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onEdit,
  onDelete,
  loading = false,
}: FinanceTransactionsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-lg font-bold text-[#10251f]">
              Recent Transactions
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Track recorded income, expenses and supplier commitments.
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
                  onSearchChange(
                    event.target.value,
                  )
                }
                placeholder="Search transactions..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/10 sm:w-64"
              />
            </div>


            <select
              value={statusFilter}
              onChange={(event) =>
                onStatusChange(
                  event.target.value as
                    | "All"
                    | TransactionStatus,
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 outline-none focus:border-[#d8a83e]"
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Paid">
                Paid
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

        <table className="w-full min-w-[1100px]">

          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-left">

              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Reference
              </th>

              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Transaction
              </th>

              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Category
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

            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#d8a83e]" />

                    <p className="text-sm font-semibold text-slate-500">
                      Loading finance transactions...
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map(
                (transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/70"
                  >

                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-[#10251f]">
                        {transaction.reference}
                      </span>
                    </td>


                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            transaction.type ===
                            "Income"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {transaction.type ===
                          "Income" ? (
                            <ArrowDownLeft
                              size={17}
                            />
                          ) : (
                            <ArrowUpRight
                              size={17}
                            />
                          )}
                        </div>


                        <div>
                          <p className="max-w-[280px] truncate text-sm font-semibold text-slate-700">
                            {
                              transaction.description
                            }
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {
                              transaction.supplier
                            }
                          </p>
                        </div>

                      </div>
                    </td>


                    <td className="px-6 py-4 text-sm text-slate-500">
                      {
                        transaction.category
                      }
                    </td>


                    <td className="px-6 py-4 text-sm text-slate-500">
                      {transaction.date}
                    </td>


                    <td className="px-6 py-4 text-right">
                      <span
                        className={`text-sm font-bold ${
                          transaction.type ===
                          "Income"
                            ? "text-emerald-600"
                            : "text-[#10251f]"
                        }`}
                      >
                        {transaction.type ===
                        "Income"
                          ? "+"
                          : "-"}
                        {formatCurrency(
                          transaction.amount,
                        )}
                      </span>
                    </td>


                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${getStatusStyle(
                          transaction.status,
                        )}`}
                      >
                        {
                          transaction.status
                        }
                      </span>
                    </td>


                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            onEdit(
                              transaction,
                            )
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#d8a83e] hover:bg-amber-50 hover:text-[#10251f]"
                          title="Edit transaction"
                          aria-label="Edit transaction"
                        >
                          <Pencil
                            size={15}
                          />
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            void onDelete(
                              transaction.id,
                            )
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                          title="Delete transaction"
                          aria-label="Delete transaction"
                        >
                          <Trash2
                            size={15}
                          />
                        </button>

                      </div>
                    </td>

                  </tr>
                ),
              )
            )}

          </tbody>

        </table>


        {!loading &&
          transactions.length ===
            0 && (
            <div className="p-10 text-center">
              <p className="text-sm font-semibold text-slate-500">
                No transactions found.
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try changing your search or status filter.
              </p>
            </div>
          )}

      </div>
    </section>
  );
}


export default FinanceTransactions;