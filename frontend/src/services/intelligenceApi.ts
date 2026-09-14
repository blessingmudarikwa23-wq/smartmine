import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://smartmine-backend-wdva.onrender.com";

const intelligenceApi = axios.create({
  baseURL: `${API_URL}/api/v1/intelligence`,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
  },
});

export type IntelligenceCategory =
  | "Production"
  | "Equipment"
  | "Fuel"
  | "Safety"
  | "Inventory"
  | "Finance";

export type IntelligenceSeverity =
  | "Low"
  | "Medium"
  | "High";

export type ProductionSnapshot = {
  extractedToday: number;
  processedToday: number;
  targetToday: number;
  efficiency: number;
};

export type EquipmentSnapshot = {
  total: number;
  available: number;
  utilisation: number;
  downtimeHours: number;
};

export type WorkforceSnapshot = {
  total: number;
  present: number;
  attendance: number;
};

export type InventorySnapshot = {
  items: number;
  stockHealth: number;
  criticalItems: number;
};

export type FuelSnapshot = {
  consumedToday: number;
  stockLitres: number;
  estimatedCost: number;
};

export type SafetySnapshot = {
  incidentsThisMonth: number;
  nearMisses: number;
  compliance: number;
  openActions: number;
};

export type FinanceSnapshot = {
  revenue: number;
  expenses: number;
  operatingResult: number;
};

export type MineSnapshot = {
  production: ProductionSnapshot;
  equipment: EquipmentSnapshot;
  workforce: WorkforceSnapshot;
  inventory: InventorySnapshot;
  fuel: FuelSnapshot;
  safety: SafetySnapshot;
  finance: FinanceSnapshot;
};

export type IntelligenceInsight = {
  id: number;
  title: string;
  description: string;
  category: IntelligenceCategory;
  severity: IntelligenceSeverity;
  recommendation: string;
};

export type IntelligenceDashboard = {
  intelligenceScore: number;
  snapshot: MineSnapshot;
  insights: IntelligenceInsight[];
};

type BackendMineSnapshot = {
  production: {
    extracted_today: number;
    processed_today: number;
    target_today: number;
    efficiency: number;
  };
  equipment: {
    total: number;
    available: number;
    utilisation: number;
    downtime_hours: number;
  };
  workforce: {
    total: number;
    present: number;
    attendance: number;
  };
  inventory: {
    items: number;
    stock_health: number;
    critical_items: number;
  };
  fuel: {
    consumed_today: number;
    stock_litres: number;
    estimated_cost: number;
  };
  safety: {
    incidents_this_month: number;
    near_misses: number;
    compliance: number;
    open_actions: number;
  };
  finance: {
    revenue: number;
    expenses: number;
    operating_result: number;
  };
};

type BackendInsight = {
  id: number;
  title: string;
  description: string;
  category: IntelligenceCategory;
  severity: IntelligenceSeverity;
  recommendation: string;
};

type BackendDashboard = {
  intelligence_score: number;
  snapshot: BackendMineSnapshot;
  insights: BackendInsight[];
};

const mapSnapshot = (
  snapshot: BackendMineSnapshot,
): MineSnapshot => ({
  production: {
    extractedToday:
      Number(snapshot.production.extracted_today),
    processedToday:
      Number(snapshot.production.processed_today),
    targetToday:
      Number(snapshot.production.target_today),
    efficiency:
      Number(snapshot.production.efficiency),
  },

  equipment: {
    total:
      Number(snapshot.equipment.total),
    available:
      Number(snapshot.equipment.available),
    utilisation:
      Number(snapshot.equipment.utilisation),
    downtimeHours:
      Number(snapshot.equipment.downtime_hours),
  },

  workforce: {
    total:
      Number(snapshot.workforce.total),
    present:
      Number(snapshot.workforce.present),
    attendance:
      Number(snapshot.workforce.attendance),
  },

  inventory: {
    items:
      Number(snapshot.inventory.items),
    stockHealth:
      Number(snapshot.inventory.stock_health),
    criticalItems:
      Number(snapshot.inventory.critical_items),
  },

  fuel: {
    consumedToday:
      Number(snapshot.fuel.consumed_today),
    stockLitres:
      Number(snapshot.fuel.stock_litres),
    estimatedCost:
      Number(snapshot.fuel.estimated_cost),
  },

  safety: {
    incidentsThisMonth:
      Number(
        snapshot.safety.incidents_this_month,
      ),
    nearMisses:
      Number(snapshot.safety.near_misses),
    compliance:
      Number(snapshot.safety.compliance),
    openActions:
      Number(snapshot.safety.open_actions),
  },

  finance: {
    revenue:
      Number(snapshot.finance.revenue),
    expenses:
      Number(snapshot.finance.expenses),
    operatingResult:
      Number(
        snapshot.finance.operating_result,
      ),
  },
});

const mapInsight = (
  insight: BackendInsight,
): IntelligenceInsight => ({
  id: Number(insight.id),
  title: insight.title,
  description: insight.description,
  category: insight.category,
  severity: insight.severity,
  recommendation: insight.recommendation,
});

export const getIntelligenceDashboard =
  async (): Promise<IntelligenceDashboard> => {
    const response =
      await intelligenceApi.get<BackendDashboard>(
        "/dashboard",
      );

    return {
      intelligenceScore:
        Number(
          response.data.intelligence_score,
        ),
      snapshot: mapSnapshot(
        response.data.snapshot,
      ),
      insights:
        response.data.insights.map(
          mapInsight,
        ),
    };
  };

export const getMineSnapshot =
  async (): Promise<MineSnapshot> => {
    const response =
      await intelligenceApi.get<BackendMineSnapshot>(
        "/snapshot",
      );

    return mapSnapshot(
      response.data,
    );
  };

export const getIntelligenceInsights =
  async (): Promise<IntelligenceInsight[]> => {
    const response =
      await intelligenceApi.get<
        BackendInsight[]
      >("/insights");

    return response.data.map(
      mapInsight,
    );
  };

export const askSmartMineAI =
  async (
    question: string,
    snapshot: MineSnapshot,
  ): Promise<string> => {
    const response =
      await intelligenceApi.post<{
        answer: string;
      }>("/ask", {
        question,
        snapshot: {
          production: {
            extracted_today:
              snapshot.production.extractedToday,
            processed_today:
              snapshot.production.processedToday,
            target_today:
              snapshot.production.targetToday,
            efficiency:
              snapshot.production.efficiency,
          },

          equipment: {
            total:
              snapshot.equipment.total,
            available:
              snapshot.equipment.available,
            utilisation:
              snapshot.equipment.utilisation,
            downtime_hours:
              snapshot.equipment.downtimeHours,
          },

          workforce: {
            total:
              snapshot.workforce.total,
            present:
              snapshot.workforce.present,
            attendance:
              snapshot.workforce.attendance,
          },

          inventory: {
            items:
              snapshot.inventory.items,
            stock_health:
              snapshot.inventory.stockHealth,
            critical_items:
              snapshot.inventory.criticalItems,
          },

          fuel: {
            consumed_today:
              snapshot.fuel.consumedToday,
            stock_litres:
              snapshot.fuel.stockLitres,
            estimated_cost:
              snapshot.fuel.estimatedCost,
          },

          safety: {
            incidents_this_month:
              snapshot.safety
                .incidentsThisMonth,
            near_misses:
              snapshot.safety.nearMisses,
            compliance:
              snapshot.safety.compliance,
            open_actions:
              snapshot.safety.openActions,
          },

          finance: {
            revenue:
              snapshot.finance.revenue,
            expenses:
              snapshot.finance.expenses,
            operating_result:
              snapshot.finance
                .operatingResult,
          },
        },
      });

    return response.data.answer;
  };

export default intelligenceApi;