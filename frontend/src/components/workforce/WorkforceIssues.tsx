import React, { useMemo } from "react";
import { AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import type { Worker } from "../services/workforceApi";

export interface WorkforceIssueItem {
  id: string;
  type: string;
  message: string;
  severity: "high" | "medium" | "low";
}

interface WorkforceIssuesProps {
  issues?: WorkforceIssueItem[];
  workers?: Worker[];
}

export default function WorkforceIssues({
  issues,
  workers = [],
}: WorkforceIssuesProps) {
  const activeIssues = useMemo(() => {
    if (issues) return issues;

    const generated: WorkforceIssueItem[] = [];

    for (const worker of workers) {
      if (worker.status === "Absent") {
        generated.push({
          id: `absent-${worker.id}`,
          type: "Absence",
          message: `${worker.name} (${worker.role}) is marked Absent today.`,
          severity: "high",
        });
      }

      if (worker.status === "Late") {
        generated.push({
          id: `late-${worker.id}`,
          type: "Late Arrival",
          message: `${worker.name} arrived late for shift.`,
          severity: "medium",
        });
      }

      if (worker.safetyStatus === "Training Due") {
        generated.push({
          id: `safety-${worker.id}`,
          type: "Safety Compliance",
          message: `${worker.name} has pending safety training due.`,
          severity: "high",
        });
      }
    }

    return generated;
  }, [issues, workers]);

  if (activeIssues.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
          <CheckCircle size={20} />
          <h3 className="text-base font-bold">No Active Workforce Issues</h3>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          All safety compliances and shift coverages are operating within normal parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-amber-500" size={20} />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Attention Required ({activeIssues.length})
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        {activeIssues.map((issue) => (
          <div
            key={issue.id}
            className={`flex items-start gap-3 rounded-xl border p-3.5 ${
              issue.severity === "high"
                ? "border-red-200 bg-red-50/50 text-red-900 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-200"
                : "border-amber-200 bg-amber-50/50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200"
            }`}
          >
            <AlertTriangle className="mt-0.5 shrink-0" size={18} />
            <div className="text-sm">
              <span className="font-semibold">{issue.type}: </span>
              {issue.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}