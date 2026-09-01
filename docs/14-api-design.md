# 14 — API Design

## SmartMine
### Digital Operations Intelligence for Small-Scale Mining

**Document:** API Design  
**Version:** 1.0  
**Status:** Foundation Document  
**Research Context:** Zimbabwe  
**Primary Sector:** Small-Scale Mining  

---

## 1. Purpose

This document defines the API design principles for SmartMine.

The API will provide the communication layer between the frontend, backend services and database.

The basic architecture is:

    FRONTEND
       ↓
    REST API
       ↓
    FASTAPI BACKEND
       ↓
    SERVICES
       ↓
    DATABASE

The API should be consistent, secure, predictable and easy to maintain.

---

## 2. API Technology

SmartMine will use:

**FastAPI**

The API will follow REST principles and use:

**HTTP / HTTPS**

Data will primarily be exchanged using:

**JSON**

FastAPI will also provide automatically generated API documentation for development and testing.

---

## 3. API Design Principles

SmartMine APIs should follow these principles:

- Clear endpoint naming
- Consistent request structures
- Consistent response structures
- Appropriate HTTP methods
- Input validation
- Meaningful error responses
- Authentication
- Authorisation
- Versioning where required
- Separation of business logic from routes

The API should remain simple enough for the frontend team to integrate reliably.

---

## 4. API URL Structure

SmartMine APIs should use a consistent structure.

Example:

    /api/v1/equipment

    /api/v1/production

    /api/v1/crushing

    /api/v1/grinding

    /api/v1/maintenance

The version prefix allows future API changes without immediately breaking existing clients.

The exact versioning strategy will be finalised during implementation.

---

## 5. HTTP Methods

SmartMine will use standard HTTP methods.

### GET

Used to retrieve information.

    GET /api/v1/equipment

### POST

Used to create information.

    POST /api/v1/equipment

### PUT / PATCH

Used to update information.

    PUT /api/v1/equipment/{id}

### DELETE

Used to remove or deactivate information where appropriate.

    DELETE /api/v1/equipment/{id}

The preferred method will depend on the specific resource and business requirement.

---

## 6. Authentication

Protected SmartMine APIs shall require authentication.

A typical request flow is:

    USER
      ↓
    LOGIN
      ↓
    AUTHENTICATION
      ↓
    ACCESS TOKEN
      ↓
    API REQUEST
      ↓
    AUTHENTICATION CHECK
      ↓
    RESPONSE

Authentication technology may use secure token-based authentication.

Sensitive credentials must never be exposed through API responses or source code.

---

## 7. Authorisation

Authentication identifies the user.

Authorisation determines what the user can access.

The API should enforce role-based permissions.

Example:

    Mine Owner
        ↓
    Dashboard / Reports / Financial Data

    Supervisor
        ↓
    Operations / Production

    Equipment Operator
        ↓
    Assigned Equipment / Usage

    Store Officer
        ↓
    Inventory

API permissions must be enforced on the backend rather than relying only on frontend visibility.

---

## 8. Request Validation

All API input should be validated before processing.

Validation may include:

- Required fields
- Data types
- Numeric ranges
- Dates
- Quantities
- Units
- Valid identifiers
- Related records

Example:

    POST /api/v1/crushing

    Material: Required
    Input Quantity: Numeric
    Output Quantity: Numeric
    Crusher: Valid Equipment ID
    Operator: Valid User / Worker ID

Invalid requests should return clear validation errors.

---

## 9. Response Structure

API responses should follow consistent structures.

A successful response may contain:

    {
      "success": true,
      "data": {...}
    }

A collection response may contain:

    {
      "success": true,
      "data": [],
      "total": 0
    }

The exact response schema will be finalised during implementation.

Responses should provide only the information required by the client.

---

## 10. Error Handling

SmartMine APIs should use appropriate HTTP status codes.

Examples:

    200
    Successful request

    201
    Resource created

    400
    Invalid request

    401
    Authentication required

    403
    Access denied

    404
    Resource not found

    409
    Conflict

    422
    Validation error

    500
    Internal server error

Error responses should be understandable and should not expose sensitive technical information.

---

## 11. Core API Resources

The API will eventually provide endpoints for major SmartMine resources.

Potential resources include:

    /users
    /workers
    /shifts
    /mines
    /mining-areas
    /materials
    /equipment
    /extraction
    /material-movement
    /production
    /crushing
    /grinding
    /processing
    /maintenance
    /downtime
    /fuel
    /inventory
    /safety
    /expenses
    /sales
    /reports

Resources will be introduced progressively as functionality is developed.

---

## 12. Filtering, Searching and Pagination

List endpoints should support filtering where appropriate.

Examples:

    GET /api/v1/production?date=2026-01-01

    GET /api/v1/equipment?status=operational

    GET /api/v1/downtime?equipment_id=5

The API should support pagination for larger datasets.

Potential parameters include:

    page
    limit
    search
    sort
    date_from
    date_to

The exact query conventions should remain consistent across the API.

---

## 13. Operational Relationships

API resources should preserve important relationships.

For example:

    Extraction
        ↓
    Material Movement
        ↓
    Crushing
        ↓
    Grinding
        ↓
    Processing
        ↓
    Production

Equipment-related information may connect through:

    Equipment
       ↓
    Usage
       ↓
    Downtime
       ↓
    Maintenance
       ↓
    Fuel

The API should expose these relationships without creating unnecessary duplication of data.

---

## 14. API Documentation and Testing

SmartMine APIs should be documented using FastAPI's automatic documentation capabilities.

Developers should test:

- Authentication
- CRUD operations
- Validation
- Error handling
- Permissions
- Relationships
- Filtering
- Pagination

Testing should confirm that:

    REQUEST
       ↓
    API
       ↓
    SERVICE
       ↓
    DATABASE
       ↓
    RESPONSE

works correctly.

API endpoints should be tested before their corresponding frontend functionality is considered complete.

---

## 15. API Development Strategy

SmartMine APIs will be developed incrementally.

The process should be:

    FEATURE
       ↓
    WORKFLOW
       ↓
    DATABASE MODEL
       ↓
    SCHEMA
       ↓
    SERVICE
       ↓
    ROUTER
       ↓
    API TEST
       ↓
    FRONTEND INTEGRATION

For example:

    Crushing Feature
         ↓
    Crushing Model
         ↓
    Crushing Schema
         ↓
    Crushing Service
         ↓
    Crushing Router
         ↓
    JSON API Testing
         ↓
    Crushing Frontend

The API contract must remain the source of truth between the frontend and backend.

The guiding principle is:

> **Build the API around documented operational requirements, keep contracts consistent, validate everything, and test each module before moving to the next.**

This API design provides the foundation for:

**15 — UI/UX Guidelines**

which will define how SmartMine should look, feel and behave for its users.

---

# End of API Design
