from datetime import date as Date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


ProcessingStatus = Literal[
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


class ProcessingRecordCreate(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
    )

    date: Date
    shift: str = Field(
        min_length=2,
        max_length=50,
    )

    material_received: float = Field(
        default=0,
        alias="materialReceived",
        ge=0,
    )

    crushed: float = Field(
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

    operating_hours: float = Field(
        default=0,
        alias="operatingHours",
        ge=0,
    )

    downtime: float = Field(
        default=0,
        ge=0,
    )

    status: ProcessingStatus = "In Progress"

    notes: str | None = Field(
        default=None,
        max_length=2000,
    )

    @model_validator(mode="after")
    def validate_processing(self):
        if self.crushed > self.material_received:
            raise ValueError(
                "Crushed material cannot exceed material received."
            )

        if self.processed > self.crushed:
            raise ValueError(
                "Processed material cannot exceed crushed material."
            )

        if self.downtime > self.operating_hours:
            raise ValueError(
                "Downtime cannot be greater than operating hours."
            )

        if self.output > self.processed:
            raise ValueError(
                "Final output cannot exceed processed material."
            )

        return self


class ProcessingRecordUpdate(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
    )

    date: Date | None = None

    shift: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    material_received: float | None = Field(
        default=None,
        alias="materialReceived",
        ge=0,
    )

    crushed: float | None = Field(
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

    operating_hours: float | None = Field(
        default=None,
        alias="operatingHours",
        ge=0,
    )

    downtime: float | None = Field(
        default=None,
        ge=0,
    )

    status: ProcessingStatus | None = None

    notes: str | None = Field(
        default=None,
        max_length=2000,
    )


class ProcessingRecordResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

    id: int
    date: Date
    shift: str

    material_received: float = Field(
        alias="materialReceived",
    )

    crushed: float

    processed: float

    output: float

    operating_hours: float = Field(
        alias="operatingHours",
    )

    downtime: float

    status: ProcessingStatus

    notes: str | None

    created_at: str = Field(
        alias="createdAt",
    )

    updated_at: str = Field(
        alias="updatedAt",
    )


class ProcessingSummaryResponse(BaseModel):
    total_received: float = Field(
        alias="totalReceived",
    )

    total_crushed: float = Field(
        alias="totalCrushed",
    )

    total_processed: float = Field(
        alias="totalProcessed",
    )

    total_output: float = Field(
        alias="totalOutput",
    )

    total_operating_hours: float = Field(
        alias="totalOperatingHours",
    )

    total_downtime: float = Field(
        alias="totalDowntime",
    )

    processing_efficiency: float = Field(
        alias="processingEfficiency",
    )

    crusher_efficiency: float = Field(
        alias="crusherEfficiency",
    )

    operating_efficiency: float = Field(
        alias="operatingEfficiency",
    )

    completed_records: int = Field(
        alias="completedRecords",
    )

    in_progress_records: int = Field(
        alias="inProgressRecords",
    )

    delayed_records: int = Field(
        alias="delayedRecords",
    )


class ProcessingChartPoint(BaseModel):
    day: str
    date: Date
    received: float
    crushed: float
    processed: float
    output: float


class ProcessingTargetCreate(BaseModel):
    target_date: Date
    target_output: float = Field(
        ge=0,
    )


class ProcessingTargetUpdate(BaseModel):
    target_date: Date | None = None
    target_output: float | None = Field(
        default=None,
        ge=0,
    )


class ProcessingTargetResponse(BaseModel):
    id: int
    date: Date
    target: float
    created_at: str = Field(
        alias="createdAt",
    )
    updated_at: str = Field(
        alias="updatedAt",
    )


class ProcessingTargetProgress(BaseModel):
    target_date: Date
    target_output: float
    actual_output: float
    remaining_output: float
    progress_percentage: float


class ProcessingIssueCreate(BaseModel):
    title: str = Field(
        min_length=2,
        max_length=150,
    )

    description: str = Field(
        min_length=2,
        max_length=2000,
    )

    category: str = Field(
        min_length=2,
        max_length=50,
    )

    priority: IssuePriority = "Medium"

    duration_minutes: int | None = Field(
        default=None,
        alias="durationMinutes",
        ge=0,
    )

    status: IssueStatus = "Active"


class ProcessingIssueUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    description: str | None = Field(
        default=None,
        min_length=2,
        max_length=2000,
    )

    category: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    priority: IssuePriority | None = None

    duration_minutes: int | None = Field(
        default=None,
        alias="durationMinutes",
        ge=0,
    )

    status: IssueStatus | None = None


class ProcessingIssueResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

    id: int
    title: str
    description: str
    category: str
    priority: IssuePriority

    duration: str

    duration_minutes: int | None = Field(
        alias="durationMinutes",
    )

    status: IssueStatus

    created_at: str = Field(
        alias="createdAt",
    )

    updated_at: str = Field(
        alias="updatedAt",
    )


class ProcessingDashboardResponse(BaseModel):
    summary: ProcessingSummaryResponse
    records: list[ProcessingRecordResponse]
    chart: list[ProcessingChartPoint]
    issues: list[ProcessingIssueResponse]
    target: ProcessingTargetProgress | None