import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  FileText,
  Trash2,
} from "lucide-react";

import type { MineReport } from "../../pages/Reports";

type ReportsTableProps = {
  reports: MineReport[];
  onView: (report: MineReport) => void;
  onEdit: (report: MineReport) => void;
  onDelete: (report: MineReport) => void;
};

function getStatusStyle(status: MineReport["status"]) {
  switch (status) {
    case "Ready":
      return "bg-emerald-50 text-emerald-700";

    case "Pending":
      return "bg-amber-50 text-amber-700";

    case "Attention Required":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function ReportsTable({
  reports,
  onView,
  onEdit,
  onDelete,
}: ReportsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px]">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Report
            </th>

            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Category
            </th>

            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Period
            </th>

            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Generated
            </th>

            <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Records
            </th>

            <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Status
            </th>

            <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {reports.map((report) => (
            <tr
              key={report.id}
              className="border-b border-slate-100 transition hover:bg-slate-50/70"
            >
              {/* Report */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#10251f]">
                    <FileText size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="max-w-[320px] truncate text-sm font-bold text-[#10251f]">
                      {report.name}
                    </p>

                    <p className="mt-1 max-w-[360px] truncate text-[11px] text-slate-400">
                      {report.summary}
                    </p>
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-6 py-4">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {report.category}
                </span>
              </td>

              {/* Period */}
              <td className="px-6 py-4">
                <span className="text-sm font-semibold text-slate-600">
                  {report.period}
                </span>
              </td>

              {/* Generated */}
              <td className="px-6 py-4 text-sm text-slate-500">
                {report.generatedDate}
              </td>

              {/* Records */}
              <td className="px-6 py-4 text-center text-sm font-bold text-[#10251f]">
                {report.records.toLocaleString()}
              </td>

              {/* Status */}
              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${getStatusStyle(
                    report.status,
                  )}`}
                >
                  {report.status === "Ready" ? (
                    <CheckCircle2 size={12} />
                  ) : report.status === "Pending" ? (
                    <Clock3 size={12} />
                  ) : (
                    <AlertTriangle size={12} />
                  )}

                  {report.status}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  {/* View */}
                  <button
                    type="button"
                    onClick={() => onView(report)}
                    aria-label={`View ${report.name}`}
                    title="View report"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-[#10251f] transition hover:border-[#d8a83e] hover:bg-[#d8a83e]/10"
                  >
                    <Eye size={15} />
                    View
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => onEdit(report)}
                    aria-label={`Edit ${report.name}`}
                    title="Edit report"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-[#10251f] transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Edit3 size={15} />
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => onDelete(report)}
                    aria-label={`Delete ${report.name}`}
                    title="Delete report"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:border-red-200 hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {reports.length === 0 && (
        <div className="p-12 text-center">
          <FileText
            size={30}
            className="mx-auto text-slate-300"
          />

          <p className="mt-3 text-sm font-semibold text-slate-500">
            No reports found.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Try another period, category or search term.
          </p>
        </div>
      )}
    </div>
  );
}

export default ReportsTable;