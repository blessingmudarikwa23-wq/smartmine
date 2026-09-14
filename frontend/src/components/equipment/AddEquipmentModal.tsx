import { useState } from "react";
import type { FormEvent } from "react";
import {
  CalendarDays,
  Factory,
  Gauge,
  MapPin,
  Plus,
  X,
} from "lucide-react";

import type {
  EquipmentRecord,
  EquipmentStatus,
} from "../../pages/Equipment";

type AddEquipmentModalProps = {
  onClose: () => void;
  onSubmit: (record: EquipmentRecord) => void;
};

export default function AddEquipmentModal({
  onClose,
  onSubmit,
}: AddEquipmentModalProps) {
  const [form, setForm] = useState({
    equipmentId: "",
    name: "",
    type: "Crusher",
    manufacturer: "",
    model: "",
    location: "",
    status: "Available" as EquipmentStatus,
    operatingHours: "",
    utilisation: "",
    lastMaintenance: "",
    nextMaintenance: "",
    maintenanceInterval: "250",
    notes: "",
  });

  const [error, setError] = useState("");

  const updateField = (
    field: keyof typeof form,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");

    if (
      !form.equipmentId.trim() ||
      !form.name.trim() ||
      !form.type.trim() ||
      !form.location.trim()
    ) {
      setError(
        "Please complete the equipment ID, name, type and location.",
      );
      return;
    }

    const operatingHours = Number(
      form.operatingHours || 0,
    );

    const utilisation = Number(
      form.utilisation || 0,
    );

    const maintenanceInterval = Number(
      form.maintenanceInterval || 250,
    );

    if (
      operatingHours < 0 ||
      utilisation < 0 ||
      utilisation > 100 ||
      maintenanceInterval <= 0
    ) {
      setError(
        "Please enter valid operating hours, utilisation and maintenance interval values.",
      );
      return;
    }

    const record: EquipmentRecord = {
      id: Date.now(),
      equipmentId: form.equipmentId.trim(),
      name: form.name.trim(),
      type: form.type,
      manufacturer:
        form.manufacturer.trim() || "Not specified",
      model:
        form.model.trim() || "Not specified",
      location: form.location.trim(),
      status: form.status,
      operatingHours,
      utilisation,
      lastMaintenance:
        form.lastMaintenance || "Not recorded",
      nextMaintenance:
        form.nextMaintenance || "Not scheduled",
      maintenanceInterval,
      notes: form.notes.trim(),
    };

    onSubmit(record);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.75 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#d8a83e] focus:ring-2 focus:ring-[#d8a83e]/10";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10251f]/60 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#d8a83e]/15 p-2.5">
              <Plus
                size={20}
                className="text-[#d8a83e]"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#10251f]">
                Add Equipment
              </h2>

              <p className="text-xs text-slate-400">
                Register a new equipment unit in the fleet.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-7"
        >
          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-7">
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Factory
                  size={17}
                  className="text-[#d8a83e]"
                />

                <h3 className="font-bold text-[#10251f]">
                  Equipment Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Equipment ID *
                  </label>

                  <input
                    value={form.equipmentId}
                    onChange={(event) =>
                      updateField(
                        "equipmentId",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. CR-002"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Equipment Name *
                  </label>

                  <input
                    value={form.name}
                    onChange={(event) =>
                      updateField(
                        "name",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. Secondary Crusher"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Equipment Type *
                  </label>

                  <select
                    value={form.type}
                    onChange={(event) =>
                      updateField(
                        "type",
                        event.target.value,
                      )
                    }
                    className={inputClass}
                  >
                    <option>Crusher</option>
                    <option>Grinding Mill</option>
                    <option>Excavator</option>
                    <option>Loader</option>
                    <option>Haul Truck</option>
                    <option>Generator</option>
                    <option>Pump</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Location *
                  </label>

                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={form.location}
                      onChange={(event) =>
                        updateField(
                          "location",
                          event.target.value,
                        )
                      }
                      placeholder="e.g. Crushing Plant"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Manufacturer
                  </label>

                  <input
                    value={form.manufacturer}
                    onChange={(event) =>
                      updateField(
                        "manufacturer",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. Metso"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Model
                  </label>

                  <input
                    value={form.model}
                    onChange={(event) =>
                      updateField(
                        "model",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. C80"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-2">
                <Gauge
                  size={17}
                  className="text-[#d8a83e]"
                />

                <h3 className="font-bold text-[#10251f]">
                  Operational Details
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Current Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateField(
                        "status",
                        event.target.value,
                      )
                    }
                    className={inputClass}
                  >
                    <option value="Running">
                      Running
                    </option>

                    <option value="Available">
                      Available
                    </option>

                    <option value="Maintenance">
                      Maintenance
                    </option>

                    <option value="Down">
                      Down
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Operating Hours
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.operatingHours}
                    onChange={(event) =>
                      updateField(
                        "operatingHours",
                        event.target.value,
                      )
                    }
                    placeholder="0"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Utilisation %
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.utilisation}
                    onChange={(event) =>
                      updateField(
                        "utilisation",
                        event.target.value,
                      )
                    }
                    placeholder="0 - 100"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-2">
                <CalendarDays
                  size={17}
                  className="text-[#d8a83e]"
                />

                <h3 className="font-bold text-[#10251f]">
                  Maintenance
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Last Maintenance
                  </label>

                  <input
                    type="date"
                    value={form.lastMaintenance}
                    onChange={(event) =>
                      updateField(
                        "lastMaintenance",
                        event.target.value,
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Next Maintenance
                  </label>

                  <input
                    type="date"
                    value={form.nextMaintenance}
                    onChange={(event) =>
                      updateField(
                        "nextMaintenance",
                        event.target.value,
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                    Service Interval (Hours)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={form.maintenanceInterval}
                    onChange={(event) =>
                      updateField(
                        "maintenanceInterval",
                        event.target.value,
                      )
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            <section>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                Notes
              </label>

              <textarea
                value={form.notes}
                onChange={(event) =>
                  updateField(
                    "notes",
                    event.target.value,
                  )
                }
                rows={4}
                placeholder="Add any operational or maintenance notes..."
                className={`${inputClass} resize-none`}
              />
            </section>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10251f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#17352c]"
            >
              <Plus size={17} />
              Add Equipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}