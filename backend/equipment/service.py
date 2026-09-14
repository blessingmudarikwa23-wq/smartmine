from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.equipment.model import Equipment
from backend.equipment.schema import (
    EquipmentCreate,
    EquipmentStatusUpdate,
    EquipmentUpdate,
)


VALID_STATUSES = {
    "Running",
    "Available",
    "Maintenance",
    "Down",
}


class EquipmentService:

    # ---------------------------------------------------------
    # EQUIPMENT
    # ---------------------------------------------------------

    @staticmethod
    def create_equipment(
        db: Session,
        payload: EquipmentCreate,
    ) -> Equipment:

        existing = (
            db.query(Equipment)
            .filter(
                Equipment.equipment_id
                == payload.equipment_id
            )
            .first()
        )

        if existing:
            raise ValueError(
                f"Equipment ID '{payload.equipment_id}' already exists."
            )

        if payload.status not in VALID_STATUSES:
            raise ValueError(
                f"Invalid equipment status: {payload.status}"
            )

        equipment = Equipment(
            equipment_id=payload.equipment_id,
            name=payload.name,
            type=payload.type,
            manufacturer=payload.manufacturer,
            model=payload.model,
            location=payload.location,
            status=payload.status,
            operating_hours=payload.operating_hours,
            utilisation=payload.utilisation,
            last_maintenance=payload.last_maintenance,
            next_maintenance=payload.next_maintenance,
            maintenance_interval=payload.maintenance_interval,
            notes=payload.notes,
        )

        db.add(equipment)
        db.commit()
        db.refresh(equipment)

        return equipment

    # ---------------------------------------------------------
    # GET EQUIPMENT
    # ---------------------------------------------------------

    @staticmethod
    def get_equipment(
        db: Session,
        equipment_id: int,
    ) -> Equipment | None:

        return (
            db.query(Equipment)
            .filter(Equipment.id == equipment_id)
            .first()
        )

    @staticmethod
    def get_by_equipment_code(
        db: Session,
        equipment_code: str,
    ) -> Equipment | None:

        return (
            db.query(Equipment)
            .filter(
                Equipment.equipment_id
                == equipment_code
            )
            .first()
        )

    # ---------------------------------------------------------
    # LIST EQUIPMENT
    # ---------------------------------------------------------

    @staticmethod
    def get_equipment_list(
        db: Session,
        search: str | None = None,
        status: str | None = None,
        equipment_type: str | None = None,
        location: str | None = None,
        limit: int = 100,
    ) -> list[Equipment]:

        query = db.query(Equipment)

        if search:
            search_value = f"%{search.lower()}%"

            query = query.filter(
                func.lower(Equipment.name).like(
                    search_value
                )
                | func.lower(
                    Equipment.equipment_id
                ).like(search_value)
                | func.lower(
                    Equipment.type
                ).like(search_value)
                | func.lower(
                    Equipment.location
                ).like(search_value)
            )

        if status:
            query = query.filter(
                Equipment.status == status
            )

        if equipment_type:
            query = query.filter(
                Equipment.type == equipment_type
            )

        if location:
            query = query.filter(
                Equipment.location == location
            )

        return (
            query.order_by(Equipment.id.desc())
            .limit(limit)
            .all()
        )

    # ---------------------------------------------------------
    # UPDATE EQUIPMENT
    # ---------------------------------------------------------

    @staticmethod
    def update_equipment(
        db: Session,
        equipment_id: int,
        payload: EquipmentUpdate,
    ) -> Equipment | None:

        equipment = (
            db.query(Equipment)
            .filter(Equipment.id == equipment_id)
            .first()
        )

        if not equipment:
            return None

        if payload.status is not None:
            if payload.status not in VALID_STATUSES:
                raise ValueError(
                    f"Invalid equipment status: {payload.status}"
                )

        if payload.equipment_id:
            duplicate = (
                db.query(Equipment)
                .filter(
                    Equipment.equipment_id
                    == payload.equipment_id,
                    Equipment.id != equipment.id,
                )
                .first()
            )

            if duplicate:
                raise ValueError(
                    f"Equipment ID '{payload.equipment_id}' already exists."
                )

        update_data = payload.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(
                equipment,
                field,
                value,
            )

        db.commit()
        db.refresh(equipment)

        return equipment

    # ---------------------------------------------------------
    # STATUS UPDATE
    # ---------------------------------------------------------

    @staticmethod
    def update_status(
        db: Session,
        equipment_code: str,
        payload: EquipmentStatusUpdate,
    ) -> Equipment | None:

        if payload.status not in VALID_STATUSES:
            raise ValueError(
                f"Invalid equipment status: {payload.status}"
            )

        equipment = (
            db.query(Equipment)
            .filter(
                Equipment.equipment_id
                == equipment_code
            )
            .first()
        )

        if not equipment:
            return None

        equipment.status = payload.status

        db.commit()
        db.refresh(equipment)

        return equipment

    # ---------------------------------------------------------
    # DELETE
    # ---------------------------------------------------------

    @staticmethod
    def delete_equipment(
        db: Session,
        equipment_id: int,
    ) -> bool:

        equipment = (
            db.query(Equipment)
            .filter(Equipment.id == equipment_id)
            .first()
        )

        if not equipment:
            return False

        db.delete(equipment)
        db.commit()

        return True

    # ---------------------------------------------------------
    # SUMMARY
    # ---------------------------------------------------------

    @staticmethod
    def get_summary(
        db: Session,
    ):

        equipment = (
            db.query(Equipment)
            .all()
        )

        total = len(equipment)

        running = sum(
            1
            for item in equipment
            if item.status == "Running"
        )

        available = sum(
            1
            for item in equipment
            if item.status == "Available"
        )

        maintenance = sum(
            1
            for item in equipment
            if item.status == "Maintenance"
        )

        down = sum(
            1
            for item in equipment
            if item.status == "Down"
        )

        total_hours = sum(
            item.operating_hours or 0
            for item in equipment
        )

        average_utilisation = (
            sum(
                item.utilisation or 0
                for item in equipment
            )
            / total
            if total
            else 0
        )

        return {
            "total_equipment": total,
            "running": running,
            "available": available,
            "maintenance": maintenance,
            "down": down,
            "average_utilisation": round(
                average_utilisation,
                1,
            ),
            "total_operating_hours": round(
                total_hours,
                1,
            ),
        }

    # ---------------------------------------------------------
    # STATUS LIST
    # ---------------------------------------------------------

    @staticmethod
    def get_status_list(
        db: Session,
    ):

        equipment = (
            db.query(Equipment)
            .order_by(Equipment.name.asc())
            .all()
        )

        return [
            {
                "equipment_id": item.equipment_id,
                "name": item.name,
                "status": item.status,
                "location": item.location,
                "operating_hours": item.operating_hours,
                "utilisation": item.utilisation,
            }
            for item in equipment
        ]

    # ---------------------------------------------------------
    # MAINTENANCE
    # ---------------------------------------------------------

    @staticmethod
    def get_upcoming_maintenance(
        db: Session,
        limit: int = 20,
    ):

        today = date.today()

        return (
            db.query(Equipment)
            .filter(
                Equipment.next_maintenance.isnot(None),
                Equipment.next_maintenance >= today,
            )
            .order_by(
                Equipment.next_maintenance.asc()
            )
            .limit(limit)
            .all()
        )