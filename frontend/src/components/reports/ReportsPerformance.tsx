import {
  ArrowDownRight,
  ArrowUpRight,
  Gauge,
  Hammer,
  Package,
  Truck,
} from "lucide-react";

import type { ReportPeriod } from "../../pages/Reports";

type ReportsPerformanceProps = {
  period: ReportPeriod;
};

function ReportsPerformance({
  period,
}: ReportsPerformanceProps) {
  const multiplier =
    period === "Weekly"
      ? 0.72
      : period === "Monthly"
        ? 1
        : period === "Quarterly"
          ? 2.84
          : 11.6;

  const production = Math.round(1248 * multiplier);
  const processed = Math.round(1086 * multiplier);
  const equipment = 87;
  const target = Math.round(1380 * multiplier);

  const metrics = [
    {
      title: "Material Extracted",
      value: `${production.toLocaleString()} t`,
      target: `${target.toLocaleString()} t`,
      percentage: Math.min(
        Math.round((production / target) * 100),
        100,
      ),
      icon: Hammer,
      positive: true,
    },
    {
      title: "Material Processed",
      value: `${processed.toLocaleString()} t`,
      target: `${Math.round(target * 0.92).toLocaleString()} t`,
      percentage: 81,
      icon: Package,
      positive: true,
    },
    {
      title: "Equipment Utilisation",
      value: `${equipment}%`,
      target: "85%",
      percentage: equipment,
      icon: Truck,
      positive: true,
    },
    {
      title: "Production Efficiency",
      value: "83%",
      target: "80%",
      percentage: 83,
      icon: Gauge,
      positive: true,
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <div className="flex items-center gap-2">
          <Gauge size={20} className="text-[#d8a83e]" />

          <h2 className="text-lg font-bold text-[#10251f]">
            Operational Performance
          </h2>
        </div>

        <p className="mt-1 text-sm text-slate-400">
          Key production and operational indicators for the{" "}
          {period.toLowerCase()} period.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.title}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#10251f] shadow-sm">
                  <Icon size={19} />
                </div>

                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                  <ArrowUpRight size={12} />
                  On track
                </span>
              </div>

              <p className="mt-5 text-xs font-semibold text-slate-400">
                {metric.title}
              </p>

              <p className="mt-1 text-2xl font-bold text-[#10251f]">
                {metric.value}
              </p>

              <div className="mt-4">
                <div className="mb-2 flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>Performance</span>
                  <span>{metric.percentage}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-[#d8a83e]"
                    style={{
                      width: `${metric.percentage}%`,
                    }}
                  />
                </div>
              </div>

              <p className="mt-3 flex items-center gap-1 text-[10px] text-slate-400">
                <ArrowDownRight size={11} />
                Target: {metric.target}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ReportsPerformance;