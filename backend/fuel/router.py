from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.core.database import get_db

from backend.fuel.schema import (
    FuelDashboardResponse,
    FuelRecordCreate,
    FuelRecordResponse,
    FuelRecordUpdate,
    FuelTankCreate,
    FuelTankResponse,
    FuelTankUpdate,
)

from backend.fuel.service import (
    create_record,
    create_tank,
    delete_record,
    delete_tank,
    get_dashboard,
    get_movements,
    get_record,
    get_records,
    get_tank,
    get_tanks,
    update_record,
    update_tank,
)


router = APIRouter(
    prefix="/api/fuel",
    tags=["Fuel"],
)


# ============================================================
# TANKS
# ============================================================

@router.get(
    "/tanks",
    response_model=list[FuelTankResponse],
)
def list_tanks(
    db: Session = Depends(get_db),
):
    """
    Return all fuel tanks.

    The React fuel delivery/consumption modal uses
    this endpoint to populate the Fuel Tank dropdown.
    """
    return get_tanks(db)


@router.get(
    "/tanks/{tank_id}",
    response_model=FuelTankResponse,
)
def read_tank(
    tank_id: int,
    db: Session = Depends(get_db),
):
    return get_tank(
        db,
        tank_id,
    )


@router.post(
    "/tanks",
    response_model=FuelTankResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_tank(
    data: FuelTankCreate,
    db: Session = Depends(get_db),
):
    return create_tank(
        db,
        data,
    )


@router.put(
    "/tanks/{tank_id}",
    response_model=FuelTankResponse,
)
def edit_tank(
    tank_id: int,
    data: FuelTankUpdate,
    db: Session = Depends(get_db),
):
    return update_tank(
        db,
        tank_id,
        data,
    )


@router.delete(
    "/tanks/{tank_id}",
)
def remove_tank(
    tank_id: int,
    db: Session = Depends(get_db),
):
    return delete_tank(
        db,
        tank_id,
    )


# ============================================================
# RECORDS
# ============================================================

@router.get(
    "/records",
    response_model=list[FuelRecordResponse],
)
def list_records(
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
    ),
    db: Session = Depends(get_db),
):
    return get_records(
        db,
        limit,
    )


@router.get(
    "/records/{record_id}",
    response_model=FuelRecordResponse,
)
def read_record(
    record_id: int,
    db: Session = Depends(get_db),
):
    return get_record(
        db,
        record_id,
    )


@router.post(
    "/records",
    response_model=FuelRecordResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_record(
    data: FuelRecordCreate,
    db: Session = Depends(get_db),
):
    return create_record(
        db,
        data,
    )


@router.put(
    "/records/{record_id}",
    response_model=FuelRecordResponse,
)
def edit_record(
    record_id: int,
    data: FuelRecordUpdate,
    db: Session = Depends(get_db),
):
    return update_record(
        db,
        record_id,
        data,
    )


@router.delete(
    "/records/{record_id}",
)
def remove_record(
    record_id: int,
    db: Session = Depends(get_db),
):
    return delete_record(
        db,
        record_id,
    )


# ============================================================
# MOVEMENTS
# ============================================================

@router.get(
    "/movements",
)
def list_movements(
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
    ),
    db: Session = Depends(get_db),
):
    return get_movements(
        db,
        limit,
    )


# ============================================================
# DASHBOARD
# ============================================================

@router.get(
    "/dashboard",
    response_model=FuelDashboardResponse,
)
def fuel_dashboard(
    db: Session = Depends(get_db),
):
    return get_dashboard(db)