import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

type EquipmentKPIProps = {
  title: string;
  value: string;
  description: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
};

export default function EquipmentKPI({
  title,
  value,
  description,
  change,
  trend,
  icon: Icon,
}: EquipmentKPIProps) {
  const trendIcon =
    trend === "up" ? (
      <ArrowUpRight size={14} />
    ) : trend === "down" ? (
      <ArrowDownRight size={14} />
    ) : (
      <Minus size={14} />
    );

  const trendClass =
    trend === "up"
      ? "text-emerald-600 bg-emerald-50"
      : trend === "down"
        ? "text-red-600 bg-red-50"
        : "text-slate-500 bg-slate-100";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-xl bg-[#10251f]/5 p-2.5">
          <Icon size={20} className="text-[#10251f]" />
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${trendClass}`}
        >
          {trendIcon}
          {change}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <p className="mt-1 text-3xl font-bold tracking-tight text-[#10251f]">
          {value}
        </p>

        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
}