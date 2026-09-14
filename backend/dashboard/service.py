from datetime import date, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.mine_operations.model import (
    MineShift,
    OperationalIssue,
    ProductionRecord,
    ProductionTarget,
)

from backend.dashboard.schema import (
    DashboardActivity,
    DashboardEquipment,
    DashboardKPI,
    DashboardMineStatus,
    DashboardOperationalHealth,
    DashboardProduction,
    DashboardProductionPoint,
    DashboardResponse,
    DashboardSummaryResponse,
)


class DashboardService:

    @staticmethod
    def _date_range(target_date: date | None = None) -> tuple[date, date]:
        end_date = target_date or date.today()
        start_date = end_date - timedelta(days=6)
        return start_date, end_date

    @staticmethod
    def _production_totals(
        db: Session,
        start_date: date,
        end_date: date,
    ) -> dict[str, float]:
        result = (
            db.query(
                func.coalesce(func.sum(ProductionRecord.extracted), 0),
                func.coalesce(func.sum(ProductionRecord.processed), 0),
                func.coalesce(func.sum(ProductionRecord.output), 0),
                func.coalesce(func.sum(ProductionRecord.operating_hours), 0),
                func.coalesce(func.sum(ProductionRecord.downtime), 0),
            )
            .filter(
                ProductionRecord.date >= start_date,
                ProductionRecord.date <= end_date,
            )
            .one()
        )

        return {
            "extracted": float(result[0] or 0),
            "processed": float(result[1] or 0),
            "output": float(result[2] or 0),
            "operating_hours": float(result[3] or 0),
            "downtime": float(result[4] or 0),
        }

    @staticmethod
    def _previous_period_output(
        db: Session,
        start_date: date,
    ) -> float:
        previous_end = start_date - timedelta(days=1)
        previous_start = previous_end - timedelta(days=6)

        result = (
            db.query(
                func.coalesce(func.sum(ProductionRecord.output), 0)
            )
            .filter(
                ProductionRecord.date >= previous_start,
                ProductionRecord.date <= previous_end,
            )
            .scalar()
        )

        return float(result or 0)

    @staticmethod
    def _calculate_change(
        current: float,
        previous: float,
    ) -> tuple[str, str]:
        if previous == 0:
            if current > 0:
                return "+100%", "up"
            return "0%", "neutral"

        percentage = ((current - previous) / previous) * 100

        if percentage > 0:
            return f"+{percentage:.1f}%", "up"

        if percentage < 0:
            return f"{percentage:.1f}%", "down"

        return "0%", "neutral"

    @staticmethod
    def _production_chart(
        db: Session,
        start_date: date,
        end_date: date,
    ) -> list[DashboardProductionPoint]:

        rows = (
            db.query(
                ProductionRecord.date,
                func.coalesce(func.sum(ProductionRecord.extracted), 0),
                func.coalesce(func.sum(ProductionRecord.processed), 0),
                func.coalesce(func.sum(ProductionRecord.output), 0),
            )
            .filter(
                ProductionRecord.date >= start_date,
                ProductionRecord.date <= end_date,
            )
            .group_by(ProductionRecord.date)
            .order_by(ProductionRecord.date.asc())
            .all()
        )

        production_by_date = {
            row[0]: {
                "extracted": float(row[1] or 0),
                "processed": float(row[2] or 0),
                "output": float(row[3] or 0),
            }
            for row in rows
        }

        chart: list[DashboardProductionPoint] = []

        current_date = start_date

        while current_date <= end_date:
            values = production_by_date.get(
                current_date,
                {
                    "extracted": 0,
                    "processed": 0,
                    "output": 0,
                },
            )

            chart.append(
                DashboardProductionPoint(
                    date=current_date,
                    extracted=values["extracted"],
                    processed=values["processed"],
                    output=values["output"],
                )
            )

            current_date += timedelta(days=1)

        return chart

    @staticmethod
    def _production_target(
        db: Session,
        start_date: date,
        end_date: date,
    ) -> float:

        result = (
            db.query(
                func.coalesce(func.sum(ProductionTarget.target_output), 0)
            )
            .filter(
                ProductionTarget.target_date >= start_date,
                ProductionTarget.target_date <= end_date,
            )
            .scalar()
        )

        return float(result or 0)

    @staticmethod
    def _get_active_issues(db: Session) -> tuple[int, int]:

        active_count = (
            db.query(func.count(OperationalIssue.id))
            .filter(OperationalIssue.status == "Active")
            .scalar()
        )

        high_priority_count = (
            db.query(func.count(OperationalIssue.id))
            .filter(
                OperationalIssue.status == "Active",
                OperationalIssue.priority == "High",
            )
            .scalar()
        )

        return (
            int(active_count or 0),
            int(high_priority_count or 0),
        )

    @staticmethod
    def _get_shift_summary(db: Session) -> tuple[int, int]:

        active_shifts = (
            db.query(func.count(MineShift.id))
            .filter(MineShift.status == "Active")
            .scalar()
        )

        total_workers = (
            db.query(func.coalesce(func.sum(MineShift.workers), 0))
            .filter(MineShift.status == "Active")
            .scalar()
        )

        return (
            int(active_shifts or 0),
            int(total_workers or 0),
        )

    @staticmethod
    def _get_mine_status(
        db: Session,
        active_shifts: int,
    ) -> str:

        if active_shifts > 0:
            return "Operations Active"

        recent_production = (
            db.query(func.count(ProductionRecord.id))
            .filter(
                ProductionRecord.date == date.today()
            )
            .scalar()
        )

        if recent_production and recent_production > 0:
            return "Operations Active"

        return "Operations Standby"

    @staticmethod
    def get_summary(
        db: Session,
        target_date: date | None = None,
    ) -> DashboardSummaryResponse:

        start_date, end_date = DashboardService._date_range(
            target_date
        )

        totals = DashboardService._production_totals(
            db,
            start_date,
            end_date,
        )

        previous_output = DashboardService._previous_period_output(
            db,
            start_date,
        )

        output_change, output_trend = DashboardService._calculate_change(
            totals["output"],
            previous_output,
        )

        production_target = DashboardService._production_target(
            db,
            start_date,
            end_date,
        )

        target_achievement = (
            (totals["processed"] / production_target) * 100
            if production_target > 0
            else 0
        )

        remaining_production = max(
            production_target - totals["processed"],
            0,
        )

        processing_efficiency = (
            (totals["processed"] / totals["extracted"]) * 100
            if totals["extracted"] > 0
            else 0
        )

        available_hours = (
            totals["operating_hours"] - totals["downtime"]
        )

        operating_efficiency = (
            (available_hours / totals["operating_hours"]) * 100
            if totals["operating_hours"] > 0
            else 0
        )

        active_issues, high_priority_issues = (
            DashboardService._get_active_issues(db)
        )

        active_shifts, total_workers = (
            DashboardService._get_shift_summary(db)
        )

        mine_status = DashboardService._get_mine_status(
            db,
            active_shifts,
        )

        kpis = [
            DashboardKPI(
                title="Material Processed",
                value=round(totals["processed"], 2),
                unit="tonnes",
                change=output_change,
                trend=output_trend,
                description="vs previous period",
            ),
            DashboardKPI(
                title="Production Output",
                value=round(totals["output"], 2),
                unit="tonnes",
                change=output_change,
                trend=output_trend,
                description="current production",
            ),
            DashboardKPI(
                title="Operating Efficiency",
                value=round(operating_efficiency, 1),
                unit="%",
                change=None,
                trend="neutral",
                description="operating performance",
            ),
            DashboardKPI(
                title="Active Workers",
                value=total_workers,
                unit="workers",
                change=None,
                trend="neutral",
                description="current active shifts",
            ),
        ]

        return DashboardSummaryResponse(
            kpis=kpis,
            total_extracted=round(totals["extracted"], 2),
            total_processed=round(totals["processed"], 2),
            total_output=round(totals["output"], 2),
            production_target=round(production_target, 2),
            target_achievement=round(target_achievement, 1),
            remaining_production=round(remaining_production, 2),
            processing_efficiency=round(processing_efficiency, 1),
            operating_efficiency=round(operating_efficiency, 1),
            operating_hours=round(
                totals["operating_hours"],
                2,
            ),
            downtime=round(
                totals["downtime"],
                2,
            ),
            active_issues=active_issues,
            high_priority_issues=high_priority_issues,
            active_shifts=active_shifts,
            total_workers=total_workers,
            mine_status=mine_status,
        )

    @staticmethod
    def get_production(
        db: Session,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> DashboardProduction:

        if end_date is None:
            end_date = date.today()

        if start_date is None:
            start_date = end_date - timedelta(days=6)

        totals = DashboardService._production_totals(
            db,
            start_date,
            end_date,
        )

        target = DashboardService._production_target(
            db,
            start_date,
            end_date,
        )

        achievement = (
            (totals["processed"] / target) * 100
            if target > 0
            else 0
        )

        remaining = max(
            target - totals["processed"],
            0,
        )

        return DashboardProduction(
            chart=DashboardService._production_chart(
                db,
                start_date,
                end_date,
            ),
            target=round(target, 2),
            actual=round(totals["processed"], 2),
            achievement=round(achievement, 1),
            remaining=round(remaining, 2),
        )

    @staticmethod
    def get_equipment(db: Session) -> list[DashboardEquipment]:
        return []

    @staticmethod
    def get_activities(
        db: Session,
        limit: int = 10,
    ) -> list[DashboardActivity]:

        activities: list[DashboardActivity] = []

        production_records = (
            db.query(ProductionRecord)
            .order_by(
                ProductionRecord.created_at.desc()
            )
            .limit(limit)
            .all()
        )

        for record in production_records:
            activities.append(
                DashboardActivity(
                    title="Production recorded",
                    description=(
                        f"{record.shift} production record "
                        f"captured with {float(record.output):.2f} "
                        "tonnes output."
                    ),
                    time=(
                        record.created_at.strftime("%H:%M")
                        if record.created_at
                        else "--:--"
                    ),
                    category="Production",
                )
            )

        issues = (
            db.query(OperationalIssue)
            .order_by(
                OperationalIssue.created_at.desc()
            )
            .limit(limit)
            .all()
        )

        for issue in issues:
            activities.append(
                DashboardActivity(
                    title=issue.title,
                    description=issue.description,
                    time=(
                        issue.created_at.strftime("%H:%M")
                        if issue.created_at
                        else "--:--"
                    ),
                    category="Issue",
                )
            )

        activities.sort(
            key=lambda activity: activity.time,
            reverse=True,
        )

        return activities[:limit]

    @staticmethod
    def get_operational_health(
        db: Session,
        target_date: date | None = None,
    ) -> DashboardOperationalHealth:

        summary = DashboardService.get_summary(
            db,
            target_date,
        )

        return DashboardOperationalHealth(
            production_target=summary.target_achievement,
            equipment_availability=None,
            safety_compliance=None,
            workforce_attendance=None,
        )

    @staticmethod
    def get_dashboard(
        db: Session,
        target_date: date | None = None,
    ) -> DashboardResponse:

        summary = DashboardService.get_summary(
            db,
            target_date,
        )

        production = DashboardService.get_production(
            db,
            start_date=(
                DashboardService._date_range(target_date)[0]
            ),
            end_date=(
                DashboardService._date_range(target_date)[1]
            ),
        )

        activities = DashboardService.get_activities(
            db,
            limit=10,
        )

        operational_health = (
            DashboardService.get_operational_health(
                db,
                target_date,
            )
        )

        return DashboardResponse(
            summary=summary,
            production=production,
            equipment=DashboardService.get_equipment(db),
            activities=activities,
            operational_health=operational_health,
            mine_status=DashboardMineStatus(
                status=summary.mine_status
            ),
        )