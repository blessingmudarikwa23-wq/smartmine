from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from .model import (
    SafetyAction,
    SafetyIncident,
    SafetyInspection,
)
from .schema import (
    SafetyActionCreate,
    SafetyActionUpdate,
    SafetyIncidentCreate,
    SafetyIncidentUpdate,
    SafetyInspectionCreate,
    SafetyInspectionUpdate,
)


class SafetyService:

    # ==========================================================
    # INCIDENTS
    # ==========================================================

    @staticmethod
    def list_incidents(
        db: Session,
        search: str | None = None,
        severity: str | None = None,
        status: str | None = None,
    ):
        query = db.query(SafetyIncident)

        if search:
            search_term = f"%{search.strip()}%"

            query = query.filter(
                or_(
                    SafetyIncident.reference.ilike(search_term),
                    SafetyIncident.category.ilike(search_term),
                    SafetyIncident.location.ilike(search_term),
                    SafetyIncident.reported_by.ilike(search_term),
                    SafetyIncident.description.ilike(search_term),
                )
            )

        if severity:
            query = query.filter(
                SafetyIncident.severity == severity
            )

        if status:
            query = query.filter(
                SafetyIncident.status == status
            )

        return (
            query
            .order_by(SafetyIncident.id.desc())
            .all()
        )

    @staticmethod
    def get_incident(
        db: Session,
        incident_id: int,
    ):
        return (
            db.query(SafetyIncident)
            .filter(SafetyIncident.id == incident_id)
            .first()
        )

    @staticmethod
    def _next_incident_reference(
        db: Session,
    ) -> str:
        references = (
            db.query(SafetyIncident.reference)
            .all()
        )

        highest_number = 0

        for reference_tuple in references:
            reference = reference_tuple[0]

            if not reference:
                continue

            if not reference.startswith("INC-"):
                continue

            try:
                number = int(
                    reference.split("-")[-1]
                )

                highest_number = max(
                    highest_number,
                    number,
                )

            except ValueError:
                continue

        return f"INC-{highest_number + 1:04d}"

    @staticmethod
    def create_incident(
        db: Session,
        data: SafetyIncidentCreate,
    ):
        incident_data = data.model_dump()

        incident = SafetyIncident(
            reference=SafetyService._next_incident_reference(
                db
            ),
            **incident_data,
        )

        db.add(incident)
        db.commit()
        db.refresh(incident)

        return incident

    @staticmethod
    def update_incident(
        db: Session,
        incident_id: int,
        data: SafetyIncidentUpdate,
    ):
        incident = SafetyService.get_incident(
            db,
            incident_id,
        )

        if not incident:
            return None

        update_data = data.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(
                incident,
                field,
                value,
            )

        db.commit()
        db.refresh(incident)

        return incident

    @staticmethod
    def delete_incident(
        db: Session,
        incident_id: int,
    ):
        incident = SafetyService.get_incident(
            db,
            incident_id,
        )

        if not incident:
            return None

        db.delete(incident)
        db.commit()

        return incident

    # ==========================================================
    # INSPECTIONS
    # ==========================================================

    @staticmethod
    def list_inspections(
        db: Session,
    ):
        return (
            db.query(SafetyInspection)
            .order_by(SafetyInspection.id.desc())
            .all()
        )

    @staticmethod
    def get_inspection(
        db: Session,
        inspection_id: int,
    ):
        return (
            db.query(SafetyInspection)
            .filter(
                SafetyInspection.id == inspection_id
            )
            .first()
        )

    @staticmethod
    def create_inspection(
        db: Session,
        data: SafetyInspectionCreate,
    ):
        inspection = SafetyInspection(
            **data.model_dump()
        )

        db.add(inspection)
        db.commit()
        db.refresh(inspection)

        return inspection

    @staticmethod
    def update_inspection(
        db: Session,
        inspection_id: int,
        data: SafetyInspectionUpdate,
    ):
        inspection = SafetyService.get_inspection(
            db,
            inspection_id,
        )

        if not inspection:
            return None

        update_data = data.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(
                inspection,
                field,
                value,
            )

        db.commit()
        db.refresh(inspection)

        return inspection

    @staticmethod
    def delete_inspection(
        db: Session,
        inspection_id: int,
    ):
        inspection = SafetyService.get_inspection(
            db,
            inspection_id,
        )

        if not inspection:
            return None

        db.delete(inspection)
        db.commit()

        return inspection

    # ==========================================================
    # CORRECTIVE ACTIONS
    # ==========================================================

    @staticmethod
    def list_actions(
        db: Session,
    ):
        return (
            db.query(SafetyAction)
            .order_by(SafetyAction.id.desc())
            .all()
        )

    @staticmethod
    def get_action(
        db: Session,
        action_id: int,
    ):
        return (
            db.query(SafetyAction)
            .filter(
                SafetyAction.id == action_id
            )
            .first()
        )

    @staticmethod
    def create_action(
        db: Session,
        data: SafetyActionCreate,
    ):
        action = SafetyAction(
            **data.model_dump()
        )

        db.add(action)
        db.commit()
        db.refresh(action)

        return action

    @staticmethod
    def update_action(
        db: Session,
        action_id: int,
        data: SafetyActionUpdate,
    ):
        action = SafetyService.get_action(
            db,
            action_id,
        )

        if not action:
            return None

        update_data = data.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(
                action,
                field,
                value,
            )

        db.commit()
        db.refresh(action)

        return action

    @staticmethod
    def delete_action(
        db: Session,
        action_id: int,
    ):
        action = SafetyService.get_action(
            db,
            action_id,
        )

        if not action:
            return None

        db.delete(action)
        db.commit()

        return action

    # ==========================================================
    # SAFETY SUMMARY
    # ==========================================================

    @staticmethod
    def get_summary(
        db: Session,
    ):
        incidents = (
            db.query(SafetyIncident)
            .all()
        )

        total_incidents = len(incidents)

        resolved_incidents = sum(
            1
            for incident in incidents
            if incident.status == "Resolved"
        )

        open_incidents = sum(
            1
            for incident in incidents
            if incident.status != "Resolved"
        )

        high_risk_incidents = sum(
            1
            for incident in incidents
            if incident.severity in {
                "High",
                "Critical",
            }
        )

        critical_incidents = sum(
            1
            for incident in incidents
            if incident.severity == "Critical"
        )

        near_misses = sum(
            1
            for incident in incidents
            if incident.type == "Near Miss"
        )

        under_investigation = sum(
            1
            for incident in incidents
            if incident.status
            == "Under Investigation"
        )

        injured_persons = sum(
            incident.injured_persons or 0
            for incident in incidents
        )

        resolution_rate = (
            round(
                (
                    resolved_incidents
                    / total_incidents
                )
                * 100,
                2,
            )
            if total_incidents
            else 0
        )

        category_counts: dict[str, int] = {}

        for incident in incidents:
            category = incident.category

            category_counts[category] = (
                category_counts.get(
                    category,
                    0,
                )
                + 1
            )

        return {
            "totalIncidents": total_incidents,
            "openIncidents": open_incidents,
            "resolvedIncidents": resolved_incidents,
            "underInvestigation": under_investigation,
            "highRiskIncidents": high_risk_incidents,
            "criticalIncidents": critical_incidents,
            "nearMisses": near_misses,
            "injuredPersons": injured_persons,
            "resolutionRate": resolution_rate,
            "categoryCounts": category_counts,
        }

    # ==========================================================
    # DASHBOARD
    # ==========================================================

    @staticmethod
    def get_dashboard(
        db: Session,
    ):
        return {
            "incidents": SafetyService.list_incidents(
                db
            ),
            "inspections": SafetyService.list_inspections(
                db
            ),
            "actions": SafetyService.list_actions(
                db
            ),
            "summary": SafetyService.get_summary(
                db
            ),
        }