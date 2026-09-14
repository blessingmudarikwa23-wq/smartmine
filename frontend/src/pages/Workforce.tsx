import { useEffect, useMemo, useState } from "react";
import { RefreshCw, UserPlus } from "lucide-react";

import WorkforceKPI from "../components/workforce/WorkforceKPI";
import WorkforceIssues from "../components/workforce/WorkforceIssues";
import ShiftRoster from "../components/workforce/ShiftRoster";
import AttendanceTable from "../components/workforce/AttendanceTable";
import AddWorkerModal from "../components/workforce/AddWorkerModal";

import workforceApi, {
  type Worker,
  type WorkforceSummary,
} from "../services/workforceApi";

const DEFAULT_SUMMARY: WorkforceSummary = {
  totalWorkforce: 0,
  presentToday: 0,
  absent: 0,
  late: 0,
  offDuty: 0,
  trainingDue: 0,
  attendanceRate: 0,
  safetyComplianceRate: 0,
  shiftCoverage: 0,
};

const clampPercent = (val: number) => Math.min(Math.max(val, 0), 100);

export default function Workforce() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [summary, setSummary] = useState<WorkforceSummary>(DEFAULT_SUMMARY);
  const [showAddWorker, setShowAddWorker] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  // Network States
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWorkforce = async (): Promise<void> => {
    try {
      setError("");
      const dashboard = await workforceApi.getDashboard();
      setWorkers(dashboard.workers ?? []);
      setSummary(dashboard.summary ?? DEFAULT_SUMMARY);
    } catch (err) {
      console.error("Failed to load workforce:", err);
      setError("Unable to load workforce data from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadWorkforce();
  }, []);

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    try {
      await loadWorkforce();
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const handleAddWorker = async (worker: Omit<Worker, "id">): Promise<void> => {
    try {
      setError("");
      const createdWorker = await workforceApi.createWorker(worker);
      setWorkers((prev) => [createdWorker, ...prev]);
      setShowAddWorker(false);

      const updatedSummary = await workforceApi.getSummary();
      setSummary(updatedSummary);
    } catch (err) {
      console.error("Failed to create worker:", err);
      setError("Unable to add worker. Please check the employee number and try again.");
    }
  };

  const departments = useMemo(() => {
    return Array.from(new Set(workers.map((w) => w.department))).sort();
  }, [workers]);

  const filteredWorkers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return workers.filter((worker) => {
      const matchesSearch =
        !search ||
        worker.name.toLowerCase().includes(search) ||
        worker.employeeNumber.toLowerCase().includes(search) ||
        worker.role.toLowerCase().includes(search);

      const matchesDept =
        departmentFilter === "All Departments" ||
        worker.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All Statuses" || worker.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [workers, searchTerm, departmentFilter, statusFilter]);

  const kpiStats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let training = 0;

    for (const worker of workers) {
      if (worker.status === "Present") present++;
      if (worker.status === "Absent") absent++;
      if (worker.status === "Late") late++;
      if (worker.safetyStatus === "Training Due") training++;
    }

    return {
      present,
      absent,
      late,
      absentOrLate: absent + late,
      trainingDue: training,
    };
  }, [workers]);

  const clearFilters = (): void => {
    setSearchTerm("");
    setDepartmentFilter("All Departments");
    setStatusFilter("All Statuses");
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-[#10251f] p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d8a83e]">
              Workforce Intelligence
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Workforce Operations
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-slate-300">
              Monitor workforce availability, attendance, safety compliance, and shift coverage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button
              type="button"
              onClick={() => setShowAddWorker(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#d8a83e] px-4 py-2.5 text-sm font-bold text-[#10251f] shadow-md transition hover:bg-[#c59733]"
            >
              <UserPlus size={17} />
              Add Worker
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Loading & Main Content */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <RefreshCw size={28} className="mx-auto animate-spin text-emerald-500" />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Loading workforce data...
          </p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <WorkforceKPI
              title="Total Workforce"
              value={summary.totalWorkforce}
              description="Registered workforce"
              change="Live"
              trend="neutral"
              icon={UserPlus}
            />

            <WorkforceKPI
              title="Present Today"
              value={kpiStats.present}
              description="Workers currently present"
              change={`${summary.attendanceRate}%`}
              trend="up"
              icon={UserPlus}
            />

            <WorkforceKPI
              title="Absent / Late"
              value={kpiStats.absentOrLate}
              description="Attendance exceptions"
              change={`${kpiStats.absent} absent`}
              trend={kpiStats.absentOrLate > 0 ? "down" : "neutral"}
              icon={UserPlus}
            />

            <WorkforceKPI
              title="Training Due"
              value={kpiStats.trainingDue}
              description="Safety training required"
              change={kpiStats.trainingDue > 0 ? "Attention" : "Clear"}
              trend={kpiStats.trainingDue > 0 ? "down" : "up"}
              icon={UserPlus}
            />
          </div>

          {/* Shift Roster */}
          <ShiftRoster workers={workers} />

          {/* Workforce Directory Table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <DirectoryFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              departmentFilter={departmentFilter}
              setDepartmentFilter={setDepartmentFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              departments={departments}
              clearFilters={clearFilters}
            />
            <AttendanceTable workers={filteredWorkers} />
          </div>

          {/* Issues Section */}
          <WorkforceIssues workers={workers} />

          {/* Workforce Health Progress Bars */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Workforce Health
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Current operational workforce indicators.
              </p>
            </div>

            <div className="space-y-5">
              <HealthBar label="Attendance" value={summary.attendanceRate} />
              <HealthBar label="Safety Compliance" value={summary.safetyComplianceRate} />
              <HealthBar label="Shift Coverage" value={summary.shiftCoverage} />
            </div>
          </div>

          {/* Operations Note */}
          <div className="rounded-2xl bg-[#10251f] p-6 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8a83e]">
              Operations Note
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Workforce intelligence provides a live view of workforce availability,
              attendance, safety compliance, and shift coverage to support safer and
              more efficient mining operations.
            </p>
          </div>

          {/* Footer */}
          <footer className="pb-4 text-center text-xs text-slate-400">
            SmartMine Workforce Intelligence
          </footer>
        </>
      )}

      {/* Add Worker Modal */}
      <AddWorkerModal
        open={showAddWorker}
        onClose={() => setShowAddWorker(false)}
        onSubmit={handleAddWorker}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Sub-components                                */
/* -------------------------------------------------------------------------- */

interface DirectoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  departments: string[];
  clearFilters: () => void;
}

const DirectoryFilters = ({
  searchTerm,
  setSearchTerm,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  departments,
  clearFilters,
}: DirectoryFiltersProps) => {
  const isFiltered =
    searchTerm !== "" ||
    departmentFilter !== "All Departments" ||
    statusFilter !== "All Statuses";

  return (
    <div className="border-b border-slate-200 p-5 dark:border-slate-800">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Workforce Directory
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Search and filter registered workforce.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search workers..."
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option>All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option>All Statuses</option>
            <option>Present</option>
            <option>Absent</option>
            <option>Late</option>
            <option>Off Duty</option>
          </select>

          {isFiltered && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const HealthBar = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <span className="text-sm font-bold text-slate-900 dark:text-white">
        {value}%
      </span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div
        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
        style={{ width: `${clampPercent(value)}%` }}
      />
    </div>
  </div>
);