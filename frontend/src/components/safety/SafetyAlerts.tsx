import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

import type { SafetyIncident } from "../../pages/Safety";

type SafetyAlertsProps = {
  incidents: SafetyIncident[];
};

function SafetyAlerts({
  incidents,
}: SafetyAlertsProps) {
  const critical = incidents.filter(
    (incident) =>
      incident.severity === "Critical",
  );

  const highRisk = incidents.filter(
    (incident) =>
      incident.severity === "High" &&
      incident.status !== "Resolved",
  );

  const openIncidents = incidents.filter(
    (incident) => incident.status === "Open",
  );

  const alerts = [];

  if (critical.length > 0) {
    alerts.push({
      id: "critical",
      title: "Critical safety event",
      description: `${critical.length} critical incident${
        critical.length > 1 ? "s" : ""
      } require immediate management attention.`,
      type: "critical",
    });
  }

  if (highRisk.length > 0) {
    alerts.push({
      id: "high-risk",
      title: "High-risk events require follow-up",
      description: `${highRisk.length} high-severity event${
        highRisk.length > 1 ? "s are" : " is"
      } still open or under investigation.`,
      type: "warning",
    });
  }

  if (openIncidents.length > 0) {
    alerts.push({
      id: "open",
      title: "Corrective actions pending",
      description: `${openIncidents.length} incident${
        openIncidents.length > 1 ? "s remain" : " remains"
      } open in the safety register.`,
      type: "warning",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "healthy",
      title: "Safety register is under control",
      description:
        "There are currently no high-priority safety alerts requiring immediate attention.",
      type: "success",
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f]/8 text-[#10251f]">
            <ShieldAlert size={19} />
          </div>

          <div>
            <h2 className="font-bold text-[#10251f]">
              Safety Alerts
            </h2>

            <p className="text-xs text-slate-400">
              Issues requiring attention
            </p>
          </div>
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
          {alerts.length} Active
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {alerts.map((alert) => {
          const isCritical =
            alert.type === "critical";

          const isSuccess =
            alert.type === "success";

          return (
            <div
              key={alert.id}
              className={`rounded-xl border p-4 ${
                isCritical
                  ? "border-red-100 bg-red-50/70"
                  : isSuccess
                    ? "border-emerald-100 bg-emerald-50/70"
                    : "border-amber-100 bg-amber-50/70"
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    isCritical
                      ? "bg-red-100 text-red-600"
                      : isSuccess
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {isCritical ? (
                    <AlertTriangle size={17} />
                  ) : isSuccess ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <ShieldAlert size={17} />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#10251f]">
                    {alert.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {alert.description}
                  </p>

                  {!isSuccess && (
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#10251f] transition hover:text-[#d8a83e]"
                    >
                      Review
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SafetyAlerts;