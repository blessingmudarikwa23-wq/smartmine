from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.core.database import Base


class Equipment(Base):
    __tablename__ = "equipment"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    equipment_id: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    manufacturer: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="Not specified",
    )

    model: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="Not specified",
    )

    location: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="Available",
        index=True,
    )

    operating_hours: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0,
    )

    utilisation: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0,
    )

    last_maintenance: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    next_maintenance: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
        index=True,
    )

    maintenance_interval: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=250,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )