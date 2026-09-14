from sqlalchemy.orm import Session

from backend.core.database import SessionLocal
from .model import FinanceTransaction


INITIAL_TRANSACTIONS = [
    {
        "reference": "EXP-2026-081",
        "date": "05 Sep 2026",
        "description": "Diesel supply for crushing plant",
        "category": "Fuel",
        "type": "Expense",
        "amount": 18450,
        "status": "Paid",
        "supplier": "ZimFuel Mining Supplies",
        "recorded_by": "Mine Admin",
    },
    {
        "reference": "INC-2026-034",
        "date": "05 Sep 2026",
        "description": "Gold concentrate sale",
        "category": "Other",
        "type": "Income",
        "amount": 68200,
        "status": "Paid",
        "supplier": "Gold Buyer",
        "recorded_by": "Mine Admin",
    },
    {
        "reference": "EXP-2026-080",
        "date": "04 Sep 2026",
        "description": "Crusher maintenance and parts",
        "category": "Equipment",
        "type": "Expense",
        "amount": 12750,
        "status": "Paid",
        "supplier": "Mining Equipment Services",
        "recorded_by": "Mine Admin",
    },
    {
        "reference": "EXP-2026-079",
        "date": "04 Sep 2026",
        "description": "Grinding mill electrical repairs",
        "category": "Processing",
        "type": "Expense",
        "amount": 8600,
        "status": "Pending",
        "supplier": "Electrical & Plant Services",
        "recorded_by": "Operations Manager",
    },
    {
        "reference": "EXP-2026-078",
        "date": "03 Sep 2026",
        "description": "PPE and safety consumables",
        "category": "Safety",
        "type": "Expense",
        "amount": 4350,
        "status": "Paid",
        "supplier": "Mine Safety Supplies",
        "recorded_by": "Mine Admin",
    },
    {
        "reference": "EXP-2026-077",
        "date": "03 Sep 2026",
        "description": "Worker wages and allowances",
        "category": "Workforce",
        "type": "Expense",
        "amount": 24600,
        "status": "Paid",
        "supplier": "Payroll",
        "recorded_by": "Mine Admin",
    },
    {
        "reference": "EXP-2026-076",
        "date": "02 Sep 2026",
        "description": "Conveyor and processing spares",
        "category": "Inventory",
        "type": "Expense",
        "amount": 6950,
        "status": "Overdue",
        "supplier": "Industrial Spares",
        "recorded_by": "Store Admin",
    },
    {
        "reference": "INC-2026-033",
        "date": "02 Sep 2026",
        "description": "Gold recovery settlement",
        "category": "Other",
        "type": "Income",
        "amount": 51200,
        "status": "Paid",
        "supplier": "Gold Buyer",
        "recorded_by": "Mine Admin",
    },
]


def seed_finance():
    db: Session = SessionLocal()

    try:
        existing = (
            db.query(FinanceTransaction)
            .count()
        )

        if existing > 0:
            print(
                "Finance data already exists. "
                "Skipping seed."
            )
            return

        for item in INITIAL_TRANSACTIONS:
            db.add(
                FinanceTransaction(
                    **item
                )
            )

        db.commit()

        print(
            "Finance seed data inserted successfully."
        )

    finally:
        db.close()


if __name__ == "__main__":
    seed_finance()