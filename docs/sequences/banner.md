---
title: 5.13. Banner Management Sequence Diagrams
description: This document provides sequence diagrams for use cases related to managing promotional banners.
---

## View All Banners

```mermaid
sequenceDiagram
    participant "Any User/System" as User
    participant System

    User->>System: 1. Request the list of all banners
    System->>System: 2. Fetch all banner records from the database
    System-->>User: 3. Return the complete list of banners
end
```

## Create a New Banner

```mermaid
sequenceDiagram
    participant Admin
    participant System

    Admin->>System: 1. Submit details for a new banner (title, image URL, link)
    System->>System: 2. Create a new banner record in the database
    System-->>Admin: 3. Confirm creation and return the new banner's ID
end
```

## Delete a Banner

```mermaid
sequenceDiagram
    participant Admin
    participant System

    Admin->>System: 1. Submit request to delete a banner by its ID
    System->>System: 2. Find and delete the specified banner from the database
    System-->>Admin: 3. Confirm deletion and return the deleted banner's ID
end
```
