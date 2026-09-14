from datetime import date
from typing import Optional

from sqlalchemy.orm import Session

from backend.workforce.model import Worker
from backend.workforce.schema import (
    WorkerCreate,
    WorkerUpdate,
    WorkerStatusUpdate,
    WorkerSafetyUpdate,
)


class WorkforceService:

    @staticmethod
    def get_workers(
        db: Session,
        department: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None,
    ):
        query = db.query(Worker)

        if department:
            query = query.filter(
                Worker.department == department
            )

        if status:
            query = query.filter(
                Worker.status == status
            )

        if search:
            search_value = f"%{search}%"

            query = query.filter(
                (Worker.name.ilike(search_value))
                | (Worker.employee_number.ilike(search_value))
                | (Worker.role.ilike(search_value))
                | (Worker.department.ilike(search_value))
            )

        return query.order_by(Worker.id.asc()).all()

    @staticmethod
    def get_worker(
        db: Session,
        worker_id: int,
    ):
        return (
            db.query(Worker)
            .filter(Worker.id == worker_id)
            .first()
        )

    @staticmethod
    def get_worker_by_employee_number(
        db: Session,
        employee_number: str,
    ):
        return (
            db.query(Worker)
            .filter(
                Worker.employee_number == employee_number
            )
            .first()
        )

    @staticmethod
    def create_worker(
        db: Session,
        worker_data: WorkerCreate,
    ):
        existing_worker = (
            WorkforceService.get_worker_by_employee_number(
                db,
                worker_data.employee_number,
            )
        )

        if existing_worker:
            raise ValueError(
                "A worker with this employee number already exists."
            )

        worker = Worker(
            employee_number=worker_data.employee_number,
            name=worker_data.name,
            role=worker_data.role,
            department=worker_data.department,
            shift=worker_data.shift,
            status=worker_data.status,
            phone=worker_data.phone,
            start_date=worker_data.start_date,
            safety_status=worker_data.safety_status,
        )

        db.add(worker)
        db.commit()
        db.refresh(worker)

        return worker

    @staticmethod
    def update_worker(
        db: Session,
        worker_id: int,
        worker_data: WorkerUpdate,
    ):
        worker = WorkforceService.get_worker(
            db,
            worker_id,
        )

        if not worker:
            return None

        update_data = worker_data.model_dump(
            exclude_unset=True,
            by_alias=False,
        )

        if "employee_number" in update_data:
            existing_worker = (
                WorkforceService.get_worker_by_employee_number(
                    db,
                    update_data["employee_number"],
                )
            )

            if (
                existing_worker
                and existing_worker.id != worker_id
            ):
                raise ValueError(
                    "A worker with this employee number already exists."
                )

        for field, value in update_data.items():
            setattr(worker, field, value)

        db.commit()
        db.refresh(worker)

        return worker

    @staticmethod
    def delete_worker(
        db: Session,
        worker_id: int,
    ):
        worker = WorkforceService.get_worker(
            db,
            worker_id,
        )

        if not worker:
            return False

        db.delete(worker)
        db.commit()

        return True

    @staticmethod
    def update_status(
        db: Session,
        worker_id: int,
        status_data: WorkerStatusUpdate,
    ):
        worker = WorkforceService.get_worker(
            db,
            worker_id,
        )

        if not worker:
            return None

        worker.status = status_data.status

        db.commit()
        db.refresh(worker)

        return worker

    @staticmethod
    def update_safety_status(
        db: Session,
        worker_id: int,
        safety_data: WorkerSafetyUpdate,
    ):
        worker = WorkforceService.get_worker(
            db,
            worker_id,
        )

        if not worker:
            return None

        worker.safety_status = safety_data.safety_status

        db.commit()
        db.refresh(worker)

        return worker

    @staticmethod
    def get_summary(
        db: Session,
    ):
        workers = (
            db.query(Worker)
            .order_by(Worker.id.asc())
            .all()
        )

        total = len(workers)

        present = sum(
            1
            for worker in workers
            if worker.status == "Present"
        )

        absent = sum(
            1
            for worker in workers
            if worker.status == "Absent"
        )

        late = sum(
            1
            for worker in workers
            if worker.status == "Late"
        )

        off_duty = sum(
            1
            for worker in workers
            if worker.status == "Off Duty"
        )

        training_due = sum(
            1
            for worker in workers
            if worker.safety_status == "Training Due"
        )

        active_workers = sum(
            1
            for worker in workers
            if worker.status in ("Present", "Late")
        )

        compliant_workers = sum(
            1
            for worker in workers
            if worker.safety_status == "Compliant"
        )

        attendance_rate = (
            ((present + late) / total) * 100
            if total
            else 0
        )

        safety_compliance_rate = (
            (compliant_workers / total) * 100
            if total
            else 0
        )

        shift_coverage = (
            (active_workers / total) * 100
            if total
            else 0
        )

        return {
            "totalWorkforce": total,
            "presentToday": present,
            "absent": absent,
            "late": late,
            "offDuty": off_duty,
            "trainingDue": training_due,
            "attendanceRate": round(
                attendance_rate,
                1,
            ),
            "safetyComplianceRate": round(
                safety_compliance_rate,
                1,
            ),
            "shiftCoverage": round(
                shift_coverage,
                1,
            ),
        }

    @staticmethod
    def get_dashboard(
        db: Session,
    ):
        workers = (
            db.query(Worker)
            .order_by(Worker.id.asc())
            .all()
        )

        return {
            "summary": WorkforceService.get_summary(db),
            "workers": workers,
        }

    @staticmethod
    def get_issues(
        db: Session,
    ):
        workers = (
            db.query(Worker)
            .order_by(Worker.id.asc())
            .all()
        )

        issues = []

        training_due = [
            worker
            for worker in workers
            if worker.safety_status == "Training Due"
        ]

        late_workers = [
            worker
            for worker in workers
            if worker.status == "Late"
        ]

        absent_workers = [
            worker
            for worker in workers
            if worker.status == "Absent"
        ]

        issue_id = 1

        if training_due:
            issues.append(
                {
                    "id": issue_id,
                    "title": "Safety training due",
                    "description": (
                        f"{len(training_due)} workforce member"
                        f"{'s' if len(training_due) != 1 else ''} "
                        "require mandatory safety training updates."
                    ),
                    "category": "Training",
                    "priority": "High",
                }
            )

            issue_id += 1

        if late_workers:
            issues.append(
                {
                    "id": issue_id,
                    "title": "Late shift arrival",
                    "description": (
                        f"{len(late_workers)} processing/workforce "
                        "operator"
                        f"{'s' if len(late_workers) != 1 else ''} "
                        "reported late for the current shift."
                    ),
                    "category": "Attendance",
                    "priority": "Medium",
                }
            )

            issue_id += 1

        if absent_workers:
            issues.append(
                {
                    "id": issue_id,
                    "title": "Unconfirmed absence",
                    "description": (
                        f"{len(absent_workers)} worker"
                        f"{'s' if len(absent_workers) != 1 else ''} "
                        "currently marked absent without a confirmed reason."
                    ),
                    "category": "Attendance",
                    "priority": "Medium",
                }
            )

        return issues