from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class NotificationSettings(BaseModel):
    production: bool = True
    equipment: bool = True
    safety: bool = True
    inventory: bool = True
    finance: bool = False


class SettingsResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int

    mineName: str
    location: str
    timezone: str

    currency: str
    dateFormat: str
    temperatureUnit: str
    productionUnit: str
    language: str

    compactMode: bool

    notifications: NotificationSettings

    emailAlerts: bool
    twoFactor: bool

    createdAt: datetime
    updatedAt: datetime


class SettingsUpdateRequest(BaseModel):
    mineName: str = Field(
        min_length=1,
        max_length=255,
    )

    location: str = Field(
        min_length=1,
        max_length=255,
    )

    timezone: str = Field(
        min_length=1,
        max_length=100,
    )

    currency: str = Field(
        min_length=1,
        max_length=10,
    )

    dateFormat: str = Field(
        min_length=1,
        max_length=30,
    )

    temperatureUnit: str = Field(
        min_length=1,
        max_length=30,
    )

    productionUnit: str = Field(
        min_length=1,
        max_length=30,
    )

    language: str = Field(
        min_length=1,
        max_length=50,
    )

    compactMode: bool = False

    notifications: NotificationSettings = (
        NotificationSettings()
    )

    emailAlerts: bool = True

    twoFactor: bool = False