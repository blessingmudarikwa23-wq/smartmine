import { FormEvent, useEffect, useState } from "react";
import { CalendarDays, Factory, X } from "lucide-react";
import type {
  ProcessingRecord,
  ProcessingRecordCreate,
} from "../../services/processingApi";

type RecordProcessingModalProps = {
  onClose: () => void;
  onSubmit: (record: ProcessingRecordCreate) => void;
  record?: ProcessingRecord | null;
};

const getToday = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDateForInput = (value: string): string => {
  if (!value) {
    return getToday();
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return getToday();
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function RecordProcessingModal({
  onClose,
  onSubmit,
  record,
}: RecordProcessingModalProps) {
  const isEditing = Boolean(record);

  const [date, setDate] = useState<string>(
    record ? formatDateForInput(record.date) : getToday()
  );

  const [shift, setShift] = useState<string>(
    record?.shift || "Day Shift"
  );

  const [materialReceived, setMaterialReceived] = useState<string>(
    record ? String(record.materialReceived) : ""
  );

  const [crushed, setCrushed] = useState<string>(
    record ? String(record.crushed) : ""
  );

  const [processed, setProcessed] = useState<string>(
    record ? String(record.processed) : ""
  );

  const [output, setOutput] = useState<string>(
    record ? String(record.output) : ""
  );

  const [operatingHours, setOperatingHours] = useState<string>(
    record ? String(record.operatingHours) : ""
  );

  const [downtime, setDowntime] = useState<string>(
    record ? String(record.downtime) : ""
  );

  const [status, setStatus] = useState<ProcessingRecord["status"]>(
    record?.status || "Completed"
  );

  const [notes, setNotes] = useState<string>(
    record?.notes || ""
  );

  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (record) {
      setDate(formatDateForInput(record.date));
      setShift(record.shift);
      setMaterialReceived(String(record.materialReceived));
      setCrushed(String(record.crushed));
      setProcessed(String(record.processed));
      setOutput(String(record.output));
      setOperatingHours(String(record.operatingHours));
      setDowntime(String(record.downtime));
      setStatus(record.status);
      setNotes(record.notes || "");
    } else {
      setDate(getToday());
      setShift("Day Shift");
      setMaterialReceived("");
      setCrushed("");
      setProcessed("");
      setOutput("");
      setOperatingHours("");
      setDowntime("");
      setStatus("Completed");
      setNotes("");
    }

    setError("");
  }, [record]);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ): void => {
    event.preventDefault();
    setError("");

    const received = Number(materialReceived);
    const crushedValue = Number(crushed);
    const processedValue = Number(processed);
    const outputValue = Number(output);
    const operating = Number(operatingHours);
    const downtimeValue = Number(downtime || 0);

    if (
      !date ||
      !shift ||
      materialReceived === "" ||
      crushed === "" ||
      processed === "" ||
      output === "" ||
      operatingHours === ""
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (
      !Number.isFinite(received) ||
      !Number.isFinite(crushedValue) ||
      !Number.isFinite(processedValue) ||
      !Number.isFinite(outputValue) ||
      !Number.isFinite(operating) ||
      !Number.isFinite(downtimeValue)
    ) {
      setError("Please enter valid numerical values.");
      return;
    }

    if (
      received < 0 ||
      crushedValue < 0 ||
      processedValue < 0 ||
      outputValue < 0 ||
      operating < 0 ||
      downtimeValue < 0
    ) {
      setError("Values cannot be negative.");
      return;
    }

    if (crushedValue > received) {
      setError(
        "Crushed material cannot exceed material received."
      );
      return;
    }

    if (processedValue > crushedValue) {
      setError(
        "Processed material cannot exceed crushed material."
      );
      return;
    }

    if (downtimeValue > operating) {
      setError(
        "Downtime cannot exceed operating hours."
      );
      return;
    }

    const processingRecord: ProcessingRecordCreate = {
      date,
      shift,
      materialReceived: received,
      crushed: crushedValue,
      processed: processedValue,
      output: outputValue,
      operatingHours: operating,
      downtime: downtimeValue,
      status,
      notes: notes.trim() || null,
    };

    onSubmit(processingRecord);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10251f]/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10251f] text-[#d8a83e]">
              <Factory size={19} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#10251f]">
                {isEditing
                  ? "Edit Processing Record"
                  : "Record Processing"}
              </h2>

              <p className="text-xs text-slate-500">
                Capture crusher and grinding production data.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6">
          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="processing-date"
                className="mb-2 block text-sm font-semibold text-[#10251f]"
              >
                Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="processing-date"
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/15"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="processing-shift"
                className="mb-2 block text-sm font-semibold text-[#10251f]"
              >
                Shift
              </label>

              <select
                id="processing-shift"
                value={shift}
                onChange={(event) =>
                  setShift(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/15"
              >
                <option>Day Shift</option>
                <option>Night Shift</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="material-received"
                className="mb-2 block text-sm font-semibold text-[#10251f]"
              >
                Material Received (t)
              </label>

              <input
                id="material-received"
                type="number"
                min="0"
                step="0.1"
                value={materialReceived}
                onChange={(event) =>
                  setMaterialReceived(event.target.value)
                }
                placeholder="e.g. 52"
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/15"
              />
            </div>

            <div>
              <label
                htmlFor="crushed"
                className="mb-2 block text-sm font-semibold text-[#10251f]"
              >
                Crushed Material (t)
              </label>

              <input
                id="crushed"
                type="number"
                min="0"
                step="0.1"
                value={crushed}
                onChange={(event) =>
                  setCrushed(event.target.value)
                }
                placeholder="e.g. 48"
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/15"
              />
            </div>

            <div>
              <label
                htmlFor="processed"
                className="mb-2 block text-sm font-semibold text-[#10251f]"
              >
                Processed / Ground (t)
              </label>

              <input
                id="processed"
                type="number"
                min="0"
                step="0.1"
                value={processed}
                onChange={(event) =>
                  setProcessed(event.target.value)
                }
                placeholder="e.g. 43"
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/15"
              />
            </div>

            <div>
              <label
                htmlFor="output"
                className="mb-2 block text-sm font-semibold text-[#10251f]"
              >
                Final Output (t)
              </label>

              <input
                id="output"
                type="number"
                min="0"
                step="0.1"
                value={output}
                onChange={(event) =>
                  setOutput(event.target.value)
                }
                placeholder="e.g. 14.8"
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/15"
              />
            </div>

            <div>
              <label
                htmlFor="operating-hours"
                className="mb-2 block text-sm font-semibold text-[#10251f]"
              >
                Operating Hours
              </label>

              <input
                id="operating-hours"
                type="number"
                min="0"
                step="0.1"
                value={operatingHours}
                onChange={(event) =>
                  setOperatingHours(event.target.value)
                }
                placeholder="e.g. 8.5"
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/15"
              />
            </div>

            <div>
              <label
                htmlFor="downtime"
                className="mb-2 block text-sm font-semibold text-[#10251f]"
              >
                Downtime Hours
              </label>

              <input
                id="downtime"
                type="number"
                min="0"
                step="0.1"
                value={downtime}
                onChange={(event) =>
                  setDowntime(event.target.value)
                }
                placeholder="e.g. 1.2"
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/15"
              />
            </div>

            <div>
              <label
                htmlFor="processing-status"
                className="mb-2 block text-sm font-semibold text-[#10251f]"
              >
                Status
              </label>

              <select
                id="processing-status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as ProcessingRecord["status"]
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/15"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="processing-notes"
              className="mb-2 block text-sm font-semibold text-[#10251f]"
            >
              Notes
            </label>

            <textarea
              id="processing-notes"
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows={4}
              placeholder="Add any relevant processing notes..."
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/15"
            />
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#10251f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#18362e]"
            >
              {isEditing
                ? "Update Processing Record"
                : "Save Processing Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}