import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

type IntelligenceKPIProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend: string;
  positive?: boolean;
  warning?: boolean;
};

function IntelligenceKPI({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  positive,
  warning,
}: IntelligenceKPIProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-[#10251f]">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#10251f]">
          <Icon size={21} />
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
            <CheckCircle2 size={12} />
          ) : (
            <ArrowUpRight size={12} />
          )}

          {trend}
        </span>

        <span className="text-[11px] text-slate-400">
          vs previous period
        </span>
      </div>
    </div>
  );
}

export default IntelligenceKPI;