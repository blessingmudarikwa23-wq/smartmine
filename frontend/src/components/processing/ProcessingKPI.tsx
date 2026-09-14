import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ProcessingKPIProps = {
  title: string;
  value: string;
  description: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
};

export default function ProcessingKPI({
  title,
  value,
  description,
  change,
  trend,
  icon: Icon,
}: ProcessingKPIProps) {
  const TrendIcon =
    trend === "up"
      ? ArrowUpRight
      : trend === "down"
        ? ArrowDownRight
        : Minus;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10251f]/8 text-[#10251f]">
          <Icon size={20} strokeWidth={2} />
        </div>

        <div
          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${
            trend === "down"
              ? "bg-red-50 text-red-600"
              : trend === "neutral"
                ? "bg-slate-100 text-slate-500"
                : "bg-emerald-50 text-emerald-600"
          }`}
        >
          <TrendIcon size={13} />
          {change}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <p className="mt-1 text-2xl font-bold tracking-tight text-[#10251f]">
          {value}
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}