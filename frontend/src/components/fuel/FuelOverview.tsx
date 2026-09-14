import { Activity, ArrowDownRight, Fuel as FuelIcon } from "lucide-react";

import type {
  FuelRecord,
  FuelTank,
} from "../../pages/Fuel";

type FuelOverviewProps = {
  tanks: FuelTank[];
  records: FuelRecord[];
  dailyTarget: number;
};

function FuelOverview({
  tanks,
  records,
  dailyTarget,
}: FuelOverviewProps) {
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-ZA").format(Math.round(value));

  const totalCapacity = tanks.reduce(
    (sum, tank) => sum + tank.capacity,
    0,
  );

  const totalFuel = tanks.reduce(
    (sum, tank) => sum + tank.currentLevel,
    0,
  );

  const utilization =
    totalCapacity > 0 ? (totalFuel / totalCapacity) * 100 : 0;

  const today = new Date().toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const todayConsumption = records
    .filter(
      (record) =>
        record.date === today && record.type === "Consumption",
    )
    .reduce((sum, record) => sum + record.quantity, 0);

  const progress = Math.min(
    100,
    (todayConsumption / dailyTarget) * 100,
  );

  const weeklyData = [
    { day: "Mon", value: 980 },
    { day: "Tue", value: 1160 },
    { day: "Wed", value: 1240 },
    { day: "Thu", value: 1080 },
    { day: "Fri", value: 1320 },
    { day: "Sat", value: 940 },
    { day: "Sun", value: 760 },
  ];

  const maxValue = Math.max(...weeklyData.map((item) => item.value));

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10251f]/8 text-[#10251f]">
                <Activity size={18} />
              </div>

              <div>
                <h2 className="font-bold text-[#10251f]">
                  Fuel Consumption
                </h2>
                <p className="text-xs text-slate-400">
                  Weekly operating trend
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700">
              Today
            </p>
            <p className="text-sm font-bold text-amber-900">
              {formatNumber(todayConsumption)} L
            </p>
          </div>
        </div>

        <div className="mt-7 h-56">
          <svg
            viewBox="0 0 700 220"
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="fuelArea"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#d8a83e" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#d8a83e" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[30, 75, 120, 165, 210].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="700"
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            ))}

            <path
              d={`M 0 190 ${weeklyData
                .map((item, index) => {
                  const x = index * 116.6;
                  const y =
                    190 - (item.value / maxValue) * 145;
                  return `L ${x} ${y}`;
                })
                .join(" ")} L 700 190 Z`}
              fill="url(#fuelArea)"
            />

            <path
              d={`M 0 190 ${weeklyData
                .map((item, index) => {
                  const x = index * 116.6;
                  const y =
                    190 - (item.value / maxValue) * 145;
                  return `L ${x} ${y}`;
                })
                .join(" ")}`}
              fill="none"
              stroke="#10251f"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {weeklyData.map((item, index) => {
              const x = index * 116.6;
              const y =
                190 - (item.value / maxValue) * 145;

              return (
                <circle
                  key={item.day}
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#d8a83e"
                  stroke="white"
                  strokeWidth="3"
                />
              );
            })}
          </svg>

          <div className="mt-1 flex justify-between">
            {weeklyData.map((item) => (
              <span
                key={item.day}
                className="text-[11px] font-medium text-slate-400"
              >
                {item.day}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d8a83e]/15 text-[#9a741f]">
                <FuelIcon size={18} />
              </div>

              <div>
                <h2 className="font-bold text-[#10251f]">
                  Daily Fuel Target
                </h2>
                <p className="text-xs text-slate-400">
                  Consumption performance
                </p>
              </div>
            </div>
          </div>

          <ArrowDownRight
            size={20}
            className="text-emerald-600"
          />
        </div>

        <div className="mt-7">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-[#10251f]">
                {formatNumber(todayConsumption)} L
              </p>
              <p className="mt-1 text-xs text-slate-400">
                of {formatNumber(dailyTarget)} L daily target
              </p>
            </div>

            <p className="text-sm font-bold text-[#10251f]">
              {Math.round(progress)}%
            </p>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#d8a83e] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Storage utilization
            </span>

            <span className="text-sm font-bold text-[#10251f]">
              {utilization.toFixed(1)}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#10251f]"
              style={{ width: `${utilization}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-400">
            <span>{formatNumber(totalFuel)} L available</span>
            <span>{formatNumber(totalCapacity)} L capacity</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FuelOverview;