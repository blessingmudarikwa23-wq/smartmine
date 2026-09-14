import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
} from "lucide-react";

import type { SafetyInspection } from "../../pages/Safety";

type SafetyInspectionsProps = {
  inspections: SafetyInspection[];
};

function SafetyInspections({
  inspections,
}: SafetyInspectionsProps) {
  const statusStyles = {
    Completed: "bg-emerald-50 text-emerald-700",
    Scheduled: "bg-blue-50 text-blue-700",
    Overdue: "bg-red-50 text-red-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f]/8 text-[#10251f]">
            <ClipboardCheck size={19} />
          </div>

          <div>
            <h2 className="font-bold text-[#10251f]">
              Safety Inspections
            </h2>

            <p className="text-xs text-slate-400">
              Planned and completed site inspections
            </p>
          </div>
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
          {inspections.length} Records
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {inspections.map((inspection) => {
          const Icon = inspection.icon;

          return (
            <div
              key={inspection.id}
              className="rounded-xl border border-slate-100 p-4 transition hover:border-[#d8a83e]/40 hover:bg-slate-50/40"
            >
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#10251f]">
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#10251f]">
                        {inspection.title}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {inspection.area}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyles[inspection.status]}`}
                    >
                      {inspection.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={13} />
                      {inspection.date}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={13} />
                      {inspection.inspector}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      {inspection.status === "Overdue" ? (
                        <AlertTriangle
                          size={13}
                          className="text-red-500"
                        />
                      ) : (
                        <CheckCircle2
                          size={13}
                          className="text-emerald-500"
                        />
                      )}

                      {inspection.findings} findings
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SafetyInspections;