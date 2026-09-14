import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type InventoryKPIProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend: string;
  trendLabel: string;
  trendType: "up" | "down";
};

function InventoryKPI({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendLabel,
  trendType,
}: InventoryKPIProps) {
  const isPositive = trendType === "up";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-[#10251f] sm:text-3xl">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10251f]/6 text-[#10251f]">
          <Icon size={21} strokeWidth={2} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ${
            isPositive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight size={13} />
          ) : (
            <ArrowDownRight size={13} />
          )}

          {trend}
        </span>

        <span className="text-xs text-slate-400">
          {trendLabel}
        </span>
      </div>
    </div>
  );
}

export default InventoryKPI;