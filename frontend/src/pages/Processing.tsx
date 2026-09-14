import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Factory,
  Filter,
  Gauge,
  Hammer,
  Plus,
  RefreshCw,
  Settings2,
  Target,
  Truck,
  Wrench,
} from "lucide-react";

import ProcessingKPI from "../components/processing/ProcessingKPI";
import ProcessingFlow from "../components/processing/ProcessingFlow";
import CrusherCard from "../components/processing/CrusherCard";
import GrindingMillCard from "../components/processing/GrindingMillCard";
import ProcessingIssues from "../components/processing/ProcessingIssues";
import ProcessingTable from "../components/processing/ProcessingTable";
import RecordProcessingModal from "../components/processing/RecordProcessingModal";

import {
  processingApi,
  type ProcessingRecord as ApiProcessingRecord,
  type ProcessingRecordCreate,
} from "../services/processingApi";

type ProcessingRecord = {
  id: number;
  date: string;
  shift: string;
  materialReceived: number;
  crushed: number;
  processed: number;
  output: number;
  operatingHours: number;
  downtime: number;
  status: "Completed" | "In Progress" | "Delayed";
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

const processingChartData = [
  { day: "Mon", received: 49, crushed: 44, processed: 39, output: 13.6 },
  { day: "Tue", received: 52, crushed: 46, processed: 41, output: 14.2 },
  { day: "Wed", received: 46, crushed: 41, processed: 36, output: 12.4 },
  { day: "Thu", received: 55, crushed: 50, processed: 45, output: 15.2 },
  { day: "Fri", received: 53, crushed: 48, processed: 43, output: 14.8 },
  { day: "Sat", received: 48, crushed: 43, processed: 38, output: 13.1 },
  { day: "Sun", received: 52, crushed: 48, processed: 43, output: 14.8 },
];

const processingIssues = [
  {
    id: 1,
    title: "Crusher Vibration Warning",
    description:
      "Crusher vibration is above the normal operating range and requires inspection.",
    category: "Crusher",
    priority: "High",
    duration: "35m",
    icon: Wrench,
  },
  {
    id: 2,
    title: "Grinding Mill Feed Reduction",
    description:
      "Material feed to the grinding mill has reduced below the expected throughput.",
    category: "Grinding Mill",
    priority: "Medium",
    duration: "50m",
    icon: Settings2,
  },
  {
    id: 3,
    title: "Water Supply Check",
    description:
      "Processing water level should be checked before the next production cycle.",
    category: "Processing",
    priority: "Medium",
    duration: "â€”",
    icon: AlertTriangle,
  },
];

const formatNumber = (value: number, decimals = 1) =>
  value.toLocaleString("en-ZA", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const formatApiDate = (date: string) => {
  if (!date) {
    return date;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split("-").map(Number);

    const parsedDate = new Date(year, month - 1, day);

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getTodayDisplay = () => {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getTodayApiDate = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const normalizeApiDate = (date: string) => {
  if (!date) {
    return getTodayApiDate();
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return getTodayApiDate();
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const mapApiRecord = (
  record: ApiProcessingRecord
): ProcessingRecord => ({
  id: record.id,
  date: formatApiDate(record.date),
  shift: record.shift,
  materialReceived: record.materialReceived,
  crushed: record.crushed,
  processed: record.processed,
  output: record.output,
  operatingHours: record.operatingHours,
  downtime: record.downtime,
  status: record.status,
  notes: record.notes,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});

const emptyTodayRecord: ProcessingRecord = {
  id: 0,
  date: getTodayDisplay(),
  shift: "Day Shift",
  materialReceived: 0,
  crushed: 0,
  processed: 0,
  output: 0,
  operatingHours: 0,
  downtime: 0,
  status: "In Progress",
};

export default function Processing() {
  const [records, setRecords] = useState<ProcessingRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<ProcessingRecord | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const todayDisplay = getTodayDisplay();

  const loadRecords = async () => {
    try {
      setIsLoading(true);

      const apiRecords = await processingApi.getRecords();

      setRecords(apiRecords.map(mapApiRecord));
    } catch (error) {
      console.error("Failed to load processing records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadRecords();
  }, []);

  const today = useMemo(() => {
    const currentDayRecord = records.find(
      (record) => record.date === todayDisplay
    );

    if (currentDayRecord) {
      return currentDayRecord;
    }

    return emptyTodayRecord;
  }, [records, todayDisplay]);

  const totals = useMemo(() => {
    const totalReceived = records.reduce(
      (sum, record) => sum + record.materialReceived,
      0
    );

    const totalCrushed = records.reduce(
      (sum, record) => sum + record.crushed,
      0
    );

    const totalProcessed = records.reduce(
      (sum, record) => sum + record.processed,
      0
    );

    const totalOutput = records.reduce(
      (sum, record) => sum + record.output,
      0
    );

    const totalOperatingHours = records.reduce(
      (sum, record) => sum + record.operatingHours,
      0
    );

    const totalDowntime = records.reduce(
      (sum, record) => sum + record.downtime,
      0
    );

    return {
      totalReceived,
      totalCrushed,
      totalProcessed,
      totalOutput,
      totalOperatingHours,
      totalDowntime,
    };
  }, [records]);

  const processingEfficiency =
    today.materialReceived > 0
      ? (today.processed / today.materialReceived) * 100
      : 0;

  const crusherEfficiency =
    today.materialReceived > 0
      ? (today.crushed / today.materialReceived) * 100
      : 0;

  const refreshData = async () => {
    setIsRefreshing(true);

    try {
      await loadRecords();
    } catch (error) {
      console.error("Failed to refresh processing data:", error);
    } finally {
      window.setTimeout(() => {
        setIsRefreshing(false);
      }, 700);
    }
  };

  /*
   * =========================================================
   * SAVE / UPDATE PROCESSING RECORD
   * =========================================================
   *
   * If selectedRecord exists:
   *     PATCH /api/v1/processing/records/{selectedRecord.id}
   *
   * Otherwise:
   *     POST /api/v1/processing/records
   */
  const handleSaveRecord = async (
    record: ProcessingRecordCreate
  ) => {
    try {
      const payload: ProcessingRecordCreate = {
        date: normalizeApiDate(record.date),
        shift: record.shift,
        materialReceived: record.materialReceived,
        crushed: record.crushed,
        processed: record.processed,
        output: record.output,
        operatingHours: record.operatingHours,
        downtime: record.downtime,
        status: record.status,
        notes: record.notes ?? null,
      };

      /*
       * EDIT EXISTING RECORD
       */
      if (selectedRecord !== null) {
        console.log(
          "Updating processing record:",
          selectedRecord.id
        );

        console.log("Update payload:", payload);

        const updatedRecord =
          await processingApi.updateRecord(
            selectedRecord.id,
            payload
          );

        console.log(
          "Processing record updated successfully:",
          updatedRecord
        );

        setRecords((currentRecords) =>
          currentRecords.map((currentRecord) =>
            currentRecord.id === selectedRecord.id
              ? mapApiRecord(updatedRecord)
              : currentRecord
          )
        );
      } else {
        /*
         * CREATE NEW RECORD
         */
        console.log("Creating processing record:", payload);

        const createdRecord =
          await processingApi.createRecord(payload);

        console.log(
          "Processing record created successfully:",
          createdRecord
        );

        setRecords((currentRecords) => [
          mapApiRecord(createdRecord),
          ...currentRecords,
        ]);
      }

      /*
       * Close the modal only after the backend
       * operation has completed successfully.
       */
      setSelectedRecord(null);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to save processing record:", error);

      console.error(
        "Processing API response:",
        error?.response?.data
      );

      console.error(
        "Processing API status:",
        error?.response?.status
      );

      const serverMessage = error?.response?.data?.detail;

      window.alert(
        serverMessage ||
          "The processing record could not be saved. Please try again."
      );
    }
  };

  /*
   * =========================================================
   * EDIT RECORD
   * =========================================================
   */
  const handleEditRecord = (record: ProcessingRecord) => {
    console.log("Editing processing record:", record);

    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  /*
   * =========================================================
   * DELETE RECORD
   * =========================================================
   */
  const handleDeleteRecord = async (recordId: number) => {
    const record = records.find(
      (item) => item.id === recordId
    );

    if (!record) {
      console.error(
        "Processing record not found:",
        recordId
      );

      return;
    }

    const confirmed = window.confirm(
      `Delete the processing record for ${record.date}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await processingApi.deleteRecord(recordId);

      setRecords((current) =>
        current.filter((item) => item.id !== recordId)
      );

      if (selectedRecord?.id === recordId) {
        setSelectedRecord(null);
        setIsModalOpen(false);
      }
    } catch (error: any) {
      console.error(
        "Failed to delete processing record:",
        error
      );

      console.error(
        "Processing API response:",
        error?.response?.data
      );

      window.alert(
        error?.response?.data?.detail ||
          "The processing record could not be deleted. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f8]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="mb-6 overflow-hidden rounded-2xl bg-[#10251f] shadow-sm">
          <div className="relative px-5 py-6 sm:px-7 lg:px-8">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#d8a83e]/10 blur-3xl" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8a83e]/15 text-[#d8a83e]">
                    <Factory size={21} strokeWidth={2} />
                  </div>

                  <span className="text-sm font-medium text-[#d8a83e]">
                    Processing Operations
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Crushing & Grinding
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                  Monitor material flow, crusher performance, grinding mill
                  operations and daily processing output from one place.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                    <Activity size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-white/45">
                      Processing Status
                    </p>

                    <p className="text-sm font-semibold text-white">
                      Operational
                    </p>
                  </div>

                  <span className="ml-2 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRecord(null);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d8a83e] px-4 py-3 text-sm font-semibold text-[#10251f] shadow-md transition hover:brightness-105"
                >
                  <Plus size={18} />
                  Record Processing
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {["Today", "7 Days", "30 Days"].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setSelectedPeriod(period)}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  selectedPeriod === period
                    ? "bg-[#10251f] text-white shadow-sm"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              <CalendarDays size={17} />
              {todayDisplay}
            </button>

            <button
              type="button"
              onClick={refreshData}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50"
              aria-label="Refresh processing data"
            >
              <RefreshCw
                size={17}
                className={isRefreshing ? "animate-spin" : ""}
              />
            </button>
          </div>
        </section>

        {/* KPIs */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <ProcessingKPI
            title="Material Received"
            value={`${formatNumber(today.materialReceived, 0)} t`}
            description="Material entering processing"
            change="+8.2%"
            trend="up"
            icon={Truck}
          />

          <ProcessingKPI
            title="Crushed"
            value={`${formatNumber(today.crushed, 0)} t`}
            description="Material processed by crusher"
            change="+6.5%"
            trend="up"
            icon={Hammer}
          />

          <ProcessingKPI
            title="Processed"
            value={`${formatNumber(today.processed, 0)} t`}
            description="Material through grinding"
            change="+5.8%"
            trend="up"
            icon={Factory}
          />

          <ProcessingKPI
            title="Final Output"
            value={`${formatNumber(today.output)} t`}
            description="Current processing output"
            change="+4.9%"
            trend="up"
            icon={Target}
          />

          <ProcessingKPI
            title="Downtime"
            value={`${formatNumber(today.downtime)} hrs`}
            description="Processing downtime today"
            change="-18.4%"
            trend="up"
            icon={Clock3}
          />
        </section>

        {/* Flow */}
        <section className="mb-6">
          <ProcessingFlow
            materialReceived={today.materialReceived}
            crushed={today.crushed}
            processed={today.processed}
            output={today.output}
          />
        </section>

        {/* Equipment */}
        <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <CrusherCard
            status="Running"
            materialFeed={`${today.materialReceived} t`}
            throughput={`${today.crushed} t`}
            operatingHours={today.operatingHours}
            downtime={today.downtime}
            efficiency={crusherEfficiency}
            currentIssue="Vibration warning requires inspection."
          />

          <GrindingMillCard
            status="Running"
            materialFeed={`${today.crushed} t`}
            throughput={`${today.processed} t`}
            operatingHours={today.operatingHours}
            downtime={today.downtime}
            efficiency={processingEfficiency}
            currentIssue="Feed rate slightly below expected level."
          />
        </section>

        {/* Performance */}
        <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_0.8fr]">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#10251f]">
                  Processing Performance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Material flow and output for the last seven days
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#10251f]" />
                  Processed
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d8a83e]" />
                  Output
                </span>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <svg
                viewBox="0 0 800 280"
                className="h-full w-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="processedFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#10251f"
                      stopOpacity="0.18"
                    />

                    <stop
                      offset="100%"
                      stopColor="#10251f"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {[40, 90, 140, 190, 240].map((y) => (
                  <line
                    key={y}
                    x1="55"
                    x2="770"
                    y1={y}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                ))}

                <polyline
                  points={processingChartData
                    .map((item, index) => {
                      const x = 70 + index * 112;

                      const y =
                        230 -
                        ((item.processed - 30) / 20) * 160;

                      return `${x},${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#10251f"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <polyline
                  points={processingChartData
                    .map((item, index) => {
                      const x = 70 + index * 112;

                      const y =
                        230 -
                        ((item.output - 10) / 6) * 160;

                      return `${x},${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#d8a83e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {processingChartData.map((item, index) => {
                  const x = 70 + index * 112;

                  const processedY =
                    230 -
                    ((item.processed - 30) / 20) * 160;

                  const outputY =
                    230 -
                    ((item.output - 10) / 6) * 160;

                  return (
                    <g key={item.day}>
                      <circle
                        cx={x}
                        cy={processedY}
                        r="5"
                        fill="#ffffff"
                        stroke="#10251f"
                        strokeWidth="3"
                      />

                      <circle
                        cx={x}
                        cy={outputY}
                        r="4"
                        fill="#ffffff"
                        stroke="#d8a83e"
                        strokeWidth="3"
                      />

                      <text
                        x={x}
                        y="258"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#64748b"
                      >
                        {item.day}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#10251f]">
                Processing Target
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Today's output against target
              </p>
            </div>

            <div className="flex flex-col items-center justify-center py-5">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[14px] border-slate-100">
                <div
                  className="absolute inset-[-14px] rounded-full border-[14px] border-transparent border-t-[#d8a83e] border-r-[#d8a83e]"
                  style={{
                    transform: `rotate(${Math.min(
                      360,
                      Math.max(0, (today.output / 18) * 360)
                    )}deg)`,
                  }}
                />

                <div className="text-center">
                  <p className="text-3xl font-bold text-[#10251f]">
                    {Math.round((today.output / 18) * 100)}%
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Target achieved
                  </p>
                </div>
              </div>

              <div className="mt-6 grid w-full grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Current Output
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#10251f]">
                    {formatNumber(today.output)} t
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Daily Target
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#10251f]">
                    18.0 t
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f]/10 text-[#10251f]">
                <Gauge size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#10251f]">
                  Processing Efficiency
                </p>

                <p className="text-xs text-slate-500">
                  Received material to processed material
                </p>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Efficiency
                </span>

                <span className="text-sm font-bold text-[#10251f]">
                  {formatNumber(processingEfficiency, 1)}%
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#10251f]"
                  style={{
                    width: `${Math.min(
                      100,
                      processingEfficiency
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8a83e]/15 text-[#d8a83e]">
                <Activity size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#10251f]">
                  Operating Hours
                </p>

                <p className="text-xs text-slate-500">
                  Crusher and grinding operations
                </p>
              </div>
            </div>

            <p className="mt-5 text-3xl font-bold text-[#10251f]">
              {formatNumber(today.operatingHours)} hrs
            </p>

            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
              <ArrowUpRight size={14} />
              <span>Healthy operating time</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock3 size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#10251f]">
                  Downtime
                </p>

                <p className="text-xs text-slate-500">
                  Equipment downtime today
                </p>
              </div>
            </div>

            <p className="mt-5 text-3xl font-bold text-[#10251f]">
              {formatNumber(today.downtime)} hrs
            </p>

            <div className="mt-2 flex items-center gap-1 text-emerald-600">
              <ArrowDownRight size={14} />
              <span className="text-xs">
                18.4% lower than previous period
              </span>
            </div>
          </div>
        </section>

        {/* Issues */}
        <section className="mb-6">
          <ProcessingIssues issues={processingIssues} />
        </section>

        {/* Records */}
        <section className="mb-6">
          <ProcessingTable
            records={records}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
          />
        </section>

        {/* Footer summary */}
        <section className="rounded-2xl bg-[#10251f] p-5 shadow-sm sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium text-white/45">
                Recorded Material
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                {formatNumber(totals.totalReceived, 0)} t
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-white/45">
                Total Crushed
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                {formatNumber(totals.totalCrushed, 0)} t
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-white/45">
                Total Processed
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                {formatNumber(totals.totalProcessed, 0)} t
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-white/45">
                Recorded Output
              </p>

              <p className="mt-1 text-xl font-bold text-[#d8a83e]">
                {formatNumber(totals.totalOutput)} t
              </p>
            </div>
          </div>
        </section>

        <div className="mt-5 flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            SmartMine Processing â€¢ {selectedPeriod} operational view
          </p>

          <div className="flex items-center gap-2">
            <Filter size={13} />

            <span>
              {isLoading
                ? "Loading processing data..."
                : "Operational data is connected to the backend"}
            </span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <RecordProcessingModal
          record={selectedRecord ? { ...selectedRecord, notes: selectedRecord.notes ?? null, createdAt: selectedRecord.createdAt ?? '', updatedAt: selectedRecord.updatedAt ?? '' } : null}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRecord(null);
          }}
          onSubmit={handleSaveRecord}
        />
      )}
    </div>
  );
}



