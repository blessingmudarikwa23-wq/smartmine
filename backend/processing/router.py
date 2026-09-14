from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.processing.schema import (
    ProcessingDashboardResponse,
    ProcessingIssueCreate,
    ProcessingIssueResponse,
    ProcessingIssueUpdate,
    ProcessingRecordCreate,
    ProcessingRecordResponse,
    ProcessingRecordUpdate,
    ProcessingSummaryResponse,
    ProcessingTargetCreate,
    ProcessingTargetProgress,
    ProcessingTargetResponse,
    ProcessingTargetUpdate,
)
from backend.processing.service import ProcessingService


router = APIRouter(
    prefix="/processing",
    tags=["Processing"],
)


# ------------------------------------------------------------------
# Dashboard
# ------------------------------------------------------------------

@router.get(
    "/dashboard",
    response_model=ProcessingDashboardResponse,
)
def get_processing_dashboard(
    target_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return ProcessingService.get_dashboard(
        db=db,
        target_date=target_date,
    )


@router.get(
    "/summary",
    response_model=ProcessingSummaryResponse,
)
def get_processing_summary(
    target_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return ProcessingService.get_summary(
        db=db,
        target_date=target_date,
    )


@router.get(
    "/chart",
)
def get_processing_chart(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return ProcessingService.get_chart(
        db=db,
        start_date=start_date,
        end_date=end_date,
    )


# ------------------------------------------------------------------
# Processing Records
# ------------------------------------------------------------------

@router.post(
    "/records",
    response_model=ProcessingRecordResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_processing_record(
    payload: ProcessingRecordCreate,
    db: Session = Depends(get_db),
):
    try:
        return ProcessingService.create_record(
            db=db,
            payload=payload,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc


@router.get(
    "/records",
    response_model=list[ProcessingRecordResponse],
)
def get_processing_records(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    record_status: str | None = Query(
        default=None,
        alias="status",
    ),
    shift: str | None = Query(default=None),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
    ),
    db: Session = Depends(get_db),
):
    return ProcessingService.get_records(
        db=db,
        start_date=start_date,
        end_date=end_date,
        status=record_status,
        shift=shift,
        limit=limit,
    )


@router.get(
    "/records/{record_id}",
    response_model=ProcessingRecordResponse,
)
def get_processing_record(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = ProcessingService.get_record(
        db=db,
        record_id=record_id,
    )

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processing record not found.",
        )

    return record


@router.put(
    "/records/{record_id}",
    response_model=ProcessingRecordResponse,
)
def update_processing_record(
    record_id: int,
    payload: ProcessingRecordUpdate,
    db: Session = Depends(get_db),
):
    try:
        record = ProcessingService.update_record(
            db=db,
            record_id=record_id,
            payload=payload,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processing record not found.",
        )

    return record


@router.delete(
    "/records/{record_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_processing_record(
    record_id: int,
    db: Session = Depends(get_db),
):
    deleted = ProcessingService.delete_record(
        db=db,
        record_id=record_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processing record not found.",
        )

    return None


# ------------------------------------------------------------------
# Processing Targets
# ------------------------------------------------------------------

@router.post(
    "/targets",
    response_model=ProcessingTargetResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_processing_target(
    payload: ProcessingTargetCreate,
    db: Session = Depends(get_db),
):
    return ProcessingService.create_target(
        db=db,
        payload=payload,
    )


@router.get(
    "/targets/{target_date}",
    response_model=ProcessingTargetResponse,
)
def get_processing_target(
    target_date: date,
    db: Session = Depends(get_db),
):
    target = ProcessingService.get_target(
        db=db,
        target_date=target_date,
    )

    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processing target not found.",
        )

    return target


@router.get(
    "/targets/{target_date}/progress",
    response_model=ProcessingTargetProgress,
)
def get_processing_target_progress(
    target_date: date,
    db: Session = Depends(get_db),
):
    progress = ProcessingService.get_target_progress(
        db=db,
        target_date=target_date,
    )

    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processing target not found.",
        )

    return progress


@router.put(
    "/targets/{target_id}",
    response_model=ProcessingTargetResponse,
)
def update_processing_target(
    target_id: int,
    payload: ProcessingTargetUpdate,
    db: Session = Depends(get_db),
):
    target = ProcessingService.update_target(
        db=db,
        target_id=target_id,
        payload=payload,
    )

    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processing target not found.",
        )

    return target


@router.delete(
    "/targets/{target_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_processing_target(
    target_id: int,
    db: Session = Depends(get_db),
):
    deleted = ProcessingService.delete_target(
        db=db,
        target_id=target_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processing target not found.",
        )

    return None


# ------------------------------------------------------------------
# Processing Issues
# ------------------------------------------------------------------

@router.post(
    "/issues",
    response_model=ProcessingIssueResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_processing_issue(
    payload: ProcessingIssueCreate,
    db: Session = Depends(get_db),
):
    return ProcessingService.create_issue(
        db=db,
        payload=payload,
    )


@router.get(
    "/issues",
    response_model=list[ProcessingIssueResponse],
)
def get_processing_issues(
    issue_status: str | None = Query(
        default=None,
        alias="status",
    ),
    priority: str | None = Query(default=None),
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
    ),
    db: Session = Depends(get_db),
):
    return ProcessingService.get_issues(
        db=db,
        status=issue_status,
        priority=priority,
        limit=limit,
    )


@router.get(
    "/issues/{issue_id}",
    response_model=ProcessingIssueResponse,
)
def get_processing_issue(
    issue_id: int,
    db: Session = Depends(get_db),
):
    issue = ProcessingService.get_issue(
        db=db,
        issue_id=issue_id,
    )

    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processing issue not found.",
        )

    return issue


@router.put(
    "/issues/{issue_id}",
    response_model=ProcessingIssueResponse,
)
def update_processing_issue(
    issue_id: int,
    payload: ProcessingIssueUpdate,
    db: Session = Depends(get_db),
):
    issue = ProcessingService.update_issue(
        db=db,
        issue_id=issue_id,
        payload=payload,
    )

    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processing issue not found.",
        )

    return issue


@router.delete(
    "/issues/{issue_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_processing_issue(
    issue_id: int,
    db: Session = Depends(get_db),
):
    deleted = ProcessingService.delete_issue(
        db=db,
        issue_id=issue_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processing issue not found.",
        )

    return None