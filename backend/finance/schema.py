from typing import Literal

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


TransactionType = Literal[
    "Expense",
    "Income",
]

ExpenseCategory = Literal[
    "Fuel",
    "Equipment",
    "Processing",
    "Workforce",
    "Inventory",
    "Safety",
    "Transport",
    "Utilities",
    "Other",
]

TransactionStatus = Literal[
    "Paid",
    "Pending",
    "Overdue",
]


class FinanceTransactionBase(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    date: str

    description: str

    category: ExpenseCategory

    type: TransactionType

    amount: float

    status: TransactionStatus

    supplier: str

    recorded_by: str = Field(
        validation_alias=AliasChoices(
            "recordedBy",
            "recorded_by",
        ),
        serialization_alias="recordedBy",
    )


class FinanceTransactionCreate(FinanceTransactionBase):
    reference: str | None = None


class FinanceTransactionUpdate(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    date: str | None = None

    description: str | None = None

    category: ExpenseCategory | None = None

    type: TransactionType | None = None

    amount: float | None = None

    status: TransactionStatus | None = None

    supplier: str | None = None

    recorded_by: str | None = Field(
        default=None,
        validation_alias=AliasChoices(
            "recordedBy",
            "recorded_by",
        ),
        serialization_alias="recordedBy",
    )


class FinanceTransactionResponse(FinanceTransactionBase):
    id: int
    reference: str


class FinanceSummaryResponse(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    total_revenue: float = Field(
        validation_alias=AliasChoices(
            "totalRevenue",
            "total_revenue",
        ),
        serialization_alias="totalRevenue",
    )

    total_expenses: float = Field(
        validation_alias=AliasChoices(
            "totalExpenses",
            "total_expenses",
        ),
        serialization_alias="totalExpenses",
    )

    net_position: float = Field(
        validation_alias=AliasChoices(
            "netPosition",
            "net_position",
        ),
        serialization_alias="netPosition",
    )

    pending_amount: float = Field(
        validation_alias=AliasChoices(
            "pendingAmount",
            "pending_amount",
        ),
        serialization_alias="pendingAmount",
    )

    overdue_count: int = Field(
        validation_alias=AliasChoices(
            "overdueCount",
            "overdue_count",
        ),
        serialization_alias="overdueCount",
    )

    transaction_count: int = Field(
        validation_alias=AliasChoices(
            "transactionCount",
            "transaction_count",
        ),
        serialization_alias="transactionCount",
    )


class FinanceDashboardResponse(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    summary: FinanceSummaryResponse

    transactions: list[FinanceTransactionResponse]