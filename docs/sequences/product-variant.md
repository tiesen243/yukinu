---
title: 5.9. Product Variant Management Sequence Diagrams
description: This document provides sequence diagrams for use cases related to managing product variants.
---

## Recreate Product Variants

```mermaid
sequenceDiagram
    participant "Vendor Staff/Admin" as User
    participant System

    User->>System: 1. Submit request to recreate variants with product ID and new variant list
    System->>System: 2. Verify product exists and belongs to the user's vendor
    alt Product not found
        System-->>User: "NOT_FOUND" error
    end
    System->>System: 3. Delete all existing variants for the product
    System->>System: 4. Create new variants and options from the provided list
    System-->>User: 5. Confirm recreation and return product ID
end
```

## Update a Product Variant

```mermaid
sequenceDiagram
    participant "Vendor Staff/Admin" as User
    participant System

    User->>System: 1. Submit request to update a variant with variant ID and new data
    System->>System: 2. Verify variant exists and belongs to the user's vendor
    alt Variant not found
        System-->>User: "NOT_FOUND" error
    end
    System->>System: 3. Update the variant's details in the database
    System-->>User: 4. Confirm update and return variant ID
end
```

## Delete a Product Variant

```mermaid
sequenceDiagram
    participant "Vendor Staff/Admin" as User
    participant System

    User->>System: 1. Submit request to delete a variant by its ID
    System->>System: 2. Verify variant exists and belongs to the user's vendor
    alt Variant not found
        System-->>User: "NOT_FOUND" error
    end
    System->>System: 3. Delete the variant from the database
    System-->>User: 4. Confirm deletion and return the deleted variant's ID
end
```
