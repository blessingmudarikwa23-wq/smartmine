import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Factory,
  Fuel,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

import type {
  IntelligenceInsight,
} from "../../pages/SmartIntelligence";

type IntelligenceInsightsProps = {
  insights: IntelligenceInsight[];
  activeFocus: string;
};

function getIcon(category: IntelligenceInsight["category"]) {
  switch (category) {
    case "Production":
      return Factory;

    case "Equipment":
      return Truck;

    case "Fuel":
      return Fuel;

    case "Safety":
      return ShieldCheck;

    case "Inventory":
      return Package;

    case "Finance":
      return CircleDollarSign;

    default:
      return Factory;
  }
}

function getSeverityStyle(
  severity: IntelligenceInsight["severity"],
) {
  switch (severity) {
    case "High":
      return "bg-red-50 text-red-700";

    case "Medium":
      return "bg-amber-50 text-amber-700";

    default:
      return "bg-emerald-50 text-emerald-700";
  }
}

function IntelligenceInsights({
  insights,
  activeFocus,
}: IntelligenceInsightsProps) {
  const visibleInsights =
    activeFocus === "Overall Mine"
      ? insights
      : insights.filter(
          (insight) => insight.category === activeFocus,
        );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <SparklesIcon />

            <h2 className="text-lg font-bold text-[#10251f]">
              AI-Detected Insights
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-400">
            Issues and opportunities identified across{" "}
            {activeFocus.toLowerCase()}.
          </p>
        </div>

        <span className="rounded-full bg-[#10251f] px-3 py-1.5 text-[10px] font-bold text-white">
          {visibleInsights.length} insights
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {visibleInsights.map((insight) => {
          const Icon = getIcon(insight.category);

          return (
            <div
              key={insight.id}
              className="rounded-2xl border border-slate-100 p-5 transition hover:border-slate-200 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#10251f]">
                    <Icon size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#10251f]">
                      {insight.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {insight.category}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${getSeverityStyle(
                    insight.severity,
                  )}`}
                >
                  {insight.severity}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                {insight.description}
              </p>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Recommended Action
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  {insight.recommendation}
                </p>
              </div>

              <button
                type="button"
                className="mt-4 flex items-center gap-2 text-xs font-bold text-[#10251f] transition hover:text-[#d8a83e]"
              >
                Investigate Insight
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {visibleInsights.length === 0 && (
        <div className="rounded-2xl bg-slate-50 p-10 text-center">
          <CheckCircle2
            size={30}
            className="mx-auto text-emerald-500"
          />

          <p className="mt-3 text-sm font-bold text-[#10251f]">
            No critical insights detected
          </p>

          <p className="mt-1 text-xs text-slate-400">
            SmartMine currently has no insights for this
            focus area.
          </p>
        </div>
      )}
    </section>
  );
}

function SparklesIcon() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d8a83e]/15 text-[#b78620]">
      <AlertTriangle size={17} />
    </div>
  );
}

export default IntelligenceInsights;