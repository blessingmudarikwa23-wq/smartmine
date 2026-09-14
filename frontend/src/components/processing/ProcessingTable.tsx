import {
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  XCircle,
  Pencil,
  Trash2,
} from "lucide-react";

type ProcessingRecord = {
  id: number;
  date: string;
  shift: string;
  materialReceived: number;
  crushed: number;
  processed: number;
  output: number;
  operatingHours: number;
  downtime: number;
  status: "Completed" | "In Progress" | "Delayed";
};

type ProcessingTableProps = {
  records: ProcessingRecord[];
  onEdit: (record: ProcessingRecord) => void;
  onDelete: (id: number) => void;
};

export default function ProcessingTable({
  records,
  onEdit,
  onDelete,
}: ProcessingTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-[#10251f]">
            Processing Records
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Recent crusher and grinding production records.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <MoreHorizontal size={16} />
          More
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1180px] w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Date
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Shift
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                Received
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                Crushed
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                Processed
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                Output
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                Operating
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                Downtime
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => {
              const statusClasses =
                record.status === "Completed"
                  ? "bg-emerald-50 text-emerald-700"
                  : record.status === "In Progress"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-red-50 text-red-700";

              return (
                <tr
                  key={record.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-5 py-4 text-sm font-semibold text-[#10251f]">
                    {record.date}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-500">
                    {record.shift}
                  </td>

                  <td className="px-5 py-4 text-right text-sm font-medium text-slate-700">
                    {record.materialReceived} t
                  </td>

                  <td className="px-5 py-4 text-right text-sm font-medium text-slate-700">
                    {record.crushed} t
                  </td>

                  <td className="px-5 py-4 text-right text-sm font-medium text-slate-700">
                    {record.processed} t
                  </td>

                  <td className="px-5 py-4 text-right text-sm font-bold text-[#10251f]">
                    {record.output.toFixed(1)} t
                  </td>

                  <td className="px-5 py-4 text-right text-sm text-slate-500">
                    {record.operatingHours.toFixed(1)} hrs
                  </td>

                  <td className="px-5 py-4 text-right text-sm text-slate-500">
                    {record.downtime.toFixed(1)} hrs
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses}`}
                    >
                      {record.status === "Completed" ? (
                        <CheckCircle2 size={13} />
                      ) : record.status === "In Progress" ? (
                        <Clock3 size={13} />
                      ) : (
                        <XCircle size={13} />
                      )}

                      {record.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(record)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#d8a83e] hover:bg-[#d8a83e]/10 hover:text-[#10251f]"
                        aria-label={`Edit processing record ${record.id}`}
                        title="Edit record"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(record.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete processing record ${record.id}`}
                        title="Delete record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-400 sm:px-6">
        Showing {records.length} recent processing records
      </div>
    </div>
  );
}