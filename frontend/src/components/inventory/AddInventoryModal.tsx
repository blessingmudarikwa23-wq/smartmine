import {
  useState,
  type FormEvent,
} from "react";
import {
  Boxes,
  CalendarDays,
  MapPin,
  Package,
  Plus,
  Truck,
  X,
} from "lucide-react";

import type { InventoryItem } from "../../pages/Inventory";

type AddInventoryModalProps = {
  categories: string[];
  onClose: () => void;
  onSubmit: (
    item: Omit<
      InventoryItem,
      "id" | "status" | "lastUpdated" | "icon"
    >,
  ) => void;
};

function AddInventoryModal({
  categories,
  onClose,
  onSubmit,
}: AddInventoryModalProps) {
  const [form, setForm] = useState({
    code: "",
    name: "",
    category: categories[0] || "Consumables",
    location: "General Store",
    unit: "units",
    quantity: "",
    minimumLevel: "",
    reorderLevel: "",
    unitCost: "",
    supplier: "",
  });

  const updateField = (
    field: keyof typeof form,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const quantity = Number(form.quantity);
    const minimumLevel = Number(form.minimumLevel);
    const reorderLevel = Number(form.reorderLevel);
    const unitCost = Number(form.unitCost);

    if (
      !form.code.trim() ||
      !form.name.trim() ||
      !form.supplier.trim() ||
      quantity < 0 ||
      minimumLevel < 0 ||
      reorderLevel < 0 ||
      unitCost < 0
    ) {
      return;
    }

    onSubmit({
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      category: form.category,
      location: form.location,
      unit: form.unit,
      quantity,
      minimumLevel,
      reorderLevel,
      unitCost,
      supplier: form.supplier.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-inventory-title"
        className="my-8 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#10251f] px-5 py-5 text-white sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d8a83e] text-[#10251f]">
              <Boxes size={21} />
            </div>

            <div>
              <h2
                id="add-inventory-title"
                className="text-lg font-bold"
              >
                Add Inventory Item
              </h2>

              <p className="text-xs text-white/45">
                Register new stock in the mine inventory.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
            {/* ITEM DETAILS */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Package
                  size={17}
                  className="text-[#10251f]"
                />

                <h3 className="text-sm font-bold text-[#10251f]">
                  Item Details
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="inventory-code"
                    className="mb-2 block text-xs font-bold text-slate-500"
                  >
                    Item Code
                  </label>

                  <input
                    id="inventory-code"
                    required
                    value={form.code}
                    onChange={(event) =>
                      updateField(
                        "code",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. SP-CR-003"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/15"
                  />
                </div>

                <div>
                  <label
                    htmlFor="inventory-name"
                    className="mb-2 block text-xs font-bold text-slate-500"
                  >
                    Item Name
                  </label>

                  <input
                    id="inventory-name"
                    required
                    value={form.name}
                    onChange={(event) =>
                      updateField(
                        "name",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. Crusher Oil Filter"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/15"
                  />
                </div>

                <div>
                  <label
                    htmlFor="inventory-category"
                    className="mb-2 block text-xs font-bold text-slate-500"
                  >
                    Category
                  </label>

                  <select
                    id="inventory-category"
                    value={form.category}
                    onChange={(event) =>
                      updateField(
                        "category",
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="inventory-unit"
                    className="mb-2 block text-xs font-bold text-slate-500"
                  >
                    Unit of Measure
                  </label>

                  <select
                    id="inventory-unit"
                    value={form.unit}
                    onChange={(event) =>
                      updateField(
                        "unit",
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
                  >
                    <option value="units">Units</option>
                    <option value="litres">Litres</option>
                    <option value="kg">Kilograms</option>
                    <option value="metres">Metres</option>
                    <option value="pairs">Pairs</option>
                    <option value="boxes">Boxes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* LOCATION */}
            <div className="mt-7 border-t border-slate-100 pt-6">
              <div className="mb-4 flex items-center gap-2">
                <MapPin
                  size={17}
                  className="text-[#10251f]"
                />

                <h3 className="text-sm font-bold text-[#10251f]">
                  Storage & Supplier
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="inventory-location"
                    className="mb-2 block text-xs font-bold text-slate-500"
                  >
                    Storage Location
                  </label>

                  <select
                    id="inventory-location"
                    value={form.location}
                    onChange={(event) =>
                      updateField(
                        "location",
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
                  >
                    <option value="General Store">
                      General Store
                    </option>

                    <option value="Maintenance Store">
                      Maintenance Store
                    </option>

                    <option value="Processing Store">
                      Processing Store
                    </option>

                    <option value="Fuel Depot">
                      Fuel Depot
                    </option>

                    <option value="Safety Store">
                      Safety Store
                    </option>

                    <option value="Electrical Store">
                      Electrical Store
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="inventory-supplier"
                    className="mb-2 block text-xs font-bold text-slate-500"
                  >
                    Supplier
                  </label>

                  <div className="relative">
                    <Truck
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="inventory-supplier"
                      required
                      value={form.supplier}
                      onChange={(event) =>
                        updateField(
                          "supplier",
                          event.target.value,
                        )
                      }
                      placeholder="Supplier name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/15"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* STOCK */}
            <div className="mt-7 border-t border-slate-100 pt-6">
              <div className="mb-4 flex items-center gap-2">
                <CalendarDays
                  size={17}
                  className="text-[#10251f]"
                />

                <h3 className="text-sm font-bold text-[#10251f]">
                  Stock Levels
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label
                    htmlFor="inventory-quantity"
                    className="mb-2 block text-xs font-bold text-slate-500"
                  >
                    Quantity
                  </label>

                  <input
                    id="inventory-quantity"
                    required
                    min="0"
                    type="number"
                    value={form.quantity}
                    onChange={(event) =>
                      updateField(
                        "quantity",
                        event.target.value,
                      )
                    }
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#d8a83e] focus:bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="inventory-minimum"
                    className="mb-2 block text-xs font-bold text-slate-500"
                  >
                    Minimum Level
                  </label>

                  <input
                    id="inventory-minimum"
                    required
                    min="0"
                    type="number"
                    value={form.minimumLevel}
                    onChange={(event) =>
                      updateField(
                        "minimumLevel",
                        event.target.value,
                      )
                    }
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#d8a83e] focus:bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="inventory-reorder"
                    className="mb-2 block text-xs font-bold text-slate-500"
                  >
                    Reorder Level
                  </label>

                  <input
                    id="inventory-reorder"
                    required
                    min="0"
                    type="number"
                    value={form.reorderLevel}
                    onChange={(event) =>
                      updateField(
                        "reorderLevel",
                        event.target.value,
                      )
                    }
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#d8a83e] focus:bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="inventory-cost"
                    className="mb-2 block text-xs font-bold text-slate-500"
                  >
                    Unit Cost (R)
                  </label>

                  <input
                    id="inventory-cost"
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    value={form.unitCost}
                    onChange={(event) =>
                      updateField(
                        "unitCost",
                        event.target.value,
                      )
                    }
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#d8a83e] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10251f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#17352c]"
            >
              <Plus size={17} />
              Add Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddInventoryModal;