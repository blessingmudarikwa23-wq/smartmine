from datetime import datetime
from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from backend.fuel.model import (
    FuelRecordModel,
    FuelTankModel,
)
from backend.fuel.schema import (
    FuelRecordCreate,
    FuelRecordUpdate,
    FuelTankCreate,
    FuelTankUpdate,
)


# ============================================================
# STATUS CALCULATION
# ============================================================

def calculate_tank_status(
    current_level: float,
    capacity: float,
    minimum_level: float,
) -> str:
    if capacity <= 0:
        return "Critical"

    if current_level <= minimum_level:
        return "Critical"

    percentage = (current_level / capacity) * 100

    if percentage <= 30:
        return "Low"

    return "Healthy"


# ============================================================
# SERIALIZATION
# ============================================================

def serialize_tank(
    tank: FuelTankModel,
) -> dict[str, Any]:
    """
    Convert a database tank object into the exact
    camelCase structure expected by the React frontend.
    """

    # Always calculate the current status from the
    # actual tank values before returning the tank.
    status = calculate_tank_status(
        tank.current_level,
        tank.capacity,
        tank.minimum_level,
    )

    # Keep the database status synchronized.
    tank.status = status

    return {
        "id": tank.id,
        "name": tank.name,
        "fuelType": tank.fuel_type,
        "location": tank.location,
        "capacity": tank.capacity,
        "currentLevel": tank.current_level,
        "minimumLevel": tank.minimum_level,
        "unitCost": tank.unit_cost,
        "lastRefill": tank.last_refill or "",
        "status": status,
    }


def serialize_record(
    record: FuelRecordModel,
) -> dict[str, Any]:
    return {
        "id": record.id,
        "date": record.date,
        "time": record.time,
        "type": record.type,
        "equipment": record.equipment,
        "operator": record.operator,
        "fuelType": record.fuel_type,
        "quantity": record.quantity,
        "meterReading": record.meter_reading,
        "cost": record.cost,
        "reference": record.reference,
        "location": record.location,
        "tankId": record.tank_id,
    }


# ============================================================
# TANK SERVICES
# ============================================================

def get_tanks(
    db: Session,
) -> list[dict[str, Any]]:
    """
    Return every fuel tank in the database.

    This endpoint is what the React fuel tank dropdown
    uses to populate its options.
    """

    tanks = (
        db.query(FuelTankModel)
        .order_by(FuelTankModel.id.asc())
        .all()
    )

    result: list[dict[str, Any]] = []

    for tank in tanks:
        result.append(
            serialize_tank(tank)
        )

    # Save any status corrections made during serialization.
    if tanks:
        db.commit()

    return result


def get_tank(
    db: Session,
    tank_id: int,
) -> dict[str, Any]:
    tank = (
        db.query(FuelTankModel)
        .filter(
            FuelTankModel.id == tank_id
        )
        .first()
    )

    if not tank:
        raise HTTPException(
            status_code=404,
            detail="Fuel tank not found.",
        )

    result = serialize_tank(tank)

    db.commit()

    return result


def create_tank(
    db: Session,
    data: FuelTankCreate,
) -> dict[str, Any]:

    # --------------------------------------------------------
    # VALIDATE CAPACITY
    # --------------------------------------------------------

    if data.current_level > data.capacity:
        raise HTTPException(
            status_code=400,
            detail=(
                "Current fuel level cannot exceed "
                "tank capacity."
            ),
        )

    if data.minimum_level > data.capacity:
        raise HTTPException(
            status_code=400,
            detail=(
                "Minimum fuel level cannot exceed "
                "tank capacity."
            ),
        )

    # --------------------------------------------------------
    # CALCULATE STATUS
    # --------------------------------------------------------

    status = calculate_tank_status(
        data.current_level,
        data.capacity,
        data.minimum_level,
    )

    # --------------------------------------------------------
    # CREATE TANK
    # --------------------------------------------------------

    tank = FuelTankModel(
        name=data.name.strip(),
        fuel_type=data.fuel_type,
        location=data.location.strip(),
        capacity=data.capacity,
        current_level=data.current_level,
        minimum_level=data.minimum_level,
        unit_cost=data.unit_cost,
        last_refill=data.last_refill,
        status=status,
    )

    db.add(tank)
    db.commit()
    db.refresh(tank)

    return serialize_tank(tank)


def update_tank(
    db: Session,
    tank_id: int,
    data: FuelTankUpdate,
) -> dict[str, Any]:

    tank = (
        db.query(FuelTankModel)
        .filter(
            FuelTankModel.id == tank_id
        )
        .first()
    )

    if not tank:
        raise HTTPException(
            status_code=404,
            detail="Fuel tank not found.",
        )

    update_data = data.model_dump(
        exclude_unset=True,
    )

    # --------------------------------------------------------
    # APPLY UPDATES
    # --------------------------------------------------------

    for field, value in update_data.items():

        if isinstance(value, str):
            value = value.strip()

        setattr(
            tank,
            field,
            value,
        )

    # --------------------------------------------------------
    # VALIDATE CAPACITY
    # --------------------------------------------------------

    if tank.current_level > tank.capacity:
        raise HTTPException(
            status_code=400,
            detail=(
                "Current fuel level cannot exceed "
                "tank capacity."
            ),
        )

    if tank.minimum_level > tank.capacity:
        raise HTTPException(
            status_code=400,
            detail=(
                "Minimum fuel level cannot exceed "
                "tank capacity."
            ),
        )

    # --------------------------------------------------------
    # UPDATE STATUS
    # --------------------------------------------------------

    tank.status = calculate_tank_status(
        tank.current_level,
        tank.capacity,
        tank.minimum_level,
    )

    db.commit()
    db.refresh(tank)

    return serialize_tank(tank)


def delete_tank(
    db: Session,
    tank_id: int,
) -> dict[str, str]:

    tank = (
        db.query(FuelTankModel)
        .filter(
            FuelTankModel.id == tank_id
        )
        .first()
    )

    if not tank:
        raise HTTPException(
            status_code=404,
            detail="Fuel tank not found.",
        )

    db.delete(tank)
    db.commit()

    return {
        "message": "Fuel tank deleted successfully.",
    }


# ============================================================
# RECORD SERVICES
# ============================================================

def get_records(
    db: Session,
    limit: int = 100,
) -> list[dict[str, Any]]:

    records = (
        db.query(FuelRecordModel)
        .order_by(
            FuelRecordModel.id.desc()
        )
        .limit(limit)
        .all()
    )

    return [
        serialize_record(record)
        for record in records
    ]


def get_record(
    db: Session,
    record_id: int,
) -> dict[str, Any]:

    record = (
        db.query(FuelRecordModel)
        .filter(
            FuelRecordModel.id == record_id
        )
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Fuel record not found.",
        )

    return serialize_record(record)


def generate_reference(
    db: Session,
    transaction_type: str,
) -> str:

    prefix = (
        "DEL"
        if transaction_type == "Delivery"
        else "FUEL"
    )

    latest = (
        db.query(FuelRecordModel)
        .filter(
            FuelRecordModel.reference.like(
                f"{prefix}-%"
            )
        )
        .order_by(
            FuelRecordModel.id.desc()
        )
        .first()
    )

    if not latest:
        number = 1
    else:
        try:
            number = (
                int(
                    latest.reference.split("-")[-1]
                )
                + 1
            )
        except (ValueError, IndexError):
            number = latest.id + 1

    reference = f"{prefix}-{number:04d}"

    existing = (
        db.query(FuelRecordModel)
        .filter(
            FuelRecordModel.reference == reference
        )
        .first()
    )

    while existing:
        number += 1
        reference = f"{prefix}-{number:04d}"

        existing = (
            db.query(FuelRecordModel)
            .filter(
                FuelRecordModel.reference == reference
            )
            .first()
        )

    return reference


def create_record(
    db: Session,
    data: FuelRecordCreate,
) -> dict[str, Any]:

    tank = (
        db.query(FuelTankModel)
        .filter(
            FuelTankModel.id == data.tank_id
        )
        .first()
    )

    if not tank:
        raise HTTPException(
            status_code=404,
            detail="Fuel tank not found.",
        )

    # --------------------------------------------------------
    # VERIFY FUEL TYPE
    # --------------------------------------------------------

    if tank.fuel_type != data.fuel_type:
        raise HTTPException(
            status_code=400,
            detail=(
                "Selected fuel type does not "
                "match the tank fuel type."
            ),
        )

    quantity = data.quantity

    # --------------------------------------------------------
    # CONSUMPTION
    # --------------------------------------------------------

    if data.type == "Consumption":

        if quantity > tank.current_level:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Insufficient fuel in the "
                    "selected tank."
                ),
            )

        tank.current_level -= quantity

    # --------------------------------------------------------
    # DELIVERY
    # --------------------------------------------------------

    elif data.type == "Delivery":

        if (
            tank.current_level + quantity
            > tank.capacity
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Delivery would exceed "
                    "the tank capacity."
                ),
            )

        tank.current_level += quantity
        tank.last_refill = data.date

    # --------------------------------------------------------
    # ADJUSTMENT
    # --------------------------------------------------------

    elif data.type == "Adjustment":

        if (
            tank.current_level + quantity
            > tank.capacity
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Adjustment would exceed "
                    "the tank capacity."
                ),
            )

        tank.current_level += quantity

    # --------------------------------------------------------
    # UPDATE TANK STATUS
    # --------------------------------------------------------

    tank.status = calculate_tank_status(
        tank.current_level,
        tank.capacity,
        tank.minimum_level,
    )

    # --------------------------------------------------------
    # CALCULATE COST
    # --------------------------------------------------------

    total_cost = (
        quantity * data.unit_price
    )

    # --------------------------------------------------------
    # GENERATE / VALIDATE REFERENCE
    # --------------------------------------------------------

    reference = (
        data.reference.strip()
        if data.reference
        else generate_reference(
            db,
            data.type,
        )
    )

    existing_reference = (
        db.query(FuelRecordModel)
        .filter(
            FuelRecordModel.reference == reference
        )
        .first()
    )

    if existing_reference:
        raise HTTPException(
            status_code=409,
            detail=(
                "A fuel record with this "
                "reference already exists."
            ),
        )

    # --------------------------------------------------------
    # EQUIPMENT
    # --------------------------------------------------------

    equipment = data.equipment

    if data.type == "Delivery":
        equipment = "Fuel Delivery"

    # --------------------------------------------------------
    # CREATE RECORD
    # --------------------------------------------------------

    record = FuelRecordModel(
        tank_id=data.tank_id,
        date=data.date,
        time=data.time,
        type=data.type,
        equipment=equipment,
        operator=data.operator.strip(),
        fuel_type=data.fuel_type,
        quantity=quantity,
        meter_reading=data.meter_reading,
        unit_price=data.unit_price,
        cost=total_cost,
        reference=reference,
        location=data.location.strip(),
    )

    db.add(record)

    db.commit()
    db.refresh(record)

    return serialize_record(record)


def update_record(
    db: Session,
    record_id: int,
    data: FuelRecordUpdate,
) -> dict[str, Any]:

    record = (
        db.query(FuelRecordModel)
        .filter(
            FuelRecordModel.id == record_id
        )
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Fuel record not found.",
        )

    update_data = data.model_dump(
        exclude_unset=True,
    )

    for field, value in update_data.items():

        if isinstance(value, str):
            value = value.strip()

        setattr(
            record,
            field,
            value,
        )

    if data.unit_price is not None:
        record.cost = (
            record.quantity
            * data.unit_price
        )

    db.commit()
    db.refresh(record)

    return serialize_record(record)


def delete_record(
    db: Session,
    record_id: int,
) -> dict[str, str]:

    record = (
        db.query(FuelRecordModel)
        .filter(
            FuelRecordModel.id == record_id
        )
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Fuel record not found.",
        )

    db.delete(record)
    db.commit()

    return {
        "message": "Fuel record deleted successfully.",
    }


# ============================================================
# MOVEMENTS
# ============================================================

def get_movements(
    db: Session,
    limit: int = 100,
) -> list[dict[str, Any]]:

    records = (
        db.query(FuelRecordModel)
        .order_by(
            FuelRecordModel.id.desc()
        )
        .limit(limit)
        .all()
    )

    movements: list[dict[str, Any]] = []

    for record in records:

        if record.type == "Consumption":
            quantity = -record.quantity
        else:
            quantity = record.quantity

        movements.append(
            {
                "id": record.id,
                "date": record.date,
                "time": record.time,
                "type": record.type,
                "equipment": record.equipment,
                "operator": record.operator,
                "fuelType": record.fuel_type,
                "quantity": quantity,
                "cost": record.cost,
                "reference": record.reference,
                "location": record.location,
                "tankId": record.tank_id,
            }
        )

    return movements


# ============================================================
# DASHBOARD
# ============================================================

def get_dashboard(
    db: Session,
) -> dict[str, Any]:

    tanks = (
        db.query(FuelTankModel)
        .all()
    )

    # Make sure statuses are always current.
    for tank in tanks:
        tank.status = calculate_tank_status(
            tank.current_level,
            tank.capacity,
            tank.minimum_level,
        )

    if tanks:
        db.commit()

    total_fuel = sum(
        tank.current_level
        for tank in tanks
    )

    total_capacity = sum(
        tank.capacity
        for tank in tanks
    )

    utilization = (
        (
            total_fuel
            / total_capacity
        )
        * 100
        if total_capacity > 0
        else 0
    )

    today = datetime.now().strftime(
        "%d %b %Y"
    )

    today_records = (
        db.query(FuelRecordModel)
        .filter(
            FuelRecordModel.date == today,
            FuelRecordModel.type == "Consumption",
        )
        .all()
    )

    today_consumption = sum(
        record.quantity
        for record in today_records
    )

    today_spend = sum(
        record.cost
        for record in today_records
    )

    all_consumption = (
        db.query(FuelRecordModel)
        .filter(
            FuelRecordModel.type == "Consumption",
        )
        .all()
    )

    total_consumption_quantity = sum(
        record.quantity
        for record in all_consumption
    )

    total_consumption_cost = sum(
        record.cost
        for record in all_consumption
    )

    average_cost = (
        total_consumption_cost
        / total_consumption_quantity
        if total_consumption_quantity > 0
        else 0
    )

    low_count = sum(
        1
        for tank in tanks
        if tank.status == "Low"
    )

    critical_count = sum(
        1
        for tank in tanks
        if tank.status == "Critical"
    )

    return {
        "totalFuel": total_fuel,
        "totalCapacity": total_capacity,
        "utilization": utilization,
        "todayConsumption": today_consumption,
        "todaySpend": today_spend,
        "averageCost": average_cost,
        "tankCount": len(tanks),
        "lowTankCount": low_count,
        "criticalTankCount": critical_count,
    }