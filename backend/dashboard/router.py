from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.dashboard.schema import (
    DashboardProduction,
    DashboardResponse,
    DashboardSummaryResponse,
    DashboardActivity,
    DashboardOperationalHealth,
)
from backend.dashboard.service import DashboardService


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
)
def get_dashboard_summary(
    target_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return DashboardService.get_summary(
        db=db,
        target_date=target_date,
    )


@router.get(
    "/production",
    response_model=DashboardProduction,
)
def get_dashboard_production(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return DashboardService.get_production(
        db=db,
        start_date=start_date,
        end_date=end_date,
    )


@router.get(
    "/activities",
    response_model=list[DashboardActivity],
)
def get_dashboard_activities(
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
    ),
    db: Session = Depends(get_db),
):
    return DashboardService.get_activities(
        db=db,
        limit=limit,
    )


@router.get(
    "/operational-health",
    response_model=DashboardOperationalHealth,
)
def get_operational_health(
    target_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return DashboardService.get_operational_health(
        db=db,
        target_date=target_date,
    )


@router.get(
    "",
    response_model=DashboardResponse,
)
def get_dashboard(
    target_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return DashboardService.get_dashboard(
        db=db,
        target_date=target_date,
    )