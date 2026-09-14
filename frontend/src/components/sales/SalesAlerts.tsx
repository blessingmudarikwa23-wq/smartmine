import {
  AlertTriangle,
  Clock3,
  CircleAlert,
  WalletCards,
} from "lucide-react";

import type { SalesTransaction } from "../../pages/Sales";

type SalesAlertsProps = {
  sales: SalesTransaction[];
};

function formatCurrency(value: number) {
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function SalesAlerts({ sales }: SalesAlertsProps) {
  const overdue = sales.filter(
    (sale) => sale.status === "Overdue",
  );

  const pending = sales.filter(
    (sale) => sale.status === "Pending",
  );

  const highValue = sales.filter(
    (sale) =>
      sale.status === "Completed" && sale.amount >= 60000,
  );

  const alerts = [
    ...overdue.map((sale) => ({
      icon: CircleAlert,
      title: "Overdue settlement",
      description: `${sale.buyer} — ${sale.reference}`,
      value: formatCurrency(sale.amount),
      level: "critical",
    })),

    ...pending.map((sale) => ({
      icon: Clock3,
      title: "Payment pending",
      description: `${sale.buyer} — ${sale.product}`,
      value: formatCurrency(sale.amount),
      level: "warning",
    })),

    ...highValue.map((sale) => ({
      icon: WalletCards,
      title: "High-value sale",
      description: `${sale.buyer} — ${sale.product}`,
      value: formatCurrency(sale.amount),
      level: "info",
    })),
  ].slice(0, 4);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <AlertTriangle size={20} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#10251f]">
            Sales Alerts
          </h2>

          <p className="text-sm text-slate-400">
            Sales and settlement items requiring attention.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {alerts.map((alert, index) => {
          const Icon = alert.icon;

          const styles =
            alert.level === "critical"
              ? "border-red-100 bg-red-50/50 text-red-700"
              : alert.level === "warning"
                ? "border-amber-100 bg-amber-50/50 text-amber-700"
                : "border-slate-200 bg-slate-50 text-[#10251f]";

          return (
            <div
              key={`${alert.title}-${index}`}
              className={`flex items-center justify-between gap-4 rounded-xl border p-4 ${styles}`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <Icon size={19} className="shrink-0" />

                <div className="min-w-0">
                  <p className="text-sm font-bold">
                    {alert.title}
                  </p>

                  <p className="mt-1 truncate text-xs opacity-70">
                    {alert.description}
                  </p>
                </div>
              </div>

              <span className="shrink-0 text-sm font-bold">
                {alert.value}
              </span>
            </div>
          );
        })}

        {alerts.length === 0 && (
          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-5 text-sm font-semibold text-emerald-700 lg:col-span-2">
            <CircleAlert size={18} />
            No sales alerts require attention.
          </div>
        )}
      </div>
    </section>
  );
}

export default SalesAlerts;