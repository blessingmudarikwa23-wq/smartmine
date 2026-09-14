import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8001";

const equipmentClient = axios.create({
  baseURL: `${API_URL}/api/v1/equipment`,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
  },
});

equipmentClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    console.error(
      `Equipment API error ${status || ""}:`,
      detail || error.message,
    );

    return Promise.reject(error);
  },
);

export type EquipmentStatus =
  | "Running"
  | "Available"
  | "Maintenance"
  | "Down";

export interface EquipmentRecord {
  id: number;
  equipmentId: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  location: string;
  status: EquipmentStatus;
  operatingHours: number;
  utilisation: number;
  lastMaintenance: string | null;
  nextMaintenance: string | null;
  maintenanceInterval: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentCreate {
  equipmentId: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  location: string;
  status: EquipmentStatus;
  operatingHours: number;
  utilisation: number;
  lastMaintenance?: string | null;
  nextMaintenance?: string | null;
  maintenanceInterval: number;
  notes?: string | null;
}

export interface EquipmentUpdate {
  equipmentId?: string;
  name?: string;
  type?: string;
  manufacturer?: string;
  model?: string;
  location?: string;
  status?: EquipmentStatus;
  operatingHours?: number;
  utilisation?: number;
  lastMaintenance?: string | null;
  nextMaintenance?: string | null;
  maintenanceInterval?: number;
  notes?: string | null;
}

export interface EquipmentSummary {
  totalEquipment: number;
  running: number;
  available: number;
  maintenance: number;
  down: number;
  averageUtilisation: number;
  totalOperatingHours: number;
}

export interface EquipmentStatusRecord {
  equipmentId: string;
  name: string;
  status: EquipmentStatus;
  location: string;
  operatingHours: number;
  utilisation: number;
}

export interface EquipmentDashboard {
  equipment: EquipmentRecord[];
  summary: EquipmentSummary;
}

function mapEquipment(item: any): EquipmentRecord {
  return {
    id: item.id,
    equipmentId: item.equipment_id,
    name: item.name,
    type: item.type,
    manufacturer: item.manufacturer,
    model: item.model,
    location: item.location,
    status: item.status,
    operatingHours: item.operating_hours,
    utilisation: item.utilisation,
    lastMaintenance: item.last_maintenance,
    nextMaintenance: item.next_maintenance,
    maintenanceInterval: item.maintenance_interval,
    notes: item.notes,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

function mapSummary(item: any): EquipmentSummary {
  return {
    totalEquipment: item.total_equipment,
    running: item.running,
    available: item.available,
    maintenance: item.maintenance,
    down: item.down,
    averageUtilisation: item.average_utilisation,
    totalOperatingHours: item.total_operating_hours,
  };
}

export const equipmentApi = {
  getEquipment: async (
    search?: string,
    status?: EquipmentStatus,
    type?: string,
    location?: string,
  ): Promise<EquipmentRecord[]> => {
    const params = {
      search,
      status,
      type,
      location,
    };

    const response = await equipmentClient.get("", {
      params,
    });

    return response.data.map(mapEquipment);
  },

  getEquipmentById: async (
    id: number,
  ): Promise<EquipmentRecord> => {
    const response = await equipmentClient.get(`/${id}`);

    return mapEquipment(response.data);
  },

  getEquipmentByCode: async (
    equipmentCode: string,
  ): Promise<EquipmentRecord> => {
    const response = await equipmentClient.get(
      `/code/${equipmentCode}`,
    );

    return mapEquipment(response.data);
  },

  createEquipment: async (
    data: EquipmentCreate,
  ): Promise<EquipmentRecord> => {
    const response = await equipmentClient.post("", {
      equipment_id: data.equipmentId,
      name: data.name,
      type: data.type,
      manufacturer: data.manufacturer,
      model: data.model,
      location: data.location,
      status: data.status,
      operating_hours: data.operatingHours,
      utilisation: data.utilisation,
      last_maintenance: data.lastMaintenance || null,
      next_maintenance: data.nextMaintenance || null,
      maintenance_interval: data.maintenanceInterval,
      notes: data.notes || null,
    });

    return mapEquipment(response.data);
  },

  updateEquipment: async (
    id: number,
    data: EquipmentUpdate,
  ): Promise<EquipmentRecord> => {
    const payload: Record<string, unknown> = {};

    if (data.equipmentId !== undefined) {
      payload.equipment_id = data.equipmentId;
    }

    if (data.name !== undefined) {
      payload.name = data.name;
    }

    if (data.type !== undefined) {
      payload.type = data.type;
    }

    if (data.manufacturer !== undefined) {
      payload.manufacturer = data.manufacturer;
    }

    if (data.model !== undefined) {
      payload.model = data.model;
    }

    if (data.location !== undefined) {
      payload.location = data.location;
    }

    if (data.status !== undefined) {
      payload.status = data.status;
    }

    if (data.operatingHours !== undefined) {
      payload.operating_hours = data.operatingHours;
    }

    if (data.utilisation !== undefined) {
      payload.utilisation = data.utilisation;
    }

    if (data.lastMaintenance !== undefined) {
      payload.last_maintenance = data.lastMaintenance;
    }

    if (data.nextMaintenance !== undefined) {
      payload.next_maintenance = data.nextMaintenance;
    }

    if (data.maintenanceInterval !== undefined) {
      payload.maintenance_interval =
        data.maintenanceInterval;
    }

    if (data.notes !== undefined) {
      payload.notes = data.notes;
    }

    const response = await equipmentClient.put(
      `/${id}`,
      payload,
    );

    return mapEquipment(response.data);
  },

  updateStatus: async (
    equipmentCode: string,
    status: EquipmentStatus,
  ): Promise<EquipmentRecord> => {
    const response = await equipmentClient.put(
      `/status/${equipmentCode}`,
      {
        status,
      },
    );

    return mapEquipment(response.data);
  },

  deleteEquipment: async (
    id: number,
  ): Promise<void> => {
    await equipmentClient.delete(`/${id}`);
  },

  getSummary: async (): Promise<EquipmentSummary> => {
    const response = await equipmentClient.get(
      "/summary",
    );

    return mapSummary(response.data);
  },

  getStatus: async (): Promise<
    EquipmentStatusRecord[]
  > => {
    const response = await equipmentClient.get(
      "/status",
    );

    return response.data.map((item: any) => ({
      equipmentId: item.equipment_id,
      name: item.name,
      status: item.status,
      location: item.location,
      operatingHours: item.operating_hours,
      utilisation: item.utilisation,
    }));
  },

  getDashboard: async (): Promise<EquipmentDashboard> => {
    const response = await equipmentClient.get(
      "/dashboard",
    );

    return {
      equipment: response.data.equipment.map(
        mapEquipment,
      ),
      summary: mapSummary(
        response.data.summary,
      ),
    };
  },

  getUpcomingMaintenance: async (): Promise<
    EquipmentRecord[]
  > => {
    const response = await equipmentClient.get(
      "/maintenance/upcoming",
    );

    return response.data.map(mapEquipment);
  },
};

export default equipmentApi;