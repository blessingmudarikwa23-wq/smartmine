from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.core.database import get_db

from .schema import (
    SafetyActionCreate,
    SafetyActionResponse,
    SafetyActionUpdate,
    SafetyDashboardResponse,
    SafetyIncidentCreate,
    SafetyIncidentResponse,
    SafetyIncidentUpdate,
    SafetyInspectionCreate,
    SafetyInspectionResponse,
    SafetyInspectionUpdate,
    SafetySummaryResponse,
)
from .service import SafetyService


router = APIRouter(
    prefix="/api/v1/safety",
    tags=["Safety Management"],
)


# ==========================================================
# DASHBOARD
# ==========================================================

@router.get(
    "/dashboard",
    response_model=SafetyDashboardResponse,
)
def get_safety_dashboard(
    db: Session = Depends(get_db),
):
    return SafetyService.get_dashboard(db)


@router.get(
    "/summary",
    response_model=SafetySummaryResponse,
)
def get_safety_summary(
    db: Session = Depends(get_db),
):
    return SafetyService.get_summary(db)


# ==========================================================
# INCIDENTS
# ==========================================================

@router.get(
    "/incidents",
    response_model=list[SafetyIncidentResponse],
)
def get_incidents(
    search: str | None = Query(default=None),
    severity: str | None = Query(default=None),
    status_filter: str | None = Query(
        default=None,
        alias="status",
    ),
    db: Session = Depends(get_db),
):
    return SafetyService.list_incidents(
        db=db,
        search=search,
        severity=severity,
        status=status_filter,
    )


@router.get(
    "/incidents/{incident_id}",
    response_model=SafetyIncidentResponse,
)
def get_incident(
    incident_id: int,
    db: Session = Depends(get_db),
):
    incident = SafetyService.get_incident(
        db,
        incident_id,
    )

    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Safety incident not found.",
        )

    return incident


@router.post(
    "/incidents",
    response_model=SafetyIncidentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_incident(
    data: SafetyIncidentCreate,
    db: Session = Depends(get_db),
):
    return SafetyService.create_incident(
        db,
        data,
    )


@router.put(
    "/incidents/{incident_id}",
    response_model=SafetyIncidentResponse,
)
def update_incident(
    incident_id: int,
    data: SafetyIncidentUpdate,
    db: Session = Depends(get_db),
):
    incident = SafetyService.update_incident(
        db,
        incident_id,
        data,
    )

    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Safety incident not found.",
        )

    return incident


@router.delete(
    "/incidents/{incident_id}",
)
def delete_incident(
    incident_id: int,
    db: Session = Depends(get_db),
):
    incident = SafetyService.delete_incident(
        db,
        incident_id,
    )

    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Safety incident not found.",
        )

    return {
        "message": "Safety incident deleted successfully.",
        "id": incident_id,
    }


# ==========================================================
# INSPECTIONS
# ==========================================================

@router.get(
    "/inspections",
    response_model=list[SafetyInspectionResponse],
)
def get_inspections(
    db: Session = Depends(get_db),
):
    return SafetyService.list_inspections(db)


@router.get(
    "/inspections/{inspection_id}",
    response_model=SafetyInspectionResponse,
)
def get_inspection(
    inspection_id: int,
    db: Session = Depends(get_db),
):
    inspection = SafetyService.get_inspection(
        db,
        inspection_id,
    )

    if not inspection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Safety inspection not found.",
        )

    return inspection


@router.post(
    "/inspections",
    response_model=SafetyInspectionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_inspection(
    data: SafetyInspectionCreate,
    db: Session = Depends(get_db),
):
    return SafetyService.create_inspection(
        db,
        data,
    )


@router.put(
    "/inspections/{inspection_id}",
    response_model=SafetyInspectionResponse,
)
def update_inspection(
    inspection_id: int,
    data: SafetyInspectionUpdate,
    db: Session = Depends(get_db),
):
    inspection = SafetyService.update_inspection(
        db,
        inspection_id,
        data,
    )

    if not inspection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Safety inspection not found.",
        )

    return inspection


@router.delete(
    "/inspections/{inspection_id}",
)
def delete_inspection(
    inspection_id: int,
    db: Session = Depends(get_db),
):
    inspection = SafetyService.delete_inspection(
        db,
        inspection_id,
    )

    if not inspection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Safety inspection not found.",
        )

    return {
        "message": "Safety inspection deleted successfully.",
        "id": inspection_id,
    }


# ==========================================================
# CORRECTIVE ACTIONS
# ==========================================================

@router.get(
    "/actions",
    response_model=list[SafetyActionResponse],
)
def get_actions(
    db: Session = Depends(get_db),
):
    return SafetyService.list_actions(db)


@router.get(
    "/actions/{action_id}",
    response_model=SafetyActionResponse,
)
def get_action(
    action_id: int,
    db: Session = Depends(get_db),
):
    action = SafetyService.get_action(
        db,
        action_id,
    )

    if not action:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Safety corrective action not found.",
        )

    return action


@router.post(
    "/actions",
    response_model=SafetyActionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_action(
    data: SafetyActionCreate,
    db: Session = Depends(get_db),
):
    return SafetyService.create_action(
        db,
        data,
    )


@router.put(
    "/actions/{action_id}",
    response_model=SafetyActionResponse,
)
def update_action(
    action_id: int,
    data: SafetyActionUpdate,
    db: Session = Depends(get_db),
):
    action = SafetyService.update_action(
        db,
        action_id,
        data,
    )

    if not action:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Safety corrective action not found.",
        )

    return action


@router.delete(
    "/actions/{action_id}",
)
def delete_action(
    action_id: int,
    db: Session = Depends(get_db),
):
    action = SafetyService.delete_action(
        db,
        action_id,
    )

    if not action:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Safety corrective action not found.",
        )

    return {
        "message": "Safety corrective action deleted successfully.",
        "id": action_id,
    }