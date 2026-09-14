import type { LucideIcon } from "lucide-react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

type OperationsKPIProps = {
  title: string;
  value: string;
  description: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
};

function OperationsKPI({
  title,
  value,
  description,
  change,
  trend,
  icon: Icon,
}: OperationsKPIProps) {
  const trendStyles = {
    up: {
      wrapper: "bg-emerald-50 text-emerald-700",
      icon: ArrowUpRight,
    },
    down: {
      wrapper: "bg-rose-50 text-rose-700",
      icon: ArrowDownRight,
    },
    neutral: {
      wrapper: "bg-slate-100 text-slate-600",
      icon: Minus,
    },
  };

  const TrendIcon = trendStyles[trend].icon;

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10251f] text-[#d8a83e] transition group-hover:bg-[#18372e]">
          <Icon size={20} strokeWidth={2} />
        </div>

        <div
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${trendStyles[trend].wrapper}`}
        >
          <TrendIcon size={13} strokeWidth={2.5} />
          {change}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

export default OperationsKPI;