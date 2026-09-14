import type {
  IncidentSeverity,
  IncidentStatus,
  SafetyAction,
  SafetyIncident,
  SafetyInspection,
} from "../pages/Safety";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8001"
).replace(/\/+$/, "");

const SAFETY_URL =
  `${API_BASE_URL}/api/v1/safety`;

// ============================================================
// TYPES
// ============================================================

export type CreateSafetyIncidentData = Omit<
  SafetyIncident,
  "id" | "reference"
>;

export type UpdateSafetyIncidentData =
  Partial<CreateSafetyIncidentData>;

export type SafetySummary = {
  totalIncidents: number;
  openIncidents: number;
  highRiskIncidents: number;
  nearMisses: number;
  injuredPersons: number;
  resolvedIncidents: number;
  underInvestigation: number;
  resolutionRate: number;
};

export type SafetyDashboard = {
  summary: SafetySummary;
  incidents: SafetyIncident[];
  inspections: SafetyInspection[];
  actions: SafetyAction[];
};

export type SafetyIncidentFilters = {
  search?: string;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
};

// ============================================================
// API REQUEST HELPER
// ============================================================

async function request<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${SAFETY_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    },
  );

  if (!response.ok) {
    let message =
      `Safety API request failed (${response.status})`;

    try {
      const error = await response.json();

      if (error?.detail) {
        message =
          typeof error.detail === "string"
            ? error.detail
            : JSON.stringify(error.detail);
      }
    } catch {
      // Keep default error message.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ============================================================
// DASHBOARD
// ============================================================

export async function getSafetyDashboard(): Promise<SafetyDashboard> {
  return request<SafetyDashboard>("/dashboard");
}

// ============================================================
// SUMMARY
// ============================================================

export async function getSafetySummary(): Promise<SafetySummary> {
  return request<SafetySummary>("/summary");
}

// ============================================================
// INCIDENTS
// ============================================================

export async function getSafetyIncidents(
  filters: SafetyIncidentFilters = {},
): Promise<SafetyIncident[]> {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set(
      "search",
      filters.search.trim(),
    );
  }

  if (filters.severity) {
    params.set(
      "severity",
      filters.severity,
    );
  }

  if (filters.status) {
    params.set(
      "status",
      filters.status,
    );
  }

  const query = params.toString();

  return request<SafetyIncident[]>(
    query
      ? `/incidents?${query}`
      : "/incidents",
  );
}

export async function getSafetyIncident(
  id: number,
): Promise<SafetyIncident> {
  return request<SafetyIncident>(
    `/incidents/${id}`,
  );
}

export async function createSafetyIncident(
  data: CreateSafetyIncidentData,
): Promise<SafetyIncident> {
  /*
   * The backend SafetyIncidentCreate schema requires
   * a reference. Generate it here so the user does
   * not have to type one manually.
   */
  const reference =
    `SM-INC-${Date.now()}`;

  return request<SafetyIncident>(
    "/incidents",
    {
      method: "POST",
      body: JSON.stringify({
        reference,
        ...data,
      }),
    },
  );
}

export async function updateSafetyIncident(
  id: number,
  data: UpdateSafetyIncidentData,
): Promise<SafetyIncident> {
  return request<SafetyIncident>(
    `/incidents/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
}

export async function deleteSafetyIncident(
  id: number,
): Promise<void> {
  await request<{
    message: string;
    id: number;
  }>(
    `/incidents/${id}`,
    {
      method: "DELETE",
    },
  );
}

// ============================================================
// INSPECTIONS
// ============================================================

export async function getSafetyInspections(): Promise<
  SafetyInspection[]
> {
  return request<SafetyInspection[]>(
    "/inspections",
  );
}

export async function getSafetyInspection(
  id: number,
): Promise<SafetyInspection> {
  return request<SafetyInspection>(
    `/inspections/${id}`,
  );
}

export async function createSafetyInspection(
  data: Omit<SafetyInspection, "id">,
): Promise<SafetyInspection> {
  return request<SafetyInspection>(
    "/inspections",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function updateSafetyInspection(
  id: number,
  data: Partial<Omit<SafetyInspection, "id">>,
): Promise<SafetyInspection> {
  return request<SafetyInspection>(
    `/inspections/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
}

export async function deleteSafetyInspection(
  id: number,
): Promise<void> {
  await request<{
    message: string;
    id: number;
  }>(
    `/inspections/${id}`,
    {
      method: "DELETE",
    },
  );
}

// ============================================================
// CORRECTIVE ACTIONS
// ============================================================

export async function getSafetyActions(): Promise<
  SafetyAction[]
> {
  return request<SafetyAction[]>(
    "/actions",
  );
}

export async function getSafetyAction(
  id: number,
): Promise<SafetyAction> {
  return request<SafetyAction>(
    `/actions/${id}`,
  );
}

export async function createSafetyAction(
  data: Omit<SafetyAction, "id">,
): Promise<SafetyAction> {
  return request<SafetyAction>(
    "/actions",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function updateSafetyAction(
  id: number,
  data: Partial<Omit<SafetyAction, "id">>,
): Promise<SafetyAction> {
  return request<SafetyAction>(
    `/actions/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
}

export async function deleteSafetyAction(
  id: number,
): Promise<void> {
  await request<{
    message: string;
    id: number;
  }>(
    `/actions/${id}`,
    {
      method: "DELETE",
    },
  );
}

// ============================================================
// DEFAULT SERVICE OBJECT
// ============================================================

const safetyService = {
  getDashboard: getSafetyDashboard,
  getSummary: getSafetySummary,

  getIncidents: getSafetyIncidents,
  getIncident: getSafetyIncident,
  createIncident: createSafetyIncident,
  updateIncident: updateSafetyIncident,
  deleteIncident: deleteSafetyIncident,

  getInspections: getSafetyInspections,
  getInspection: getSafetyInspection,
  createInspection: createSafetyInspection,
  updateInspection: updateSafetyInspection,
  deleteInspection: deleteSafetyInspection,

  getActions: getSafetyActions,
  getAction: getSafetyAction,
  createAction: createSafetyAction,
  updateAction: updateSafetyAction,
  deleteAction: deleteSafetyAction,
};

export default safetyService;