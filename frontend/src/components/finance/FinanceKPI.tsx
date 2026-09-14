import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, AlertTriangle } from "lucide-react";

type FinanceKPIProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend: string;
  trendLabel: string;
  positive?: boolean;
  warning?: boolean;
};

function FinanceKPI({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  positive = false,
  warning = false,
}: FinanceKPIProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#10251f]">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#10251f]">
          <Icon size={21} strokeWidth={2} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
            warning
              ? "bg-amber-50 text-amber-700"
              : positive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-600"
          }`}
        >
          {warning ? (
            <AlertTriangle size={12} />
          ) : positive ? (
            <ArrowUpRight size={12} />
          ) : (
            <ArrowDownRight size={12} />
          )}

          {trend}
        </span>

        <span className="text-[11px] text-slate-400">{trendLabel}</span>
      </div>
    </div>
  );
}

export default FinanceKPI;