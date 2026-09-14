import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  AlertTriangle,
  CalendarDays,
  MapPin,
  Save,
  ShieldAlert,
  User,
  X,
} from "lucide-react";

import type {
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
  SafetyIncident,
} from "../../pages/Safety";

type RecordIncidentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<SafetyIncident, "id" | "reference">,
  ) => void;
  initialIncident?: SafetyIncident | null;
  submitting?: boolean;
};

const categories = [
  "Equipment",
  "PPE",
  "Vehicle",
  "Electrical",
  "Slips / Trips",
  "Fire / Emergency",
  "Environmental",
  "Spillage",
  "Ground Control",
  "Other",
];

const locations = [
  "Open Pit",
  "Crusher Area",
  "Processing Plant",
  "Grinding Area",
  "Workshop",
  "Generator Room",
  "Fuel Yard A",
  "Stores",
  "Dewatering Area",
  "Administration",
];

const getToday = () => {
  const date = new Date();

  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getCurrentTime = () =>
  new Date().toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

function RecordIncidentModal({
  isOpen,
  onClose,
  onSubmit,
  initialIncident = null,
  submitting = false,
}: RecordIncidentModalProps) {
  const [type, setType] =
    useState<IncidentType>("Incident");

  const [category, setCategory] =
    useState(categories[0]);

  const [location, setLocation] =
    useState(locations[0]);

  const [severity, setSeverity] =
    useState<IncidentSeverity>("Medium");

  const [status, setStatus] =
    useState<IncidentStatus>("Open");

  const [reportedBy, setReportedBy] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [correctiveAction, setCorrectiveAction] =
    useState("");

  const [injuredPersons, setInjuredPersons] =
    useState("0");

  const [date, setDate] =
    useState(getToday());

  const [time, setTime] =
    useState(getCurrentTime());

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (initialIncident) {
      setType(initialIncident.type);
      setCategory(initialIncident.category);
      setLocation(initialIncident.location);
      setSeverity(initialIncident.severity);
      setStatus(initialIncident.status);
      setReportedBy(initialIncident.reportedBy);
      setDescription(initialIncident.description);
      setCorrectiveAction(
        initialIncident.correctiveAction,
      );
      setInjuredPersons(
        String(initialIncident.injuredPersons),
      );
      setDate(initialIncident.date);
      setTime(initialIncident.time);
    } else {
      setType("Incident");
      setCategory(categories[0]);
      setLocation(locations[0]);
      setSeverity("Medium");
      setStatus("Open");
      setReportedBy("");
      setDescription("");
      setCorrectiveAction("");
      setInjuredPersons("0");
      setDate(getToday());
      setTime(getCurrentTime());
    }

    setError("");
  }, [isOpen, initialIncident]);

  if (!isOpen) {
    return null;
  }

  const isEditing = Boolean(initialIncident);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!reportedBy.trim()) {
      setError(
        "Enter the name of the person reporting the event.",
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Enter a description of the safety event.",
      );
      return;
    }

    if (!correctiveAction.trim()) {
      setError(
        "Enter the recommended corrective action.",
      );
      return;
    }

    const injured = Number(injuredPersons);

    if (
      injured < 0 ||
      Number.isNaN(injured) ||
      !Number.isInteger(injured)
    ) {
      setError(
        "Enter a valid whole number of injured persons.",
      );
      return;
    }

    onSubmit({
      date,
      time,
      type,
      category,
      location,
      description,
      severity,
      status,
      reportedBy: reportedBy.trim(),
      injuredPersons: injured,
      correctiveAction:
        correctiveAction.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8a83e] text-[#10251f]">
              <ShieldAlert size={20} />
            </div>

            <div>
              <h2 className="font-bold text-[#10251f]">
                {isEditing
                  ? "Edit Safety Incident"
                  : "Record Safety Event"}
              </h2>

              <p className="text-xs text-slate-400">
                {isEditing
                  ? `Editing ${initialIncident?.reference}`
                  : "Capture an incident, near miss or unsafe condition."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
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

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Event Type
              </label>

              <select
                value={type}
                onChange={(event) =>
                  setType(
                    event.target.value as IncidentType,
                  )
                }
                disabled={submitting}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white"
              >
                <option value="Incident">
                  Incident
                </option>
                <option value="Near Miss">
                  Near Miss
                </option>
                <option value="Unsafe Condition">
                  Unsafe Condition
                </option>
                <option value="Environmental">
                  Environmental
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Category
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                disabled={submitting}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Location
              </label>

              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  disabled={submitting}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white"
                >
                  {locations.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Severity
              </label>

              <select
                value={severity}
                onChange={(event) =>
                  setSeverity(
                    event.target.value as IncidentSeverity,
                  )
                }
                disabled={submitting}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">
                  Critical
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as IncidentStatus,
                  )
                }
                disabled={submitting}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#d8a83e] focus:bg-white"
              >
                <option value="Open">Open</option>
                <option value="Under Investigation">
                  Under Investigation
                </option>
                <option value="Resolved">
                  Resolved
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Reported By
              </label>

              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={reportedBy}
                  onChange={(event) =>
                    setReportedBy(event.target.value)
                  }
                  disabled={submitting}
                  placeholder="Name of reporter"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  disabled={submitting}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Time
              </label>

              <input
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
                }
                disabled={submitting}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Injured Persons
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={injuredPersons}
                onChange={(event) =>
                  setInjuredPersons(event.target.value)
                }
                disabled={submitting}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#d8a83e] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Event Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                disabled={submitting}
                rows={4}
                placeholder="Describe what happened, what was observed and the affected area..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-[#d8a83e] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Corrective / Preventive Action
              </label>

              <textarea
                value={correctiveAction}
                onChange={(event) =>
                  setCorrectiveAction(event.target.value)
                }
                disabled={submitting}
                rows={3}
                placeholder="Describe the action required to address or prevent recurrence..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-[#d8a83e] focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-[#d8a83e]/20 bg-[#d8a83e]/5 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d8a83e]/20 text-[#8c691c]">
                <ShieldAlert size={17} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Safety Record
                </p>

                <p className="mt-1 text-sm font-semibold text-[#10251f]">
                  {type} · {severity} · {location}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {isEditing
                    ? "Changes will be saved to the live safety register."
                    : "This event will be added to the live safety register immediately."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                <ShieldAlert size={17} />
              )}

              {submitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Record Safety Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecordIncidentModal;