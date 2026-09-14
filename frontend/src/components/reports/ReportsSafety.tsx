import {
  Boxes,
  Droplets,
  Factory,
  HardHat,
  Settings,
  ShieldCheck,
} from "lucide-react";

import type { ReportPeriod } from "../../pages/Reports";

type ReportsOperationalSummaryProps = {
  period: ReportPeriod;
};

function ReportsOperationalSummary({
  period,
}: ReportsOperationalSummaryProps) {
  const items = [
    {
      title: "Processing",
      value: "1,086 t",
      detail: "Material processed",
      percentage: 81,
      icon: Factory,
    },
    {
      title: "Equipment",
      value: "87%",
      detail: "Average availability",
      percentage: 87,
      icon: Settings,
    },
    {
      title: "Workforce",
      value: "94%",
      detail: "Attendance rate",
      percentage: 94,
      icon: HardHat,
    },
    {
      title: "Inventory",
      value: "75%",
      detail: "Stock health",
      percentage: 75,
      icon: Boxes,
    },
    {
      title: "Fuel",
      value: "3,842 L",
      detail: "Consumption",
      percentage: 78,
      icon: Droplets,
    },
    {
      title: "Safety",
      value: "92%",
      detail: "Safety compliance",
      percentage: 92,
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <div className="flex items-center gap-2">
          <Settings
            size={20}
            className="text-[#d8a83e]"
          />

          <h2 className="text-lg font-bold text-[#10251f]">
            Mine Operations Summary
          </h2>
        </div>

        <p className="mt-1 text-sm text-slate-400">
          Cross-functional operational indicators for the{" "}
          {period.toLowerCase()} reporting period.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-100 p-5 transition hover:border-slate-200 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#10251f]">
                    <Icon size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#10251f]">
                      {item.title}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      {item.detail}
                    </p>
                  </div>
                </div>

                <span className="text-sm font-bold text-[#10251f]">
                  {item.percentage}%
                </span>
              </div>

              <p className="mt-5 text-xl font-bold text-[#10251f]">
                {item.value}
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#10251f]"
                  style={{
                    width: `${item.percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ReportsOperationalSummary;