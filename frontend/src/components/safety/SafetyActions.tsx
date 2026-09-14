import {
  CheckCircle2,
  CircleDot,
  Clock3,
  ClipboardCheck,
  Edit3,
  Plus,
  Trash2,
} from "lucide-react";

import type { SafetyAction } from "../../pages/Safety";

type SafetyActionsProps = {
  actions: SafetyAction[];
  onAdd: () => void;
  onEdit: (action: SafetyAction) => void;
  onDelete: (action: SafetyAction) => void;
  deletingId?: number | null;
};

function SafetyActions({
  actions,
  onAdd,
  onEdit,
  onDelete,
  deletingId = null,
}: SafetyActionsProps) {
  const priorityStyles = {
    Low: "bg-slate-100 text-slate-600",
    Medium: "bg-amber-50 text-amber-700",
    High: "bg-red-50 text-red-700",
  };

  const statusStyles = {
    Open: "bg-red-50 text-red-700",
    "In Progress": "bg-blue-50 text-blue-700",
    Completed: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8a83e]/15 text-[#9a741f]">
            <ClipboardCheck size={19} />
          </div>

          <div>
            <h2 className="font-bold text-[#10251f]">
              Corrective Actions
            </h2>

            <p className="text-xs text-slate-400">
              Actions created from safety findings and incidents
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10251f] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#18382f]"
        >
          <Plus size={15} />
          Record Action
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[1050px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Action
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Area
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Owner
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Due Date
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Priority
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Status
              </th>

              <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {actions.map((action) => (
              <tr
                key={action.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
              >
                <td className="px-3 py-4">
                  <div className="flex items-center gap-2">
                    {action.status === "Completed" ? (
                      <CheckCircle2
                        size={16}
                        className="shrink-0 text-emerald-600"
                      />
                    ) : action.status === "In Progress" ? (
                      <CircleDot
                        size={16}
                        className="shrink-0 text-blue-600"
                      />
                    ) : (
                      <Clock3
                        size={16}
                        className="shrink-0 text-amber-600"
                      />
                    )}

                    <span className="text-sm font-semibold text-[#10251f]">
                      {action.title}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-4 text-sm text-slate-600">
                  {action.area}
                </td>

                <td className="px-3 py-4 text-sm text-slate-600">
                  {action.owner}
                </td>

                <td className="px-3 py-4 text-sm text-slate-600">
                  {action.dueDate}
                </td>

                <td className="px-3 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${priorityStyles[action.priority]}`}
                  >
                    {action.priority}
                  </span>
                </td>

                <td className="px-3 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyles[action.status]}`}
                  >
                    {action.status}
                  </span>
                </td>

                <td className="px-3 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(action)}
                      disabled={
                        deletingId === action.id
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#d8a83e] hover:bg-[#d8a83e]/10 hover:text-[#10251f] disabled:opacity-50"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(action)}
                      disabled={
                        deletingId === action.id
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={14} />

                      {deletingId === action.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {actions.length === 0 && (
          <div className="px-6 py-12 text-center">
            <ClipboardCheck
              size={30}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-semibold text-slate-600">
              No corrective actions recorded
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Click "Record Action" to create the first corrective action.
            </p>

            <button
              type="button"
              onClick={onAdd}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#10251f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#18382f]"
            >
              <Plus size={14} />
              Record Action
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SafetyActions;