import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type KPICardProps = {
  title: string;
  value: string | number;
  change?: string;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
};

function KPICard({
  title,
  value,
  change,
  description,
  icon: Icon,
  trend = "neutral",
}: KPICardProps) {
  const trendStyles = {
    up: "bg-emerald-50 text-emerald-700",
    down: "bg-red-50 text-red-700",
    neutral: "bg-slate-100 text-slate-600",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        {/* Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10251f]/8 text-[#10251f]">
          <Icon size={21} strokeWidth={2} />
        </div>

        {/* Trend */}
        {change && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${trendStyles[trend]}`}
          >
            {trend === "up" && <ArrowUpRight size={13} />}
            {trend === "down" && <ArrowDownRight size={13} />}

            {change}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>

          {description && (
            <span className="text-xs text-slate-400">
              {description}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default KPICard;