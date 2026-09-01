# 12 — System Architecture

## SmartMine
### Digital Operations Intelligence for Small-Scale Mining

**Document:** System Architecture  
**Version:** 1.0  
**Status:** Foundation Document  
**Research Context:** Zimbabwe  
**Primary Sector:** Small-Scale Mining  

---

## 1. Architecture Purpose

This document defines the high-level technical architecture of SmartMine.

The architecture describes how the frontend, backend, database and future intelligence services will work together.

The architecture must support:

- Simple development
- Reliable data management
- Secure communication
- Clear separation of responsibilities
- Future scalability
- Mobile-friendly access
- Future offline capability

---

## 2. High-Level Architecture

SmartMine will follow a layered architecture:

    USER
      ↓
    FRONTEND
      ↓
    REST API
      ↓
    BACKEND
      ↓
    DATABASE

Additional services can be introduced later:

    ANALYTICS
    NOTIFICATIONS
    AI
    EXTERNAL INTEGRATIONS

These services should connect through controlled interfaces rather than bypassing the core application architecture.

---

## 3. User Layer

Users interact with SmartMine through a responsive web interface.

Primary users include:

- Mine Owners
- Site Managers
- Supervisors
- Equipment Operators
- Processing Workers
- Store Officers
- Administrators

The interface should provide role-appropriate functionality.

The user layer should focus on:

- Simple navigation
- Clear information
- Fast data entry
- Responsive design
- Operational dashboards

---

## 4. Frontend Layer

The frontend will be built using:

- React
- TypeScript
- Vite
- Tailwind CSS

The frontend will contain:

- Dashboard
- Navigation
- Forms
- Tables
- Charts
- Reports
- Alerts
- Operational screens

The frontend should communicate with the backend through APIs.

Business logic should not be unnecessarily duplicated inside frontend components.

---

## 5. API Layer

The API provides the communication boundary between the frontend and backend.

The API will use REST principles.

Typical operations will include:

    GET
    POST
    PUT / PATCH
    DELETE

Example:

    Frontend
       ↓
    GET /api/equipment
       ↓
    Backend
       ↓
    Database
       ↓
    Response
       ↓
    Frontend

API contracts should be documented and maintained consistently.

---

## 6. Backend Application Layer

The backend will use:

**Python + FastAPI**

The backend will coordinate:

- Authentication
- Validation
- Business logic
- Database operations
- Reporting
- Operational calculations
- Alerts
- API responses

The backend will act as the primary application logic layer.

---

## 7. Backend Module Structure

SmartMine should use modular backend organisation.

A module may follow:

    MODULE
      ├── models
      ├── schemas
      ├── service
      └── router

For example:

    Equipment
      ├── Equipment Model
      ├── Equipment Schemas
      ├── Equipment Service
      └── Equipment Router

This structure should be repeated consistently across major SmartMine modules.

---

## 8. Service Layer

The service layer will contain business logic.

Examples include:

- Calculating production totals
- Updating inventory balances
- Recording fuel consumption
- Processing equipment usage
- Creating maintenance alerts
- Calculating downtime
- Generating operational summaries

The general flow is:

    ROUTER
       ↓
    SERVICE
       ↓
    MODEL / DATABASE
       ↓
    RESULT
       ↓
    ROUTER
       ↓
    API RESPONSE

This keeps business logic separate from endpoint definitions.

---

## 9. Database Layer

SmartMine will use PostgreSQL as its primary database.

The database will contain connected operational entities such as:

- Users
- Workers
- Shifts
- Mining areas
- Materials
- Production
- Crushing
- Grinding
- Processing
- Equipment
- Maintenance
- Fuel
- Inventory
- Safety
- Expenses
- Sales

Relationships between these entities will allow SmartMine to build a connected operational picture.

---

## 10. Data Flow

A typical SmartMine transaction will follow:

    USER
      ↓
    FRONTEND FORM
      ↓
    API REQUEST
      ↓
    FASTAPI ROUTER
      ↓
    VALIDATION
      ↓
    SERVICE LOGIC
      ↓
    DATABASE
      ↓
    RESPONSE
      ↓
    FRONTEND
      ↓
    UPDATED UI

This consistent flow should be followed across the application.

---

## 11. Operational Data Relationships

SmartMine's architecture should preserve relationships between operational activities.

For example:

    EXTRACTION
        ↓
    MATERIAL
        ↓
    CRUSHING
        ↓
    GRINDING
        ↓
    PROCESSING
        ↓
    PRODUCTION

Supporting information can connect to these activities:

    EQUIPMENT
        ↕
    FUEL
        ↕
    MAINTENANCE
        ↕
    DOWNTIME
        ↕
    EXPENSES

These relationships are central to SmartMine's value.

---

## 12. Authentication and Authorisation

Authentication will verify who is using SmartMine.

Authorisation will determine what that user is allowed to do.

The architecture should support:

    USER
      ↓
    AUTHENTICATION
      ↓
    ROLE
      ↓
    PERMISSIONS
      ↓
    ALLOWED FEATURES

For example, an equipment operator may access equipment usage records without having access to financial administration.

Security controls will be expanded in:

**16 — Security**

---

## 13. Reporting, Analytics and Alerts

Operational data stored in the database will provide the foundation for reporting and analytics.

The architecture will support:

    OPERATIONAL DATA
          ↓
    CALCULATIONS
          ↓
    REPORTING
          ↓
    DASHBOARDS
          ↓
    ALERTS
          ↓
    ANALYTICS

Examples include:

- Production trends
- Equipment downtime
- Fuel consumption
- Maintenance costs
- Inventory levels
- Operating costs

Analytics should use reliable stored data rather than unsupported assumptions.

---

## 14. Future Offline and Intelligence Architecture

Future versions may introduce offline capability.

Potential architecture:

    MOBILE / WEB CLIENT
          ↓
    LOCAL STORAGE
          ↓
    OFFLINE RECORDS
          ↓
    INTERNET AVAILABLE
          ↓
    SYNCHRONISATION
          ↓
    SMARTMINE API
          ↓
    DATABASE

Future intelligence services may follow:

    SMARTMINE DATABASE
          ↓
    ANALYTICS ENGINE
          ↓
    AI / ML SERVICES
          ↓
    INSIGHTS
          ↓
    SMARTMINE USER

These capabilities should be introduced after the core platform is stable.

---

## 15. Architecture Principles

SmartMine architecture will follow these principles:

### Separation of Concerns

Each layer should have a clear responsibility.

### API-First Communication

Frontend and backend should communicate through defined APIs.

### Data Integrity

Operational data must remain accurate and connected.

### Security by Design

Authentication and authorisation should be considered from the beginning.

### Modular Development

Major features should be developed as manageable modules.

### Scalability

The architecture should allow the platform to grow without unnecessary redesign.

### Simplicity

The architecture should remain understandable and maintainable.

### Data Before Intelligence

Analytics and AI should depend on reliable operational data.

The overall architecture is:

    USERS
       ↓
    REACT FRONTEND
       ↓
    REST API
       ↓
    FASTAPI BACKEND
       ↓
    SERVICES
       ↓
    SQLALCHEMY
       ↓
    POSTGRESQL
       ↓
    OPERATIONAL DATA
       ↓
    REPORTING / ANALYTICS
       ↓
    FUTURE AI

This architecture provides the technical foundation for:

**13 — Database Design**

which will define the data entities, relationships and structure required to support SmartMine.

---

# End of System Architecture
