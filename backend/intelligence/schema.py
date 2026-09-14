from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


IntelligenceCategory = Literal[
    "Production",
    "Equipment",
    "Fuel",
    "Safety",
    "Inventory",
    "Finance",
]

IntelligenceSeverity = Literal[
    "Low",
    "Medium",
    "High",
]


class ProductionSnapshot(BaseModel):
    extracted_today: float
    processed_today: float
    target_today: float
    efficiency: float


class EquipmentSnapshot(BaseModel):
    total: int
    available: int
    utilisation: float
    downtime_hours: float


class WorkforceSnapshot(BaseModel):
    total: int
    present: int
    attendance: float


class InventorySnapshot(BaseModel):
    items: int
    stock_health: float
    critical_items: int


class FuelSnapshot(BaseModel):
    consumed_today: float
    stock_litres: float
    estimated_cost: float


class SafetySnapshot(BaseModel):
    incidents_this_month: int
    near_misses: int
    compliance: float
    open_actions: int


class FinanceSnapshot(BaseModel):
    revenue: float
    expenses: float
    operating_result: float


class MineSnapshotResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    production: ProductionSnapshot
    equipment: EquipmentSnapshot
    workforce: WorkforceSnapshot
    inventory: InventorySnapshot
    fuel: FuelSnapshot
    safety: SafetySnapshot
    finance: FinanceSnapshot


class IntelligenceInsightResponse(BaseModel):
    id: int
    title: str
    description: str
    category: IntelligenceCategory
    severity: IntelligenceSeverity
    recommendation: str


class IntelligenceMessageResponse(BaseModel):
    id: int
    role: Literal["user", "assistant"]
    content: str
    timestamp: str


class IntelligenceAskRequest(BaseModel):
    question: str = Field(
        min_length=1,
        max_length=2000,
    )

    snapshot: MineSnapshotResponse


class IntelligenceAskResponse(BaseModel):
    answer: str


class IntelligenceDashboardResponse(BaseModel):
    intelligence_score: int
    snapshot: MineSnapshotResponse
    insights: list[IntelligenceInsightResponse]