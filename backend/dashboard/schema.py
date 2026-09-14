from datetime import date
from typing import Literal

from pydantic import BaseModel


DashboardTrend = Literal["up", "down", "neutral"]


class DashboardKPI(BaseModel):
    title: str
    value: str | float | int
    unit: str | None = None
    change: str | None = None
    trend: DashboardTrend = "neutral"
    description: str | None = None


class DashboardProductionPoint(BaseModel):
    date: date
    extracted: float
    processed: float
    output: float


class DashboardProduction(BaseModel):
    chart: list[DashboardProductionPoint]
    target: float
    actual: float
    achievement: float
    remaining: float


class DashboardEquipment(BaseModel):
    name: str
    type: str
    status: str
    utilization: float


class DashboardActivity(BaseModel):
    title: str
    description: str
    time: str
    category: str


class DashboardOperationalHealth(BaseModel):
    production_target: float
    equipment_availability: float | None = None
    safety_compliance: float | None = None
    workforce_attendance: float | None = None


class DashboardMineStatus(BaseModel):
    status: str


class DashboardSummaryResponse(BaseModel):
    kpis: list[DashboardKPI]

    total_extracted: float
    total_processed: float
    total_output: float

    production_target: float
    target_achievement: float
    remaining_production: float

    processing_efficiency: float
    operating_efficiency: float

    operating_hours: float
    downtime: float

    active_issues: int
    high_priority_issues: int

    active_shifts: int
    total_workers: int

    mine_status: str


class DashboardResponse(BaseModel):
    summary: DashboardSummaryResponse
    production: DashboardProduction
    equipment: list[DashboardEquipment]
    activities: list[DashboardActivity]
    operational_health: DashboardOperationalHealth
    mine_status: DashboardMineStatus