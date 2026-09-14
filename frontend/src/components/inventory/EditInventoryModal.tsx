import { FormEvent, useState } from "react";
import {
  Boxes,
  CalendarDays,
  MapPin,
  Package,
  Truck,
  X,
} from "lucide-react";

import type { InventoryItem } from "../../pages/Inventory";

type EditInventoryModalProps = {
  item: InventoryItem;
  categories: string[];
  onClose: () => void;
  onSubmit: (
    item: Omit<
      InventoryItem,
      "id" | "status" | "lastUpdated" | "icon"
    >
  ) => void;
  isSaving?: boolean;
};

function EditInventoryModal({
  item,
  categories,
  onClose,
  onSubmit,
  isSaving = false,
}: EditInventoryModalProps) {
  const [code, setCode] = useState(item.code);
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [location, setLocation] = useState(item.location);
  const [unit, setUnit] = useState(item.unit);
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [minimumLevel, setMinimumLevel] = useState(
    item.minimumLevel.toString()
  );
  const [reorderLevel, setReorderLevel] = useState(
    item.reorderLevel.toString()
  );
  const [unitCost, setUnitCost] = useState(
    item.unitCost.toString()
  );
  const [supplier, setSupplier] = useState(item.supplier);

  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const cleanCode = code.trim();
    const cleanName = name.trim();
    const cleanSupplier = supplier.trim();

    const parsedQuantity = Number(quantity);
    const parsedMinimumLevel = Number(minimumLevel);
    const parsedReorderLevel = Number(reorderLevel);
    const parsedUnitCost = Number(unitCost);

    if (!cleanCode) {
      setError("Item code is required.");
      return;
    }

    if (!cleanName) {
      setError("Item name is required.");
      return;
    }

    if (!cleanSupplier) {
      setError("Supplier is required.");
      return;
    }

    if (
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity < 0
    ) {
      setError("Quantity must be a valid number greater than or equal to 0.");
      return;
    }

    if (
      !Number.isFinite(parsedMinimumLevel) ||
      parsedMinimumLevel < 0
    ) {
      setError(
        "Minimum level must be a valid number greater than or equal to 0."
      );
      return;
    }

    if (
      !Number.isFinite(parsedReorderLevel) ||
      parsedReorderLevel < 0
    ) {
      setError(
        "Reorder level must be a valid number greater than or equal to 0."
      );
      return;
    }

    if (
      !Number.isFinite(parsedUnitCost) ||
      parsedUnitCost < 0
    ) {
      setError(
        "Unit cost must be a valid number greater than or equal to 0."
      );
      return;
    }

    onSubmit({
      code: cleanCode.toUpperCase(),
      name: cleanName,
      category: category.trim(),
      location: location.trim(),
      unit: unit.trim(),
      quantity: parsedQuantity,
      minimumLevel: parsedMinimumLevel,
      reorderLevel: parsedReorderLevel,
      unitCost: parsedUnitCost,
      supplier: cleanSupplier,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10251f]/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d8a83e]/15 text-[#10251f]">
              <Boxes size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#10251f]">
                Edit Inventory Item
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Update the details for {item.name}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close edit inventory modal"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-6 py-6 sm:px-7"
        >
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            {/* ITEM CODE */}
            <div>
              <label
                htmlFor="edit-inventory-code"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                Item Code
              </label>

              <div className="relative">
                <Package
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="edit-inventory-code"
                  type="text"
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value)
                  }
                  disabled={isSaving}
                  placeholder="e.g. SP-CR-001"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/15 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* ITEM NAME */}
            <div>
              <label
                htmlFor="edit-inventory-name"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                Item Name
              </label>

              <input
                id="edit-inventory-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                disabled={isSaving}
                placeholder="e.g. Crusher Jaw Plate"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label
                htmlFor="edit-inventory-category"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                Category
              </label>

              <div className="relative">
                <Boxes
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  id="edit-inventory-category"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  disabled={isSaving}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {categories.map((categoryOption) => (
                    <option
                      key={categoryOption}
                      value={categoryOption}
                    >
                      {categoryOption}
                    </option>
                  ))}

                  {!categories.includes(category) && (
                    <option value={category}>
                      {category}
                    </option>
                  )}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div>
              <label
                htmlFor="edit-inventory-location"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                Location
              </label>

              <div className="relative">
                <MapPin
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="edit-inventory-location"
                  type="text"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  disabled={isSaving}
                  placeholder="e.g. Maintenance Store"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/15 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* UNIT */}
            <div>
              <label
                htmlFor="edit-inventory-unit"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                Unit
              </label>

              <input
                id="edit-inventory-unit"
                type="text"
                value={unit}
                onChange={(event) =>
                  setUnit(event.target.value)
                }
                disabled={isSaving}
                placeholder="e.g. units, litres, kg"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* QUANTITY */}
            <div>
              <label
                htmlFor="edit-inventory-quantity"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                Quantity
              </label>

              <input
                id="edit-inventory-quantity"
                type="number"
                min="0"
                step="any"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
                disabled={isSaving}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* MINIMUM LEVEL */}
            <div>
              <label
                htmlFor="edit-inventory-minimum"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                Minimum Level
              </label>

              <input
                id="edit-inventory-minimum"
                type="number"
                min="0"
                step="any"
                value={minimumLevel}
                onChange={(event) =>
                  setMinimumLevel(event.target.value)
                }
                disabled={isSaving}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* REORDER LEVEL */}
            <div>
              <label
                htmlFor="edit-inventory-reorder"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                Reorder Level
              </label>

              <input
                id="edit-inventory-reorder"
                type="number"
                min="0"
                step="any"
                value={reorderLevel}
                onChange={(event) =>
                  setReorderLevel(event.target.value)
                }
                disabled={isSaving}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* UNIT COST */}
            <div>
              <label
                htmlFor="edit-inventory-cost"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                Unit Cost
              </label>

              <input
                id="edit-inventory-cost"
                type="number"
                min="0"
                step="0.01"
                value={unitCost}
                onChange={(event) =>
                  setUnitCost(event.target.value)
                }
                disabled={isSaving}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* SUPPLIER */}
            <div>
              <label
                htmlFor="edit-inventory-supplier"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                Supplier
              </label>

              <div className="relative">
                <Truck
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="edit-inventory-supplier"
                  type="text"
                  value={supplier}
                  onChange={(event) =>
                    setSupplier(event.target.value)
                  }
                  disabled={isSaving}
                  placeholder="e.g. Mining Parts Supply"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/15 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* INFORMATION */}
          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <CalendarDays
                size={17}
                className="mt-0.5 shrink-0 text-[#d8a83e]"
              />

              <div>
                <p className="text-xs font-bold text-slate-700">
                  Inventory status
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  The inventory status is automatically recalculated by
                  the backend using the quantity, minimum level and
                  reorder level.
                </p>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d8a83e] px-5 py-3 text-sm font-bold text-[#10251f] shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#10251f]/30 border-t-[#10251f]" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Package size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditInventoryModal;