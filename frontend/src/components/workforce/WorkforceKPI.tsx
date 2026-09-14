import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

type WorkforceKPIProps = {
  title: string;
  value: string;
  description: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
};

function WorkforceKPI({
  title,
  value,
  description,
  change,
  trend,
  icon: Icon,
}: WorkforceKPIProps) {
  const trendClasses =
    trend === "up"
      ? "bg-emerald-50 text-emerald-700"
      : trend === "down"
        ? "bg-red-50 text-red-700"
        : "bg-slate-100 text-slate-600";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10251f]/[0.07] text-[#10251f]">
          <Icon size={21} strokeWidth={2} />
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${trendClasses}`}
        >
          {trend === "up" ? (
            <ArrowUpRight size={13} />
          ) : trend === "down" ? (
            <ArrowDownRight size={13} />
          ) : (
            <Minus size={13} />
          )}

          {change}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </article>
  );
}

export default WorkforceKPI;