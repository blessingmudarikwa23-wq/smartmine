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
    FinanceDashboardResponse,
    FinanceSummaryResponse,
    FinanceTransactionCreate,
    FinanceTransactionResponse,
    FinanceTransactionUpdate,
)
from .service import FinanceService


router = APIRouter(
    prefix="/api/v1/finance",
    tags=["Finance Management"],
)


@router.get(
    "/dashboard",
    response_model=FinanceDashboardResponse,
)
def get_finance_dashboard(
    db: Session = Depends(get_db),
):
    return FinanceService.get_dashboard(db)


@router.get(
    "/summary",
    response_model=FinanceSummaryResponse,
)
def get_finance_summary(
    db: Session = Depends(get_db),
):
    return FinanceService.get_summary(db)


@router.get(
    "/transactions",
    response_model=list[FinanceTransactionResponse],
)
def get_transactions(
    search: str | None = Query(
        default=None,
    ),
    status_filter: str | None = Query(
        default=None,
        alias="status",
    ),
    transaction_type: str | None = Query(
        default=None,
        alias="type",
    ),
    category: str | None = Query(
        default=None,
    ),
    db: Session = Depends(get_db),
):
    return FinanceService.list_transactions(
        db=db,
        search=search,
        status=status_filter,
        transaction_type=transaction_type,
        category=category,
    )


@router.get(
    "/transactions/{transaction_id}",
    response_model=FinanceTransactionResponse,
)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
):
    transaction = (
        FinanceService.get_transaction(
            db,
            transaction_id,
        )
    )

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Finance transaction not found.",
        )

    return transaction


@router.post(
    "/transactions",
    response_model=FinanceTransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_transaction(
    data: FinanceTransactionCreate,
    db: Session = Depends(get_db),
):
    return FinanceService.create_transaction(
        db,
        data,
    )


@router.put(
    "/transactions/{transaction_id}",
    response_model=FinanceTransactionResponse,
)
def update_transaction(
    transaction_id: int,
    data: FinanceTransactionUpdate,
    db: Session = Depends(get_db),
):
    transaction = (
        FinanceService.update_transaction(
            db,
            transaction_id,
            data,
        )
    )

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Finance transaction not found.",
        )

    return transaction


@router.delete(
    "/transactions/{transaction_id}",
)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
):
    transaction = (
        FinanceService.delete_transaction(
            db,
            transaction_id,
        )
    )

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Finance transaction not found.",
        )

    return {
        "message": (
            "Finance transaction "
            "deleted successfully."
        ),
        "id": transaction_id,
    }