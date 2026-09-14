from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


EQUIPMENT_STATUSES = (
    "Running",
    "Available",
    "Maintenance",
    "Down",
)


class EquipmentBase(BaseModel):
    equipment_id: str = Field(
        min_length=1,
        max_length=50,
    )

    name: str = Field(
        min_length=1,
        max_length=150,
    )

    type: str = Field(
        min_length=1,
        max_length=100,
    )

    manufacturer: str = "Not specified"

    model: str = "Not specified"

    location: str = Field(
        min_length=1,
        max_length=150,
    )

    status: str = "Available"

    operating_hours: float = Field(
        default=0,
        ge=0,
    )

    utilisation: float = Field(
        default=0,
        ge=0,
        le=100,
    )

    last_maintenance: date | None = None

    next_maintenance: date | None = None

    maintenance_interval: float = Field(
        default=250,
        gt=0,
    )

    notes: str | None = None


class EquipmentCreate(EquipmentBase):
    pass


class EquipmentUpdate(BaseModel):
    equipment_id: str | None = Field(
        default=None,
        min_length=1,
        max_length=50,
    )

    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    type: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    manufacturer: str | None = None

    model: str | None = None

    location: str | None = None

    status: str | None = None

    operating_hours: float | None = Field(
        default=None,
        ge=0,
    )

    utilisation: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    last_maintenance: date | None = None

    next_maintenance: date | None = None

    maintenance_interval: float | None = Field(
        default=None,
        gt=0,
    )

    notes: str | None = None


class EquipmentStatusUpdate(BaseModel):
    status: str


class EquipmentResponse(EquipmentBase):
    id: int

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )


class EquipmentSummaryResponse(BaseModel):
    total_equipment: int
    running: int
    available: int
    maintenance: int
    down: int
    average_utilisation: float
    total_operating_hours: float


class EquipmentStatusResponse(BaseModel):
    equipment_id: str
    name: str
    status: str
    location: str
    operating_hours: float
    utilisation: float


class EquipmentDashboardResponse(BaseModel):
    equipment: list[EquipmentResponse]
    summary: EquipmentSummaryResponse