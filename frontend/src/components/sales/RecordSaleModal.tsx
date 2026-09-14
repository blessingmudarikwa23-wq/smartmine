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
  SaleProduct,
  SaleStatus,
  SalesTransaction,
} from "../../pages/Sales";

type RecordSaleModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    sale: Omit<
      SalesTransaction,
      "id" | "reference" | "date" | "recordedBy"
    >,
  ) => void;
  editingSale?: SalesTransaction | null;
};

function RecordSaleModal({
  open,
  onClose,
  onSubmit,
  editingSale = null,
}: RecordSaleModalProps) {
  const [buyer, setBuyer] = useState("");
  const [product, setProduct] =
    useState<SaleProduct>("Gold");

  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("g");
  const [purity, setPurity] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] =
    useState<SaleStatus>("Pending");

  const [paymentMethod, setPaymentMethod] =
    useState("Bank Transfer");

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editingSale) {
      setBuyer(editingSale.buyer);
      setProduct(editingSale.product);
      setQuantity(String(editingSale.quantity));
      setUnit(editingSale.unit);
      setPurity(
        editingSale.purity === "Not recorded"
          ? ""
          : editingSale.purity,
      );
      setAmount(String(editingSale.amount));
      setStatus(editingSale.status);
      setPaymentMethod(editingSale.paymentMethod);
    } else {
      setBuyer("");
      setProduct("Gold");
      setQuantity("");
      setUnit("g");
      setPurity("");
      setAmount("");
      setStatus("Pending");
      setPaymentMethod("Bank Transfer");
    }
  }, [open, editingSale]);

  if (!open) {
    return null;
  }

  const handleProductChange = (
    value: SaleProduct,
  ) => {
    setProduct(value);

    if (value === "Gold") {
      setUnit("g");
    } else if (value === "Gold Concentrate") {
      setUnit("kg");
    } else {
      setUnit("t");
    }
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const numericQuantity = Number(quantity);
    const numericAmount = Number(amount);

    if (
      !buyer.trim() ||
      !numericQuantity ||
      numericQuantity <= 0 ||
      !numericAmount ||
      numericAmount <= 0
    ) {
      return;
    }

    onSubmit({
      buyer: buyer.trim(),
      product,
      quantity: numericQuantity,
      unit,
      purity: purity.trim() || "Not recorded",
      amount: numericAmount,
      status,
      paymentMethod,
    });
  };

  const isEditing = Boolean(editingSale);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8a83e] text-[#10251f]">
              <CircleDollarSign size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#10251f]">
                {isEditing
                  ? "Edit Sale"
                  : "Record Sale"}
              </h2>

              <p className="text-xs text-slate-400">
                {isEditing
                  ? "Update the selected mineral sale."
                  : "Add a completed or pending mineral sale."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Buyer */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Buyer
              </label>

              <input
                value={buyer}
                onChange={(event) =>
                  setBuyer(event.target.value)
                }
                placeholder="Buyer / customer name"
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/10"
                required
              />
            </div>

            {/* Product */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Product
              </label>

              <select
                value={product}
                onChange={(event) =>
                  handleProductChange(
                    event.target.value as SaleProduct,
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#d8a83e]"
              >
                <option value="Gold">
                  Gold
                </option>

                <option value="Gold Concentrate">
                  Gold Concentrate
                </option>

                <option value="Copper">
                  Copper
                </option>

                <option value="Chrome">
                  Chrome
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Quantity
              </label>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(event.target.value)
                  }
                  placeholder="0"
                  className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#d8a83e]"
                  required
                />

                <select
                  value={unit}
                  onChange={(event) =>
                    setUnit(event.target.value)
                  }
                  className="h-11 w-24 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#d8a83e]"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="t">t</option>
                  <option value="units">
                    units
                  </option>
                </select>
              </div>
            </div>

            {/* Purity */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Purity / Grade
              </label>

              <input
                value={purity}
                onChange={(event) =>
                  setPurity(event.target.value)
                }
                placeholder="e.g. 91.4%"
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#d8a83e]"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Sale Amount
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
                    setAmount(event.target.value)
                  }
                  placeholder="0.00"
                  className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-4 text-sm outline-none focus:border-[#d8a83e]"
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Settlement Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as SaleStatus,
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#d8a83e]"
              >
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

            {/* Payment */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Payment Method
              </label>

              <select
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#d8a83e]"
              >
                <option value="Bank Transfer">
                  Bank Transfer
                </option>

                <option value="Cash">
                  Cash
                </option>

                <option value="Mobile Money">
                  Mobile Money
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#10251f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#16352d]"
            >
              {isEditing
                ? "Update Sale"
                : "Save Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecordSaleModal;