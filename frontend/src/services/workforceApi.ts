import axios from "axios";

const API_BASE_URL =
  `${import.meta.env.VITE_API_URL || "https://smartmine-backend-wdva.onrender.com"}/api/v1/workforce`;

const workforceClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
  },
});


export type Worker = {
  id: number;
  employeeNumber: string;
  name: string;
  role: string;
  department: string;
  shift: "Day Shift" | "Night Shift";
  status: "Present" | "Absent" | "Late" | "Off Duty";
  phone: string;
  startDate: string;
  safetyStatus: "Compliant" | "Training Due";
};


export type WorkerInput = Omit<Worker, "id">;


export type WorkforceSummary = {
  totalWorkforce: number;
  presentToday: number;
  absent: number;
  late: number;
  offDuty: number;
  trainingDue: number;
  attendanceRate: number;
  safetyComplianceRate: number;
  shiftCoverage: number;
};


export type WorkforceDashboard = {
  summary: WorkforceSummary;
  workers: Worker[];
};


export type WorkforceIssue = {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: "High" | "Medium" | "Low";
};


export const workforceApi = {

  async getDashboard(): Promise<WorkforceDashboard> {
    const response =
      await workforceClient.get<WorkforceDashboard>(
        "/dashboard",
      );

    return response.data;
  },


  async getSummary(): Promise<WorkforceSummary> {
    const response =
      await workforceClient.get<WorkforceSummary>(
        "/summary",
      );

    return response.data;
  },


  async getWorkers(params?: {
    department?: string;
    status?: string;
    search?: string;
  }): Promise<Worker[]> {

    const response =
      await workforceClient.get<Worker[]>(
        "/workers",
        {
          params,
        },
      );

    return response.data;
  },


  async getWorker(
    workerId: number,
  ): Promise<Worker> {

    const response =
      await workforceClient.get<Worker>(
        `/workers/${workerId}`,
      );

    return response.data;
  },


  async getWorkerByEmployeeNumber(
    employeeNumber: string,
  ): Promise<Worker> {

    const response =
      await workforceClient.get<Worker>(
        `/workers/employee/${encodeURIComponent(employeeNumber)}`,
      );

    return response.data;
  },


  async createWorker(
    worker: WorkerInput,
  ): Promise<Worker> {

    const response =
      await workforceClient.post<Worker>(
        "/workers",
        worker,
      );

    return response.data;
  },


  async updateWorker(
    workerId: number,
    worker: Partial<WorkerInput>,
  ): Promise<Worker> {

    const response =
      await workforceClient.put<Worker>(
        `/workers/${workerId}`,
        worker,
      );

    return response.data;
  },


  async deleteWorker(
    workerId: number,
  ): Promise<void> {

    await workforceClient.delete(
      `/workers/${workerId}`,
    );
  },


  async updateWorkerStatus(
    workerId: number,
    status: Worker["status"],
  ): Promise<Worker> {

    const response =
      await workforceClient.put<Worker>(
        `/workers/${workerId}/status`,
        {
          status,
        },
      );

    return response.data;
  },


  async updateWorkerSafety(
    workerId: number,
    safetyStatus: Worker["safetyStatus"],
  ): Promise<Worker> {

    const response =
      await workforceClient.put<Worker>(
        `/workers/${workerId}/safety`,
        {
          safetyStatus,
        },
      );

    return response.data;
  },


  async getIssues(): Promise<WorkforceIssue[]> {

    const response =
      await workforceClient.get<WorkforceIssue[]>(
        "/issues",
      );

    return response.data;
  },
};


export default workforceApi;