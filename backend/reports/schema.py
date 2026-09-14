from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


ReportPeriod = Literal[
    "Weekly",
    "Monthly",
    "Quarterly",
    "Annual",
]


ReportCategory = Literal[
    "Operations",
    "Production",
    "Processing",
    "Equipment",
    "Workforce",
    "Inventory",
    "Fuel",
    "Safety",
    "Finance",
    "Sales",
]


ReportStatus = Literal[
    "Ready",
    "Pending",
    "Attention Required",
]


class ReportBase(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    name: str = Field(
        min_length=1,
        max_length=255,
    )

    category: ReportCategory

    period: ReportPeriod

    generated_date: str = Field(
        min_length=1,
        max_length=50,
    )

    status: ReportStatus = "Ready"

    records: int = Field(
        ge=0,
    )

    summary: str = Field(
        min_length=1,
    )


class ReportCreate(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
    )

    period: ReportPeriod

    category: ReportCategory = "Operations"


class ReportUpdateRequest(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
    )

    name: str = Field(
        min_length=1,
        max_length=255,
    )

    category: ReportCategory

    period: ReportPeriod

    status: ReportStatus = "Ready"

    records: int = Field(
        ge=0,
    )

    summary: str = Field(
        min_length=1,
    )


class ReportResponse(ReportBase):
    id: int


class ReportStatsResponse(BaseModel):
    ready: int
    attention: int
    pending: int
    records: int


class ReportOverviewResponse(BaseModel):
    current: int
    previous: int
    change: int
    values: list[int]


class ReportPerformanceMetric(BaseModel):
    title: str
    value: str
    target: str
    percentage: int


class ReportOperationalMetric(BaseModel):
    title: str
    value: str
    detail: str
    percentage: int


class ReportFinancialResponse(BaseModel):
    revenue: float
    expenses: float
    profit: float
    margin: int


class ReportsDashboardResponse(BaseModel):
    stats: ReportStatsResponse
    overview: ReportOverviewResponse
    performance: list[ReportPerformanceMetric]
    operational: list[ReportOperationalMetric]
    financial: ReportFinancialResponse