from datetime import datetime

from sqlalchemy.orm import Session

from .model import MineReport
from .schema import (
    ReportCreate,
    ReportOverviewResponse,
    ReportPerformanceMetric,
    ReportOperationalMetric,
    ReportStatsResponse,
    ReportsDashboardResponse,
    ReportFinancialResponse,
    ReportUpdateRequest,
)


class ReportsService:

    @staticmethod
    def seed_reports(db: Session) -> None:
        existing = (
            db.query(MineReport)
            .count()
        )

        if existing > 0:
            return

        reports = [
            MineReport(
                name="Mine Operations Performance Report",
                category="Operations",
                period="Weekly",
                generated_date="05 Sep 2026",
                status="Ready",
                records=48,
                summary=(
                    "Overall mine activity, production movement, "
                    "operational efficiency and daily performance."
                ),
            ),
            MineReport(
                name="Production Performance Report",
                category="Production",
                period="Weekly",
                generated_date="05 Sep 2026",
                status="Ready",
                records=31,
                summary=(
                    "Material extracted, production targets, actual "
                    "output and production variance."
                ),
            ),
            MineReport(
                name="Processing Plant Report",
                category="Processing",
                period="Monthly",
                generated_date="01 Sep 2026",
                status="Ready",
                records=96,
                summary=(
                    "Crusher and grinding mill throughput, recovery, "
                    "downtime and processing performance."
                ),
            ),
            MineReport(
                name="Equipment Utilisation Report",
                category="Equipment",
                period="Monthly",
                generated_date="01 Sep 2026",
                status="Ready",
                records=74,
                summary=(
                    "Equipment availability, utilisation, operating "
                    "hours, downtime and maintenance activity."
                ),
            ),
            MineReport(
                name="Workforce Attendance Report",
                category="Workforce",
                period="Monthly",
                generated_date="01 Sep 2026",
                status="Ready",
                records=128,
                summary=(
                    "Worker attendance, shifts, overtime, workforce "
                    "allocation and productivity."
                ),
            ),
            MineReport(
                name="Inventory Stock Report",
                category="Inventory",
                period="Weekly",
                generated_date="05 Sep 2026",
                status="Attention Required",
                records=52,
                summary=(
                    "Stock balances, movements, low-stock items, "
                    "stock value and critical consumables."
                ),
            ),
            MineReport(
                name="Fuel Consumption Report",
                category="Fuel",
                period="Monthly",
                generated_date="01 Sep 2026",
                status="Ready",
                records=63,
                summary=(
                    "Fuel receipts, consumption, equipment usage, "
                    "fuel cost and consumption efficiency."
                ),
            ),
            MineReport(
                name="Safety & Incident Report",
                category="Safety",
                period="Weekly",
                generated_date="05 Sep 2026",
                status="Attention Required",
                records=18,
                summary=(
                    "Incidents, near misses, inspections, corrective "
                    "actions and safety performance."
                ),
            ),
            MineReport(
                name="Financial Performance Report",
                category="Finance",
                period="Monthly",
                generated_date="01 Sep 2026",
                status="Ready",
                records=142,
                summary=(
                    "Mine income, operating expenses, cash movement, "
                    "cost categories and profitability indicators."
                ),
            ),
            MineReport(
                name="Mineral Sales Report",
                category="Sales",
                period="Monthly",
                generated_date="01 Sep 2026",
                status="Ready",
                records=36,
                summary=(
                    "Mineral sales, buyers, quantities, revenue, "
                    "settlements and outstanding payments."
                ),
            ),
            MineReport(
                name="Quarterly Mine Performance Report",
                category="Operations",
                period="Quarterly",
                generated_date="01 Jul 2026",
                status="Ready",
                records=486,
                summary=(
                    "Quarterly management view covering operational, "
                    "production, financial and safety performance."
                ),
            ),
            MineReport(
                name="Annual Mine Performance Report",
                category="Operations",
                period="Annual",
                generated_date="01 Jan 2026",
                status="Pending",
                records=1258,
                summary=(
                    "Annual mine performance, production, financial "
                    "results, equipment, workforce and safety trends."
                ),
            ),
        ]

        db.add_all(reports)
        db.commit()

    @staticmethod
    def list_reports(
        db: Session,
        period: str | None = None,
        category: str | None = None,
        search: str | None = None,
    ) -> list[MineReport]:

        query = db.query(MineReport)

        if period:
            query = query.filter(
                MineReport.period == period
            )

        if category:
            query = query.filter(
                MineReport.category == category
            )

        if search and search.strip():
            search_term = (
                f"%{search.strip()}%"
            )

            query = query.filter(
                (MineReport.name.ilike(search_term))
                | (
                    MineReport.category.ilike(
                        search_term
                    )
                )
                | (
                    MineReport.summary.ilike(
                        search_term
                    )
                )
            )

        return (
            query
            .order_by(
                MineReport.id.asc()
            )
            .all()
        )

    @staticmethod
    def get_report(
        db: Session,
        report_id: int,
    ) -> MineReport | None:

        return (
            db.query(MineReport)
            .filter(
                MineReport.id == report_id
            )
            .first()
        )

    @staticmethod
    def generate_report(
        db: Session,
        data: ReportCreate,
    ) -> MineReport:

        period = data.period

        report = MineReport(
            name=(
                f"{period} Mine Operations Report"
            ),
            category=data.category,
            period=period,
            generated_date=datetime.now().strftime(
                "%d %b %Y"
            ),
            status="Ready",
            records=0,
            summary=(
                "Newly generated mine operations report "
                "based on the selected reporting period."
            ),
        )

        db.add(report)
        db.commit()
        db.refresh(report)

        return report

    @staticmethod
    def update_report(
        db: Session,
        report_id: int,
        data: ReportUpdateRequest,
    ) -> MineReport | None:

        report = (
            db.query(MineReport)
            .filter(
                MineReport.id == report_id
            )
            .first()
        )

        if not report:
            return None

        report.name = data.name
        report.category = data.category
        report.period = data.period
        report.status = data.status
        report.records = data.records
        report.summary = data.summary

        db.commit()
        db.refresh(report)

        return report

    @staticmethod
    def delete_report(
        db: Session,
        report_id: int,
    ) -> bool:

        report = (
            db.query(MineReport)
            .filter(
                MineReport.id == report_id
            )
            .first()
        )

        if not report:
            return False

        db.delete(report)
        db.commit()

        return True

    @staticmethod
    def get_stats(
        db: Session,
        period: str,
    ) -> ReportStatsResponse:

        reports = (
            db.query(MineReport)
            .filter(
                MineReport.period == period
            )
            .all()
        )

        ready = sum(
            1
            for report in reports
            if report.status == "Ready"
        )

        attention = sum(
            1
            for report in reports
            if report.status
            == "Attention Required"
        )

        pending = sum(
            1
            for report in reports
            if report.status == "Pending"
        )

        records = sum(
            report.records
            for report in reports
        )

        return ReportStatsResponse(
            ready=ready,
            attention=attention,
            pending=pending,
            records=records,
        )

    @staticmethod
    def get_overview(
        period: str,
    ) -> ReportOverviewResponse:

        performance = {
            "Weekly": [
                62,
                71,
                67,
                78,
                74,
                82,
                88,
            ],
            "Monthly": [
                58,
                64,
                69,
                73,
                77,
                81,
                86,
            ],
            "Quarterly": [
                52,
                61,
                68,
                72,
                79,
                84,
                91,
            ],
            "Annual": [
                48,
                55,
                63,
                69,
                74,
                81,
                89,
            ],
        }

        values = performance[period]

        current = values[-1]
        previous = values[-2]

        return ReportOverviewResponse(
            current=current,
            previous=previous,
            change=current - previous,
            values=values,
        )

    @staticmethod
    def get_performance(
        period: str,
    ) -> list[ReportPerformanceMetric]:

        multiplier = (
            0.72
            if period == "Weekly"
            else 1
            if period == "Monthly"
            else 2.84
            if period == "Quarterly"
            else 11.6
        )

        production = round(
            1248 * multiplier
        )

        processed = round(
            1086 * multiplier
        )

        target = round(
            1380 * multiplier
        )

        return [
            ReportPerformanceMetric(
                title="Material Extracted",
                value=f"{production:,} t",
                target=f"{target:,} t",
                percentage=min(
                    round(
                        (production / target) * 100
                    ),
                    100,
                ),
            ),
            ReportPerformanceMetric(
                title="Material Processed",
                value=f"{processed:,} t",
                target=f"{round(target * 0.92):,} t",
                percentage=81,
            ),
            ReportPerformanceMetric(
                title="Equipment Utilisation",
                value="87%",
                target="85%",
                percentage=87,
            ),
            ReportPerformanceMetric(
                title="Production Efficiency",
                value="83%",
                target="80%",
                percentage=83,
            ),
        ]

    @staticmethod
    def get_operational(
        period: str,
    ) -> list[ReportOperationalMetric]:

        return [
            ReportOperationalMetric(
                title="Processing",
                value="1,086 t",
                detail="Material processed",
                percentage=81,
            ),
            ReportOperationalMetric(
                title="Equipment",
                value="87%",
                detail="Average availability",
                percentage=87,
            ),
            ReportOperationalMetric(
                title="Workforce",
                value="94%",
                detail="Attendance rate",
                percentage=94,
            ),
            ReportOperationalMetric(
                title="Inventory",
                value="75%",
                detail="Stock health",
                percentage=75,
            ),
            ReportOperationalMetric(
                title="Fuel",
                value="3,842 L",
                detail="Consumption",
                percentage=78,
            ),
            ReportOperationalMetric(
                title="Safety",
                value="92%",
                detail="Safety compliance",
                percentage=92,
            ),
        ]

    @staticmethod
    def get_financial(
        period: str,
    ) -> ReportFinancialResponse:

        revenue = 482600
        expenses = 287450
        profit = revenue - expenses

        margin = round(
            (profit / revenue) * 100
        )

        return ReportFinancialResponse(
            revenue=revenue,
            expenses=expenses,
            profit=profit,
            margin=margin,
        )

    @staticmethod
    def get_dashboard(
        db: Session,
        period: str,
    ) -> ReportsDashboardResponse:

        return ReportsDashboardResponse(
            stats=ReportsService.get_stats(
                db,
                period,
            ),
            overview=ReportsService.get_overview(
                period
            ),
            performance=ReportsService.get_performance(
                period
            ),
            operational=ReportsService.get_operational(
                period
            ),
            financial=ReportsService.get_financial(
                period
            ),
        )