import {
  AlertTriangle,
  ArrowRight,
  CircleAlert,
  ShieldAlert,
} from "lucide-react";

import type {
  IntelligenceInsight,
} from "../../pages/SmartIntelligence";

type IntelligenceAlertsProps = {
  insights: IntelligenceInsight[];
};

function IntelligenceAlerts({
  insights,
}: IntelligenceAlertsProps) {
  const highPriority = insights.filter(
    (item) => item.severity === "High",
  );

  const mediumPriority = insights.filter(
    (item) => item.severity === "Medium",
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <ShieldAlert size={19} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#10251f]">
              Intelligence Alerts
            </h2>

            <p className="text-xs text-slate-400">
              Priorities requiring attention
            </p>
          </div>
        </div>

        <span className="rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-bold text-red-700">
          {highPriority.length} high
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {highPriority.map((alert) => (
          <div
            key={alert.id}
            className="rounded-xl border border-red-100 bg-red-50/50 p-4"
          >
            <div className="flex gap-3">
              <CircleAlert
                size={17}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="text-xs font-bold text-red-800">
                  {alert.title}
                </p>

                <p className="mt-1 text-[11px] leading-5 text-red-700/70">
                  {alert.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {mediumPriority.slice(0, 2).map((alert) => (
          <div
            key={alert.id}
            className="rounded-xl border border-amber-100 bg-amber-50/50 p-4"
          >
            <div className="flex gap-3">
              <AlertTriangle
                size={17}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <div>
                <p className="text-xs font-bold text-amber-800">
                  {alert.title}
                </p>

                <p className="mt-1 text-[11px] leading-5 text-amber-700/70">
                  {alert.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-5 flex items-center gap-2 text-xs font-bold text-[#10251f] transition hover:text-[#d8a83e]"
      >
        View all intelligence alerts
        <ArrowRight size={14} />
      </button>
    </section>
  );
}

export default IntelligenceAlerts;