from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.core.database import Base


class FuelTankModel(Base):
    __tablename__ = "fuel_tanks"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String(150),
        nullable=False,
    )

    fuel_type = Column(
        String(50),
        nullable=False,
    )

    location = Column(
        String(150),
        nullable=False,
    )

    capacity = Column(
        Float,
        nullable=False,
    )

    current_level = Column(
        Float,
        nullable=False,
        default=0,
    )

    minimum_level = Column(
        Float,
        nullable=False,
        default=0,
    )

    unit_cost = Column(
        Float,
        nullable=False,
        default=0,
    )

    last_refill = Column(
        String(100),
        nullable=True,
    )

    status = Column(
        String(50),
        nullable=False,
        default="Healthy",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    records = relationship(
        "FuelRecordModel",
        back_populates="tank",
        cascade="all, delete-orphan",
    )


class FuelRecordModel(Base):
    __tablename__ = "fuel_records"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    tank_id = Column(
        Integer,
        ForeignKey(
            "fuel_tanks.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    date = Column(
        String(50),
        nullable=False,
    )

    time = Column(
        String(20),
        nullable=False,
    )

    type = Column(
        String(50),
        nullable=False,
    )

    equipment = Column(
        String(150),
        nullable=False,
    )

    operator = Column(
        String(150),
        nullable=False,
    )

    fuel_type = Column(
        String(50),
        nullable=False,
    )

    quantity = Column(
        Float,
        nullable=False,
    )

    meter_reading = Column(
        Float,
        nullable=False,
        default=0,
    )

    unit_price = Column(
        Float,
        nullable=False,
    )

    cost = Column(
        Float,
        nullable=False,
    )

    reference = Column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
    )

    location = Column(
        String(150),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True,
    )

    tank = relationship(
        "FuelTankModel",
        back_populates="records",
    )