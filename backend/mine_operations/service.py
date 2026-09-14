from datetime import date, timedelta
from decimal import Decimal

from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from backend.mine_operations.model import (
    MineShift,
    OperationalIssue,
    ProductionRecord,
    ProductionTarget,
)
from backend.mine_operations.schema import (
    CurrentShiftResponse,
    MineShiftCreate,
    OperationalIssueCreate,
    OperationalIssueUpdate,
    ProductionChartPoint,
    ProductionRecordCreate,
    ProductionRecordUpdate,
    ProductionSummary,
    ProductionTargetCreate,
    ProductionTargetProgress,
)


class MineOperationsService:
    """
    Business logic for the Mine Operations module.

    This service uses the exact SQLAlchemy model field names
    while accepting the frontend-friendly API field names.
    """

    # ========================================================
    # PRODUCTION RECORDS
    # ========================================================

    @staticmethod
    def create_production_record(
        db: Session,
        payload: ProductionRecordCreate,
    ) -> ProductionRecord:

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

        if record.processed > record.extracted:
            raise ValueError(
                "Processed tonnes cannot be greater than extracted tonnes."
            )

        if record.downtime > record.operating_hours:
            raise ValueError(
                "Downtime cannot be greater than operating hours."
            )

        db.add(record)
        db.commit()
        db.refresh(record)

        return record

    @staticmethod
    def get_production_record(
        db: Session,
        record_id: int,
    ) -> ProductionRecord | None:

        statement = select(ProductionRecord).where(
            ProductionRecord.id == record_id
        )

        return db.scalar(statement)

    @staticmethod
    def list_production_records(
        db: Session,
        shift: str | None = None,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> list[ProductionRecord]:

        statement: Select[tuple[ProductionRecord]] = (
            select(ProductionRecord)
            .order_by(
                ProductionRecord.date.desc(),
                ProductionRecord.id.desc(),
            )
        )

        if shift and shift != "All Shifts":
            statement = statement.where(
                ProductionRecord.shift == shift
            )

        if start_date:
            statement = statement.where(
                ProductionRecord.date >= start_date
            )

        if end_date:
            statement = statement.where(
                ProductionRecord.date <= end_date
            )

        return list(
            db.scalars(statement).all()
        )

    @staticmethod
    def update_production_record(
        db: Session,
        record: ProductionRecord,
        payload: ProductionRecordUpdate,
    ) -> ProductionRecord:

        data = payload.model_dump(
            exclude_unset=True
        )

        field_map = {
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

        for frontend_field, value in data.items():
            model_field = field_map[frontend_field]
            setattr(
                record,
                model_field,
                value,
            )

        if record.processed > record.extracted:
            raise ValueError(
                "Processed tonnes cannot be greater than extracted tonnes."
            )

        if record.downtime > record.operating_hours:
            raise ValueError(
                "Downtime cannot be greater than operating hours."
            )

        db.commit()
        db.refresh(record)

        return record

    @staticmethod
    def delete_production_record(
        db: Session,
        record: ProductionRecord,
    ) -> None:

        db.delete(record)
        db.commit()

    # ========================================================
    # PRODUCTION SUMMARY
    # ========================================================

    @staticmethod
    def get_production_summary(
        db: Session,
        start_date: date,
        end_date: date,
        shift: str | None = None,
    ) -> ProductionSummary:

        records = MineOperationsService.list_production_records(
            db=db,
            shift=shift,
            start_date=start_date,
            end_date=end_date,
        )

        total_extracted = sum(
            (
                Decimal(str(record.extracted))
                for record in records
            ),
            Decimal("0"),
        )

        total_processed = sum(
            (
                Decimal(str(record.processed))
                for record in records
            ),
            Decimal("0"),
        )

        total_output = sum(
            (
                Decimal(str(record.output))
                for record in records
            ),
            Decimal("0"),
        )

        total_operating_hours = sum(
            (
                Decimal(str(record.operating_hours))
                for record in records
            ),
            Decimal("0"),
        )

        total_downtime = sum(
            (
                Decimal(str(record.downtime))
                for record in records
            ),
            Decimal("0"),
        )

        processing_efficiency = (
            total_processed / total_extracted * 100
            if total_extracted > 0
            else Decimal("0")
        )

        total_time = (
            total_operating_hours + total_downtime
        )

        operating_efficiency = (
            total_operating_hours / total_time * 100
            if total_time > 0
            else Decimal("0")
        )

        completed_records = sum(
            record.status == "Completed"
            for record in records
        )

        in_progress_records = sum(
            record.status == "In Progress"
            for record in records
        )

        delayed_records = sum(
            record.status == "Delayed"
            for record in records
        )

        return ProductionSummary(
            total_extracted=float(total_extracted),
            total_processed=float(total_processed),
            total_output=float(total_output),
            total_operating_hours=float(
                total_operating_hours
            ),
            total_downtime=float(
                total_downtime
            ),
            processing_efficiency=float(
                processing_efficiency.quantize(
                    Decimal("0.01")
                )
            ),
            operating_efficiency=float(
                operating_efficiency.quantize(
                    Decimal("0.01")
                )
            ),
            completed_records=completed_records,
            in_progress_records=in_progress_records,
            delayed_records=delayed_records,
        )

    # ========================================================
    # PRODUCTION CHART
    # ========================================================

    @staticmethod
    def get_chart_data(
        db: Session,
        start_date: date,
        end_date: date,
        shift: str | None = None,
    ) -> list[ProductionChartPoint]:

        records = MineOperationsService.list_production_records(
            db=db,
            shift=shift,
            start_date=start_date,
            end_date=end_date,
        )

        grouped: dict[
            date,
            dict[str, Decimal],
        ] = {}

        current = start_date

        while current <= end_date:
            grouped[current] = {
                "extracted": Decimal("0"),
                "processed": Decimal("0"),
                "output": Decimal("0"),
            }

            current += timedelta(days=1)

        for record in records:
            if record.date not in grouped:
                grouped[record.date] = {
                    "extracted": Decimal("0"),
                    "processed": Decimal("0"),
                    "output": Decimal("0"),
                }

            grouped[record.date]["extracted"] += Decimal(
                str(record.extracted)
            )

            grouped[record.date]["processed"] += Decimal(
                str(record.processed)
            )

            grouped[record.date]["output"] += Decimal(
                str(record.output)
            )

        result: list[ProductionChartPoint] = []

        for record_date in sorted(grouped):
            values = grouped[record_date]

            result.append(
                ProductionChartPoint(
                    day=record_date.strftime("%a"),
                    date=record_date,
                    extracted=float(
                        values["extracted"]
                    ),
                    processed=float(
                        values["processed"]
                    ),
                    output=float(
                        values["output"]
                    ),
                )
            )

        return result

    # ========================================================
    # PRODUCTION TARGETS
    # ========================================================

    @staticmethod
    def get_target(
        db: Session,
        target_date: date,
    ) -> ProductionTarget | None:

        statement = select(
            ProductionTarget
        ).where(
            ProductionTarget.target_date == target_date
        )

        return db.scalar(statement)

    @staticmethod
    def create_or_update_target(
        db: Session,
        payload: ProductionTargetCreate,
    ) -> ProductionTarget:

        target = MineOperationsService.get_target(
            db=db,
            target_date=payload.target_date,
        )

        if target:
            target.target_output = payload.target_output

        else:
            target = ProductionTarget(
                target_date=payload.target_date,
                target_output=payload.target_output,
            )

            db.add(target)

        db.commit()
        db.refresh(target)

        return target

    @staticmethod
    def get_target_progress(
        db: Session,
        target_date: date,
    ) -> ProductionTargetProgress:

        target = MineOperationsService.get_target(
            db=db,
            target_date=target_date,
        )

        target_output = (
            Decimal(str(target.target_output))
            if target
            else Decimal("0")
        )

        records = MineOperationsService.list_production_records(
            db=db,
            start_date=target_date,
            end_date=target_date,
        )

        actual_output = sum(
            (
                Decimal(str(record.output))
                for record in records
            ),
            Decimal("0"),
        )

        remaining_output = max(
            target_output - actual_output,
            Decimal("0"),
        )

        progress_percentage = (
            actual_output / target_output * 100
            if target_output > 0
            else Decimal("0")
        )

        progress_percentage = min(
            progress_percentage,
            Decimal("100"),
        )

        return ProductionTargetProgress(
            target_date=target_date,
            target_output=float(target_output),
            actual_output=float(actual_output),
            remaining_output=float(remaining_output),
            progress_percentage=float(
                progress_percentage.quantize(
                    Decimal("0.01")
                )
            ),
        )

    # ========================================================
    # OPERATIONAL ISSUES
    # ========================================================

    @staticmethod
    def list_operational_issues(
        db: Session,
        status: str = "Active",
    ) -> list[OperationalIssue]:

        statement = (
            select(OperationalIssue)
            .where(
                OperationalIssue.status == status
            )
            .order_by(
                OperationalIssue.created_at.desc()
            )
        )

        return list(
            db.scalars(statement).all()
        )

    @staticmethod
    def create_operational_issue(
        db: Session,
        payload: OperationalIssueCreate,
    ) -> OperationalIssue:

        duration = (
            str(payload.durationMinutes)
            if payload.durationMinutes is not None
            else "—"
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

        return issue

    @staticmethod
    def get_operational_issue(
        db: Session,
        issue_id: int,
    ) -> OperationalIssue | None:

        statement = select(
            OperationalIssue
        ).where(
            OperationalIssue.id == issue_id
        )

        return db.scalar(statement)

    @staticmethod
    def update_operational_issue(
        db: Session,
        issue: OperationalIssue,
        payload: OperationalIssueUpdate,
    ) -> OperationalIssue:

        data = payload.model_dump(
            exclude_unset=True
        )

        if "title" in data:
            issue.title = data["title"]

        if "description" in data:
            issue.description = data["description"] or ""

        if "category" in data:
            issue.category = data["category"]

        if "priority" in data:
            issue.priority = data["priority"]

        if "durationMinutes" in data:
            duration = data["durationMinutes"]

            issue.duration = (
                str(duration)
                if duration is not None
                else "—"
            )

        if "status" in data:
            issue.status = data["status"]

        db.commit()
        db.refresh(issue)

        return issue

    @staticmethod
    def delete_operational_issue(
        db: Session,
        issue: OperationalIssue,
    ) -> None:

        db.delete(issue)
        db.commit()

    # ========================================================
    # SHIFTS
    # ========================================================

    @staticmethod
    def create_shift(
        db: Session,
        payload: MineShiftCreate,
    ) -> MineShift:

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

        return shift

    @staticmethod
    def update_shift(
        db: Session,
        shift: MineShift,
        payload,
    ) -> MineShift:

        data = payload.model_dump(
            exclude_unset=True
        )

        if "shift" in data:
            shift.shift_name = data["shift"]

        if "status" in data:
            shift.status = data["status"]

        if "supervisor" in data:
            shift.supervisor = data["supervisor"]

        if "startTime" in data:
            value = data["startTime"]
            shift.start_time = (
                value.strftime("%H:%M")
                if hasattr(value, "strftime")
                else str(value)
            )

        if "endTime" in data:
            value = data["endTime"]
            shift.end_time = (
                value.strftime("%H:%M")
                if hasattr(value, "strftime")
                else str(value)
            )

        if "workers" in data:
            shift.workers = data["workers"]

        db.commit()
        db.refresh(shift)

        return shift

    @staticmethod
    def list_shifts(
        db: Session,
    ) -> list[MineShift]:

        statement = select(
            MineShift
        ).order_by(
            MineShift.id.desc()
        )

        return list(
            db.scalars(statement).all()
        )

    @staticmethod
    def get_active_shift(
        db: Session,
    ) -> MineShift | None:

        statement = (
            select(MineShift)
            .where(
                MineShift.status == "Active"
            )
            .order_by(
                MineShift.id.desc()
            )
        )

        return db.scalar(statement)

    @staticmethod
    def get_current_shift(
        db: Session,
        target_date: date,
    ) -> CurrentShiftResponse:

        shift = MineOperationsService.get_active_shift(
            db=db
        )

        if not shift:
            return CurrentShiftResponse()

        records = MineOperationsService.list_production_records(
            db=db,
            shift=shift.shift_name,
            start_date=target_date,
            end_date=target_date,
        )

        production = sum(
            (
                Decimal(str(record.output))
                for record in records
            ),
            Decimal("0"),
        )

        operating_hours = sum(
            (
                Decimal(str(record.operating_hours))
                for record in records
            ),
            Decimal("0"),
        )

        downtime = sum(
            (
                Decimal(str(record.downtime))
                for record in records
            ),
            Decimal("0"),
        )

        return CurrentShiftResponse(
            id=shift.id,
            date=target_date,
            shift=shift.shift_name,
            status=shift.status,
            supervisor=shift.supervisor,
            startTime=shift.start_time,
            endTime=shift.end_time,
            workers=shift.workers,
            production=float(production),
            operatingHours=float(operating_hours),
            downtime=float(downtime),
        )