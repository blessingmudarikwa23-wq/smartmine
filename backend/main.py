from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from backend.core.config import settings
from backend.core.database import Base, engine
from backend.core.logging import logger

from backend.dashboard.router import router as dashboard_router
from backend.equipment.router import router as equipment_router
from backend.fuel.router import router as fuel_router
from backend.intelligence.router import router as intelligence_router
from backend.inventory.router import router as inventory_router
from backend.mine_operations.router import router as mine_operations_router
from backend.processing.router import router as processing_router
from backend.reports.router import router as reports_router
from backend.safety.router import router as safety_router
from backend.sales.router import router as sales_router
from backend.settings.router import router as settings_router
from backend.workforce.router import router as workforce_router


# ============================================================
# APPLICATION LIFESPAN
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting SmartMine backend...")

    try:
        Base.metadata.create_all(bind=engine)

        logger.info("Database initialized successfully.")

    except Exception as exc:
        logger.exception(
            "Database initialization failed: %s",
            exc,
        )
        raise

    logger.info("SmartMine backend started successfully.")

    yield

    logger.info("SmartMine backend shutting down...")


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "Backend API for SmartMine Operations Intelligence. "
        "A digital operations platform for mining production, "
        "processing, equipment, workforce, inventory, fuel, "
        "safety, finance, sales, reports, settings and "
        "operational intelligence."
    ),
    lifespan=lifespan,
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# API ROUTERS
# ============================================================

# Mine Operations
app.include_router(
    mine_operations_router,
    prefix=settings.api_prefix,
)

# Dashboard
app.include_router(
    dashboard_router,
    prefix=settings.api_prefix,
)

# Processing
app.include_router(
    processing_router,
    prefix=settings.api_prefix,
)

# Equipment
app.include_router(
    equipment_router,
    prefix="/api/v1",
)

# Workforce
app.include_router(
    workforce_router,
    prefix="/api/v1",
)

# Inventory
app.include_router(
    inventory_router,
)

# Fuel
app.include_router(
    fuel_router,
)

# Safety
app.include_router(
    safety_router,
)

# Reports
app.include_router(
    reports_router,
)

# Sales
app.include_router(
    sales_router,
)

# Smart Intelligence
app.include_router(
    intelligence_router,
)

# Settings
app.include_router(
    settings_router,
)


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():
    return {
        "application": settings.app_name,
        "version": settings.app_version,
        "status": "online",
    }


# ============================================================
# HEALTH ENDPOINT
# ============================================================

@app.get("/health")
def health():
    database_status = "healthy"

    try:
        with engine.connect() as connection:
            connection.execute(
                text("SELECT 1")
            )

    except Exception as exc:
        logger.error(
            "Database health check failed: %s",
            exc,
        )

        database_status = "unhealthy"

    return {
        "status": (
            "healthy"
            if database_status == "healthy"
            else "degraded"
        ),
        "application": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "database": database_status,
    }