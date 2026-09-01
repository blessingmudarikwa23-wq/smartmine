# 05 — User Workflows

## SmartMine
### Digital Operations Intelligence for Small-Scale Mining

**Document:** User Workflows  
**Version:** 1.0  
**Status:** Foundation Document  
**Research Context:** Zimbabwe  
**Primary Sector:** Small-Scale Mining  

---

## 1. Purpose

This document defines the main operational workflows that SmartMine should support.

The workflows are based on the principle that SmartMine must reflect how a small-scale mining operation actually works.

The platform should connect people, activities, equipment, materials and operational records.

The overall workflow is:

    USERS
      ↓
    DAILY ACTIVITIES
      ↓
    OPERATIONAL RECORDS
      ↓
    SMARTMINE
      ↓
    MONITORING
      ↓
    ANALYSIS
      ↓
    DECISIONS

---

## 2. Daily Mine Operations Workflow

The daily operational workflow begins when a shift starts.

    Shift Starts
        ↓
    Workers Assigned
        ↓
    Mining Areas Confirmed
        ↓
    Equipment Checked
        ↓
    Activities Begin
        ↓
    Production Recorded
        ↓
    Problems Recorded
        ↓
    Shift Completed
        ↓
    Daily Summary

SmartMine should provide a simple way to capture the important events occurring during the day.

---

## 3. Shift Management Workflow

A shift should connect workers, activities and operational areas.

    Create Shift
        ↓
    Assign Workers
        ↓
    Assign Work Areas
        ↓
    Assign Equipment
        ↓
    Start Shift
        ↓
    Record Activities
        ↓
    Record Issues
        ↓
    End Shift
        ↓
    Review Shift

The workflow should remain simple enough for supervisors to use from a mobile device.

---

## 4. Extraction Workflow

The extraction workflow records material removed from the mining area.

    Mining Area
        ↓
    Extraction Activity
        ↓
    Material Identified
        ↓
    Quantity Recorded
        ↓
    Shift Recorded
        ↓
    Worker / Equipment Recorded
        ↓
    Material Movement

Information may include:

- Date
- Mining area
- Material
- Quantity
- Unit
- Shift
- Workers
- Equipment
- Notes

The system should preserve the relationship between extraction and subsequent material movement.

---

## 5. Material Movement Workflow

After extraction, material may be transported or moved to another location.

    Extracted Material
          ↓
    Transport / Movement
          ↓
    Destination
          ↓
    Quantity
          ↓
    Equipment / Vehicle
          ↓
    Movement Record

The destination may include:

- Stockpile
- Crusher
- Processing area
- Temporary storage
- Other operational location

This creates visibility into where extracted material goes.

---

## 6. Crushing Workflow

The crushing workflow records material entering and leaving crushing operations.

    Material Received
          ↓
    Crusher Selected
          ↓
    Operator Assigned
          ↓
    Crushing Begins
          ↓
    Operating Hours Recorded
          ↓
    Downtime Recorded
          ↓
    Output Recorded
          ↓
    Crushing Completed

Possible information includes:

- Crusher
- Operator
- Shift
- Input quantity
- Output quantity
- Operating hours
- Downtime
- Downtime reason
- Fuel or energy
- Notes

---

## 7. Grinding Workflow

The grinding workflow follows crushing where applicable.

    Material Received
          ↓
    Grinding Mill Selected
          ↓
    Operator Assigned
          ↓
    Grinding Begins
          ↓
    Material Processed
          ↓
    Operating Hours
          ↓
    Downtime
          ↓
    Output Recorded
          ↓
    Grinding Completed

The system should connect grinding records to the relevant material and preceding processing stage where the data supports that relationship.

---

## 8. Processing and Recovery Workflow

Processing converts prepared material into an operationally recorded mineral output or recovery result.

    Processing Batch Created
          ↓
    Material Input Recorded
          ↓
    Processing Method Recorded
          ↓
    Processing Begins
          ↓
    Quantity Processed
          ↓
    Output Recorded
          ↓
    Recovery Measurement
          ↓
    Batch Completed

The exact workflow should remain configurable because mineral-processing methods differ between operations.

SmartMine should record measured operational information without assuming laboratory-grade or geological measurements.

---

## 9. Production Recording Workflow

Production records bring together the results of mining and processing activities.

    Production Activity
          ↓
    Material
          ↓
    Quantity
          ↓
    Unit
          ↓
    Date / Shift
          ↓
    Equipment / Operator
          ↓
    Production Record
          ↓
    Dashboard / Reports

Production information should support historical comparisons and operational analysis.

---

## 10. Equipment Usage Workflow

Equipment usage should be recorded as part of normal operations.

    Equipment Selected
          ↓
    Operator Assigned
          ↓
    Operating Hours
          ↓
    Activity
          ↓
    Material Processed
          ↓
    Fuel / Energy
          ↓
    Downtime
          ↓
    Equipment Usage Record

This allows SmartMine to connect equipment activity with production and resource consumption.

---

## 11. Maintenance Workflow

Maintenance should connect equipment condition, operating hours and maintenance activities.

    Equipment
        ↓
    Operating Hours
        ↓
    Maintenance Due
        ↓
    Maintenance Request
        ↓
    Maintenance Activity
        ↓
    Parts Used
        ↓
    Cost Recorded
        ↓
    Equipment Returned to Operation

Maintenance history should be retained for future analysis.

The system should support both planned and corrective maintenance records.

---

## 12. Fuel and Inventory Workflow

Fuel and inventory should follow a controlled operational flow.

Fuel:

    Fuel Received
        ↓
    Fuel Stock
        ↓
    Fuel Issued
        ↓
    Equipment
        ↓
    Consumption
        ↓
    Remaining Stock

Inventory:

    Item Received
        ↓
    Stock
        ↓
    Item Issued
        ↓
    Operational Use
        ↓
    Remaining Stock

The system should support minimum-stock alerts and historical transaction records.

---

## 13. Safety Workflow

Safety information should be captured throughout daily operations.

    Safety Inspection
          ↓
    Hazard / Observation
          ↓
    Record Finding
          ↓
    Corrective Action
          ↓
    Responsible Person
          ↓
    Action Completed
          ↓
    Verification

The workflow may include:

- Daily inspections
- PPE checks
- Equipment inspections
- Hazards
- Incidents
- Near misses
- Corrective actions

SmartMine should support safety visibility without replacing professional safety management.

---

## 14. Expense and Sales Workflow

Operational expenses should be recorded against meaningful categories.

    Expense Occurs
          ↓
    Category Selected
          ↓
    Amount Recorded
          ↓
    Date
          ↓
    Description
          ↓
    Operational Reference
          ↓
    Expense Record
          ↓
    Cost Analysis

Sales can follow:

    Mineral Produced
          ↓
    Available for Sale
          ↓
    Customer
          ↓
    Sale Recorded
          ↓
    Quantity
          ↓
    Price
          ↓
    Revenue

The system should use South African Rand only if the operation is configured for ZAR; currency should remain configurable for future expansion.

---

## 15. End-to-End SmartMine Workflow

The complete SmartMine operational workflow is:

    EXTRACTION
         ↓
    MATERIAL MOVEMENT
         ↓
    CRUSHING
         ↓
    GRINDING
         ↓
    PROCESSING
         ↓
    RECOVERY
         ↓
    PRODUCTION
         ↓
    SALES

Supporting workflows operate around the production chain:

    EQUIPMENT
    FUEL
    MAINTENANCE
    WORKFORCE
    INVENTORY
    SAFETY
    EXPENSES

All workflows should ultimately contribute to one connected operational picture.

The long-term SmartMine workflow is:

    CAPTURE
       ↓
    CONNECT
       ↓
    MONITOR
       ↓
    ANALYSE
       ↓
    IDENTIFY PROBLEMS
       ↓
    TAKE ACTION
       ↓
    IMPROVE OPERATIONS

The key principle is:

> **Every workflow should represent a real operational activity and create useful information for the people responsible for running the mine.**

These workflows will provide the foundation for the next document:

**06 — Operational Problems**

which will identify the specific operational difficulties SmartMine is intended to address.
    
---

# End of User Workflows
