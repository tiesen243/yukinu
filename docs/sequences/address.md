---
title: 5.04. Address Management Sequence Diagrams
description: This document provides sequence diagrams for use cases related to managing user addresses.
---

## Get All Addresses

```mermaid
sequenceDiagram
    participant User
    participant System

    User->>System: 1. Request to view all addresses
    System->>System: 2. Fetch all addresses linked to the user's ID
    System-->>User: 3. Return the list of addresses
end
```

## Get a Single Address

```mermaid
sequenceDiagram
    participant User
    participant System

    User->>System: 1. Request address by its unique ID
    System->>System: 2. Fetch address from the database
    alt Address not found
        System-->>User: "Not Found" error
    end
    System->>System: 3. Verify that the address belongs to the user
    alt User does not have permission
        System-->>User: "Forbidden" error
    end
    System-->>User: 4. Return address details
end
```

## Create Address

```mermaid
sequenceDiagram
    participant User
    participant System

    User->>System: 1. Submit details for the new address
    System->>System: 2. Create a new address record linked to the user's ID
    System-->>User: 3. Return the ID of the newly created address
end
```

## Update Address

```mermaid
sequenceDiagram
    participant User
    participant System

    User->>System: 1. Submit address ID and updated details
    System->>System: 2. Verify address exists and belongs to the user
    alt Address not found or does not belong to user
        System-->>User: "Not Found" or "Forbidden" error
    end
    System->>System: 3. Update the address record in the database
    System-->>User: 4. Return a success confirmation
end
```

## Delete Address

```mermaid
sequenceDiagram
    participant User
    participant System

    User->>System: 1. Submit the ID of the address to be deleted
    System->>System: 2. Verify address exists and belongs to the user
    alt Address not found or does not belong to user
        System-->>User: "Not Found" or "Forbidden" error
    end
    System->>System: 3. Delete the address record from the database
    System-->>User: 4. Return a success confirmation
end
```
