import { useMemo, useState } from "react";

import {
  Edit3,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";

import type {
  IncidentSeverity,
  IncidentStatus,
  SafetyIncident,
} from "../../pages/Safety";

type IncidentTableProps = {
  incidents: SafetyIncident[];
  onEdit: (incident: SafetyIncident) => void;
  onDelete: (incident: SafetyIncident) => void;
  deletingId?: number | null;
};

function IncidentTable({
  incidents,
  onEdit,
  onDelete,
  deletingId = null,
}: IncidentTableProps) {
  const [search, setSearch] = useState("");

  const [severityFilter, setSeverityFilter] =
    useState<"All" | IncidentSeverity>("All");

  const [statusFilter, setStatusFilter] =
    useState<"All" | IncidentStatus>("All");

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        incident.reference
          .toLowerCase()
          .includes(searchValue) ||
        incident.category
          .toLowerCase()
          .includes(searchValue) ||
        incident.location
          .toLowerCase()
          .includes(searchValue) ||
        incident.reportedBy
          .toLowerCase()
          .includes(searchValue);

      const matchesSeverity =
        severityFilter === "All" ||
        incident.severity === severityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        incident.status === statusFilter;

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus
      );
    });
  }, [
    incidents,
    search,
    severityFilter,
    statusFilter,
  ]);

  const severityStyles = {
    Low: "bg-slate-100 text-slate-600",
    Medium: "bg-amber-50 text-amber-700",
    High: "bg-orange-50 text-orange-700",
    Critical: "bg-red-50 text-red-700",
  };

  const statusStyles = {
    Open: "bg-red-50 text-red-700",
    "Under Investigation":
      "bg-amber-50 text-amber-700",
    Resolved: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f]/8 text-[#10251f]">
                <ShieldAlert size={19} />
              </div>

              <div>
                <h2 className="font-bold text-[#10251f]">
                  Safety Incident Register
                </h2>

                <p className="text-xs text-slate-400">
                  Incidents, near misses and unsafe conditions
                </p>
              </div>
            </div>

            <button
              type="button"
              className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#d8a83e] hover:text-[#10251f] sm:flex"
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_160px_190px]">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search reference, area, category..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#d8a83e] focus:bg-white"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(event) =>
                setSeverityFilter(
                  event.target.value as
                    | "All"
                    | IncidentSeverity,
                )
              }
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 outline-none focus:border-[#d8a83e]"
            >
              <option value="All">All Severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "All"
                    | IncidentStatus,
                )
              }
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 outline-none focus:border-[#d8a83e]"
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="Under Investigation">
                Under Investigation
              </option>
              <option value="Resolved">
                Resolved
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Incident
              </th>

              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Type
              </th>

              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Area
              </th>

              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Severity
              </th>

              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Status
              </th>

              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Reported By
              </th>

              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredIncidents.map((incident) => (
              <tr
                key={incident.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-[#10251f]">
                      {incident.reference}
                    </p>

                    <p className="mt-1 max-w-[300px] truncate text-xs text-slate-500">
                      {incident.description}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {incident.date} · {incident.time}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {incident.type}
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {incident.category}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="text-sm text-slate-600">
                    {incident.location}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${severityStyles[incident.severity]}`}
                  >
                    {incident.severity}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyles[incident.status]}`}
                  >
                    {incident.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="text-sm text-slate-600">
                    {incident.reportedBy}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(incident)}
                      disabled={deletingId === incident.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#d8a83e] hover:bg-[#d8a83e]/10 hover:text-[#10251f] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(incident)}
                      disabled={deletingId === incident.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      {deletingId === incident.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredIncidents.length === 0 && (
          <div className="px-6 py-12 text-center">
            <ShieldAlert
              size={30}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-semibold text-slate-600">
              No incidents found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default IncidentTable;