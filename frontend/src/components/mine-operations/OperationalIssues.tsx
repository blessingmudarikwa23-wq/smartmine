import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  Clock3,
} from "lucide-react";

type OperationalIssue = {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  duration: string;
  icon: LucideIcon;
};

type OperationalIssuesProps = {
  issues: OperationalIssue[];
};

function OperationalIssues({
  issues,
}: OperationalIssuesProps) {
  const priorityStyles: Record<string, string> = {
    High: "bg-rose-50 text-rose-700 border-rose-100",
    Medium: "bg-amber-50 text-amber-700 border-amber-100",
    Low: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle size={19} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Operational Issues
              </h2>

              <p className="text-sm text-slate-500">
                Items requiring attention
              </p>
            </div>
          </div>
        </div>

        <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700">
          {issues.length} Active
        </span>
      </div>

      {/* ISSUES */}
      <div className="mt-5 space-y-3">
        {issues.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm font-semibold text-slate-700">
              No active operational issues
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Mine operations are currently running normally.
            </p>
          </div>
        ) : (
          issues.map((issue) => {
            const IssueIcon = issue.icon;

            return (
              <div
                key={issue.id}
                className="group rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <IssueIcon size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          {issue.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {issue.description}
                        </p>
                      </div>

                      <span
                        className={`w-fit shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold ${priorityStyles[issue.priority] ?? priorityStyles.Low}`}
                      >
                        {issue.priority}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-400">
                      <span>{issue.category}</span>

                      <span className="h-1 w-1 rounded-full bg-slate-300" />

                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={12} />
                        {issue.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER */}
      <button
        type="button"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-[#d8a83e] hover:text-[#10251f]"
      >
        View All Operational Issues
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

export default OperationalIssues;