from typing import Literal

from pydantic import BaseModel, Field, model_validator


FuelType = Literal[
    "Diesel",
    "Petrol",
]

FuelTransactionType = Literal[
    "Consumption",
    "Delivery",
    "Adjustment",
]

FuelStatus = Literal[
    "Healthy",
    "Low",
    "Critical",
]


# ============================================================
# FUEL TANK SCHEMAS
# ============================================================

class FuelTankCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=150,
    )

    fuel_type: FuelType

    location: str = Field(
        min_length=1,
        max_length=150,
    )

    capacity: float = Field(
        gt=0,
    )

    current_level: float = Field(
        ge=0,
    )

    minimum_level: float = Field(
        ge=0,
    )

    unit_cost: float = Field(
        ge=0,
    )

    last_refill: str | None = None

    @model_validator(mode="after")
    def validate_levels(self):
        if self.current_level > self.capacity:
            raise ValueError(
                "Current fuel level cannot exceed tank capacity."
            )

        if self.minimum_level > self.capacity:
            raise ValueError(
                "Minimum fuel level cannot exceed tank capacity."
            )

        return self


class FuelTankUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    fuel_type: FuelType | None = None

    location: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    capacity: float | None = Field(
        default=None,
        gt=0,
    )

    current_level: float | None = Field(
        default=None,
        ge=0,
    )

    minimum_level: float | None = Field(
        default=None,
        ge=0,
    )

    unit_cost: float | None = Field(
        default=None,
        ge=0,
    )

    last_refill: str | None = None


class FuelTankResponse(BaseModel):
    id: int
    name: str
    fuelType: FuelType
    location: str
    capacity: float
    currentLevel: float
    minimumLevel: float
    unitCost: float
    lastRefill: str
    status: FuelStatus


# ============================================================
# FUEL RECORD SCHEMAS
# ============================================================

class FuelRecordCreate(BaseModel):
    type: FuelTransactionType

    tank_id: int = Field(
        gt=0,
    )

    equipment: str = Field(
        min_length=1,
        max_length=150,
    )

    operator: str = Field(
        min_length=1,
        max_length=150,
    )

    fuel_type: FuelType

    quantity: float = Field(
        gt=0,
    )

    meter_reading: float = Field(
        ge=0,
    )

    date: str = Field(
        min_length=1,
        max_length=50,
    )

    time: str = Field(
        min_length=1,
        max_length=20,
    )

    unit_price: float = Field(
        gt=0,
    )

    reference: str | None = Field(
        default=None,
        max_length=100,
    )

    location: str = Field(
        min_length=1,
        max_length=150,
    )


class FuelRecordUpdate(BaseModel):
    equipment: str | None = Field(
        default=None,
        max_length=150,
    )

    operator: str | None = Field(
        default=None,
        max_length=150,
    )

    meter_reading: float | None = Field(
        default=None,
        ge=0,
    )

    date: str | None = None

    time: str | None = None

    unit_price: float | None = Field(
        default=None,
        gt=0,
    )

    location: str | None = Field(
        default=None,
        max_length=150,
    )


class FuelRecordResponse(BaseModel):
    id: int
    date: str
    time: str
    type: FuelTransactionType
    equipment: str
    operator: str
    fuelType: FuelType
    quantity: float
    meterReading: float
    cost: float
    reference: str
    location: str
    tankId: int


# ============================================================
# DASHBOARD SCHEMA
# ============================================================

class FuelDashboardResponse(BaseModel):
    totalFuel: float
    totalCapacity: float
    utilization: float
    todayConsumption: float
    todaySpend: float
    averageCost: float
    tankCount: int
    lowTankCount: int
    criticalTankCount: int