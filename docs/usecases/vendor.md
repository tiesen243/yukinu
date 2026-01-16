---
title: 4.5. Vendor Management Use Cases
description: This document outlines the use cases for managing vendors, from application to status updates.
---

## Get All Vendors

Retrieves a paginated list of all vendors, with options for searching and filtering by status.

### Pre-condition

- The requesting user must have administrative privileges.

### Post-condition

- A paginated list of vendors is returned.
- Pagination details are included.

### Actors

- **Main actor**: Admin.
- **Secondary actor**: System.

### Basic flow

| Admin                                                                            | System                                                                |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 1. Submits a request with optional search terms, status filters, and pagination. |                                                                       |
|                                                                                  | 2. Fetches the list of vendors and the total count from the database. |
|                                                                                  | 3. Calculates the total number of pages.                              |
|                                                                                  | 4. Returns the list of vendors and pagination information.            |

---

## Get a Single Vendor

Retrieves detailed information for a single vendor by their ID.

### Pre-condition

- The vendor must exist.

### Post-condition

- The details of the specified vendor are returned.

### Actors

- **Main actor**: Admin/User.
- **Secondary actor**: System.

### Basic flow

| Actor                                    | System                                          |
| ---------------------------------------- | ----------------------------------------------- |
| 1. Requests a vendor by their unique ID. |                                                 |
|                                          | 2. Fetches the vendor's data from the database. |
|                                          | 3. Returns the vendor's information.            |

### Exception

**2.1. Vendor not found:**

1. The system returns a "Not Found" error.

---

## Create Vendor (Apply for a Vendor Account)

Allows a user to apply to become a vendor.

### Pre-condition

- The user must be authenticated.
- The user must not already own a vendor account or have a pending application.

### Post-condition

- A new vendor record is created with a `pending` status.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                                                   | System                                                            |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1. Submits their vendor application details (name, description, etc.). |                                                                   |
|                                                                        | 2. Verifies that the user does not already have a vendor account. |
|                                                                        | 3. Creates a new vendor record with a `pending` status.           |
|                                                                        | 4. Returns the ID of the newly created vendor application.        |

### Exception

**2.1. User already has a vendor account or pending application:**

1. The system returns a "Conflict" error.

---

## Update Vendor Status

Allows an admin to approve, suspend, or re-approve a vendor.

### Pre-condition

- The requesting user must be an admin.
- The vendor must exist.
- The status transition must be valid (e.g., `pending` to `approved`, `approved` to `suspended`).

### Post-condition

- The vendor's status is updated.
- If approved, the owner's role is updated to `vendor_owner`.
- If suspended, the owner's role is reverted to `user`.

### Actors

- **Main actor**: Admin.
- **Secondary actor**: System.

### Basic flow

| Admin                                                | System                                               |
| ---------------------------------------------------- | ---------------------------------------------------- |
| 1. Submits the vendor ID and the new desired status. |                                                      |
|                                                      | 2. Verifies that the vendor exists and has an owner. |
|                                                      | 3. Validates the status transition.                  |
|                                                      | 4. Updates the vendor's status.                      |
|                                                      | 5. Updates the vendor owner's role accordingly.      |
|                                                      | 6. Returns a success confirmation.                   |

### Exceptions

**2.1. Vendor not found:**

1. The system returns a "Not Found" error.

**2.2. Vendor has no owner:**

1. The system returns an "Internal Server Error".

**3.1. Invalid status transition:**

1. The system returns a "Bad Request" error.

---

## Update Vendor Information

Allows a vendor owner or admin to update a vendor's details.

### Pre-condition

- The user must have permission to update the vendor.
- The vendor must exist.

### Post-condition

- The vendor's information is updated in the database.

### Actors

- **Main actor**: Admin/Vendor Owner.
- **Secondary actor**: System.

### Basic flow

| Actor                                          | System                                        |
| ---------------------------------------------- | --------------------------------------------- |
| 1. Submits the vendor ID and the updated data. |                                               |
|                                                | 2. Verifies that the vendor exists.           |
|                                                | 3. Updates the vendor record in the database. |
|                                                | 4. Returns a success confirmation.            |

### Exception

**2.1. Vendor not found:**

1. The system returns a "Not Found" error.
