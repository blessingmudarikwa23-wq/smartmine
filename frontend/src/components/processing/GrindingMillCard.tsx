import {
  Activity,
  AlertTriangle,
  Clock3,
  Factory,
  Gauge,
  Settings2,
  Wrench,
} from "lucide-react";

type GrindingMillCardProps = {
  status: "Running" | "Stopped" | "Maintenance";
  materialFeed: string;
  throughput: string;
  operatingHours: number;
  downtime: number;
  efficiency: number;
  currentIssue: string;
};

export default function GrindingMillCard({
  status,
  materialFeed,
  throughput,
  operatingHours,
  downtime,
  efficiency,
  currentIssue,
}: GrindingMillCardProps) {
  const statusClasses =
    status === "Running"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Maintenance"
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-700";

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10251f] text-[#d8a83e]">
            <Factory size={21} />
          </div>

          <div>
            <p className="text-lg font-bold text-[#10251f]">
              Grinding Mill
            </p>
            <p className="text-xs text-slate-500">
              Grinding & processing stage
            </p>
          </div>
        </div>

        <span
          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses}`}
        >
          <span className="h-2 w-2 rounded-full bg-current" />
          {status}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Settings2 size={15} />
            <span className="text-xs">Material Feed</span>
          </div>

          <p className="mt-2 text-xl font-bold text-[#10251f]">
            {materialFeed}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Activity size={15} />
            <span className="text-xs">Throughput</span>
          </div>

          <p className="mt-2 text-xl font-bold text-[#10251f]">
            {throughput}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Clock3 size={15} />
            <span className="text-xs">Operating</span>
          </div>

          <p className="mt-2 text-xl font-bold text-[#10251f]">
            {operatingHours.toFixed(1)} hrs
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Wrench size={15} />
            <span className="text-xs">Downtime</span>
          </div>

          <p className="mt-2 text-xl font-bold text-[#10251f]">
            {downtime.toFixed(1)} hrs
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#10251f]">
            <Gauge size={16} />
            Mill Efficiency
          </div>

          <span className="text-sm font-bold text-[#10251f]">
            {efficiency.toFixed(1)}%
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#10251f]"
            style={{ width: `${Math.min(100, efficiency)}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
        <AlertTriangle
          size={18}
          className="mt-0.5 shrink-0 text-amber-600"
        />

        <div>
          <p className="text-xs font-semibold text-amber-800">
            Current Issue
          </p>

          <p className="mt-1 text-xs leading-5 text-amber-700">
            {currentIssue}
          </p>
        </div>
      </div>
    </div>
  );
}