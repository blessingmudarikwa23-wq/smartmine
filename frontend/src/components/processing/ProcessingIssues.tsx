import {
  AlertTriangle,
  Clock3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ProcessingIssue = {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  duration: string;
  icon: LucideIcon;
};

type ProcessingIssuesProps = {
  issues: ProcessingIssue[];
};

export default function ProcessingIssues({
  issues,
}: ProcessingIssuesProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#10251f]">
            Processing Issues
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current problems requiring attention.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
          <AlertTriangle size={15} />
          {issues.length} Active Issues
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {issues.map((issue) => {
          const Icon = issue.icon;

          const priorityClasses =
            issue.priority === "High"
              ? "bg-red-50 text-red-600"
              : issue.priority === "Medium"
                ? "bg-amber-50 text-amber-700"
                : "bg-slate-100 text-slate-600";

          return (
            <div
              key={issue.id}
              className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f]/8 text-[#10251f]">
                  <Icon size={18} />
                </div>

                <span
                  className={`rounded-lg px-2 py-1 text-[11px] font-semibold ${priorityClasses}`}
                >
                  {issue.priority}
                </span>
              </div>

              <h3 className="mt-4 text-sm font-bold text-[#10251f]">
                {issue.title}
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                {issue.description}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs font-medium text-slate-400">
                  {issue.category}
                </span>

                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <Clock3 size={13} />
                  {issue.duration}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}