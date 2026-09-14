import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CircleDollarSign,
  Factory,
  ShieldCheck,
} from "lucide-react";

import type { ReportPeriod } from "../../pages/Reports";

type ReportsOverviewProps = {
  period: ReportPeriod;
};

const performance = {
  Weekly: [62, 71, 67, 78, 74, 82, 88],
  Monthly: [58, 64, 69, 73, 77, 81, 86],
  Quarterly: [52, 61, 68, 72, 79, 84, 91],
  Annual: [48, 55, 63, 69, 74, 81, 89],
};

function ReportsOverview({
  period,
}: ReportsOverviewProps) {
  const values = performance[period];

  const current = values[values.length - 1];
  const previous = values[values.length - 2];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3
              size={20}
              className="text-[#d8a83e]"
            />

            <h2 className="text-lg font-bold text-[#10251f]">
              Mine Performance Overview
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-400">
            Overall operational performance for the selected{" "}
            {period.toLowerCase()} reporting period.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              Performance
            </p>

            <p className="mt-1 text-xl font-bold text-emerald-700">
              {current}%
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
            <ArrowUpRight size={14} />
            {current - previous}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8 rounded-2xl border border-slate-100 p-5">
        <div className="relative h-64">
          <div className="absolute inset-0 flex flex-col justify-between">
            <span className="border-t border-dashed border-slate-100" />
            <span className="border-t border-dashed border-slate-100" />
            <span className="border-t border-dashed border-slate-100" />
            <span className="border-t border-dashed border-slate-100" />
            <span className="border-t border-slate-200" />
          </div>

          <div className="absolute inset-0 flex items-end justify-between gap-3 px-2">
            {values.map((value, index) => (
              <div
                key={`${period}-${index}`}
                className="group flex h-full flex-1 flex-col items-center justify-end"
              >
                <div className="mb-2 rounded-lg bg-[#10251f] px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-sm transition group-hover:opacity-100">
                  {value}%
                </div>

                <div
                  className="w-full max-w-[60px] rounded-t-xl bg-[#d8a83e] transition-all duration-500 group-hover:bg-[#c4962f]"
                  style={{
                    height: `${value}%`,
                  }}
                />

                <span className="mt-2 text-[10px] font-semibold text-slate-400">
                  {period === "Weekly"
                    ? `D${index + 1}`
                    : period === "Monthly"
                      ? `W${index + 1}`
                      : period === "Quarterly"
                        ? `M${index + 1}`
                        : `Q${index + 1}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <Activity
            size={19}
            className="text-[#d8a83e]"
          />

          <p className="mt-3 text-xs text-slate-400">
            Operations
          </p>

          <p className="mt-1 text-lg font-bold text-[#10251f]">
            86%
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <Factory
            size={19}
            className="text-[#d8a83e]"
          />

          <p className="mt-3 text-xs text-slate-400">
            Processing
          </p>

          <p className="mt-1 text-lg font-bold text-[#10251f]">
            81%
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <CircleDollarSign
            size={19}
            className="text-[#d8a83e]"
          />

          <p className="mt-3 text-xs text-slate-400">
            Financial
          </p>

          <p className="mt-1 text-lg font-bold text-[#10251f]">
            84%
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <ShieldCheck
            size={19}
            className="text-[#d8a83e]"
          />

          <p className="mt-3 text-xs text-slate-400">
            Safety
          </p>

          <p className="mt-1 text-lg font-bold text-[#10251f]">
            92%
          </p>
        </div>
      </div>
    </section>
  );
}

export default ReportsOverview;