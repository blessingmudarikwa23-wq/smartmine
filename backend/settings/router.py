from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.core.database import get_db

from .schema import (
    SettingsResponse,
    SettingsUpdateRequest,
)
from .service import SettingsService


router = APIRouter(
    prefix="/api/v1/settings",
    tags=["Settings"],
)


# =========================================================
# GET SETTINGS
# =========================================================

@router.get(
    "",
    response_model=SettingsResponse,
)
def get_settings(
    db: Session = Depends(get_db),
):
    return SettingsService.get_settings(
        db=db,
    )


# =========================================================
# UPDATE SETTINGS
# =========================================================

@router.put(
    "",
    response_model=SettingsResponse,
)
def update_settings(
    data: SettingsUpdateRequest,
    db: Session = Depends(get_db),
):
    return SettingsService.update_settings(
        db=db,
        data=data,
    )


# =========================================================
# SYSTEM STATUS
# =========================================================

@router.get(
    "/status",
)
def get_settings_status(
    db: Session = Depends(get_db),
):
    return SettingsService.get_system_status(
        db=db,
    )