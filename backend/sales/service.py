from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from .model import SalesTransaction
from .schema import (
    SalesCreate,
    SalesDashboardResponse,
    SalesProductPerformance,
    SalesResponse,
    SalesSummaryResponse,
    SalesUpdate,
    SalesBuyerPerformance,
)


class SalesService:

    # ---------------------------------------------------------
    # REFERENCE GENERATION
    # ---------------------------------------------------------

    @staticmethod
    def generate_reference(db: Session) -> str:
        year = datetime.now().year

        latest = (
            db.query(SalesTransaction)
            .filter(
                SalesTransaction.reference.like(
                    f"SAL-{year}-%"
                )
            )
            .order_by(
                SalesTransaction.id.desc()
            )
            .first()
        )

        if latest and latest.reference:
            try:
                last_number = int(
                    latest.reference.split("-")[-1]
                )
                next_number = last_number + 1

            except (ValueError, IndexError):
                next_number = 1

        else:
            next_number = 1

        return (
            f"SAL-{year}-"
            f"{next_number:03d}"
        )

    # ---------------------------------------------------------
    # DATE
    # ---------------------------------------------------------

    @staticmethod
    def current_date() -> str:
        return datetime.now().strftime(
            "%d %b %Y"
        )

    # ---------------------------------------------------------
    # GET ONE SALE
    # ---------------------------------------------------------

    @staticmethod
    def get_sale(
        db: Session,
        sale_id: int,
    ) -> SalesTransaction | None:

        return (
            db.query(SalesTransaction)
            .filter(
                SalesTransaction.id == sale_id
            )
            .first()
        )

    # ---------------------------------------------------------
    # LIST SALES
    # ---------------------------------------------------------

    @staticmethod
    def list_sales(
        db: Session,
        search: str | None = None,
        status: str | None = None,
    ) -> list[SalesTransaction]:

        query = db.query(
            SalesTransaction
        )

        if search:
            search_term = (
                f"%{search.strip()}%"
            )

            query = query.filter(
                (SalesTransaction.reference.ilike(search_term))
                | (
                    SalesTransaction.buyer.ilike(
                        search_term
                    )
                )
                | (
                    SalesTransaction.product.ilike(
                        search_term
                    )
                )
            )

        if status:
            query = query.filter(
                SalesTransaction.status == status
            )

        return (
            query
            .order_by(
                SalesTransaction.id.desc()
            )
            .all()
        )

    # ---------------------------------------------------------
    # CREATE SALE
    # ---------------------------------------------------------

    @staticmethod
    def create_sale(
        db: Session,
        data: SalesCreate,
    ) -> SalesTransaction:

        reference = (
            SalesService.generate_reference(db)
        )

        sale = SalesTransaction(
            reference=reference,
            date=SalesService.current_date(),
            buyer=data.buyer.strip(),
            product=data.product,
            quantity=data.quantity,
            unit=data.unit.strip(),
            purity=(
                data.purity.strip()
                if data.purity
                else "Not recorded"
            ),
            amount=data.amount,
            status=data.status,
            payment_method=(
                data.payment_method.strip()
            ),
            recorded_by="Mine Admin",
        )

        db.add(sale)
        db.commit()
        db.refresh(sale)

        return sale

    # ---------------------------------------------------------
    # UPDATE SALE
    # ---------------------------------------------------------

    @staticmethod
    def update_sale(
        db: Session,
        sale_id: int,
        data: SalesUpdate,
    ) -> SalesTransaction | None:

        sale = SalesService.get_sale(
            db,
            sale_id,
        )

        if not sale:
            return None

        update_data = data.model_dump(
            exclude_unset=True,
            by_alias=False,
        )

        for field, value in update_data.items():

            if isinstance(value, str):
                value = value.strip()

            setattr(
                sale,
                field,
                value,
            )

        db.commit()
        db.refresh(sale)

        return sale

    # ---------------------------------------------------------
    # DELETE SALE
    # ---------------------------------------------------------

    @staticmethod
    def delete_sale(
        db: Session,
        sale_id: int,
    ) -> SalesTransaction | None:

        sale = SalesService.get_sale(
            db,
            sale_id,
        )

        if not sale:
            return None

        db.delete(sale)
        db.commit()

        return sale

    # ---------------------------------------------------------
    # SUMMARY
    # ---------------------------------------------------------

    @staticmethod
    def get_summary(
        db: Session,
    ) -> SalesSummaryResponse:

        total_sales = (
            db.query(
                func.count(
                    SalesTransaction.id
                )
            )
            .scalar()
            or 0
        )

        completed_sales = (
            db.query(
                func.count(
                    SalesTransaction.id
                )
            )
            .filter(
                SalesTransaction.status
                == "Completed"
            )
            .scalar()
            or 0
        )

        pending_sales = (
            db.query(
                func.count(
                    SalesTransaction.id
                )
            )
            .filter(
                SalesTransaction.status
                == "Pending"
            )
            .scalar()
            or 0
        )

        overdue_sales = (
            db.query(
                func.count(
                    SalesTransaction.id
                )
            )
            .filter(
                SalesTransaction.status
                == "Overdue"
            )
            .scalar()
            or 0
        )

        completed_revenue = (
            db.query(
                func.coalesce(
                    func.sum(
                        SalesTransaction.amount
                    ),
                    0,
                )
            )
            .filter(
                SalesTransaction.status
                == "Completed"
            )
            .scalar()
            or 0
        )

        pending_amount = (
            db.query(
                func.coalesce(
                    func.sum(
                        SalesTransaction.amount
                    ),
                    0,
                )
            )
            .filter(
                SalesTransaction.status
                == "Pending"
            )
            .scalar()
            or 0
        )

        overdue_amount = (
            db.query(
                func.coalesce(
                    func.sum(
                        SalesTransaction.amount
                    ),
                    0,
                )
            )
            .filter(
                SalesTransaction.status
                == "Overdue"
            )
            .scalar()
            or 0
        )

        average_sale = (
            float(completed_revenue)
            / completed_sales
            if completed_sales > 0
            else 0
        )

        active_buyers = (
            db.query(
                func.count(
                    func.distinct(
                        SalesTransaction.buyer
                    )
                )
            )
            .scalar()
            or 0
        )

        return SalesSummaryResponse(
            totalSales=int(total_sales),
            completedSales=int(
                completed_sales
            ),
            pendingSales=int(
                pending_sales
            ),
            overdueSales=int(
                overdue_sales
            ),
            completedRevenue=float(
                completed_revenue
            ),
            pendingAmount=float(
                pending_amount
            ),
            overdueAmount=float(
                overdue_amount
            ),
            averageSale=float(
                average_sale
            ),
            activeBuyers=int(
                active_buyers
            ),
        )

    # ---------------------------------------------------------
    # PRODUCT PERFORMANCE
    # ---------------------------------------------------------

    @staticmethod
    def get_product_performance(
        db: Session,
    ) -> list[SalesProductPerformance]:

        rows = (
            db.query(
                SalesTransaction.product,
                func.sum(
                    SalesTransaction.amount
                ).label("revenue"),
                func.count(
                    SalesTransaction.id
                ).label("transactions"),
            )
            .filter(
                SalesTransaction.status
                == "Completed"
            )
            .group_by(
                SalesTransaction.product
            )
            .order_by(
                func.sum(
                    SalesTransaction.amount
                ).desc()
            )
            .all()
        )

        total_revenue = sum(
            float(row.revenue or 0)
            for row in rows
        )

        return [
            SalesProductPerformance(
                product=row.product,
                revenue=float(
                    row.revenue or 0
                ),
                transactions=int(
                    row.transactions or 0
                ),
                percentage=(
                    float(row.revenue or 0)
                    / total_revenue
                    * 100
                    if total_revenue > 0
                    else 0
                ),
            )
            for row in rows
        ]

    # ---------------------------------------------------------
    # BUYER PERFORMANCE
    # ---------------------------------------------------------

    @staticmethod
    def get_buyer_performance(
        db: Session,
    ) -> list[SalesBuyerPerformance]:

        rows = (
            db.query(
                SalesTransaction.buyer,
                func.sum(
                    SalesTransaction.amount
                ).label("revenue"),
                func.count(
                    SalesTransaction.id
                ).label("transactions"),
            )
            .filter(
                SalesTransaction.status
                == "Completed"
            )
            .group_by(
                SalesTransaction.buyer
            )
            .order_by(
                func.sum(
                    SalesTransaction.amount
                ).desc()
            )
            .all()
        )

        return [
            SalesBuyerPerformance(
                buyer=row.buyer,
                revenue=float(
                    row.revenue or 0
                ),
                transactions=int(
                    row.transactions or 0
                ),
            )
            for row in rows
        ]

    # ---------------------------------------------------------
    # DASHBOARD
    # ---------------------------------------------------------

    @staticmethod
    def get_dashboard(
        db: Session,
    ) -> SalesDashboardResponse:

        sales = SalesService.list_sales(db)

        summary = SalesService.get_summary(db)

        product_performance = (
            SalesService.get_product_performance(
                db
            )
        )

        buyer_performance = (
            SalesService.get_buyer_performance(
                db
            )
        )

        return SalesDashboardResponse(
            summary=summary,
            sales=[
                SalesResponse.model_validate(
                    sale
                )
                for sale in sales
            ],
            productPerformance=product_performance,
            buyerPerformance=buyer_performance,
        )