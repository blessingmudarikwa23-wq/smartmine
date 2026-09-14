from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict


# ============================================================
# INVENTORY ITEM BASE
# ============================================================

class InventoryItemBase(BaseModel):
    code: str
    name: str
    category: str
    location: str
    unit: str
    quantity: float
    minimumLevel: float
    reorderLevel: float
    unitCost: float
    supplier: str


# ============================================================
# CREATE INVENTORY ITEM
# ============================================================

class InventoryItemCreate(InventoryItemBase):
    pass


# ============================================================
# INVENTORY ITEM RESPONSE
# ============================================================

class InventoryItemResponse(InventoryItemBase):
    id: int
    status: Literal[
        "In Stock",
        "Low Stock",
        "Critical",
    ]
    lastUpdated: str

    model_config = ConfigDict(
        from_attributes=True,
    )


# ============================================================
# STOCK ADJUSTMENT REQUEST
# ============================================================

class StockAdjustmentRequest(BaseModel):
    quantity: float
    user: Optional[str] = "Mine Admin"
    reference: Optional[str] = None


# ============================================================
# INVENTORY MOVEMENT RESPONSE
# ============================================================

class InventoryMovementResponse(BaseModel):
    id: int
    item: str
    code: str
    type: Literal[
        "Stock In",
        "Stock Out",
    ]
    quantity: float
    unit: str
    reference: str
    user: str
    date: str
    time: str

    model_config = ConfigDict(
        from_attributes=True,
    )