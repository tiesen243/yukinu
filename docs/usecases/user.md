---
title: 4.2. User Management Use Cases
description: This document outlines the use cases related to managing user accounts, including retrieving, updating, and deleting users, as well as managing their profiles.
---

## Get All Users

Retrieves a paginated list of all users, with options for searching and filtering by role.

### Pre-condition

- The requesting user must have administrative privileges.

### Post-condition

- A paginated list of users is returned, matching the search and filter criteria.
- Pagination details (total pages, current page) are included in the response.

### Actors

- **Main actor**: Admin.
- **Secondary actor**: System.

### Basic flow

| Admin                                                                                     | System                                                              |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1. Submits a request with optional search terms, role filters, and pagination parameters. |                                                                     |
|                                                                                           | 2. Constructs a query based on the provided filters.                |
|                                                                                           | 3. Fetches the list of users and the total count from the database. |
|                                                                                           | 4. Calculates the total number of pages.                            |
|                                                                                           | 5. Returns the list of users along with pagination information.     |

---

## Get a Single User

Retrieves detailed information for a single user by their ID.

### Pre-condition

- The requesting user has permission to view user details.

### Post-condition

- The full details of the specified user are returned.

### Actors

- **Main actor**: Admin/Moderator.
- **Secondary actor**: System.

### Basic flow

| Admin/Moderator                        | System                                        |
| -------------------------------------- | --------------------------------------------- |
| 1. Requests a user by their unique ID. |                                               |
|                                        | 2. Fetches the user's data from the database. |
|                                        | 3. Returns the user's information.            |

### Exception

**2.1. User not found:**

1. The system returns a "Not Found" error.

---

## Update User

Updates a user's role or status.

### Pre-condition

- The requesting user must be an admin.
- The target user must not have a critical role (e.g., `admin`, `super_admin`).
- An admin cannot update their own role or status.

### Post-condition

- The user's role or status is updated in the database.

### Actors

- **Main actor**: Admin.
- **Secondary actor**: System.

### Basic flow

| Admin                                              | System                                                           |
| -------------------------------------------------- | ---------------------------------------------------------------- |
| 1. Submits the user ID and the new role or status. |                                                                  |
|                                                    | 2. Verifies that the requesting admin is not updating themself.  |
|                                                    | 3. Verifies that the target user does not have a protected role. |
|                                                    | 4. Updates the user's record in the database.                    |
|                                                    | 5. Returns a success confirmation.                               |

### Exceptions

**2.1. Admin attempts to update their own account:**

1. The system returns a "Bad Request" error.

**3.1. Target user has a critical role:**

1. The system returns a "Forbidden" error.

---

## Delete User (Soft Delete)

Temporarily deactivates a user's account by marking it as deleted.

### Pre-condition

- The requesting user must be an admin.
- The target user must not have a critical role.
- An admin cannot delete their own account.

### Post-condition

- The user's `deletedAt` field is set to the current timestamp.

### Actors

- **Main actor**: Admin.
- **Secondary actor**: System.

### Basic flow

| Admin                                        | System                                                           |
| -------------------------------------------- | ---------------------------------------------------------------- |
| 1. Submits the ID of the user to be deleted. |                                                                  |
|                                              | 2. Verifies that the admin is not deleting themself.             |
|                                              | 3. Verifies that the target user does not have a protected role. |
|                                              | 4. Checks if the user is already deleted.                        |
|                                              | 5. Sets the `deletedAt` timestamp for the user.                  |
|                                              | 6. Returns a success confirmation.                               |

### Exceptions

**2.1. Admin attempts to delete their own account:**

1. The system returns a "Bad Request" error.

**3.1. Target user has a critical role:**

1. The system returns a "Forbidden" error.

**4.1. User is already deleted:**

1. The system returns a "Bad Request" error.

---

## Restore User

Reactivates a user's account that was previously soft-deleted.

### Pre-condition

- The requesting user must be an admin.
- The target user's account must be soft-deleted.

### Post-condition

- The user's `deletedAt` field is set to `null`.

### Actors

- **Main actor**: Admin.
- **Secondary actor**: System.

### Basic flow

| Admin                                         | System                                                           |
| --------------------------------------------- | ---------------------------------------------------------------- |
| 1. Submits the ID of the user to be restored. |                                                                  |
|                                               | 2. Verifies that the admin is not restoring themself.            |
|                                               | 3. Verifies that the target user is currently marked as deleted. |
|                                               | 4. Sets the user's `deletedAt` field to `null`.                  |
|                                               | 5. Returns a success confirmation.                               |

### Exceptions

**2.1. Admin attempts to restore their own account:**

1. The system returns a "Bad Request" error.

**3.1. User is not deleted:**

1. The system returns a "Bad Request" error.

---

## Permanently Delete User

Permanently removes a user's account and associated data from the system.

### Pre-condition

- The requesting user must be an admin.
- The user's account must be soft-deleted first.
- The target user must not have a critical role.

### Post-condition

- The user's record is permanently deleted from the database.
- The user's avatar and banner images are deleted from the file storage.

### Actors

- **Main actor**: Admin.
- **Secondary actor**: System.

### Basic flow

| Admin                                                    | System                                                           |
| -------------------------------------------------------- | ---------------------------------------------------------------- |
| 1. Submits the ID of the user to be permanently deleted. |                                                                  |
|                                                          | 2. Verifies that the user has been soft-deleted.                 |
|                                                          | 3. Verifies that the target user does not have a protected role. |
|                                                          | 4. Deletes the user record from the database.                    |
|                                                          | 5. Deletes the user's avatar and banner from storage.            |
|                                                          | 6. Returns a success confirmation.                               |

### Exceptions

**2.1. User is not soft-deleted:**

1. The system returns a "Bad Request" error.

**3.1. Target user has a critical role:**

1. The system returns a "Forbidden" error.

---

## Get User Profile

Retrieves the public profile of a user.

### Pre-condition

- The user must exist.

### Post-condition

- The user's profile information is returned.

### Actors

- **Main actor**: Any User.
- **Secondary actor**: System.

### Basic flow

| User                              | System                                                 |
| --------------------------------- | ------------------------------------------------------ |
| 1. Requests a user profile by ID. |                                                        |
|                                   | 2. Fetches the user and their associated profile data. |
|                                   | 3. Returns the combined profile information.           |

### Exception

**2.1. User not found:**

1. The system returns a "Not Found" error.

---

## Update User Profile

Allows a user to update their own profile information, including avatar and banner images.

### Pre-condition

- The user must be authenticated.
- The user can only update their own profile.

### Post-condition

- The user's profile data is updated in the database.
- If new images are uploaded, the old ones are deleted from storage.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                                          | System                                                                |
| ------------------------------------------------------------- | --------------------------------------------------------------------- |
| 1. Submits their updated profile data (e.g., full name, bio). |                                                                       |
| 2. Optionally includes new avatar or banner images.           |                                                                       |
|                                                               | 3. The system updates the profile record in the database.             |
|                                                               | 4. If an avatar was updated, the system updates the user's image URL. |
|                                                               | 5. If old images were replaced, the system deletes them from storage. |
|                                                               | 6. Returns a success confirmation.                                    |

### Exception

**3.1. User not found:**

1. The system returns a "Not Found" error.

---

## Update User

Updates a user's role or status.

### Pre-condition

- The requesting user must be an admin.
- The target user must not have a critical role (e.g., `admin`, `super_admin`).
- An admin cannot update their own role or status.

### Post-condition

- The user's role or status is updated in the database.

### Actors

- **Main actor**: Admin.
- **Secondary actor**: System.

### Basic flow

| Admin                                              | System                                                           |
| -------------------------------------------------- | ---------------------------------------------------------------- |
| 1. Submits the user ID and the new role or status. |                                                                  |
|                                                    | 2. Verifies that the requesting admin is not updating themself.  |
|                                                    | 3. Verifies that the target user does not have a protected role. |
|                                                    | 4. Updates the user's record in the database.                    |
|                                                    | 5. Returns a success confirmation.                               |

### Exceptions

**2.1. Admin attempts to update their own account:**

1. The system returns a "Bad Request" error.

**3.1. Target user has a critical role:**

1. The system returns a "Forbidden" error.

---

## Delete User (Soft Delete)

Temporarily deactivates a user's account by marking it as deleted.

### Pre-condition

- The requesting user must be an admin.
- The target user must not have a critical role.
- An admin cannot delete their own account.

### Post-condition

- The user's `deletedAt` field is set to the current timestamp.

### Actors

- **Main actor**: Admin.
- **Secondary actor**: System.

### Basic flow

| Admin                                        | System                                                           |
| -------------------------------------------- | ---------------------------------------------------------------- |
| 1. Submits the ID of the user to be deleted. |                                                                  |
|                                              | 2. Verifies that the admin is not deleting themself.             |
|                                              | 3. Verifies that the target user does not have a protected role. |
|                                              | 4. Checks if the user is already deleted.                        |
|                                              | 5. Sets the `deletedAt` timestamp for the user.                  |
|                                              | 6. Returns a success confirmation.                               |

### Exceptions

**2.1. Admin attempts to delete their own account:**

1. The system returns a "Bad Request" error.

**3.1. Target user has a critical role:**

1. The system returns a "Forbidden" error.

**4.1. User is already deleted:**

1. The system returns a "Bad Request" error.

---

## Restore User

Reactivates a user's account that was previously soft-deleted.

### Pre-condition

- The requesting user must be an admin.
- The target user's account must be soft-deleted.

### Post-condition

- The user's `deletedAt` field is set to `null`.

### Actors

- **Main actor**: Admin.
- **Secondary actor**: System.

### Basic flow

| Admin                                         | System                                                           |
| --------------------------------------------- | ---------------------------------------------------------------- |
| 1. Submits the ID of the user to be restored. |                                                                  |
|                                               | 2. Verifies that the admin is not restoring themself.            |
|                                               | 3. Verifies that the target user is currently marked as deleted. |
|                                               | 4. Sets the user's `deletedAt` field to `null`.                  |
|                                               | 5. Returns a success confirmation.                               |

### Exceptions

**2.1. Admin attempts to restore their own account:**

1. The system returns a "Bad Request" error.

**3.1. User is not deleted:**

1. The system returns a "Bad Request" error.

---

## Permanently Delete User

Permanently removes a user's account and associated data from the system.

### Pre-condition

- The requesting user must be an admin.
- The user's account must be soft-deleted first.
- The target user must not have a critical role.

### Post-condition

- The user's record is permanently deleted from the database.
- The user's avatar and banner images are deleted from the file storage.

### Actors

- **Main actor**: Admin.
- **Secondary actor**: System.

### Basic flow

| Admin                                                    | System                                                           |
| -------------------------------------------------------- | ---------------------------------------------------------------- |
| 1. Submits the ID of the user to be permanently deleted. |                                                                  |
|                                                          | 2. Verifies that the user has been soft-deleted.                 |
|                                                          | 3. Verifies that the target user does not have a protected role. |
|                                                          | 4. Deletes the user record from the database.                    |
|                                                          | 5. Deletes the user's avatar and banner from storage.            |
|                                                          | 6. Returns a success confirmation.                               |

### Exceptions

**2.1. User is not soft-deleted:**

1. The system returns a "Bad Request" error.

**3.1. Target user has a critical role:**

1. The system returns a "Forbidden" error.

---

## Get User Profile

Retrieves the public profile of a user.

### Pre-condition

- The user must exist.

### Post-condition

- The user's profile information is returned.

### Actors

- **Main actor**: Any User.
- **Secondary actor**: System.

### Basic flow

| User                              | System                                                 |
| --------------------------------- | ------------------------------------------------------ |
| 1. Requests a user profile by ID. |                                                        |
|                                   | 2. Fetches the user and their associated profile data. |
|                                   | 3. Returns the combined profile information.           |

### Exception

**2.1. User not found:**

1. The system returns a "Not Found" error.

---

## Update User Profile

Allows a user to update their own profile information, including avatar and banner images.

### Pre-condition

- The user must be authenticated.
- The user can only update their own profile.

### Post-condition

- The user's profile data is updated in the database.
- If new images are uploaded, the old ones are deleted from storage.

### Actors

- **Main actor**: User.
- **Secondary actor**: System.

### Basic flow

| User                                                          | System                                                                |
| ------------------------------------------------------------- | --------------------------------------------------------------------- | --- |
| 1. Submits their updated profile data (e.g., full name, bio). |                                                                       |
|                                                               | 2. Optionally includes new avatar or banner images.                   |     |
|                                                               | 3. The system updates the profile record in the database.             |
|                                                               | 4. If an avatar was updated, the system updates the user's image URL. |
|                                                               | 5. If old images were replaced, the system deletes them from storage. |
|                                                               | 6. Returns a success confirmation.                                    |

### Exception

**3.1. User not found:**

1. The system returns a "Not Found" error.
