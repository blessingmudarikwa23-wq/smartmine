import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  ShieldCheck,
} from "lucide-react";

import SafetyKPI from "../components/safety/SafetyKPI";
import SafetyOverview from "../components/safety/SafetyOverview";
import IncidentTable from "../components/safety/IncidentTable";
import SafetyInspections from "../components/safety/SafetyInspections";
import SafetyAlerts from "../components/safety/SafetyAlerts";
import SafetyActions from "../components/safety/SafetyActions";
import RecordIncidentModal from "../components/safety/RecordIncidentModal";
import RecordSafetyActionModal from "../components/safety/RecordSafetyActionModal";

import {
  createSafetyAction,
  createSafetyIncident,
  deleteSafetyAction,
  deleteSafetyIncident,
  getSafetyDashboard,
  updateSafetyAction,
  updateSafetyIncident,
} from "../services/safetyService";

export type IncidentSeverity =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export type IncidentStatus =
  | "Open"
  | "Under Investigation"
  | "Resolved";

export type IncidentType =
  | "Incident"
  | "Near Miss"
  | "Unsafe Condition"
  | "Environmental";

export type SafetyIncident = {
  id: number;
  reference: string;
  date: string;
  time: string;
  type: IncidentType;
  category: string;
  location: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedBy: string;
  injuredPersons: number;
  correctiveAction: string;
};

export type SafetyInspection = {
  id: number;
  title: string;
  area: string;
  inspector: string;
  date: string;
  status:
    | "Completed"
    | "Scheduled"
    | "Overdue";
  findings: number;
  icon: import("lucide-react").LucideIcon;
};

export type SafetyAction = {
  id: number;
  title: string;
  area: string;
  owner: string;
  dueDate: string;
  priority:
    | "Low"
    | "Medium"
    | "High";
  status:
    | "Open"
    | "In Progress"
    | "Completed";
};

function Safety() {
  const [incidents, setIncidents] =
    useState<SafetyIncident[]>([]);

  const [inspections, setInspections] =
    useState<SafetyInspection[]>([]);

  const [actions, setActions] =
    useState<SafetyAction[]>([]);

  const [incidentModalOpen, setIncidentModalOpen] =
    useState(false);

  const [actionModalOpen, setActionModalOpen] =
    useState(false);

  const [editingIncident, setEditingIncident] =
    useState<SafetyIncident | null>(null);

  const [editingAction, setEditingAction] =
    useState<SafetyAction | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [deletingIncidentId, setDeletingIncidentId] =
    useState<number | null>(null);

  const [deletingActionId, setDeletingActionId] =
    useState<number | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  // ==========================================================
  // LOAD SAFETY DATA
  // ==========================================================

  const loadSafetyData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await getSafetyDashboard();

      setIncidents(data.incidents);
      setInspections(data.inspections);
      setActions(data.actions);
    } catch (err) {
      console.error(
        "Failed to load safety data:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load safety management data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSafetyData();
  }, []);

  // ==========================================================
  // SAFETY KPIs
  // ==========================================================

  const openIncidents = useMemo(
    () =>
      incidents.filter(
        (incident) =>
          incident.status !== "Resolved",
      ).length,
    [incidents],
  );

  const highRiskIncidents = useMemo(
    () =>
      incidents.filter(
        (incident) =>
          incident.severity === "High" ||
          incident.severity === "Critical",
      ).length,
    [incidents],
  );

  const nearMisses = useMemo(
    () =>
      incidents.filter(
        (incident) =>
          incident.type === "Near Miss",
      ).length,
    [incidents],
  );

  const injuredPersons = useMemo(
    () =>
      incidents.reduce(
        (total, incident) =>
          total + incident.injuredPersons,
        0,
      ),
    [incidents],
  );

  // ==========================================================
  // OPEN NEW INCIDENT
  // ==========================================================

  const openNewIncidentModal = () => {
    setEditingIncident(null);
    setIncidentModalOpen(true);
  };

  // ==========================================================
  // EDIT INCIDENT
  // ==========================================================

  const handleEditIncident = (
    incident: SafetyIncident,
  ) => {
    setEditingIncident(incident);
    setIncidentModalOpen(true);
  };

  // ==========================================================
  // CREATE / UPDATE INCIDENT
  // ==========================================================

  const handleIncidentSubmit = async (
    data: Omit<
      SafetyIncident,
      "id" | "reference"
    >,
  ) => {
    try {
      setSubmitting(true);
      setError(null);

      if (editingIncident) {
        const updatedIncident =
          await updateSafetyIncident(
            editingIncident.id,
            data,
          );

        setIncidents((current) =>
          current.map((incident) =>
            incident.id ===
            updatedIncident.id
              ? updatedIncident
              : incident,
          ),
        );
      } else {
        const createdIncident =
          await createSafetyIncident(data);

        setIncidents((current) => [
          createdIncident,
          ...current,
        ]);
      }

      setIncidentModalOpen(false);
      setEditingIncident(null);
    } catch (err) {
      console.error(
        "Failed to save safety incident:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save the safety incident.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================================
  // DELETE INCIDENT
  // ==========================================================

  const handleDeleteIncident = async (
    incident: SafetyIncident,
  ) => {
    const confirmed =
      window.confirm(
        `Delete safety incident ${incident.reference}?\n\nThis action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingIncidentId(incident.id);
      setError(null);

      await deleteSafetyIncident(
        incident.id,
      );

      setIncidents((current) =>
        current.filter(
          (item) =>
            item.id !== incident.id,
        ),
      );
    } catch (err) {
      console.error(
        "Failed to delete safety incident:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete the safety incident.",
      );
    } finally {
      setDeletingIncidentId(null);
    }
  };

  // ==========================================================
  // OPEN NEW CORRECTIVE ACTION
  // ==========================================================

  const openNewActionModal = () => {
    setEditingAction(null);
    setActionModalOpen(true);
  };

  // ==========================================================
  // EDIT CORRECTIVE ACTION
  // ==========================================================

  const handleEditAction = (
    action: SafetyAction,
  ) => {
    setEditingAction(action);
    setActionModalOpen(true);
  };

  // ==========================================================
  // CREATE / UPDATE CORRECTIVE ACTION
  // ==========================================================

  const handleActionSubmit = async (
    data: Omit<SafetyAction, "id">,
  ) => {
    try {
      setSubmitting(true);
      setError(null);

      if (editingAction) {
        const updatedAction =
          await updateSafetyAction(
            editingAction.id,
            data,
          );

        setActions((current) =>
          current.map((action) =>
            action.id ===
            updatedAction.id
              ? updatedAction
              : action,
          ),
        );
      } else {
        const createdAction =
          await createSafetyAction(data);

        setActions((current) => [
          createdAction,
          ...current,
        ]);
      }

      setActionModalOpen(false);
      setEditingAction(null);
    } catch (err) {
      console.error(
        "Failed to save corrective action:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save the corrective action.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================================
  // DELETE CORRECTIVE ACTION
  // ==========================================================

  const handleDeleteAction = async (
    action: SafetyAction,
  ) => {
    const confirmed =
      window.confirm(
        `Delete corrective action "${action.title}"?\n\nThis action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingActionId(action.id);
      setError(null);

      await deleteSafetyAction(
        action.id,
      );

      setActions((current) =>
        current.filter(
          (item) =>
            item.id !== action.id,
        ),
      );
    } catch (err) {
      console.error(
        "Failed to delete corrective action:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete the corrective action.",
      );
    } finally {
      setDeletingActionId(null);
    }
  };

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d8a83e]">
              <ShieldCheck size={15} />
              Health & Safety
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#10251f] sm:text-3xl">
              Safety Management
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Monitor incidents, near misses, inspections and
              corrective actions across the mine.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#10251f]" />

            <h2 className="text-sm font-semibold text-[#10251f]">
              Loading safety management data
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Connecting to the SmartMine safety service...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN PAGE
  // ==========================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d8a83e]">
            <ShieldCheck size={15} />
            Health & Safety
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#10251f] sm:text-3xl">
            Safety Management
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Monitor incidents, near misses, inspections and
            corrective actions across the mine.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewIncidentModal}
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10251f] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#18382f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} />
          Record Incident
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div>
            <p className="font-semibold">
              Safety service error
            </p>

            <p className="mt-1">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadSafetyData()
            }
            className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      )}

      {/* KPIs */}
      <SafetyKPI
        openIncidents={openIncidents}
        highRiskIncidents={highRiskIncidents}
        nearMisses={nearMisses}
        injuredPersons={injuredPersons}
      />

      {/* Overview */}
      <SafetyOverview
        incidents={incidents}
      />

      {/* Incident Register */}
      <IncidentTable
        incidents={incidents}
        onEdit={handleEditIncident}
        onDelete={handleDeleteIncident}
        deletingId={deletingIncidentId}
      />

      {/* Inspections + Alerts */}
      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <SafetyInspections
          inspections={inspections}
        />

        <SafetyAlerts
          incidents={incidents}
        />
      </div>

      {/* Corrective Actions */}
      <SafetyActions
        actions={actions}
        onAdd={openNewActionModal}
        onEdit={handleEditAction}
        onDelete={handleDeleteAction}
        deletingId={deletingActionId}
      />

      {/* Incident Modal */}
      <RecordIncidentModal
        isOpen={incidentModalOpen}
        onClose={() => {
          if (!submitting) {
            setIncidentModalOpen(false);
            setEditingIncident(null);
          }
        }}
        onSubmit={handleIncidentSubmit}
        initialIncident={editingIncident}
        submitting={submitting}
      />

      {/* Corrective Action Modal */}
      <RecordSafetyActionModal
        isOpen={actionModalOpen}
        onClose={() => {
          if (!submitting) {
            setActionModalOpen(false);
            setEditingAction(null);
          }
        }}
        onSubmit={handleActionSubmit}
        initialAction={editingAction}
        submitting={submitting}
      />
    </div>
  );
}

export default Safety;