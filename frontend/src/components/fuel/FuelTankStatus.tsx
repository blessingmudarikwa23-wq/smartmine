import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
} from "lucide-react";

import type { FuelTank } from "../../pages/Fuel";

type FuelTankStatusProps = {
  tanks: FuelTank[];
};

function FuelTankStatus({ tanks }: FuelTankStatusProps) {
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-ZA").format(Math.round(value));

  const getPercentage = (tank: FuelTank) =>
    Math.min(
      100,
      Math.max(0, (tank.currentLevel / tank.capacity) * 100),
    );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-[#10251f]">
            Fuel Tank Status
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Current stock levels and replenishment thresholds
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Droplets size={15} />
          {tanks.length} storage points
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tanks.map((tank) => {
          const Icon = tank.icon;
          const percentage = getPercentage(tank);

          const statusStyles = {
            Healthy: "bg-emerald-50 text-emerald-700",
            Low: "bg-amber-50 text-amber-700",
            Critical: "bg-red-50 text-red-700",
          };

          return (
            <div
              key={tank.id}
              className="rounded-2xl border border-slate-200 p-4 transition hover:border-[#d8a83e]/50 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f]/8 text-[#10251f]">
                  <Icon size={19} />
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyles[tank.status]}`}
                >
                  {tank.status === "Healthy" ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    <AlertTriangle size={12} />
                  )}
                  {tank.status}
                </span>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-[#10251f]">
                  {tank.name}
                </h3>

                <p className="mt-0.5 text-xs text-slate-400">
                  {tank.location} · {tank.fuelType}
                </p>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold text-[#10251f]">
                    {formatNumber(tank.currentLevel)} L
                  </p>

                  <p className="text-[11px] text-slate-400">
                    of {formatNumber(tank.capacity)} L
                  </p>
                </div>

                <span className="text-sm font-bold text-slate-500">
                  {percentage.toFixed(0)}%
                </span>
              </div>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all ${
                    tank.status === "Critical"
                      ? "bg-red-500"
                      : tank.status === "Low"
                        ? "bg-amber-500"
                        : "bg-[#d8a83e]"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">
                  Minimum: {formatNumber(tank.minimumLevel)} L
                </span>

                <span className="font-semibold text-slate-500">
                  R{tank.unitCost.toFixed(2)}/L
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FuelTankStatus;