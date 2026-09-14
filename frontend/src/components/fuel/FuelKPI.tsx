import {
  Droplets,
  Gauge,
  ReceiptText,
  TrendingDown,
} from "lucide-react";

type FuelKPIProps = {
  totalFuel: number;
  todayConsumption: number;
  todaySpend: number;
  averageCost: number;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-ZA").format(Math.round(value));

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);

function FuelKPI({
  totalFuel,
  todayConsumption,
  todaySpend,
  averageCost,
}: FuelKPIProps) {
  const cards = [
    {
      title: "Fuel on Hand",
      value: `${formatNumber(totalFuel)} L`,
      subtitle: "Across all storage tanks",
      icon: Droplets,
      trend: "Stock available",
      trendUp: true,
    },
    {
      title: "Consumption Today",
      value: `${formatNumber(todayConsumption)} L`,
      subtitle: "Diesel & petrol usage",
      icon: TrendingDown,
      trend: "Daily operating usage",
      trendUp: false,
    },
    {
      title: "Fuel Spend Today",
      value: formatCurrency(todaySpend),
      subtitle: "Recorded consumption",
      icon: ReceiptText,
      trend: "Operating cost",
      trendUp: false,
    },
    {
      title: "Average Cost / L",
      value: `R${averageCost.toFixed(2)}`,
      subtitle: "Current diesel average",
      icon: Gauge,
      trend: "Current rate",
      trendUp: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10251f]/8 text-[#10251f]">
                <Icon size={21} />
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  card.trendUp
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {card.trend}
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              {card.title}
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight text-[#10251f]">
              {card.value}
            </p>

            <p className="mt-1 text-xs text-slate-400">{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}

export default FuelKPI;