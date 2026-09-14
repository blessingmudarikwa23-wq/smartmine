from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy.orm import Session

from backend.core.database import get_db

from .schema import (
    ReportCreate,
    ReportResponse,
    ReportsDashboardResponse,
    ReportStatsResponse,
    ReportUpdateRequest,
)
from .service import ReportsService


router = APIRouter(
    prefix="/api/v1/reports",
    tags=["Reports Management"],
)


@router.get(
    "",
    response_model=list[ReportResponse],
)
def get_reports(
    period: str | None = Query(
        default=None
    ),
    category: str | None = Query(
        default=None
    ),
    search: str | None = Query(
        default=None
    ),
    db: Session = Depends(get_db),
):
    ReportsService.seed_reports(db)

    return ReportsService.list_reports(
        db=db,
        period=period,
        category=category,
        search=search,
    )


@router.get(
    "/dashboard",
    response_model=ReportsDashboardResponse,
)
def get_reports_dashboard(
    period: str = Query(
        default="Monthly"
    ),
    db: Session = Depends(get_db),
):
    ReportsService.seed_reports(db)

    return ReportsService.get_dashboard(
        db=db,
        period=period,
    )


@router.get(
    "/stats",
    response_model=ReportStatsResponse,
)
def get_report_stats(
    period: str = Query(
        default="Monthly"
    ),
    db: Session = Depends(get_db),
):
    ReportsService.seed_reports(db)

    return ReportsService.get_stats(
        db=db,
        period=period,
    )


@router.post(
    "/generate",
    response_model=ReportResponse,
    status_code=status.HTTP_201_CREATED,
)
def generate_report(
    data: ReportCreate,
    db: Session = Depends(get_db),
):
    return ReportsService.generate_report(
        db=db,
        data=data,
    )


@router.get(
    "/{report_id}",
    response_model=ReportResponse,
)
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
):
    report = ReportsService.get_report(
        db,
        report_id,
    )

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found.",
        )

    return report


@router.put(
    "/{report_id}",
    response_model=ReportResponse,
)
def update_report(
    report_id: int,
    data: ReportUpdateRequest,
    db: Session = Depends(get_db),
):
    report = ReportsService.update_report(
        db=db,
        report_id=report_id,
        data=data,
    )

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found.",
        )

    return report


@router.delete(
    "/{report_id}",
)
def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
):
    deleted = ReportsService.delete_report(
        db=db,
        report_id=report_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found.",
        )

    return {
        "message": "Report deleted successfully.",
        "report_id": report_id,
    }