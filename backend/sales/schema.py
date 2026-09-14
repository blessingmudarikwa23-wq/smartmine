from typing import Literal

from pydantic import (
    AliasChoices,
    BaseModel,
    ConfigDict,
    Field,
)


SaleProduct = Literal[
    "Gold",
    "Gold Concentrate",
    "Copper",
    "Chrome",
    "Other",
]

SaleStatus = Literal[
    "Completed",
    "Pending",
    "Overdue",
]


class SalesBase(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    buyer: str = Field(
        min_length=1,
        max_length=255,
    )

    product: SaleProduct

    quantity: float = Field(
        gt=0,
    )

    unit: str = Field(
        min_length=1,
        max_length=20,
    )

    purity: str = Field(
        default="Not recorded",
        max_length=100,
    )

    amount: float = Field(
        gt=0,
    )

    status: SaleStatus = "Pending"

    payment_method: str = Field(
        validation_alias=AliasChoices(
            "paymentMethod",
            "payment_method",
        ),
        serialization_alias="paymentMethod",
        default="Bank Transfer",
        max_length=100,
    )


class SalesCreate(SalesBase):
    pass


class SalesUpdate(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    buyer: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    product: SaleProduct | None = None

    quantity: float | None = Field(
        default=None,
        gt=0,
    )

    unit: str | None = Field(
        default=None,
        min_length=1,
        max_length=20,
    )

    purity: str | None = Field(
        default=None,
        max_length=100,
    )

    amount: float | None = Field(
        default=None,
        gt=0,
    )

    status: SaleStatus | None = None

    payment_method: str | None = Field(
        default=None,
        validation_alias=AliasChoices(
            "paymentMethod",
            "payment_method",
        ),
        serialization_alias="paymentMethod",
        max_length=100,
    )


class SalesResponse(SalesBase):
    id: int

    reference: str

    date: str

    recorded_by: str = Field(
        validation_alias=AliasChoices(
            "recordedBy",
            "recorded_by",
        ),
        serialization_alias="recordedBy",
    )


class SalesSummaryResponse(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    total_sales: int = Field(
        validation_alias=AliasChoices(
            "totalSales",
            "total_sales",
        ),
        serialization_alias="totalSales",
    )

    completed_sales: int = Field(
        validation_alias=AliasChoices(
            "completedSales",
            "completed_sales",
        ),
        serialization_alias="completedSales",
    )

    pending_sales: int = Field(
        validation_alias=AliasChoices(
            "pendingSales",
            "pending_sales",
        ),
        serialization_alias="pendingSales",
    )

    overdue_sales: int = Field(
        validation_alias=AliasChoices(
            "overdueSales",
            "overdue_sales",
        ),
        serialization_alias="overdueSales",
    )

    completed_revenue: float = Field(
        validation_alias=AliasChoices(
            "completedRevenue",
            "completed_revenue",
        ),
        serialization_alias="completedRevenue",
    )

    pending_amount: float = Field(
        validation_alias=AliasChoices(
            "pendingAmount",
            "pending_amount",
        ),
        serialization_alias="pendingAmount",
    )

    overdue_amount: float = Field(
        validation_alias=AliasChoices(
            "overdueAmount",
            "overdue_amount",
        ),
        serialization_alias="overdueAmount",
    )

    average_sale: float = Field(
        validation_alias=AliasChoices(
            "averageSale",
            "average_sale",
        ),
        serialization_alias="averageSale",
    )

    active_buyers: int = Field(
        validation_alias=AliasChoices(
            "activeBuyers",
            "active_buyers",
        ),
        serialization_alias="activeBuyers",
    )


class SalesProductPerformance(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    product: str

    revenue: float

    transactions: int

    percentage: float


class SalesBuyerPerformance(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    buyer: str

    revenue: float

    transactions: int


class SalesDashboardResponse(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    summary: SalesSummaryResponse

    sales: list[SalesResponse]

    product_performance: list[SalesProductPerformance] = Field(
        validation_alias=AliasChoices(
            "productPerformance",
            "product_performance",
        ),
        serialization_alias="productPerformance",
    )

    buyer_performance: list[SalesBuyerPerformance] = Field(
        validation_alias=AliasChoices(
            "buyerPerformance",
            "buyer_performance",
        ),
        serialization_alias="buyerPerformance",
    )