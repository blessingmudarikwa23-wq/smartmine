import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Filter,
  Gauge,
  Hammer,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Truck,
  Wrench,
  XCircle,
} from "lucide-react";

import EquipmentKPI from "../components/equipment/EquipmentKPI";
import EquipmentTable from "../components/equipment/EquipmentTable";
import MaintenanceSchedule from "../components/equipment/MaintenanceSchedule";
import EquipmentIssues from "../components/equipment/EquipmentIssues";
import AddEquipmentModal from "../components/equipment/AddEquipmentModal";

export type EquipmentStatus =
  | "Running"
  | "Available"
  | "Maintenance"
  | "Down";

export type EquipmentRecord = {
  id: number;
  equipmentId: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  location: string;
  status: EquipmentStatus;
  operatingHours: number;
  utilisation: number;
  lastMaintenance: string;
  nextMaintenance: string;
  maintenanceInterval: number;
  notes: string;
};

type EquipmentApiRecord = {
  id?: number | string;
  equipmentId?: string;
  equipment_id?: string;
  name?: string;
  type?: string;
  manufacturer?: string;
  model?: string;
  location?: string;
  status?: string;
  operatingHours?: number | string | null;
  operating_hours?: number | string | null;
  utilisation?: number | string | null;
  lastMaintenance?: string | null;
  last_maintenance?: string | null;
  nextMaintenance?: string | null;
  next_maintenance?: string | null;
  maintenanceInterval?: number | string | null;
  maintenance_interval?: number | string | null;
  notes?: string | null;
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://smartmine-backend-wdva.onrender.com";

const initialEquipment: EquipmentRecord[] = [
  {
    id: 1,
    equipmentId: "CR-001",
    name: "Primary Crusher",
    type: "Crusher",
    manufacturer: "Metso",
    model: "C80",
    location: "Crushing Plant",
    status: "Running",
    operatingHours: 2846,
    utilisation: 86,
    lastMaintenance: "20 Aug 2026",
    nextMaintenance: "20 Sep 2026",
    maintenanceInterval: 250,
    notes: "Operating normally.",
  },
  {
    id: 2,
    equipmentId: "GM-001",
    name: "Grinding Mill 01",
    type: "Grinding Mill",
    manufacturer: "GoldStone",
    model: "GM-500",
    location: "Processing Plant",
    status: "Running",
    operatingHours: 3214,
    utilisation: 82,
    lastMaintenance: "18 Aug 2026",
    nextMaintenance: "18 Sep 2026",
    maintenanceInterval: 250,
    notes: "Bearing inspection due soon.",
  },
  {
    id: 3,
    equipmentId: "EX-001",
    name: "Excavator EX-01",
    type: "Excavator",
    manufacturer: "Caterpillar",
    model: "320D",
    location: "Open Pit",
    status: "Available",
    operatingHours: 4120,
    utilisation: 74,
    lastMaintenance: "05 Aug 2026",
    nextMaintenance: "05 Oct 2026",
    maintenanceInterval: 500,
    notes: "Available for production work.",
  },
  {
    id: 4,
    equipmentId: "LD-001",
    name: "Wheel Loader LD-01",
    type: "Loader",
    manufacturer: "Komatsu",
    model: "WA200",
    location: "Stockpile",
    status: "Running",
    operatingHours: 2388,
    utilisation: 79,
    lastMaintenance: "12 Aug 2026",
    nextMaintenance: "12 Sep 2026",
    maintenanceInterval: 250,
    notes: "Loading stockpile material.",
  },
  {
    id: 5,
    equipmentId: "GEN-001",
    name: "Main Generator",
    type: "Generator",
    manufacturer: "Perkins",
    model: "1106A",
    location: "Power House",
    status: "Maintenance",
    operatingHours: 3860,
    utilisation: 68,
    lastMaintenance: "10 Aug 2026",
    nextMaintenance: "04 Sep 2026",
    maintenanceInterval: 250,
    notes: "Scheduled service in progress.",
  },
  {
    id: 6,
    equipmentId: "TR-001",
    name: "Haul Truck TR-01",
    type: "Haul Truck",
    manufacturer: "Volvo",
    model: "A40G",
    location: "Open Pit",
    status: "Down",
    operatingHours: 4562,
    utilisation: 51,
    lastMaintenance: "25 Jul 2026",
    nextMaintenance: "05 Sep 2026",
    maintenanceInterval: 250,
    notes: "Hydraulic system requires attention.",
  },
];

const equipmentIssues = [
  {
    id: 1,
    title: "Haul Truck hydraulic issue",
    description:
      "TR-001 is unavailable due to a hydraulic system fault requiring inspection.",
    category: "Mechanical",
    priority: "High",
    duration: "2h 20m",
    equipment: "TR-001",
    icon: Truck,
  },
  {
    id: 2,
    title: "Generator scheduled maintenance",
    description:
      "Main generator is currently undergoing its scheduled service interval.",
    category: "Maintenance",
    priority: "Medium",
    duration: "1h 10m",
    equipment: "GEN-001",
    icon: Wrench,
  },
  {
    id: 3,
    title: "Grinding mill inspection",
    description:
      "Grinding Mill 01 requires a bearing inspection before the next service cycle.",
    category: "Inspection",
    priority: "Medium",
    duration: "—",
    equipment: "GM-001",
    icon: Settings2,
  },
];

const maintenanceItems = [
  {
    id: 1,
    equipment: "Grinding Mill 01",
    equipmentId: "GM-001",
    type: "Bearing Inspection",
    dueDate: "08 Sep 2026",
    priority: "High",
    status: "Upcoming",
  },
  {
    id: 2,
    equipment: "Wheel Loader LD-01",
    equipmentId: "LD-001",
    type: "250-Hour Service",
    dueDate: "12 Sep 2026",
    priority: "Medium",
    status: "Upcoming",
  },
  {
    id: 3,
    equipment: "Primary Crusher",
    equipmentId: "CR-001",
    type: "Routine Service",
    dueDate: "20 Sep 2026",
    priority: "Medium",
    status: "Scheduled",
  },
  {
    id: 4,
    equipment: "Main Generator",
    equipmentId: "GEN-001",
    type: "Engine Service",
    dueDate: "04 Sep 2026",
    priority: "High",
    status: "In Progress",
  },
];

function normalizeStatus(value: unknown): EquipmentStatus {
  if (
    value === "Running" ||
    value === "Available" ||
    value === "Maintenance" ||
    value === "Down"
  ) {
    return value;
  }

  return "Available";
}

function normalizeNumber(
  value: number | string | null | undefined
): number {
  const parsed = Number(value ?? 0);

  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeEquipment(
  item: EquipmentApiRecord
): EquipmentRecord {
  return {
    id: normalizeNumber(item.id),
    equipmentId:
      item.equipmentId ??
      item.equipment_id ??
      "",
    name: item.name ?? "",
    type: item.type ?? "",
    manufacturer: item.manufacturer ?? "",
    model: item.model ?? "",
    location: item.location ?? "",
    status: normalizeStatus(item.status),
    operatingHours: normalizeNumber(
      item.operatingHours ??
        item.operating_hours
    ),
    utilisation: normalizeNumber(
      item.utilisation
    ),
    lastMaintenance:
      item.lastMaintenance ??
      item.last_maintenance ??
      "",
    nextMaintenance:
      item.nextMaintenance ??
      item.next_maintenance ??
      "",
    maintenanceInterval: normalizeNumber(
      item.maintenanceInterval ??
        item.maintenance_interval
    ),
    notes: item.notes ?? "",
  };
}

export default function Equipment() {
  const [equipment, setEquipment] =
    useState<EquipmentRecord[]>(initialEquipment);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | EquipmentStatus
  >("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadEquipment = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/v1/equipment`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load equipment. Server returned ${response.status}.`
        );
      }

      const data: unknown = await response.json();

      if (Array.isArray(data)) {
        const normalizedEquipment =
          data.map((item) =>
            normalizeEquipment(
              item as EquipmentApiRecord
            )
          );

        setEquipment(normalizedEquipment);
      } else {
        throw new Error(
          "Invalid equipment response received from server."
        );
      }
    } catch (err) {
      console.error(
        "Equipment loading error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load equipment from the server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  const equipmentTypes = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          equipment
            .map((item) => item.type)
            .filter(Boolean)
        )
      ),
    ],
    [equipment]
  );

  const filteredEquipment = useMemo(() => {
    const query = search.trim().toLowerCase();

    return equipment.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.equipmentId
          .toLowerCase()
          .includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        item.type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    equipment,
    search,
    statusFilter,
    typeFilter,
  ]);

  const totalEquipment = equipment.length;

  const running = equipment.filter(
    (item) => item.status === "Running"
  ).length;

  const available = equipment.filter(
    (item) => item.status === "Available"
  ).length;

  const maintenance = equipment.filter(
    (item) => item.status === "Maintenance"
  ).length;

  const down = equipment.filter(
    (item) => item.status === "Down"
  ).length;

  const averageUtilisation =
    equipment.length > 0
      ? Math.round(
          equipment.reduce(
            (sum, item) =>
              sum + normalizeNumber(item.utilisation),
            0
          ) / equipment.length
        )
      : 0;

  const totalOperatingHours = equipment.reduce(
    (sum, item) =>
      sum + normalizeNumber(item.operatingHours),
    0
  );

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await loadEquipment();
    } finally {
      window.setTimeout(() => {
        setRefreshing(false);
      }, 700);
    }
  };

  const handleAddEquipment = async (
    record: EquipmentRecord
  ) => {
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/v1/equipment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            equipment_id: record.equipmentId,
            name: record.name,
            type: record.type,
            manufacturer: record.manufacturer,
            model: record.model,
            location: record.location,
            status: record.status,
            operating_hours:
              record.operatingHours,
            utilisation: record.utilisation,
            last_maintenance:
              record.lastMaintenance,
            next_maintenance:
              record.nextMaintenance,
            maintenance_interval:
              record.maintenanceInterval,
            notes: record.notes,
          }),
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message ||
            `Failed to add equipment. Server returned ${response.status}.`
        );
      }

      setShowModal(false);

      await loadEquipment();
    } catch (err) {
      console.error(
        "Add equipment error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to add equipment."
      );
    }
  };

  const handleStatusChange = async (
    equipmentId: string,
    status: EquipmentStatus
  ) => {
    setError("");

    const previousEquipment = equipment;

    setEquipment((current) =>
      current.map((item) =>
        item.equipmentId === equipmentId
          ? { ...item, status }
          : item
      )
    );

    try {
      const response = await fetch(
        `${API_URL}/api/v1/equipment/status/${encodeURIComponent(
          equipmentId
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message ||
            `Failed to update equipment status. Server returned ${response.status}.`
        );
      }
    } catch (err) {
      console.error(
        "Equipment status update error:",
        err
      );

      setEquipment(previousEquipment);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update equipment status."
      );
    }
  };

  const handleDeleteEquipment = async (
    record: EquipmentRecord
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${record.name} (${record.equipmentId})?`
    );

    if (!confirmed) {
      return;
    }

    setError("");

    const previousEquipment = equipment;

    setEquipment((current) =>
      current.filter(
        (item) => item.id !== record.id
      )
    );

    try {
      const response = await fetch(
        `${API_URL}/api/v1/equipment/${record.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message ||
            `Failed to delete equipment. Server returned ${response.status}.`
        );
      }

      await loadEquipment();
    } catch (err) {
      console.error(
        "Delete equipment error:",
        err
      );

      setEquipment(previousEquipment);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete equipment."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f8]">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <section className="overflow-hidden rounded-3xl bg-[#10251f] shadow-sm">
          <div className="relative px-5 py-7 sm:px-7 lg:px-9 lg:py-8">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#d8a83e]/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2 text-[#d8a83e]">
                  <div className="rounded-xl bg-[#d8a83e]/15 p-2">
                    <Hammer size={20} />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-[0.2em]">
                    Equipment Control
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Equipment & Fleet
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
                  Monitor equipment availability,
                  utilisation, operating hours,
                  maintenance and operational issues
                  across the mine.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw
                    size={17}
                    className={
                      refreshing || loading
                        ? "animate-spin"
                        : ""
                    }
                  />

                  Refresh
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#d8a83e] px-4 py-2.5 text-sm font-bold text-[#10251f] shadow-sm transition hover:bg-[#e4b94f]"
                >
                  <Plus size={18} />
                  Add Equipment
                </button>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <EquipmentKPI
            title="Total Equipment"
            value={String(totalEquipment)}
            description="Registered fleet"
            icon={Truck}
            change="+1 this month"
            trend="up"
          />

          <EquipmentKPI
            title="Running"
            value={String(running)}
            description="Currently operating"
            icon={Activity}
            change={`${Math.round(
              (running / Math.max(totalEquipment, 1)) *
                100
            )}% of fleet`}
            trend="up"
          />

          <EquipmentKPI
            title="Available"
            value={String(available)}
            description="Ready for operation"
            icon={CheckCircle2}
            change="Ready"
            trend="neutral"
          />

          <EquipmentKPI
            title="Maintenance"
            value={String(maintenance)}
            description="Under service"
            icon={Wrench}
            change="Active work"
            trend="neutral"
          />

          <EquipmentKPI
            title="Down"
            value={String(down)}
            description="Unavailable equipment"
            icon={XCircle}
            change={
              down > 0
                ? "Needs attention"
                : "No downtime"
            }
            trend={down > 0 ? "down" : "up"}
          />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Fleet performance
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#10251f]">
                  Equipment Utilisation
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Average utilisation across the
                  registered equipment fleet.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-[#10251f]/5 px-4 py-3">
                <Gauge
                  size={22}
                  className="text-[#d8a83e]"
                />

                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Fleet Average
                  </p>

                  <p className="text-xl font-bold text-[#10251f]">
                    {averageUtilisation}%
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              {equipment.slice(0, 5).map((item) => {
                const utilisation = Math.min(
                  Math.max(
                    normalizeNumber(item.utilisation),
                    0
                  ),
                  100
                );

                return (
                  <div key={item.id}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="rounded-lg bg-[#10251f]/5 p-2">
                          <Settings2
                            size={16}
                            className="text-[#10251f]"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {item.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {item.equipmentId} ·{" "}
                            {item.type}
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-bold text-[#10251f]">
                        {utilisation}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#d8a83e] transition-all"
                        style={{
                          width: `${utilisation}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#d8a83e]/15 p-2.5">
                <Clock3
                  size={21}
                  className="text-[#d8a83e]"
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Fleet Hours
                </p>

                <h2 className="text-xl font-bold text-[#10251f]">
                  Operating Hours
                </h2>
              </div>
            </div>

            <div className="mt-7">
              <p className="text-4xl font-bold tracking-tight text-[#10251f]">
                {totalOperatingHours.toLocaleString()}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Total recorded equipment hours
              </p>
            </div>

            <div className="mt-7 space-y-3 border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Running equipment
                </span>

                <span className="font-semibold text-slate-800">
                  {running}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Maintenance
                </span>

                <span className="font-semibold text-slate-800">
                  {maintenance}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Unavailable
                </span>

                <span className="font-semibold text-red-600">
                  {down}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Fleet register
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#10251f]">
                  Equipment Fleet
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:w-72">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search equipment..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowFilters(
                      (current) => !current
                    )
                  }
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    showFilters
                      ? "border-[#d8a83e] bg-[#d8a83e]/10 text-[#10251f]"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Filter size={17} />
                  Filters
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Status
                  </label>

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value as
                          | "All"
                          | EquipmentStatus
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#d8a83e]"
                  >
                    <option value="All">
                      All statuses
                    </option>

                    <option value="Running">
                      Running
                    </option>

                    <option value="Available">
                      Available
                    </option>

                    <option value="Maintenance">
                      Maintenance
                    </option>

                    <option value="Down">
                      Down
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Equipment Type
                  </label>

                  <select
                    value={typeFilter}
                    onChange={(event) =>
                      setTypeFilter(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#d8a83e]"
                  >
                    {equipmentTypes.map((type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type === "All"
                          ? "All equipment types"
                          : type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <EquipmentTable
            equipment={filteredEquipment}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteEquipment}
          />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <MaintenanceSchedule
            items={maintenanceItems}
          />

          <EquipmentIssues
            issues={equipmentIssues}
          />
        </section>

        <section className="rounded-2xl border border-[#d8a83e]/20 bg-[#10251f] p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-[#d8a83e]/15 p-3">
                <AlertTriangle
                  size={22}
                  className="text-[#d8a83e]"
                />
              </div>

              <div>
                <h3 className="font-bold text-white">
                  Equipment attention required
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-white/55">
                  {down > 0
                    ? `${down} equipment unit${
                        down === 1 ? "" : "s"
                      } currently unavailable. Review active equipment issues before the next production shift.`
                    : "No equipment units are currently unavailable."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t border-white/10 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <div>
                <p className="text-xs text-white/40">
                  Fleet status
                </p>

                <p className="mt-1 font-bold text-[#d8a83e]">
                  {down === 0
                    ? "Operational"
                    : "Attention"}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/40">
                  Last updated
                </p>

                <p className="mt-1 font-semibold text-white">
                  Just now
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="pb-4 text-center text-xs text-slate-400">
          SmartMine Equipment Control · Fleet monitoring
          and maintenance management
        </footer>
      </div>

      {showModal && (
        <AddEquipmentModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddEquipment}
        />
      )}
    </div>
  );
}