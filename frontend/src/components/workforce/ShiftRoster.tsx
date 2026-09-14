import { useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  Clock3,
  Moon,
  Sun,
  UserCheck,
  Users,
  X,
} from "lucide-react";

import type { Worker } from "../../services/workforceApi";

type ShiftRosterProps = {
  workers: Worker[];
  onUpdateWorkerShift?: (workerId: string, newShift: string) => void;
};

export default function ShiftRoster({
  workers,
  onUpdateWorkerShift,
}: ShiftRosterProps) {
  const [selectedShift, setSelectedShift] = useState<{
    title: string;
    time: string;
  } | null>(null);

  const [shiftTimes, setShiftTimes] = useState({
    "Day Shift": "06:00 — 18:00",
    "Night Shift": "18:00 — 06:00",
  });

  const dayShift = workers.filter((worker) => worker.shift === "Day Shift");
  const nightShift = workers.filter((worker) => worker.shift === "Night Shift");

  const handleTimeChange = (shiftTitle: string, newTime: string) => {
    setShiftTimes((prev) => ({
      ...prev,
      [shiftTitle]: newTime,
    }));
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#10251f]">
              Shift Management
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Shift Roster
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Workforce coverage by operating shift.
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f]/[0.07] text-[#10251f]">
            <CalendarDays size={19} />
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <ShiftCard
          title="Day Shift"
          time={shiftTimes["Day Shift"]}
          workers={dayShift}
          icon={Sun}
          active
          onViewDetails={() =>
            setSelectedShift({
              title: "Day Shift",
              time: shiftTimes["Day Shift"],
            })
          }
        />

        <ShiftCard
          title="Night Shift"
          time={shiftTimes["Night Shift"]}
          workers={nightShift}
          icon={Moon}
          onViewDetails={() =>
            setSelectedShift({
              title: "Night Shift",
              time: shiftTimes["Night Shift"],
            })
          }
        />

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock3 size={16} className="text-slate-500" />

              <span className="text-xs font-semibold text-slate-600">
                Current operating period
              </span>
            </div>

            <span className="text-xs font-bold text-emerald-700">Active</span>
          </div>
        </div>
      </div>

      {selectedShift && (
        <ShiftDetailsModal
          title={selectedShift.title}
          time={selectedShift.time}
          allWorkers={workers}
          onClose={() => setSelectedShift(null)}
          onTimeChange={(newTime) =>
            handleTimeChange(selectedShift.title, newTime)
          }
          onUpdateWorkerShift={onUpdateWorkerShift}
        />
      )}
    </article>
  );
}

type ShiftCardProps = {
  title: string;
  time: string;
  workers: Worker[];
  icon: typeof Sun;
  active?: boolean;
  onViewDetails: () => void;
};

function ShiftCard({
  title,
  time,
  workers,
  icon: Icon,
  active = false,
  onViewDetails,
}: ShiftCardProps) {
  const available = workers.filter(
    (worker) => worker.status === "Present" || worker.status === "Late",
  ).length;

  const coverage =
    workers.length > 0 ? Math.round((available / workers.length) * 100) : 0;

  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        active
          ? "border-[#d8a83e]/50 bg-[#d8a83e]/[0.05]"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            active ? "bg-[#d8a83e] text-[#10251f]" : "bg-slate-100 text-slate-600"
          }`}
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900">{title}</p>

              <p className="mt-1 text-xs text-slate-400">{time}</p>
            </div>

            {active && (
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                CURRENT
              </span>
            )}
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Users size={15} className="text-slate-400" />

                <span className="text-lg font-bold text-slate-900">
                  {available}
                </span>

                <span className="text-xs text-slate-400">
                  / {workers.length} available
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-400">Coverage</p>

              <p className="mt-1 text-sm font-bold text-slate-700">{coverage}%</p>
            </div>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#10251f]"
              style={{ width: `${coverage}%` }}
            />
          </div>

          <button
            type="button"
            onClick={onViewDetails}
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#10251f] transition hover:text-[#d8a83e]"
          >
            View shift details
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

type ShiftDetailsModalProps = {
  title: string;
  time: string;
  allWorkers: Worker[];
  onClose: () => void;
  onTimeChange: (newTime: string) => void;
  onUpdateWorkerShift?: (workerId: string, newShift: string) => void;
};

function ShiftDetailsModal({
  title,
  time,
  allWorkers,
  onClose,
  onTimeChange,
  onUpdateWorkerShift,
}: ShiftDetailsModalProps) {
  const initialTimes = time.split(" — ");
  const [start, setStart] = useState(initialTimes[0] || "06:00");
  const [end, setEnd] = useState(initialTimes[1] || "18:00");

  const handleSaveTimes = () => {
    onTimeChange(`${start} — ${end}`);
  };

  const toggleWorkerAssignment = (worker: Worker) => {
    if (!onUpdateWorkerShift) return;
    const workerId = worker.id || worker.employeeNumber;
    const nextShift = worker.shift === title ? "Off Duty" : title;
    onUpdateWorkerShift(String(workerId), nextShift);
  };

  const shiftWorkers = allWorkers.filter((w) => w.shift === title);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d8a83e]">
              Shift Details
            </p>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Operating Hours Input */}
        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Clock size={16} className="text-[#10251f]" />
            <span className="text-xs font-bold text-slate-700">
              Shift Operating Hours
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500">
                Start Time
              </label>
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                onBlur={handleSaveTimes}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#10251f]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500">
                End Time
              </label>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                onBlur={handleSaveTimes}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#10251f]"
              />
            </div>
          </div>
        </div>

        {/* Worker Roster Management */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assigned Workers ({shiftWorkers.length})
            </span>
            <Users size={15} className="text-slate-400" />
          </div>

          <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
            {allWorkers.map((worker) => {
              const isAssigned = worker.shift === title;
              const workerId = worker.id || worker.employeeNumber;

              return (
                <div
                  key={workerId}
                  className={`flex items-center justify-between rounded-xl border p-3 transition ${
                    isAssigned
                      ? "border-[#10251f]/20 bg-[#10251f]/[0.02]"
                      : "border-slate-100 bg-white"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {worker.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {worker.role} • {worker.department}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleWorkerAssignment(worker)}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                      isAssigned
                        ? "bg-[#10251f] text-white hover:bg-[#10251f]/80"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {isAssigned ? (
                      <>
                        <UserCheck size={12} /> Assigned
                      </>
                    ) : (
                      "+ Assign"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#10251f] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#10251f]/90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

