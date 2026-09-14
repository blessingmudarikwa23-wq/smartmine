import {
  AlertTriangle,
  ArrowRight,
  CircleCheck,
  Fuel as FuelIcon,
  TrendingUp,
} from "lucide-react";

import type { FuelTank } from "../../pages/Fuel";

type FuelAlertsProps = {
  tanks: FuelTank[];
  todayConsumption: number;
  dailyTarget: number;
  averageCost: number;
};

function FuelAlerts({
  tanks,
  todayConsumption,
  dailyTarget,
  averageCost,
}: FuelAlertsProps) {
  const lowTanks = tanks.filter(
    (tank) => tank.status !== "Healthy",
  );

  const consumptionExceeded = todayConsumption > dailyTarget;

  const alerts = [];

  lowTanks.forEach((tank) => {
    alerts.push({
      id: `tank-${tank.id}`,
      type: tank.status === "Critical" ? "critical" : "warning",
      icon: AlertTriangle,
      title: `${tank.name} requires attention`,
      description: `${tank.currentLevel.toLocaleString(
        "en-ZA",
      )} L remaining. Minimum level is ${tank.minimumLevel.toLocaleString(
        "en-ZA",
      )} L.`,
    });
  });

  if (consumptionExceeded) {
    alerts.push({
      id: "consumption",
      type: "warning",
      icon: TrendingUp,
      title: "Daily consumption above target",
      description: `Fuel usage is ${(
        todayConsumption - dailyTarget
      ).toLocaleString("en-ZA")} L above today's operating target.`,
    });
  }

  if (averageCost > 25) {
    alerts.push({
      id: "price",
      type: "warning",
      icon: FuelIcon,
      title: "Fuel price requires review",
      description: `Average diesel cost is currently R${averageCost.toFixed(
        2,
      )} per litre.`,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "healthy",
      type: "success",
      icon: CircleCheck,
      title: "Fuel operations are healthy",
      description:
        "No stock, consumption or pricing alerts require immediate attention.",
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-[#10251f]">
            Fuel Alerts
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Operational attention points
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
          {alerts.length} Active
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {alerts.map((alert) => {
          const Icon = alert.icon;

          return (
            <div
              key={alert.id}
              className={`rounded-xl border p-4 ${
                alert.type === "critical"
                  ? "border-red-100 bg-red-50/70"
                  : alert.type === "warning"
                    ? "border-amber-100 bg-amber-50/70"
                    : "border-emerald-100 bg-emerald-50/70"
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    alert.type === "critical"
                      ? "bg-red-100 text-red-600"
                      : alert.type === "warning"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  <Icon size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#10251f]">
                    {alert.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {alert.description}
                  </p>

                  {alert.type !== "success" && (
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

export default FuelAlerts;