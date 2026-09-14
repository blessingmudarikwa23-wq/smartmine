import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://smartmine-backend-wdva.onrender.com";

const reportsApi = axios.create({
  baseURL: `${API_URL}/api/v1/reports`,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
  },
});

export type ReportPeriod =
  | "Weekly"
  | "Monthly"
  | "Quarterly"
  | "Annual";

export type ReportCategory =
  | "Operations"
  | "Production"
  | "Processing"
  | "Equipment"
  | "Workforce"
  | "Inventory"
  | "Fuel"
  | "Safety"
  | "Finance"
  | "Sales";

export type ReportStatus =
  | "Ready"
  | "Pending"
  | "Attention Required";

export type MineReport = {
  id: number;
  name: string;
  category: ReportCategory;
  period: ReportPeriod;
  generatedDate: string;
  status: ReportStatus;
  records: number;
  summary: string;
};

export type UpdateReportPayload = {
  name: string;
  category: ReportCategory;
  period: ReportPeriod;
  status: ReportStatus;
  records: number;
  summary: string;
};

const mapReport = (
  report: any,
): MineReport => ({
  id: Number(report.id),

  name:
    report.name ?? "",

  category:
    report.category ??
    "Operations",

  period:
    report.period ??
    "Monthly",

  generatedDate:
    report.generatedDate ??
    report.generated_date ??
    "",

  status:
    report.status ??
    "Ready",

  records:
    Number(
      report.records ?? 0,
    ),

  summary:
    report.summary ?? "",
});

export const reportsService = {
  async getReports(
    period?: ReportPeriod,
    category?:
      | ReportCategory
      | "All",
    search?: string,
  ) {
    const params: Record<
      string,
      string
    > = {};

    if (period) {
      params.period = period;
    }

    if (
      category &&
      category !== "All"
    ) {
      params.category = category;
    }

    if (
      search &&
      search.trim()
    ) {
      params.search =
        search.trim();
    }

    const response =
      await reportsApi.get(
        "",
        { params },
      );

    if (
      Array.isArray(
        response.data,
      )
    ) {
      return response.data.map(
        mapReport,
      );
    }

    return [];
  },

  async getReport(
    id: number,
  ) {
    const response =
      await reportsApi.get(
        `/${id}`,
      );

    return mapReport(
      response.data,
    );
  },

  async generateReport(
    period: ReportPeriod,
    category: ReportCategory =
      "Operations",
  ) {
    const response =
      await reportsApi.post(
        "/generate",
        {
          period,
          category,
        },
      );

    return mapReport(
      response.data,
    );
  },

  async updateReport(
    id: number,
    report: UpdateReportPayload,
  ) {
    const response =
      await reportsApi.put(
        `/${id}`,
        {
          name: report.name,
          category:
            report.category,
          period:
            report.period,
          status:
            report.status,
          records:
            report.records,
          summary:
            report.summary,
        },
      );

    return mapReport(
      response.data,
    );
  },

  async deleteReport(
    id: number,
  ) {
    await reportsApi.delete(
      `/${id}`,
    );

    return true;
  },

  async getDashboard(
    period: ReportPeriod,
  ) {
    const response =
      await reportsApi.get(
        "/dashboard",
        {
          params: {
            period,
          },
        },
      );

    return response.data;
  },
};

export default reportsService;