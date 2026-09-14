from sqlalchemy.orm import Session

from .model import Settings
from .schema import (
    NotificationSettings,
    SettingsResponse,
    SettingsUpdateRequest,
)


class SettingsService:

    # =========================================================
    # GET SETTINGS
    # =========================================================

    @staticmethod
    def get_settings(
        db: Session,
    ) -> SettingsResponse:

        settings = (
            db.query(Settings)
            .order_by(Settings.id.asc())
            .first()
        )

        if settings is None:
            settings = Settings()

            db.add(settings)
            db.commit()
            db.refresh(settings)

        return SettingsResponse(
            id=settings.id,

            mineName=settings.mine_name,
            location=settings.location,
            timezone=settings.timezone,

            currency=settings.currency,
            dateFormat=settings.date_format,
            temperatureUnit=settings.temperature_unit,
            productionUnit=settings.production_unit,
            language=settings.language,

            compactMode=settings.compact_mode,

            notifications=NotificationSettings(
                production=settings.notification_production,
                equipment=settings.notification_equipment,
                safety=settings.notification_safety,
                inventory=settings.notification_inventory,
                finance=settings.notification_finance,
            ),

            emailAlerts=settings.email_alerts,
            twoFactor=settings.two_factor,

            createdAt=settings.created_at,
            updatedAt=settings.updated_at,
        )

    # =========================================================
    # UPDATE SETTINGS
    # =========================================================

    @staticmethod
    def update_settings(
        db: Session,
        data: SettingsUpdateRequest,
    ) -> SettingsResponse:

        settings = (
            db.query(Settings)
            .order_by(Settings.id.asc())
            .first()
        )

        if settings is None:
            settings = Settings()
            db.add(settings)

        # -----------------------------------------------------
        # MINE
        # -----------------------------------------------------

        settings.mine_name = data.mineName
        settings.location = data.location
        settings.timezone = data.timezone

        # -----------------------------------------------------
        # GENERAL
        # -----------------------------------------------------

        settings.currency = data.currency
        settings.date_format = data.dateFormat
        settings.temperature_unit = (
            data.temperatureUnit
        )
        settings.production_unit = (
            data.productionUnit
        )
        settings.language = data.language
        settings.compact_mode = data.compactMode

        # -----------------------------------------------------
        # NOTIFICATIONS
        # -----------------------------------------------------

        settings.notification_production = (
            data.notifications.production
        )

        settings.notification_equipment = (
            data.notifications.equipment
        )

        settings.notification_safety = (
            data.notifications.safety
        )

        settings.notification_inventory = (
            data.notifications.inventory
        )

        settings.notification_finance = (
            data.notifications.finance
        )

        # -----------------------------------------------------
        # SECURITY
        # -----------------------------------------------------

        settings.email_alerts = data.emailAlerts
        settings.two_factor = data.twoFactor

        db.commit()
        db.refresh(settings)

        return SettingsService.get_settings(
            db=db,
        )

    # =========================================================
    # SYSTEM STATUS
    # =========================================================

    @staticmethod
    def get_system_status(
        db: Session,
    ) -> dict:

        settings = (
            db.query(Settings)
            .order_by(Settings.id.asc())
            .first()
        )

        if settings is None:
            SettingsService.get_settings(
                db=db,
            )

        return {
            "status": "operational",
            "platform": "SmartMine",
            "version": "1.0.0",
            "environment": "Production",
            "database": "connected",
            "message": "SmartMine is operational",
        }