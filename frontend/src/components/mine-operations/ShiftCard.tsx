import {
  Activity,
  Clock3,
  Users,
  UserRound,
} from "lucide-react";

type ShiftCardProps = {
  shift: string;
  status: "Active" | "Completed" | "Upcoming";
  supervisor: string;
  startTime: string;
  endTime: string;
  workers: number;
  production: string;
  operatingHours: number;
  downtime: number;
};

function ShiftCard({
  shift,
  status,
  supervisor,
  startTime,
  endTime,
  workers,
  production,
  operatingHours,
  downtime,
}: ShiftCardProps) {
  const statusStyles = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Completed: "bg-slate-100 text-slate-600 border-slate-200",
    Upcoming: "bg-[#d8a83e]/10 text-[#987018] border-[#d8a83e]/20",
  };

  const efficiency =
    operatingHours + downtime > 0
      ? Math.round(
          (operatingHours /
            (operatingHours + downtime)) *
            100,
        )
      : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f] text-[#d8a83e]">
              <Clock3 size={19} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Current Shift
              </h2>

              <p className="text-sm text-slate-500">
                Active mine shift
              </p>
            </div>
          </div>
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>

      {/* SHIFT NAME */}
      <div className="mt-6 rounded-xl bg-[#10251f] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/50">
              Shift
            </p>

            <p className="mt-1 text-xl font-bold text-white">
              {shift}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-white/50">
              Operating Window
            </p>

            <p className="mt-1 text-sm font-semibold text-[#e5c66d]">
              {startTime} — {endTime}
            </p>
          </div>
        </div>
      </div>

      {/* SUPERVISOR */}
      <div className="mt-5 flex items-center gap-3 border-b border-slate-100 pb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <UserRound size={17} />
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Supervisor
          </p>

          <p className="mt-0.5 text-sm font-semibold text-slate-800">
            {supervisor}
          </p>
        </div>
      </div>

      {/* SHIFT METRICS */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-slate-400" />

            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Workers
            </span>
          </div>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {workers}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <Activity size={15} className="text-slate-400" />

            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Output
            </span>
          </div>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {production}
          </p>
        </div>
      </div>

      {/* EFFICIENCY */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Shift Efficiency
          </span>

          <span className="text-xs font-bold text-[#10251f]">
            {efficiency}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#d8a83e] transition-all"
            style={{ width: `${efficiency}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default ShiftCard;