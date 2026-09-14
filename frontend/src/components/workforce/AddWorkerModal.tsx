import React, { FormEvent, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  Phone,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from "lucide-react";

import type { Worker } from "../../pages/Workforce";

type AddWorkerModalProps = {
  open?: boolean;
  onClose: () => void;
  onSubmit: (worker: Omit<Worker, "id">) => void;
};

export default function AddWorkerModal({
  open = true,
  onClose,
  onSubmit,
}: AddWorkerModalProps) {
  const [form, setForm] = useState({
    employeeNumber: "",
    name: "",
    role: "",
    department: "Mining",
    shift: "Day Shift" as Worker["shift"],
    phone: "",
    startDate: "",
    safetyStatus: "Compliant" as Worker["safetyStatus"],
  });

  const [error, setError] = useState("");

  if (!open) return null;

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.employeeNumber.trim() ||
      !form.name.trim() ||
      !form.role.trim() ||
      !form.department.trim() ||
      !form.phone.trim() ||
      !form.startDate
    ) {
      setError("Please complete all required fields.");
      return;
    }

    onSubmit({
      employeeNumber: form.employeeNumber.trim(),
      name: form.name.trim(),
      role: form.role.trim(),
      department: form.department,
      shift: form.shift,
      status: "Present",
      phone: form.phone.trim(),
      startDate: form.startDate,
      safetyStatus: form.safetyStatus,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Clickable Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-5 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d8a83e] text-[#10251f]">
              <UserPlus size={20} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#10251f] dark:text-[#d8a83e]">
                Workforce
              </p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Add New Worker
              </h2>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close add worker form"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
          {/* Worker Information */}
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Worker Information
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Add the worker's basic employment information.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Employee Number" icon={BriefcaseBusiness} required>
                <input
                  type="text"
                  value={form.employeeNumber}
                  onChange={(e) => updateField("employeeNumber", e.target.value)}
                  placeholder="e.g. SM-011"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </Field>

              <Field label="Full Name" icon={User} required>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </Field>

              <Field label="Job Role" icon={BriefcaseBusiness} required>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  placeholder="e.g. Crusher Operator"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </Field>

              <Field label="Phone Number" icon={Phone} required>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="e.g. 071 000 1011"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </Field>
            </div>
          </section>

          {/* Operational Details */}
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Operational Assignment
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Assign the worker to the appropriate department and shift.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Department" icon={BriefcaseBusiness} required>
                <select
                  value={form.department}
                  onChange={(e) => updateField("department", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option>Mining</option>
                  <option>Processing</option>
                  <option>Operations</option>
                  <option>Maintenance</option>
                  <option>Stores</option>
                  <option>Safety</option>
                  <option>Administration</option>
                </select>
              </Field>

              <Field label="Shift" icon={CalendarDays} required>
                <select
                  value={form.shift}
                  onChange={(e) => updateField("shift", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option>Day Shift</option>
                  <option>Night Shift</option>
                </select>
              </Field>

              <Field label="Start Date" icon={CalendarDays} required>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </Field>

              <Field label="Safety Status" icon={ShieldCheck} required>
                <select
                  value={form.safetyStatus}
                  onChange={(e) => updateField("safetyStatus", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="Compliant">Compliant</option>
                  <option value="Training Due">Training Due</option>
                </select>
              </Field>
            </div>
          </section>

          {/* Validation Error Message */}
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Actions / Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10251f] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#17362e] dark:bg-emerald-600 dark:hover:bg-emerald-700"
            >
              <UserPlus size={17} />
              Add Worker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  icon: typeof User;
  required?: boolean;
  children: React.ReactNode;
};

function Field({ label, icon: Icon, required = false, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <Icon size={14} className="text-slate-400" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}