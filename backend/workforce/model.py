from sqlalchemy import Column, Integer, String, Date
from backend.core.database import Base


class Worker(Base):
    __tablename__ = "workers"

    id = Column(Integer, primary_key=True, index=True)

    employee_number = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    name = Column(String(150), nullable=False)

    role = Column(String(150), nullable=False)

    department = Column(String(100), nullable=False)

    shift = Column(
        String(30),
        nullable=False,
        default="Day Shift",
    )

    status = Column(
        String(30),
        nullable=False,
        default="Present",
    )

    phone = Column(String(50), nullable=False)

    start_date = Column(Date, nullable=False)

    safety_status = Column(
        String(50),
        nullable=False,
        default="Compliant",
    )