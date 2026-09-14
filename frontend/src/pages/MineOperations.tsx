import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Factory,
  Filter,
  Hammer,
  Plus,
  RefreshCw,
  Target,
  Truck,
  UserRound,
  Users,
  Wrench,
  X,
} from "lucide-react";

import OperationsKPI from "../components/mine-operations/OperationsKPI";
import OperationalIssues from "../components/mine-operations/OperationalIssues";
import ProductionChart from "../components/mine-operations/ProductionChart";
import ProductionTable from "../components/mine-operations/ProductionTable";
import RecordProductionModal from "../components/mine-operations/RecordProductionModal";
import ShiftCard from "../components/mine-operations/ShiftCard";

import {
  createMineShift,
  createProductionRecord,
  createProductionTarget,
  deleteMineShift,
  deleteProductionRecord,
  getCurrentShift,
  getMineShifts,
  getOperationalIssues,
  getProductionChart,
  getProductionRecords,
  getProductionSummary,
  getProductionTargetProgress,
  updateMineShift,
  updateProductionRecord,
  updateProductionTarget,
  type CurrentShift,
  type MineShift,
  type MineShiftPayload,
  type MineShiftUpdatePayload,
  type OperationalIssue,
  type ProductionChartPoint,
  type ProductionRecord,
  type ProductionRecordPayload,
  type ProductionSummary,
  type ProductionTargetProgress,
  type ShiftStatus,
} from "../services/mineOperationsApi";

// ============================================================
// CONSTANTS
// ============================================================

const PERIOD_LAST_7_DAYS = "Last 7 Days";
const PERIOD_LAST_30_DAYS = "Last 30 Days";
const PERIOD_THIS_MONTH = "This Month";

const SHIFT_ALL = "All Shifts";
const SHIFT_DAY = "Day Shift";
const SHIFT_NIGHT = "Night Shift";

const emptyCurrentShift: CurrentShift = {
  id: null,
  date: null,
  shift: null,
  status: null,
  supervisor: null,
  startTime: null,
  endTime: null,
  workers: 0,
  production: 0,
  operatingHours: 0,
  downtime: 0,
};

// ============================================================
// DATE HELPERS
// ============================================================

const getTodayDate = (): string => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (value: string): string => {
  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (value: string | null | undefined): string => {
  if (!value) {
    return "--:--";
  }

  return value.slice(0, 5);
};

const getPeriodDates = (
  period: string,
): { startDate: string; endDate: string } => {
  const today = new Date();
  const endDate = getTodayDate();
  const startDate = new Date(today);

  switch (period) {
    case PERIOD_LAST_30_DAYS:
      startDate.setDate(today.getDate() - 29);
      break;

    case PERIOD_THIS_MONTH:
      startDate.setDate(1);
      break;

    case PERIOD_LAST_7_DAYS:
    default:
      startDate.setDate(today.getDate() - 6);
      break;
  }

  const year = startDate.getFullYear();
  const month = String(startDate.getMonth() + 1).padStart(2, "0");
  const day = String(startDate.getDate()).padStart(2, "0");

  return {
    startDate: `${year}-${month}-${day}`,
    endDate,
  };
};

// ============================================================
// DEFAULT SHIFT FORM
// ============================================================

const getEmptyShiftForm = (): MineShiftPayload => ({
  date: getTodayDate(),
  shift: SHIFT_DAY,
  status: "Upcoming",
  supervisor: "",
  startTime: "06:00",
  endTime: "18:00",
  workers: 0,
});

// ============================================================
// COMPONENT
// ============================================================

function MineOperations() {
  // ==========================================================
  // PRODUCTION STATE
  // ==========================================================

  const [productionRecords, setProductionRecords] = useState<
    ProductionRecord[]
  >([]);

  const [productionChartData, setProductionChartData] = useState<
    ProductionChartPoint[]
  >([]);

  const [productionSummary, setProductionSummary] =
    useState<ProductionSummary>({
      totalExtracted: 0,
      totalProcessed: 0,
      totalOutput: 0,
      totalOperatingHours: 0,
      totalDowntime: 0,
      processingEfficiency: 0,
      operatingEfficiency: 0,
      completedRecords: 0,
      inProgressRecords: 0,
      delayedRecords: 0,
    });

  const [targetProgress, setTargetProgress] =
    useState<ProductionTargetProgress>({
      targetDate: getTodayDate(),
      targetOutput: 0,
      actualOutput: 0,
      remainingOutput: 0,
      progressPercentage: 0,
    });

  const [currentShift, setCurrentShift] =
    useState<CurrentShift>(emptyCurrentShift);

  const [operationalIssues, setOperationalIssues] = useState<
    OperationalIssue[]
  >([]);

  // ==========================================================
  // SHIFT STATE
  // ==========================================================

  const [mineShifts, setMineShifts] = useState<MineShift[]>([]);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<MineShift | null>(null);

  const [shiftForm, setShiftForm] =
    useState<MineShiftPayload>(getEmptyShiftForm());

  const [savingShift, setSavingShift] = useState(false);
  const [shiftError, setShiftError] = useState("");

  // ==========================================================
  // PRODUCTION MODAL STATE
  // ==========================================================

  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ProductionRecord | null>(
    null,
  );

  // ==========================================================
  // FILTER STATE
  // ==========================================================

  const [selectedShift, setSelectedShift] = useState(SHIFT_ALL);
  const [selectedPeriod, setSelectedPeriod] =
    useState(PERIOD_LAST_7_DAYS);

  // ==========================================================
  // PAGE STATE
  // ==========================================================

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // TARGET MODAL STATE
  // ==========================================================

  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [targetInput, setTargetInput] = useState("");
  const [savingTarget, setSavingTarget] = useState(false);
  const [targetError, setTargetError] = useState("");

  // ==========================================================
  // DERIVED VALUES
  // ==========================================================

  const today = getTodayDate();

  const periodDates = useMemo(
    () => getPeriodDates(selectedPeriod),
    [selectedPeriod],
  );

  const todayRecord = useMemo(
    () =>
      productionRecords.find((record) => record.date === today) ?? null,
    [productionRecords, today],
  );

  const filteredRecords = useMemo(() => {
    if (selectedShift === SHIFT_ALL) {
      return productionRecords;
    }

    return productionRecords.filter(
      (record) => record.shift === selectedShift,
    );
  }, [productionRecords, selectedShift]);

  const currentShiftRecord = useMemo(
    () =>
      currentShift.id
        ? mineShifts.find((shift) => shift.id === currentShift.id) ?? null
        : null,
    [currentShift.id, mineShifts],
  );

  // ==========================================================
  // LOAD DATA
  // ==========================================================

  const loadMineOperations = useCallback(async () => {
    try {
      setError("");

      const [
        records,
        summary,
        chart,
        target,
        shift,
        issues,
        shifts,
      ] = await Promise.all([
        getProductionRecords({
          shift: selectedShift,
          startDate: periodDates.startDate,
          endDate: periodDates.endDate,
        }),

        getProductionSummary(
          periodDates.startDate,
          periodDates.endDate,
          selectedShift,
        ),

        getProductionChart(
          periodDates.startDate,
          periodDates.endDate,
          selectedShift,
        ),

        getProductionTargetProgress(today),

        getCurrentShift(today),

        getOperationalIssues("Active"),

        getMineShifts(),
      ]);

      setProductionRecords(records);
      setProductionSummary(summary);
      setProductionChartData(chart);
      setTargetProgress(target);
      setCurrentShift(shift);
      setOperationalIssues(issues);
      setMineShifts(shifts);
    } catch (err) {
      console.error("Failed to load Mine Operations:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Mine Operations data from the backend.",
      );
    } finally {
      setLoading(false);
    }
  }, [
    periodDates.endDate,
    periodDates.startDate,
    selectedShift,
    today,
  ]);

  useEffect(() => {
    void loadMineOperations();
  }, [loadMineOperations]);

  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = async (): Promise<void> => {
    try {
      setRefreshing(true);
      await loadMineOperations();
    } finally {
      setRefreshing(false);
    }
  };

  // ==========================================================
  // PRODUCTION RECORD ACTIONS
  // ==========================================================

  const handleOpenCreateProduction = (): void => {
    setEditingRecord(null);
    setIsProductionModalOpen(true);
  };

  const handleEditProduction = (record: ProductionRecord): void => {
    setEditingRecord(record);
    setIsProductionModalOpen(true);
  };

  const handleCloseProductionModal = (): void => {
    setIsProductionModalOpen(false);
    setEditingRecord(null);
  };

  const handleDeleteProduction = async (id: number): Promise<void> => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this production record?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteProductionRecord(id);
      await loadMineOperations();
    } catch (err) {
      console.error("Failed to delete production record:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete the production record.",
      );
    }
  };

  const handleRecordProduction = async (
    payload: ProductionRecordPayload,
  ): Promise<void> => {
    try {
      setError("");

      if (editingRecord) {
        await updateProductionRecord(editingRecord.id, payload);
      } else {
        await createProductionRecord(payload);
      }

      handleCloseProductionModal();
      await loadMineOperations();
    } catch (err) {
      console.error("Failed to save production record:", err);

      setError(
        err instanceof Error
          ? err.message
          : editingRecord
            ? "Unable to update the production record."
            : "Unable to create the production record.",
      );
    }
  };

  // ==========================================================
  // SHIFT ACTIONS
  // ==========================================================

  const handleOpenCreateShift = (): void => {
    setEditingShift(null);
    setShiftForm({
      ...getEmptyShiftForm(),
      date: today,
    });
    setShiftError("");
    setIsShiftModalOpen(true);
  };

  const handleOpenEditShift = (shift: MineShift): void => {
    setEditingShift(shift);

    setShiftForm({
      date: shift.date,
      shift: shift.shift,
      status: shift.status,
      supervisor: shift.supervisor,
      startTime: formatTime(shift.startTime),
      endTime: formatTime(shift.endTime),
      workers: shift.workers,
    });

    setShiftError("");
    setIsShiftModalOpen(true);
  };

  const handleCloseShiftModal = (): void => {
    if (savingShift) {
      return;
    }

    setIsShiftModalOpen(false);
    setEditingShift(null);
    setShiftError("");
    setShiftForm({
      ...getEmptyShiftForm(),
      date: today,
    });
  };

  const handleShiftFormChange = <K extends keyof MineShiftPayload>(
    field: K,
    value: MineShiftPayload[K],
  ): void => {
    setShiftForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const validateShiftForm = (): boolean => {
    if (!shiftForm.date) {
      setShiftError("Please select a shift date.");
      return false;
    }

    if (!shiftForm.shift.trim()) {
      setShiftError("Please enter a shift name.");
      return false;
    }

    if (!shiftForm.supervisor.trim()) {
      setShiftError("Please enter the supervisor name.");
      return false;
    }

    if (!shiftForm.startTime) {
      setShiftError("Please select a start time.");
      return false;
    }

    if (!shiftForm.endTime) {
      setShiftError("Please select an end time.");
      return false;
    }

    if (shiftForm.workers < 0) {
      setShiftError("Workers cannot be negative.");
      return false;
    }

    return true;
  };

  const handleSaveShift = async (): Promise<void> => {
    setShiftError("");

    if (!validateShiftForm()) {
      return;
    }

    try {
      setSavingShift(true);
      setError("");

      if (editingShift) {
        const payload: MineShiftUpdatePayload = {
          date: shiftForm.date,
          shift: shiftForm.shift,
          status: shiftForm.status,
          supervisor: shiftForm.supervisor,
          startTime: shiftForm.startTime,
          endTime: shiftForm.endTime,
          workers: shiftForm.workers,
        };

        await updateMineShift(editingShift.id, payload);
      } else {
        await createMineShift(shiftForm);
      }

      setIsShiftModalOpen(false);
      setEditingShift(null);
      setShiftError("");
      setShiftForm({
        ...getEmptyShiftForm(),
        date: today,
      });

      await loadMineOperations();
    } catch (err) {
      console.error("Failed to save shift:", err);

      setShiftError(
        err instanceof Error
          ? err.message
          : "Unable to save the shift.",
      );
    } finally {
      setSavingShift(false);
    }
  };

  const handleDeleteShift = async (shift: MineShift): Promise<void> => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${shift.shift}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteMineShift(shift.id);

      setIsShiftModalOpen(false);
      setEditingShift(null);
      setShiftError("");

      await loadMineOperations();
    } catch (err) {
      console.error("Failed to delete shift:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete the shift.",
      );
    }
  };

  // ==========================================================
  // TARGET ACTIONS
  // ==========================================================

  const handleOpenTargetModal = (): void => {
    setTargetError("");

    setTargetInput(
      targetProgress.targetOutput > 0
        ? String(targetProgress.targetOutput)
        : "",
    );

    setIsTargetModalOpen(true);
  };

  const handleCloseTargetModal = (): void => {
    if (savingTarget) {
      return;
    }

    setIsTargetModalOpen(false);
    setTargetError("");
    setTargetInput("");
  };

  const handleSaveTarget = async (): Promise<void> => {
    setTargetError("");

    const numericTarget = Number(targetInput);

    if (!targetInput.trim() || !Number.isFinite(numericTarget)) {
      setTargetError("Please enter a valid production target.");
      return;
    }

    if (numericTarget <= 0) {
      setTargetError("Production target must be greater than 0.");
      return;
    }

    try {
      setSavingTarget(true);
      setError("");

      if (targetProgress.targetOutput > 0) {
        await updateProductionTarget(today, numericTarget);
      } else {
        await createProductionTarget({
          target_date: today,
          target_output: numericTarget,
        });
      }

      setIsTargetModalOpen(false);
      setTargetInput("");

      await loadMineOperations();
    } catch (err) {
      console.error("Failed to save production target:", err);

      setTargetError(
        err instanceof Error
          ? err.message
          : "Unable to save the production target.",
      );
    } finally {
      setSavingTarget(false);
    }
  };

  // ==========================================================
  // DISPLAY VALUES
  // ==========================================================

  const actualOutput = targetProgress.actualOutput;
  const productionTarget = targetProgress.targetOutput;

  const productionProgress = Math.min(
    Math.max(Math.round(targetProgress.progressPercentage), 0),
    100,
  );

  const productionRemaining = Math.max(
    targetProgress.remainingOutput,
    0,
  );

  const processingEfficiency = Math.min(
    Math.max(Math.round(productionSummary.processingEfficiency), 0),
    100,
  );

  const operatingEfficiency = Math.min(
    Math.max(Math.round(productionSummary.operatingEfficiency), 0),
    100,
  );

  const displayTodayOutput =
    todayRecord?.output ?? currentShift.production ?? 0;

  const displayTodayExtracted = todayRecord?.extracted ?? 0;
  const displayTodayProcessed = todayRecord?.processed ?? 0;

  const displayOperatingHours =
    currentShift.operatingHours || todayRecord?.operatingHours || 0;

  const displayDowntime =
    currentShift.downtime || todayRecord?.downtime || 0;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f5f7f8]">
      <div className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-6 lg:px-8">
        {/* ======================================================
            PAGE HEADER
        ======================================================= */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative overflow-hidden bg-[#10251f] px-6 py-7 sm:px-8">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -bottom-32 -right-4 h-72 w-72 rounded-full border border-[#d8a83e]/10" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d8a83e]/30 bg-[#d8a83e]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#e7c76e]">
                  <Activity size={14} />
                  Live Operations
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Mine Operations
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
                  Monitor extraction, processing, production performance,
                  equipment activity and operational issues across your mine.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Mine Operating
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white/70">
                    <CalendarDays size={15} />
                    {formatDisplayDate(today)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <button
                  type="button"
                  onClick={() => void handleRefresh()}
                  disabled={refreshing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw
                    size={17}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  Refresh
                </button>

                <button
                  type="button"
                  onClick={handleOpenCreateProduction}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d8a83e] px-5 py-3 text-sm font-bold text-[#10251f] shadow-lg shadow-black/10 transition hover:bg-[#e4b84e]"
                >
                  <Plus size={18} strokeWidth={2.5} />
                  Record Production
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            ERROR
        ======================================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        {/* ======================================================
            KPI GRID
        ======================================================= */}

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <OperationsKPI
            title="Today's Output"
            value={`${displayTodayOutput.toFixed(1)} kg`}
            description="Current production output"
            change=""
            trend="up"
            icon={Factory}
          />

          <OperationsKPI
            title="Material Extracted"
            value={`${displayTodayExtracted} t`}
            description="Material extracted today"
            change=""
            trend="up"
            icon={Truck}
          />

          <OperationsKPI
            title="Material Processed"
            value={`${displayTodayProcessed} t`}
            description="Material processed today"
            change=""
            trend="up"
            icon={Hammer}
          />

          <OperationsKPI
            title="Operating Hours"
            value={`${displayOperatingHours.toFixed(1)} hrs`}
            description="Equipment operating time"
            change=""
            trend="up"
            icon={Clock3}
          />

          <OperationsKPI
            title="Downtime"
            value={`${displayDowntime.toFixed(1)} hrs`}
            description="Recorded operational downtime"
            change=""
            trend="up"
            icon={Wrench}
          />
        </section>

        {/* ======================================================
            PERFORMANCE + CURRENT SHIFT
        ======================================================= */}

        <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f] text-[#d8a83e]">
                  <Activity size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Production Performance
                  </h2>

                  <p className="text-sm text-slate-500">
                    {selectedPeriod === PERIOD_THIS_MONTH
                      ? "Monthly operational production trend"
                      : `${selectedPeriod} operational production trend`}
                  </p>
                </div>
              </div>

              <select
                value={selectedPeriod}
                onChange={(event) =>
                  setSelectedPeriod(event.target.value)
                }
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/20"
              >
                <option value={PERIOD_LAST_7_DAYS}>
                  {PERIOD_LAST_7_DAYS}
                </option>
                <option value={PERIOD_LAST_30_DAYS}>
                  {PERIOD_LAST_30_DAYS}
                </option>
                <option value={PERIOD_THIS_MONTH}>
                  {PERIOD_THIS_MONTH}
                </option>
              </select>
            </div>

            <ProductionChart data={productionChartData} />
          </div>

          <div className="space-y-3">
            <ShiftCard
              shift={currentShift.shift || "No Active Shift"}
              status={currentShift.status || "Upcoming"}
              supervisor={currentShift.supervisor || "Not assigned"}
              startTime={currentShift.startTime || "--:--"}
              endTime={currentShift.endTime || "--:--"}
              workers={currentShift.workers}
              production={`${currentShift.production.toFixed(1)} kg`}
              operatingHours={currentShift.operatingHours}
              downtime={currentShift.downtime}
            />

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleOpenCreateShift}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#10251f] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#18372e]"
                >
                  <Plus size={16} />
                  New Shift
                </button>

                {currentShiftRecord && (
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenEditShift(currentShiftRecord)
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Clock3 size={16} />
                    Manage Current Shift
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            DAILY PRODUCTION TARGET
        ======================================================= */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#10251f] text-[#d8a83e]">
                <Target size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Daily Production Target
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track today's output against the mine's production target.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Actual
                </p>

                <p className="mt-1 text-2xl font-bold text-[#10251f]">
                  {actualOutput.toFixed(1)} kg
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Target
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-700">
                  {productionTarget.toFixed(1)} kg
                </p>
              </div>

              <div className="hidden sm:block">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Progress
                </p>

                <p className="mt-1 text-2xl font-bold text-[#d8a83e]">
                  {productionProgress}%
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenTargetModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10251f] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#18372e]"
              >
                <Target size={16} />
                {productionTarget > 0 ? "Edit Target" : "Set Target"}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#d8a83e] transition-all duration-700"
                style={{ width: `${productionProgress}%` }}
              />
            </div>

            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>0 kg</span>

              <span>{productionRemaining.toFixed(1)} kg remaining</span>

              <span>{productionTarget.toFixed(1)} kg</span>
            </div>
          </div>
        </section>

        {/* ======================================================
            OPERATIONS + ISSUES
        ======================================================= */}

        <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.8fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Operations Summary
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Key production activity across the selected period.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <Activity size={16} />
                {selectedPeriod}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Truck size={18} />
                </div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Extracted
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {productionSummary.totalExtracted.toFixed(1)} t
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight size={13} />
                  Production active
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Factory size={18} />
                </div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Processed
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {productionSummary.totalProcessed.toFixed(1)} t
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-blue-600">
                  <ArrowUpRight size={13} />
                  Processing stable
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#d8a83e]/10 text-[#a87816]">
                  <Target size={18} />
                </div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Output
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {productionSummary.totalOutput.toFixed(1)} kg
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#a87816]">
                  <ArrowUpRight size={13} />
                  Target tracking
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                  <Clock3 size={18} />
                </div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Downtime
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {productionSummary.totalDowntime.toFixed(1)} hrs
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-rose-600">
                  <ArrowDownRight size={13} />
                  Needs attention
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-100 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Processing Efficiency
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {processingEfficiency}%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#10251f]"
                    style={{ width: `${processingEfficiency}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Operating Efficiency
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {operatingEfficiency}%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#d8a83e]"
                    style={{ width: `${operatingEfficiency}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Production Target
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {productionProgress}%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#10251f]"
                    style={{ width: `${productionProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <OperationalIssues issues={operationalIssues} />
        </section>

        {/* ======================================================
            PRODUCTION TABLE
        ======================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Production Records
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review extraction, processing and production activity.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
                  <Filter size={16} className="text-slate-400" />

                  <select
                    value={selectedShift}
                    onChange={(event) =>
                      setSelectedShift(event.target.value)
                    }
                    className="bg-transparent py-2.5 text-sm font-medium text-slate-700 outline-none"
                  >
                    <option value={SHIFT_ALL}>{SHIFT_ALL}</option>
                    <option value={SHIFT_DAY}>{SHIFT_DAY}</option>
                    <option value={SHIFT_NIGHT}>{SHIFT_NIGHT}</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCreateProduction}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#10251f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#18372e]"
                >
                  <Plus size={16} />
                  New Record
                </button>
              </div>
            </div>
          </div>

          <ProductionTable
            records={filteredRecords}
            onEdit={handleEditProduction}
            onDelete={(id) => void handleDeleteProduction(id)}
          />
        </section>

        {/* ======================================================
            FOOTER SUMMARY
        ======================================================= */}

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Activity size={18} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Operations Status
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {currentShift.status || "No Active Shift"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8a83e]/10 text-[#a87816]">
                <Target size={18} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Today's Target
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {productionProgress}% Complete
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle size={18} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Attention Required
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {operationalIssues.length} Active Issues
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================
          PRODUCTION MODAL
      ========================================================= */}

      {isProductionModalOpen && (
        <RecordProductionModal
          record={editingRecord}
          onClose={handleCloseProductionModal}
          onSubmit={handleRecordProduction}
        />
      )}

      {/* ========================================================
          TARGET MODAL
      ========================================================= */}

      {isTargetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f] text-[#d8a83e]">
                  <Target size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {productionTarget > 0
                      ? "Update Production Target"
                      : "Set Daily Production Target"}
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatDisplayDate(today)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseTargetModal}
                disabled={savingTarget}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close target modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label
                  htmlFor="daily-production-target"
                  className="text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Production Target
                </label>

                <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-[#d8a83e] focus-within:ring-2 focus-within:ring-[#d8a83e]/20">
                  <input
                    id="daily-production-target"
                    type="number"
                    min="0.01"
                    step="0.1"
                    value={targetInput}
                    onChange={(event) =>
                      setTargetInput(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        void handleSaveTarget();
                      }
                    }}
                    placeholder="Enter target"
                    disabled={savingTarget}
                    className="w-full bg-transparent py-3 text-lg font-bold text-slate-900 outline-none placeholder:text-slate-300 disabled:cursor-not-allowed"
                    autoFocus
                  />

                  <span className="text-sm font-semibold text-slate-400">
                    kg
                  </span>
                </div>

                {targetError && (
                  <p className="mt-2 text-xs font-semibold text-rose-600">
                    {targetError}
                  </p>
                )}

                {productionTarget > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Current
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {productionTarget.toFixed(1)} kg
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Actual
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#10251f]">
                        {actualOutput.toFixed(1)} kg
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                Set the total production output expected for the mine today.
                Actual production will be compared automatically against this
                target.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={handleCloseTargetModal}
                disabled={savingTarget}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleSaveTarget()}
                disabled={savingTarget}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10251f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#18372e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingTarget && (
                  <RefreshCw size={15} className="animate-spin" />
                )}

                {savingTarget
                  ? "Saving..."
                  : productionTarget > 0
                    ? "Update Target"
                    : "Save Target"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SHIFT MANAGEMENT MODAL
      ========================================================= */}

      {isShiftModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f] text-[#d8a83e]">
                  <Clock3 size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingShift ? "Manage Shift" : "Create Mine Shift"}
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Configure the mine shift and workforce.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseShiftModal}
                disabled={savingShift}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close shift modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <label
                  htmlFor="shift-date"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Shift Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="shift-date"
                    type="date"
                    value={shiftForm.date}
                    onChange={(event) =>
                      handleShiftFormChange("date", event.target.value)
                    }
                    disabled={savingShift}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/20 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="shift-name"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Shift
                  </label>

                  <select
                    id="shift-name"
                    value={shiftForm.shift}
                    onChange={(event) =>
                      handleShiftFormChange("shift", event.target.value)
                    }
                    disabled={savingShift}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/20 disabled:cursor-not-allowed"
                  >
                    <option value={SHIFT_DAY}>{SHIFT_DAY}</option>
                    <option value={SHIFT_NIGHT}>{SHIFT_NIGHT}</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="shift-status"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Status
                  </label>

                  <select
                    id="shift-status"
                    value={shiftForm.status}
                    onChange={(event) =>
                      handleShiftFormChange(
                        "status",
                        event.target.value as ShiftStatus,
                      )
                    }
                    disabled={savingShift}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/20 disabled:cursor-not-allowed"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="shift-supervisor"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Supervisor
                </label>

                <div className="relative">
                  <UserRound
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="shift-supervisor"
                    type="text"
                    value={shiftForm.supervisor}
                    onChange={(event) =>
                      handleShiftFormChange(
                        "supervisor",
                        event.target.value,
                      )
                    }
                    placeholder="Enter supervisor name"
                    disabled={savingShift}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/20 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="shift-start-time"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Start Time
                  </label>

                  <div className="relative">
                    <Clock3
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="shift-start-time"
                      type="time"
                      value={shiftForm.startTime}
                      onChange={(event) =>
                        handleShiftFormChange(
                          "startTime",
                          event.target.value,
                        )
                      }
                      disabled={savingShift}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/20 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="shift-end-time"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    End Time
                  </label>

                  <div className="relative">
                    <Clock3
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="shift-end-time"
                      type="time"
                      value={shiftForm.endTime}
                      onChange={(event) =>
                        handleShiftFormChange(
                          "endTime",
                          event.target.value,
                        )
                      }
                      disabled={savingShift}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/20 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="shift-workers"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Workers on Shift
                </label>

                <div className="relative">
                  <Users
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="shift-workers"
                    type="number"
                    min="0"
                    step="1"
                    value={shiftForm.workers}
                    onChange={(event) =>
                      handleShiftFormChange(
                        "workers",
                        Number(event.target.value),
                      )
                    }
                    disabled={savingShift}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-bold text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white focus:ring-2 focus:ring-[#d8a83e]/20 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {shiftError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {shiftError}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                {editingShift && (
                  <button
                    type="button"
                    onClick={() => void handleDeleteShift(editingShift)}
                    disabled={savingShift}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={15} />
                    Delete Shift
                  </button>
                )}
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCloseShiftModal}
                  disabled={savingShift}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void handleSaveShift()}
                  disabled={savingShift}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10251f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#18372e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingShift && (
                    <RefreshCw size={15} className="animate-spin" />
                  )}

                  {savingShift
                    ? "Saving..."
                    : editingShift
                      ? "Update Shift"
                      : "Create Shift"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          LOADING INDICATOR
      ========================================================= */}

      {loading && (
        <div className="pointer-events-none fixed bottom-5 right-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-lg">
          Loading Mine Operations...
        </div>
      )}
    </div>
  );
}

export default MineOperations;