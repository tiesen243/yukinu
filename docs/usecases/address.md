---
title: 4.04. Address Management Use Cases
description: This document outlines the use cases for managing user addresses, including creating, retrieving, updating, and deleting them.
parent: 4. Use Cases
---

## Get All Addresses

Retrieves a list of all addresses associated with the currently authenticated user.

### Pre-condition

- The user must be authenticated.

### Post-condition

- A list of the user's addresses is returned.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                     | System                                                              |
| ---------------------------------------- | ------------------------------------------------------------------- |
| 1. Requests to view all their addresses. |                                                                     |
|                                          | 2. Fetches all addresses linked to the user's ID from the database. |
|                                          | 3. Returns the list of addresses.                                   |

---

## Get a Single Address

Retrieves the details of a specific address by its ID.

### Pre-condition

- The user must be authenticated.
- The requested address must exist and belong to the user.

### Post-condition

- The details of the specified address are returned.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                     | System                                                       |
| ---------------------------------------- | ------------------------------------------------------------ |
| 1. Requests an address by its unique ID. |                                                              |
|                                          | 2. Fetches the address from the database.                    |
|                                          | 3. Verifies that the address belongs to the requesting user. |
|                                          | 4. Returns the address details.                              |

### Exceptions

**2.1. Address not found:**

1. The system returns a "Not Found" error.

**3.1. User does not have permission:**

1. The system returns a "Forbidden" error.

---

## Create Address

Adds a new address to the user's account.

### Pre-condition

- The user must be authenticated.

### Post-condition

- A new address record is created in the database and linked to the user.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                                                          | System                                                                                       |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1. Submits the details for the new address (e.g., street, city, postal code). |                                                                                              |
|                                                                               | 2. Creates a new address record in the database with the provided details and the user's ID. |
|                                                                               | 3. Returns the ID of the newly created address.                                              |

---

## Update Address

Updates the details of an existing address.

### Pre-condition

- The user must be authenticated.
- The address to be updated must exist and belong to the user.

### Post-condition

- The address information is updated in the database.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                               | System                                                       |
| -------------------------------------------------- | ------------------------------------------------------------ |
| 1. Submits the address ID and the updated details. |                                                              |
|                                                    | 2. Verifies that the address exists and belongs to the user. |
|                                                    | 3. Updates the address record in the database.               |
|                                                    | 4. Returns a success confirmation.                           |

### Exceptions

**2.1. Address not found or does not belong to user:**

1. The system returns a "Not Found" or "Forbidden" error.

---

## Delete Address

Removes an address from the user's account.

### Pre-condition

- The user must be authenticated.
- The address to be deleted must exist and belong to the user.

### Post-condition

- The address is permanently deleted from the database.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                            | System                                                       |
| ----------------------------------------------- | ------------------------------------------------------------ |
| 1. Submits the ID of the address to be deleted. |                                                              |
|                                                 | 2. Verifies that the address exists and belongs to the user. |
|                                                 | 3. Deletes the address record from the database.             |
|                                                 | 4. Returns a success confirmation.                           |

### Exceptions

**2.1. Address not found or does not belong to user:**

1. The system returns a "Not Found" or "Forbidden" error.
