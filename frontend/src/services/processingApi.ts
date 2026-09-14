import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8001";

const processingClient = axios.create({
  baseURL: `${API_URL}/api/v1/processing`,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
  },
});

processingClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    console.error(
      `Processing API error ${status || ""}:`,
      detail || error.message
    );

    return Promise.reject(error);
  }
);

/* =========================================================
   PROCESSING RECORD TYPES
========================================================= */

export interface ProcessingRecord {
  id: number;
  date: string;
  shift: string;
  materialReceived: number;
  crushed: number;
  processed: number;
  output: number;
  operatingHours: number;
  downtime: number;
  status:
    | "Completed"
    | "In Progress"
    | "Delayed";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessingRecordCreate {
  date: string;
  shift: string;
  materialReceived: number;
  crushed: number;
  processed: number;
  output: number;
  operatingHours: number;
  downtime: number;
  status:
    | "Completed"
    | "In Progress"
    | "Delayed";
  notes?: string | null;
}

export interface ProcessingRecordUpdate {
  date?: string;
  shift?: string;
  materialReceived?: number;
  crushed?: number;
  processed?: number;
  output?: number;
  operatingHours?: number;
  downtime?: number;
  status?:
    | "Completed"
    | "In Progress"
    | "Delayed";
  notes?: string | null;
}

/* =========================================================
   PROCESSING SUMMARY
========================================================= */

export interface ProcessingSummary {
  totalMaterialReceived: number;
  totalCrushed: number;
  totalProcessed: number;
  totalOutput: number;
  totalOperatingHours: number;
  totalDowntime: number;
  crusherEfficiency: number;
  processingEfficiency: number;
  operatingEfficiency: number;
  completedRecords: number;
  inProgressRecords: number;
  delayedRecords: number;
}

/* =========================================================
   PROCESSING CHART
========================================================= */

export interface ProcessingChartPoint {
  day: string;
  date: string;
  materialReceived: number;
  crushed: number;
  processed: number;
  output: number;
}

/* =========================================================
   PROCESSING ISSUES
========================================================= */

export interface ProcessingIssue {
  id: number;
  title: string;
  description: string | null;
  category: string;
  priority:
    | "Low"
    | "Medium"
    | "High";
  duration: string;
  durationMinutes: number | null;
  status:
    | "Active"
    | "Resolved";
  createdAt: string;
  updatedAt: string;
}

export interface ProcessingIssueCreate {
  title: string;
  description?: string | null;
  category: string;
  priority?:
    | "Low"
    | "Medium"
    | "High";
  durationMinutes?: number | null;
  status?:
    | "Active"
    | "Resolved";
}

export interface ProcessingIssueUpdate {
  title?: string;
  description?: string | null;
  category?: string;
  priority?:
    | "Low"
    | "Medium"
    | "High";
  durationMinutes?: number | null;
  status?:
    | "Active"
    | "Resolved";
}

/* =========================================================
   PROCESSING TARGETS
========================================================= */

export interface ProcessingTarget {
  id: number;
  date: string;
  target: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessingTargetProgress {
  targetDate: string;
  targetOutput: number;
  actualOutput: number;
  remainingOutput: number;
  progressPercentage: number;
}

/* =========================================================
   PROCESSING DASHBOARD
========================================================= */

export interface ProcessingDashboard {
  records: ProcessingRecord[];
  summary: ProcessingSummary;
  chart: ProcessingChartPoint[];
  issues: ProcessingIssue[];
  target: ProcessingTarget | null;
  targetProgress: ProcessingTargetProgress | null;
}

/* =========================================================
   PROCESSING API
========================================================= */

export const processingApi = {
  /* -------------------------------------------------------
     RECORDS
  ------------------------------------------------------- */

  getRecords: async (
    startDate?: string,
    endDate?: string
  ): Promise<ProcessingRecord[]> => {
    const response = await processingClient.get(
      "/records",
      {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      }
    );

    return response.data;
  },

  getRecord: async (
    recordId: number
  ): Promise<ProcessingRecord> => {
    const response = await processingClient.get(
      `/records/${recordId}`
    );

    return response.data;
  },

  createRecord: async (
    data: ProcessingRecordCreate
  ): Promise<ProcessingRecord> => {
    const response = await processingClient.post(
      "/records",
      data
    );

    return response.data;
  },

  updateRecord: async (
    recordId: number,
    data: ProcessingRecordUpdate
  ): Promise<ProcessingRecord> => {
    const response = await processingClient.put(
      `/records/${recordId}`,
      data
    );

    return response.data;
  },

  deleteRecord: async (
    recordId: number
  ): Promise<void> => {
    await processingClient.delete(
      `/records/${recordId}`
    );
  },

  /* -------------------------------------------------------
     SUMMARY
  ------------------------------------------------------- */

  getSummary: async (
    startDate?: string,
    endDate?: string
  ): Promise<ProcessingSummary> => {
    const response = await processingClient.get(
      "/summary",
      {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      }
    );

    return response.data;
  },

  /* -------------------------------------------------------
     CHART
  ------------------------------------------------------- */

  getChart: async (
    startDate?: string,
    endDate?: string
  ): Promise<ProcessingChartPoint[]> => {
    const response = await processingClient.get(
      "/chart",
      {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      }
    );

    return response.data;
  },

  /* -------------------------------------------------------
     ISSUES
  ------------------------------------------------------- */

  getIssues: async (
    status?: "Active" | "Resolved"
  ): Promise<ProcessingIssue[]> => {
    const response = await processingClient.get(
      "/issues",
      {
        params: {
          status,
        },
      }
    );

    return response.data;
  },

  getIssue: async (
    issueId: number
  ): Promise<ProcessingIssue> => {
    const response = await processingClient.get(
      `/issues/${issueId}`
    );

    return response.data;
  },

  createIssue: async (
    data: ProcessingIssueCreate
  ): Promise<ProcessingIssue> => {
    const response = await processingClient.post(
      "/issues",
      data
    );

    return response.data;
  },

  updateIssue: async (
    issueId: number,
    data: ProcessingIssueUpdate
  ): Promise<ProcessingIssue> => {
    const response = await processingClient.put(
      `/issues/${issueId}`,
      data
    );

    return response.data;
  },

  deleteIssue: async (
    issueId: number
  ): Promise<void> => {
    await processingClient.delete(
      `/issues/${issueId}`
    );
  },

  /* -------------------------------------------------------
     TARGETS
  ------------------------------------------------------- */

  getTarget: async (
    targetDate: string
  ): Promise<ProcessingTarget | null> => {
    const response = await processingClient.get(
      `/targets/${targetDate}`
    );

    return response.data;
  },

  createTarget: async (
    targetDate: string,
    targetOutput: number
  ): Promise<ProcessingTarget> => {
    const response = await processingClient.post(
      "/targets",
      {
        target_date: targetDate,
        target_output: targetOutput,
      }
    );

    return response.data;
  },

  updateTarget: async (
    targetId: number,
    targetOutput: number
  ): Promise<ProcessingTarget> => {
    const response = await processingClient.put(
      `/targets/${targetId}`,
      {
        target_output: targetOutput,
      }
    );

    return response.data;
  },

  getTargetProgress: async (
    targetDate: string
  ): Promise<ProcessingTargetProgress | null> => {
    const response = await processingClient.get(
      `/targets/${targetDate}/progress`
    );

    return response.data;
  },

  /* -------------------------------------------------------
     DASHBOARD
  ------------------------------------------------------- */

  getDashboard: async (
    startDate?: string,
    endDate?: string
  ): Promise<ProcessingDashboard> => {
    const response = await processingClient.get(
      "/dashboard",
      {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      }
    );

    return response.data;
  },
};

export default processingApi;