from datetime import datetime

from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.core.database import Base


class SalesTransaction(Base):
    __tablename__ = "sales_transactions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    reference: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
    )

    date: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    buyer: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    product: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    quantity: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    unit: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    purity: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="Not recorded",
    )

    amount: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="Pending",
        index=True,
    )

    payment_method: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="Bank Transfer",
    )

    recorded_by: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="Mine Admin",
    )

    created_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )