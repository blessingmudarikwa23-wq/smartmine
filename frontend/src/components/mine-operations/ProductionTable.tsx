import {
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react";

type ProductionRecord = {
  id: number;
  date: string;
  shift: string;
  extracted: number;
  processed: number;
  output: number;
  operatingHours: number;
  downtime: number;
  status: "Completed" | "In Progress" | "Delayed";
};

type ProductionTableProps = {
  records: ProductionRecord[];
  onEdit: (record: ProductionRecord) => void;
  onDelete: (id: number) => void;
};

function ProductionTable({
  records,
  onEdit,
  onDelete,
}: ProductionTableProps) {
  const statusStyles = {
    Completed:
      "bg-emerald-50 text-emerald-700 border-emerald-100",
    "In Progress":
      "bg-blue-50 text-blue-700 border-blue-100",
    Delayed:
      "bg-rose-50 text-rose-700 border-rose-100",
  };

  const statusIcons = {
    Completed: CheckCircle2,
    "In Progress": Clock3,
    Delayed: XCircle,
  };

  return (
    <div className="w-full overflow-hidden">
      {records.length === 0 ? (
        <div className="p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <Clock3 size={22} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-800">
            No production records found
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Try changing the selected shift or add a new production record.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Date
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Shift
                </th>

                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Extracted
                </th>

                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Processed
                </th>

                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Output
                </th>

                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Operating
                </th>

                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Downtime
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {records.map((record) => {
                const StatusIcon = statusIcons[record.status];

                return (
                  <tr
                    key={record.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-slate-800">
                        {record.date}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                        {record.shift}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-semibold text-slate-800">
                        {record.extracted} t
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-semibold text-slate-800">
                        {record.processed} t
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="font-bold text-[#10251f]">
                        {record.output.toFixed(1)} kg
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-medium text-slate-600">
                        {record.operatingHours.toFixed(1)} hrs
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span
                        className={`text-sm font-semibold ${
                          record.downtime > 1.5
                            ? "text-rose-600"
                            : "text-slate-600"
                        }`}
                      >
                        {record.downtime.toFixed(1)} hrs
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-bold ${statusStyles[record.status]}`}
                      >
                        <StatusIcon size={13} />
                        {record.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="Edit record"
                          onClick={() => onEdit(record)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-[#10251f]"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          title="Delete record"
                          onClick={() => onDelete(record.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 size={15} />
                        </button>

                        <button
                          type="button"
                          title="More options"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductionTable;