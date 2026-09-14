from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy.orm import Session

from backend.core.database import get_db

from .schema import (
    SalesCreate,
    SalesDashboardResponse,
    SalesResponse,
    SalesSummaryResponse,
    SalesUpdate,
)
from .service import SalesService


router = APIRouter(
    prefix="/api/v1/sales",
    tags=["Sales Management"],
)


# =========================================================
# DASHBOARD
# =========================================================

@router.get(
    "/dashboard",
    response_model=SalesDashboardResponse,
)
def get_sales_dashboard(
    db: Session = Depends(get_db),
):
    return SalesService.get_dashboard(db)


# =========================================================
# SUMMARY
# =========================================================

@router.get(
    "/summary",
    response_model=SalesSummaryResponse,
)
def get_sales_summary(
    db: Session = Depends(get_db),
):
    return SalesService.get_summary(db)


# =========================================================
# LIST SALES
# =========================================================

@router.get(
    "",
    response_model=list[SalesResponse],
)
def get_sales(
    search: str | None = Query(
        default=None
    ),
    status_filter: str | None = Query(
        default=None,
        alias="status",
    ),
    db: Session = Depends(get_db),
):
    return SalesService.list_sales(
        db=db,
        search=search,
        status=status_filter,
    )


# =========================================================
# GET ONE SALE
# =========================================================

@router.get(
    "/{sale_id}",
    response_model=SalesResponse,
)
def get_sale(
    sale_id: int,
    db: Session = Depends(get_db),
):
    sale = SalesService.get_sale(
        db,
        sale_id,
    )

    if not sale:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sales transaction not found.",
        )

    return sale


# =========================================================
# CREATE SALE
# =========================================================

@router.post(
    "",
    response_model=SalesResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_sale(
    data: SalesCreate,
    db: Session = Depends(get_db),
):
    return SalesService.create_sale(
        db,
        data,
    )


# =========================================================
# UPDATE SALE
# =========================================================

@router.put(
    "/{sale_id}",
    response_model=SalesResponse,
)
def update_sale(
    sale_id: int,
    data: SalesUpdate,
    db: Session = Depends(get_db),
):
    sale = SalesService.update_sale(
        db,
        sale_id,
        data,
    )

    if not sale:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sales transaction not found.",
        )

    return sale


# =========================================================
# DELETE SALE
# =========================================================

@router.delete(
    "/{sale_id}",
)
def delete_sale(
    sale_id: int,
    db: Session = Depends(get_db),
):
    sale = SalesService.delete_sale(
        db,
        sale_id,
    )

    if not sale:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sales transaction not found.",
        )

    return {
        "message": (
            "Sales transaction "
            "deleted successfully."
        ),
        "id": sale_id,
    }