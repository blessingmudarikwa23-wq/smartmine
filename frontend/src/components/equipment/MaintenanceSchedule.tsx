import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Wrench,
  X,
} from "lucide-react";

type MaintenanceItem = {
  id: number;
  equipment: string;
  equipmentId: string;
  type: string;
  dueDate: string;
  priority: string;
  status: string;
};

type MaintenanceScheduleProps = {
  items: MaintenanceItem[];
};

export default function MaintenanceSchedule({
  items,
}: MaintenanceScheduleProps) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Preventive maintenance
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#10251f]">
              Maintenance Schedule
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upcoming service and maintenance activities.
            </p>
          </div>

          <div className="rounded-xl bg-[#10251f]/5 p-2.5">
            <CalendarDays size={20} className="text-[#10251f]" />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <CalendarDays
                size={24}
                className="mx-auto text-slate-300"
              />

              <p className="mt-2 text-sm font-semibold text-slate-600">
                No maintenance activities
              </p>

              <p className="mt-1 text-xs text-slate-400">
                There are currently no scheduled maintenance activities.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const inProgress = item.status === "In Progress";
              const highPriority = item.priority === "High";

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-slate-200 hover:bg-white"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-lg p-2 ${
                        inProgress
                          ? "bg-amber-50 text-amber-600"
                          : "bg-[#10251f]/5 text-[#10251f]"
                      }`}
                    >
                      {inProgress ? (
                        <Wrench size={17} />
                      ) : (
                        <CalendarDays size={17} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row">
                        <div>
                          <p className="font-semibold text-slate-800">
                            {item.equipment}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {item.equipmentId} · {item.type}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            highPriority
                              ? "bg-red-50 text-red-600"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                        <span className="inline-flex items-center gap-1.5 text-slate-500">
                          <Clock3 size={13} />
                          Due {item.dueDate}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 font-semibold ${
                            inProgress
                              ? "text-amber-600"
                              : "text-slate-600"
                          }`}
                        >
                          {inProgress ? (
                            <Wrench size={13} />
                          ) : (
                            <CheckCircle2 size={13} />
                          )}
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowHistory(true)}
          className="mt-5 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-[#d8a83e] hover:bg-[#d8a83e]/5 hover:text-[#10251f]"
        >
          View Maintenance History
        </button>
      </div>

      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Equipment maintenance
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#10251f]">
                  Maintenance History
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Maintenance activities currently available in the equipment
                  schedule.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close maintenance history"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="py-10 text-center">
                  <CalendarDays
                    size={30}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 font-semibold text-slate-600">
                    No maintenance records available
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => {
                    const completed = item.status === "Completed";
                    const inProgress = item.status === "In Progress";

                    return (
                      <div
                        key={item.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-3">
                            <div
                              className={`rounded-lg p-2.5 ${
                                completed
                                  ? "bg-emerald-50 text-emerald-600"
                                  : inProgress
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {completed ? (
                                <CheckCircle2 size={18} />
                              ) : (
                                <Wrench size={18} />
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-800">
                                {item.equipment}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {item.equipmentId} · {item.type}
                              </p>

                              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500">
                                <CalendarDays size={13} />
                                {item.dueDate}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                              {item.priority}
                            </span>

                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                completed
                                  ? "bg-emerald-50 text-emerald-600"
                                  : inProgress
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="w-full rounded-xl bg-[#10251f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17352c]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}