import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  CircleDollarSign,
  X,
} from "lucide-react";

import type {
  ExpenseCategory,
  FinanceTransaction,
  TransactionStatus,
} from "../../pages/Finance";


type RecordExpenseModalProps = {
  open: boolean;
  onClose: () => void;

  onSubmit: (
    expense: Omit<
      FinanceTransaction,
      "id" |
        "reference" |
        "type" |
        "date" |
        "recordedBy"
    >,
  ) => void | Promise<void>;

  initialTransaction?: FinanceTransaction | null;

  submitting?: boolean;
};


function RecordExpenseModal({
  open,
  onClose,
  onSubmit,
  initialTransaction = null,
  submitting = false,
}: RecordExpenseModalProps) {

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState<ExpenseCategory>(
    "Fuel",
  );

  const [
    supplier,
    setSupplier,
  ] = useState("");

  const [
    amount,
    setAmount,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState<TransactionStatus>(
    "Pending",
  );


  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialTransaction) {
      setDescription(
        initialTransaction.description,
      );

      setCategory(
        initialTransaction.category,
      );

      setSupplier(
        initialTransaction.supplier,
      );

      setAmount(
        String(
          initialTransaction.amount,
        ),
      );

      setStatus(
        initialTransaction.status,
      );

      return;
    }

    setDescription("");
    setCategory("Fuel");
    setSupplier("");
    setAmount("");
    setStatus("Pending");
  }, [
    open,
    initialTransaction,
  ]);


  if (!open) {
    return null;
  }


  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const numericAmount =
      Number(amount);

    if (
      !description.trim() ||
      !supplier.trim() ||
      !numericAmount ||
      numericAmount <= 0
    ) {
      return;
    }

    await onSubmit({
      description:
        description.trim(),

      category,

      supplier:
        supplier.trim(),

      amount:
        numericAmount,

      status,
    });
  };


  const isEditing =
    Boolean(initialTransaction);


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8a83e] text-[#10251f]">
              <CircleDollarSign
                size={20}
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#10251f]">
                {isEditing
                  ? "Edit Expense"
                  : "Record Expense"}
              </h2>

              <p className="text-xs text-slate-400">
                {isEditing
                  ? "Update the selected mine expense."
                  : "Add a new mine operating expense."}
              </p>
            </div>

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

        </div>


        <form
          onSubmit={handleSubmit}
          className="p-6"
        >

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div className="sm:col-span-2">

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Expense Description
              </label>

              <input
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                placeholder="e.g. Crusher maintenance and parts"
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/10 disabled:bg-slate-50"
                disabled={submitting}
                required
              />

            </div>


            <div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Category
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value as ExpenseCategory,
                  )
                }
                disabled={submitting}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#d8a83e] disabled:bg-slate-50"
              >
                <option value="Fuel">
                  Fuel
                </option>

                <option value="Equipment">
                  Equipment
                </option>

                <option value="Processing">
                  Processing
                </option>

                <option value="Workforce">
                  Workforce
                </option>

                <option value="Inventory">
                  Inventory
                </option>

                <option value="Safety">
                  Safety
                </option>

                <option value="Transport">
                  Transport
                </option>

                <option value="Utilities">
                  Utilities
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

            </div>


            <div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Amount
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  R
                </span>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(event) =>
                    setAmount(
                      event.target.value,
                    )
                  }
                  placeholder="0.00"
                  disabled={submitting}
                  className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-4 text-sm outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/10 disabled:bg-slate-50"
                  required
                />

              </div>

            </div>


            <div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Supplier / Payee
              </label>

              <input
                value={supplier}
                onChange={(event) =>
                  setSupplier(
                    event.target.value,
                  )
                }
                placeholder="Supplier or payee"
                disabled={submitting}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/10 disabled:bg-slate-50"
                required
              />

            </div>


            <div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Payment Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as TransactionStatus,
                  )
                }
                disabled={submitting}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#d8a83e] disabled:bg-slate-50"
              >
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


          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#10251f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#16352d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : isEditing
                  ? "Update Expense"
                  : "Save Expense"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


export default RecordExpenseModal;