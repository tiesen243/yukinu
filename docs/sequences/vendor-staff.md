---
title: 5.6. Vendor Staff Management Sequence Diagrams
description: This document provides sequence diagrams for use cases related to managing vendor staff.
---

## Get All Staff

```mermaid
sequenceDiagram
    participant "Vendor Owner" as User
    participant System

    User->>System: 1. Request to view all staff for their vendor
    System->>System: 2. Fetch all users associated with the vendor as staff
    System-->>User: 3. Return the list of staff members
end
```

## Invite Staff

```mermaid
sequenceDiagram
    participant "Vendor Owner" as User
    participant System

    User->>System: 1. Submit email of user to invite
    System->>System: 2. Verify user exists and has 'user' role
    alt User not found
        System-->>User: "Not Found" error
    else User cannot be added
        System-->>User: "Bad Request" error
    end
    System->>System: 3. Verify user is not already a staff member
    alt User is already staff
        System-->>User: "Bad Request" error
    end
    System->>System: 4. Generate unique invitation token (valid for 7 days)
    System->>System: 5. Send invitation email to the user
    System-->>User: 6. Return success confirmation
end
```

## Accept Staff Invitation

```mermaid
sequenceDiagram
    participant User
    participant System

    User->>System: 1. Clicks invitation link, submitting the token
    System->>System: 2. Verify token is valid, belongs to user, and not expired
    alt Invalid or expired token
        System->>System: Delete token
        System-->>User: "Forbidden" error
    end
    System->>System: 3. Identify vendor from the token
    alt Vendor not found
        System-->>User: "Not Found" error
    end
    System->>System: 4. Update user's role to 'vendor_staff'
    System->>System: 5. Add user to the vendor's staff list
    System->>System: 6. Delete the used invitation token
    System-->>User: 7. Return success confirmation
end
```

## Remove Staff

```mermaid
sequenceDiagram
    participant "Vendor Owner" as User
    participant System

    User->>System: 1. Submit user ID of staff member to remove
    System->>System: 2. Verify staff member exists within the vendor
    alt Staff member not found
        System-->>User: "Not Found" error
    end
    System->>System: 3. Update the user's role back to 'user'
    System->>System: 4. Remove the user from the vendor's staff list
    System-->>User: 5. Return success confirmation
end
```
