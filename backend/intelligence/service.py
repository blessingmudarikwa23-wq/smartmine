from datetime import date, datetime
from decimal import Decimal

from sqlalchemy.orm import Session

from backend.equipment.model import Equipment
from backend.finance.model import FinanceTransaction
from backend.fuel.model import (
    FuelRecordModel,
    FuelTankModel,
)
from backend.inventory.model import InventoryItemModel
from backend.mine_operations.model import (
    ProductionRecord,
    ProductionTarget,
)
from backend.safety.model import (
    SafetyAction,
    SafetyIncident,
    SafetyInspection,
)
from backend.workforce.model import Worker

from .schema import (
    EquipmentSnapshot,
    FinanceSnapshot,
    FuelSnapshot,
    IntelligenceDashboardResponse,
    IntelligenceInsightResponse,
    IntelligenceSeverity,
    InventorySnapshot,
    MineSnapshotResponse,
    ProductionSnapshot,
    SafetySnapshot,
    WorkforceSnapshot,
)


class IntelligenceService:

    # =========================================================
    # PRODUCTION
    # =========================================================

    @staticmethod
    def get_production_snapshot(
        db: Session,
    ) -> ProductionSnapshot:

        today = date.today()

        records = (
            db.query(ProductionRecord)
            .filter(
                ProductionRecord.date == today,
            )
            .all()
        )

        extracted_today = sum(
            Decimal(str(record.extracted or 0))
            for record in records
        )

        processed_today = sum(
            Decimal(str(record.processed or 0))
            for record in records
        )

        target = (
            db.query(ProductionTarget)
            .filter(
                ProductionTarget.target_date == today,
            )
            .first()
        )

        target_today = (
            Decimal(
                str(target.target_output)
            )
            if target
            else Decimal("0")
        )

        target_achievement = (
            (
                extracted_today
                / target_today
            )
            * Decimal("100")
            if target_today > 0
            else Decimal("0")
        )

        return ProductionSnapshot(
            extracted_today=float(
                extracted_today
            ),
            processed_today=float(
                processed_today
            ),
            target_today=float(
                target_today
            ),
            efficiency=round(
                float(target_achievement),
                1,
            ),
        )

    # =========================================================
    # EQUIPMENT
    # =========================================================

    @staticmethod
    def get_equipment_snapshot(
        db: Session,
    ) -> EquipmentSnapshot:

        equipment = (
            db.query(Equipment)
            .all()
        )

        total = len(equipment)

        available = sum(
            1
            for item in equipment
            if item.status == "Available"
        )

        utilisation = (
            sum(
                float(item.utilisation or 0)
                for item in equipment
            )
            / total
            if total
            else 0
        )

        downtime_hours = 0.0

        for item in equipment:

            if item.status in (
                "Down",
                "Maintenance",
            ):
                downtime_hours += max(
                    0.0,
                    float(
                        item.operating_hours or 0
                    ),
                )

        return EquipmentSnapshot(
            total=total,
            available=available,
            utilisation=round(
                utilisation,
                1,
            ),
            downtime_hours=round(
                downtime_hours,
                1,
            ),
        )

    # =========================================================
    # WORKFORCE
    # =========================================================

    @staticmethod
    def get_workforce_snapshot(
        db: Session,
    ) -> WorkforceSnapshot:

        workers = (
            db.query(Worker)
            .all()
        )

        total = len(workers)

        present = sum(
            1
            for worker in workers
            if worker.status == "Present"
        )

        active_workers = sum(
            1
            for worker in workers
            if worker.status in (
                "Present",
                "Late",
            )
        )

        attendance = (
            (
                active_workers
                / total
            )
            * 100
            if total
            else 0
        )

        return WorkforceSnapshot(
            total=total,
            present=present,
            attendance=round(
                attendance,
                1,
            ),
        )

    # =========================================================
    # INVENTORY
    # =========================================================

    @staticmethod
    def get_inventory_snapshot(
        db: Session,
    ) -> InventorySnapshot:

        items = (
            db.query(InventoryItemModel)
            .all()
        )

        total_items = len(items)

        critical_items = sum(
            1
            for item in items
            if float(item.quantity or 0)
            <= float(item.minimum_level or 0)
        )

        stock_health = (
            (
                (
                    total_items
                    - critical_items
                )
                / total_items
            )
            * 100
            if total_items
            else 0
        )

        return InventorySnapshot(
            items=total_items,
            stock_health=round(
                stock_health,
                1,
            ),
            critical_items=critical_items,
        )

    # =========================================================
    # FUEL
    # =========================================================

    @staticmethod
    def get_fuel_snapshot(
        db: Session,
    ) -> FuelSnapshot:

        today = datetime.now().strftime(
            "%d %b %Y"
        )

        today_records = (
            db.query(FuelRecordModel)
            .filter(
                FuelRecordModel.date == today,
                FuelRecordModel.type
                == "Consumption",
            )
            .all()
        )

        consumed_today = sum(
            float(record.quantity or 0)
            for record in today_records
        )

        estimated_cost = sum(
            float(record.cost or 0)
            for record in today_records
        )

        tanks = (
            db.query(FuelTankModel)
            .all()
        )

        stock_litres = sum(
            float(tank.current_level or 0)
            for tank in tanks
        )

        return FuelSnapshot(
            consumed_today=round(
                consumed_today,
                1,
            ),
            stock_litres=round(
                stock_litres,
                1,
            ),
            estimated_cost=round(
                estimated_cost,
                2,
            ),
        )

    # =========================================================
    # SAFETY
    # =========================================================

    @staticmethod
    def get_safety_snapshot(
        db: Session,
    ) -> SafetySnapshot:

        incidents = (
            db.query(SafetyIncident)
            .all()
        )

        inspections = (
            db.query(SafetyInspection)
            .all()
        )

        actions = (
            db.query(SafetyAction)
            .all()
        )

        incidents_this_month = 0
        near_misses = 0

        current_month = date.today().strftime(
            "%b"
        )
        current_year = str(
            date.today().year
        )

        for incident in incidents:

            incident_date = str(
                incident.date or ""
            )

            if (
                current_month.lower()
                in incident_date.lower()
                and current_year
                in incident_date
            ):
                incidents_this_month += 1

            if incident.type == "Near Miss":
                near_misses += 1

        open_actions = sum(
            1
            for action in actions
            if action.status
            in (
                "Open",
                "In Progress",
            )
        )

        if inspections:

            completed_inspections = sum(
                1
                for inspection in inspections
                if inspection.status
                == "Completed"
            )

            compliance = (
                completed_inspections
                / len(inspections)
            ) * 100

        elif incidents:

            resolved_incidents = sum(
                1
                for incident in incidents
                if incident.status
                == "Resolved"
            )

            compliance = (
                resolved_incidents
                / len(incidents)
            ) * 100

        else:
            compliance = 100.0

        return SafetySnapshot(
            incidents_this_month=incidents_this_month,
            near_misses=near_misses,
            compliance=round(
                compliance,
                1,
            ),
            open_actions=open_actions,
        )

    # =========================================================
    # FINANCE
    # =========================================================

    @staticmethod
    def get_finance_snapshot(
        db: Session,
    ) -> FinanceSnapshot:

        transactions = (
            db.query(FinanceTransaction)
            .all()
        )

        revenue = sum(
            float(transaction.amount or 0)
            for transaction in transactions
            if transaction.type
            == "Income"
        )

        expenses = sum(
            float(transaction.amount or 0)
            for transaction in transactions
            if transaction.type
            == "Expense"
        )

        operating_result = (
            revenue - expenses
        )

        return FinanceSnapshot(
            revenue=round(
                revenue,
                2,
            ),
            expenses=round(
                expenses,
                2,
            ),
            operating_result=round(
                operating_result,
                2,
            ),
        )

    # =========================================================
    # COMPLETE LIVE SNAPSHOT
    # =========================================================

    @staticmethod
    def get_snapshot(
        db: Session,
    ) -> MineSnapshotResponse:

        return MineSnapshotResponse(
            production=(
                IntelligenceService
                .get_production_snapshot(db)
            ),
            equipment=(
                IntelligenceService
                .get_equipment_snapshot(db)
            ),
            workforce=(
                IntelligenceService
                .get_workforce_snapshot(db)
            ),
            inventory=(
                IntelligenceService
                .get_inventory_snapshot(db)
            ),
            fuel=(
                IntelligenceService
                .get_fuel_snapshot(db)
            ),
            safety=(
                IntelligenceService
                .get_safety_snapshot(db)
            ),
            finance=(
                IntelligenceService
                .get_finance_snapshot(db)
            ),
        )

    # =========================================================
    # INTELLIGENCE SCORE
    # =========================================================

    @staticmethod
    def calculate_intelligence_score(
        snapshot: MineSnapshotResponse,
    ) -> int:

        production = min(
            max(
                snapshot.production.efficiency,
                0,
            ),
            100,
        )

        equipment = min(
            max(
                snapshot.equipment.utilisation,
                0,
            ),
            100,
        )

        workforce = min(
            max(
                snapshot.workforce.attendance,
                0,
            ),
            100,
        )

        safety = min(
            max(
                snapshot.safety.compliance,
                0,
            ),
            100,
        )

        inventory = min(
            max(
                snapshot.inventory.stock_health,
                0,
            ),
            100,
        )

        score = (
            production * 0.25
            + equipment * 0.20
            + workforce * 0.15
            + safety * 0.20
            + inventory * 0.20
        )

        return round(score)

    # =========================================================
    # LIVE INSIGHTS
    # =========================================================

    @staticmethod
    def get_insights(
        snapshot: MineSnapshotResponse,
    ) -> list[IntelligenceInsightResponse]:

        insights: list[
            IntelligenceInsightResponse
        ] = []

        # -----------------------------------------------------
        # PRODUCTION
        # -----------------------------------------------------

        production_gap = (
            snapshot.production.target_today
            - snapshot.production.extracted_today
        )

        if (
            snapshot.production.target_today > 0
            and production_gap > 0
        ):

            severity: IntelligenceSeverity = (
                "High"
                if (
                    snapshot.production.efficiency
                    < 75
                )
                else "Medium"
            )

            insights.append(
                IntelligenceInsightResponse(
                    id=1,
                    title=(
                        "Production is below "
                        "today's target"
                    ),
                    description=(
                        f"The mine has extracted "
                        f"{snapshot.production.extracted_today:g} "
                        f"tonnes against a target of "
                        f"{snapshot.production.target_today:g} "
                        f"tonnes."
                    ),
                    category="Production",
                    severity=severity,
                    recommendation=(
                        "Review production delays, "
                        "equipment availability and "
                        "remaining operating capacity."
                    ),
                )
            )

        elif (
            snapshot.production.target_today > 0
            and production_gap <= 0
        ):

            insights.append(
                IntelligenceInsightResponse(
                    id=1,
                    title=(
                        "Production target is on track"
                    ),
                    description=(
                        f"Current extraction is "
                        f"{snapshot.production.extracted_today:g} "
                        f"tonnes against a target of "
                        f"{snapshot.production.target_today:g} "
                        f"tonnes."
                    ),
                    category="Production",
                    severity="Low",
                    recommendation=(
                        "Maintain the current production "
                        "rate and monitor performance "
                        "through shift close."
                    ),
                )
            )

        # -----------------------------------------------------
        # INVENTORY
        # -----------------------------------------------------

        if snapshot.inventory.critical_items > 0:

            inventory_severity: IntelligenceSeverity = (
                "High"
                if snapshot.inventory.stock_health
                < 75
                else "Medium"
            )

            insights.append(
                IntelligenceInsightResponse(
                    id=2,
                    title=(
                        f"{snapshot.inventory.critical_items} "
                        "inventory items require attention"
                    ),
                    description=(
                        f"{snapshot.inventory.critical_items} "
                        "items are currently at or below "
                        "their minimum stock level."
                    ),
                    category="Inventory",
                    severity=inventory_severity,
                    recommendation=(
                        "Review critical stock and "
                        "prioritise replenishment before "
                        "it affects operational continuity."
                    ),
                )
            )

        else:

            insights.append(
                IntelligenceInsightResponse(
                    id=2,
                    title=(
                        "Inventory levels are stable"
                    ),
                    description=(
                        "No inventory items are currently "
                        "below their minimum stock level."
                    ),
                    category="Inventory",
                    severity="Low",
                    recommendation=(
                        "Continue monitoring stock levels "
                        "against reorder points."
                    ),
                )
            )

        # -----------------------------------------------------
        # EQUIPMENT
        # -----------------------------------------------------

        if snapshot.equipment.total == 0:

            equipment_title = (
                "No equipment records available"
            )
            equipment_description = (
                "The Intelligence module could not find "
                "equipment records in the database."
            )
            equipment_severity: IntelligenceSeverity = (
                "Medium"
            )

        elif snapshot.equipment.utilisation < 60:

            equipment_title = (
                "Equipment utilisation requires attention"
            )
            equipment_description = (
                f"Average equipment utilisation is "
                f"{snapshot.equipment.utilisation:g}%."
            )
            equipment_severity = "High"

        else:

            equipment_title = (
                "Equipment performance is stable"
            )
            equipment_description = (
                f"Average equipment utilisation is "
                f"{snapshot.equipment.utilisation:g}% "
                f"with "
                f"{snapshot.equipment.available} of "
                f"{snapshot.equipment.total} units "
                "available."
            )
            equipment_severity = "Low"

        insights.append(
            IntelligenceInsightResponse(
                id=3,
                title=equipment_title,
                description=equipment_description,
                category="Equipment",
                severity=equipment_severity,
                recommendation=(
                    "Monitor equipment availability "
                    "and maintenance requirements."
                ),
            )
        )

        # -----------------------------------------------------
        # SAFETY
        # -----------------------------------------------------

        if (
            snapshot.safety.open_actions > 0
            or snapshot.safety.near_misses > 0
        ):

            safety_severity: IntelligenceSeverity = (
                "High"
                if (
                    snapshot.safety.open_actions >= 5
                    or snapshot.safety.near_misses >= 5
                )
                else "Medium"
            )

            insights.append(
                IntelligenceInsightResponse(
                    id=4,
                    title=(
                        "Safety actions require attention"
                    ),
                    description=(
                        f"Safety compliance is "
                        f"{snapshot.safety.compliance:g}% "
                        f"with "
                        f"{snapshot.safety.open_actions} "
                        "open corrective actions and "
                        f"{snapshot.safety.near_misses} "
                        "near misses recorded."
                    ),
                    category="Safety",
                    severity=safety_severity,
                    recommendation=(
                        "Prioritise outstanding corrective "
                        "actions and review recurring "
                        "near-miss patterns."
                    ),
                )
            )

        else:

            insights.append(
                IntelligenceInsightResponse(
                    id=4,
                    title=(
                        "Safety position is stable"
                    ),
                    description=(
                        f"Safety compliance is currently "
                        f"{snapshot.safety.compliance:g}% "
                        "with no outstanding safety "
                        "actions or near misses."
                    ),
                    category="Safety",
                    severity="Low",
                    recommendation=(
                        "Maintain current safety controls "
                        "and inspection discipline."
                    ),
                )
            )

        # -----------------------------------------------------
        # FINANCE
        # -----------------------------------------------------

        if snapshot.finance.operating_result < 0:

            insights.append(
                IntelligenceInsightResponse(
                    id=5,
                    title=(
                        "Operating result is negative"
                    ),
                    description=(
                        f"Revenue is R "
                        f"{snapshot.finance.revenue:,.0f} "
                        f"against expenses of R "
                        f"{snapshot.finance.expenses:,.0f}."
                    ),
                    category="Finance",
                    severity="High",
                    recommendation=(
                        "Review major operating costs "
                        "and protect revenue-generating "
                        "production activities."
                    ),
                )
            )

        else:

            insights.append(
                IntelligenceInsightResponse(
                    id=5,
                    title=(
                        "Operating result remains positive"
                    ),
                    description=(
                        f"Current operating result is "
                        f"R "
                        f"{snapshot.finance.operating_result:,.0f}."
                    ),
                    category="Finance",
                    severity="Low",
                    recommendation=(
                        "Continue monitoring costs while "
                        "protecting production and revenue."
                    ),
                )
            )

        return insights

    # =========================================================
    # DASHBOARD
    # =========================================================

    @staticmethod
    def get_dashboard(
        db: Session,
    ) -> IntelligenceDashboardResponse:

        snapshot = (
            IntelligenceService.get_snapshot(db)
        )

        score = (
            IntelligenceService
            .calculate_intelligence_score(
                snapshot
            )
        )

        insights = (
            IntelligenceService.get_insights(
                snapshot
            )
        )

        return IntelligenceDashboardResponse(
            intelligence_score=score,
            snapshot=snapshot,
            insights=insights,
        )

    # =========================================================
    # LIVE OPERATIONAL ASSISTANT
    # =========================================================

    @staticmethod
    def answer_question(
        db: Session,
        question: str,
    ) -> str:

        snapshot = (
            IntelligenceService.get_snapshot(db)
        )

        question_lower = (
            question.lower().strip()
        )

        production_gap = (
            snapshot.production.target_today
            - snapshot.production.extracted_today
        )

        score = (
            IntelligenceService
            .calculate_intelligence_score(
                snapshot
            )
        )

        # -----------------------------------------------------
        # PRODUCTION
        # -----------------------------------------------------

        if any(
            word in question_lower
            for word in (
                "production",
                "target",
                "extracted",
                "tonnes",
            )
        ):

            if snapshot.production.target_today > 0:

                return (
                    f"Current production is "
                    f"{snapshot.production.extracted_today:g} "
                    f"tonnes against a target of "
                    f"{snapshot.production.target_today:g} "
                    f"tonnes. "
                    f"Target achievement is "
                    f"{snapshot.production.efficiency:g}%. "
                    f"The current production gap is "
                    f"{max(production_gap, 0):g} tonnes. "
                    f"Processed volume is "
                    f"{snapshot.production.processed_today:g} "
                    "tonnes."
                )

            return (
                "There is currently no production target "
                "recorded for today. "
                f"The database shows "
                f"{snapshot.production.extracted_today:g} "
                "tonnes extracted and "
                f"{snapshot.production.processed_today:g} "
                "tonnes processed."
            )

        # -----------------------------------------------------
        # EQUIPMENT
        # -----------------------------------------------------

        if any(
            word in question_lower
            for word in (
                "equipment",
                "machine",
                "machines",
                "downtime",
            )
        ):

            return (
                f"The database currently contains "
                f"{snapshot.equipment.total} equipment "
                f"units. "
                f"{snapshot.equipment.available} are "
                f"marked available. "
                f"Average utilisation is "
                f"{snapshot.equipment.utilisation:g}%. "
                f"Recorded downtime exposure is "
                f"{snapshot.equipment.downtime_hours:g} "
                "hours."
            )

        # -----------------------------------------------------
        # WORKFORCE
        # -----------------------------------------------------

        if any(
            word in question_lower
            for word in (
                "workforce",
                "workers",
                "staff",
                "attendance",
                "employees",
            )
        ):

            return (
                f"The workforce currently contains "
                f"{snapshot.workforce.total} workers. "
                f"{snapshot.workforce.present} are "
                "marked Present and the calculated "
                f"attendance rate is "
                f"{snapshot.workforce.attendance:g}%."
            )

        # -----------------------------------------------------
        # INVENTORY
        # -----------------------------------------------------

        if any(
            word in question_lower
            for word in (
                "inventory",
                "stock",
                "critical",
                "spares",
            )
        ):

            return (
                f"There are "
                f"{snapshot.inventory.items} inventory "
                "items in the database. "
                f"{snapshot.inventory.critical_items} "
                "are at or below their minimum level. "
                f"Calculated stock health is "
                f"{snapshot.inventory.stock_health:g}%."
            )

        # -----------------------------------------------------
        # FUEL
        # -----------------------------------------------------

        if any(
            word in question_lower
            for word in (
                "fuel",
                "diesel",
                "consumption",
            )
        ):

            return (
                f"Today's recorded fuel consumption is "
                f"{snapshot.fuel.consumed_today:g} litres. "
                f"Current tank stock is "
                f"{snapshot.fuel.stock_litres:g} litres. "
                f"Today's recorded fuel cost is "
                f"R {snapshot.fuel.estimated_cost:,.2f}."
            )

        # -----------------------------------------------------
        # SAFETY
        # -----------------------------------------------------

        if any(
            word in question_lower
            for word in (
                "safety",
                "incident",
                "incidents",
                "near miss",
                "near-miss",
                "compliance",
            )
        ):

            return (
                f"Current calculated safety compliance is "
                f"{snapshot.safety.compliance:g}%. "
                f"There are "
                f"{snapshot.safety.incidents_this_month} "
                "incidents recorded for the current month "
                f"and {snapshot.safety.near_misses} "
                "near misses in the safety database. "
                f"{snapshot.safety.open_actions} "
                "corrective actions remain open."
            )

        # -----------------------------------------------------
        # FINANCE
        # -----------------------------------------------------

        if any(
            word in question_lower
            for word in (
                "finance",
                "financial",
                "revenue",
                "expense",
                "expenses",
                "profit",
                "profitability",
                "money",
                "cost",
            )
        ):

            return (
                f"Finance currently shows revenue of "
                f"R {snapshot.finance.revenue:,.2f}, "
                f"expenses of "
                f"R {snapshot.finance.expenses:,.2f}, "
                f"and an operating result of "
                f"R {snapshot.finance.operating_result:,.2f}."
            )

        # -----------------------------------------------------
        # OVERALL HEALTH
        # -----------------------------------------------------

        if any(
            word in question_lower
            for word in (
                "overall",
                "health",
                "status",
                "situation",
                "how are we doing",
            )
        ):

            return (
                f"The current SmartMine intelligence "
                f"score is {score}%. "
                f"Production achievement is "
                f"{snapshot.production.efficiency:g}%, "
                f"equipment utilisation is "
                f"{snapshot.equipment.utilisation:g}%, "
                f"workforce attendance is "
                f"{snapshot.workforce.attendance:g}%, "
                f"inventory health is "
                f"{snapshot.inventory.stock_health:g}%, "
                f"and safety compliance is "
                f"{snapshot.safety.compliance:g}%."
            )

        # -----------------------------------------------------
        # PRIORITIES
        # -----------------------------------------------------

        if any(
            word in question_lower
            for word in (
                "priority",
                "priorities",
                "management",
                "brief",
                "important",
            )
        ):

            priorities: list[str] = []

            if (
                snapshot.production.target_today > 0
                and production_gap > 0
            ):
                priorities.append(
                    f"close the "
                    f"{production_gap:g}-tonne "
                    "production gap"
                )

            if (
                snapshot.inventory.critical_items > 0
            ):
                priorities.append(
                    f"replenish the "
                    f"{snapshot.inventory.critical_items} "
                    "critical inventory items"
                )

            if (
                snapshot.safety.open_actions > 0
            ):
                priorities.append(
                    f"close the "
                    f"{snapshot.safety.open_actions} "
                    "open safety actions"
                )

            if (
                snapshot.equipment.utilisation < 70
            ):
                priorities.append(
                    "investigate low equipment utilisation"
                )

            if not priorities:
                priorities.append(
                    "maintain current operational performance"
                )

            return (
                "Based on the current database, "
                "management priorities are: "
                + "; ".join(
                    priorities
                )
                + "."
            )

        # -----------------------------------------------------
        # GENERAL LIVE RESPONSE
        # -----------------------------------------------------

        return (
            "I am currently connected to the live "
            "SmartMine operational database. "
            f"The current intelligence score is "
            f"{score}%. "
            "Ask about production, equipment, "
            "workforce, inventory, fuel, safety, "
            "finance or management priorities and "
            "I will analyse the current recorded data."
        )