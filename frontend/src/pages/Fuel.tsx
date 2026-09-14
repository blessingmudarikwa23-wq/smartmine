import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";
import {
  Fuel as FuelIcon,
  Plus,
  Truck,
  Upload,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import FuelKPI from "../components/fuel/FuelKPI";
import FuelOverview from "../components/fuel/FuelOverview";
import FuelTankStatus from "../components/fuel/FuelTankStatus";
import FuelConsumptionTable from "../components/fuel/FuelConsumptionTable";
import FuelMovements from "../components/fuel/FuelMovements";
import FuelAlerts from "../components/fuel/FuelAlerts";
import RecordFuelModal from "../components/fuel/RecordFuelModal";


// ============================================================
// TYPES
// ============================================================

export type FuelTransactionType =
  | "Consumption"
  | "Delivery"
  | "Adjustment";

export type FuelType =
  | "Diesel"
  | "Petrol";

export type FuelStatus =
  | "Healthy"
  | "Low"
  | "Critical";

export type FuelTank = {
  id: number;
  name: string;
  fuelType: FuelType;
  location: string;
  capacity: number;
  currentLevel: number;
  minimumLevel: number;
  unitCost: number;
  lastRefill: string;
  status: FuelStatus;
  icon: LucideIcon;
};

export type FuelRecord = {
  id: number;
  date: string;
  time: string;
  type: FuelTransactionType;
  equipment: string;
  operator: string;
  fuelType: FuelType;
  quantity: number;
  meterReading: number;
  cost: number;
  reference: string;
  location: string;
};

type FuelFormData = {
  type: FuelTransactionType;
  tankId: number;
  equipment: string;
  operator: string;
  fuelType: FuelType;
  quantity: number;
  meterReading: number;
  date: string;
  time: string;
  unitPrice: number;
  reference: string;
  location: string;
};

// ============================================================
// API RESPONSE TYPES
// ============================================================

type FuelTankApiResponse = {
  id: number;
  name: string;
  fuelType?: string;
  fuel_type?: string;
  location: string;
  capacity: number;
  currentLevel?: number;
  current_level?: number;
  minimumLevel?: number;
  minimum_level?: number;
  unitCost?: number;
  unit_cost?: number;
  lastRefill?: string;
  last_refill?: string;
  status?: string;
};

type FuelRecordApiResponse = {
  id: number;
  date: string;
  time: string;
  type: FuelTransactionType;
  equipment: string;
  operator: string;
  fuelType?: string;
  fuel_type?: string;
  quantity: number;
  meterReading?: number;
  meter_reading?: number;
  cost: number;
  reference: string;
  location: string;
};

// ============================================================
// API CONFIGURATION
// ============================================================

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8001"
).replace(/\/$/, "");

const FUEL_API_URL = `${API_URL}/api/fuel`;

// ============================================================
// DATE FORMATTER
// ============================================================

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const today = formatDate(new Date());

// ============================================================
// TANK ICON
// ============================================================

const getTankIcon = (
  name: string,
  fuelType: FuelType,
): LucideIcon => {
  const normalizedName = name.toLowerCase();

  if (
    normalizedName.includes("mobile") ||
    normalizedName.includes("truck")
  ) {
    return Truck;
  }

  if (fuelType === "Petrol") {
    return FuelIcon;
  }

  return FuelIcon;
};

// ============================================================
// NORMALIZE FUEL TYPE
// ============================================================

const normalizeFuelType = (
  value: string | undefined,
): FuelType => {
  return value?.toLowerCase() === "petrol"
    ? "Petrol"
    : "Diesel";
};

// ============================================================
// NORMALIZE FUEL STATUS
// ============================================================

const normalizeFuelStatus = (
  value: string | undefined,
): FuelStatus => {
  switch (value?.toLowerCase()) {
    case "critical":
      return "Critical";

    case "low":
      return "Low";

    default:
      return "Healthy";
  }
};

// ============================================================
// COMPONENT
// ============================================================

function Fuel(): ReactElement {
  const [tanks, setTanks] = useState<FuelTank[]>([]);
  const [records, setRecords] = useState<FuelRecord[]>([]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [modalMode, setModalMode] = useState<
    "consumption" | "delivery"
  >("consumption");

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  // ==========================================================
  // LOAD FUEL DATA
  // ==========================================================

  const loadFuelData = useCallback(
    async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const tanksUrl = `${FUEL_API_URL}/tanks`;
        const recordsUrl = `${FUEL_API_URL}/records`;

        console.log("Loading fuel tanks:", tanksUrl);
        console.log("Loading fuel records:", recordsUrl);

        const [tanksResponse, recordsResponse] =
          await Promise.all([
            fetch(tanksUrl),
            fetch(recordsUrl),
          ]);

        if (!tanksResponse.ok) {
          throw new Error(
            `Failed to load fuel tanks. Server returned ${tanksResponse.status}.`,
          );
        }

        if (!recordsResponse.ok) {
          throw new Error(
            `Failed to load fuel records. Server returned ${recordsResponse.status}.`,
          );
        }

        const tanksData: unknown =
          await tanksResponse.json();

        const recordsData: unknown =
          await recordsResponse.json();

        console.log(
          "Fuel tanks received:",
          tanksData,
        );

        console.log(
          "Fuel records received:",
          recordsData,
        );

        // ======================================================
        // MAP TANKS
        // ======================================================

        if (!Array.isArray(tanksData)) {
          throw new Error(
            "Fuel tanks API did not return a list.",
          );
        }

        const mappedTanks: FuelTank[] =
          tanksData.map(
            (tank: FuelTankApiResponse) => {
              const name = String(
                tank.name ?? "",
              );

              const fuelType =
                normalizeFuelType(
                  tank.fuelType ??
                    tank.fuel_type,
                );

              const mappedTank: FuelTank = {
                id: Number(tank.id),
                name,
                fuelType,
                location: String(
                  tank.location ?? "",
                ),
                capacity: Number(
                  tank.capacity ?? 0,
                ),
                currentLevel: Number(
                  tank.currentLevel ??
                    tank.current_level ??
                    0,
                ),
                minimumLevel: Number(
                  tank.minimumLevel ??
                    tank.minimum_level ??
                    0,
                ),
                unitCost: Number(
                  tank.unitCost ??
                    tank.unit_cost ??
                    0,
                ),
                lastRefill: String(
                  tank.lastRefill ??
                    tank.last_refill ??
                    "",
                ),
                status:
                  normalizeFuelStatus(
                    tank.status,
                  ),
                icon: getTankIcon(
                  name,
                  fuelType,
                ),
              };

              return mappedTank;
            },
          );

        console.log(
          "Mapped tanks:",
          mappedTanks,
        );

        console.table(
          mappedTanks.map((tank) => ({
            ID: tank.id,
            Name: tank.name,
            Capacity: tank.capacity,
            CurrentLevel: tank.currentLevel,
            FuelType: tank.fuelType,
            Location: tank.location,
          })),
        );

        setTanks(mappedTanks);

        // ======================================================
        // MAP RECORDS
        // ======================================================

        if (Array.isArray(recordsData)) {
          const mappedRecords: FuelRecord[] =
            recordsData.map(
              (
                record: FuelRecordApiResponse,
              ) => {
                return {
                  id: Number(record.id),
                  date: String(
                    record.date ?? "",
                  ),
                  time: String(
                    record.time ?? "",
                  ),
                  type: record.type,
                  equipment: String(
                    record.equipment ?? "",
                  ),
                  operator: String(
                    record.operator ?? "",
                  ),
                  fuelType:
                    normalizeFuelType(
                      record.fuelType ??
                        record.fuel_type,
                    ),
                  quantity: Number(
                    record.quantity ?? 0,
                  ),
                  meterReading: Number(
                    record.meterReading ??
                      record.meter_reading ??
                      0,
                  ),
                  cost: Number(
                    record.cost ?? 0,
                  ),
                  reference: String(
                    record.reference ?? "",
                  ),
                  location: String(
                    record.location ?? "",
                  ),
                };
              },
            );

          setRecords(mappedRecords);
        } else {
          setRecords([]);
        }
      } catch (err: unknown) {
        console.error(
          "Failed to load Fuel data:",
          err,
        );

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Failed to load Fuel data.",
          );
        }

        setTanks([]);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    void loadFuelData();
  }, [loadFuelData]);

  // ==========================================================
  // FUEL KPIs
  // ==========================================================

  const todayConsumption = useMemo<number>(() => {
    return records
      .filter(
        (record) =>
          record.date === today &&
          record.type === "Consumption",
      )
      .reduce(
        (sum, record) =>
          sum + record.quantity,
        0,
      );
  }, [records]);

  const todaySpend = useMemo<number>(() => {
    return records
      .filter(
        (record) =>
          record.date === today &&
          record.type === "Consumption",
      )
      .reduce(
        (sum, record) =>
          sum + record.cost,
        0,
      );
  }, [records]);

  const totalFuel = useMemo<number>(() => {
    return tanks.reduce(
      (sum, tank) =>
        sum + tank.currentLevel,
      0,
    );
  }, [tanks]);

  const averageCost = useMemo<number>(() => {
    const dieselTanks = tanks.filter(
      (tank) =>
        tank.fuelType === "Diesel",
    );

    if (dieselTanks.length === 0) {
      return 0;
    }

    return (
      dieselTanks.reduce(
        (sum, tank) =>
          sum + tank.unitCost,
        0,
      ) / dieselTanks.length
    );
  }, [tanks]);

  // ==========================================================
  // OPEN MODAL
  // ==========================================================

  const openModal = (
    mode: "consumption" | "delivery",
  ): void => {
    setModalMode(mode);
    setModalOpen(true);
  };

  // ==========================================================
  // RECORD FUEL TRANSACTION
  // ==========================================================

  const handleFuelSubmit = async (
    data: FuelFormData,
  ): Promise<void> => {
    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(
        `${FUEL_API_URL}/records`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: data.type,
            tank_id: data.tankId,
            equipment:
              data.type === "Delivery"
                ? "Fuel Delivery"
                : data.equipment,
            operator: data.operator,
            fuel_type: data.fuelType,
            quantity: data.quantity,
            meter_reading: data.meterReading,
            date: data.date,
            time: data.time,
            unit_price: data.unitPrice,
            reference:
              data.reference.trim() ||
              `FUEL-${Date.now()}`,
            location: data.location,
          }),
        },
      );

      if (!response.ok) {
        let message =
          "Failed to record fuel transaction.";

        try {
          const errorData =
            (await response.json()) as {
              detail?: unknown;
            };

          if (
            typeof errorData.detail ===
            "string"
          ) {
            message =
              errorData.detail;
          }
        } catch {
          // Keep default message.
        }

        throw new Error(message);
      }

      await response.json();

      await loadFuelData();

      setModalOpen(false);
    } catch (err: unknown) {
      console.error(
        "Failed to record fuel transaction:",
        err,
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to record fuel transaction.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d8a83e]">
              <FuelIcon size={15} />
              Fuel Management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#10251f] sm:text-3xl">
              Fuel Operations
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor fuel stock,
              consumption, costs and
              equipment usage across
              the mine.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-center gap-3 text-sm font-medium text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#10251f]" />

            Loading fuel operations...
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN PAGE
  // ==========================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d8a83e]">
            <FuelIcon size={15} />
            Fuel Management
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#10251f] sm:text-3xl">
            Fuel Operations
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor fuel stock,
            consumption, costs and
            equipment usage across
            the mine.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              openModal("delivery")
            }
            disabled={
              submitting ||
              tanks.length === 0
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#10251f] shadow-sm transition hover:border-[#d8a83e] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload size={18} />
            Record Delivery
          </button>

          <button
            type="button"
            onClick={() =>
              openModal("consumption")
            }
            disabled={
              submitting ||
              tanks.length === 0
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10251f] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#18382f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={18} />
            Record Fuel
          </button>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">
              Fuel system error
            </p>

            <p className="mt-1">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadFuelData()
            }
            className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-700 shadow-sm ring-1 ring-red-200 transition hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      )}

      {/* NO TANKS */}

      {tanks.length === 0 && !error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p className="font-semibold">
            No fuel tanks found
          </p>

          <p className="mt-1">
            Create a fuel tank first.
            It will automatically appear
            in the fuel transaction
            dropdown.
          </p>
        </div>
      )}

      {/* KPI */}

      <FuelKPI
        totalFuel={totalFuel}
        todayConsumption={
          todayConsumption
        }
        todaySpend={todaySpend}
        averageCost={averageCost}
      />

      {/* OVERVIEW */}

      <FuelOverview
        tanks={tanks}
        records={records}
        dailyTarget={1400}
      />

      {/* TANK STATUS */}

      <FuelTankStatus
        tanks={tanks}
      />

      {/* CONSUMPTION + ALERTS */}

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <FuelConsumptionTable
          records={records}
        />

        <FuelAlerts
          tanks={tanks}
          todayConsumption={
            todayConsumption
          }
          dailyTarget={1400}
          averageCost={averageCost}
        />
      </div>

      {/* MOVEMENTS */}

      <FuelMovements
        records={records}
      />

      {/* RECORD FUEL MODAL */}

      <RecordFuelModal
        isOpen={modalOpen}
        mode={modalMode}
        tanks={tanks}
        onClose={() => {
          if (!submitting) {
            setModalOpen(false);
          }
        }}
        onSubmit={handleFuelSubmit}
      />
    </div>
  );
}

export default Fuel;