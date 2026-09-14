import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  AlertTriangle,
  CalendarDays,
  ClipboardCheck,
  Save,
  X,
} from "lucide-react";

import type {
  SafetyAction,
} from "../../pages/Safety";

type RecordSafetyActionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<SafetyAction, "id">,
  ) => void;
  initialAction?: SafetyAction | null;
  submitting?: boolean;
};

function RecordSafetyActionModal({
  isOpen,
  onClose,
  onSubmit,
  initialAction = null,
  submitting = false,
}: RecordSafetyActionModalProps) {
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] =
    useState<SafetyAction["priority"]>("Medium");
  const [status, setStatus] =
    useState<SafetyAction["status"]>("Open");

  const [error, setError] = useState("");

  const isEditing = Boolean(initialAction);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (initialAction) {
      setTitle(initialAction.title);
      setArea(initialAction.area);
      setOwner(initialAction.owner);
      setDueDate(initialAction.dueDate);
      setPriority(initialAction.priority);
      setStatus(initialAction.status);
    } else {
      setTitle("");
      setArea("");
      setOwner("");
      setDueDate("");
      setPriority("Medium");
      setStatus("Open");
    }

    setError("");
  }, [isOpen, initialAction]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Enter the corrective action.");
      return;
    }

    if (!area.trim()) {
      setError("Enter the affected area.");
      return;
    }

    if (!owner.trim()) {
      setError("Enter the action owner.");
      return;
    }

    if (!dueDate.trim()) {
      setError("Enter the due date.");
      return;
    }

    onSubmit({
      title: title.trim(),
      area: area.trim(),
      owner: owner.trim(),
      dueDate: dueDate.trim(),
      priority,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8a83e] text-[#10251f]">
              <ClipboardCheck size={20} />
            </div>

            <div>
              <h2 className="font-bold text-[#10251f]">
                {isEditing
                  ? "Edit Corrective Action"
                  : "Record Corrective Action"}
              </h2>

              <p className="text-xs text-slate-400">
                {isEditing
                  ? "Update the selected corrective action."
                  : "Create a new action from a safety finding or incident."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6"
        >
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Corrective Action
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                disabled={submitting}
                placeholder="e.g. Repair damaged safety barrier"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Area
                </label>

                <input
                  value={area}
                  onChange={(event) =>
                    setArea(event.target.value)
                  }
                  disabled={submitting}
                  placeholder="e.g. Open Pit"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Owner
                </label>

                <input
                  value={owner}
                  onChange={(event) =>
                    setOwner(event.target.value)
                  }
                  disabled={submitting}
                  placeholder="Person responsible"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Due Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(event) =>
                      setDueDate(event.target.value)
                    }
                    disabled={submitting}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target.value as SafetyAction["priority"],
                    )
                  }
                  disabled={submitting}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as SafetyAction["status"],
                  )
                }
                disabled={submitting}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white"
              >
                <option value="Open">Open</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10251f] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#18382f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isEditing ? (
                <Save size={17} />
              ) : (
                <ClipboardCheck size={17} />
              )}

              {submitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Record Action"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecordSafetyActionModal;