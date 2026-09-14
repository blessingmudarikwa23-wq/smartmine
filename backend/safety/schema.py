from typing import Literal

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


# ==========================================================
# TYPE DEFINITIONS
# ==========================================================

IncidentSeverity = Literal[
    "Low",
    "Medium",
    "High",
    "Critical",
]

IncidentStatus = Literal[
    "Open",
    "Under Investigation",
    "Resolved",
]

IncidentType = Literal[
    "Incident",
    "Near Miss",
    "Unsafe Condition",
    "Environmental",
]

InspectionStatus = Literal[
    "Completed",
    "Scheduled",
    "Overdue",
]

ActionPriority = Literal[
    "Low",
    "Medium",
    "High",
]

ActionStatus = Literal[
    "Open",
    "In Progress",
    "Completed",
]


# ==========================================================
# SAFETY INCIDENTS
# ==========================================================

class SafetyIncidentBase(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    date: str
    time: str
    type: IncidentType
    category: str
    location: str
    description: str
    severity: IncidentSeverity
    status: IncidentStatus

    reported_by: str = Field(
        validation_alias=AliasChoices(
            "reportedBy",
            "reported_by",
        ),
        serialization_alias="reportedBy",
    )

    injured_persons: int = Field(
        validation_alias=AliasChoices(
            "injuredPersons",
            "injured_persons",
        ),
        serialization_alias="injuredPersons",
    )

    corrective_action: str = Field(
        validation_alias=AliasChoices(
            "correctiveAction",
            "corrective_action",
        ),
        serialization_alias="correctiveAction",
    )


class SafetyIncidentCreate(SafetyIncidentBase):
    pass


class SafetyIncidentUpdate(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    date: str | None = None
    time: str | None = None
    type: IncidentType | None = None
    category: str | None = None
    location: str | None = None
    description: str | None = None
    severity: IncidentSeverity | None = None
    status: IncidentStatus | None = None

    reported_by: str | None = Field(
        default=None,
        validation_alias=AliasChoices(
            "reportedBy",
            "reported_by",
        ),
        serialization_alias="reportedBy",
    )

    injured_persons: int | None = Field(
        default=None,
        validation_alias=AliasChoices(
            "injuredPersons",
            "injured_persons",
        ),
        serialization_alias="injuredPersons",
    )

    corrective_action: str | None = Field(
        default=None,
        validation_alias=AliasChoices(
            "correctiveAction",
            "corrective_action",
        ),
        serialization_alias="correctiveAction",
    )


class SafetyIncidentResponse(SafetyIncidentBase):
    id: int
    reference: str


# ==========================================================
# SAFETY INSPECTIONS
# ==========================================================

class SafetyInspectionBase(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    title: str
    area: str
    inspector: str
    date: str
    status: InspectionStatus
    findings: int
    icon: str


class SafetyInspectionCreate(SafetyInspectionBase):
    pass


class SafetyInspectionUpdate(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    title: str | None = None
    area: str | None = None
    inspector: str | None = None
    date: str | None = None
    status: InspectionStatus | None = None
    findings: int | None = None
    icon: str | None = None


class SafetyInspectionResponse(SafetyInspectionBase):
    id: int


# ==========================================================
# CORRECTIVE ACTIONS
# ==========================================================

class SafetyActionBase(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    title: str
    area: str
    owner: str

    due_date: str = Field(
        validation_alias=AliasChoices(
            "dueDate",
            "due_date",
        ),
        serialization_alias="dueDate",
    )

    priority: ActionPriority
    status: ActionStatus


class SafetyActionCreate(SafetyActionBase):
    pass


class SafetyActionUpdate(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    title: str | None = None
    area: str | None = None
    owner: str | None = None

    due_date: str | None = Field(
        default=None,
        validation_alias=AliasChoices(
            "dueDate",
            "due_date",
        ),
        serialization_alias="dueDate",
    )

    priority: ActionPriority | None = None
    status: ActionStatus | None = None


class SafetyActionResponse(SafetyActionBase):
    id: int


# ==========================================================
# SAFETY SUMMARY
# ==========================================================

class SafetySummaryResponse(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    total_incidents: int = Field(
        validation_alias=AliasChoices(
            "totalIncidents",
            "total_incidents",
        ),
        serialization_alias="totalIncidents",
    )

    open_incidents: int = Field(
        validation_alias=AliasChoices(
            "openIncidents",
            "open_incidents",
        ),
        serialization_alias="openIncidents",
    )

    resolved_incidents: int = Field(
        validation_alias=AliasChoices(
            "resolvedIncidents",
            "resolved_incidents",
        ),
        serialization_alias="resolvedIncidents",
    )

    under_investigation: int = Field(
        validation_alias=AliasChoices(
            "underInvestigation",
            "under_investigation",
        ),
        serialization_alias="underInvestigation",
    )

    high_risk_incidents: int = Field(
        validation_alias=AliasChoices(
            "highRiskIncidents",
            "high_risk_incidents",
        ),
        serialization_alias="highRiskIncidents",
    )

    critical_incidents: int = Field(
        validation_alias=AliasChoices(
            "criticalIncidents",
            "critical_incidents",
        ),
        serialization_alias="criticalIncidents",
    )

    near_misses: int = Field(
        validation_alias=AliasChoices(
            "nearMisses",
            "near_misses",
        ),
        serialization_alias="nearMisses",
    )

    injured_persons: int = Field(
        validation_alias=AliasChoices(
            "injuredPersons",
            "injured_persons",
        ),
        serialization_alias="injuredPersons",
    )

    resolution_rate: float = Field(
        validation_alias=AliasChoices(
            "resolutionRate",
            "resolution_rate",
        ),
        serialization_alias="resolutionRate",
    )

    category_counts: dict[str, int] = Field(
        validation_alias=AliasChoices(
            "categoryCounts",
            "category_counts",
        ),
        serialization_alias="categoryCounts",
    )


# ==========================================================
# SAFETY DASHBOARD
# ==========================================================

class SafetyDashboardResponse(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    summary: SafetySummaryResponse
    incidents: list[SafetyIncidentResponse]
    inspections: list[SafetyInspectionResponse]
    actions: list[SafetyActionResponse]