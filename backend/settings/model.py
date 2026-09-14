from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.core.database import Base


class Settings(Base):
    __tablename__ = "settings"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # =========================================================
    # MINE INFORMATION
    # =========================================================

    mine_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="SmartMine Operations",
    )

    location: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="South Africa",
    )

    timezone: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="Africa/Johannesburg",
    )

    # =========================================================
    # GENERAL PREFERENCES
    # =========================================================

    currency: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="ZAR",
    )

    date_format: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="DD/MM/YYYY",
    )

    temperature_unit: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="Celsius",
    )

    production_unit: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="Tonnes",
    )

    language: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="English",
    )

    compact_mode: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    # =========================================================
    # NOTIFICATIONS
    # =========================================================

    notification_production: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    notification_equipment: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    notification_safety: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    notification_inventory: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    notification_finance: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    # =========================================================
    # SECURITY
    # =========================================================

    email_alerts: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    two_factor: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    # =========================================================
    # AUDIT
    # =========================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )