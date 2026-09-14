from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import Date, DateTime, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from backend.core.database import Base


class ProductionRecord(Base):
    __tablename__ = "production_records"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    shift: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    extracted: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    processed: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    output: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    operating_hours: Mapped[Decimal] = mapped_column(
        Numeric(8, 2),
        nullable=False,
    )

    downtime: Mapped[Decimal] = mapped_column(
        Numeric(8, 2),
        nullable=False,
        default=Decimal("0"),
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="In Progress",
        index=True,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class OperationalIssue(Base):
    __tablename__ = "operational_issues"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    priority: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="Medium",
        index=True,
    )

    duration: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="—",
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="Active",
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class ProductionTarget(Base):
    __tablename__ = "production_targets"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    target_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        unique=True,
        index=True,
    )

    target_output: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class MineShift(Base):
    __tablename__ = "mine_shifts"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    shift_name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="Inactive",
    )

    supervisor: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    start_time: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
    )

    end_time: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
    )

    workers: Mapped[int] = mapped_column(
        nullable=False,
        default=0,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )