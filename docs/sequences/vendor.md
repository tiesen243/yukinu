---
title: 5.05. Vendor Management Sequence Diagrams
description: This document provides sequence diagrams for use cases related to managing vendors.
---

## Get All Vendors

```mermaid
sequenceDiagram
    participant Admin
    participant System

    Admin->>System: 1. Request vendor list with filters/pagination
    System->>System: 2. Fetch vendors and total count
    System->>System: 3. Calculate total pages
    System-->>Admin: 4. Return vendor list and pagination info
end
```

## Get a Single Vendor

```mermaid
sequenceDiagram
    participant "Admin/User" as User
    participant System

    User->>System: 1. Request vendor by unique ID
    System->>System: 2. Fetch vendor data from the database
    alt Vendor not found
        System-->>User: "Not Found" error
    end
    System-->>User: 3. Return vendor information
end
```

## Create Vendor (Apply for a Vendor Account)

```mermaid
sequenceDiagram
    participant User
    participant System

    User->>System: 1. Submit vendor application details
    System->>System: 2. Verify user does not already have a vendor account
    alt User already has a vendor account
        System-->>User: "Conflict" error
    end
    System->>System: 3. Create new vendor record with 'pending' status
    System-->>User: 4. Return ID of the new vendor application
end
```

## Update Vendor Status

```mermaid
sequenceDiagram
    participant Admin
    participant System

    Admin->>System: 1. Submit vendor ID and new status
    System->>System: 2. Verify vendor exists and has an owner
    alt Vendor not found
        System-->>Admin: "Not Found" error
    else Vendor has no owner
        System-->>Admin: "Internal Server Error"
    end
    System->>System: 3. Validate the status transition
    alt Invalid status transition
        System-->>Admin: "Bad Request" error
    end
    System->>System: 4. Update the vendor's status
    System->>System: 5. Update the vendor owner's role accordingly
    System-->>Admin: 6. Return success confirmation
end
```

## Update Vendor Information

```mermaid
sequenceDiagram
    participant "Admin/Vendor Owner" as User
    participant System

    User->>System: 1. Submit vendor ID and updated data
    System->>System: 2. Verify that the vendor exists
    alt Vendor not found
        System-->>User: "Not Found" error
    end
    System->>System: 3. Update the vendor record in the database
    System-->>User: 4. Return a success confirmation
end
```
