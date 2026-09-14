from datetime import date as Date, time as Time
from typing import Literal

from pydantic import BaseModel, Field, model_validator


# ============================================================
# STATUS TYPES
# ============================================================

ProductionStatus = Literal[
    "Completed",
    "In Progress",
    "Delayed",
]

IssuePriority = Literal[
    "Low",
    "Medium",
    "High",
]

IssueStatus = Literal[
    "Active",
    "Resolved",
]

ShiftStatus = Literal[
    "Upcoming",
    "Active",
    "Completed",
]


# ============================================================
# PRODUCTION RECORDS
# ============================================================

class ProductionRecordCreate(BaseModel):
    date: Date
    shift: str = Field(
        min_length=2,
        max_length=50,
    )

    extracted: float = Field(
        default=0,
        ge=0,
    )

    processed: float = Field(
        default=0,
        ge=0,
    )

    output: float = Field(
        default=0,
        ge=0,
    )

    operatingHours: float = Field(
        default=0,
        ge=0,
    )

    downtime: float = Field(
        default=0,
        ge=0,
    )

    status: ProductionStatus = "In Progress"

    notes: str | None = Field(
        default=None,
        max_length=2000,
    )

    @model_validator(mode="after")
    def validate_production(self):
        if self.processed > self.extracted:
            raise ValueError(
                "Processed tonnes cannot be greater than extracted tonnes."
            )

        if self.downtime > self.operatingHours:
            raise ValueError(
                "Downtime cannot be greater than operating hours."
            )

        return self


class ProductionRecordUpdate(BaseModel):
    date: Date | None = None

    shift: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    extracted: float | None = Field(
        default=None,
        ge=0,
    )

    processed: float | None = Field(
        default=None,
        ge=0,
    )

    output: float | None = Field(
        default=None,
        ge=0,
    )

    operatingHours: float | None = Field(
        default=None,
        ge=0,
    )

    downtime: float | None = Field(
        default=None,
        ge=0,
    )

    status: ProductionStatus | None = None

    notes: str | None = Field(
        default=None,
        max_length=2000,
    )


class ProductionRecordResponse(BaseModel):
    id: int
    date: Date
    shift: str

    extracted: float
    processed: float
    output: float

    operatingHours: float
    downtime: float

    status: ProductionStatus
    notes: str | None

    createdAt: str
    updatedAt: str


# ============================================================
# PRODUCTION SUMMARY
# ============================================================

class ProductionSummary(BaseModel):
    total_extracted: float
    total_processed: float
    total_output: float

    total_operating_hours: float
    total_downtime: float

    processing_efficiency: float
    operating_efficiency: float

    completed_records: int
    in_progress_records: int
    delayed_records: int


# ============================================================
# PRODUCTION CHART
# ============================================================

class ProductionChartPoint(BaseModel):
    day: str
    date: Date

    extracted: float
    processed: float
    output: float


# ============================================================
# PRODUCTION TARGETS
# ============================================================

class ProductionTargetCreate(BaseModel):
    target_date: Date

    target_output: float = Field(
        ge=0,
    )


class ProductionTargetResponse(BaseModel):
    id: int
    date: Date
    target: float

    createdAt: str
    updatedAt: str


class ProductionTargetProgress(BaseModel):
    target_date: Date

    target_output: float
    actual_output: float
    remaining_output: float

    progress_percentage: float


# ============================================================
# OPERATIONAL ISSUES
# ============================================================

class OperationalIssueCreate(BaseModel):
    title: str = Field(
        min_length=2,
        max_length=150,
    )

    description: str | None = Field(
        default=None,
        max_length=2000,
    )

    category: str = Field(
        min_length=2,
        max_length=50,
    )

    priority: IssuePriority = "Medium"

    durationMinutes: int | None = Field(
        default=None,
        ge=0,
    )

    status: IssueStatus = "Active"


class OperationalIssueUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    description: str | None = Field(
        default=None,
        max_length=2000,
    )

    category: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    priority: IssuePriority | None = None

    durationMinutes: int | None = Field(
        default=None,
        ge=0,
    )

    status: IssueStatus | None = None


class OperationalIssueResponse(BaseModel):
    id: int

    title: str
    description: str | None

    category: str
    priority: IssuePriority

    duration: str
    durationMinutes: int | None

    status: IssueStatus

    createdAt: str
    updatedAt: str


# ============================================================
# MINE SHIFTS
# ============================================================

class MineShiftCreate(BaseModel):
    date: Date

    shift: str = Field(
        min_length=2,
        max_length=50,
    )

    status: ShiftStatus = "Upcoming"

    supervisor: str = Field(
        min_length=2,
        max_length=150,
    )

    startTime: Time
    endTime: Time

    workers: int = Field(
        default=0,
        ge=0,
    )


class MineShiftUpdate(BaseModel):
    date: Date | None = None

    shift: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    status: ShiftStatus | None = None

    supervisor: str | None = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    startTime: Time | None = None
    endTime: Time | None = None

    workers: int | None = Field(
        default=None,
        ge=0,
    )


class MineShiftResponse(BaseModel):
    id: int

    date: Date
    shift: str
    status: ShiftStatus

    supervisor: str

    startTime: str
    endTime: str

    workers: int

    production: float
    operatingHours: float
    downtime: float


class CurrentShiftResponse(BaseModel):
    id: int | None = None

    date: Date | None = None
    shift: str | None = None
    status: ShiftStatus | None = None

    supervisor: str | None = None

    startTime: str | None = None
    endTime: str | None = None

    workers: int = 0

    production: float = 0
    operatingHours: float = 0
    downtime: float = 0