const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8001";

export type DashboardTrend = "up" | "down" | "neutral";

export type DashboardKPI = {
  title: string;
  value: string | number;
  unit?: string | null;
  change?: string | null;
  trend: DashboardTrend;
  description?: string | null;
};

export type DashboardProductionPoint = {
  date: string;
  extracted: number;
  processed: number;
  output: number;
};

export type DashboardProduction = {
  chart: DashboardProductionPoint[];
  target: number;
  actual: number;
  achievement: number;
  remaining: number;
};

export type DashboardEquipment = {
  name: string;
  type: string;
  status: string;
  utilization: number;
};

export type DashboardActivity = {
  title: string;
  description: string;
  time: string;
  category: string;
};

export type DashboardOperationalHealth = {
  production_target: number;
  equipment_availability: number | null;
  safety_compliance: number | null;
  workforce_attendance: number | null;
};

export type DashboardMineStatus = {
  status: string;
};

export type DashboardSummary = {
  kpis: DashboardKPI[];

  total_extracted: number;
  total_processed: number;
  total_output: number;

  production_target: number;
  target_achievement: number;
  remaining_production: number;

  processing_efficiency: number;
  operating_efficiency: number;

  operating_hours: number;
  downtime: number;

  active_issues: number;
  high_priority_issues: number;

  active_shifts: number;
  total_workers: number;

  mine_status: string;
};

export type DashboardResponse = {
  summary: DashboardSummary;
  production: DashboardProduction;
  equipment: DashboardEquipment[];
  activities: DashboardActivity[];
  operational_health: DashboardOperationalHealth;
  mine_status: DashboardMineStatus;
};

export type DashboardProductionParams = {
  start_date?: string;
  end_date?: string;
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}/api/v1${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let errorMessage = `Dashboard API error ${response.status}`;

    try {
      const errorData = await response.json();

      if (Array.isArray(errorData?.detail)) {
        errorMessage = errorData.detail
          .map((item: { msg?: string }) => item.msg || "Validation error")
          .join(", ");
      } else if (typeof errorData?.detail === "string") {
        errorMessage = errorData.detail;
      }
    } catch {
      // Keep the default error message when the response is not JSON.
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

/* =========================================================
   DASHBOARD
========================================================= */

export async function getDashboard(
  targetDate?: string,
): Promise<DashboardResponse> {
  const params = new URLSearchParams();

  if (targetDate) {
    params.set("target_date", targetDate);
  }

  const query = params.toString();

  return apiRequest<DashboardResponse>(
    `/dashboard${query ? `?${query}` : ""}`,
  );
}

/* =========================================================
   DASHBOARD SUMMARY
========================================================= */

export async function getDashboardSummary(
  targetDate?: string,
): Promise<DashboardSummary> {
  const params = new URLSearchParams();

  if (targetDate) {
    params.set("target_date", targetDate);
  }

  const query = params.toString();

  return apiRequest<DashboardSummary>(
    `/dashboard/summary${query ? `?${query}` : ""}`,
  );
}

/* =========================================================
   PRODUCTION
========================================================= */

export async function getDashboardProduction(
  params: DashboardProductionParams = {},
): Promise<DashboardProduction> {
  const searchParams = new URLSearchParams();

  if (params.start_date) {
    searchParams.set("start_date", params.start_date);
  }

  if (params.end_date) {
    searchParams.set("end_date", params.end_date);
  }

  const query = searchParams.toString();

  return apiRequest<DashboardProduction>(
    `/dashboard/production${query ? `?${query}` : ""}`,
  );
}

/* =========================================================
   RECENT ACTIVITIES
========================================================= */

export async function getDashboardActivities(
  limit = 10,
): Promise<DashboardActivity[]> {
  const params = new URLSearchParams();

  params.set("limit", String(limit));

  return apiRequest<DashboardActivity[]>(
    `/dashboard/activities?${params.toString()}`,
  );
}

/* =========================================================
   OPERATIONAL HEALTH
========================================================= */

export async function getOperationalHealth(
  targetDate?: string,
): Promise<DashboardOperationalHealth> {
  const params = new URLSearchParams();

  if (targetDate) {
    params.set("target_date", targetDate);
  }

  const query = params.toString();

  return apiRequest<DashboardOperationalHealth>(
    `/dashboard/operational-health${query ? `?${query}` : ""}`,
  );
}

/* =========================================================
   CONVENIENCE API OBJECT
========================================================= */

const dashboardApi = {
  getDashboard,
  getDashboardSummary,
  getDashboardProduction,
  getDashboardActivities,
  getOperationalHealth,
};

export default dashboardApi;