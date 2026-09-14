from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.core.database import Base


# ============================================================
# INVENTORY ITEM MODEL
# ============================================================

class InventoryItemModel(Base):
    __tablename__ = "inventory_items"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    code = Column(
        String,
        unique=True,
        index=True,
        nullable=False,
    )

    name = Column(
        String,
        nullable=False,
    )

    category = Column(
        String,
        index=True,
        nullable=False,
    )

    location = Column(
        String,
        nullable=False,
    )

    unit = Column(
        String,
        nullable=False,
    )

    quantity = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    minimum_level = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    reorder_level = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    unit_cost = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    supplier = Column(
        String,
        nullable=False,
    )

    status = Column(
        String,
        nullable=False,
        default="In Stock",
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

    movements = relationship(
        "InventoryMovementModel",
        back_populates="item",
        cascade="all, delete-orphan",
    )


# ============================================================
# INVENTORY MOVEMENT MODEL
# ============================================================

class InventoryMovementModel(Base):
    __tablename__ = "inventory_movements"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    item_id = Column(
        Integer,
        ForeignKey(
            "inventory_items.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    item_name = Column(
        String,
        nullable=False,
    )

    code = Column(
        String,
        nullable=False,
    )

    type = Column(
        String,
        nullable=False,
    )

    quantity = Column(
        Float,
        nullable=False,
    )

    unit = Column(
        String,
        nullable=False,
    )

    reference = Column(
        String,
        nullable=False,
    )

    user = Column(
        String,
        nullable=False,
        default="System User",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True,
    )

    item = relationship(
        "InventoryItemModel",
        back_populates="movements",
    )