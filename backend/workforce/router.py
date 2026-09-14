from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.core.database import get_db

from backend.workforce.schema import (
    WorkerCreate,
    WorkerUpdate,
    WorkerResponse,
    WorkerStatusUpdate,
    WorkerSafetyUpdate,
    WorkforceSummary,
    WorkforceDashboard,
    WorkforceIssue,
)

from backend.workforce.service import WorkforceService


router = APIRouter(
    prefix="/workforce",
    tags=["Workforce"],
)


@router.get(
    "/dashboard",
    response_model=WorkforceDashboard,
)
def get_dashboard(
    db: Session = Depends(get_db),
):
    return WorkforceService.get_dashboard(db)


@router.get(
    "/summary",
    response_model=WorkforceSummary,
)
def get_summary(
    db: Session = Depends(get_db),
):
    return WorkforceService.get_summary(db)


@router.get(
    "/workers",
    response_model=list[WorkerResponse],
)
def get_workers(
    department: Optional[str] = Query(
        default=None,
    ),
    status: Optional[str] = Query(
        default=None,
    ),
    search: Optional[str] = Query(
        default=None,
    ),
    db: Session = Depends(get_db),
):
    return WorkforceService.get_workers(
        db=db,
        department=department,
        status=status,
        search=search,
    )


@router.post(
    "/workers",
    response_model=WorkerResponse,
    status_code=201,
)
def create_worker(
    worker_data: WorkerCreate,
    db: Session = Depends(get_db),
):
    try:
        return WorkforceService.create_worker(
            db,
            worker_data,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="Employee number already exists.",
        )


@router.get(
    "/workers/employee/{employee_number}",
    response_model=WorkerResponse,
)
def get_worker_by_employee_number(
    employee_number: str,
    db: Session = Depends(get_db),
):
    worker = WorkforceService.get_worker_by_employee_number(
        db,
        employee_number,
    )

    if not worker:
        raise HTTPException(
            status_code=404,
            detail="Worker not found.",
        )

    return worker


@router.get(
    "/workers/{worker_id}",
    response_model=WorkerResponse,
)
def get_worker(
    worker_id: int,
    db: Session = Depends(get_db),
):
    worker = WorkforceService.get_worker(
        db,
        worker_id,
    )

    if not worker:
        raise HTTPException(
            status_code=404,
            detail="Worker not found.",
        )

    return worker


@router.put(
    "/workers/{worker_id}",
    response_model=WorkerResponse,
)
def update_worker(
    worker_id: int,
    worker_data: WorkerUpdate,
    db: Session = Depends(get_db),
):
    try:
        worker = WorkforceService.update_worker(
            db,
            worker_id,
            worker_data,
        )

        if not worker:
            raise HTTPException(
                status_code=404,
                detail="Worker not found.",
            )

        return worker

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="Employee number already exists.",
        )


@router.delete(
    "/workers/{worker_id}",
)
def delete_worker(
    worker_id: int,
    db: Session = Depends(get_db),
):
    deleted = WorkforceService.delete_worker(
        db,
        worker_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Worker not found.",
        )

    return {
        "message": "Worker deleted successfully.",
        "id": worker_id,
    }


@router.put(
    "/workers/{worker_id}/status",
    response_model=WorkerResponse,
)
def update_worker_status(
    worker_id: int,
    status_data: WorkerStatusUpdate,
    db: Session = Depends(get_db),
):
    worker = WorkforceService.update_status(
        db,
        worker_id,
        status_data,
    )

    if not worker:
        raise HTTPException(
            status_code=404,
            detail="Worker not found.",
        )

    return worker


@router.put(
    "/workers/{worker_id}/safety",
    response_model=WorkerResponse,
)
def update_worker_safety(
    worker_id: int,
    safety_data: WorkerSafetyUpdate,
    db: Session = Depends(get_db),
):
    worker = WorkforceService.update_safety_status(
        db,
        worker_id,
        safety_data,
    )

    if not worker:
        raise HTTPException(
            status_code=404,
            detail="Worker not found.",
        )

    return worker


@router.get(
    "/issues",
    response_model=list[WorkforceIssue],
)
def get_issues(
    db: Session = Depends(get_db),
):
    return WorkforceService.get_issues(db)