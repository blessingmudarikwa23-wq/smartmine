# 04 — Target Users

## SmartMine
### Digital Operations Intelligence for Small-Scale Mining

**Document:** Target Users  
**Version:** 1.0  
**Status:** Foundation Document  
**Research Context:** Zimbabwe  
**Primary Sector:** Small-Scale Mining  

---

## 1. Purpose of This Document

This document defines the primary users and user groups that SmartMine is designed to serve.

SmartMine is intended primarily for small-scale mining operations in Zimbabwe where operational activities may involve extraction, material movement, crushing, grinding, processing, recovery, production, equipment management, fuel, maintenance, workforce, inventory, safety, expenses and sales.

The purpose of identifying target users is to ensure that SmartMine is designed around real operational responsibilities rather than generic software roles.

---

## 2. Primary Target Market

SmartMine's primary target market is:

> **Small-scale mining operations in Zimbabwe.**

The platform is particularly focused on operations that need better visibility across their daily mining and processing activities but may not have access to complex enterprise mining systems.

Typical characteristics may include:

- Small or medium operational teams
- Multiple mining activities
- Heavy reliance on manual records
- Limited digital systems
- Mobile-first working environments
- Equipment-intensive operations
- Crushing and grinding activities
- Mineral processing and recovery
- Need for better production visibility
- Limited operational reporting

SmartMine should remain practical and affordable for this environment.

---

## 3. User Groups

The core SmartMine user groups are:

1. Mine Owner
2. Site Manager
3. Mine Supervisor
4. Equipment Operator
5. Crusher Operator
6. Grinding Mill Operator
7. Processing Worker
8. General Worker
9. Store / Inventory Officer
10. Administrator

Not every mining operation will have all of these roles.

In smaller operations, one person may perform several responsibilities.

SmartMine should therefore support flexible role assignment.

---

## 4. Mine Owner

The mine owner is primarily interested in the overall performance and financial health of the operation.

Key questions may include:

- How much material was extracted?
- How much was processed?
- How much was produced?
- How is equipment performing?
- How much fuel was used?
- What are the major expenses?
- Which equipment is experiencing downtime?
- What maintenance is required?
- What is the overall operational trend?

The owner's primary need is:

> **A clear high-level view of the mine.**

SmartMine should provide the owner with dashboards, reports, alerts and operational summaries.

---

## 5. Site Manager

The site manager is responsible for coordinating the broader daily operation.

Responsibilities may include:

- Monitoring production
- Coordinating workers
- Monitoring equipment
- Reviewing fuel usage
- Monitoring maintenance
- Reviewing expenses
- Tracking operational problems
- Reviewing safety information
- Coordinating shifts

The site manager needs a more detailed operational view than the mine owner.

SmartMine should help the site manager understand:

> **What is happening across the site, where problems exist and what requires attention?**

---

## 6. Mine Supervisor

The mine supervisor works closer to the day-to-day operational activities.

Typical responsibilities may include:

- Supervising shifts
- Recording production
- Monitoring extraction
- Monitoring material movement
- Coordinating operators
- Checking equipment
- Reporting downtime
- Conducting operational checks
- Recording incidents or hazards

The supervisor requires fast and practical data entry.

SmartMine should allow supervisors to record information without navigating complicated workflows.

---

## 7. Equipment Operators

Equipment operators may work directly with machinery such as:

- Excavators
- Loaders
- Pumps
- Generators
- Vehicles
- Crushers
- Grinding mills

Their interaction with SmartMine should be simple.

They may need to record:

- Operating hours
- Equipment status
- Material processed
- Fuel usage
- Downtime
- Downtime reason
- Basic equipment observations

The design principle is:

> **Operators should record operational information quickly without needing extensive technical knowledge of the software.**

---

## 8. Crusher and Grinding Mill Operators

Crushing and grinding operators represent an important user group because their activities form a major part of the material-processing workflow.

They may record:

- Shift
- Equipment
- Operator
- Material received
- Material processed
- Input quantity
- Output quantity
- Operating hours
- Downtime
- Downtime reason
- Fuel or energy usage
- Notes

SmartMine should make these workflows fast and easy to use.

The interface should reflect the actual work being performed rather than forcing operators through generic business forms.

---

## 9. Processing Workers

Processing workers may be involved in mineral-processing and recovery activities.

Depending on the operation, they may record:

- Processing batch
- Material input
- Processing method
- Quantity processed
- Output
- Recovery measurements
- Mineral produced
- Shift
- Operator
- Notes

The system should allow processing workflows to remain configurable because different minerals and operations may use different processing methods.

SmartMine should record operational measurements without making unsupported geological or metallurgical claims.

---

## 10. General Workers

General workers may participate in:

- Extraction
- Material movement
- Stockpiling
- Processing
- Cleaning
- Site activities
- Supporting equipment operations

They may have limited direct interaction with the platform.

Where appropriate, SmartMine may record their:

- Shift
- Work area
- Activity
- Attendance
- Assignment

The interface should remain simple because not every worker needs access to the full SmartMine platform.

---

## 11. Store and Inventory Officer

The store or inventory officer is responsible for operational supplies and stock.

Items may include:

- Diesel
- Lubricants
- Belts
- Bearings
- Spare parts
- Tools
- PPE
- Processing consumables
- Maintenance materials

The user may need to record:

- Stock received
- Stock issued
- Stock used
- Current stock
- Minimum stock levels
- Supplier information
- Inventory adjustments

The key requirement is:

> **Maintain reliable visibility of resources required to keep the operation running.**

---

## 12. Administrator

The administrator supports the operational and digital management of SmartMine.

Responsibilities may include:

- User management
- Role management
- Basic configuration
- Operational settings
- Reference data
- System administration
- Access control
- Data management

The administrator should have appropriate permissions without automatically receiving unrestricted access to every operational function.

---

## 13. User Needs Across the Operation

Although users have different responsibilities, several needs are shared.

SmartMine should provide:

- Simple data entry
- Clear dashboards
- Mobile-friendly interfaces
- Relevant alerts
- Reliable records
- Easy reporting
- Search and filtering
- Historical information
- Role-appropriate access
- Minimal unnecessary complexity

The system should provide each user with the information relevant to their responsibilities.

---

## 14. Role-Based Access and User Experience

SmartMine should use role-based access.

Different users should see the functionality relevant to their responsibilities.

For example:

    Mine Owner
        ↓
    Dashboard / Reports / Financial Overview

    Site Manager
        ↓
    Operations / Equipment / Production / Costs

    Supervisor
        ↓
    Daily Operations / Production / Shifts

    Equipment Operator
        ↓
    Assigned Equipment / Usage / Downtime

    Store Officer
        ↓
    Inventory / Stock / Issues

    Administrator
        ↓
    Users / Roles / Configuration

The exact permission structure should be defined later in the security and functional requirements documentation.

The principle is:

> **Show users what they need, not everything the system can do.**

---

## 15. Target User Principle

SmartMine is ultimately designed around people working in real mining environments.

The product should therefore prioritize:

- Practicality
- Simplicity
- Speed
- Clarity
- Mobile accessibility
- Reliable operational records
- Role-specific information
- Minimal data-entry burden

The product should not assume that users are technology specialists.

The ultimate target-user principle is:

> **SmartMine should fit into the way a small-scale mining operation actually works, rather than forcing the operation to work like complicated software.**

The core relationship between users and the platform is:

    PEOPLE
       ↓
    DAILY ACTIVITIES
       ↓
    OPERATIONAL DATA
       ↓
    SMARTMINE
       ↓
    VISIBILITY
       ↓
    BETTER DECISIONS

This user-focused approach will guide the next documentation stages, particularly user workflows, operational problems, solution design and functional requirements.

---

# End of Target Users
