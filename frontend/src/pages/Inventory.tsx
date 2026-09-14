import { useCallback, useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  Boxes,
  ClipboardList,
  Droplets,
  Filter,
  Fuel,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

import InventoryKPI from "../components/inventory/InventoryKPI";
import InventoryOverview from "../components/inventory/InventoryOverview";
import InventoryTable from "../components/inventory/InventoryTable";
import InventoryMovements from "../components/inventory/InventoryMovements";
import InventoryAlerts from "../components/inventory/InventoryAlerts";
import AddInventoryModal from "../components/inventory/AddInventoryModal";
import EditInventoryModal from "../components/inventory/EditInventoryModal";

// ============================================================
// TYPES
// ============================================================

export type InventoryItem = {
  id: number;
  code: string;
  name: string;
  category: string;
  location: string;
  unit: string;
  quantity: number;
  minimumLevel: number;
  reorderLevel: number;
  unitCost: number;
  supplier: string;
  status: "In Stock" | "Low Stock" | "Critical";
  lastUpdated: string;
  icon: typeof Boxes;
};

export type InventoryMovement = {
  id: number;
  item: string;
  code: string;
  type: "Stock In" | "Stock Out";
  quantity: number;
  unit: string;
  reference: string;
  user: string;
  date: string;
  time: string;
};

// ============================================================
// API CONFIGURATION
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8001";

// ============================================================
// INVENTORY CATEGORIES
// ============================================================

const INVENTORY_CATEGORIES = [
  "Fuel",
  "Lubricants",
  "Spare Parts",
  "Tools",
  "Safety Equipment",
  "PPE",
  "Electrical",
  "Mechanical",
  "Processing Supplies",
  "Consumables",
  "Other",
];

// ============================================================
// STATUS CALCULATION
// ============================================================

const calculateStatus = (
  quantity: number,
  min: number,
  reorder: number
): InventoryItem["status"] => {
  if (quantity <= min) {
    return "Critical";
  }

  if (quantity <= reorder) {
    return "Low Stock";
  }

  return "In Stock";
};

// ============================================================
// ICON SELECTION
// ============================================================

const getInventoryIcon = (category: string): typeof Boxes => {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("fuel")) {
    return Fuel;
  }

  if (
    normalizedCategory.includes("lubricant") ||
    normalizedCategory.includes("oil")
  ) {
    return Droplets;
  }

  if (normalizedCategory.includes("safety")) {
    return ShieldCheck;
  }

  if (normalizedCategory.includes("spare")) {
    return Wrench;
  }

  if (normalizedCategory.includes("electrical")) {
    return Settings2;
  }

  if (normalizedCategory.includes("processing")) {
    return Package;
  }

  if (normalizedCategory.includes("consumable")) {
    return Truck;
  }

  return Boxes;
};

// ============================================================
// DATE FORMATTER
// ============================================================

const formatLastUpdated = (value?: string | null): string => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============================================================
// API → FRONTEND ITEM
// ============================================================

const mapApiItemToInventoryItem = (item: any): InventoryItem => {
  const quantity = Number(item.quantity ?? 0);

  const minimumLevel = Number(
    item.minimumLevel ?? item.minimum_level ?? 0
  );

  const reorderLevel = Number(
    item.reorderLevel ?? item.reorder_level ?? 0
  );

  const unitCost = Number(
    item.unitCost ?? item.unit_cost ?? 0
  );

  const category = String(item.category ?? "Uncategorised");

  return {
    id: Number(item.id),
    code: String(item.code ?? ""),
    name: String(item.name ?? ""),
    category,
    location: String(item.location ?? ""),
    unit: String(item.unit ?? ""),
    quantity,
    minimumLevel,
    reorderLevel,
    unitCost,
    supplier: String(item.supplier ?? ""),

    status:
      item.status === "Critical" ||
      item.status === "Low Stock" ||
      item.status === "In Stock"
        ? item.status
        : calculateStatus(
            quantity,
            minimumLevel,
            reorderLevel
          ),

    lastUpdated: formatLastUpdated(
      item.lastUpdated ??
        item.last_updated ??
        item.updated_at
    ),

    icon: getInventoryIcon(category),
  };
};

// ============================================================
// API → FRONTEND MOVEMENT
// ============================================================

const mapApiMovementToInventoryMovement = (
  movement: any
): InventoryMovement => {
  const createdAt =
    movement.createdAt ?? movement.created_at;

  let date = String(movement.date ?? "");
  let time = String(movement.time ?? "");

  if (createdAt) {
    const parsedDate = new Date(createdAt);

    if (!Number.isNaN(parsedDate.getTime())) {
      date = parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      time = parsedDate.toLocaleTimeString("en-ZA", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  return {
    id: Number(movement.id),

    item: String(
      movement.item ?? movement.item_name ?? ""
    ),

    code: String(movement.code ?? ""),

    type:
      movement.type === "Stock Out"
        ? "Stock Out"
        : "Stock In",

    quantity: Number(movement.quantity ?? 0),

    unit: String(movement.unit ?? ""),

    reference: String(movement.reference ?? ""),

    user: String(
      movement.user ?? "Mine Admin"
    ),

    date,
    time,
  };
};

// ============================================================
// COMPONENT
// ============================================================

export function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [editingItem, setEditingItem] =
    useState<InventoryItem | null>(null);

  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // ==========================================================
  // LOAD INVENTORY
  // ==========================================================

  const loadInventory = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setIsLoading(true);
      }

      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/api/inventory/items`
        );

        if (!response.ok) {
          let message = "Failed to load inventory.";

          try {
            const errorData = await response.json();

            if (typeof errorData?.detail === "string") {
              message = errorData.detail;
            }
          } catch {
            // Keep default message.
          }

          throw new Error(message);
        }

        const data = await response.json();

        const items = Array.isArray(data)
          ? data.map(mapApiItemToInventoryItem)
          : [];

        setInventory(items);
      } catch (error) {
        console.error("Error loading inventory:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load inventory."
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ==========================================================
  // LOAD MOVEMENTS
  // ==========================================================

  const loadMovements = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/inventory/movements`
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setMovements(
          data.map(mapApiMovementToInventoryMovement)
        );
      }
    } catch (error) {
      console.error(
        "Error loading inventory movements:",
        error
      );
    }
  }, []);

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    void loadInventory();
    void loadMovements();
  }, [loadInventory, loadMovements]);

  // ==========================================================
  // CATEGORIES FOR FILTERS
  // ==========================================================

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set([
          ...INVENTORY_CATEGORIES,
          ...inventory.map((item) => item.category),
        ])
      ),
    ],
    [inventory]
  );

  // ==========================================================
  // FILTERED INVENTORY
  // ==========================================================

  const filteredInventory = useMemo(() => {
    const query = search.trim().toLowerCase();

    return inventory.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    inventory,
    search,
    categoryFilter,
    statusFilter,
  ]);

  // ==========================================================
  // KPI CALCULATIONS
  // ==========================================================

  const totalItems = inventory.length;

  const totalUnits = inventory.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const inventoryValue = inventory.reduce(
    (total, item) =>
      total + item.quantity * item.unitCost,
    0
  );

  const lowStockItems = inventory.filter(
    (item) => item.status === "Low Stock"
  ).length;

  const criticalItems = inventory.filter(
    (item) => item.status === "Critical"
  ).length;

  const stockHealth = Math.round(
    (
      (
        totalItems -
        lowStockItems -
        criticalItems
      ) /
      Math.max(totalItems, 1)
    ) * 100
  );

  // ==========================================================
  // ADD INVENTORY
  // ==========================================================

  const handleAddInventory = useCallback(
    async (
      itemData: Omit<
        InventoryItem,
        "id" | "status" | "lastUpdated" | "icon"
      >
    ) => {
      try {
        const response = await fetch(
          `${API_URL}/api/inventory/items`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code: itemData.code,
              name: itemData.name,
              category: itemData.category,
              location: itemData.location,
              unit: itemData.unit,
              quantity: itemData.quantity,
              minimumLevel: itemData.minimumLevel,
              reorderLevel: itemData.reorderLevel,
              unitCost: itemData.unitCost,
              supplier: itemData.supplier,
            }),
          }
        );

        if (!response.ok) {
          let message =
            "Failed to create inventory item.";

          try {
            const errorData = await response.json();

            if (typeof errorData?.detail === "string") {
              message = errorData.detail;
            }
          } catch {
            // Keep default message.
          }

          throw new Error(message);
        }

        const createdItem = await response.json();

        const mappedItem =
          mapApiItemToInventoryItem(createdItem);

        setInventory((current) => [
          mappedItem,
          ...current,
        ]);

        setShowAddModal(false);

        await loadMovements();
      } catch (error) {
        console.error(
          "Error creating inventory item:",
          error
        );

        window.alert(
          error instanceof Error
            ? error.message
            : "Failed to create inventory item."
        );
      }
    },
    [loadMovements]
  );

  // ==========================================================
  // STOCK ADJUSTMENT
  // ==========================================================

  const handleStockAdjust = useCallback(
    async (
      id: number,
      quantity: number,
      type: "Stock In" | "Stock Out"
    ) => {
      if (quantity <= 0) {
        return;
      }

      try {
        const endpoint =
          type === "Stock In"
            ? "stock-in"
            : "stock-out";

        const response = await fetch(
          `${API_URL}/api/inventory/items/${id}/${endpoint}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              quantity,
              user: "Mine Admin",
              reference:
                type === "Stock In"
                  ? "Manual Stock Receipt"
                  : "Manual Stock Issue",
            }),
          }
        );

        if (!response.ok) {
          let message =
            `Failed to process ${type.toLowerCase()}.`;

          try {
            const errorData = await response.json();

            if (typeof errorData?.detail === "string") {
              message = errorData.detail;
            }
          } catch {
            // Keep default message.
          }

          throw new Error(message);
        }

        const updatedItem = await response.json();

        setInventory((current) =>
          current.map((existingItem) =>
            existingItem.id === id
              ? {
                  ...existingItem,
                  ...mapApiItemToInventoryItem(
                    updatedItem
                  ),
                }
              : existingItem
          )
        );

        await loadMovements();
      } catch (error) {
        console.error(
          `Error processing ${type}:`,
          error
        );

        window.alert(
          error instanceof Error
            ? error.message
            : `Failed to process ${type.toLowerCase()}.`
        );
      }
    },
    [loadMovements]
  );

  // ==========================================================
  // EDIT INVENTORY ITEM
  // ==========================================================

  const handleEditInventory = useCallback(
    async (
      itemData: Omit<
        InventoryItem,
        "id" | "status" | "lastUpdated" | "icon"
      >
    ) => {
      if (!editingItem) {
        return;
      }

      setIsSavingEdit(true);

      try {
        const response = await fetch(
          `${API_URL}/api/inventory/items/${editingItem.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code: itemData.code,
              name: itemData.name,
              category: itemData.category,
              location: itemData.location,
              unit: itemData.unit,
              quantity: itemData.quantity,
              minimumLevel: itemData.minimumLevel,
              reorderLevel: itemData.reorderLevel,
              unitCost: itemData.unitCost,
              supplier: itemData.supplier,
            }),
          }
        );

        if (!response.ok) {
          let message =
            "Failed to update inventory item.";

          try {
            const errorData = await response.json();

            if (typeof errorData?.detail === "string") {
              message = errorData.detail;
            }
          } catch {
            // Keep default message.
          }

          throw new Error(message);
        }

        const updatedItem = await response.json();

        const mappedItem =
          mapApiItemToInventoryItem(updatedItem);

        setInventory((current) =>
          current.map((existingItem) =>
            existingItem.id === editingItem.id
              ? mappedItem
              : existingItem
          )
        );

        setEditingItem(null);

        await loadMovements();
      } catch (error) {
        console.error(
          "Error updating inventory item:",
          error
        );

        window.alert(
          error instanceof Error
            ? error.message
            : "Failed to update inventory item."
        );
      } finally {
        setIsSavingEdit(false);
      }
    },
    [editingItem, loadMovements]
  );

  // ==========================================================
  // DELETE INVENTORY ITEM
  // ==========================================================

  const handleDeleteInventory = useCallback(
    async (id: number) => {
      const item = inventory.find(
        (currentItem) => currentItem.id === id
      );

      if (!item) {
        return;
      }

      const confirmed = window.confirm(
        `Are you sure you want to delete "${item.name}" (${item.code})?\n\nThis will permanently remove the inventory item and its movement records.`
      );

      if (!confirmed) {
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/inventory/items/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          let message =
            "Failed to delete inventory item.";

          try {
            const errorData = await response.json();

            if (typeof errorData?.detail === "string") {
              message = errorData.detail;
            }
          } catch {
            // DELETE 204 has no response body.
          }

          throw new Error(message);
        }

        setInventory((current) =>
          current.filter(
            (currentItem) => currentItem.id !== id
          )
        );

        setMovements((current) =>
          current.filter(
            (movement) => movement.code !== item.code
          )
        );
      } catch (error) {
        console.error(
          "Error deleting inventory item:",
          error
        );

        window.alert(
          error instanceof Error
            ? error.message
            : "Failed to delete inventory item."
        );
      }
    },
    [inventory]
  );

  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      await Promise.all([
        loadInventory(false),
        loadMovements(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [loadInventory, loadMovements]);

  // ==========================================================
  // RESET FILTERS
  // ==========================================================

  const handleResetFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setStatusFilter("All");
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <section className="rounded-3xl bg-[#10251f] p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d8a83e] text-[#10251f]">
                <Boxes
                  size={19}
                  strokeWidth={2.4}
                />
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d8a83e]">
                Inventory Control
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Inventory Management
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
              Monitor spare parts, consumables, fuel,
              processing supplies and safety stock across
              the mine.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  isRefreshing ? "animate-spin" : ""
                }
              />

              {isRefreshing
                ? "Refreshing..."
                : "Refresh Stock"}
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d8a83e] px-4 py-3 text-sm font-bold text-[#10251f] shadow-lg transition hover:brightness-105"
            >
              <Plus size={18} />
              Add Inventory
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================
          ERROR MESSAGE
      ====================================================== */}

      {error && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-bold">
                Unable to load inventory
              </p>

              <p className="mt-1">{error}</p>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          KPI METRICS
      ====================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InventoryKPI
          title="Inventory Items"
          value={totalItems.toString()}
          description="Active stock items"
          icon={Boxes}
          trend="+4.2%"
          trendLabel="vs last period"
          trendType="up"
        />

        <InventoryKPI
          title="Stock Units"
          value={totalUnits.toLocaleString()}
          description="Total quantity on hand"
          icon={Package}
          trend="+6.8%"
          trendLabel="stock movement"
          trendType="up"
        />

        <InventoryKPI
          title="Inventory Value"
          value={`R ${inventoryValue.toLocaleString(
            "en-ZA",
            {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }
          )}`}
          description="Estimated stock value"
          icon={ClipboardList}
          trend="+3.1%"
          trendLabel="current valuation"
          trendType="up"
        />

        <InventoryKPI
          title="Stock Alerts"
          value={(
            lowStockItems + criticalItems
          ).toString()}
          description="Items requiring attention"
          icon={AlertTriangle}
          trend={`${criticalItems} critical`}
          trendLabel="immediate attention"
          trendType="down"
        />
      </section>

      {/* ======================================================
          STOCK HEALTH
      ====================================================== */}

      <InventoryOverview
        totalItems={totalItems}
        lowStockItems={lowStockItems}
        criticalItems={criticalItems}
        stockHealth={stockHealth}
        inventoryValue={inventoryValue}
      />

      {/* ======================================================
          SEARCH / FILTER
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory by name, code, category or location..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/15"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                setShowFilters((prev) => !prev)
              }
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                showFilters
                  ? "border-[#d8a83e] bg-[#d8a83e]/10 text-[#10251f]"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter size={17} />
              Filters
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="inventory-category"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400"
              >
                Category
              </label>

              <select
                id="inventory-category"
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-[#d8a83e]"
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
                htmlFor="inventory-status"
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400"
              >
                Stock Status
              </label>

              <select
                id="inventory-status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-[#d8a83e]"
              >
                <option value="All">
                  All Statuses
                </option>

                <option value="In Stock">
                  In Stock
                </option>

                <option value="Low Stock">
                  Low Stock
                </option>

                <option value="Critical">
                  Critical
                </option>
              </select>
            </div>
          </div>
        )}
      </section>

      {/* ======================================================
          LOADING
      ====================================================== */}

      {isLoading ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <RefreshCw
            size={28}
            className="mx-auto animate-spin text-[#d8a83e]"
          />

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading inventory from database...
          </p>
        </section>
      ) : (
        <>
          {/* ==================================================
              INVENTORY TABLE
          ================================================== */}

          <InventoryTable
            items={filteredInventory}
            onStockIn={(id, qty) =>
              handleStockAdjust(
                id,
                qty,
                "Stock In"
              )
            }
            onStockOut={(id, qty) =>
              handleStockAdjust(
                id,
                qty,
                "Stock Out"
              )
            }
            onEdit={(item) =>
              setEditingItem(item)
            }
            onDelete={handleDeleteInventory}
          />

          {/* ==================================================
              LOWER SECTION
          ================================================== */}

          <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <InventoryMovements
              movements={movements}
            />

            <InventoryAlerts
              items={inventory.filter(
                (item) =>
                  item.status === "Low Stock" ||
                  item.status === "Critical"
              )}
            />
          </section>
        </>
      )}

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
        SmartMine Inventory Control • Stock visibility
        across mining operations
      </footer>

      {/* ======================================================
          ADD INVENTORY MODAL
      ====================================================== */}

      {showAddModal && (
        <AddInventoryModal
          categories={INVENTORY_CATEGORIES}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddInventory}
        />
      )}

      {/* ======================================================
          EDIT INVENTORY MODAL
      ====================================================== */}

      {editingItem && (
        <EditInventoryModal
          item={editingItem}
          categories={INVENTORY_CATEGORIES}
          onClose={() => setEditingItem(null)}
          onSubmit={handleEditInventory}
          isSaving={isSavingEdit}
        />
      )}
    </div>
  );
}

export default Inventory;