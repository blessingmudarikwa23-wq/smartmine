from sqlalchemy import func
from sqlalchemy.orm import Session

from .model import FinanceTransaction
from .schema import (
    FinanceTransactionCreate,
    FinanceTransactionUpdate,
)


class FinanceService:

    @staticmethod
    def _generate_reference(
        db: Session,
        transaction_type: str,
    ) -> str:
        prefix = (
            "INC"
            if transaction_type == "Income"
            else "EXP"
        )

        year = "2026"

        latest = (
            db.query(FinanceTransaction)
            .filter(
                FinanceTransaction.type
                == transaction_type
            )
            .order_by(
                FinanceTransaction.id.desc()
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
            f"{prefix}-{year}-"
            f"{str(next_number).zfill(3)}"
        )

    @staticmethod
    def create_transaction(
        db: Session,
        data: FinanceTransactionCreate,
    ) -> FinanceTransaction:

        reference = (
            data.reference
            or FinanceService._generate_reference(
                db,
                data.type,
            )
        )

        transaction = FinanceTransaction(
            reference=reference,
            date=data.date,
            description=data.description,
            category=data.category,
            type=data.type,
            amount=data.amount,
            status=data.status,
            supplier=data.supplier,
            recorded_by=data.recorded_by,
        )

        db.add(transaction)
        db.commit()
        db.refresh(transaction)

        return transaction

    @staticmethod
    def get_transaction(
        db: Session,
        transaction_id: int,
    ) -> FinanceTransaction | None:

        return (
            db.query(FinanceTransaction)
            .filter(
                FinanceTransaction.id
                == transaction_id
            )
            .first()
        )

    @staticmethod
    def list_transactions(
        db: Session,
        search: str | None = None,
        status: str | None = None,
        transaction_type: str | None = None,
        category: str | None = None,
    ) -> list[FinanceTransaction]:

        query = db.query(FinanceTransaction)

        if search:
            search_term = (
                f"%{search.strip().lower()}%"
            )

            query = query.filter(
                (
                    func.lower(
                        FinanceTransaction.reference
                    ).like(search_term)
                )
                | (
                    func.lower(
                        FinanceTransaction.description
                    ).like(search_term)
                )
                | (
                    func.lower(
                        FinanceTransaction.supplier
                    ).like(search_term)
                )
            )

        if status:
            query = query.filter(
                FinanceTransaction.status == status
            )

        if transaction_type:
            query = query.filter(
                FinanceTransaction.type
                == transaction_type
            )

        if category:
            query = query.filter(
                FinanceTransaction.category
                == category
            )

        return (
            query
            .order_by(
                FinanceTransaction.id.desc()
            )
            .all()
        )

    @staticmethod
    def update_transaction(
        db: Session,
        transaction_id: int,
        data: FinanceTransactionUpdate,
    ) -> FinanceTransaction | None:

        transaction = (
            FinanceService.get_transaction(
                db,
                transaction_id,
            )
        )

        if not transaction:
            return None

        update_data = data.model_dump(
            exclude_unset=True,
            by_alias=False,
        )

        for field, value in update_data.items():
            setattr(
                transaction,
                field,
                value,
            )

        db.commit()
        db.refresh(transaction)

        return transaction

    @staticmethod
    def delete_transaction(
        db: Session,
        transaction_id: int,
    ) -> FinanceTransaction | None:

        transaction = (
            FinanceService.get_transaction(
                db,
                transaction_id,
            )
        )

        if not transaction:
            return None

        db.delete(transaction)
        db.commit()

        return transaction

    @staticmethod
    def get_summary(
        db: Session,
    ) -> dict:

        transactions = (
            db.query(FinanceTransaction)
            .all()
        )

        revenue = sum(
            transaction.amount
            for transaction in transactions
            if transaction.type == "Income"
        )

        expenses = sum(
            transaction.amount
            for transaction in transactions
            if transaction.type == "Expense"
        )

        pending = sum(
            transaction.amount
            for transaction in transactions
            if (
                transaction.type == "Expense"
                and transaction.status == "Pending"
            )
        )

        overdue = sum(
            1
            for transaction in transactions
            if transaction.status == "Overdue"
        )

        return {
            "totalRevenue": revenue,
            "totalExpenses": expenses,
            "netPosition": revenue - expenses,
            "pendingAmount": pending,
            "overdueCount": overdue,
            "transactionCount": len(
                transactions
            ),
        }

    @staticmethod
    def get_dashboard(
        db: Session,
    ) -> dict:

        return {
            "summary": FinanceService.get_summary(
                db
            ),
            "transactions": FinanceService.list_transactions(
                db
            ),
        }