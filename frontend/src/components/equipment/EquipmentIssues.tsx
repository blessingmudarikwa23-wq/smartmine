import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowUpRight,
  Clock3,
  X,
} from "lucide-react";

type EquipmentIssue = {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  duration: string;
  equipment: string;
  icon: LucideIcon;
};

type EquipmentIssuesProps = {
  issues: EquipmentIssue[];
};

export default function EquipmentIssues({
  issues,
}: EquipmentIssuesProps) {
  const [showAllIssues, setShowAllIssues] = useState(false);
  const [selectedIssue, setSelectedIssue] =
    useState<EquipmentIssue | null>(null);

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Equipment attention
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#10251f]">
              Active Issues
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current equipment problems requiring monitoring or action.
            </p>
          </div>

          <div className="rounded-xl bg-red-50 p-2.5">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {issues.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <AlertTriangle
                size={24}
                className="mx-auto text-slate-300"
              />

              <p className="mt-2 text-sm font-semibold text-slate-600">
                No active equipment issues
              </p>

              <p className="mt-1 text-xs text-slate-400">
                All equipment is currently operating without reported issues.
              </p>
            </div>
          ) : (
            issues.map((issue) => {
              const Icon = issue.icon;
              const highPriority = issue.priority === "High";

              return (
                <div
                  key={issue.id}
                  className="rounded-xl border border-slate-100 p-4 transition hover:border-slate-200 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-lg p-2.5 ${
                        highPriority
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <Icon size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">
                            {issue.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {issue.description}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            highPriority
                              ? "bg-red-50 text-red-600"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {issue.priority}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="font-semibold text-[#10251f]">
                          {issue.equipment}
                        </span>

                        <span>•</span>

                        <span>{issue.category}</span>

                        {issue.duration !== "—" && (
                          <>
                            <span>•</span>

                            <span className="inline-flex items-center gap-1">
                              <Clock3 size={12} />
                              {issue.duration}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedIssue(issue)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#10251f]"
                      aria-label={`Open ${issue.title}`}
                    >
                      <ArrowUpRight size={17} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowAllIssues(true)}
          className="mt-5 w-full rounded-xl bg-[#10251f] py-2.5 text-sm font-semibold text-white transition hover:bg-[#17352c]"
        >
          View All Equipment Issues
        </button>
      </div>

      {showAllIssues && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Equipment attention
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#10251f]">
                  All Equipment Issues
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Complete list of equipment problems currently requiring
                  attention.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAllIssues(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close equipment issues"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              {issues.length === 0 ? (
                <div className="py-10 text-center">
                  <AlertTriangle
                    size={30}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 font-semibold text-slate-600">
                    No equipment issues available
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {issues.map((issue) => {
                    const Icon = issue.icon;
                    const highPriority = issue.priority === "High";

                    return (
                      <button
                        key={issue.id}
                        type="button"
                        onClick={() => setSelectedIssue(issue)}
                        className="text-left rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={`rounded-lg p-2.5 ${
                              highPriority
                                ? "bg-red-50 text-red-600"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            <Icon size={18} />
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                              highPriority
                                ? "bg-red-50 text-red-600"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {issue.priority}
                          </span>
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-800">
                          {issue.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {issue.description}
                        </p>

                        <div className="mt-4 space-y-2 text-xs">
                          <p className="font-semibold text-[#10251f]">
                            {issue.equipment}
                          </p>

                          <p className="text-slate-400">
                            {issue.category}
                          </p>

                          {issue.duration !== "—" && (
                            <p className="inline-flex items-center gap-1.5 text-slate-400">
                              <Clock3 size={12} />
                              {issue.duration}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowAllIssues(false)}
                className="w-full rounded-xl bg-[#10251f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17352c]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedIssue && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-start gap-3">
                <div
                  className={`rounded-lg p-2.5 ${
                    selectedIssue.priority === "High"
                      ? "bg-red-50 text-red-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  <selectedIssue.icon size={20} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Issue details
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-[#10251f]">
                    {selectedIssue.title}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close issue details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Description
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedIssue.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Equipment</p>
                  <p className="mt-1 text-sm font-semibold text-[#10251f]">
                    {selectedIssue.equipment}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Category</p>
                  <p className="mt-1 text-sm font-semibold text-[#10251f]">
                    {selectedIssue.category}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Priority</p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      selectedIssue.priority === "High"
                        ? "text-red-600"
                        : "text-amber-600"
                    }`}
                  >
                    {selectedIssue.priority}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Duration</p>
                  <p className="mt-1 text-sm font-semibold text-[#10251f]">
                    {selectedIssue.duration}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                className="w-full rounded-xl bg-[#10251f] py-2.5 text-sm font-semibold text-white transition hover:bg-[#17352c]"
              >
                Close Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}