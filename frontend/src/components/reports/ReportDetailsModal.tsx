import {
  CalendarDays,
  CheckCircle2,
  FileBarChart,
  FileText,
  X,
} from "lucide-react";

import type { MineReport } from "../../pages/Reports";

type ReportDetailsModalProps = {
  report: MineReport | null;
  onClose: () => void;
};

function ReportDetailsModal({
  report,
  onClose,
}: ReportDetailsModalProps) {
  if (!report) {
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8a83e] text-[#10251f]">
              <FileBarChart size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#10251f]">
                Report Details
              </h2>

              <p className="text-xs text-slate-400">
                Mine reporting centre
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close report details"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Report Summary */}
          <div className="rounded-2xl bg-[#10251f] p-6 text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#d8a83e]">
              <FileText size={12} />
              {report.category}
            </span>

            <h3 className="mt-4 text-2xl font-bold">
              {report.name}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              {report.summary}
            </p>
          </div>

          {/* Report Information */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <CalendarDays
                size={18}
                className="text-[#d8a83e]"
              />

              <p className="mt-3 text-xs text-slate-400">
                Reporting Period
              </p>

              <p className="mt-1 text-sm font-bold text-[#10251f]">
                {report.period}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <FileText
                size={18}
                className="text-[#d8a83e]"
              />

              <p className="mt-3 text-xs text-slate-400">
                Records
              </p>

              <p className="mt-1 text-sm font-bold text-[#10251f]">
                {report.records.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <CheckCircle2
                size={18}
                className="text-emerald-600"
              />

              <p className="mt-3 text-xs text-slate-400">
                Status
              </p>

              <p className="mt-1 text-sm font-bold text-[#10251f]">
                {report.status}
              </p>
            </div>
          </div>

          {/* Report Contents */}
          <div className="mt-6 rounded-xl border border-slate-100 p-5">
            <h4 className="text-sm font-bold text-[#10251f]">
              Report Contents
            </h4>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Executive performance summary",
                "Production and processing metrics",
                "Equipment performance",
                "Workforce activity",
                "Inventory and fuel position",
                "Safety performance",
                "Financial indicators",
                "Sales and settlement activity",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 p-3"
                >
                  <CheckCircle2
                    size={15}
                    className="shrink-0 text-emerald-600"
                  />

                  <span className="text-xs font-medium text-slate-600">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#10251f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#16352d]"
            >
              <FileText size={16} />
              Print Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportDetailsModal;