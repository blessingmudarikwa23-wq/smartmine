from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.equipment.schema import (
    EquipmentCreate,
    EquipmentDashboardResponse,
    EquipmentResponse,
    EquipmentStatusResponse,
    EquipmentStatusUpdate,
    EquipmentSummaryResponse,
    EquipmentUpdate,
)
from backend.equipment.service import EquipmentService


router = APIRouter(
    prefix="/equipment",
    tags=["Equipment"],
)


# =========================================================
# DASHBOARD
# =========================================================

@router.get(
    "/dashboard",
    response_model=EquipmentDashboardResponse,
)
def get_equipment_dashboard(
    db: Session = Depends(get_db),
):
    equipment = EquipmentService.get_equipment_list(
        db=db,
        limit=500,
    )

    summary = EquipmentService.get_summary(
        db=db,
    )

    return {
        "equipment": equipment,
        "summary": summary,
    }


# =========================================================
# SUMMARY
# =========================================================

@router.get(
    "/summary",
    response_model=EquipmentSummaryResponse,
)
def get_equipment_summary(
    db: Session = Depends(get_db),
):
    return EquipmentService.get_summary(
        db=db,
    )


# =========================================================
# STATUS
# =========================================================

@router.get(
    "/status",
    response_model=list[EquipmentStatusResponse],
)
def get_equipment_status(
    db: Session = Depends(get_db),
):
    return EquipmentService.get_status_list(
        db=db,
    )


@router.put(
    "/status/{equipment_code}",
    response_model=EquipmentResponse,
)
def update_equipment_status(
    equipment_code: str,
    payload: EquipmentStatusUpdate,
    db: Session = Depends(get_db),
):
    try:
        equipment = EquipmentService.update_status(
            db=db,
            equipment_code=equipment_code,
            payload=payload,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found.",
        )

    return equipment


# =========================================================
# EQUIPMENT CRUD
# =========================================================

@router.post(
    "",
    response_model=EquipmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_equipment(
    payload: EquipmentCreate,
    db: Session = Depends(get_db),
):
    try:
        return EquipmentService.create_equipment(
            db=db,
            payload=payload,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc


@router.get(
    "",
    response_model=list[EquipmentResponse],
)
def get_equipment(
    search: str | None = Query(default=None),
    equipment_status: str | None = Query(
        default=None,
        alias="status",
    ),
    equipment_type: str | None = Query(
        default=None,
        alias="type",
    ),
    location: str | None = Query(default=None),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
    ),
    db: Session = Depends(get_db),
):
    return EquipmentService.get_equipment_list(
        db=db,
        search=search,
        status=equipment_status,
        equipment_type=equipment_type,
        location=location,
        limit=limit,
    )


@router.get(
    "/code/{equipment_code}",
    response_model=EquipmentResponse,
)
def get_equipment_by_code(
    equipment_code: str,
    db: Session = Depends(get_db),
):
    equipment = EquipmentService.get_by_equipment_code(
        db=db,
        equipment_code=equipment_code,
    )

    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found.",
        )

    return equipment


@router.get(
    "/{equipment_id}",
    response_model=EquipmentResponse,
)
def get_equipment_by_id(
    equipment_id: int,
    db: Session = Depends(get_db),
):
    equipment = EquipmentService.get_equipment(
        db=db,
        equipment_id=equipment_id,
    )

    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found.",
        )

    return equipment


@router.put(
    "/{equipment_id}",
    response_model=EquipmentResponse,
)
def update_equipment(
    equipment_id: int,
    payload: EquipmentUpdate,
    db: Session = Depends(get_db),
):
    try:
        equipment = EquipmentService.update_equipment(
            db=db,
            equipment_id=equipment_id,
            payload=payload,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found.",
        )

    return equipment


@router.delete(
    "/{equipment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
):
    deleted = EquipmentService.delete_equipment(
        db=db,
        equipment_id=equipment_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found.",
        )

    return None


# =========================================================
# MAINTENANCE
# =========================================================

@router.get(
    "/maintenance/upcoming",
    response_model=list[EquipmentResponse],
)
def get_upcoming_maintenance(
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    db: Session = Depends(get_db),
):
    return EquipmentService.get_upcoming_maintenance(
        db=db,
        limit=limit,
    )