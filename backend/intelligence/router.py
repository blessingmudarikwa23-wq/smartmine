from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.core.database import get_db

from .schema import (
    IntelligenceAskRequest,
    IntelligenceAskResponse,
    IntelligenceDashboardResponse,
    IntelligenceInsightResponse,
    MineSnapshotResponse,
)
from .service import IntelligenceService


router = APIRouter(
    prefix="/api/v1/intelligence",
    tags=["Smart Intelligence"],
)


@router.get(
    "/dashboard",
    response_model=IntelligenceDashboardResponse,
)
def get_intelligence_dashboard(
    db: Session = Depends(get_db),
):
    return IntelligenceService.get_dashboard(
        db=db,
    )


@router.get(
    "/snapshot",
    response_model=MineSnapshotResponse,
)
def get_intelligence_snapshot(
    db: Session = Depends(get_db),
):
    return IntelligenceService.get_snapshot(
        db=db,
    )


@router.get(
    "/insights",
    response_model=list[IntelligenceInsightResponse],
)
def get_intelligence_insights(
    db: Session = Depends(get_db),
):
    snapshot = IntelligenceService.get_snapshot(
        db=db,
    )

    return IntelligenceService.get_insights(
        snapshot=snapshot,
    )


@router.post(
    "/ask",
    response_model=IntelligenceAskResponse,
)
def ask_intelligence(
    data: IntelligenceAskRequest,
    db: Session = Depends(get_db),
):
    answer = IntelligenceService.answer_question(
        db=db,
        question=data.question,
    )

    return IntelligenceAskResponse(
        answer=answer,
    )