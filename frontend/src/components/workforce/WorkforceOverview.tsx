import {
  Activity,
  BriefcaseBusiness,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

import type { Worker } from "../../services/workforceApi";

type WorkforceOverviewProps = {
  workers: Worker[];
};

function WorkforceOverview({
  workers,
}: WorkforceOverviewProps) {
  const departments = Array.from(
    new Set(workers.map((worker) => worker.department)),
  );

  const total = workers.length;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#10251f]">
            Workforce Overview
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            People by Department
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current workforce distribution across the operation.
          </p>
        </div>

        <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#10251f]/[0.07] text-[#10251f] sm:flex">
          <Users size={19} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-5 sm:p-6 lg:grid-cols-4">
        <MiniMetric
          icon={UserCheck}
          label="Present"
          value={
            workers.filter(
              (worker) => worker.status === "Present",
            ).length
          }
        />

        <MiniMetric
          icon={Activity}
          label="Active Shifts"
          value={
            workers.filter(
              (worker) =>
                worker.status === "Present" ||
                worker.status === "Late",
            ).length
          }
        />

        <MiniMetric
          icon={ShieldCheck}
          label="Compliant"
          value={
            workers.filter(
              (worker) =>
                worker.safetyStatus === "Compliant",
            ).length
          }
        />

        <MiniMetric
          icon={BriefcaseBusiness}
          label="Departments"
          value={departments.length}
        />
      </div>

      <div className="space-y-4 border-t border-slate-100 p-5 sm:p-6">
        {departments.map((department) => {
          const count = workers.filter(
            (worker) => worker.department === department,
          ).length;

          const percentage =
            total > 0
              ? Math.round((count / total) * 100)
              : 0;

          return (
            <div key={department}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {department}
                  </p>

                  <p className="text-xs text-slate-400">
                    {count} {count === 1 ? "worker" : "workers"}
                  </p>
                </div>

                <span className="text-xs font-bold text-slate-500">
                  {percentage}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#10251f] transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

type MiniMetricProps = {
  icon: typeof Users;
  label: string;
  value: number;
};

function MiniMetric({
  icon: Icon,
  label,
  value,
}: MiniMetricProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#10251f] shadow-sm">
        <Icon size={17} />
      </div>

      <p className="mt-3 text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default WorkforceOverview;