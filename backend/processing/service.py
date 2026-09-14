from datetime import date, timedelta
from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.processing.model import (
    ProcessingIssue,
    ProcessingRecord,
    ProcessingTarget,
)
from backend.processing.schema import (
    ProcessingIssueCreate,
    ProcessingIssueUpdate,
    ProcessingRecordCreate,
    ProcessingRecordUpdate,
    ProcessingTargetCreate,
    ProcessingTargetUpdate,
)


class ProcessingService:

    @staticmethod
    def _record_to_dict(record: ProcessingRecord) -> dict:
        return {
            "id": record.id,
            "date": record.date,
            "shift": record.shift,
            "materialReceived": float(record.material_received),
            "crushed": float(record.crushed),
            "processed": float(record.processed),
            "output": float(record.output),
            "operatingHours": float(record.operating_hours),
            "downtime": float(record.downtime),
            "status": record.status,
            "notes": record.notes,
            "createdAt": record.created_at.isoformat(),
            "updatedAt": record.updated_at.isoformat(),
        }

    @staticmethod
    def _issue_duration(minutes: int | None) -> str:
        if minutes is None:
            return "—"

        if minutes < 60:
            return f"{minutes}m"

        hours = minutes // 60
        remaining_minutes = minutes % 60

        if remaining_minutes == 0:
            return f"{hours}h"

        return f"{hours}h {remaining_minutes}m"

    @staticmethod
    def _issue_to_dict(issue: ProcessingIssue) -> dict:
        return {
            "id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "category": issue.category,
            "priority": issue.priority,
            "duration": ProcessingService._issue_duration(
                issue.duration_minutes
            ),
            "durationMinutes": issue.duration_minutes,
            "status": issue.status,
            "createdAt": issue.created_at.isoformat(),
            "updatedAt": issue.updated_at.isoformat(),
        }

    @staticmethod
    def _validate_record_values(
        material_received: float,
        crushed: float,
        processed: float,
        output: float,
        operating_hours: float,
        downtime: float,
    ) -> None:

        if crushed > material_received:
            raise ValueError(
                "Crushed material cannot exceed material received."
            )

        if processed > crushed:
            raise ValueError(
                "Processed material cannot exceed crushed material."
            )

        if output > processed:
            raise ValueError(
                "Final output cannot exceed processed material."
            )

        if downtime > operating_hours:
            raise ValueError(
                "Downtime cannot be greater than operating hours."
            )

    @staticmethod
    def create_record(
        db: Session,
        payload: ProcessingRecordCreate,
    ) -> dict:

        record = ProcessingRecord(
            date=payload.date,
            shift=payload.shift,
            material_received=Decimal(str(payload.material_received)),
            crushed=Decimal(str(payload.crushed)),
            processed=Decimal(str(payload.processed)),
            output=Decimal(str(payload.output)),
            operating_hours=Decimal(str(payload.operating_hours)),
            downtime=Decimal(str(payload.downtime)),
            status=payload.status,
            notes=payload.notes,
        )

        db.add(record)
        db.commit()
        db.refresh(record)

        return ProcessingService._record_to_dict(record)

    @staticmethod
    def get_record(
        db: Session,
        record_id: int,
    ) -> dict | None:

        record = (
            db.query(ProcessingRecord)
            .filter(ProcessingRecord.id == record_id)
            .first()
        )

        if not record:
            return None

        return ProcessingService._record_to_dict(record)

    @staticmethod
    def get_records(
        db: Session,
        start_date: date | None = None,
        end_date: date | None = None,
        status: str | None = None,
        shift: str | None = None,
        limit: int = 100,
    ) -> list[dict]:

        query = db.query(ProcessingRecord)

        if start_date:
            query = query.filter(
                ProcessingRecord.date >= start_date
            )

        if end_date:
            query = query.filter(
                ProcessingRecord.date <= end_date
            )

        if status:
            query = query.filter(
                ProcessingRecord.status == status
            )

        if shift:
            query = query.filter(
                ProcessingRecord.shift == shift
            )

        records = (
            query
            .order_by(
                ProcessingRecord.date.desc(),
                ProcessingRecord.id.desc(),
            )
            .limit(limit)
            .all()
        )

        return [
            ProcessingService._record_to_dict(record)
            for record in records
        ]

    @staticmethod
    def update_record(
        db: Session,
        record_id: int,
        payload: ProcessingRecordUpdate,
    ) -> dict | None:

        record = (
            db.query(ProcessingRecord)
            .filter(ProcessingRecord.id == record_id)
            .first()
        )

        if not record:
            return None

        update_data = payload.model_dump(
            exclude_unset=True,
            by_alias=False,
        )

        if "date" in update_data:
            record.date = update_data["date"]

        if "shift" in update_data:
            record.shift = update_data["shift"]

        if "material_received" in update_data:
            record.material_received = Decimal(
                str(update_data["material_received"])
            )

        if "crushed" in update_data:
            record.crushed = Decimal(
                str(update_data["crushed"])
            )

        if "processed" in update_data:
            record.processed = Decimal(
                str(update_data["processed"])
            )

        if "output" in update_data:
            record.output = Decimal(
                str(update_data["output"])
            )

        if "operating_hours" in update_data:
            record.operating_hours = Decimal(
                str(update_data["operating_hours"])
            )

        if "downtime" in update_data:
            record.downtime = Decimal(
                str(update_data["downtime"])
            )

        if "status" in update_data:
            record.status = update_data["status"]

        if "notes" in update_data:
            record.notes = update_data["notes"]

        ProcessingService._validate_record_values(
            material_received=float(record.material_received),
            crushed=float(record.crushed),
            processed=float(record.processed),
            output=float(record.output),
            operating_hours=float(record.operating_hours),
            downtime=float(record.downtime),
        )

        db.commit()
        db.refresh(record)

        return ProcessingService._record_to_dict(record)

    @staticmethod
    def delete_record(
        db: Session,
        record_id: int,
    ) -> bool:

        record = (
            db.query(ProcessingRecord)
            .filter(ProcessingRecord.id == record_id)
            .first()
        )

        if not record:
            return False

        db.delete(record)
        db.commit()

        return True

    @staticmethod
    def get_summary(
        db: Session,
        target_date: date | None = None,
    ) -> dict:

        if target_date is None:
            target_date = date.today()

        records = (
            db.query(ProcessingRecord)
            .filter(ProcessingRecord.date == target_date)
            .all()
        )

        total_received = sum(
            float(record.material_received)
            for record in records
        )

        total_crushed = sum(
            float(record.crushed)
            for record in records
        )

        total_processed = sum(
            float(record.processed)
            for record in records
        )

        total_output = sum(
            float(record.output)
            for record in records
        )

        total_operating_hours = sum(
            float(record.operating_hours)
            for record in records
        )

        total_downtime = sum(
            float(record.downtime)
            for record in records
        )

        processing_efficiency = (
            (total_processed / total_received) * 100
            if total_received > 0
            else 0
        )

        crusher_efficiency = (
            (total_crushed / total_received) * 100
            if total_received > 0
            else 0
        )

        operating_efficiency = (
            (
                (
                    total_operating_hours
                    - total_downtime
                )
                / total_operating_hours
            )
            * 100
            if total_operating_hours > 0
            else 0
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

        return {
            "totalReceived": round(total_received, 2),
            "totalCrushed": round(total_crushed, 2),
            "totalProcessed": round(total_processed, 2),
            "totalOutput": round(total_output, 2),
            "totalOperatingHours": round(
                total_operating_hours,
                2,
            ),
            "totalDowntime": round(
                total_downtime,
                2,
            ),
            "processingEfficiency": round(
                processing_efficiency,
                2,
            ),
            "crusherEfficiency": round(
                crusher_efficiency,
                2,
            ),
            "operatingEfficiency": round(
                operating_efficiency,
                2,
            ),
            "completedRecords": completed_records,
            "inProgressRecords": in_progress_records,
            "delayedRecords": delayed_records,
        }

    @staticmethod
    def get_chart(
        db: Session,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> list[dict]:

        if end_date is None:
            end_date = date.today()

        if start_date is None:
            start_date = end_date - timedelta(days=6)

        records = (
            db.query(
                ProcessingRecord.date,
                func.sum(
                    ProcessingRecord.material_received
                ).label("received"),
                func.sum(
                    ProcessingRecord.crushed
                ).label("crushed"),
                func.sum(
                    ProcessingRecord.processed
                ).label("processed"),
                func.sum(
                    ProcessingRecord.output
                ).label("output"),
            )
            .filter(
                ProcessingRecord.date >= start_date,
                ProcessingRecord.date <= end_date,
            )
            .group_by(
                ProcessingRecord.date
            )
            .order_by(
                ProcessingRecord.date.asc()
            )
            .all()
        )

        record_map = {
            row.date: row
            for row in records
        }

        result = []

        current_date = start_date

        while current_date <= end_date:
            row = record_map.get(current_date)

            result.append(
                {
                    "day": current_date.strftime("%a"),
                    "date": current_date,
                    "received": round(
                        float(row.received)
                        if row
                        else 0,
                        2,
                    ),
                    "crushed": round(
                        float(row.crushed)
                        if row
                        else 0,
                        2,
                    ),
                    "processed": round(
                        float(row.processed)
                        if row
                        else 0,
                        2,
                    ),
                    "output": round(
                        float(row.output)
                        if row
                        else 0,
                        2,
                    ),
                }
            )

            current_date += timedelta(days=1)

        return result

    @staticmethod
    def create_target(
        db: Session,
        payload: ProcessingTargetCreate,
    ) -> dict:

        existing = (
            db.query(ProcessingTarget)
            .filter(
                ProcessingTarget.target_date
                == payload.target_date
            )
            .first()
        )

        if existing:
            existing.target_output = Decimal(
                str(payload.target_output)
            )

            db.commit()
            db.refresh(existing)

            return {
                "id": existing.id,
                "date": existing.target_date,
                "target": float(existing.target_output),
                "createdAt": existing.created_at.isoformat(),
                "updatedAt": existing.updated_at.isoformat(),
            }

        target = ProcessingTarget(
            target_date=payload.target_date,
            target_output=Decimal(
                str(payload.target_output)
            ),
        )

        db.add(target)
        db.commit()
        db.refresh(target)

        return {
            "id": target.id,
            "date": target.target_date,
            "target": float(target.target_output),
            "createdAt": target.created_at.isoformat(),
            "updatedAt": target.updated_at.isoformat(),
        }

    @staticmethod
    def get_target(
        db: Session,
        target_date: date,
    ) -> dict | None:

        target = (
            db.query(ProcessingTarget)
            .filter(
                ProcessingTarget.target_date
                == target_date
            )
            .first()
        )

        if not target:
            return None

        return {
            "id": target.id,
            "date": target.target_date,
            "target": float(target.target_output),
            "createdAt": target.created_at.isoformat(),
            "updatedAt": target.updated_at.isoformat(),
        }

    @staticmethod
    def update_target(
        db: Session,
        target_id: int,
        payload: ProcessingTargetUpdate,
    ) -> dict | None:

        target = (
            db.query(ProcessingTarget)
            .filter(
                ProcessingTarget.id == target_id
            )
            .first()
        )

        if not target:
            return None

        update_data = payload.model_dump(
            exclude_unset=True
        )

        if "target_date" in update_data:
            target.target_date = update_data["target_date"]

        if "target_output" in update_data:
            target.target_output = Decimal(
                str(update_data["target_output"])
            )

        db.commit()
        db.refresh(target)

        return {
            "id": target.id,
            "date": target.target_date,
            "target": float(target.target_output),
            "createdAt": target.created_at.isoformat(),
            "updatedAt": target.updated_at.isoformat(),
        }

    @staticmethod
    def delete_target(
        db: Session,
        target_id: int,
    ) -> bool:

        target = (
            db.query(ProcessingTarget)
            .filter(
                ProcessingTarget.id == target_id
            )
            .first()
        )

        if not target:
            return False

        db.delete(target)
        db.commit()

        return True

    @staticmethod
    def get_target_progress(
        db: Session,
        target_date: date,
    ) -> dict | None:

        target = (
            db.query(ProcessingTarget)
            .filter(
                ProcessingTarget.target_date
                == target_date
            )
            .first()
        )

        if not target:
            return None

        actual_output = (
            db.query(
                func.coalesce(
                    func.sum(
                        ProcessingRecord.output
                    ),
                    0,
                )
            )
            .filter(
                ProcessingRecord.date == target_date
            )
            .scalar()
        )

        actual_output = float(actual_output or 0)
        target_output = float(target.target_output)

        remaining_output = max(
            target_output - actual_output,
            0,
        )

        progress_percentage = (
            (
                actual_output
                / target_output
            )
            * 100
            if target_output > 0
            else 0
        )

        return {
            "target_date": target_date,
            "target_output": round(
                target_output,
                2,
            ),
            "actual_output": round(
                actual_output,
                2,
            ),
            "remaining_output": round(
                remaining_output,
                2,
            ),
            "progress_percentage": round(
                progress_percentage,
                2,
            ),
        }

    @staticmethod
    def create_issue(
        db: Session,
        payload: ProcessingIssueCreate,
    ) -> dict:

        issue = ProcessingIssue(
            title=payload.title,
            description=payload.description,
            category=payload.category,
            priority=payload.priority,
            duration_minutes=payload.duration_minutes,
            status=payload.status,
        )

        db.add(issue)
        db.commit()
        db.refresh(issue)

        return ProcessingService._issue_to_dict(issue)

    @staticmethod
    def get_issue(
        db: Session,
        issue_id: int,
    ) -> dict | None:

        issue = (
            db.query(ProcessingIssue)
            .filter(
                ProcessingIssue.id == issue_id
            )
            .first()
        )

        if not issue:
            return None

        return ProcessingService._issue_to_dict(issue)

    @staticmethod
    def get_issues(
        db: Session,
        status: str | None = None,
        priority: str | None = None,
        limit: int = 100,
    ) -> list[dict]:

        query = db.query(ProcessingIssue)

        if status:
            query = query.filter(
                ProcessingIssue.status == status
            )

        if priority:
            query = query.filter(
                ProcessingIssue.priority == priority
            )

        issues = (
            query
            .order_by(
                ProcessingIssue.created_at.desc()
            )
            .limit(limit)
            .all()
        )

        return [
            ProcessingService._issue_to_dict(issue)
            for issue in issues
        ]

    @staticmethod
    def update_issue(
        db: Session,
        issue_id: int,
        payload: ProcessingIssueUpdate,
    ) -> dict | None:

        issue = (
            db.query(ProcessingIssue)
            .filter(
                ProcessingIssue.id == issue_id
            )
            .first()
        )

        if not issue:
            return None

        update_data = payload.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(
                issue,
                field,
                value,
            )

        db.commit()
        db.refresh(issue)

        return ProcessingService._issue_to_dict(issue)

    @staticmethod
    def delete_issue(
        db: Session,
        issue_id: int,
    ) -> bool:

        issue = (
            db.query(ProcessingIssue)
            .filter(
                ProcessingIssue.id == issue_id
            )
            .first()
        )

        if not issue:
            return False

        db.delete(issue)
        db.commit()

        return True

    @staticmethod
    def get_dashboard(
        db: Session,
        target_date: date | None = None,
    ) -> dict:

        if target_date is None:
            target_date = date.today()

        start_date = target_date - timedelta(days=6)

        summary = ProcessingService.get_summary(
            db,
            target_date,
        )

        chart = ProcessingService.get_chart(
            db,
            start_date,
            target_date,
        )

        records = ProcessingService.get_records(
            db,
            start_date=start_date,
            end_date=target_date,
            limit=100,
        )

        issues = ProcessingService.get_issues(
            db,
            status="Active",
            limit=10,
        )

        target = ProcessingService.get_target_progress(
            db,
            target_date,
        )

        return {
            "summary": summary,
            "records": records,
            "chart": chart,
            "issues": issues,
            "target": target,
        }