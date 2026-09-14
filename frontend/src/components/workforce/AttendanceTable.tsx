import {
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  UserX,
} from "lucide-react";

import type { Worker } from "../../services/workforceApi";

type AttendanceTableProps = {
  workers: Worker[];
};

function AttendanceTable({
  workers,
}: AttendanceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70">
            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:px-6">
              Worker
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Role
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Department
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Shift
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Attendance
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Safety
            </th>

            <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {workers.map((worker) => (
            <tr
              key={worker.id}
              className="transition hover:bg-slate-50/70"
            >
              <td className="px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10251f]/[0.07] text-xs font-bold text-[#10251f]">
                    {getInitials(worker.name)}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {worker.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {worker.employeeNumber}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <span className="text-sm font-medium text-slate-600">
                  {worker.role}
                </span>
              </td>

              <td className="px-5 py-4">
                <span className="text-sm text-slate-500">
                  {worker.department}
                </span>
              </td>

              <td className="px-5 py-4">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                  {worker.shift}
                </span>
              </td>

              <td className="px-5 py-4">
                <AttendanceBadge status={worker.status} />
              </td>

              <td className="px-5 py-4">
                {worker.safetyStatus === "Compliant" ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 size={14} />
                    Compliant
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                    <Clock3 size={14} />
                    Training Due
                  </span>
                )}
              </td>

              <td className="px-5 py-4 text-right">
                <button
                  type="button"
                  aria-label={`More actions for ${worker.name}`}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <MoreHorizontal size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {workers.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <UserX size={21} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-800">
            No workers found
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
            Try changing your search or filters to find another
            workforce record.
          </p>
        </div>
      )}

      <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
        <p className="text-xs text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-600">
            {workers.length}
          </span>{" "}
          workforce records
        </p>
      </div>
    </div>
  );
}

type AttendanceBadgeProps = {
  status: Worker["status"];
};

function AttendanceBadge({
  status,
}: AttendanceBadgeProps) {
  const config = {
    Present: {
      icon: CheckCircle2,
      classes: "bg-emerald-50 text-emerald-700",
    },
    Absent: {
      icon: UserX,
      classes: "bg-red-50 text-red-700",
    },
    Late: {
      icon: Clock3,
      classes: "bg-amber-50 text-amber-700",
    },
    "Off Duty": {
      icon: Clock3,
      classes: "bg-slate-100 text-slate-600",
    },
  } as const;

  const item = config[status];
  const Icon = item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${item.classes}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default AttendanceTable;