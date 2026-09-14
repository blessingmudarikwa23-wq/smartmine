from datetime import date, datetime, time
from decimal import Decimal
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.core.logging import logger

from backend.mine_operations.model import (
    MineShift,
    OperationalIssue,
    ProductionRecord,
    ProductionTarget,
)

from backend.mine_operations.schema import (
    CurrentShiftResponse,
    MineShiftCreate,
    MineShiftResponse,
    MineShiftUpdate,
    OperationalIssueCreate,
    OperationalIssueResponse,
    OperationalIssueUpdate,
    ProductionChartPoint,
    ProductionRecordCreate,
    ProductionRecordResponse,
    ProductionRecordUpdate,
    ProductionSummary,
    ProductionTargetProgress,
    ProductionTargetResponse,
)

from backend.mine_operations.service import MineOperationsService


router = APIRouter(
    prefix="/mine-operations",
    tags=["Mine Operations"],
)


# ============================================================
# HELPERS
# ============================================================


def decimal_to_float(value: Decimal | float | int | None) -> float:
    """Convert numeric database values to float safely."""
    if value is None:
        return 0.0

    return float(value)


def format_datetime(value: datetime | None) -> str:
    """Convert datetime values to ISO format."""
    if value is None:
        return ""

    return value.isoformat()


def format_time(value: time | str | None) -> str:
    """Convert time values to HH:MM format."""
    if value is None:
        return ""

    if isinstance(value, time):
        return value.strftime("%H:%M")

    return str(value)


def production_record_response(
    record: ProductionRecord,
) -> ProductionRecordResponse:
    """Convert a ProductionRecord model into an API response."""
    return ProductionRecordResponse(
        id=record.id,
        date=record.date,
        shift=record.shift,
        extracted=decimal_to_float(record.extracted),
        processed=decimal_to_float(record.processed),
        output=decimal_to_float(record.output),
        operatingHours=decimal_to_float(record.operating_hours),
        downtime=decimal_to_float(record.downtime),
        status=record.status,
        notes=record.notes,
        createdAt=format_datetime(record.created_at),
        updatedAt=format_datetime(record.updated_at),
    )


def production_target_response(
    target: ProductionTarget,
) -> ProductionTargetResponse:
    """Convert a ProductionTarget model into an API response."""
    return ProductionTargetResponse(
        id=target.id,
        date=target.target_date,
        target=decimal_to_float(target.target_output),
        createdAt=format_datetime(target.created_at),
        updatedAt=format_datetime(target.updated_at),
    )


def issue_duration_text(minutes: int | None) -> str:
    """Convert duration in minutes into readable text."""
    if minutes is None:
        return "—"

    if minutes < 60:
        return f"{minutes} min"

    hours = minutes // 60
    remaining_minutes = minutes % 60

    if remaining_minutes == 0:
        return f"{hours} hr"

    return f"{hours} hr {remaining_minutes} min"


def operational_issue_response(
    issue: OperationalIssue,
) -> OperationalIssueResponse:
    """Convert an OperationalIssue model into an API response."""
    duration_minutes = None

    if issue.duration and issue.duration != "—":
        text = issue.duration.lower().strip()

        try:
            if "hr" in text:
                parts = text.split("hr")
                hours = int(parts[0].strip())
                minutes = 0

                if len(parts) > 1:
                    remainder = parts[1].replace("min", "").strip()

                    if remainder:
                        minutes = int(remainder)

                duration_minutes = hours * 60 + minutes

            elif "min" in text:
                duration_minutes = int(
                    text.replace("min", "").strip()
                )

        except (ValueError, TypeError):
            duration_minutes = None

    return OperationalIssueResponse(
        id=issue.id,
        title=issue.title,
        description=issue.description,
        category=issue.category,
        priority=issue.priority,
        duration=issue.duration or "—",
        durationMinutes=duration_minutes,
        status=issue.status,
        createdAt=format_datetime(issue.created_at),
        updatedAt=format_datetime(issue.updated_at),
    )


def mine_shift_response(
    shift: MineShift,
    db: Session,
) -> MineShiftResponse:
    """Convert a MineShift model into an API response with today's production."""
    production_query = (
        db.query(
            func.coalesce(
                func.sum(ProductionRecord.output),
                0,
            ),
            func.coalesce(
                func.sum(ProductionRecord.operating_hours),
                0,
            ),
            func.coalesce(
                func.sum(ProductionRecord.downtime),
                0,
            ),
        )
        .filter(
            ProductionRecord.shift == shift.shift_name,
            ProductionRecord.date == date.today(),
        )
        .first()
    )

    production = decimal_to_float(production_query[0])
    operating_hours = decimal_to_float(production_query[1])
    downtime = decimal_to_float(production_query[2])

    return MineShiftResponse(
        id=shift.id,
        date=date.today(),
        shift=shift.shift_name,
        status=shift.status,
        supervisor=shift.supervisor,
        startTime=format_time(shift.start_time),
        endTime=format_time(shift.end_time),
        workers=shift.workers,
        production=production,
        operatingHours=operating_hours,
        downtime=downtime,
    )


# ============================================================
# PRODUCTION RECORDS
# ============================================================


@router.get(
    "/production",
    response_model=list[ProductionRecordResponse],
)
def get_production_records(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    shift: str | None = Query(default=None),
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    """Return production records with optional filters."""
    query = db.query(ProductionRecord)

    if start_date is not None:
        query = query.filter(
            ProductionRecord.date >= start_date
        )

    if end_date is not None:
        query = query.filter(
            ProductionRecord.date <= end_date
        )

    if shift:
        query = query.filter(
            ProductionRecord.shift == shift
        )

    if status:
        query = query.filter(
            ProductionRecord.status == status
        )

    records = (
        query
        .order_by(
            ProductionRecord.date.desc(),
            ProductionRecord.id.desc(),
        )
        .all()
    )

    return [
        production_record_response(record)
        for record in records
    ]


@router.post(
    "/production",
    response_model=ProductionRecordResponse,
    status_code=201,
)
def create_production_record(
    payload: ProductionRecordCreate,
    db: Session = Depends(get_db),
):
    """Create a new production record."""
    if payload.processed > payload.extracted:
        raise HTTPException(
            status_code=422,
            detail=(
                "Processed tonnes cannot be greater "
                "than extracted tonnes."
            ),
        )

    if payload.downtime > payload.operatingHours:
        raise HTTPException(
            status_code=422,
            detail=(
                "Downtime cannot be greater "
                "than operating hours."
            ),
        )

    record = ProductionRecord(
        date=payload.date,
        shift=payload.shift,
        extracted=payload.extracted,
        processed=payload.processed,
        output=payload.output,
        operating_hours=payload.operatingHours,
        downtime=payload.downtime,
        status=payload.status,
        notes=payload.notes,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    logger.info(
        "Production record created: id=%s, date=%s, shift=%s",
        record.id,
        record.date,
        record.shift,
    )

    return production_record_response(record)


# ============================================================
# PRODUCTION SUMMARY
# ============================================================


@router.get(
    "/production/summary",
    response_model=ProductionSummary,
)
def get_production_summary(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    """Return production totals and efficiency metrics."""
    query = db.query(ProductionRecord)

    if start_date is not None:
        query = query.filter(
            ProductionRecord.date >= start_date
        )

    if end_date is not None:
        query = query.filter(
            ProductionRecord.date <= end_date
        )

    records = query.all()

    total_extracted = sum(
        decimal_to_float(record.extracted)
        for record in records
    )

    total_processed = sum(
        decimal_to_float(record.processed)
        for record in records
    )

    total_output = sum(
        decimal_to_float(record.output)
        for record in records
    )

    total_operating_hours = sum(
        decimal_to_float(record.operating_hours)
        for record in records
    )

    total_downtime = sum(
        decimal_to_float(record.downtime)
        for record in records
    )

    processing_efficiency = (
        (total_processed / total_extracted) * 100
        if total_extracted > 0
        else 0.0
    )

    total_available_hours = (
        total_operating_hours + total_downtime
    )

    operating_efficiency = (
        (total_operating_hours / total_available_hours) * 100
        if total_available_hours > 0
        else 0.0
    )

    completed_records = sum(
        1
        for record in records
        if record.status == "Completed"
    )

    in_progress_records = sum(
        1
        for record in records
        if record.status == "In Progress"
    )

    delayed_records = sum(
        1
        for record in records
        if record.status == "Delayed"
    )

    return ProductionSummary(
        total_extracted=total_extracted,
        total_processed=total_processed,
        total_output=total_output,
        total_operating_hours=total_operating_hours,
        total_downtime=total_downtime,
        processing_efficiency=processing_efficiency,
        operating_efficiency=operating_efficiency,
        completed_records=completed_records,
        in_progress_records=in_progress_records,
        delayed_records=delayed_records,
    )


# ============================================================
# PRODUCTION CHART
# ============================================================


@router.get(
    "/production/chart",
    response_model=list[ProductionChartPoint],
)
def get_production_chart(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    """Return production totals grouped by date."""
    query = db.query(ProductionRecord)

    if start_date is not None:
        query = query.filter(
            ProductionRecord.date >= start_date
        )

    if end_date is not None:
        query = query.filter(
            ProductionRecord.date <= end_date
        )

    records = (
        query
        .order_by(ProductionRecord.date.asc())
        .all()
    )

    grouped: dict[date, dict[str, float]] = {}

    for record in records:
        if record.date not in grouped:
            grouped[record.date] = {
                "extracted": 0.0,
                "processed": 0.0,
                "output": 0.0,
            }

        grouped[record.date]["extracted"] += (
            decimal_to_float(record.extracted)
        )

        grouped[record.date]["processed"] += (
            decimal_to_float(record.processed)
        )

        grouped[record.date]["output"] += (
            decimal_to_float(record.output)
        )

    return [
        ProductionChartPoint(
            day=record_date.strftime("%a"),
            date=record_date,
            extracted=values["extracted"],
            processed=values["processed"],
            output=values["output"],
        )
        for record_date, values in sorted(
            grouped.items()
        )
    ]


# ============================================================
# PRODUCTION TARGET
# IMPORTANT: ALL /production/target ROUTES MUST COME
# BEFORE /production/{record_id}
# ============================================================


@router.get(
    "/production/target",
    response_model=ProductionTargetResponse,
)
def get_production_target(
    target_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    """Return the production target for a date."""
    effective_date = target_date or date.today()

    target = (
        db.query(ProductionTarget)
        .filter(
            ProductionTarget.target_date == effective_date
        )
        .first()
    )

    if target is None:
        raise HTTPException(
            status_code=404,
            detail="Production target not found.",
        )

    return production_target_response(target)


@router.post(
    "/production/target",
    response_model=ProductionTargetResponse,
)
def create_production_target(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
):
    """Create or update a production target."""
    raw_date = (
        payload.get("target_date")
        or payload.get("date")
    )

    raw_target = (
        payload.get("target_output")
        if payload.get("target_output") is not None
        else payload.get("target")
    )

    if raw_date is None:
        raise HTTPException(
            status_code=422,
            detail="target_date is required.",
        )

    if raw_target is None:
        raise HTTPException(
            status_code=422,
            detail="target_output is required.",
        )

    try:
        effective_date = (
            raw_date
            if isinstance(raw_date, date)
            else date.fromisoformat(str(raw_date))
        )

        target_output = float(raw_target)

    except (ValueError, TypeError):
        raise HTTPException(
            status_code=422,
            detail="Invalid target date or target output.",
        )

    if target_output < 0:
        raise HTTPException(
            status_code=422,
            detail="Target output cannot be negative.",
        )

    existing_target = (
        db.query(ProductionTarget)
        .filter(
            ProductionTarget.target_date == effective_date
        )
        .first()
    )

    if existing_target:
        existing_target.target_output = target_output

        db.commit()
        db.refresh(existing_target)

        logger.info(
            "Production target updated through POST: date=%s target=%s",
            effective_date,
            target_output,
        )

        return production_target_response(existing_target)

    target = ProductionTarget(
        target_date=effective_date,
        target_output=target_output,
    )

    db.add(target)
    db.commit()
    db.refresh(target)

    logger.info(
        "Production target created: date=%s target=%s",
        effective_date,
        target_output,
    )

    return production_target_response(target)


@router.put(
    "/production/target",
    response_model=ProductionTargetResponse,
)
async def update_production_target(
    request: Request,
    target_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    """Update an existing production target."""
    body: dict[str, Any] = {}

    try:
        body = await request.json()

        if not isinstance(body, dict):
            body = {}

    except Exception:
        body = {}

    raw_date = (
        target_date
        or body.get("target_date")
        or body.get("date")
    )

    raw_target = (
        body.get("target_output")
        if body.get("target_output") is not None
        else body.get("target")
    )

    if raw_date is None:
        raise HTTPException(
            status_code=422,
            detail="target_date is required.",
        )

    if raw_target is None:
        raise HTTPException(
            status_code=422,
            detail=(
                "target_output is required. "
                "Send target_output or target."
            ),
        )

    try:
        effective_date = (
            raw_date
            if isinstance(raw_date, date)
            else date.fromisoformat(str(raw_date))
        )

        target_output = float(raw_target)

    except (ValueError, TypeError):
        raise HTTPException(
            status_code=422,
            detail="Invalid target date or target output.",
        )

    if target_output < 0:
        raise HTTPException(
            status_code=422,
            detail="Target output cannot be negative.",
        )

    target = (
        db.query(ProductionTarget)
        .filter(
            ProductionTarget.target_date == effective_date
        )
        .first()
    )

    if target is None:
        raise HTTPException(
            status_code=404,
            detail=(
                f"No production target exists for "
                f"{effective_date.isoformat()}."
            ),
        )

    target.target_output = target_output

    db.commit()
    db.refresh(target)

    logger.info(
        "Production target updated: date=%s target=%s",
        effective_date,
        target_output,
    )

    return production_target_response(target)


# ============================================================
# PRODUCTION TARGET PROGRESS
# ============================================================


@router.get(
    "/production/target/progress",
    response_model=ProductionTargetProgress,
)
def get_production_target_progress(
    target_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    """Return target progress for a date."""
    effective_date = target_date or date.today()

    target = (
        db.query(ProductionTarget)
        .filter(
            ProductionTarget.target_date == effective_date
        )
        .first()
    )

    target_output = (
        decimal_to_float(target.target_output)
        if target
        else 0.0
    )

    actual_output_value = (
        db.query(
            func.coalesce(
                func.sum(ProductionRecord.output),
                0,
            )
        )
        .filter(
            ProductionRecord.date == effective_date
        )
        .scalar()
    )

    actual_output = decimal_to_float(actual_output_value)

    remaining_output = max(
        target_output - actual_output,
        0.0,
    )

    progress_percentage = (
        min((actual_output / target_output) * 100, 100.0)
        if target_output > 0
        else 0.0
    )

    return ProductionTargetProgress(
        target_date=effective_date,
        target_output=target_output,
        actual_output=actual_output,
        remaining_output=remaining_output,
        progress_percentage=progress_percentage,
    )


# ============================================================
# PRODUCTION RECORD UPDATE / DELETE
# IMPORTANT: DYNAMIC ROUTES COME AFTER STATIC ROUTES
# ============================================================


@router.put(
    "/production/{record_id}",
    response_model=ProductionRecordResponse,
)
def update_production_record(
    record_id: int,
    payload: ProductionRecordUpdate,
    db: Session = Depends(get_db),
):
    """Update an existing production record."""
    record = db.get(
        ProductionRecord,
        record_id,
    )

    if record is None:
        raise HTTPException(
            status_code=404,
            detail="Production record not found.",
        )

    updates = payload.model_dump(
        exclude_unset=True,
    )

    field_mapping = {
        "date": "date",
        "shift": "shift",
        "extracted": "extracted",
        "processed": "processed",
        "output": "output",
        "operatingHours": "operating_hours",
        "downtime": "downtime",
        "status": "status",
        "notes": "notes",
    }

    for frontend_field, model_field in field_mapping.items():
        if frontend_field in updates:
            setattr(
                record,
                model_field,
                updates[frontend_field],
            )

    if record.processed > record.extracted:
        raise HTTPException(
            status_code=422,
            detail=(
                "Processed tonnes cannot be greater "
                "than extracted tonnes."
            ),
        )

    if record.downtime > record.operating_hours:
        raise HTTPException(
            status_code=422,
            detail=(
                "Downtime cannot be greater "
                "than operating hours."
            ),
        )

    db.commit()
    db.refresh(record)

    logger.info(
        "Production record updated: id=%s",
        record.id,
    )

    return production_record_response(record)


@router.delete(
    "/production/{record_id}",
)
def delete_production_record(
    record_id: int,
    db: Session = Depends(get_db),
):
    """Delete a production record."""
    record = db.get(
        ProductionRecord,
        record_id,
    )

    if record is None:
        raise HTTPException(
            status_code=404,
            detail="Production record not found.",
        )

    db.delete(record)
    db.commit()

    logger.info(
        "Production record deleted: id=%s",
        record_id,
    )

    return {
        "message": "Production record deleted successfully.",
        "id": record_id,
    }


# ============================================================
# OPERATIONAL ISSUES
# ============================================================


@router.get(
    "/issues",
    response_model=list[OperationalIssueResponse],
)
def get_operational_issues(
    status: str | None = Query(default=None),
    priority: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    """Return operational issues with optional filters."""
    query = db.query(OperationalIssue)

    if status:
        query = query.filter(
            OperationalIssue.status == status
        )

    if priority:
        query = query.filter(
            OperationalIssue.priority == priority
        )

    issues = (
        query
        .order_by(
            OperationalIssue.created_at.desc()
        )
        .all()
    )

    return [
        operational_issue_response(issue)
        for issue in issues
    ]


@router.post(
    "/issues",
    response_model=OperationalIssueResponse,
    status_code=201,
)
def create_operational_issue(
    payload: OperationalIssueCreate,
    db: Session = Depends(get_db),
):
    """Create a new operational issue."""
    duration = issue_duration_text(
        payload.durationMinutes
    )

    issue = OperationalIssue(
        title=payload.title,
        description=payload.description or "",
        category=payload.category,
        priority=payload.priority,
        duration=duration,
        status=payload.status,
    )

    db.add(issue)
    db.commit()
    db.refresh(issue)

    logger.info(
        "Operational issue created: id=%s",
        issue.id,
    )

    return operational_issue_response(issue)


@router.put(
    "/issues/{issue_id}",
    response_model=OperationalIssueResponse,
)
def update_operational_issue(
    issue_id: int,
    payload: OperationalIssueUpdate,
    db: Session = Depends(get_db),
):
    """Update an existing operational issue."""
    issue = db.get(
        OperationalIssue,
        issue_id,
    )

    if issue is None:
        raise HTTPException(
            status_code=404,
            detail="Operational issue not found.",
        )

    updates = payload.model_dump(
        exclude_unset=True,
    )

    if "title" in updates:
        issue.title = updates["title"]

    if "description" in updates:
        issue.description = (
            updates["description"] or ""
        )

    if "category" in updates:
        issue.category = updates["category"]

    if "priority" in updates:
        issue.priority = updates["priority"]

    if "durationMinutes" in updates:
        issue.duration = issue_duration_text(
            updates["durationMinutes"]
        )

    if "status" in updates:
        issue.status = updates["status"]

    db.commit()
    db.refresh(issue)

    logger.info(
        "Operational issue updated: id=%s",
        issue.id,
    )

    return operational_issue_response(issue)


@router.delete(
    "/issues/{issue_id}",
)
def delete_operational_issue(
    issue_id: int,
    db: Session = Depends(get_db),
):
    """Delete an operational issue."""
    issue = db.get(
        OperationalIssue,
        issue_id,
    )

    if issue is None:
        raise HTTPException(
            status_code=404,
            detail="Operational issue not found.",
        )

    db.delete(issue)
    db.commit()

    logger.info(
        "Operational issue deleted: id=%s",
        issue_id,
    )

    return {
        "message": "Operational issue deleted successfully.",
        "id": issue_id,
    }


# ============================================================
# MINE SHIFTS
# ============================================================


@router.get(
    "/shifts",
    response_model=list[MineShiftResponse],
)
def get_mine_shifts(
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    """Return mine shifts with optional status filtering."""
    query = db.query(MineShift)

    if status:
        query = query.filter(
            MineShift.status == status
        )

    shifts = (
        query
        .order_by(MineShift.id.asc())
        .all()
    )

    return [
        mine_shift_response(shift, db)
        for shift in shifts
    ]


# ============================================================
# CURRENT SHIFT
# IMPORTANT: THIS MUST COME BEFORE /shifts/{shift_id}
# ============================================================


@router.get(
    "/shifts/current",
    response_model=CurrentShiftResponse,
)
def get_current_shift(
    db: Session = Depends(get_db),
):
    """Return the current mine shift."""
    return MineOperationsService.get_current_shift(
        db=db,
        target_date=date.today(),
    )


@router.post(
    "/shifts",
    response_model=MineShiftResponse,
    status_code=201,
)
def create_mine_shift(
    payload: MineShiftCreate,
    db: Session = Depends(get_db),
):
    """Create a new mine shift."""
    shift = MineShift(
        shift_name=payload.shift,
        status=payload.status,
        supervisor=payload.supervisor,
        start_time=payload.startTime.strftime("%H:%M"),
        end_time=payload.endTime.strftime("%H:%M"),
        workers=payload.workers,
    )

    db.add(shift)
    db.commit()
    db.refresh(shift)

    logger.info(
        "Mine shift created: id=%s shift=%s",
        shift.id,
        shift.shift_name,
    )

    return mine_shift_response(
        shift,
        db,
    )


@router.put(
    "/shifts/{shift_id}",
    response_model=MineShiftResponse,
)
def update_mine_shift(
    shift_id: int,
    payload: MineShiftUpdate,
    db: Session = Depends(get_db),
):
    """Update an existing mine shift."""
    shift = db.get(
        MineShift,
        shift_id,
    )

    if shift is None:
        raise HTTPException(
            status_code=404,
            detail="Mine shift not found.",
        )

    updates = payload.model_dump(
        exclude_unset=True,
    )

    if "shift" in updates:
        shift.shift_name = updates["shift"]

    if "status" in updates:
        shift.status = updates["status"]

    if "supervisor" in updates:
        shift.supervisor = updates["supervisor"]

    if "startTime" in updates:
        value = updates["startTime"]

        if isinstance(value, time):
            shift.start_time = value.strftime("%H:%M")
        else:
            shift.start_time = str(value)

    if "endTime" in updates:
        value = updates["endTime"]

        if isinstance(value, time):
            shift.end_time = value.strftime("%H:%M")
        else:
            shift.end_time = str(value)

    if "workers" in updates:
        shift.workers = updates["workers"]

    db.commit()
    db.refresh(shift)

    logger.info(
        "Mine shift updated: id=%s",
        shift.id,
    )

    return mine_shift_response(
        shift,
        db,
    )


@router.delete(
    "/shifts/{shift_id}",
)
def delete_mine_shift(
    shift_id: int,
    db: Session = Depends(get_db),
):
    """Delete a mine shift."""
    shift = db.get(
        MineShift,
        shift_id,
    )

    if shift is None:
        raise HTTPException(
            status_code=404,
            detail="Mine shift not found.",
        )

    db.delete(shift)
    db.commit()

    logger.info(
        "Mine shift deleted: id=%s",
        shift_id,
    )

    return {
        "message": "Mine shift deleted successfully.",
        "id": shift_id,
    }
