from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class WorkerBase(BaseModel):
    employee_number: str = Field(
        ...,
        alias="employeeNumber",
        min_length=1,
        max_length=50,
    )

    name: str = Field(
        ...,
        min_length=1,
        max_length=150,
    )

    role: str = Field(
        ...,
        min_length=1,
        max_length=150,
    )

    department: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )

    shift: str = Field(
        default="Day Shift",
        max_length=30,
    )

    status: str = Field(
        default="Present",
        max_length=30,
    )

    phone: str = Field(
        ...,
        min_length=1,
        max_length=50,
    )

    start_date: date = Field(
        ...,
        alias="startDate",
    )

    safety_status: str = Field(
        default="Compliant",
        alias="safetyStatus",
        max_length=50,
    )

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )


class WorkerCreate(WorkerBase):
    pass


class WorkerUpdate(BaseModel):
    employee_number: Optional[str] = Field(
        default=None,
        alias="employeeNumber",
        min_length=1,
        max_length=50,
    )

    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    role: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    department: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    shift: Optional[str] = Field(
        default=None,
        max_length=30,
    )

    status: Optional[str] = Field(
        default=None,
        max_length=30,
    )

    phone: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=50,
    )

    start_date: Optional[date] = Field(
        default=None,
        alias="startDate",
    )

    safety_status: Optional[str] = Field(
        default=None,
        alias="safetyStatus",
        max_length=50,
    )

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )


class WorkerResponse(WorkerBase):
    id: int


class WorkerStatusUpdate(BaseModel):
    status: str = Field(
        ...,
        min_length=1,
        max_length=30,
    )


class WorkerSafetyUpdate(BaseModel):
    safety_status: str = Field(
        ...,
        alias="safetyStatus",
        min_length=1,
        max_length=50,
    )

    model_config = ConfigDict(
        populate_by_name=True,
    )


class WorkforceSummary(BaseModel):
    total_workforce: int = Field(alias="totalWorkforce")
    present_today: int = Field(alias="presentToday")
    absent: int
    late: int
    off_duty: int = Field(alias="offDuty")
    training_due: int = Field(alias="trainingDue")
    attendance_rate: float = Field(alias="attendanceRate")
    safety_compliance_rate: float = Field(alias="safetyComplianceRate")
    shift_coverage: float = Field(alias="shiftCoverage")

    model_config = ConfigDict(
        populate_by_name=True,
    )


class WorkforceDashboard(BaseModel):
    summary: WorkforceSummary
    workers: list[WorkerResponse]


class WorkforceIssue(BaseModel):
    id: int
    title: str
    description: str
    category: str
    priority: str