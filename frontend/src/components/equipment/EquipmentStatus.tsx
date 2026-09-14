import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Search,
  Settings2,
  Truck,
  Wrench,
  XCircle,
} from "lucide-react";

import equipmentApi, {
  type EquipmentStatusRecord,
  type EquipmentStatus,
} from "../services/equipmentApi";

function StatusBadge({
  status,
}: {
  status: EquipmentStatus;
}) {
  const config = {
    Running: {
      icon: CheckCircle2,
      className:
        "bg-emerald-50 text-emerald-700",
    },
  Available: {
      icon: Clock3,
      className:
        "bg-blue-50 text-blue-700",
    },
    Maintenance: {
      icon: Wrench,
      className:
        "bg-amber-50 text-amber-700",
    },
    Down: {
      icon: XCircle,
      className:
        "bg-red-50 text-red-700",
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${config.className}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

export default function EquipmentStatus() {
  const [equipment, setEquipment] =
    useState<EquipmentStatusRecord[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadStatus = async () => {
    try {
      setError("");

      const data =
        await equipmentApi.getStatus();

      setEquipment(data);
    } catch (err: any) {
      console.error(
        "Failed to load equipment status:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Unable to load equipment status."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadStatus();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStatus();
  };

  const handleStatusChange = async (
    equipmentId: string,
    status: EquipmentStatus
  ) => {
    try {
      setError("");

      const updated =
        await equipmentApi.updateStatus(
          equipmentId,
          status
        );

      setEquipment((current) =>
        current.map((item) =>
          item.equipmentId ===
          equipmentId
            ? {
                ...item,
                status: updated.status,
              }
            : item
        )
      );
    } catch (err: any) {
      console.error(
        "Failed to update equipment status:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Unable to update equipment status."
      );
    }
  };

  const filteredEquipment =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return equipment;
      }

      return equipment.filter(
        (item) =>
          item.name
            .toLowerCase()
            .includes(query) ||
          item.equipmentId
            .toLowerCase()
            .includes(query) ||
          item.location
            .toLowerCase()
            .includes(query)
      );
    }, [equipment, search]);

  const total = equipment.length;

  const running = equipment.filter(
    (item) => item.status === "Running"
  ).length;

  const available = equipment.filter(
    (item) => item.status === "Available"
  ).length;

  const maintenance = equipment.filter(
    (item) =>
      item.status === "Maintenance"
  ).length;

  const down = equipment.filter(
    (item) => item.status === "Down"
  ).length;

  return (
    <div className="min-h-screen bg-[#f5f7f8]">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* Hero */}
        <section className="overflow-hidden rounded-3xl bg-[#10251f] shadow-sm">
          <div className="relative px-5 py-7 sm:px-7 lg:px-9 lg:py-8">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#d8a83e]/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2 text-[#d8a83e]">
                  <div className="rounded-xl bg-[#d8a83e]/15 p-2">
                    <Activity size={20} />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-[0.2em]">
                    Equipment Control
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Equipment Status
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
                  Monitor live equipment availability,
                  operating condition and fleet status
                  across the mine.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <RefreshCw
                  size={17}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Total Equipment
            </p>

            <p className="mt-2 text-3xl font-bold text-[#10251f]">
              {total}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Registered equipment
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Running
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {running}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Currently operating
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Available
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {available}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Ready for operation
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Maintenance
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {maintenance}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Under service
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Down
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {down}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Currently unavailable
            </p>
          </div>
        </section>

        {/* Table */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Live fleet register
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#10251f]">
                  Current Equipment Status
                </h2>
              </div>

              <div className="relative w-full sm:w-72">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search equipment..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="m-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-72 items-center justify-center text-sm font-medium text-slate-400">
              Loading equipment status...
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
              <div className="rounded-2xl bg-slate-100 p-4">
                <Truck
                  size={26}
                  className="text-slate-400"
                />
              </div>

              <h3 className="mt-4 font-bold text-[#10251f]">
                No equipment found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Try changing your search criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Equipment
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Location
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Operating Hours
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Utilisation
                    </th>

                    <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Change Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEquipment.map(
                    (item) => (
                      <tr
                        key={
                          item.equipmentId
                        }
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-[#10251f]/5 p-2.5">
                              <Truck
                                size={18}
                                className="text-[#10251f]"
                              />
                            </div>

                            <div>
                              <p className="font-semibold text-slate-800">
                                {item.name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                {
                                  item.equipmentId
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.location}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={
                              item.status
                            }
                          />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Clock3
                              size={15}
                              className="text-slate-400"
                            />

                            <span className="text-sm font-semibold text-slate-700">
                              {item.operatingHours.toLocaleString()}{" "}
                              h
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="w-28">
                            <div className="mb-1.5 flex justify-between">
                              <span className="text-xs font-bold text-slate-700">
                                {
                                  item.utilisation
                                }
                                %
                              </span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-[#d8a83e]"
                                style={{
                                  width: `${item.utilisation}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <select
                            value={
                              item.status
                            }
                            onChange={(
                              event
                            ) =>
                              void handleStatusChange(
                                item.equipmentId,
                                event.target
                                  .value as EquipmentStatus
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 outline-none transition hover:border-[#d8a83e] focus:border-[#d8a83e]"
                            aria-label={`Change status for ${item.name}`}
                          >
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
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Status notice */}
        <section className="rounded-2xl border border-[#d8a83e]/20 bg-[#10251f] p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-[#d8a83e]/15 p-3">
              <Settings2
                size={22}
                className="text-[#d8a83e]"
              />
            </div>

            <div>
              <h3 className="font-bold text-white">
                Equipment status control
              </h3>

              <p className="mt-1 max-w-3xl text-sm leading-6 text-white/55">
                Equipment status changes are saved directly
                to the SmartMine equipment database and are
                immediately reflected across the equipment
                control module.
              </p>
            </div>
          </div>
        </section>

        <footer className="pb-4 text-center text-xs text-slate-400">
          SmartMine Equipment Control · Live equipment
          status monitoring
        </footer>
      </div>
    </div>
  );
}