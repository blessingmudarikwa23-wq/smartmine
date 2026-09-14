import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import type { SafetyIncident } from "../../pages/Safety";

type SafetyOverviewProps = {
  incidents: SafetyIncident[];
};

function SafetyOverview({
  incidents,
}: SafetyOverviewProps) {
  const total = incidents.length;

  const resolved = incidents.filter(
    (incident) => incident.status === "Resolved",
  ).length;

  const underInvestigation = incidents.filter(
    (incident) =>
      incident.status === "Under Investigation",
  ).length;

  const nearMisses = incidents.filter(
    (incident) => incident.type === "Near Miss",
  ).length;

  const resolutionRate =
    total > 0 ? (resolved / total) * 100 : 0;

  const categories = [
    {
      label: "Equipment",
      value: incidents.filter(
        (incident) => incident.category === "Equipment",
      ).length,
    },
    {
      label: "PPE",
      value: incidents.filter(
        (incident) => incident.category === "PPE",
      ).length,
    },
    {
      label: "Vehicle",
      value: incidents.filter(
        (incident) => incident.category === "Vehicle",
      ).length,
    },
    {
      label: "Electrical",
      value: incidents.filter(
        (incident) => incident.category === "Electrical",
      ).length,
    },
    {
      label: "Environmental",
      value: incidents.filter(
        (incident) =>
          incident.type === "Environmental",
      ).length,
    },
  ];

  const maxCategory = Math.max(
    ...categories.map((category) => category.value),
    1,
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      {/* Safety trend */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f]/8 text-[#10251f]">
              <Activity size={19} />
            </div>

            <div>
              <h2 className="font-bold text-[#10251f]">
                Safety Performance
              </h2>

              <p className="text-xs text-slate-400">
                Incident activity across the operation
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">
              Resolution Rate
            </p>

            <p className="text-sm font-bold text-emerald-800">
              {resolutionRate.toFixed(0)}%
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-400">
              Total Events
            </p>

            <p className="mt-1 text-2xl font-bold text-[#10251f]">
              {total}
            </p>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-xs text-amber-600">
              Investigating
            </p>

            <p className="mt-1 text-2xl font-bold text-amber-800">
              {underInvestigation}
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-xs text-blue-600">
              Near Misses
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-800">
              {nearMisses}
            </p>
          </div>
        </div>

        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Incident categories
            </p>

            <p className="text-xs text-slate-400">
              Current records
            </p>
          </div>

          <div className="space-y-4">
            {categories.map((category) => {
              const width =
                (category.value / maxCategory) * 100;

              return (
                <div key={category.label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">
                      {category.label}
                    </span>

                    <span className="text-xs font-bold text-[#10251f]">
                      {category.value}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#d8a83e] transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Safety status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h2 className="font-bold text-[#10251f]">
              Site Safety Status
            </h2>

            <p className="text-xs text-slate-400">
              Current operational condition
            </p>
          </div>
        </div>

        <div className="mt-7 flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={24} />
          </div>

          <div>
            <p className="text-lg font-bold text-emerald-800">
              Operationally Stable
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-700/80">
              No active critical incidents are recorded in
              the current safety register.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle
                size={17}
                className="text-amber-500"
              />

              <span className="text-sm text-slate-600">
                High-risk events
              </span>
            </div>

            <span className="font-bold text-[#10251f]">
              {
                incidents.filter(
                  (incident) =>
                    incident.severity === "High" ||
                    incident.severity === "Critical",
                ).length
              }
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2
                size={17}
                className="text-emerald-600"
              />

              <span className="text-sm text-slate-600">
                Resolved events
              </span>
            </div>

            <span className="font-bold text-[#10251f]">
              {resolved}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SafetyOverview;