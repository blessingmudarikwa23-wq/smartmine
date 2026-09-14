from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from backend.inventory.model import (
    InventoryItemModel,
    InventoryMovementModel,
)
from backend.inventory.schema import (
    InventoryItemCreate,
    StockAdjustmentRequest,
)


# ============================================================
# CALCULATE INVENTORY STATUS
# ============================================================

def calculate_status(
    quantity: float,
    min_level: float,
    reorder_level: float,
) -> str:

    if quantity <= min_level:
        return "Critical"

    if quantity <= reorder_level:
        return "Low Stock"

    return "In Stock"


# ============================================================
# SERIALIZE INVENTORY ITEM
# ============================================================

def _serialize_item(
    item: InventoryItemModel,
    custom_last_updated: Optional[str] = None,
) -> Dict[str, Any]:

    if custom_last_updated:
        last_updated = custom_last_updated

    elif item.updated_at:
        last_updated = item.updated_at.strftime(
            "Today, %H:%M"
        )

    else:
        last_updated = "N/A"

    return {
        "id": item.id,
        "code": item.code,
        "name": item.name,
        "category": item.category,
        "location": item.location,
        "unit": item.unit,
        "quantity": item.quantity,
        "minimumLevel": item.minimum_level,
        "reorderLevel": item.reorder_level,
        "unitCost": item.unit_cost,
        "supplier": item.supplier,
        "status": item.status,
        "lastUpdated": last_updated,
    }


# ============================================================
# GET ALL INVENTORY ITEMS
# ============================================================

def get_all_items(
    db: Session,
) -> List[Dict[str, Any]]:

    items = (
        db.query(InventoryItemModel)
        .all()
    )

    return [
        _serialize_item(item)
        for item in items
    ]


# ============================================================
# GET INVENTORY ITEM BY ID
# ============================================================

def get_item_by_id(
    db: Session,
    item_id: int,
) -> Optional[Dict[str, Any]]:

    item = (
        db.query(InventoryItemModel)
        .filter(
            InventoryItemModel.id == item_id
        )
        .first()
    )

    if not item:
        return None

    return _serialize_item(item)


# ============================================================
# CREATE INVENTORY ITEM
# ============================================================

def create_item(
    db: Session,
    item_data: InventoryItemCreate,
) -> Dict[str, Any]:

    status = calculate_status(
        item_data.quantity,
        item_data.minimumLevel,
        item_data.reorderLevel,
    )

    db_item = InventoryItemModel(
        code=item_data.code,
        name=item_data.name,
        category=item_data.category,
        location=item_data.location,
        unit=item_data.unit,
        quantity=item_data.quantity,
        minimum_level=item_data.minimumLevel,
        reorder_level=item_data.reorderLevel,
        unit_cost=item_data.unitCost,
        supplier=item_data.supplier,
        status=status,
    )

    db.add(db_item)
    db.flush()

    movement = InventoryMovementModel(
        item_id=db_item.id,
        item_name=db_item.name,
        code=db_item.code,
        type="Stock In",
        quantity=db_item.quantity,
        unit=db_item.unit,
        reference=(
            f"GRN-{datetime.now(timezone.utc).year}-"
            f"{db_item.id:03d}"
        ),
        user="Mine Admin",
    )

    db.add(movement)

    db.commit()
    db.refresh(db_item)

    return _serialize_item(
        db_item,
        custom_last_updated="Just now",
    )


# ============================================================
# ADJUST STOCK
# ============================================================

def adjust_stock(
    db: Session,
    item_id: int,
    payload: StockAdjustmentRequest,
    movement_type: str,
) -> Optional[Dict[str, Any]]:

    item = (
        db.query(InventoryItemModel)
        .filter(
            InventoryItemModel.id == item_id
        )
        .first()
    )

    if not item:
        return None

    if movement_type == "Stock In":
        item.quantity += payload.quantity

    elif movement_type == "Stock Out":
        item.quantity = max(
            0.0,
            item.quantity - payload.quantity,
        )

    item.status = calculate_status(
        item.quantity,
        item.minimum_level,
        item.reorder_level,
    )

    ref_prefix = (
        "GRN"
        if movement_type == "Stock In"
        else "MAINT"
    )

    reference = (
        payload.reference
        or (
            f"{ref_prefix}-"
            f"{datetime.now(timezone.utc).year}-"
            f"{item.id:03d}"
        )
    )

    movement = InventoryMovementModel(
        item_id=item.id,
        item_name=item.name,
        code=item.code,
        type=movement_type,
        quantity=payload.quantity,
        unit=item.unit,
        reference=reference,
        user=payload.user or "System User",
    )

    db.add(movement)

    db.commit()
    db.refresh(item)

    return _serialize_item(
        item,
        custom_last_updated="Just now",
    )


# ============================================================
# UPDATE INVENTORY ITEM
# ============================================================

def update_item(
    db: Session,
    item_id: int,
    item_data: InventoryItemCreate,
) -> Optional[Dict[str, Any]]:

    item = (
        db.query(InventoryItemModel)
        .filter(
            InventoryItemModel.id == item_id
        )
        .first()
    )

    if not item:
        return None

    item.code = item_data.code
    item.name = item_data.name
    item.category = item_data.category
    item.location = item_data.location
    item.unit = item_data.unit
    item.quantity = item_data.quantity
    item.minimum_level = item_data.minimumLevel
    item.reorder_level = item_data.reorderLevel
    item.unit_cost = item_data.unitCost
    item.supplier = item_data.supplier

    item.status = calculate_status(
        item.quantity,
        item.minimum_level,
        item.reorder_level,
    )

    db.commit()
    db.refresh(item)

    return _serialize_item(
        item,
        custom_last_updated="Just now",
    )


# ============================================================
# GET INVENTORY MOVEMENTS
# ============================================================

def get_movements(
    db: Session,
) -> List[Dict[str, Any]]:

    movements = (
        db.query(InventoryMovementModel)
        .order_by(
            InventoryMovementModel.created_at.desc()
        )
        .all()
    )

    result = []

    for movement in movements:

        created = (
            movement.created_at
            or datetime.now(timezone.utc)
        )

        result.append(
            {
                "id": movement.id,
                "item": movement.item_name,
                "code": movement.code,
                "type": movement.type,
                "quantity": movement.quantity,
                "unit": movement.unit,
                "reference": movement.reference,
                "user": movement.user,
                "date": created.strftime(
                    "%d %b %Y"
                ),
                "time": created.strftime(
                    "%H:%M"
                ),
            }
        )

    return result


# ============================================================
# DELETE INVENTORY ITEM
# ============================================================

def delete_item(
    db: Session,
    item_id: int,
) -> bool:

    item = (
        db.query(InventoryItemModel)
        .filter(
            InventoryItemModel.id == item_id
        )
        .first()
    )

    if not item:
        return False

    (
        db.query(InventoryMovementModel)
        .filter(
            InventoryMovementModel.item_id == item_id
        )
        .delete()
    )

    db.delete(item)

    db.commit()

    return True