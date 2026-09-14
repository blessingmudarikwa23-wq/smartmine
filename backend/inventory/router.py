from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.core.database import get_db
from backend.inventory import schema
from backend.inventory import service


router = APIRouter(
    prefix="/api/inventory",
    tags=["Inventory"],
)


# ============================================================
# GET ALL INVENTORY ITEMS
# ============================================================

@router.get(
    "/items",
    response_model=List[schema.InventoryItemResponse],
)
def read_inventory_items(
    db: Session = Depends(get_db),
):
    return service.get_all_items(db)


# ============================================================
# GET SINGLE INVENTORY ITEM
# ============================================================

@router.get(
    "/items/{item_id}",
    response_model=schema.InventoryItemResponse,
)
def read_inventory_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    item = service.get_item_by_id(
        db,
        item_id,
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )

    return item


# ============================================================
# CREATE INVENTORY ITEM
# ============================================================

@router.post(
    "/items",
    response_model=schema.InventoryItemResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_inventory_item(
    item: schema.InventoryItemCreate,
    db: Session = Depends(get_db),
):
    return service.create_item(
        db,
        item,
    )


# ============================================================
# UPDATE INVENTORY ITEM
# ============================================================

@router.put(
    "/items/{item_id}",
    response_model=schema.InventoryItemResponse,
)
def update_inventory_item(
    item_id: int,
    item: schema.InventoryItemCreate,
    db: Session = Depends(get_db),
):
    updated_item = service.update_item(
        db,
        item_id,
        item,
    )

    if not updated_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )

    return updated_item


# ============================================================
# DELETE INVENTORY ITEM
# ============================================================

@router.delete(
    "/items/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_inventory_item(
    item_id: int,
    db: Session = Depends(get_db),
) -> None:

    success = service.delete_item(
        db,
        item_id,
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )

    return None


# ============================================================
# STOCK IN
# ============================================================

@router.post(
    "/items/{item_id}/stock-in",
    response_model=schema.InventoryItemResponse,
)
def stock_in(
    item_id: int,
    payload: schema.StockAdjustmentRequest,
    db: Session = Depends(get_db),
):
    updated_item = service.adjust_stock(
        db,
        item_id,
        payload,
        "Stock In",
    )

    if not updated_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )

    return updated_item


# ============================================================
# STOCK OUT
# ============================================================

@router.post(
    "/items/{item_id}/stock-out",
    response_model=schema.InventoryItemResponse,
)
def stock_out(
    item_id: int,
    payload: schema.StockAdjustmentRequest,
    db: Session = Depends(get_db),
):
    updated_item = service.adjust_stock(
        db,
        item_id,
        payload,
        "Stock Out",
    )

    if not updated_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )

    return updated_item


# ============================================================
# GET INVENTORY MOVEMENTS
# ============================================================

@router.get(
    "/movements",
    response_model=List[schema.InventoryMovementResponse],
)
def read_inventory_movements(
    db: Session = Depends(get_db),
):
    return service.get_movements(db)